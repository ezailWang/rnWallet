import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Text,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import {BlueButtonBig} from '../../components/Button'
import {Colors,StorageKey} from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import { androidPermission } from '../../utils/PermissionsAndroid';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import NetworkManager from '../../utils/NetworkManager';
import {CommonTextInput} from '../../components/TextInputComponent'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    contentBox:{
        paddingTop:10,
        width:Layout.WINDOW_WIDTH*0.9,
        alignItems:'stretch',
        alignSelf:'center',
    },
    text:{
        color:Colors.fontBlackColor_43,
        fontSize:13,
        marginBottom:3,
        marginTop:12,
    },
    textInput:{
        //marginBottom:12,
    },
    warnTxt:{
        fontSize:10,
        color:'red',
        alignSelf:'flex-end',
        paddingTop: 5,
        paddingLeft:10,
    },
    warnTxtHidden:{
        height:0
    },
    button:{
        alignSelf:'center',
        marginTop:20,
    }
})

class CreateContactScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            isDisabled:true,
            address:'',
            isShowNameWarn:false,
            isShowAddressWarn:false,
            nameWarn:I18n.t('settings.enter_normative_contact_name'),
            addressWarn:I18n.t('toast.enter_valid_transfer_address'),

        }

        this.name = '';
        this.remark = '';
        this.address = '';
        this.isAddressFocus = false
    }

    _initData() { 
        let addAddress = this.props.navigation.state.params.address;
        if(addAddress != undefined){
            this.setState({
                address: addAddress
            })
            this.address = addAddress;
        }
    }


    btnIsEnableClick(){
        if (this.name == ''|| this.address == '' 
            || this.name.length > 12) {
                this.setState({
                    isDisabled: true,
                    isShowNameWarn: (this.name == ''|| this.name.length > 12) ? true : false
                })
         }else{
            this.setState({
                isDisabled: false,
                isShowNameWarn:false
            })    
        }
    }

    vertifyAddress(){
        let addressIsOK = true;
        if(this.address != ''){
            addressIsOK = NetworkManager.isValidAddress(this.address);
            let disabled = this.name == '' || !addressIsOK || this.name.length > 12
            this.setState({
                isShowAddressWarn:!addressIsOK,
                isDisabled: disabled,
                //isShowNameWarn: (this.name == ''||this.name.length > 12) ? true : false
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
            this._showAlert(I18n.t('modal.permission_camera'))
        }
    }

    nameOnChangeText = (text) => {
        this.name = text.trim();
        this.btnIsEnableClick()
    };
    remarkOnChangeText = (text) => {
        this.remark = text;
        //this.btnIsEnableClick()
    };
    addressOnChangeText = (text) => {
        this.address = text;
        this.setState({
            address:text,
        })
        this.vertifyAddress()
    };

    async save(){
        Keyboard.dismiss();
        if( NetworkManager.isValidAddress(this.address) === false){
            showToast(I18n.t('toast.enter_valid_transfer_address'))
            return;
        }
        var id = new Date().getTime();
        var object = {
            name: this.name,
            address: this.address.toLowerCase(),
            remark: this.remark,
        }
        StorageManage.save(StorageKey.Contact, object, id)
        let contactData = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        this.props.setContactList(contactData)
        //console.log('L_contact','保存完成')
        //var loadRet = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        //var ids = await StorageManage.loadIdsForKey(StorageKey.Contact)
        this.props.navigation.state.params.callback({contactInfo: object});
        this.props.navigation.goBack()
    }
    
    
    renderComponent() {
        return (
            <View style={styles.container}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={() => {
                       Keyboard.dismiss()
                  }}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={I18n.t('settings.create_contact')}
                                rightPress={() => this.scanClick()}
                                rightIcon={require('../../assets/common/scanIcon.png')}/>             
                <View style={styles.contentBox}>
                    <Text style={styles.text}>{I18n.t('settings.name')}</Text>
                    <CommonTextInput
                         textInputStyle = {styles.textInput}
                         onChangeText={this.nameOnChangeText}/>
                    <Text style={this.state.isShowNameWarn ?styles.warnTxt : styles.warnTxtHidden}>{this.state.nameWarn}</Text> 
                    <Text style={styles.text}>{I18n.t('settings.remarks')}</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         onChangeText={this.remarkOnChangeText}/>

                    <Text style={styles.text}>{I18n.t('settings.wallet_address')}</Text>
                    <CommonTextInput 
                         textInputStyle = {styles.textInput}
                         returnKeyType={"done"}
                         onChangeText={this.addressOnChangeText}
                         defaultValue={this.state.address}
                         onFocus = {() => {this.isAddressFocus = true;}}
                         onBlur = {() => {this.isAddressFocus = false}}/>          
                    <Text style={this.state.isShowAddressWarn ?styles.warnTxt : styles.warnTxtHidden}>{this.state.addressWarn}</Text>
                    <BlueButtonBig
                        buttonStyle = {styles.button}
                        isDisabled = {this.state.isDisabled}
                        onPress = {()=> this.save()}
                        text = {I18n.t('settings.save')}
                    />  
                </View>
                     
            </View>    
        );
    }
}


const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateContactScreen)


