import Storage from 'react-native-storage'
import {AsyncStorage} from 'react-native'

var storage = new Storage({
    size:1000,//数据上限
    storegeBackend:AsyncStorage,
    defaultExpires:null,//过期时间
    enableCache:true,//是否缓存
    sync:null//同步方法
})

global.storage = storage

