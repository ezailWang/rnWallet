import RFNS from 'react-native-fs'
import path from 'path-browserify'

const rootPath = RFNS.DocumentDirectoryPath;
export default class keystoreUtils {
    static async exportToFile(keyObject, dirName) {
        var outfile, outpath, json, dirPath
        dirName = dirName || "keystore";
        outfile = this.generateKeystoreFilename(keyObject.address);
        json = JSON.stringify(keyObject);
        dirPath = path.join(rootPath, dirName);
        outpath = path.join(rootPath, dirName, outfile);
        const exists = await RFNS.exists(dirPath)
        if (!exists) {
            await RFNS.mkdir(dirPath)
        }
        console.log('outpath:', outpath)
        return RFNS.writeFile(outpath, json, "utf8")
    }

    static async importFromFile(address, dirName) {
        var dirPath, dirItems, filepath
        address = address.replace("0x", "");
        address = address.toLowerCase();
        dirName = dirName || "keystore"
        dirPath = path.join(rootPath, dirName);
        dirItems = await RFNS.readDir(dirPath)
        filepath = this.findKeyfile(dirPath, address, dirItems)
        console.log('filepath', filepath)
        return RFNS.readFile(filepath, "utf8")
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
        if (process.platform === "win32") filename = filename.split(":").join("-");
        return filename;
    }

}