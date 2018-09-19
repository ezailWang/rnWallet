
import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window');
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

// screen
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) ||
            (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))
    )
}

function isAndroid() {
    return (
        Platform.OS === 'android'
    )
}

function getNavigationHeight() {
    if (isIphoneX()) {
        return 88;
    }
    return 64;
}

const layoutConstants = {

    WINDOW_WIDTH: width,
    WINDOW_HEIGHT: height,
    DEVICE_IS_IPHONE_X: isIphoneX,
    NAVIGATION_HEIGHT: getNavigationHeight,
    DEVICE_IS_ANDROID: isAndroid,

    DEFAULT_IAMGE: require('../assets/home/null.png'),

    HOME_HEADER_MIN_HEIGHT: getNavigationHeight(),
    HOME_HEADER_MAX_HEIGHT: 260,
    HOME_HEADER_LADDER_HEIGHT: 80,
    HOME_HEADER_CONTENT_HEIGHT: 320,

    //交易记录页面
    TRANSFER_HEADER_MIN_HEIGHT: getNavigationHeight(),
    TRANSFER_HEADER_MAX_HEIGHT: width * 0.58,

    HOME_DRAWER_WIDTH:255,
    
    INFURA_API_KEY: '8e55b014a45b47b29fcd1bb492ab503a',
    ETHERSCAN_API_KEY: 'YYIRIVJPD4G5U4HPKAFF344XMFMQJIY69D',

}

export default layoutConstants
