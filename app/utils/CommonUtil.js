import { I18n } from '../config/language/i18n'
import StorageManage from './StorageManage'
import { StorageKey } from '../config/GlobalConfig'
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
    StorageManage.save(StorageKey.Tokens, tokenArray)
}




module.exports = {validateEmail,addressToName,addDefaultTokens}