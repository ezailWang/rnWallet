import React, { PureComponent, Component } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Vibration, TouchableOpacity } from 'react-native';
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
import StaticLoading from '../../components/StaticLoading'
import BaseComponent from '../../containers/base/BaseComponent'
import PropTypes from 'prop-types';
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



    scrollViewStyle: {
        flexDirection: 'row',
        marginTop: 40,
        width: Layout.WINDOW_WIDTH,
        height: 220,
    },
    itemBox: {
        flexDirection: 'row',
        width: Layout.WINDOW_WIDTH,
        height: 220,
        alignItems: 'center',
    },
    itemLeftRightView: {
        width: 25,
        height: 180,
    },
    itemLeftView: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    itemRightView: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },

    itemView: {
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
    itemTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 30,
        marginBottom: 40,
    },
    itemTextView: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: 0,
        paddingBottom: 0
    },
    itemNumberText: {
        fontWeight: '600',
        fontSize: 26,
        color: 'white',
        alignItems: 'flex-end'
    },

    itemSerialNumText: {
        fontWeight: '600',
        fontSize: 26,
        color: 'white',
    },
    itemSerialTotalNumText: {
        fontWeight: '600',
        fontSize: 15,
        color: 'white',
        marginBottom: 2,
    },
    itemRow: {
        flexDirection: 'row',
    },
    itemBtnStyle1: {
        marginRight: 10,
    },
    itemBtnStyle2: {
        marginLeft: 10,
    },
    itemBtnStyle3: {
        marginTop: 15,
        marginRight: 10,
    },
    itemBtnStyle4: {
        marginTop: 15,
        marginLeft: 10,
    },

    itemBtnBox: {
        flex: 1,
        height: 40,
        borderRadius: 20,
    },

    itemBtnText: {
        height: 40,
        lineHeight: 40,
        color: Colors.fontDarkGrayColor,
        fontSize: 15,
        textAlign: 'center',
    },


})

class VerifyMnemonicScreen extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            randomSectionMnemonics: [],//4个单词匹配的四组单词
            numberArray: [],
            checkedNums: [],
            isShowSLoading: false,
            sLoadingContent: '',
            a: false,

        }

        this.mnemonics = [];
        this.sectionMnemonics = [];//需要验证的4个单词
        this.matchCorrectNum = 0;//已经验证正确的单词的个数
        this.wordList = [];
        this.scrollToX = 0;


        this.timeInterval = null;
        this.timeIntervalCount = 0;
    }

    _initData() {
        this.mnemonics = this.props.mnemonic.split(' ');
        //console.log("L_mnemonics", this.mnemonics)
        this.initAllData()
    }

    initAllData() {
        this.scrollToX = 0;
        this.sectionMnemonics = upsetArrayOrder(this.props.mnemonic.split(' ')).splice(0, 4);
        this.wordList = upsetArrayOrder(bip39.wordlists.english).splice(0, 100);
        this.matchCorrectNum = 0
        this.getRandomArray();
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    }


    getRandomArray() {
        let randomSectionMnemonics = [];
        let numberArray = [];
        for (let i = 0; i < this.sectionMnemonics.length; i++) {
            let arr = [];
            let word = this.sectionMnemonics[i].toLowerCase()
            arr.push(word)
            do {
                let i = Math.floor(Math.random() * (1 - 100) + 100);//获取1-100的随机数
                let w = this.wordList[i - 1].toLowerCase();
                let isExist = false;
                for (let j = 0; j < arr.length; j++) {
                    if (w == arr[j].toLowerCase()) {
                        isExist = true
                        break
                    }
                }
                if (!isExist) {
                    arr.push(w)
                }

            } while (arr.length < 3)


            do {
                let i = Math.floor(Math.random() * (1 - 12) + 12);//获取1-12的随机数
                let w = upsetArrayOrder(this.props.mnemonic.split(' '))[i - 1].toLowerCase();
                let isExist = false;
                for (let j = 0; j < arr.length; j++) {
                    if (w == arr[j].toLowerCase()) {
                        isExist = true
                        break
                    }
                }
                if (!isExist) {
                    arr.push(w)
                }

            } while (arr.length < 4)


            let usm = upsetArrayOrder(arr)
            let n = this.mnemonics.indexOf(word) + 1

            randomSectionMnemonics.push(usm)
            numberArray.push('#' + n)
        }

        this.setState({
            checkedNums: [-1, -1, -1, -1],
            randomSectionMnemonics: randomSectionMnemonics,//4个单词匹配的四组单词
            numberArray: numberArray,
        })
    }

    _onPressItem = (text, num) => {

        let word = this.sectionMnemonics[num].toLowerCase()
        let checkedNumIndex = this.state.randomSectionMnemonics[num].indexOf(text);
        let checkedNums = this.state.checkedNums;
        //checkedNum.splice(checkedNumIndex,1,checkedNumIndex);
        checkedNums[num] = checkedNumIndex;
        /*this.setState(Object.assign({}, this.state, {
            checkedNums : checkedNums
        }));*/
        this.setState({
            checkedNums: [].concat(checkedNums)
        });
        

        if (text.toLowerCase() == word) {
            this.matchCorrectNum = this.matchCorrectNum + 1;
            Vibration.vibrate([0, 20], false)
            if (this.matchCorrectNum < 4) {
                //滑动到下一块
                this.scrollToX = this.scrollToX + Layout.WINDOW_WIDTH;
                this.scroll.scrollTo({ x: this.scrollToX, y: 0, animated: true });
            } else {
                //showToast(I18n.t('launch.modal_mnemonic_success'))
                //验证成功，开始创建钱包
                this.timeIntervalCount = 0;
                this.timeInterval = setInterval(() => {
                    this.timeIntervalCount = this.timeIntervalCount + 1;
                    this.changeLoading(this.timeIntervalCount)
                }, 500);
            }
        } else {
            //验证失败
            Vibration.vibrate([0, 100], false)
            showToast(I18n.t('launch.toast_verify_mnemonic_fail'),0)

            this.initAllData()
        }
    }

    changeLoading(num) {
        let content = '';
        if (num == 1) {
            content = I18n.t('launch.start_create_wallet')
        } else if (num == 2) {
            content = I18n.t('launch.generating_key_pairs')
        } else {
            content = I18n.t('launch.generating_keystore_file')
        }
        this.setState({
            isShowSLoading: true,
            sLoadingContent: content
        })
        if (num == 3) {
            clearInterval(this.timeInterval)
            setTimeout(() => {
                this.startCreateWallet();
            }, 0);

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

            this.setState({
                isShowSLoading: false
            })

            this._openAppVerifyIdentidy = false
            this.props.navigation.navigate('Home')
        } catch (err) {
        
            this.setState({
                isShowSLoading: false
            })

            showToast(I18n.t('toast.create_wallet_error'),0);
            this.initAllData()
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

    _closeModal() {
        this.setState({
            isShowSLoading: false,
        })
    }


    renderComponent() {
        let numberArray = this.state.numberArray;
        let rSMnemonics = this.state.randomSectionMnemonics;
        let checkedNums = this.state.checkedNums;

        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation} onPress={() => this.backPressed()} />
                <StaticLoading
                    visible={this.state.isShowSLoading}
                    content={this.state.sLoadingContent}
                ></StaticLoading>
                <View style={styles.contentContainer}>
                    <Image style={styles.icon} source={require('../../assets/launch/confirmWordIcon.png')} resizeMode={'center'} />
                    <Text style={styles.titleTxt}>{I18n.t('launch.confirm_mnemonic')}</Text>
                    <Text style={styles.contentTxt}>{I18n.t('launch.confirm_mnemonic_prompt')}</Text>

                    <ScrollView
                        ref={(scroll) => {
                            this.scroll = scroll;
                        }}
                        style={styles.scrollViewStyle}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                    >

                        <Item number={numberArray[0]} serialNum={1} randomMnemonics={rSMnemonics[0]} onPressItem={this._onPressItem} checkedNum={checkedNums[0]} isShowLeftView={false}></Item>
                        <Item number={numberArray[1]} serialNum={2} randomMnemonics={rSMnemonics[1]} onPressItem={this._onPressItem} checkedNum={checkedNums[1]}></Item>
                        <Item number={numberArray[2]} serialNum={3} randomMnemonics={rSMnemonics[2]} onPressItem={this._onPressItem} checkedNum={checkedNums[2]}></Item>
                        <Item number={numberArray[3]} serialNum={4} randomMnemonics={rSMnemonics[3]} onPressItem={this._onPressItem} checkedNum={checkedNums[3]} isShowRightView={false}></Item>

                    </ScrollView>
                </View>
            </View >
        );
    }
}


class Item extends PureComponent {

    static propTypes = {
        number: PropTypes.string.isRequired,
        serialNum: PropTypes.number.isRequired,
        randomMnemonics: PropTypes.array.isRequired,
        checkedNum: PropTypes.number.isRequired,
        isShowLeftView: PropTypes.bool,
        isShowRightView: PropTypes.bool,

    };
    static defaultProps = {
        isShowLeftView: true,
        isShowRightView: true,
        randomMnemonics: ['', '', '', ''],
        serialNum: 1,
        number: '#0',
        checkedNum: -1,
    }

    constructor(props) {
        super(props);
    }

    _onPress = (text) => {
        this.props.onPressItem(text, this.props.serialNum - 1)
    }

    render() {
        let isShowLeftView = this.props.isShowLeftView;
        let isShowRightView = this.props.isShowRightView;
        let randomMnemonics = this.props.randomMnemonics;
        let checkedNum = this.props.checkedNum;
   


        return (
            <View style={styles.itemBox}>
                <View style={[styles.itemLeftRightView, styles.itemLeftView, { backgroundColor: isShowLeftView ? Colors.bg_blue_e9 : 'white' }]}></View>

                <View style={styles.itemView}>
                    <View style={styles.itemTitle}>
                        <View style={styles.itemTextView}>
                            <Text style={styles.itemNumberText}>{this.props.number}</Text>
                        </View>
                        <View style={styles.itemTextView}>
                            <Text style={styles.itemSerialNumText}>{this.props.serialNum}</Text>
                            <Text style={styles.itemSerialTotalNumText}>/4</Text>
                        </View>
                    </View>
                    <View style={styles.itemRow}>
                        <ItemButtom itemBtnStyle={styles.itemBtnStyle1} text={randomMnemonics[0]}
                            onPressItem={this._onPress} isChecked={checkedNum == 0 ? true : false}></ItemButtom>
                        <ItemButtom itemBtnStyle={styles.itemBtnStyle2} text={randomMnemonics[1]}
                            onPressItem={this._onPress} isChecked={checkedNum == 1 ? true : false}></ItemButtom>
                    </View>
                    <View style={styles.itemRow}>
                        <ItemButtom itemBtnStyle={styles.itemBtnStyle3} text={randomMnemonics[2]}
                            onPressItem={this._onPress} isChecked={checkedNum == 2 ? true : false}></ItemButtom>
                        <ItemButtom itemBtnStyle={styles.itemBtnStyle4} text={randomMnemonics[3]}
                            onPressItem={this._onPress} isChecked={checkedNum == 3 ? true : false}></ItemButtom>
                    </View>
                </View>

                <View style={[styles.itemLeftRightView, styles.itemRightView, { backgroundColor: isShowRightView ? Colors.bg_blue_e9 : 'white' }]}></View>
            </View>
        )
    }
}


class ItemButtom extends PureComponent {

    static defaultProps = {
        isChecked: false,
    }

    _onPress = () => {
        this.props.onPressItem(this.props.text)
    }

    render() {
        let isChecked = this.props.isChecked;
        return (
            <TouchableOpacity style={[styles.itemBtnBox, { backgroundColor: isChecked ? Colors.bg_blue_55 : 'white' }, this.props.itemBtnStyle]}
                activeOpacity={0.6}
                onPress={this._onPress}>
                <Text style={[styles.itemBtnText, { color: isChecked ? 'white' : Colors.fontBlueColor }]}>{this.props.text}</Text>
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


