import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, Alert, ScrollView, TouchableOpacity, BackHandler, DeviceEventEmitter } from 'react-native';

import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import { NextButton } from '../../components/Button';
import InputTextDialog from '../../components/InputTextDialog';
import InputPasswordDialog from '../../components/InputPasswordDialog';
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig'
import * as Actions from '../../config/action/Actions';
import { showToast } from '../../utils/Toast';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
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
        color: Colors.fontGrayColor_a1
    },
    buttonBox: {
        marginTop: 1,
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
    },
    marginBottom20: {
        marginBottom: 20,
    }

})

class SetScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            nameModalVisible: false,
            passwordModalVisible: false,
            isShowNameWarn: true,
            rightBtnDisabled : true,
            nameWarnText : I18n.t('toast.not_modified_wallet_name')
        }

        this.inputName = ''
    }

    openNameModal() {
        this.setState({
            nameModalVisible: true,
            isShowNameWarn: true,
            rightBtnDisabled : true,
            nameWarnText : I18n.t('toast.not_modified_wallet_name')
        });
    }

    openPasswordModal() {
        this.setState({ passwordModalVisible: true });
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
        let isShow = (text == '' || text.length > 12 || text == this.props.walletName) ? true : false
        let warnText = '';
        if(text == this.props.walletName){
            warnText = I18n.t('toast.not_modified_wallet_name')
        }else if(text == '' || text.length > 12){
            warnText = I18n.t('launch.enter_normative_wallet_name')
        }
        this.setState({
            isShowNameWarn: isShow,
            rightBtnDisabled : isShow,
            nameWarnText: warnText
        })  
    };

    passwordConfirmClick() {
        var password = this.refs.inputPasswordDialog.state.text;
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
                showToast(I18n.t('modal.export_private_key_error'))
           } else {
                this.props.navigation.navigate('ExportPrivateKey', { privateKey: privateKey })
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
                    isShowWarn = {this.state.isShowNameWarn}
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
                />
                <TouchableOpacity style={[styles.btnOpacity]}
                    activeOpacity={0.6}
                    onPress={() => this.openNameModal()}>
                    <Text style={styles.btnTxt}>{I18n.t('settings.modify_wallet_name')}</Text>
                    <Text style={styles.walletName}>{this.props.walletName}</Text>
                </TouchableOpacity>



                <View style={styles.buttonBox}>
                    <NextButton
                        onPress={() => this.exportKeystore()}
                        text={I18n.t('settings.export_keystore')}
                    />
                </View>
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress={() => this.openPasswordModal()}
                        text={I18n.t('settings.export_private_key')}
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