

RandomColor = () => {

    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
};

const Colors = {
    RandomColor: RandomColor,
    //字体颜色
    fontBlackColor: '#424242',
    fontDarkColor: '#000',
    fontGrayColor: '#ECECEC',
    fontDarkGrayColor: '#959595',
    fontWhiteColor: '#FFFFFF',
    fontBlueColor: '#00a0e9',
    fontGreenColor: '#1bc94b',
    fontRedColor: '#e62624',
    fontGrayColor_a0: '#a0a0a0',
    fontGrayColor_a1: '#a1a1a1',
    fontBlackColor_31: '#313131',
    fontBlackColor_43: '#434343',
    //警告框颜色
    RedColor: '#ff3636',
    //主题颜色
    themeColor: '#00a0e9',
    //控制器视图背景色
    backgroundColor: '#f8f8f8',
    //黑色半透明色
    blackOpacityColor: 'rgba(149,149,149,0.7)',
    //透明色
    clearColor: 'rgba(255,255,255,0.0)',
    //灰色背景
    bgGrayColor:'#F8F8F8',
    bgGrayColor_ed:'#ededed',
    //白底
    whiteBackgroundColor:"#FFFFFF",
    bgColor_e:'#eee',
    bgBlue_9a:'#9ACEF2',





    borderColor_e:'#eee',


};

const TransferType = {
    ETH: "ETH",
    ITC: "ITC"
};

const TransferGasLimit = {
    ethGasLimit: 25200,
    tokenGasLimit: 60000
};

const FontSize = {
    HeaderSize: 18,
    ContentSize: 14,
    TitleSize: 16,
    DetailTitleSize: 14,
    alertTitleSize: 13,
    BtnFontSize: 18,
}

const StorageKey = {
    User:'user',
    Tokens:'tokens'
}

module.exports = {
    Colors,
    FontSize,
    TransferType,
    TransferGasLimit,
    StorageKey,
};