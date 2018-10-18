import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, Alert, Dimensions, BackHandler } from 'react-native';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'
import { BlueButtonBig } from '../../components/Button';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { upsetArrayOrder } from './Common';
import { Colors, FontSize } from '../../config/GlobalConfig'
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader'
import { showToast } from '../../utils/Toast';
import Layout from '../../config/LayoutConstants'
import { StorageKey } from '../../config/GlobalConfig';
import { store } from '../../config/store/ConfigureStore'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff',
    },
    contentContainer: {
        flex:1,
        width:Layout.WINDOW_WIDTH*0.9,
        alignItems:'center',
        alignSelf:'center',
        paddingTop:20,
        //alignItems:'stretch',
    },
    icon: {
        width: 72,
        height: 72,
        marginBottom: 10,
    },
    titleTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.fontBlueColor,
        marginBottom: 20,
    },
    contentTxt: {
        fontSize: FontSize.ContentSize,
        color: Colors.fontGrayColor_a0,
        textAlign:'center',
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    mnemonicItem: {
        height: 28,
        fontSize: 14,
        color: 'black',
        lineHeight: 28,
        paddingLeft: 6,
        paddingRight: 6,
        borderWidth: 1,
        borderColor: Colors.fontGrayColor,
        backgroundColor: 'white',
        marginLeft: 6,
        marginRight: 6,
        marginBottom: 10,
    },
    mnemonicList: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
    },
    mnemonicSortBorder: {
        //flex:1.2,
        //height:166,
        justifyContent: 'center',
        alignSelf: 'stretch',
        backgroundColor: Colors.bgColor_e,
        borderRadius: 8,
        marginTop: 28,
        marginBottom: 10,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 8,
        paddingRight: 8,
    },

})

class VerifyMnemonicScreen extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            mnemonicDatas: [],
            sortMnemonicDatas: [],
            isDisabled: true,//创建按钮是否可以点击
        }
    }

    
    _onBackPressed = () => {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
        return true;
    }

    backPressed() {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
    }

    _initData(){
        var m = this.props.mnemonic.split(' ');
        var md = upsetArrayOrder(m);
        this.setState({
            mnemonicDatas: md,
        })
    }

    _stateBackground(){
        
    }




    addSortMnemonicFun(i, txt) {
        var smd = this.state.sortMnemonicDatas.slice(0);
        smd.push(txt);
        var md = this.state.mnemonicDatas.slice(0);
        md.splice(i, 1)
        this.setState({
            mnemonicDatas: md,
            sortMnemonicDatas: smd,
        });
        this.btnIsEnableClick();
    }
    removeSortMnemonicFun(i, txt) {
        var md = this.state.mnemonicDatas.slice(0);
        md.push(txt);
        var smd = this.state.sortMnemonicDatas.slice(0);
        smd.splice(i, 1)
        this.setState({
            mnemonicDatas: md,
            sortMnemonicDatas: smd,
        });
        this.btnIsEnableClick();
    }

    btnIsEnableClick() {
        let isSortcomplete = false;
        let sortLength = this.state.sortMnemonicDatas.length + 1;

        if (sortLength == 12) {
            isSortcomplete = false;
        } else {
            isSortcomplete = true;
        }

        this.setState({
            isDisabled: isSortcomplete
        })
    }

    completeClickFun() {
        if (this.state.sortMnemonicDatas.join(' ') == this.props.mnemonic) {
            this._showLoding();
            setTimeout(() => {
                this.startCreateWallet();//创建钱包
            }, 2000);
        } else {
            Alert.alert(
                I18n.t('modal.backup_fail'),
                I18n.t('modal.check_mnemonic_is_correct'),
            )
        }

    }

    async startCreateWallet() {
        try {
            var m = this.props.mnemonic;//助记词
            const seed = walletUtils.mnemonicToSeed(m)
            const seedHex = seed.toString('hex')
            var hdwallet = HDWallet.fromMasterSeed(seed)
            const derivePath = "m/44'/60'/0'/0/0"
            hdwallet.setDerivePath(derivePath)
            const privateKey = hdwallet.getPrivateKey()
            const checksumAddress = hdwallet.getChecksumAddressString(); 
        
            var password = this.props.navigation.state.params.password;
            var params = { keyBytes: 32, ivBytes: 16 }
            var dk = keythereum.create(params);
            var keyObject = await keystoreUtils.dump(password, privateKey, dk.salt, dk.iv); 
            await keystoreUtils.exportToFile(keyObject, "keystore")
            //var str = await keystoreUtils.importFromFile(keyObject.address)
            //var newKeyObject = JSON.parse(str)

            this.props.setWalletAddress(checksumAddress);
            this.props.setWalletName(this.props.walletName);
            this.props.setIsNewWallet(true);

            var object = {
                name: this.props.walletName,
                address: checksumAddress,
                extra: '',
            }
            StorageManage.save(StorageKey.User, object)
            //var loadRet = await StorageManage.load(StorageKey.User)
           
            this._hideLoading()
            this._openAppVerifyIdentidy = false
            this.props.navigation.navigate('Home')
        } catch (err) {
            this._hideLoading()
            showToast(I18n.t('toast.create_wallet_error'));
        }
    }
    renderComponent() {
        var renderThis = this;
        var mnemonicView = [];
        this.state.mnemonicDatas.forEach(function (txt, index, b) {
            mnemonicView.push(
                <Text key={index} style={styles.mnemonicItem}
                    onPress={(e) => { renderThis.addSortMnemonicFun(index, txt) }}
                >{txt}
                </Text>
            )
        })

        var sortMnemonicView = [];
        this.state.sortMnemonicDatas.forEach(function (txt, index, b) {
            sortMnemonicView.push(
                <Text key={index} style={styles.mnemonicItem}
                    onPress={(e) => { renderThis.removeSortMnemonicFun(index, txt) }}
                >
                    {txt}
                </Text>
            )
        })

        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation} onPress={() => this.backPressed()} />
                <View style={styles.contentContainer}>
                    <Image style={styles.icon} source={require('../../assets/launch/confirmWordIcon.png')} resizeMode={'center'} />
                    <Text style={styles.titleTxt}>{I18n.t('launch.confirm_mnemonic')}</Text>
                    <Text style={styles.contentTxt}>{I18n.t('launch.confirm_mnemonic_prompt')}</Text>

                    <View style={styles.mnemonicSortBorder}>
                        <View style={[styles.mnemonicList,]}>
                            {sortMnemonicView}
                        </View>
                    </View>


                    <View style={styles.mnemonicList}>
                        {mnemonicView}
                    </View>

                    <View style={styles.buttonBox}>
                        <BlueButtonBig
                            isDisabled={this.state.isDisabled}
                            onPress={() => this.completeClickFun()}
                            text={I18n.t('launch.complete')}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
    walletName: state.Core.walletName,
});
const mapDispatchToProps = dispatch => ({
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName: (name) => dispatch(Actions.setWalletName(name)),
    setIsNewWallet : (isNewWallet)=>dispatch(Actions.setIsNewWallet(isNewWallet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMnemonicScreen)


