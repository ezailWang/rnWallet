import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Text,
    Keyboard
} from 'react-native';
import StorageManage from '../../utils/StorageManage'
import {BlueButtonBig} from '../../components/Button'
import {Colors,StorageKey} from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import { androidPermission } from '../../utils/permissionsAndroid';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import NetworkManager from '../../utils/networkManage';
import {CommonTextInput} from '../../components/TextInputComponent'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    contentBox:{
        paddingTop:20,
        width:Layout.WINDOW_WIDTH*0.9,
        alignItems:'stretch',
        alignSelf:'center',
    },
    text:{
        color:Colors.fontBlackColor,
        fontSize:13,
        marginBottom:3,
    },
    textInput:{
        marginBottom:12,
    },
    button:{
        alignSelf:'center',
        marginTop:20,
    }
})

export default class CreateContactScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isDisabled:true,
            address:'',//扫描回来带的地址
        }

        this.name = '';
        this.remark = '';
        this.address = '';
    }

    _initData() { 

    }

    btnIsEnableClick(){
        if (this.name == ''|| this.address == '') {
            this.setState({
                isDisabled: true
            })
         }else{
            this.setState({
                isDisabled: false
            })
            
        }
    }
    
    scanClick = async () => {
        Keyboard.dismiss();
        var _this = this;
        var isAgree = true;
        if (Platform.OS === 'android') {
            isAgree = await androidPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        if (isAgree) {
            this.props.navigation.navigate('ScanQRCode', {
                callback: function (data) {
                    var address = data.toAddress;
                    _this.address = address
                    _this.setState({
                        address: address
                    })
                    _this.btnIsEnableClick()
                }
            })
        } else {
            Alert.alert(
                'warn',
                '请先打开使用摄像头权限',
            )
        }
    }

    nameOnChangeText = (text) => {
        this.name = text;
        this.btnIsEnableClick()
    };
    remarkOnChangeText = (text) => {
        this.remark = text;
        this.btnIsEnableClick()
    };
    addressOnChangeText = (text) => {
        this.address = text;
        this.setState({
            address:text,
        })
        this.btnIsEnableClick()
    };

    async save(){
        Keyboard.dismiss();
        if( NetworkManager.isValidAddress(this.address) === false){
            showToast('请输入有效的转账地址')
            return;
        }
        var id = new Date().getTime();
        var object = {
            name: this.name,
            address: this.address,
            remark: this.remark,
        }
        StorageManage.save(StorageKey.Contact, object, id)
        //console.log('L_contact','保存完成')
        //var loadRet = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        //var ids = await StorageManage.loadIdsForKey(StorageKey.Contact)
        this.props.navigation.state.params.callback({});
        this.props.navigation.goBack()
    }
    
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={'新建联系人'}
                                rightPress={() => this.scanClick()}
                                rightIcon={require('../../assets/common/scanIcon.png')}/>
                <View style={styles.contentBox}>
                    <Text style={styles.text}>姓名</Text>
                    <CommonTextInput
                         textInputStyle = {styles.textInput}
                         onChangeText={this.nameOnChangeText}/>

                    <Text style={styles.text}>备注(选填)</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         onChangeText={this.remarkOnChangeText}/>

                    <Text style={styles.text}>钱包地址</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         returnKeyType={"done"}
                         onChangeText={this.addressOnChangeText}
                         defaultValue={this.state.address}/>          
                    
                    <BlueButtonBig
                        buttonStyle = {styles.button}
                        isDisabled = {this.state.isDisabled}
                        onPress = {()=> this.save()}
                        text = {'保存'}
                    />  
                </View>
                     
            </View>    
        );
    }
}


