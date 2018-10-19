import React, { Component } from 'react';
import { View,StyleSheet,DeviceEventEmitter} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
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
    },
    choseItemContent:{
    
    },
    
})

class ChoseLanguageScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isCheckZh:false,
            isCheckEn:false,
            isCheckKo:false,
            isCheckDe:false,
            isCheckEs:false,
            isCheckNl:false,
            isCheckFr:false,
            isCheckRu:false,
        }
        this.lang = '';
        this.langStr = '';

        this.monetaryUnitType = ''
        this.monetaryUnitSymbol = ''
    }

    _initData(){
        this.lang = I18n.locale
        this._checkLanguage()
    }

    _checkState(isZh,isEn,isKo,isDe,isEs,isNl,isFr,isRu){
        this.setState({
            isCheckZh:isZh,
            isCheckEn:isEn,
            isCheckKo:isKo,
            isCheckDe:isDe,//德语
            isCheckEs:isEs,//西班牙语
            isCheckNl:isNl,//荷兰语
            isCheckFr:isFr,//法语
            isCheckRu:isRu,//俄语
        }) 
    }

    _checkLanguage(){
        if(this.lang == 'zh'){
            this.langStr = '简体中文'
            this._checkState(true,false,false,false,false,false,false,false)

            this.monetaryUnitType = 'CNY'
            this.monetaryUnitSymbol = '¥'
        }else if(this.lang == 'en'){
            this.langStr = 'English'
            this._checkState(false,true,false,false,false,false,false,false)

            this.monetaryUnitType = 'USD'
            this.monetaryUnitSymbol = '$'
        }else if(this.lang == 'ko'){
            this.langStr = '한국어'
            this._checkState(false,false,true,false,false,false,false,false)

            this.monetaryUnitType = 'KRW'
            this.monetaryUnitSymbol = '₩'
        }else if(this.lang == 'de'){
            this.langStr = 'Deutsch'
            this._checkState(false,false,false,true,false,false,false,false)

            this.monetaryUnitType = 'EUR'
            this.monetaryUnitSymbol = '€'
        }else if(this.lang == 'es'){
            this.langStr = 'Español'
            this._checkState(false,false,false,false,true,false,false,false)

            this.monetaryUnitType = 'EUR'
            this.monetaryUnitSymbol = '€'
        }else if(this.lang == 'nl'){
            this.langStr = 'Nederlands'
            this._checkState(false,false,false,false,false,true,false,false)

            this.monetaryUnitType = 'EUR'
            this.monetaryUnitSymbol = '€'
        }else if(this.lang == 'fr'){
            this.langStr = 'Français'
            this._checkState(false,false,false,false,false,false,true,false)

            this.monetaryUnitType = 'EUR'
            this.monetaryUnitSymbol = '€'
        }else if(this.lang == 'ru'){
            this.langStr = 'Русский язык'
            this._checkState(false,false,false,false,false,false,false,true)

            this.monetaryUnitType = 'RUB'
            this.monetaryUnitSymbol = '₽'
        }
    }

    _onPressZh(){
        this.lang = 'zh'
        this._saveLanguage() 
    }
    _onPressEn(){
        this.lang = 'en';
        this._saveLanguage()
    }
    _onPressKo(){
        this.lang = 'ko'
        this._saveLanguage()
    }
    _onPressDe(){
        this.lang = 'de'
        this._saveLanguage()
    }
    _onPressEs(){
        this.lang = 'es'
        this._saveLanguage()
    }
    _onPressNl(){
        this.lang = 'nl'
        this._saveLanguage()
    }
    _onPressFr(){
        this.lang = 'fr'
        this._saveLanguage()
    }
    _onPressRu(){
        this.lang = 'ru'
        this._saveLanguage()
    }

    async _saveLanguage(){
        I18n.locale = this.lang
        this._checkLanguage()

        let langObject = {
            lang: this.lang,
            langStr: this.langStr,
        }
        StorageManage.save(StorageKey.Language, langObject)
        let monetaryObject = {
            monetaryUnitType: this.monetaryUnitType,
            symbol:this.monetaryUnitSymbol
        }
        this.props.setMonetaryUnit(monetaryObject)
        StorageManage.save(StorageKey.MonetaryUnit, monetaryObject)
        DeviceEventEmitter.emit('monetaryUnitChange', {monetaryUnit: monetaryObject});


        this.props.navigation.state.params.callback({language: langObject,monetaryUnit:monetaryObject});
        this.props.navigation.goBack()
    }
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.multi_language')}/>
                <View style={styles.contentBox}>
                     <ChoseItem content={'简体中文'} isCheck={this.state.isCheckZh} itemPress= {()=> this._onPressZh()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'English'} isCheck={this.state.isCheckEn} itemPress= {()=> this._onPressEn()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'한국어'} isCheck={this.state.isCheckKo} itemPress= {()=> this._onPressKo()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'Deutsch'} isCheck={this.state.isCheckDe} itemPress= {()=> this._onPressDe()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'Español'} isCheck={this.state.isCheckEs} itemPress= {()=> this._onPressEs()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>    
                     <ChoseItem content={'Français'} isCheck={this.state.isCheckFr} itemPress= {()=> this._onPressFr()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'Pусский'} isCheck={this.state.isCheckRu} itemPress= {()=> this._onPressRu()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>                               
                     <ChoseItem content={'Nederlands'} isCheck={this.state.isCheckNl} itemPress= {()=> this._onPressNl()}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                </View>
                
            </View>    
        );
    }
}

const mapStateToProps = state => ({
    monetaryUnit:state.Core.monetaryUnit,
});
const mapDispatchToProps = dispatch => ({
    setMonetaryUnit: (monetaryUnit) => dispatch(Actions.setMonetaryUnit(monetaryUnit)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChoseLanguageScreen)




