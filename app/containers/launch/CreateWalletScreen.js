import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, TextInput,TouchableOpacity ,Dimensions,Keyboard,KeyboardAvoidingView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { BlueButtonBig } from '../../components/Button';
import { Colors, FontSize } from '../../config/GlobalConfig'
import { showToast } from '../../utils/Toast';
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader'
import {vertifyPassword} from './Common' 
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteBackgroundColor,
    },
    
    keyboardAwareScrollView: {
        alignSelf: 'stretch',
        justifyContent:'center',
        alignItems: 'center',
        paddingTop:40,
    },
    contentContainer: {
        justifyContent:'center',
        width:Layout.WINDOW_WIDTH*0.9,
        alignItems:'center',
    },
    icon: {
        width: 60,
        height: 60,
        marginBottom:10,
    },
    titleTxt: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.fontBlueColor,
        marginBottom:30,
    }, 
    warnBox:{
        alignSelf: 'stretch',
        backgroundColor:Colors.bgBlue_9a,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        marginBottom:20,
    },
    itemBox:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:1, 
    },
    itemCircle:{
        width:4,
        height:4,
        borderRadius: 2,
        marginRight:6,
    },
    itemText:{
        width:Layout.WINDOW_WIDTH*0.9-10,
        color:'white',
        fontSize:13,
    },
    inputText: {
        alignSelf: 'stretch',
        height: 42,
        paddingLeft: 15,
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        color: Colors.fontGrayColor_a0,
        marginBottom: 10,
    },
    button: {
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

class CreateWalletScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            //walletName: '',
            //pwd: '',
            //rePwd: '',
            isShowPassword: false,
            isShowRePassword: false,
            isDisabled:true,//创建按钮是否可以点击
            isShowPwdWarn:false,
            pwdWarn:I18n.t('launch.password_warn'),
        }
        this.nametxt = '';
        this.pwdtxt = '';
        this.rePwdtxt = '';
        this.keyBoardIsShow = false;

        console.log('L_routeName1',this.props.navigation.state.routeName)
    }
    _addEventListener(){
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this.keyboardDidShowHandler);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this.keyboardDidHideHandler);
    }

    _removeEventListener(){
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
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
            this.props.setWalletName(this.nametxt);
            this.props.navigation.navigate('BackupWallet',{password:this.pwdtxt});
        }, (error) => {
            showToast(I18n.t('toast.create_wallet_error'))
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
                    pwdWarn:I18n.t('launch.password_warn'),
                }) 
            }    
        }
    }

    

    vertifyInputData() {
        this.hideKeyboard
        let walletName = this.nametxt;
        let pwd = this.pwdtxt;
        let rePwd = this.rePwdtxt;
        //let isMathPwd = this.vertifyPassword()
        let warnMessage = "";
        if (walletName == '' || walletName == null || walletName == undefined) {
            warnMessage = I18n.t('toast.enter_wallet_name')
        } else if (pwd == '' || pwd == null || pwd == undefined) {
            warnMessage = I18n.t('toast.enter_password')
        } else if (rePwd == '' || rePwd == null || rePwd == undefined) {
            warnMessage = I18n.t('toast.enter_repassword')
        } else if (pwd != rePwd) {
            warnMessage = I18n.t('toast.enter_same_password')
        } 
        if (warnMessage != "") {
            showToast(warnMessage);
        } else {
            this.generateMnemonic();
        }
    }

    
    

    renderComponent() {
        let pwdIcon = this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        let rePwdIcon = this.state.isShowRePassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        return (
            
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation}/>
                <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={this.hideKeyboard}>
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                                         keyboardShouldPersistTaps='handled'
                                         behavior="padding">
                <View style={styles.contentContainer}>
                
                        <Image style={styles.icon} source={require('../../assets/launch/create_icon.png')} resizeMode={'center'} />
                        <Text style={styles.titleTxt}>{I18n.t('launch.creact_wallet')}</Text>

                        <View style={styles.warnBox}>
                            <Item content={I18n.t('launch.create_wallet_warn1')}></Item>
                            <Item content={I18n.t('launch.create_wallet_warn2')}></Item>
                        </View>
                    
                        <TextInput style={styles.inputText}
                            returnKeyType='next' 
                            placeholder={I18n.t('launch.wallet_name_hint')}
                            underlineColorAndroid='transparent'
                            selectionColor='#00bfff'
                            onChange={(event) => {
                                this.nametxt = event.nativeEvent.text;
                                this.btnIsEnableClick()
                            }} />
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                returnKeyType='next' 
                                placeholder={I18n.t('launch.password_hint')}
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowPassword}
                                onChange={(event) => {
                                    this.pwdtxt = event.nativeEvent.text;
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
                
                        <BlueButtonBig
                             buttonStyle = {styles.button}
                             isDisabled = {this.state.isDisabled}
                             onPress={() => this.vertifyInputData()}
                             text={I18n.t('launch.create')}
                        />
                       
                </View>
                </KeyboardAvoidingView>
                </TouchableOpacity>
            </View>
            
        );
    }
}
//<ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}>

class Item extends PureComponent{
    static propTypes = {
        content: PropTypes.string.isRequired,
    };
    render(){
        return(
            <View style={styles.itemBox}>
                <LinearGradient colors={['#fff', '#fff', '#fff']}
                                 start={{x:0,y:0}}
                                 end={{x:1,y:1}}
                                 style={styles.itemCircle}>
                </LinearGradient>
                <Text style={styles.itemText}>{this.props.content}</Text>
            </View>
        )
    }
}



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

