import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, Alert,BackHandler, Platform, TouchableOpacity ,Dimensions,Keyboard} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { BlueButtonBig } from '../../components/Button';
import { Colors, FontSize } from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from '../../components/LoadingComponent';
import { showToast } from '../../utils/Toast';
import { BlueHeader } from '../../components/NavigaionHeader'
import {vertifyPassword} from './Common' 

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: ScreenHeight*0.05,
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
    },
    icon: {
        width: 48,
        height: 48,
    },
    titleTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.fontBlueColor,
        marginBottom: 30,
    },
    keyboardAwareScrollView: {
        flex: 1,
        backgroundColor: '#fff',
       // alignSelf: 'stretch',
    },
    scrollView: {
        flex: 1,
        alignSelf: 'stretch',
    },
    inputText: {
        alignSelf: 'stretch',
        height: 42,
        paddingLeft: 10,
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        color: Colors.fontGrayColor_a0,
        marginBottom: 10,
    },
    buttonBox: {
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

class CreateWalletScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            walletName: '',
            pwd: '',
            rePwd: '',
            isShowPassword: false,
            isShowRePassword: false,
            isDisabled:true,//创建按钮是否可以点击
            isShowPwdWarn:false,
            pwdWarn:'密码最少为8位，至少包含大、小写字母、数字、符号中的3种',
        }
        this.nametxt = '';
        this.pwdtxt = '';
        this.rePwdtxt = '';
        //this.startCreateWallet=this.startCreateWallet.bind(this);
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

    isOpenPwd() {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }

    isOpenRePwd() {
        this.setState({ isShowRePassword: !this.state.isShowRePassword });
    }

    //产生助记词
    generateMnemonic() {
        walletUtils.generateMnemonic().then((data) => {
            this.props.generateMnemonic(data)
            this.props.setWalletName(this.state.walletName);
            this.props.navigation.navigate('BackupWallet',{password:this.state.pwd});
        }, (error) => {
            showToast('创建钱包出错，请重新创建')
        })
    }

    //所有信息都输入完成前，“创建”按钮显示为灰色
    btnIsEnableClick(){ 
        this._isShowPwdWarn(false);
        if (this.nametxt == '' || this.nametxt == null || this.nametxt == undefined
            || this.pwdtxt == '' || this.pwdtxt == null || this.pwdtxt == undefined
            || this.rePwdtxt == '' || this.rePwdtxt == null || this.rePwdtxt == undefined ) {
                this.setState({
                    isDisabled: true
                })
        }else{
            this.setState({
                isDisabled: false,
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

    

    vertifyInputData() {
        Keyboard.dismiss();
        let walletName = this.state.walletName;
        let pwd = this.state.pwd;
        let rePwd = this.state.rePwd;
        //let isMathPwd = this.vertifyPassword()
        let warnMessage = "";
        if (walletName == '' || walletName == null || walletName == undefined) {
            warnMessage = "请输入钱包名称"
        } else if (pwd == '' || pwd == null || pwd == undefined) {
            warnMessage = "请输入密码"
        } else if (rePwd == '' || rePwd == null || rePwd == undefined) {
            warnMessage = "请输入重复密码"
        } else if (pwd != rePwd) {
            warnMessage = "请输入一致的密码"
        } 
        if (warnMessage != "") {
            showToast(warnMessage);
        } else {
            this.generateMnemonic();
        }
    }

    

    render() {
        let pwdIcon = this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        let rePwdIcon = this.state.isShowRePassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        return (
            <View style={styles.container}>
                <StatusBarComponent />
                <BlueHeader navigation={this.props.navigation} />
                <KeyboardAwareScrollView style={styles.keyboardAwareScrollView}
                                             keyboardShouldPersistTaps='handled'>
                <View style={styles.contentContainer}>
                    <Image style={styles.icon} source={require('../../assets/launch/createWalletIcon.png')} resizeMode={'center'} />
                    <Text style={styles.titleTxt}>创建钱包</Text>
                        <TextInput style={styles.inputText}
                            //returnKeyType='next' 
                            placeholder="钱包名称"
                            underlineColorAndroid='transparent'
                            selectionColor='#00bfff'
                            onChange={(event) => {
                                this.nametxt = event.nativeEvent.text;
                                this.setState({
                                    walletName: this.nametxt
                                })
                                this.btnIsEnableClick()
                            }} />
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                placeholder='密码'
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowPassword}
                                onChange={(event) => {
                                    this.pwdtxt = event.nativeEvent.text;
                                    this.setState({
                                        pwd: this.pwdtxt
                                    })
                                    this.btnIsEnableClick()
                                }}
                                onFocus = {() => this._isShowPwdWarn(true)}
                            />
                            <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenPwd()}>
                                <Image style={styles.pwdIcon} source={pwdIcon} resizeMode={'center'} />
                            </TouchableOpacity>

                        </View>
                        <Text style={this.state.isShowPwdWarn ?styles.warnTxt : styles.warnTxtHidden}>{this.state.pwdWarn}</Text>
                        
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                placeholder='重复密码'
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowRePassword}
                                onChange={(event) => {
                                    this.rePwdtxt = event.nativeEvent.text;
                                    this.setState({
                                        rePwd: this.rePwdtxt
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
                                text='创建'
                            />
                        </View>
                </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
//<ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}>



const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(Actions.generateMnemonic(mnemonic)),
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName: (name) => dispatch(Actions.setWalletName(name)),
    //setWalletPasswordPrompt: (passwordPrompt) => dispatch(Actions.setWalletPasswordPrompt(passwordPrompt)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateWalletScreen)

