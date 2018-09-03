import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert ,Dimensions} from 'react-native';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import LinearGradient from 'react-native-linear-gradient'

import {RightBlueNextButton,RightWhiteNextButton} from '../../components/Button'
import {Colors} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import SplashScreen from 'react-native-splash-screen'

import networkManage from '../../utils/networkManage'

// let bip39 = require('bip39')
// let hdkey = require('ethereumjs-wallet/hdkey')
// let util = require('ethereumjs-util')

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        paddingTop: 150,
    },
    logoImg: {
        marginBottom: 50,
        width: 120,
        height: 120,
    },
    marginTop10: {
        marginTop: 30,
    },
    nextIcon:{
        width:15,
        height:15,
        marginTop:10,
        marginLeft:10,
        zIndex:20,
    },
    btnMargin:{
       height:20,
    }
});

class FirstLaunchScreen extends Component {

    componentDidMount(){
        SplashScreen.hide()
    }
    
    createClickFun() {

        walletUtils.generateMnemonic().then((data) => {
            this.props.generateMnemonic(data)
            this.props.navigation.navigate('BackupWallet');
        }, (error) => {
            Alert.alert(
                'error',
                'mnemonic:' + error.toString(),
                [
                    { text: 'OK', onPress: () => { } },
                ],
                { cancelable: false }
            )
        })
    }

    createNew = async ()=>{

        let web3 = networkManage.getWeb3Instance();
        // console.log(web3.eth.getBlockNumber())
        let number = await web3.eth.getBlockNumber();
        alert('current blockNumber'+number);

        let account = await web3.eth.accounts.create();
        alert('account info'+JSON.stringify(account,3));

        let keystore = await web3.eth.accounts.encrypt(account.privateKey, 'password');
        alert('keystore info'+JSON.stringify(keystore,3))
    }

    importKeyStore = async ()=>{

        let web3 = networkManage.getWeb3Instance();
        let account = await web3.eth.accounts.decrypt({"version":3,"id":"a28d87a2-5527-4395-a30c-af7a3fe24ade","address":"ffd74e5e87dbb1c3632c457547db7236a3b99af4","crypto":{"ciphertext":"f976e49400a50020fd24f6aed37cf9ed3617b0a0028da55adcfcd0507b9ce8de","cipherparams":{"iv":"daed75bedc31de69b944123ebbec67fe"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"ea2f455cc3bd0f69ed117ada26a4f830fe6fb43d39262fa1048778cc35a341c9","n":8192,"r":8,"p":1},"mac":"d288cc0c1f5ae40ac6bad4335c9d25f37fed71e2f9ab431be8885a663a5f332d"}}, 'password');
        alert('decyypt account'+JSON.stringify(account,3));
    }

    testFunc = async ()=>{

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


    render() {
        return (
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={styles.contentContainer}>
                <StatusBarComponent/>            
                <Image style={styles.logoImg} source={require('../../assets/common/logo_icon.png')} resizeMode={'center'}/>

                <RightBlueNextButton
                        onPress={() => this.createClickFun()}
                        text='创建钱包'/>
                <View style={styles.btnMargin}>
                </View>
                <RightWhiteNextButton
                        onPress={()=> this.props.navigation.navigate('ImportWallet')}
                        text='导入钱包'/> 
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(Actions.generateMnemonic(mnemonic)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FirstLaunchScreen)