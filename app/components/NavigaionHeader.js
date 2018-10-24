import React, {Component,PureComponent} from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    Keyboard
}from 'react-native'

//import {StackNavigator} from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import {BackWhiteButton,BackButton, HeaderButton} from './Button'
import PropTypes from 'prop-types'
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'

const styles = StyleSheet.create({

    headerBgContainer:{
        flexDirection:'row',
        backgroundColor:Colors.whiteBackgroundColor, 
        zIndex:10, 
    },
    blackBgContainer:{
        flexDirection:'row',
        backgroundColor:'black',  
    },
    transparentBgContainer:{
        flexDirection:'row',
        backgroundColor:'transparent',  
    },
    icon:{
        height:25,
        width:25,
    },
    headerButtonBox:{
        height:40,
        width:40,
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:12,
        paddingRight:12,
    },
    headerTitleBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    headerTitle:{
        fontSize:FontSize.HeaderSize,
        color:Colors.fontDarkColor,
    },
    whiteTitle:{
        fontSize:FontSize.HeaderSize,
        color:'white',
    }
})


//白色返回按钮
class BlueHeader extends Component {
    //
    static propTypes = {
        navigation:PropTypes.object.isRequired
    };

    render() {

        let height = Layout.NAVIGATION_HEIGHT();

        return (
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={[{height:height}]}>
                <BackWhiteButton onPress={() => {this.props.navigation.goBack()}}/>
            </LinearGradient>
        )
    }
}

//Header {黑色背景 白色返回按钮 白色title}
class BlackBgHeader extends PureComponent {
    static propTypes = {
        navigation:PropTypes.object.isRequired,
        leftPress: PropTypes.func,
        text:PropTypes.string,
        rightPress: PropTypes.func,
        rightIcon:PropTypes.number,
    }

    render() {
        let height = Layout.NAVIGATION_HEIGHT();
        let contentMarginTop = {marginTop:24};
        if (Layout.DEVICE_IS_IPHONE_X()){
            contentMarginTop= {marginTop:48};
        }
        return (
            <View style={[styles.blackBgContainer,{height:height}]}>
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} 
                                  onPress = {() => {this.props.navigation.goBack()}}>
                    <Image style={styles.icon}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back_white.png')}>
                    </Image>
                </TouchableOpacity>  

                <View style={[styles.headerTitleBox,contentMarginTop]}>
                    <Text style={styles.whiteTitle}>
                        {this.props.text}
                    </Text>
                </View>    
                
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} onPress = {this.props.rightPress}>
                    <Image style={styles.icon}
                           resizeMode={'center'}
                           source={this.props.rightIcon}>
                    </Image>
                </TouchableOpacity>  
            </View>    
        )
    }
};


//Header {透明背景 白色返回按钮 白色title}
class TransparentBgHeader extends PureComponent {
    static propTypes = {
        navigation:PropTypes.object.isRequired,
        leftPress: PropTypes.func,
        text:PropTypes.string,
        rightPress: PropTypes.func,
        rightIcon:PropTypes.number,
    }

    render() {
        let height = Layout.NAVIGATION_HEIGHT();
        let contentMarginTop = {marginTop:24};
        if (Layout.DEVICE_IS_IPHONE_X()){
            contentMarginTop= {marginTop:48};
        }
        return (
            <View style={[styles.transparentBgContainer,{height:height}]}>
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} 
                                  onPress = {() => {this.props.navigation.goBack()}}>
                    <Image style={styles.icon}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back_white.png')}>
                    </Image>
                </TouchableOpacity>  

                <View style={[styles.headerTitleBox,contentMarginTop]}>
                    <Text style={styles.whiteTitle}>
                        {this.props.text}
                    </Text>
                </View>    
                
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} onPress = {this.props.rightPress}>
                    <Image style={styles.icon}
                           resizeMode={'center'}
                           source={this.props.rightIcon}>
                    </Image>
                </TouchableOpacity>  
            </View>    
        )
    }
};


//Header {白色背景 蓝色返回按钮 黑色title}
class WhiteBgHeader extends PureComponent {
    static propTypes = {
        navigation:PropTypes.object.isRequired,
        leftPress: PropTypes.func,
        text:PropTypes.string,
        rightPress: PropTypes.func,
        rightIcon:PropTypes.number,
    }

    render() {
        let height = Layout.NAVIGATION_HEIGHT();
        let contentMarginTop = {marginTop:24};
        if (Layout.DEVICE_IS_IPHONE_X()){
            contentMarginTop= {marginTop:48};
        }
        return (
            <View style={[styles.headerBgContainer,{height:height}]}>
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} 
                                  onPress = {() => {
                                      Keyboard.dismiss()
                                      this.props.navigation.goBack()}}>
                    <Image style={styles.icon}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back.png')}>
                    </Image>
                </TouchableOpacity>  

                <View style={[styles.headerTitleBox,contentMarginTop]}>
                    <Text style={styles.headerTitle}>
                        {this.props.text}
                    </Text>
                </View>    
                
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} onPress = {this.props.rightPress}>
                    <Image style={styles.icon}
                           resizeMode={'center'}
                           source={this.props.rightIcon}>
                    </Image>
                </TouchableOpacity>  
            </View>    
        )
    }
};

class WhiteBgNoTitleHeader extends Component {
    static propTypes = {
        navigation:PropTypes.object.isRequired,
        onPress:PropTypes.func,
    }

    render() {
        let height = Layout.NAVIGATION_HEIGHT();
        let contentMarginTop = {marginTop:24};
        if (Layout.DEVICE_IS_IPHONE_X()){
            contentMarginTop= {marginTop:48};
        }
        return (
            <View style={[styles.headerBgContainer,{height:height}]}>
                <TouchableOpacity style={[styles.headerButtonBox,contentMarginTop]} 
                                  onPress = {this.props.onPress == undefined ? () => {Keyboard.dismiss();this.props.navigation.goBack()} : this.props.onPress}>
                    <Image style={styles.icon}
                           //resizeMode={'contain'}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back.png')}>
                    </Image>
                </TouchableOpacity>  
            </View>    
        )
    }
};

export {
    BlueHeader,
    WhiteBgHeader,
    WhiteBgNoTitleHeader,
    BlackBgHeader,
    TransparentBgHeader
}