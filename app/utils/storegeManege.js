import Storage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

var defaultExpires = null
var size = 1000
var storage = new Storage({
    size: size,//数据上限
    storegeBackend: AsyncStorage,
    defaultExpires: defaultExpires,//过期时间
    enableCache: true,//是否缓存
    sync: null//同步方法
})

global.storage = storage

export default class storageManege {

    /**
     * 
     * @param {保存的key值} key 
     *  注意:请不要在key中使用_下划线符号!
     * @param {保存的value} object 
     */
    static save(key, object) {
        storage.save({
            key: key,
            data: object,
            expires: defaultExpires
        })
    }

    /**
     * 
     * @param {通过key值删除数据} key 
     */
    static remove(key) {
        return storage.remove({
            key: key
        })
    }

    /**
     * 清除本地数据
     */
    static removeAll() {
        storage.clearMap()
    }

    /**
     * 
     * @param {读取key值对应的数据} key 
     */
    static async load(key) {
        var ret
        try {
            ret = await storage.load({
                key: key,
                autoSync: false,
                syncInBackground: false,
            })
        } catch (err) {
            console.warn(err.message)
            ret = null
        }
        return ret
    }
}