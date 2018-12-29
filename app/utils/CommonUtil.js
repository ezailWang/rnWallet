import { I18n } from '../config/language/i18n'
import StorageManage from './StorageManage'
import NetworkManager from '../utils/NetworkManager'
import { StorageKey } from '../config/GlobalConfig'
import { store } from '../config/store/ConfigureStore'
import {
    DeviceEventEmitter,
} from 'react-native'

function addDefaultTokens(){
    //添加默认的eth,itc
    let tokenArray = [];
    let ethToken = {
        iconLarge: '',
        symbol: 'ETH',
        name: 'ethereum',
        decimal: 18,
        address: '',
    }
    let itcToken = {
        iconLarge: 'http://47.75.16.97:9000/images/token/0x5e6b6d9abad9093fdc861ea1600eba1b355cd940@3x.png',
        symbol: 'ITC',
        name: 'IoT Chain',
        decimal: 18,
        address: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',
    }
    tokenArray.push(ethToken)
    tokenArray.push(itcToken)
    let wallet = store.getState().Core.wallet
    StorageManage.save(StorageKey.Tokens+wallet.address, tokenArray)
}


function validateEmail(email) {
    var mailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (mailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}


function addressToName(address,contacts){
    let name = '';
    let length = contacts.length;
    for(let i=0;i<length;i++){
        if(contacts[i].address.toLowerCase() == address.toLowerCase()){
            name = contacts[i].name;
            break;
        }
    }
    return name;
}




//获取未度消息数
async function getMessageCount() {

    let userToken = await StorageManage.load(StorageKey.UserToken)
    if (!userToken || userToken === null) {
        return;
    }
    let params = {
        'userToken': userToken['userToken'],
    }
    NetworkManager.getUnReadMessageCount(params)
        .then(response => {
            if (response.code === 200) {
                let messageCount = response.data.account;
                DeviceEventEmitter.emit('messageCount', { messageCount: messageCount });
            } else {
                console.log('getMessageCountErr msg:', response.msg)
            }
        }).catch(err => {
            console.log('getMessageCountErr:', err)
        })
}






module.exports = {validateEmail,addressToName,addDefaultTokens,getMessageCount}