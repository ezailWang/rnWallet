import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, WebView,TouchableOpacity,Image,Text} from 'react-native';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import { BlueButtonBig} from '../../components/Button'
import { Colors } from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
import AutoHeightWebView from 'react-native-autoheight-webview'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white'
    },
    webview:{
        flex:1,
        width:Layout.WINDOW_WIDTH,
    },
    checkBox:{
        flexDirection:'row',
        justifyContent:'center',
        width:Layout.WINDOW_WIDTH*0.8,
    },
    checkImage:{
        width:18,
        height:18,
        borderRadius:5,
        marginRight:8,
    },
    checkText:{
        width:Layout.WINDOW_WIDTH*0.8-26,
        color:Colors.fontBlueColor,
        fontSize:14,
    }
});

export default class ServiceAgreementScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isAgree:false
        }
    }

    isAgreePress() {
        this.setState({ isAgree: !this.state.isAgree });
    }
    agreeBtn(){
        this.props.navigation.state.params.callback({isShowPin: true});
        this.props.navigation.goBack()
    }
    renderComponent() {
        let checkIcon = this.state.isAgree ? require('../../assets/launch/check_on.png') : require('../../assets/launch/check_off.png');
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('launch.service_agreement')}/>
                <WebView
                     source={{uri:'http://47.75.16.97:9000/ServiceAgreement.html',method: 'GET'}}
                     startInLoadingState={true}
                     javaScriptEnabled={true}
                     style={styles.webview}
                     onLoad={() => { }}
                     onLoadEnd={() => { }}/>
                <TouchableOpacity style={styles.checkBox} activeOpacity={0.6} onPress={() => this.isAgreePress()}>
                      <Image style={styles.checkImage} source={checkIcon} resizeMode={'center'} ></Image>
                      <Text style={styles.checkText}>{I18n.t('launch.agree_service_agreement')}</Text>
                </TouchableOpacity>
                <BlueButtonBig
                      buttonStyle={{marginTop:10}}
                      isDisabled = {!this.state.isAgree}
                      onPress = {() => this.agreeBtn()}
                      text = {I18n.t('launch.agree_and_set_login_password')}
                />     
            </View>
        )
    }
}
