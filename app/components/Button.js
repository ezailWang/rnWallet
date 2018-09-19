
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
        width:Layout.WINDOW_WIDTH*0.9,
        //alignSelf:'stretch',
        height:44,
        borderRadius:5,
        justifyContent:"center",
        marginTop:20
    },
    normalBtnGradient:{
        width:Layout.WINDOW_WIDTH*0.9,
        //alignSelf:'stretch',
        height:44,
        borderRadius:5,
        justifyContent:"center",
    },
    normalBtnTitle:{
        fontSize:17,
        fontWeight:"bold",
        textAlign:'center',
    },
    greyBtn:{
        backgroundColor:Colors.fontGrayColor_a0,
    },
    blueBtn:{
        backgroundColor:Colors.fontBlueColor,
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
        width:Layout.WINDOW_WIDTH*0.4,
        height:40,
        borderRadius:5,
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
        borderRadius:5,
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

    whiteBorderBtn:{
        backgroundColor:'transparent',
        borderWidth:2,
        borderColor:'#fff',
    },
    rightBlueNextTxt:{
        color:Colors.fontBlueColor,
    },
    whiteTxt:{
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
        isDisabled : PropTypes.bool,
        buttonStyle: PropTypes.object,
    };
    render() {
        return (
            //<TouchableOpacity style={[styles.normalBtn, this.props.isDisabled ? styles.greyBtn : styles.blueBtn,this.props.buttonStyle]}
            <TouchableOpacity style={[styles.normalBtn]}
                              activeOpacity={0.6}
                              disabled={this.props.isDisabled}
                              onPress = {this.props.onPress}>
                    <LinearGradient colors={this.props.isDisabled ? ['#a0a0a0', '#a0a0a0', '#a0a0a0'] : ['#66ceff', '#68ACFC', '#0094ff']}
                                start={{x:0,y:1}}
                                end={{x:1,y:1}}
                                style={[styles.normalBtnGradient,{flex:1}]}>
                            <Text style={[styles.blueBtnTitle,styles.normalBtnTitle]}>{this.props.text}</Text>
                    </LinearGradient>          
                
            </TouchableOpacity>
        )
    }
}

class WhiteButtonBig extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        buttonStyle: PropTypes.object,
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalBtn,styles.whiteBtn,this.props.buttonStyle]}
                              activeOpacity={0.6}
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
        image: PropTypes.any.isRequired
    };
    render() {
        return (
            <TouchableOpacity style={[styles.normalMiddleBtn,styles.middleWhiteBtn,{flexDirection:"row",alignItems:"center"}]}
                              onPress = { this.props.onPress }>
                <Image source={this.props.image} style={{marginRight:5,height:20,width:20}} resizeMode={'center'}/>
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
                <LinearGradient colors={['#66ceff', '#68ACFC', '#0094ff']}
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
                <LinearGradient colors={['#66ceff', '#68ACFC', '#0094ff']}
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




class WhiteBorderButton extends Component{
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        buttonStyle: PropTypes.object,
    }
    render() {
        return (
            <TouchableOpacity style={[styles.normalBtn,styles.whiteBorderBtn,this.props.buttonStyle]} 
                              activeOpacity={0.6} 
                              onPress = {this.props.onPress }>
                <Text style={[styles.normalBtnTitle,styles.whiteTxt]}>{this.props.text}</Text>
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
    WhiteBorderButton,      //白色边框、透明背景、白色字体
}