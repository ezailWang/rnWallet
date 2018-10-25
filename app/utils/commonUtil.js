import { I18n } from '../config/language/i18n'


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

module.exports = {validateEmail,addressToName}