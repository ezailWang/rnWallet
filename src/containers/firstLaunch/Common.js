
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



module.exports = {upsetArrayOrder}