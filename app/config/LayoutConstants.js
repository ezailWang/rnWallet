
import {Dimensions,Platform} from 'react-native'

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

function getNavigationHeight() {
    if (isIphoneX()){
        return 88;
    }
    return 64;
}

const layoutConstants = {

    WINDOW_WIDTH: width,
    WINDOW_HEIGHT: height,
    DEVICE_IS_IPHONE_X:isIphoneX,
    NAVIGATION_HEIGHT:getNavigationHeight,

    BASE_COLOR: 'rgb(30,174,245)',

    DEFAULT_IAMGE: require('../containers/home/component/image/imageTest.png'),
    //Home

    //HeadView
    HOME_HEADER_HEIGHT: 320,
    HOME_HEADER_LADDER_HEIGHT: 70,
    INFURA_API_KEY: '8e55b014a45b47b29fcd1bb492ab503a',
    ETHERSCAN_API_KEY: 'YYIRIVJPD4G5U4HPKAFF344XMFMQJIY69D',

}

export default layoutConstants
