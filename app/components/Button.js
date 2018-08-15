
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text
}from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
    },
    backBtn:{
        marginLeft:12,
        width:20,
        height:20
    },
    headerRight:{
        marginRight:15,
        width:20,
        height:20
    },
    backItem:{
        width:20,
        height:20
    },
    normalBtn:{
        width:Layout.WINDOW_WIDTH*0.75,
        height:44,
        borderRadius:22,
        borderWidth:2,
        justifyContent:"center",
        marginTop:20
    },
    normalBtnTitle:{
        fontSize:17,
        fontWeight:"bold",
        textAlign:'center',
    },
    blueBtn:{
        backgroundColor:Colors.fontBlueColor,
        borderColor:Colors.fontBlueColor
    },
    blueBtnTitle:{
        color:Colors.fontWhiteColor
    },
    whiteBtn:{
        backgroundColor:Colors.fontWhiteColor,
        borderColor:Colors.fontWhiteColor
    },
    whiteBtnTitle:{
        color:Colors.fontBlueColor
    },
    clearBtn:{
        backgroundColor:Colors.clearColor,
        borderColor:Colors.fontWhiteColor
    },
    clearBtnTitle:{
        color:Colors.fontWhiteColor,
    },
    redBtn:{
        backgroundColor:Colors.ClearColor,
        borderColor:Colors.fontWhiteColor
    },
    normalMiddleBtn:{
        width:Layout.WINDOW_WIDTH*0.45,
        height:40,
        borderRadius:20,
        justifyContent:"center"
    },
    normalMiddleBtnTitle:{
        fontSize:15,
        textAlign:'center',
    },
    middleWhiteBtn:{
        borderWidth:1.5,
        borderColor:Colors.fontBlueColor,
        backgroundColor:Colors.fontWhiteColor
    },
    middleWhiteBtnTitle:{
        color:Colors.fontBlueColor
    },
    middleBlueBtnTitle:{
        color:Colors.fontWhiteColor
    },
    normalSmallBtn:{
        width:Layout.WINDOW_WIDTH*0.35,
        height:40,
        borderRadius:20,
        justifyContent:"center"
    },
    btnOpacity:{
        flexDirection:'row',
        height:56,
        alignSelf:'stretch',
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:20,
        paddingRight:20,
    },
    txt:{
        flex:1,
        backgroundColor: 'transparent',
        color:Colors.fontBlackColor,
        fontSize:FontSize.TitleSize,
        height:56,
        lineHeight:56,
        textAlign:'left',
    },
    icon:{
        width:10,
    },
    

    btnBox:{
        flexDirection:'row',
        height:48,
        width:Layout.WINDOW_WIDTH*0.75,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:20,
        paddingRight:16,
        borderRadius:26,  
    },
    rightBlueNextBtn:{
        backgroundColor:Colors.whiteBackgroundColor,
        borderWidth:2,
        borderColor:'#fff',
    },
    rightWhiteNextBtn:{
        backgroundColor:'transparent',
        borderWidth:2,
        borderColor:'#fff',
    },
    btnText:{
        flex:1,
        fontSize:FontSize.BtnFontSize,
        textAlign:'center',
        marginLeft:15,
        fontWeight:"bold",
    },
    rightBlueNextTxt:{
        color:Colors.fontBlueColor,
    },
    rightWhiteNextTxt:{
        color:Colors.fontWhiteColor,
    },
    nextIcon:{
        height:12,
        width:12,
    },
});


class BackButton extends Component {

    static propTypes = {
        onPress: PropTypes.func.isRequired,
    };

    render() {

        let backItemStyle = {marginTop:0};

        if (Layout.DEVICE_IS_IPHONE_X()){
            backItemStyle= {marginTop:0};
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.backBtn,backItemStyle]}
                                  onPress = {this.props.onPress}>
                    <Image style={styles.backItem}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back.png')}>
                    </Image>
                </TouchableOpacity>
            </View>
        )
    }
}

class BackWhiteButton extends Component {

    static propTypes = {
        onPress: PropTypes.func.isRequired,
    };

    render() {

        let backItemStyle = {marginTop:30};

        if (Layout.DEVICE_IS_IPHONE_X()){
            backItemStyle= {marginTop:50};
        }


        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.backBtn,backItemStyle]}
                                  onPress = {this.props.onPress}>
                    <Image style={styles.backItem}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back_white.png')}>
                    </Image>
                </TouchableOpacity>
            </View>
        )
    }
}


//透明按钮
class ClarityWhiteButtonBig extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalBtn,styles.clearBtn]}
                              onPress = { this.props.onPress }>
                <Text style={[styles.clearBtnTitle,styles.normalBtnTitle]}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

class BlueButtonBig extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalBtn,styles.blueBtn]}
                              onPress = { this.props.onPress }>
                <Text style={[styles.blueBtnTitle,styles.normalBtnTitle]}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

class WhiteButtonBig extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalBtn,styles.whiteBtn]}
                              onPress = {this.props.onPress}>
                <Text style={[styles.whiteBtnTitle,styles.normalBtnTitle]}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

class WhiteButtonMiddle extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalMiddleBtn,styles.middleWhiteBtn]}
                              onPress = { this.props.onPress }>
                <Text style={[styles.normalMiddleBtnTitle,styles.middleWhiteBtnTitle]}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}


class BlueButtonMiddle extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        return (
            <TouchableOpacity style={styles.normalMiddleBtn}
                              onPress = { this.props.onPress }>
                <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                                start={{x:0,y:1}}
                                end={{x:1,y:1}}
                                style={[styles.normalMiddleBtn,{flex:1}]}>
                    <Text style={[styles.middleBlueBtnTitle,styles.normalMiddleBtnTitle]}>{this.props.text}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

class WhiteButtonSmall extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalSmallBtn,styles.middleWhiteBtn]}
                              onPress = { this.props.onPress }>
                <Text style={[styles.normalMiddleBtnTitle,styles.middleWhiteBtnTitle]}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

class BlueButtonSmall extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };
    render() {
        let backItemStyle = {marginTop:30};

        if (Layout.DEVICE_IS_IPHONE_X()){
            backItemStyle= {marginTop:50};
        }
        return (
            <TouchableOpacity style={styles.normalSmallBtn}
                              onPress = { this.props.onPress }>
                <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                                start={{x:0,y:1}}
                                end={{x:1,y:1}}
                                style={[styles.normalSmallBtn,{flex:1}]}>
                    <Text style={[styles.middleBlueBtnTitle,styles.normalMiddleBtnTitle]}>{this.props.text}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

class NextButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        return (
            <TouchableOpacity style={[styles.btnOpacity]} activeOpacity={0.6} onPress = { this.props.onPress }>
                <Text style={styles.txt}>{this.props.text}</Text>
                <Image style={styles.icon} source={require('../assets/set/next.png')} resizeMode={'center'}/>
            </TouchableOpacity>
        )
    }
}

class HeaderButton extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        img: PropTypes.string,
    }
    render() {
        let backItemStyle = {marginTop:30};
        if (Layout.DEVICE_IS_IPHONE_X()){
            backItemStyle= {marginTop:50};
        }
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.headerRight,backItemStyle]}
                                  onPress = {this.props.onPress}>
                    <Image style={styles.backItem}
                           resizeMode={'center'}
                           source={this.props.img}>
                    </Image>
                </TouchableOpacity>
            </View>
        )
    }
}

//右边带有蓝色>的按钮，firstLaunch首页使用案例
class RightBlueNextButton extends Component{
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        return (
            <TouchableOpacity style={[styles.btnBox,styles.rightBlueNextBtn]} activeOpacity={0.6} onPress = { this.props.onPress }>
                <Text style={[styles.btnText,styles.rightBlueNextTxt]}>{this.props.text}</Text>
                <Image style={styles.nextIcon} source={require('../assets/common/backblue_icon.png')} resizeMode={'center'}/>
            </TouchableOpacity>
        )
    }
}

//右边带有白色>的按钮，firstLaunch首页使用案例
class RightWhiteNextButton extends Component{
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        return (
            <TouchableOpacity style={[styles.btnBox,styles.rightWhiteNextBtn]} activeOpacity={0.6} onPress = {this.props.onPress }>
                <Text style={[styles.btnText,styles.rightWhiteNextTxt]}>{this.props.text}</Text>
                <Image style={styles.nextIcon} source={require('../assets/common/backwhite_icon.png')} resizeMode={'center'}/>
            </TouchableOpacity>
        )
    }
}

export {
    BackButton,             //蓝色返回按钮
    BackWhiteButton,        //白色返回按钮
    BlueButtonBig,          //大号蓝色按钮
    ClarityWhiteButtonBig,  //大号透明白色按钮
    WhiteButtonBig,         //大号白色按钮
    WhiteButtonMiddle,      //中号白色按钮
    BlueButtonMiddle,       //中号蓝色按钮
    WhiteButtonSmall,       //小号白色按钮
    BlueButtonSmall,        //小号蓝色按钮
    NextButton,             //设置页面功能按钮
    HeaderButton,           //导航栏按钮
    RightBlueNextButton,    //右边带有蓝色>的按钮
    RightWhiteNextButton,   //右边带有白色>的按钮
}