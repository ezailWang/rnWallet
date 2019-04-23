import RNFS from 'react-native-fs';
import path from 'path-browserify';
import keythereum from 'keythereum';
import fastCrypto from 'react-native-fast-crypto';
import createKeccakHash from 'keccak/js';

function keccak256(buffer) {
  return createKeccakHash('keccak256')
    .update(buffer)
    .digest();
}
const rootPath = RNFS.DocumentDirectoryPath;
export default class KeystoreUtils {
  static async exportToFile(keyObject, walletType, dirName) {
    try {
      dirName = dirName || 'keystore';
      const outfile = this.generateKeystoreFilename(walletType + keyObject.address);
      const json = JSON.stringify(keyObject);
      const dirPath = path.join(rootPath, dirName);
      const outpath = path.join(rootPath, dirName, outfile);
      const exists = await RNFS.exists(dirPath);
      if (!exists) {
        await RNFS.mkdir(dirPath);
      }
      return RNFS.writeFile(outpath, json, 'utf8');
    } catch (err) {
      console.log('exportToFileErr:', err);
      return null;
    }
  }

  static async importFromFile(address, walletType, dirName) {
    try {
      address = address.replace('0x', '');
      address = address.toLowerCase();
      dirName = dirName || 'keystore';
      const dirPath = path.join(rootPath, dirName);
      const dirItems = await RNFS.readDir(dirPath);
      let filepath = this.findKeyFile(dirPath, walletType + address, dirItems);
      if (filepath === null) {
        filepath = this.findKeyFile(dirPath, address, dirItems);
      }
      return RNFS.readFile(filepath, 'utf8');
    } catch (err) {
      console.log('importFromFileErr:', err);
      return null;
    }
  }

  static async removeKeyFile(address, walletType, dirName) {
    try {
      address = address.replace('0x', '');
      address = address.toLowerCase();
      dirName = dirName || 'keystore';
      const dirPath = path.join(rootPath, dirName);
      const dirItems = await RNFS.readDir(dirPath);
      const filepath = this.findKeyFile(dirPath, walletType + address, dirItems);
      RNFS.unlink(filepath);
    } catch (err) {
      console.log('removeKeyFile:', err);
    }
  }

  static findKeyFile(dirPath, address, files) {
    let i;

    let len;

    let filepath = null;
    for (i = 0, len = files.length; i < len; ++i) {
      if (files[i].name.indexOf(address) > -1) {
        filepath = path.join(dirPath, files[i].name);
        if (files[i].isDirectory()) {
          filepath = path.join(filepath, files[i].name);
        }
        break;
      }
    }
    return filepath;
  }

  static generateKeystoreFilename(address) {
    let filename = `UTC--${new Date().toISOString()}--${address}`;
    filename = filename.split(':').join('-');
    return filename;
  }

  static async getPrivateKey(password, address, walletType) {
    try {
      const keyStoreStr = await KeystoreUtils.importFromFile(address, walletType);
      const keyStoreObject = JSON.parse(keyStoreStr);
      const privateKey = await this.recover(password, keyStoreObject);
      return `0x${privateKey.toString('hex')}`;
    } catch (err) {
      console.log('getPrivateKey err:', err);
      return null;
    }
  }

  static async deriveKey(password, salt, options) {
    let prf;
    if (typeof password === 'undefined' || password === null || !salt) {
      throw new Error('Must provide password and salt to derive a key');
    }
    options = options || {};
    options.kdfparams = options.kdfparams || {};

    // convert strings to buffers
    password = keythereum.str2buf(password, 'utf8');
    salt = keythereum.str2buf(salt);

    // use scrypt as key derivation function
    if (options.kdf === 'scrypt') {
      return fastCrypto.scrypt(
        password,
        salt,
        options.kdfparams.n || keythereum.constants.scrypt.n,
        options.kdfparams.r || keythereum.constants.scrypt.r,
        options.kdfparams.p || keythereum.constants.scrypt.p,
        options.kdfparams.dklen || keythereum.constants.scrypt.dklen
      );
    }

    // use default key derivation function (PBKDF2)
    prf = options.kdfparams.prf || keythereum.constants.pbkdf2.prf;
    if (prf === 'hmac-sha256') prf = 'sha512';
    return fastCrypto.pbkdf2.deriveAsync(
      password,
      salt,
      options.kdfparams.c || keythereum.constants.pbkdf2.c,
      options.kdfparams.dklen || keythereum.constants.pbkdf2.dklen,
      prf
    );
  }

  static async dump(password, privateKey, salt, iv, options) {
    options = options || {};
    iv = keythereum.str2buf(iv);
    privateKey = keythereum.str2buf(privateKey);
    return keythereum.marshal(
      await this.deriveKey(password, salt, options),
      privateKey,
      salt,
      iv,
      options
    );
  }

  static async recover(password, keyObject) {
    const keyObjectCrypto = keyObject.Crypto || keyObject.crypto;

    // verify that message authentication codes match, then decrypt
    function verifyAndDecrypt(derivedKey, salt, iv, ciphertext, algo) {
      let key;
      if (keythereum.getMAC(derivedKey, ciphertext) !== keyObjectCrypto.mac) {
        throw new Error('message authentication code mismatch');
      }
      if (keyObject.version === '1') {
        key = keccak256(derivedKey.slice(0, 16)).slice(0, 16);
      } else {
        key = derivedKey.slice(0, 16);
      }
      return keythereum.decrypt(ciphertext, key, iv, algo);
    }

    const iv = keythereum.str2buf(keyObjectCrypto.cipherparams.iv);
    const salt = keythereum.str2buf(keyObjectCrypto.kdfparams.salt);
    const ciphertext = keythereum.str2buf(keyObjectCrypto.ciphertext);
    const algo = keyObjectCrypto.cipher;

    if (keyObjectCrypto.kdf === 'pbkdf2' && keyObjectCrypto.kdfparams.prf !== 'hmac-sha256') {
      throw new Error('PBKDF2 only supported with HMAC-SHA256');
    }
    return verifyAndDecrypt(
      await this.deriveKey(password, salt, keyObjectCrypto),
      salt,
      iv,
      ciphertext,
      algo
    );
  }
}
