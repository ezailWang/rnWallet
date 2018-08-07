

RandomColor= ()=>{

    return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
};

const Colors={
    RandomColor:RandomColor,
    //字体颜色
    fontBlackColor:'#424242',
    fontDarkColor:'#000',
    fontGrayColor:'#aaaaaa',
    fontDarkGrayColor:'#959595',
    fontWhiteColor:'#FFFFFF',
    fontBlueColor:'#00a0e9',
    //警告框颜色
    RedColor:'#ff3636',
    //主题颜色
    themeColor:'#00a0e9',
    //控制器视图背景色
    backgroundColor:'#f8f8f8',
    //黑色半透明色
    blackOpacityColor:'rgba(38,38,38,0.6)',
    //透明色
    clearColor:'rgba(255,255,255,0.0)'
};

const TransferType={
    ETH:"ETH",
    ITC:"ITC"
};

const TransferGasLimit={
    ethGasLimit:25200,
    tokenGasLimit:60000
};

module.exports={
    Colors,
    TransferType,
    TransferGasLimit
};