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
    warnTxt:{
        fontSize:10,
        color:'red',
        alignSelf:'flex-end',
        marginBottom: 10,
        paddingLeft:10,
    },
    warnTxtHidden:{
        height:0
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
    },
    
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
            isShowAddressWarn:false,
            addressWarn:I18n.t('toast.enter_valid_transfer_address'),
        }

        this.contactInfo = {},
        this.index = undefined,
        this.storageId = undefined,
        this.name = '';
        this.remark = '';
        this.address = '';
        this.isAddressFocus = ''
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

        this.getStorageId();
    }

    async getStorageId(){
        var ids = await StorageManage.loadIdsForKey(StorageKey.Contact);
        this.storageId = ids[this.index];
    }

    vertifyInput(){
        if(this.isAddressFocus){
            this.vertifyAddress()
        }else{
            this.btnIsEnableClick()
        }
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

    vertifyAddress(){
        let addressIsOK = true;
        if(this.address != ''){
            addressIsOK = NetworkManager.isValidAddress(this.address);
            let disabled = this.name == '' || 
                            (this.name == this.contactInfo.name && this.remark == this.contactInfo.remark && this.address == this.contactInfo.address)
                            || !addressIsOK
            this.setState({
                isShowAddressWarn:!addressIsOK,
                isDisabled: disabled
            })
        }else{
            if(!this.state.isDisabled){
                this.setState({
                    isDisabled: true
                })  
            }
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
                    _this.vertifyAddress()
                }
            })
        } else {
            Alert.alert(
                'warn',
                I18n.t('modal.permission_camera')
            )
        }
    }

    nameOnChangeText = (text) => {
        this.name = text;
        this.vertifyInput()
    };
    remarkOnChangeText = (text) => {
        this.remark = text;
        this.vertifyInput()
    };
    addressOnChangeText = (text) => {
        this.address = text;
        this.setState({
            address:text,
        })
        this.vertifyInput()
    };

    
    async saveModify(){
        Keyboard.dismiss();
        if( NetworkManager.isValidAddress(this.address) === false){
            showToast(I18n.t('toast.enter_valid_transfer_address'))
            return;
        }
        var object = {
            name: this.name,
            address: this.address,
            remark: this.remark,
        }
        StorageManage.save(StorageKey.Contact, object, this.storageId)
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
        this.setState({
            isShowDialog:false
        })
        StorageManage.remove(StorageKey.Contact, this.storageId)
        this.props.navigation.state.params.callback({});
        this.props.navigation.goBack()
    }
    onCancelClick(){
        this.setState({
            isShowDialog:false
        })
    }
    
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={this.contactInfo.name}
                                rightPress={() => this.scanClick()}
                                rightIcon={require('../../assets/common/scanIcon.png')}/>
                <RemindDialog   content={I18n.t('settings.make_sure_delete_contact')}    
                                modalVisible={this.state.isShowDialog}
                                leftPress={() => this.onCancelClick()}
                                rightPress = {()=> this.onConfirmDelete()}/>

                <View style={styles.contentBox}>
                    <Text style={styles.text}>{I18n.t('settings.name')} </Text>
                    <CommonTextInput
                         textInputStyle = {styles.textInput}
                         onChangeText={this.nameOnChangeText}
                         defaultValue={this.state.name}/>

                    <Text style={styles.text}>{I18n.t('settings.remarks')}</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         onChangeText={this.remarkOnChangeText}
                         defaultValue={this.state.remark}/>

                    <Text style={styles.text}>{I18n.t('settings.wallet_address')}</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         returnKeyType={"done"}
                         onChangeText={this.addressOnChangeText}
                         defaultValue={this.state.address}
                         onFocus = {() => {this.isAddressFocus = true;this.vertifyAddress()}}
                         onBlur = {() => {this.isAddressFocus = false}}/>          
                    <Text style={this.state.isShowAddressWarn ?styles.warnTxt : styles.warnTxtHidden}>{this.state.addressWarn}</Text>
                    <BlueButtonBig
                         buttonStyle= {styles.button}
                         isDisabled = {this.state.isDisabled}
                         onPress = {()=> this.saveModify()}
                         text = {I18n.t('settings.save_changes')}
                    />
                    <TouchableOpacity style={styles.deleteTouchable}
                              activeOpacity={0.6}
                              onPress = {()=> this.deleteContact()}>
                         <Text style={styles.deleteText}>{I18n.t('settings.delete_contact')}</Text>
                    </TouchableOpacity>  
                </View>
                     
            </View>    
        );
    }
}


