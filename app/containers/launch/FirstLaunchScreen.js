import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, PermissionsAndroid, Platform, Alert,ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { WhiteButtonBig, WhiteBorderButton } from '../../components/Button'
import { Colors } from '../../config/GlobalConfig'
import SplashScreen from 'react-native-splash-screen'
import Layout from '../../config/LayoutConstants'
import { androidPermission } from '../../utils/permissionsAndroid';
import networkManage from '../../utils/networkManage'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        paddingTop: 120,
    },
    logoImg: {
        width: 180,
        height: 180/144*153,
    },
    btnMargin: {
        height: 20,
    },
    btnBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:80,

    }
});

export default class FirstLaunchScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
        this._setStatusBarStyleLight()
    }

    _initData(){
        SplashScreen.hide()
    }
    
    //验证android读写权限
    async vertifyAndroidPermissions(isCreateWallet) {
        if (Platform.OS === 'android') {
            var readWritePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            //var writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (readWritePermission) {
                this.nextRoute(isCreateWallet)
            } else {
                Alert.alert(
                    'warn',
                    I18n.t('modal.permission_storage'),
                )
            }
        } else {
            this.nextRoute(isCreateWallet)
        }
    }

    nextRoute(isCreateWallet) {
        if (isCreateWallet) {
            this.props.navigation.navigate('CreateWallet')
        } else {
            this.props.navigation.navigate('ImportWallet')
        }
    }

    createNew = async () => {
        let web3 = networkManage.getWeb3Instance();
        let number = await web3.eth.getBlockNumber();
        alert('current blockNumber' + number);

        let account = await web3.eth.accounts.create();
        alert('account info' + JSON.stringify(account, 3));

        let keystore = await web3.eth.accounts.encrypt(account.privateKey, 'password');
        alert('keystore info' + JSON.stringify(keystore, 3))
    }

    importKeyStore = async () => {

        let web3 = networkManage.getWeb3Instance();
        let account = await web3.eth.accounts.decrypt({ "version": 3, "id": "a28d87a2-5527-4395-a30c-af7a3fe24ade", "address": "ffd74e5e87dbb1c3632c457547db7236a3b99af4", "crypto": { "ciphertext": "f976e49400a50020fd24f6aed37cf9ed3617b0a0028da55adcfcd0507b9ce8de", "cipherparams": { "iv": "daed75bedc31de69b944123ebbec67fe" }, "cipher": "aes-128-ctr", "kdf": "scrypt", "kdfparams": { "dklen": 32, "salt": "ea2f455cc3bd0f69ed117ada26a4f830fe6fb43d39262fa1048778cc35a341c9", "n": 8192, "r": 8, "p": 1 }, "mac": "d288cc0c1f5ae40ac6bad4335c9d25f37fed71e2f9ab431be8885a663a5f332d" } }, 'password');
        alert('decyypt account' + JSON.stringify(account, 3));
    }

    testFunc = async () => {

        //生成助记词
        // let mnemonic = bip39.generateMnemonic()
        // alert(mnemonic)

        // let seed = bip39.mnemonicToSeed(mnemonic)
        // let hdWallet = hdkey.fromMasterSeed(seed)

        // let key1 = hdWallet.derivePath("m/44'/60'/0'/0/0")
        // alert("私钥："+util.bufferToHex(key1._hdkey._privateKey))

        // let address1 = util.pubToAddress(key1._hdkey._publicKey, true)
        // alert("地址："+util.bufferToHex(address1))

        // address1 = util.toChecksumAddress(address1.toString('hex'))
        // alert("Encoding Address 地址："+ address1)
    }

    renderComponent() {
        return (
            //<LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
            //    style={styles.contentContainer}>
            <ImageBackground style={styles.contentContainer}
                             source={require('../../assets/launch/splash_bg.png')}>
                <Image style={styles.logoImg} source={require('../../assets/launch/splash_logo.png')} resizeMode={'center'} />
                <View style={styles.btnBox}>
                        <WhiteButtonBig
                             buttonStyle={{height:48}}
                             onPress={() => this.vertifyAndroidPermissions(true)}
                             text={I18n.t('launch.creact_wallet')} />
                        <WhiteBorderButton
                             onPress={() => this.vertifyAndroidPermissions(false)}
                             text={I18n.t('launch.import_wallet')} />
                        </View>
            </ImageBackground>   
            //</LinearGradient>
        )
    }
}
