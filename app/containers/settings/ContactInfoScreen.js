import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Text,
    Keyboard,
    TouchableOpacity
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
import RemindDialog from '../../components/RemindDialog'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    contentBox:{
        marginTop:40,
        width:Layout.WINDOW_WIDTH*0.9,
        alignSelf:'center',
    },
    text:{
        color:Colors.fontBlackColor,
        fontSize:13,
        marginBottom:3,
    },
    textInput:{
        marginBottom:15,
    },
    button:{
        marginTop:40,
    },
    deleteTouchable:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
    },
    deleteText:{
        fontSize:16,
        color:Colors.fontBlueColor,
    }
})

export default class ContactInfoScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isDisabled:true,
            name:'',
            remark:'',
            address:'',
            isShowDialog:false,
        }

        this.contactInfo = {},
        this.index = undefined,
        this.name = '';
        this.remark = '';
        this.address = '';
    }

    _initData() { 
        this.contactInfo = this.props.navigation.state.params.contactInfo;
        this.index = this.props.navigation.state.params.index;

        this.name = this.contactInfo.name;
        this.remark = this.contactInfo.remark;
        this.address = this.contactInfo.address;

        this.setState({
            name:this.contactInfo.name,
            remark:this.contactInfo.remark,
            address:this.contactInfo.address,
        })
    }

    btnIsEnableClick(){
        if (this.name == ''|| this.address == '' ||
           (this.name == this.contactInfo.name && this.remark == this.contactInfo.remark && this.address == this.contactInfo.address)) {
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
    
    scanClick = async () => {
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

    async saveModify(){
        Keyboard.dismiss();
        if( NetworkManager.isValidAddress(this.address) === false){
            showToast('请输入有效的转账地址')
            return;
        }
        var ids = await StorageManage.loadIdsForKey(StorageKey.Contact);
        var id = ids[this.index];
        var object = {
            name: this.name,
            address: this.address,
            remark: this.remark,
        }
        StorageManage.save(StorageKey.Contact, object, id)
        //var loadRet = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        
        this.props.navigation.state.params.callback({});
        this.props.navigation.goBack()
    }

    deleteContact(){
        this.setState({
            isShowDialog:true
        })
    }
    onConfirmDelete(){
        
    }
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={this.contactInfo.name}
                                rightPress={() => this.scanClick()}
                                rightIcon={require('../../assets/common/scanIcon.png')}/>
                <RemindDialog   content={'确定删除联系人？'}    
                                modalVisible={this.state.isShowDialog}
                                rightPress = {()=> this.onConfirmDelete()}/>

                <View style={styles.contentBox}>
                    <Text style={styles.text}>姓名</Text>
                    <CommonTextInput
                         textInputStyle = {styles.textInput}
                         onChangeText={this.nameOnChangeText}
                         defaultValue={this.state.name}/>

                    <Text style={styles.text}>备注(选填)</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         onChangeText={this.remarkOnChangeText}
                         defaultValue={this.state.remark}/>

                    <Text style={styles.text}>钱包地址</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         returnKeyType={"done"}
                         onChangeText={this.addressOnChangeText}
                         defaultValue={this.state.address}/>          
                    
                    <BlueButtonBig
                         buttonStyle= {styles.button}
                         isDisabled = {this.state.isDisabled}
                         onPress = {()=> this.saveModify()}
                         text = {'保存修改'}
                    />
                    <TouchableOpacity style={styles.deleteTouchable}
                              activeOpacity={0.6}
                              onPress = {()=> this.deleteContact()}>
                         <Text style={styles.deleteText}>删除联系人</Text>
                    </TouchableOpacity>  
                </View>
                     
            </View>    
        );
    }
}


