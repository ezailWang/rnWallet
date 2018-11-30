import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, ScrollView, TouchableOpacity, BackHandler, DeviceEventEmitter } from 'react-native';

import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage'
import KeystoreUtils from '../../utils/KeystoreUtils'
import { NextButton, GreyButtonBig } from '../../components/Button';
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
import StaticLoading from '../../components/StaticLoading'
import NetworkManager from '../../utils/NetworkManager'


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
    delButtonBox: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    button: {
        marginBottom: 20,
        alignSelf: 'center'
    }

})

class SetScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            nameModalVisible: false,
            passwordModalVisible: false,
            //isShowNameWarn: false,
            rightBtnDisabled: true,
            pwdRightBtnDisabled: true,
            nameWarnText: ' ',
            isShowRemindDialog: false,


            isShowSLoading: false,
            sLoadingContent: I18n.t('settings.verifying_password')
        }
        this.isDeleteWallet = false;
        this.inputName = '';
        this.inputPwd = '';


        this.timeInterval = null;
        this.timeIntervalCount = 0;
    }



    _closeModal() {
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
            rightBtnDisabled: true,
            nameWarnText: ' '
        });
    }

    openPasswordModal() {
        this.setState({
            passwordModalVisible: true,
            pwdRightBtnDisabled: true,
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
        if (text == '' || text.length > 12) {
            warnText = I18n.t('launch.enter_normative_wallet_name')
        }
        this.setState({
            //isShowNameWarn: isShowWarn,
            rightBtnDisabled: isDisabled,
            nameWarnText: warnText
        })
    };

    pwdOnChangeText = (text) => {
        this.inputPwd = text
        let isDisabled = (text == '' || text.length < 8) ? true : false
        this.setState({
            pwdRightBtnDisabled: isDisabled,
        })
    }

    passwordConfirmClick() {
        //var password = this.refs.inputPasswordDialog.state.text;
        let password = this.inputPwd
        this.closePasswordModal();
        if (password == '' || password == undefined) {
            showToast(I18n.t('toast.enter_password'))
        } else {
        
            this.timeIntervalCount = 0;
            this.timeInterval = setInterval(() => {
                this.timeIntervalCount = this.timeIntervalCount + 1;
                this.changeLoading(this.timeIntervalCount,password)
            }, 500);
        }
    }

    changeLoading(num,password) {
        let content = '';
        if (num == 1) {
            content = I18n.t('settings.verifying_password')
        } else if (num == 2) {
            content = I18n.t('settings.decrypting_keystore')
        }
        this.setState({
            isShowSLoading: true,
            sLoadingContent: content
        })
        let n = this.isDeleteWallet ? 1 : 2
        if (num == n) {
            clearInterval(this.timeInterval)
            setTimeout(() => {
                this.exportKeyPrivate(password);
            }, 0);

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
        let privateKey
        try {
            privateKey = await KeystoreUtils.getPrivateKey(password)
            this.hideStaticLoading();//关闭Loading
            if (privateKey == null) {
                //alert(I18n.t('modal.export_private_key_error'));
                showToast(this.isDeleteWallet ? I18n.t('modal.password_error') : I18n.t('modal.export_private_key_error'))
            } else {
                if (this.isDeleteWallet) {
                    this.setState({
                        isShowRemindDialog: true
                    })
                } else {
                    this.props.navigation.navigate('ExportPrivateKey', { privateKey: privateKey })
                }
            }

        } catch (e) {
            console.log('exportKeyPrivateErr:', err)
        } finally {
            this.hideStaticLoading();
        }
    }

    hideStaticLoading(){
        this.setState({
            isShowSLoading: false,
            sLoadingContent: ''
        })
    }

    async exportKeystore() {
        try {
            var address = this.props.walletAddress;
            var keystore = await KeystoreUtils.importFromFile(address)
            this.props.navigation.navigate('ExportKeystore', { keystore: keystore });
        } catch (err) {
            alert(I18n.t('modal.password_error'));
            console.log('exportKeystoreErr:', err)
        }
    }


    cancelDeleteClick() {
        this.setState({
            isShowRemindDialog: false
        })
    }

    async confirmDeleteClick() {
        this.setState({
            isShowRemindDialog: false
        })
        this._showLoding()
        setTimeout(() => {
            this.deleteLocalData();
        }, 2000);

    }

    async deleteLocalData() {
        await KeystoreUtils.removeKeyFile(this.props.walletAddress)
        this.props.setWalletAddress(null);
        //删除所有本地的数据
        StorageManage.remove(StorageKey.User)
        StorageManage.remove(StorageKey.Tokens)
        StorageManage.remove(StorageKey.Network)
        StorageManage.remove(StorageKey.UserToken)
        //StorageManage.remove(StorageKey.Language)
        //StorageManage.remove(StorageKey.MonetaryUnit)
        //StorageManage.remove(StorageKey.PinInfo)
        
       
        StorageManage.remove(StorageKey.NotRemindAgainTestITC)//
        //StorageManage.clearMapForkey(StorageKey.Contact)// id
        StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo)// id

        let params = {
            walletAddress: ''
        }
        NetworkManager.userInfoUpdate(params)
            .then((response) => {
                if (response.code === 200) {
                } else {
                    console.log('userInfoUpdate err msg:', response.msg)
                }
            })
            .catch((err) => {
                console.log('userInfoUpdate err:', err)
            })

        this._hideLoading();
        this.props.navigation.navigate('Apploading')
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.set')} />

                <StaticLoading
                    visible={this.state.isShowSLoading}
                    content={this.state.sLoadingContent}
                ></StaticLoading>

                <InputTextDialog
                    ref="inputTextDialog"
                    placeholder={I18n.t('settings.enter_wallet_name_hint')}
                    leftTxt={I18n.t('modal.cancel')}
                    rightTxt={I18n.t('modal.confirm')}
                    leftPress={() => this.closeNameModal()}
                    rightPress={() => this.nameConfirmClick()}
                    modalVisible={this.state.nameModalVisible}
                    onChangeText={this.nameOnChangeText}
                    defaultValue={this.props.walletName}
                    warnText={this.state.nameWarnText}
                    isShowWarn={true}
                    rightBtnDisabled={this.state.rightBtnDisabled}
                />
                <InputPasswordDialog
                    ref="inputPasswordDialog"
                    placeholder={I18n.t('settings.enter_passowrd_hint')}
                    leftTxt={I18n.t('modal.cancel')}
                    rightTxt={I18n.t('modal.confirm')}
                    leftPress={() => this.closePasswordModal()}
                    rightPress={() => this.passwordConfirmClick()}
                    modalVisible={this.state.passwordModalVisible}
                    rightBtnDisabled={this.state.pwdRightBtnDisabled}
                    onChangeText={this.pwdOnChangeText}
                />
                <RemindDialog content={I18n.t('settings.confirm_delete_wallet')}
                    modalVisible={this.state.isShowRemindDialog}
                    leftTxt={I18n.t('modal.cancel')}
                    rightTxt={I18n.t('modal.confirm')}
                    leftPress={() => this.cancelDeleteClick()}
                    rightPress={() => this.confirmDeleteClick()} />



                <TouchableOpacity style={[styles.btnOpacity]}
                    activeOpacity={0.6}
                    onPress={() => { this.isDeleteWallet = false; this.openNameModal() }}>
                    <Text style={styles.btnTxt}>{I18n.t('settings.modify_wallet_name')}</Text>
                    <Text style={styles.walletName}>{this.props.walletName}</Text>
                </TouchableOpacity>



                <View style={styles.buttonBox}>
                    <NextButton
                        onPress={() => { this.isDeleteWallet = false; this.exportKeystore() }}
                        text={I18n.t('settings.export_keystore')}
                    />
                </View>
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress={() => { this.isDeleteWallet = false; this.openPasswordModal() }}
                        text={I18n.t('settings.export_private_key')}
                    />
                </View>



                <View style={styles.delButtonBox}>
                    <GreyButtonBig
                        buttonStyle={styles.button}
                        onPress={() => { this.isDeleteWallet = true; this.openPasswordModal() }}
                        text={I18n.t('settings.delete_wallet')}
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


