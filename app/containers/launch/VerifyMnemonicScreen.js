import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, Vibration, TouchableOpacity } from 'react-native';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import bip39 from 'react-native-hdwallet/src/utils/bip39'
import KeystoreUtils from '../../utils/KeystoreUtils'
import StorageManage from '../../utils/StorageManage'
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        width: Layout.WINDOW_WIDTH * 0.8,
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 20,
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
        textAlign: 'center',
        width: Layout.WINDOW_WIDTH * 0.8,
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    itemBox: {
        flex: 1,
        height: 40,
        borderRadius: 20,
    },

    itemText: {
        height: 40,
        lineHeight: 40,
        color: Colors.fontDarkGrayColor,
        fontSize: 15,
        textAlign: 'center',
    },


    vertifyBox: {
        flexDirection: 'row',
        width: Layout.WINDOW_WIDTH,
        height: 220,
        alignItems: 'center',
        marginTop: 40,
    },
    vertifyLeftRightView: {
        width: 25,
        height: 180,
    },
    vertifyLeftView: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    vertifyRightView: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },

    vertifyView: {
        flex: 1,
        height: 220,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: Colors.bg_blue_77,
        borderRadius: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    vertifyTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 30,
        marginBottom: 40,
    },
    vertifyTextView: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: 0,
        paddingBottom: 0
    },
    numberText: {
        fontWeight: '600',
        fontSize: 26,
        color: 'white',
        alignItems: 'flex-end'
    },

    serialNumText: {
        fontWeight: '600',
        fontSize: 26,
        color: 'white',
    },
    serialTotalNumText: {
        fontWeight: '600',
        fontSize: 15,
        color: 'white',
        marginBottom: 2,
    },
    vertifyRow: {
        flexDirection: 'row',
    },
    vertifyItemStyle1: {
        marginRight: 10,
    },
    vertifyItemStyle2: {
        marginLeft: 10,
    },
    vertifyItemStyle3: {
        marginTop: 15,
        marginRight: 10,
    },
    vertifyItemStyle4: {
        marginTop: 15,
        marginLeft: 10,
    }


})

class VerifyMnemonicScreen extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            showMnemonics: [],
            number: '',
            serialNum: '',
            isCheckedNum: -1,
            isShowLeftView: false,
            isShowRightView: true,
        }

        this.mnemonics = [];
        this.sectionMnemonics = [];//需要验证的4个
        this.matchCorrectNum = 0;
        this.wordList = [];
    }

    _initData() {
        this.mnemonics = this.props.mnemonic.split(' ');
        this.wordList = upsetArrayOrder(bip39.wordlists.english).splice(0,100);
        this.sectionMnemonics = upsetArrayOrder(this.props.mnemonic.split(' ')).splice(0, 4);
        this.getRandomArray();
    }


    getRandomArray() {
        let word = this.sectionMnemonics[this.matchCorrectNum].toLowerCase()
        let arr = [];
        arr.push(word)

       

        do{
            let i = Math.floor(Math.random()*(1 - 100) + 100);//获取1-100的随机数
            let w = this.wordList[i-1].toLowerCase();
            let isExist = false;
            for(let j=0;j<arr.length;j++){
                if(w == arr[j].toLowerCase()){
                    isExist = true
                    break
                }
            }
            if(!isExist){
                arr.push(w)
            }

        }while(arr.length<3)

    
        do{
            let i = Math.floor(Math.random()*(1 - 12) + 12);//获取1-12的随机数
            let w = upsetArrayOrder(this.props.mnemonic.split(' '))[i-1].toLowerCase();
            let isExist = false;
            for(let j=0;j<arr.length;j++){
                if(w == arr[j].toLowerCase()){
                    isExist = true
                    break
                }
            }
            if(!isExist){
                arr.push(w)
            }

        }while(arr.length<4)


        let usm = upsetArrayOrder(arr)
        let n = this.mnemonics.indexOf(word) + 1
        this.setState({
            showMnemonics: usm,
            number: '#' + n,
            serialNum: this.matchCorrectNum + 1,
            isCheckedNum: -1,
            isShowLeftView: this.matchCorrectNum > 0 ? true : false,
            isShowRightView: this.matchCorrectNum < 3 ? true : false,
        })
    }

    _onPressItem = (text) => {

        this.setState({
            isCheckedNum: this.state.showMnemonics.indexOf(text)
        })


        let word = this.sectionMnemonics[this.matchCorrectNum].toLowerCase()
        if (text.toLowerCase() == word) {
            this.matchCorrectNum = this.matchCorrectNum + 1;
            Vibration.vibrate([0, 20], false)
            if (this.matchCorrectNum < 4) {
                this.getRandomArray()
            } else {
                showToast(I18n.t('launch.modal_mnemonic_success'))
                this.createWallet()
            }
        } else {
            this.sectionMnemonics = upsetArrayOrder(this.props.mnemonic.split(' ')).splice(0, 4);
            Vibration.vibrate([0, 100], false)
            this.matchCorrectNum = 0
            showToast(I18n.t('launch.toast_verify_mnemonic_fail'))
            this.getRandomArray()
        }
    }

    createWallet() {
        this._showLoding();
        setTimeout(() => {
            this.startCreateWallet();//创建钱包
        }, 2000);
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
            var keyObject = await KeystoreUtils.dump(password, privateKey, dk.salt, dk.iv);
            await KeystoreUtils.exportToFile(keyObject, "keystore")
            //var str = await KeystoreUtils.importFromFile(keyObject.address)
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
            this.sectionMnemonics = upsetArrayOrder(this.props.mnemonic.split(' ')).splice(0, 4);
            this.matchCorrectNum = 0
            this.getRandomArray()


            this._hideLoading()
            showToast(I18n.t('toast.create_wallet_error'));
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


    renderComponent() {
        let isShowLeftView = this.state.isShowLeftView;
        let isShowRightView = this.state.isShowRightView;
        let isCheckedNum = this.state.isCheckedNum;
        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation} onPress={() => this.backPressed()} />
                <View style={styles.contentContainer}>
                    <Image style={styles.icon} source={require('../../assets/launch/confirmWordIcon.png')} resizeMode={'center'} />
                    <Text style={styles.titleTxt}>{I18n.t('launch.confirm_mnemonic')}</Text>
                    <Text style={styles.contentTxt}>{I18n.t('launch.confirm_mnemonic_prompt')}</Text>

                    <View style={styles.vertifyBox}>
                        <View style={[styles.vertifyLeftRightView, styles.vertifyLeftView, { backgroundColor: isShowLeftView ? Colors.bg_blue_e9 : 'white' }]}></View>

                        <View style={styles.vertifyView}>
                            <View style={styles.vertifyTitle}>
                                <View style={styles.vertifyTextView}>
                                    <Text style={styles.numberText}>{this.state.number}</Text>
                                </View>
                                <View style={styles.vertifyTextView}>
                                    <Text style={styles.serialNumText}>{this.state.serialNum}</Text>
                                    <Text style={styles.serialTotalNumText}>/4</Text>
                                </View>
                            </View>
                            <View style={styles.vertifyRow}>
                                <Item itemStyle={styles.vertifyItemStyle1} text={this.state.showMnemonics[0]}
                                    onPressItem={this._onPressItem} isChecked={isCheckedNum == 0 ? true : false}></Item>
                                <Item itemStyle={styles.vertifyItemStyle2} text={this.state.showMnemonics[1]}
                                    onPressItem={this._onPressItem} isChecked={isCheckedNum == 1 ? true : false}></Item>
                            </View>
                            <View style={styles.vertifyRow}>
                                <Item itemStyle={styles.vertifyItemStyle3} text={this.state.showMnemonics[2]}
                                    onPressItem={this._onPressItem} isChecked={isCheckedNum == 2 ? true : false}></Item>
                                <Item itemStyle={styles.vertifyItemStyle4} text={this.state.showMnemonics[3]}
                                    onPressItem={this._onPressItem} isChecked={isCheckedNum == 3 ? true : false}></Item>
                            </View>
                        </View>

                        <View style={[styles.vertifyLeftRightView, styles.vertifyRightView, { backgroundColor: isShowRightView ? Colors.bg_blue_e9 : 'white' }]}></View>
                    </View>
                </View>
            </View >
        );
    }
}



class Item extends PureComponent {



    static defaultProps = {
        isChecked: false,
    }

    _onPress = () => {
        this.props.onPressItem(this.props.text)
    }

    render() {
        let isChecked = this.props.isChecked;
        return (
            <TouchableOpacity style={[styles.itemBox, { backgroundColor: isChecked ? Colors.bg_blue_55 : 'white' }, this.props.itemStyle]}
                activeOpacity={0.6}
                onPress={this._onPress}>
                <Text style={[styles.itemText, { color: isChecked ? 'white' : Colors.fontBlueColor }]}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
    walletName: state.Core.walletName,
});
const mapDispatchToProps = dispatch => ({
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName: (name) => dispatch(Actions.setWalletName(name)),
    setIsNewWallet: (isNewWallet) => dispatch(Actions.setIsNewWallet(isNewWallet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyMnemonicScreen)


