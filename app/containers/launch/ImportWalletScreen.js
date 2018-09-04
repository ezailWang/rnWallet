import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, ScrollView, KeyboardAvoidingView,TouchableOpacity, Alert, Platform, PermissionsAndroid ,Dimensions,BackHandler,Keyboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'
import * as Actions from '../../config/action/Actions'
import { connect } from 'react-redux';
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { BlueButtonBig } from '../../components/Button'
import StatusBarComponent from '../../components/StatusBarComponent';
import { androidPermission } from '../../utils/permissionsAndroid';
import Loading from '../../components/LoadingComponent';
import { showToast } from '../../utils/Toast';
import layoutConstants from '../../config/LayoutConstants'
import {BlueHeader} from '../../components/NavigaionHeader'
import {vertifyPassword,resetStringBlank ,stringTrim} from './Common'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        
        paddingTop: ScreenHeight*0.05,
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
        //alignItems:'stretch',
    },
    icon: {
        width: 48,
        height: 48,
    },
    keyboardAwareScrollView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        //alignSelf: 'stretch',
    },
    scrollView: {
        flex: 1,
    },
    titleTxt: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.fontBlueColor,
        marginBottom: 30,
    },
    inputArea: {
        height: 120,
        //textAlign:'start',
        fontSize: 16,
        lineHeight: 30,
        textAlignVertical: 'top',
    },
    inputText: {
        height: 42,
    },
    inputTextBox: {
        alignSelf: 'stretch',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        borderColor: 'rgb(241,241,241)',
        borderWidth: 1,
        color: 'rgb(146,146,146)',
        marginBottom: 10,
    },
    buttonBox: {
        //flex: 1,
        //justifyContent:'center',
        alignSelf: 'center',
        marginTop:40,
    },
    inputBox: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 42,
        color: Colors.fontGrayColor_a0,
    },
    pwdBtnOpacity: {
        height: 42,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pwdIcon: {
        height: 20,
    },
    warnTxt:{
        fontSize:11,
        color:'red',
        alignSelf:'flex-end',
        marginBottom: 10,
    },
    warnTxtHidden:{
        height:0
    }
})

class ImportWalletScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
            password: '',
            rePassword: '',
            loadingVisible: false,
            isDisabled:true,//创建按钮是否可以点击
            isShowPwdWarn:false,
            pwdWarn:'密码最少为8位，至少包含大、小写字母、数字、符号中的3种',
        }
        this.mnemonictxt = '';
        this.pwdtxt = '';
        this.rePwdtxt = '';
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.goBack();
        return true;
    }

    //验证android读写权限
    async vertifyPermissions(){
        
        if(Platform.OS === 'android'){
            var  readPermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
            if(readPermission){
                var  writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE); 
                if(writePermission){
                    this.vertifyInputData()
                } else {
                    this.stopLoading();
                    Alert.alert(
                        'warn',
                        '请允许写入内存卡权限',
                    )
                }
            } else {
                this.stopLoading()
                Alert.alert(
                    'warn',
                    '请允许读取内存卡权限',
                )
            }
        }else{
            this.vertifyInputData()
        }
    }


   //所有信息都输入完成前，“创建”按钮显示为灰色
   btnIsEnableClick(){
        this._isShowPwdWarn(false);
        if (this.mnemonictxt == ''  || this.mnemonictxt == null || this.mnemonictxt == undefined
            || this.pwdtxt == '' || this.pwdtxt == null || this.pwdtxt == undefined
            || this.rePwdtxt == '' || this.rePwdtxt == null || this.rePwdtxt == undefined ) {
            this.setState({
                isDisabled: true
            })
         }else{
            this.setState({
                isDisabled: false
            })
        }
    }

    _isShowPwdWarn(isFocus){
        let isMathPwd = '';
        if(this.pwdtxt != ''){
            isMathPwd = vertifyPassword(this.pwdtxt)
            if(isMathPwd != ''){
                this.setState({
                    isShowPwdWarn:true,
                    isDisabled: true,
                    pwdWarn:isMathPwd,
                })
            }else{
                this.setState({
                    isShowPwdWarn:false,
                    pwdWarn:'',
                })
            }  
        }else{
            if(isFocus){
                this.setState({
                    isShowPwdWarn:true,
                    isDisabled: true,
                    pwdWarn:'密码最少为8位，至少包含大、小写字母、数字、符号中的3种'
                }) 
            }
        }
    }


    async vertifyInputData(){
        Keyboard.dismiss();
        let warnMessage = '';
        let mnemonic = this.state.mnemonic;
        let pwd = this.state.password;
        let rePwd = this.state.rePassword;
        if(mnemonic == ''  || mnemonic == null || mnemonic == undefined){
            warnMessage = "请输入助记词"
        }else if(pwd == ''  || pwd == null || pwd == undefined){
            warnMessage = "请输入密码"
        }else if(rePwd == '' || rePwd == null || rePwd == undefined){
            warnMessage = "请输入重复密码"
        }else if(pwd != rePwd){
            warnMessage = "请输入一致的密码"
        }else{
            let str = stringTrim(mnemonic);
            let m =resetStringBlank(str);//将字符串中的多个空格缩减为一个空格
            let mnemonicIsOk = await walletUtils.validateMnemonic(m);//验证助记词
            if(!mnemonicIsOk){
                warnMessage='请检查助记词是否正确'
            }
        }

       if(warnMessage!=''){
            this.stopLoading()
            showToast(warnMessage)
        }else{  
            this.setState({
                loadingVisible : true,
            })
            setTimeout(()=>{
                this.importWallet();
            }, 2000);
        }
    }

    async importWallet() {
        try {
            var m = this.state.mnemonic;
            const seed = walletUtils.mnemonicToSeed(m)
            const seedHex = seed.toString('hex')
            var hdwallet = HDWallet.fromMasterSeed(seed)
            const derivePath = "m/44'/60'/0'/0/0"
            hdwallet.setDerivePath(derivePath)
            const privateKey = hdwallet.getPrivateKey()
            const checksumAddress = hdwallet.getChecksumAddressString()
            
            var password = this.state.password;
            var params = { keyBytes: 32, ivBytes: 16 }
            var dk = keythereum.create(params);
            var keyObject = await keystoreUtils.dump(password, privateKey, dk.salt, dk.iv)
            await keystoreUtils.exportToFile(keyObject, "keystore")

            this.props.generateMnemonic(this.state.mnemonic);
            this.props.setWalletAddress(checksumAddress);
            this.props.setWalletName('wallet');//保存默认的钱包名称
            var object = {
                name: 'wallet',//默认的钱包名称
                address: checksumAddress,
                extra: this.state.pwdHint,
            }
            var key = StorageKey.User
            StorageManage.save(key, object)
            this.stopLoading()
            this.props.navigation.navigate('Home')
        } catch (err) {
            this.stopLoading()
            showToast('导入助记词出错');
            console.log('createWalletErr:', err)
        }
    }
    stopLoading() {
        this.setState({
            loadingVisible: false,
        })
    }

    isOpenPwd() {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }
    isOpenRePwd() {
        this.setState({ isShowRePassword: !this.state.isShowRePassword });
    }
    render() {
        let pwdIcon = this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        let rePwdIcon = this.state.isShowRePassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        return (
            <View style={styles.container}>
                <StatusBarComponent />
                <BlueHeader navigation={this.props.navigation} />
                <KeyboardAwareScrollView style={styles.keyboardAwareScrollView}
                                             keyboardShouldPersistTaps='handled'
                                             //behavior="padding"
                                             >
                <View style={styles.contentContainer}>
                    <Image style={styles.icon} source={require('../../assets/launch/importIcon.png')} resizeMode={'center'} />
                    <Text style={styles.titleTxt}>导入钱包</Text>
                    
                        <TextInput style={[styles.inputTextBox, styles.inputArea]}
                            // returnKeyType='next' 
                            placeholder="输入助记词"
                            underlineColorAndroid='transparent'
                            selectionColor='#00bfff'
                            multiline={true}
                            onChange={(event) => {
                                this.mnemonictxt = event.nativeEvent.text;
                                this.setState({
                                    mnemonic: this.mnemonictxt
                                })
                                this.btnIsEnableClick()
                            }}>
                        </TextInput>

                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                placeholder='设置密码'
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowPassword}
                                onChange={(event) => {
                                    this.pwdtxt = event.nativeEvent.text
                                    this.setState({
                                        password: this.pwdtxt
                                    })
                                    this.btnIsEnableClick()
                                }}
                                onFocus = {() => this._isShowPwdWarn(true)}
                            />
                            <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenPwd()}>
                                <Image style={styles.pwdIcon} source={pwdIcon} resizeMode={'center'} />
                            </TouchableOpacity>
                        </View>
                        <Text style={this.state.isShowPwdWarn ? styles.warnTxt : styles.warnTxtHidden}>{this.state.pwdWarn}</Text>
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                placeholder='重复密码'
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowRePassword}
                                onChange={(event) => {
                                    this.rePwdtxt = event.nativeEvent.text;
                                    this.setState({
                                        rePassword: this.rePwdtxt
                                    })
                                    this.btnIsEnableClick()
                                }}
                            />
                            <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenRePwd()}>
                                <Image style={styles.pwdIcon} source={rePwdIcon} resizeMode={'center'} />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.buttonBox}>
                            <BlueButtonBig
                                isDisabled = {this.state.isDisabled}
                                onPress={() => this.vertifyInputData()}
                                text='导入'
                            />
                        </View>
                   
                </View>
                </KeyboardAwareScrollView>
                <Loading visible={this.state.loadingVisible}></Loading>
            </View>
        );
    }
}
//  <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}> </ScrollView>
const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(Actions.generateMnemonic(mnemonic)),
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName: (name) => dispatch(Actions.setWalletName(name)),

});
export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
