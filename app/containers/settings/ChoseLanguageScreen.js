import React, { Component } from 'react';
import { View,StyleSheet} from 'react-native';
import {Colors,FontSize} from '../../config/GlobalConfig'
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
        
    }

    _initData(){
    }

    _onPressZh = () =>{
        this.setState({
            isCheckZh:true,
            isCheckEn:false,
            isCheckKo:false,
        })  
    }
    _onPressEn = () =>{
        this.setState({
            isCheckZh:false,
            isCheckEn:true,
            isCheckKo:false,
        }) 
    }
    _onPressKo = () =>{
        this.setState({
            isCheckZh:false,
            isCheckEn:false,
            isCheckKo:true,
        }) 
    }
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.multi_language')}/>
                <View style={styles.contentBox}>
                     <ChoseItem content={'简体中文'} isCheck={this.state.isCheckZh} itemPress= {this._onPressZh}></ChoseItem>
                     <ChoseItem content={'English'} isCheck={this.state.isCheckEn} itemPress= {this._onPressEn}></ChoseItem>
                     <ChoseItem content={'한국어'} isCheck={this.state.isCheckKo} itemPress= {this._onPressKo}></ChoseItem>
                </View>
                
            </View>    
        );
    }
}



