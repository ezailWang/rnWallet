import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, Animated,Keyboard, KeyboardAvoidingView,TouchableOpacity, Alert, Platform, PermissionsAndroid ,Dimensions,BackHandler} from 'react-native';
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
import { I18n } from '../../config/language/i18n'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    
    keyboardAwareScrollView: {
        alignSelf: 'stretch',
        justifyContent:'center',
        alignItems: 'center',
        marginTop:40,
    },
    contentContainer: {
        alignSelf:'stretch',
        alignItems: 'center',
        justifyContent:'center',
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
    },
    icon: {
        width: 48,
        height: 48,
    },
    titleTxt: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.fontBlueColor,
        marginBottom:30,
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
        fontSize:10,
        color:'red',
        alignSelf:'flex-end',
        marginBottom: 10,
        paddingLeft:10,
    },
    warnTxtHidden:{
        height:0
    }
})

class ImportWalletScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //mnemonic: '',
            //password: '',
            //rePassword: '',
            loadingVisible: false,
            isDisabled:true,//创建按钮是否可以点击
            isShowPwdWarn:false,
            isShowPassword:false,
            isShowRePassword:false,
            pwdWarn:I18n.t('launch.password_warn'),
        }
        this.mnemonictxt = '';
        this.pwdtxt = '';
        this.rePwdtxt = '';
        this.keyBoardIsShow = false;
        
    }

    componentWillMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this.keyboardDidShowHandler);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this.keyboardDidHideHandler);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    }
    onBackPressed=()=>{ 
        console.log('L_back',"onBackPressed")
        this.props.navigation.goBack();
        return true;
    }
    keyboardDidShowHandler=(event)=>{
        this.keyBoardIsShow = true;
    }
    keyboardDidHideHandler=(event)=>{
        this.keyBoardIsShow = false;
    }
    hideKeyboard = () => {
        if(this.keyBoardIsShow){
            Keyboard.dismiss();
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
                    pwdWarn:I18n.t('launch.password_warn')
                }) 
            }
        }
    }


    async vertifyInputData(){
        Keyboard.dismiss();
        let warnMessage = '';
        let mnemonic = this.mnemonictxt;
        let pwd = this.pwdtxt;
        let rePwd = this.rePwdtxt;
        if(mnemonic == ''  || mnemonic == null || mnemonic == undefined){
            warnMessage = I18n.t('toast.enter_mnemonic')
        }else if(pwd == ''  || pwd == null || pwd == undefined){
            warnMessage = I18n.t('toast.enter_password')
        }else if(rePwd == '' || rePwd == null || rePwd == undefined){
            warnMessage = I18n.t('toast.enter_repassword')
        }else if(pwd != rePwd){
            warnMessage = I18n.t('toast.enter_same_password')
        }else{
            let str = stringTrim(mnemonic);
            let m =resetStringBlank(str);//将字符串中的多个空格缩减为一个空格
            let mnemonicIsOk = await walletUtils.validateMnemonic(m);//验证助记词
            if(!mnemonicIsOk){
                warnMessage = I18n.t('toast.check_mnemonic_is_correct')
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
            //var m = this.mnemonictxt;
            const seed = walletUtils.mnemonicToSeed(this.mnemonictxt)
            const seedHex = seed.toString('hex')
            var hdwallet = HDWallet.fromMasterSeed(seed)
            const derivePath = "m/44'/60'/0'/0/0"
            hdwallet.setDerivePath(derivePath)
            const privateKey = hdwallet.getPrivateKey()
            const checksumAddress = hdwallet.getChecksumAddressString()
            
            var password = this.pwdtxt;
            var params = { keyBytes: 32, ivBytes: 16 }
            var dk = keythereum.create(params);
            var keyObject = await keystoreUtils.dump(password, privateKey, dk.salt, dk.iv)
            await keystoreUtils.exportToFile(keyObject, "keystore")

            this.props.generateMnemonic(this.mnemonictxt);
            this.props.setWalletAddress(checksumAddress);
            this.props.setWalletName('wallet');//保存默认的钱包名称
            var object = {
                name: 'wallet',//默认的钱包名称
                address: checksumAddress,
                extra: '',
            }
            var key = StorageKey.User
            StorageManage.save(key, object)
            this.stopLoading()
            this.props.navigation.navigate('Home')
        } catch (err) {
            this.stopLoading()
            showToast(I18n.t('toast.import_mnemonic_error'));
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
                <StatusBarComponent  barStyle='light-content'/>
                <BlueHeader navigation={this.props.navigation} />
                <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={this.hideKeyboard}>
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                                         keyboardShouldPersistTaps='handled'
                                         behavior="padding">
                <View style={styles.contentContainer}> 
                        <Image style={styles.icon}  source={require('../../assets/launch/importIcon.png')} resizeMode={'center'} />
                        <Text style={styles.titleTxt}>{I18n.t('launch.import_wallet')}</Text>
                   
                    
                        <TextInput style={[styles.inputTextBox, styles.inputArea]}
                            returnKeyType='next'
                            placeholder={I18n.t('launch.input_mnemonic_hint')}
                            underlineColorAndroid='transparent'
                            selectionColor='#00bfff'
                            multiline={true}
                            onChange={(event) => {
                                this.mnemonictxt = event.nativeEvent.text;
                                this.btnIsEnableClick()
                            }}>
                        </TextInput>
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                returnKeyType='next'
                                placeholder={I18n.t('launch.set_password_hint')}
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowPassword}
                                onChange={(event) => {
                                    this.pwdtxt = event.nativeEvent.text
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
                                returnKeyType='done'
                                placeholder={I18n.t('launch.re_password_hint')}
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowRePassword}
                                onChange={(event) => {
                                    this.rePwdtxt = event.nativeEvent.text;
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
                                text={I18n.t('launch.import')}
                            />
                        </View>
                </View>
                </KeyboardAvoidingView>
                </TouchableOpacity>
                <Loading visible={this.state.loadingVisible}></Loading>
            </View>
        );
    }
}
//  <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}> </ScrollView>
/****/
const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(Actions.generateMnemonic(mnemonic)),
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName: (name) => dispatch(Actions.setWalletName(name)),

});
export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
