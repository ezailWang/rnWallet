import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Text,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import {BlueButtonBig} from '../../components/Button'
import {Colors} from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import {validateEmail} from '../../utils/commonUtil'
import {CommonTextInput} from '../../components/TextInputComponent'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    keyboardAwareScrollView: {
        alignSelf: 'stretch',
        alignItems:'center',
        paddingTop:40,
    },
    contentBox:{
        alignSelf:'center',
        justifyContent:'center',
        width:Layout.WINDOW_WIDTH*0.9,
    },
    text:{
        color:Colors.fontBlackColor,
        fontSize:13,
        marginBottom:3,
    },
    textInput:{
        marginBottom:12,
    },
    desTextInput:{
        height:160,
        paddingTop:10,
        marginBottom:10,
        textAlign:'left',
        textAlignVertical:'top',
    },
    button:{
        marginTop:40,
    }
})

export default class FeedbackScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isDisabled:true,
        }

        this.name = '';
        this.email = '';
        this.description = '';
    }

    _initData() { 

    }

    btnIsEnableClick(){
        if (this.name == ''|| this.email == '' || this.description == '') {
            if(!this.state.isDisabled){
                this.setState({
                    isDisabled: true
                })
            }
         }else{
             if(this.state.isDisabled){
                this.setState({
                    isDisabled: false
                })
             }   
        }
    }
    
   

    nameOnChangeText = (text) => {
        this.name = text;
        this.btnIsEnableClick()
    };
    emailOnChangeText = (text) => {
        this.email = text;
        this.btnIsEnableClick()
    };
    descriptionOnChangeText = (text) => {
        this.description = text;
        this.btnIsEnableClick()
    };

    async submit(){
        Keyboard.dismiss();
        if(!validateEmail(this.email)){
            showToast(I18n.t('toast.email_format_incorrect'));
            return;
        }
    }
    
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.feedback')}/>
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                                         keyboardShouldPersistTaps='handled'
                                         behavior="padding">
                <View style={styles.contentBox}>
                    <Text style={styles.text}>{I18n.t('settings.nickname')}</Text>
                    <CommonTextInput
                         textInputStyle = {styles.textInput}
                         onChangeText={this.nameOnChangeText}/>

                    <Text style={styles.text}>{I18n.t('settings.contact_email')}</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         onChangeText={this.emailOnChangeText}
                         keyboardType={'email-address'}/>

                    <Text style={styles.text}>{I18n.t('settings.problem_description')}</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.desTextInput}
                         returnKeyType={"done"}
                         onChangeText={this.descriptionOnChangeText}
                         multiline={true}/>          
                    
                    <BlueButtonBig
                        buttonStyle = {styles.button}
                        isDisabled = {this.state.isDisabled}
                        onPress = {()=> this.submit()}
                        text = {I18n.t('settings.submit')}
                    />   
                </View>
                </KeyboardAvoidingView>    
            </View>    
        );
    }
}


