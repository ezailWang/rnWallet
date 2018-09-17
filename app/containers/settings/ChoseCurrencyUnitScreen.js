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

export default class ChoseCurrencyUnitScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isCheckEth:false,
            isCheckItc:false,
        }  
    }

    _initData(){
    }

    _onPressEth = () =>{
        this.setState({
            isCheckEth:true,
            isCheckItc:false,
        })  
    }
    _onPressItc = () =>{
        this.setState({
            isCheckEth:false,
            isCheckItc:true,
        }) 
    }
   
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.currency_unit')}/>
                <View style={styles.contentBox}>
                     <ChoseItem content={'ETH'} isCheck={this.state.isCheckEth} itemPress= {this._onPressEth} 
                                choseItemContentStyle={styles.choseItemContent}></ChoseItem>
                     <ChoseItem content={'ITC'} isCheck={this.state.isCheckItc} itemPress= {this._onPressItc}
                                choseItemContentStyle={styles.choseItemContent}
                                isShowLine={false}></ChoseItem>
                </View>
                
            </View>    
        );
    }
}



