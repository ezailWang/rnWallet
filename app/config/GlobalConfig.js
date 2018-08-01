const colors={
    //字体颜色
    fontBlackColor:'#2C2C2C',
    fontGrayColor:'#E6E6E6',
    fontDarkGrayColor:'#959595',
    fontWhiteColor:'#FFFFFF',
    fontBlueColor:'#1BA2E8',
    //主题颜色
    themeColor:'#1BA2E8',
    //普通视图背景色
    backgroundColor:'#F7F8F9',
    //黑色半透明色
    blackOpacityColor:'rgba(38,38,38,0.6)'
};

const transferType={
    ETH:"ETH",
    ITC:"ITC"
};

const transferGasLimit={
    ethGasLimit:25200,
    tokenGasLimit:60000
};

module.exports={
    colors,
    transferType,
    transferGasLimit
};