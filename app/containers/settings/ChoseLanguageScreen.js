import React, { Component } from 'react';
import { View,StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import {Colors,FontSize,StorageKey} from '../../config/GlobalConfig'
import StorageManage from '../../utils/StorageManage'
import {showToast} from '../../utils/Toast';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import {ChoseItem}  from '../../components/ChoseComponent'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    contentBox:{
        flex:1,
        marginTop:15,
    }
    
})

export default class ChoseLanguageScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isCheckZh:false,
            isCheckEn:false,
            isCheckKo:false,
        }
        this.lang = '';
    }

    _initData(){
        this.lang = I18n.locale
        if(this.lang == 'zh'){
            this.setState({
                isCheckZh:true,
                isCheckEn:false,
                isCheckKo:false,
            })
        }else if(this.lang == 'en'){
            this.setState({
                isCheckZh:false,
                isCheckEn:true,
                isCheckKo:false,
            })
        }else if(this.lang == 'ko'){
            this.setState({
                isCheckZh:false,
                isCheckEn:false,
                isCheckKo:true,
            })
        }
    }

    _onPressZh(){
        this.lang = 'zh'
        this.setState({
            isCheckZh:true,
            isCheckEn:false,
            isCheckKo:false,
        }) 
        this._saveLanguage() 
    }
    _onPressEn(){
        this.lang = 'en';
        this.setState({
            isCheckZh:false,
            isCheckEn:true,
            isCheckKo:false,
        }) 
        this._saveLanguage()
    }
    _onPressKo(){
        this.lang = 'ko'
        this.setState({
            isCheckZh:false,
            isCheckEn:false,
            isCheckKo:true,
        }) 
        this._saveLanguage()
    }

    _saveLanguage(){
        I18n.locale = this.lang
        let langStr;
        if(this.lang == 'zh'){
            langStr = '简体中文'
        }else if(this.lang == 'en'){
            langStr = 'English'
        }else if(this.lang == 'ko'){
            langStr = '한국어'
        }else{
            langStr = 'English'
        }
        let object = {
            lang: this.lang,
            langStr: langStr,
        }
        StorageManage.save(StorageKey.Language, object)
       // var loadRet = await StorageManage.load(StorageKey.Language)
       // console.log('L_contact',loadRet)
        this.props.navigation.state.params.callback({language: object});
        this.props.navigation.goBack()
    }
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.multi_language')}/>
                <View style={styles.contentBox}>
                     <ChoseItem content={'简体中文'} isCheck={this.state.isCheckZh} itemPress= {()=> this._onPressZh()}></ChoseItem>
                     <ChoseItem content={'English'} isCheck={this.state.isCheckEn} itemPress= {()=> this._onPressEn()}></ChoseItem>
                     <ChoseItem content={'한국어'} isCheck={this.state.isCheckKo} itemPress= {()=> this._onPressKo()}></ChoseItem>
                </View>
                
            </View>    
        );
    }
}




