
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const layoutConstants = {

    WINDOW_WIDTH: width,
    WINDOW_HEIGHT: height,

    BASE_COLOR: 'rgb(30,174,245)',

    DEFAULT_IAMGE: require('../containers/app/Home/component/image/imageTest.png'),
    //Home

    //HeadView
    HOME_HEADER_HEIGHT: 320,
    HOME_HEADER_LADDER_HEIGHT: 70,
    INFURA_API_KEY: '8e55b014a45b47b29fcd1bb492ab503a',
    ETHERSCAN_API_KEY: 'YYIRIVJPD4G5U4HPKAFF344XMFMQJIY69D',

}

export default layoutConstants
