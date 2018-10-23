import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, ScrollView, TouchableOpacity, BackHandler, DeviceEventEmitter } from 'react-native';

import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import { NextButton ,GreyButtonBig} from '../../components/Button';
import InputTextDialog from '../../components/InputTextDialog';
import InputPasswordDialog from '../../components/InputPasswordDialog';
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig'
import * as Actions from '../../config/action/Actions';
import { showToast } from '../../utils/Toast';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
import RemindDialog from '../../components/RemindDialog'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.bgGrayColor,
        paddingBottom: 20,
    },
    btnOpacity: {
        flexDirection: 'row',
        height: 56,
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    btnTxt: {
        flex: 1,
        backgroundColor: 'transparent',
        color: Colors.fontBlackColor_43,
        fontSize: FontSize.TitleSize,
        height: 56,
        lineHeight: 56,
        textAlign: 'left',
    },
    headIcon: {
        height: 36,
        width: 36,
    },
    walletName: {
        fontSize: FontSize.DetailTitleSize,
        color: Colors.fontBlackColor_43
    },
    buttonBox: {
        marginTop: 1,
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
    },
    marginBottom20: {
        marginBottom: 20,
    },
    delButtonBox:{
        flex:1,
        justifyContent:'flex-end',
    },
    button:{
        marginBottom:20,
        alignSelf:'center'
    }

})

class SetScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            nameModalVisible: false,
            passwordModalVisible: false,
            //isShowNameWarn: false,
            rightBtnDisabled : true,
            pwdRightBtnDisabled:true,
            nameWarnText : ' ',
            isShowRemindDialog: false,
        }
        this.isDeleteWallet = false;
        this.inputName = '';
        this.inputPwd = '';
    }


    
    _closeModal(){
        this.setState({
            nameModalVisible: false,
            passwordModalVisible: false,
            isShowRemindDialog: false,
        })
    }

    openNameModal() {
        this.setState({
            nameModalVisible: true,
            //isShowNameWarn: false,
            rightBtnDisabled : true,
            nameWarnText : ' '
        });
    }

    openPasswordModal() {
        this.setState({ 
            passwordModalVisible: true ,
            pwdRightBtnDisabled:true,
        });
        
    }
    closeNameModal() {
        this.setState({ nameModalVisible: false });
    }
    closePasswordModal() {
        this.setState({ passwordModalVisible: false });
    }

    nameConfirmClick() {
        //var name = this.refs.inputTextDialog.state.text;
        var name = this.inputName;
        this.closeNameModal()
        if (name == '' || name == undefined) {
            showToast(I18n.t('toast.enter_wallet_name'))
        } else if (name == this.props.walletName) {
            showToast(I18n.t('toast.not_modified_wallet_name'))
        } else {
            this.modifyWalletName(name);
        }
    }

    nameOnChangeText = (text) => {
        this.inputName = text
        //let isShowWarn = (text == '' || text.length > 12) ? true : false
        let isDisabled = (text == '' || text.length > 12 || text == this.props.walletName) ? true : false
        let warnText = '';
        if(text == '' || text.length > 12){
            warnText = I18n.t('launch.enter_normative_wallet_name')
        }
        this.setState({
            //isShowNameWarn: isShowWarn,
            rightBtnDisabled : isDisabled,
            nameWarnText: warnText
        })  
    };

    pwdOnChangeText = (text) => {
        this.inputPwd = text
        let isDisabled = (text == '' || text.length < 8) ? true : false
        this.setState({
            pwdRightBtnDisabled : isDisabled,
        })
    }

    passwordConfirmClick() {
        //var password = this.refs.inputPasswordDialog.state.text;
        let password = this.inputPwd
        this.closePasswordModal();
        if (password == '' || password == undefined) {
            showToast(I18n.t('toast.enter_password'))
        } else { 
            this._showLoding()
            setTimeout(()=>{
                this.exportKeyPrivate(password);
            }, 2000);
           
        }
    }
    async  modifyWalletName(name) {
        // var name = this.refs.inputTextDialog.state.text;
        var key = StorageKey.User;

        var loadUser = await StorageManage.load(key);
        if (loadUser == null) {
            loadUser = {
                name: name,
            }
        } else {
            loadUser.name = name;//修改name值
        }
        StorageManage.save(key, loadUser)
        this.props.modifyWalletName(name);

        //this.refs.inputTextDialog.state.text = '';
        //this.closeNameModal();//隐藏弹框 
    }


    async exportKeyPrivate(password) {
        let  privateKey
        try{
            privateKey = await keystoreUtils.getPrivateKey(password)
            this._hideLoading();//关闭Loading
            if (privateKey == null) {
                //alert(I18n.t('modal.export_private_key_error'));
                showToast(this.isDeleteWallet ? I18n.t('modal.password_error') : I18n.t('modal.export_private_key_error'))
           } else {
               if(this.isDeleteWallet){
                   this.setState({
                       isShowRemindDialog : true
                   })
               }else{
                    this.props.navigation.navigate('ExportPrivateKey', { privateKey: privateKey })
               }   
           }
           
        }catch(e){
            console.log('exportKeyPrivateErr:', err)
        }finally{
            this._hideLoading();
        }
        

        
        
    }

    async exportKeystore() {
        try {
            var address = this.props.walletAddress;
            var keystore = await keystoreUtils.importFromFile(address)
            this.props.navigation.navigate('ExportKeystore', { keystore: keystore });
        } catch (err) {
            alert(I18n.t('modal.password_error'));
            console.log('exportKeystoreErr:', err)
        }
    }

    async exportWallet() {
        var key = 'uesr'
        var user = await StorageManage.load(key);
        var str = await keystoreUtils.importFromFile(user.address)
        var newKeyObject = JSON.parse(str)
    }



    deleteWallet(){
        this.isDeleteWallet = true;
        this.openPasswordModal()
    }
    cancelDeleteClick(){
        this.setState({
            isShowRemindDialog : false
        })
    }

    async confirmDeleteClick(){
        this.setState({
            isShowRemindDialog : false
        })
        this._showLoding()

        this.props.setWalletAddress(null);
        //删除所有本地的数据
        StorageManage.remove(StorageKey.User)
        StorageManage.remove(StorageKey.Tokens)
        StorageManage.remove(StorageKey.Network)
        StorageManage.remove(StorageKey.Language)
        StorageManage.remove(StorageKey.PinInfo)
        StorageManage.remove(StorageKey.UserId)
        StorageManage.remove(StorageKey.MonetaryUnit)
        StorageManage.remove(StorageKey.NotRemindAgainTestITC)//
        StorageManage.clearMapForkey(StorageKey.Contact)// id
        
       
        this._hideLoading();
        this.props.navigation.navigate('Apploading')
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.set')} />
                <InputTextDialog
                    ref="inputTextDialog"
                    placeholder={I18n.t('settings.enter_wallet_name_hint')}
                    leftTxt={I18n.t('modal.cancel')}
                    rightTxt={I18n.t('modal.confirm')}
                    leftPress={() => this.closeNameModal()}
                    rightPress={() => this.nameConfirmClick()}
                    modalVisible={this.state.nameModalVisible}
                    onChangeText = {this.nameOnChangeText}
                    defaultValue={this.props.walletName}
                    warnText={this.state.nameWarnText}
                    isShowWarn = {true}
                    rightBtnDisabled = {this.state.rightBtnDisabled}
                />
                <InputPasswordDialog
                    ref="inputPasswordDialog"
                    placeholder={I18n.t('settings.enter_passowrd_hint')}
                    leftTxt={I18n.t('modal.cancel')}
                    rightTxt={I18n.t('modal.confirm')}
                    leftPress={() => this.closePasswordModal()}
                    rightPress={() => this.passwordConfirmClick()}
                    modalVisible={this.state.passwordModalVisible}
                    rightBtnDisabled = {this.state.pwdRightBtnDisabled}
                    onChangeText = {this.pwdOnChangeText}
                />
                <RemindDialog   content={I18n.t('settings.confirm_delete_wallet')}    
                                modalVisible={this.state.isShowRemindDialog}
                                leftPress={() => this.cancelDeleteClick()}
                                rightPress = {()=> this.confirmDeleteClick()}/>



                <TouchableOpacity style={[styles.btnOpacity]}
                    activeOpacity={0.6}
                    onPress={() => {this.isDeleteWallet = false;this.openNameModal()}}>
                    <Text style={styles.btnTxt}>{I18n.t('settings.modify_wallet_name')}</Text>
                    <Text style={styles.walletName}>{this.props.walletName}</Text>
                </TouchableOpacity>



                <View style={styles.buttonBox}>
                    <NextButton
                        onPress={() => {this.isDeleteWallet = false;this.exportKeystore()}}
                        text={I18n.t('settings.export_keystore')}
                    />
                </View>
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress={() => {this.isDeleteWallet = false; this.openPasswordModal()}}
                        text={I18n.t('settings.export_private_key')}
                    />
                </View>



               <View style={styles.delButtonBox}>
                    <GreyButtonBig
                         buttonStyle = {styles.button}
                         onPress={() => {this.isDeleteWallet = true; this.openPasswordModal()}}
                         text = {I18n.t('settings.delete_wallet')}
                    /> 
               </View>
                
            </View>
        );
    }
}
const mapStateToProps = state => ({
    walletName: state.Core.walletName,
    walletAddress: state.Core.walletAddress,
});
const mapDispatchToProps = dispatch => ({
    modifyWalletName: (walletName) => dispatch(Actions.setWalletName(walletName)),
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SetScreen)


/*
//第一版  先隐藏 【更换图标  导出助记词  修改密码】
<TouchableOpacity style={[styles.btnOpacity]} 
                                  activeOpacity={0.6} 
                                  onPress={()=> this.isOpenModifyModal(true)}>
                    <Text style={styles.btnTxt}>更换图标</Text>
                    <Image style={styles.headIcon} source={require('../../assets/common/photoIcon.png')}/>
                </TouchableOpacity> 
<View style={styles.buttonBox}>
                    <NextButton
                        //onPress = {()=> this.props.navigation.navigate('ReceiptCode')}
                        onPress = {()=> this.exportWallet()}
                        text = '导出助记词'
                    />
                </View>                 

<View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('ModifyPassword')}
                        text = '修改密码'
                    />
                </View>   

 <View style={[styles.buttonBox,styles.marginBottom20]}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('PasswordPrompInfo')}
                        text = '密码提示信息'
                    />
                </View>                
 
 */