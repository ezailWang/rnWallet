import RNFS from 'react-native-fs'
import path from 'path-browserify'
import { StorageKey } from '../config/GlobalConfig'
import { store } from '../config/store/ConfigureStore'
import keythereum from 'keythereum'

const rootPath = RNFS.DocumentDirectoryPath;
export default class keystoreUtils {
    static async exportToFile(keyObject, dirName) {
        try {
            var outfile, outpath, json, dirPath
            dirName = dirName || "keystore";
            outfile = this.generateKeystoreFilename(keyObject.address);
            json = JSON.stringify(keyObject);
            dirPath = path.join(rootPath, dirName);
            outpath = path.join(rootPath, dirName, outfile);
            const exists = await RNFS.exists(dirPath)
            if (!exists) {
                await RNFS.mkdir(dirPath)
            }
            console.log('outpath:', outpath)
            return RNFS.writeFile(outpath, json, "utf8")
        } catch (err) {
            console.log('exportToFileErr:', err)
        }
    }

    static async importFromFile(address, dirName) {
        try {
            var dirPath, dirItems, filepath
            address = address.replace("0x", "");
            address = address.toLowerCase();
            dirName = dirName || "keystore"
            dirPath = path.join(rootPath, dirName);
            dirItems = await RNFS.readDir(dirPath)
            filepath = this.findKeyfile(dirPath, address, dirItems)
            console.log('filepath', filepath)
            return RNFS.readFile(filepath, "utf8")
        } catch (err) {
            console.log('importFromFileErr:', err)
        }
    }

    static findKeyfile(dirPath, address, files) {
        var i, len, filepath = null;
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
        var filename = "UTC--" + new Date().toISOString() + "--" + address;
        filename = filename.split(":").join("-");
        return filename;
    }

    static async getPrivateKey(password) {
        const { walletAddress } = store.getState().Core
        var keyStoreStr = await keystoreUtils.importFromFile(walletAddress)
        console.log("keyStoreStr", keyStoreStr);
        var keyStoreObject = JSON.parse(keyStoreStr)
        return await keythereum.recover(password, keyStoreObject);
    }
}