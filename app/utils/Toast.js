import Toast from 'react-native-root-toast';

function showToast(message){
    let toast = Toast.show(message, {
        visible:true,
        duration: Toast.durations.SHORT,//显示时间
        position: Toast.positions.BOTTOM,//吐司的位置显示在屏幕上（负数表示距离屏幕底部的距离。正数表示距屏幕顶部的距离.0将吐司定位到屏幕中间。）
        shadow: true,//Toast元素周围投下阴影
        animation: true,//动画
        backgroundColor:'black',//背景颜色
        textColor:'white',//字体颜色
        hideOnPress: false,//通过按下吐司来隐藏出现的吐司。
        delay: 0,//吐司开始前的延迟时间出现在屏幕上
        onShow: () => {
            //Toast出现动画开始的回调
        },
        onShown: () => {
            //Toast出现动画结束的回调
        },
        onHide: () => {
            //Toast的隐藏动画开始的回调
        },
        onHidden: () => {
            //Toast的隐藏动画结束的回调
        }
    });

    //手动隐藏动画
    //Toast.hide(toast);
}


module.exports = {showToast}