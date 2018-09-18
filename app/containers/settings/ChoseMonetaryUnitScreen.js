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
        marginTop:15,
        backgroundColor:'white',
        paddingLeft:15,
        paddingRight:15,
    },
    choseItemContent:{
        paddingLeft:10,
        paddingRight:0,
    },
   
})
class ChoseMonetaryUnitScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isCheckCNY:false,
            isCheckUSD:false,
            isCheckKRW:false,
        }  
        this.monetaryUnitType = ''
        this.monetaryUnitStr = ''
        this.monetaryUnitSymbol = ''
    }

    _initData(){
        this.monetaryUnitType = this.props.monetaryUnit.monetaryUnitType
        console.log('L____money',this.props.monetaryUnit)
        this._checkMonetaryUnit()
    }

    _checkState(isCNY,isUSD,isKRW){
        this.setState({
            isCheckCNY:isCNY,
            isCheckUSD:isUSD,
            isCheckKRW:isKRW,
        }) 
    }

    _checkMonetaryUnit(){
        if(this.monetaryUnitType == 'CNY'){
            this.monetaryUnitStr = I18n.t('settings.renminbi')
            this.monetaryUnitSymbol = '¥'
            this._checkState(true,false,false)
        }else if(this.monetaryUnitType == 'USD'){
            this.monetaryUnitStr = I18n.t('settings.dollar')
            this.monetaryUnitSymbol = '$'
            this._checkState(false,true,false)
        }else if(this.monetaryUnitType == 'KRW'){
            this.monetaryUnitStr = I18n.t('settings.korean_currency')
            this.monetaryUnitSymbol = '₩'
            this._checkState(false,false,true)
        }
    }
    _onPressCNY = () =>{
        this.monetaryUnitType = 'CNY'
        this._saveMonetaryUnit()
    }
    _onPressUSD = () =>{
        this.monetaryUnitType = 'USD'
        this._saveMonetaryUnit()
    }

    _onPressKRW = () =>{
        this.monetaryUnitType = 'KRW'
        this._saveMonetaryUnit()
    }

    _saveMonetaryUnit(){
        this._checkMonetaryUnit()
        let object = {
            monetaryUnitType: this.monetaryUnitType,
            monetaryUnitStr: this.monetaryUnitStr,
            symbol:this.monetaryUnitSymbol
        }
        this.props.setMonetaryUnit(object)
        StorageManage.save(StorageKey.MonetaryUnit, object)
       // var loadRet = await StorageManage.load(StorageKey.MonetaryUnit)
       // console.log('L_contact',loadRet)
        
        DeviceEventEmitter.emit('monetaryUnitChange', {monetaryUnit: object});
        this.props.navigation.state.params.callback({monetaryUnit: object});
        this.props.navigation.goBack()
    }
   
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.currency_unit')}/>
                <View style={styles.contentBox}>
                     <ChoseItem content={'CNY'} isCheck={this.state.isCheckCNY} itemPress= {this._onPressCNY} 
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'USD'} isCheck={this.state.isCheckUSD} itemPress= {this._onPressUSD}
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'KRW'} isCheck={this.state.isCheckKRW} itemPress= {this._onPressKRW}
                                choseItemContentStyle={styles.choseItemContent}
                                isShowLine={false}></ChoseItem>           
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
export default connect(mapStateToProps, mapDispatchToProps)(ChoseMonetaryUnitScreen)



