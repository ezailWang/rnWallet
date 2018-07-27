
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const layoutConstants = {

     WINDOW_WIDTH: width,
     WINDOW_HEIGHT: height,
     
     BASE_COLOR:'rgb(30,174,245)',

     DEFAULT_IAMGE:require('../containers/app/Home/component/image/imageTest.png'),
    //Home

    //HeadView
     HOME_HEADER_HEIGHT: 320,
     HOME_HEADER_LADDER_HEIGHT:70,

}

export default layoutConstants
