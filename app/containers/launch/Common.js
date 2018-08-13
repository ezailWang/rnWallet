
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

//将字符串中的多个空格缩减为一个空格
function resetStringBlank(str){
    var regEx = /\s+/g;
    var newStr = str.replace(regEx,' ');
    return newStr;
}

module.exports = {upsetArrayOrder,resetStringBlank}