import Storage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

var defaultExpires = null
var size = 1000
var storage = new Storage({
    size: size,//数据上限
    storageBackend: AsyncStorage,
    defaultExpires: defaultExpires,//过期时间
    enableCache: true,//是否缓存
    sync: null//同步方法
})

global.storage = storage

export default class StorageManage {

   
    /**
     * 存储
     * 
     * @param  key 读取key值对应的数据 必传 唯一标识
     * @param  data 存储的数据 type: string || object
     * @param  id   非必传 标识
     */
    static save(key,data,id) {
        //let value = JSON.stringify(data)
        if(id){
            storage.save({
                key: key,
                id:id,
                data: data,
                expires: defaultExpires
            })
        }else{
            storage.save({
                key: key,
                data: data,
                expires: defaultExpires
            })
        }
        
    }

    /**
     * 根据key或者key-id得到存储的数据
     * 
     * @param key 必传
     * @param id  可不传 
     */
    static async load(key,id) {
        var ret;
        if(id){
            try {
                ret = await storage.load({
                    key: key,
                    id: id,
                    autoSync: false,
                    syncInBackground: false,
                })
            } catch (err) {
                console.log(err.message)
                ret = null
            }
        }else{
            try {
                //JSON.parse(ret)
                ret = await storage.load({
                    key: key,
                    autoSync: false,
                    syncInBackground: false,
                })
            } catch (err) {
                console.log(err.message)
                ret = null
            }
        }
        return ret;
    }


    //获取key下的所有数据(仅key-id数据)
    static async loadAllDataForKey(key){
        var ret;
        try{
            ret = await storage.getAllDataForKey(key);
        }catch(err){
            console.log(err.message)
            ret = null
        }
        return ret;
    }


    //获取key下的所有id(仅key-id数据)
    static async loadIdsForKey(key){
        var ids;
        try{
            ids = await storage.getIdsForKey(key);
        }catch(err){
            console.log(err.message)
            ids = null
        }
        return ids;
    }

    /**
     * 删除单个数据
     * @param key 删除key所对应的数据,必传
     * @param id  删除id对应的数据，若删除的数据中有id,则必传
     */
    static remove(key,id) {
        if(id){
            return storage.remove({
                key: key,
                id: id
            })
        }else{
            return storage.remove({
                key: key
            })
        }  
    }

    //清空某个key下的所有数据(仅key-id数据)
    static clearMapForkey(key){
        storage.clearMapForKey(key);
    }

    //清空所有map,移除所有key-id数据（但会保留只有key的数据）
    static clearMaps(){
        storage.clearMap();
    }

}