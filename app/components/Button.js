
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors} from '../config/GlobalConfig'
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
    backItem:{
        width:20,
        height:20
    },
    normalBtn:{
        width:Layout.WINDOW_WIDTH*0.85,
        height:44,
        borderRadius:22,
        borderWidth:2,
        justifyContent:"center"
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
        borderWidth:2,
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
    }
});


class BackButton extends Component {

    static propTypes = {
        onPress: PropTypes.func.isRequired,
    };

    render() {

        let backItemStyle = {marginTop:30};

        if (Layout.DEVICE_IS_IPHONE_X()){
            backItemStyle= {marginTop:40};
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
                              onPress = { this.props.onPress }>
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
}