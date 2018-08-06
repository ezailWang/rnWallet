

RandomColor= ()=>{

    return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
};

const Colors={
    RandomColor:RandomColor,
    //字体颜色
    fontBlackColor:'#2C2C2C',
    fontDarkColor:'#000',
    fontGrayColor:'#E6E6E6',
    fontDarkGrayColor:'#959595',
    fontWhiteColor:'#FFFFFF',
    fontBlueColor:'#1BA2E8',
    //主题颜色
    themeColor:'#1BA2E8',
    //控制器视图背景色
    backgroundColor:'#F7F8F9',
    //黑色半透明色
    blackOpacityColor:'rgba(38,38,38,0.6)'
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