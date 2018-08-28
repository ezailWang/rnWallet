import React, {Component,PureComponent} from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    StatusBar
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
    },
    icon:{
        height:20,
        width:20,
    },
    headerButtonBox:{
        height:40,
        width:40,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:10,
        marginRight:10,
    },
    headerTitleBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    headerTitle:{
        fontSize:FontSize.HeaderSize,
        color:Colors.fontBlackColor,
    }
})


//返回按钮
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
                <BackWhiteButton onPress={() => {
                    this.props.navigation.goBack()
                }}/>
            </LinearGradient>
        )
    }
}

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
                                  onPress = {() => {this.props.navigation.goBack()}}>
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
                                  onPress = {() => {this.props.navigation.goBack()}}>
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
    WhiteBgNoTitleHeader
}