
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

//密码最少为8位，需包含大小写字母、数字、符号
function  vertifyPassword(pwd){
    //var regex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
    //var regex =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/
    var regex = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])).{8,20}$/
    if(regex.test(pwd)){
        return true;
    }
    return false;
}

module.exports = {upsetArrayOrder,stringTrim,resetStringBlank,vertifyPassword}