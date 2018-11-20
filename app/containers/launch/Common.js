
import { I18n } from '../../config/language/i18n'

//打乱数组的顺序
function upsetArrayOrder(array) {
    var len = array.length;
    for(var i=0;i<len;i++){
        var end = len - 1 ;
        var index = (Math.random()*(end + 1)) >> 0;
        var t = array[end];
        array[end] = array[index];
        array[index] = t;
    }
    return array;
};
//将字符串前后所有的空格去掉
function stringTrim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
//将字符串中的多个空格缩减为一个空格
function resetStringBlank(str){
    var regEx = /\s+/g;
    var newStr = str.replace(regEx,' ');
    return newStr;
}

//密码最少为8位，至少包含大小写字母、数字、符号中的2种
function  vertifyPassword(pwd){
    //var regex = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){8,20}$/;//大、小写字母、数字、符号中的2种
    //var regex = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/;//大小写字母、数字、符号中的2种
    //var regex = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])).{8,20}$/; //密码最少为8位，需包含大、小写字母、数字、符号
    
    var regUpper = /[A-Z]/;
    var regLower = /[a-z]/;
    var regNum = /[0-9]/;
    var regSymbol = /[^A-Za-z0-9]/;

    var warnContent = "";
    let iscontainUpper = regUpper.test(pwd) ? true : false;
    let iscontainLower = regLower.test(pwd) ? true : false;
    let iscontainNum = regNum.test(pwd) ? true : false;
    let iscontainSymbol = regSymbol.test(pwd) ? true : false;
   
    if(pwd.length < 8){
        warnContent = I18n.t('launch.password_warn_least_8') + matchFormat(iscontainUpper,iscontainLower,iscontainNum,iscontainSymbol)
    }else{
        warnContent = matchFormat(iscontainUpper,iscontainLower,iscontainNum,iscontainSymbol);
    }

    return warnContent;
}

function matchFormat(iscontainUpper,iscontainLower,iscontainNum,iscontainSymbol){
    if (iscontainUpper  &&  !iscontainLower  && !iscontainNum && !iscontainSymbol) {
        return I18n.t('launch.password_warn_1')
    }else if (!iscontainUpper  &&  iscontainLower  && !iscontainNum && !iscontainSymbol) {
        return I18n.t('launch.password_warn_2')
    }else if (!iscontainUpper  &&  !iscontainLower  && iscontainNum && !iscontainSymbol) {
        return I18n.t('launch.password_warn_3')
    }else if (!iscontainUpper  &&  !iscontainLower  && !iscontainNum && iscontainSymbol) {
        return I18n.t('launch.password_warn_4')
    }else if (iscontainUpper  &&  iscontainLower  &&  !iscontainNum && !iscontainSymbol) {
        return I18n.t('launch.password_warn_5')
    }else if (iscontainUpper  &&  !iscontainLower  && iscontainNum && !iscontainSymbol) {
        return I18n.t('launch.password_warn_6')
    }else if (iscontainUpper  &&  !iscontainLower  && !iscontainNum && iscontainSymbol) {
        return I18n.t('launch.password_warn_7')
    }else if (!iscontainUpper  &&  iscontainLower  && iscontainNum && !iscontainSymbol) {
        return I18n.t('launch.password_warn_8')
    }else if (!iscontainUpper  &&  iscontainLower  && !iscontainNum && iscontainSymbol) {
        return I18n.t('launch.password_warn_9')
    }else if (!iscontainUpper  &&  !iscontainLower  && iscontainNum && iscontainSymbol) {
        return I18n.t('launch.password_warn_10')
    }else {
        return ''
    }
}



module.exports = {upsetArrayOrder,stringTrim,resetStringBlank,vertifyPassword}