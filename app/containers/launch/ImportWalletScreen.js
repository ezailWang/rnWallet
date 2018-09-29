import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, Animated,Keyboard, KeyboardAvoidingView,TouchableOpacity, findNodeHandle,UIManager, Platform, PermissionsAndroid ,Dimensions,BackHandler} from 'react-native';
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
import { showToast } from '../../utils/Toast';
import Layout from '../../config/LayoutConstants'
import {WhiteBgNoTitleHeader} from '../../components/NavigaionHeader'
import {vertifyPassword,resetStringBlank ,stringTrim} from './Common'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    
    keyboardAwareScrollView: {
        alignSelf: 'stretch',
        justifyContent:'center',
        alignItems: 'center',
        marginTop:20,
    },
    contentContainer: {
        width:Layout.WINDOW_WIDTH*0.9,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    titleBox:{
        alignItems: 'center',
        justifyContent:'center',
        //paddingTop:40,
       // paddingBottom:20,
    },
    icon: {
        width: 72,
        //height: 72,
        marginBottom:10,
    },
    titleTxt: {
        //fontSize: 18,
        fontWeight: '500',
        color: Colors.fontBlueColor,
    }, 
    inputArea: {
        height: 90,
        //textAlign:'start',
        fontSize: 16,
        lineHeight: 20,
        textAlignVertical: 'top',
        color: Colors.fontBlackColor_43,
    },
    inputText: {
        height: 40,
    },
    inputTextBox: {
        alignSelf: 'stretch',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        borderColor: 'rgb(241,241,241)',
        borderWidth: 1,
        color: 'rgb(146,146,146)',
        
    },
    buttonBox: {
        //flex: 1,
        //justifyContent:'center',
        alignSelf: 'center',
        marginTop:20,
    },
    inputBox: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        paddingLeft: 10,
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 40,
        color: Colors.fontBlackColor_43,
    },
    pwdBtnOpacity: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pwdIcon: {
        width:20,
        height: 20/14*9,
    },
    warnTxt:{
        fontSize:10,
        color:'red',
        alignSelf:'flex-end',
        paddingTop: 5,
        paddingLeft:10,
    },
    warnTxtHidden:{
        height:0
    }
})

class ImportWalletScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled:true,//创建按钮是否可以点击
            isShowPassword:false,
            isShowNameWarn:false,
            isShowPwdWarn:false,
            isShowRePassword:false,
            nameWarn:I18n.t('launch.enter_normative_wallet_name'),
            pwdWarn:I18n.t('launch.password_warn'),
            rePwdWarn:I18n.t('launch.enter_same_password'),

            //titleHeight : new Animated.Value(160),
            //imageHeight : new Animated.Value(72),
            //textFontSize : new Animated.Value(18),
        }
        this.nametxt = '';
        this.mnemonictxt = '';
        this.pwdtxt = '';
        this.rePwdtxt = '';
        this.keyBoardIsShow = false;    
        this.isPwdFocus = false;//密码框是否获得焦点
        this.isRePwdFocus = false;    

        this.keyboardHeight = 0
        this.textInputMarginBottom = 0;
        this.titleHeight = new Animated.Value(160)
        this.imageHeight = new Animated.Value(72)
        this.textFontSize = new Animated.Value(18)
        this.containerMarginTop = new Animated.Value(0)

       
    }



    layout(ref){
        const handle = findNodeHandle(ref)
        UIManager.measure(handle,(x,y,width,height,pageX,pageY)=>{
            console.log('L_Layout.WINDOW_HEIGHT',Layout.WINDOW_HEIGHT) 
            console.log('L_pageY',pageY) 
            if(this.keyBoardIsShow){
                this.textInputMarginBottom = Layout.WINDOW_HEIGHT-pageY -40;
            }else{
                this.textInputMarginBottom = Layout.WINDOW_HEIGHT-pageY - 40  + 160;
            }   
        })
    }

    _addEventListener(){
        super._addEventListener()
        if(Platform.OS == 'ios'){
            this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow',this.keyboardWillShowHandler);//android不监听keyboardWillShow和keyboardWillHide
            this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide',this.keyboardWillHideHandler);
        }else{
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this.keyboardDidShowHandler);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this.keyboardDidHideHandler);
        }   
    }

    _removeEventListener(){
        super._removeEventListener()
        if(Platform.OS == 'ios'){
            this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
            this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
        }else{
            this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener && this.keyboardDidHideListener.remove(); 
        }   
    }

    keyboardWillShowHandler=(event)=>{
        console.log('L_willShow','willShow')
        this.keyBoardIsShow = true;
        let duration = event.duration;
        this.keyboardHeight = event.endCoordinates.height;//软键盘高度

       let t = this.textInputMarginBottom - this.keyboardHeight;
        console.log('L_textInputMarginBottom',this.textInputMarginBottom) 
        console.log('L_keyboardHeight',this.keyboardHeight) 
        console.log('L_I',t)
        if(this.isRePwdFocus && t < 0 ){       
            this.titleBoxAnimated(duration,t,0,0,0)
        }else{
            this.titleBoxAnimated(duration,0,0,0,0)
        }
        
    }

    keyboardWillHideHandler=(event)=>{
        console.log('L_willHide','willHide')
        this.keyBoardIsShow = false;
        this._isShowRePwdWarn();
        this.keyboardHeight = 0;
        let duration = event.duration;
        this.titleBoxAnimated(duration,0,160,72,18)   
    }

    keyboardDidShowHandler=(event)=>{
        //console.log('L_didShow','didShow')
        this.keyBoardIsShow = true;
        //'event', 
        let duration = 100;
        this.keyboardHeight = event.endCoordinates.height;
        
        let t = this.textInputMarginBottom - this.keyboardHeight;
        console.log('L_textInputMarginBottom',this.textInputMarginBottom) 
        console.log('L_keyboardHeight',this.keyboardHeight) 
        console.log('L_I',t)
        if(this.isRePwdFocus && t < 0 ){       
            this.titleBoxAnimated(duration,t,0,0,0)
        }else{
            this.titleBoxAnimated(duration,0,0,0,0)
        }
        
    }

    keyboardDidHideHandler=(event)=>{
        //console.log('L_didHide','didHide')
        this.keyBoardIsShow = false;
        this._isShowRePwdWarn();
        let duration = 100;
        this.keyboardHeight = 0;
        this.titleBoxAnimated(duration,0,160,72,18)  
    }

    titleBoxAnimated(duration,marginTopToValue,titleToValue,imageToValue,textToValue){
        Animated.parallel([
            Animated.timing(this.containerMarginTop,{
                duration:duration,
                toValue:marginTopToValue
            }),
            Animated.timing(this.titleHeight,{
                duration:duration,
                toValue:titleToValue
            }),
            Animated.timing(this.imageHeight,{
                duration:duration,
                toValue:imageToValue
            }),
            Animated.timing(this.textFontSize,{
                duration:duration,
                toValue:textToValue
            }),
        ]).start();   
    }

    /*hideKeyboard = () => {
        if(this.keyBoardIsShow){
            Keyboard.dismiss();
        }
    }*/

    
   //所有信息都输入完成前，“创建”按钮显示为灰色
   btnIsEnableClick(){
        if (this.mnemonictxt == ''|| this.nametxt == '' || this.pwdtxt == ''|| this.rePwdtxt == '' || this.pwdtxt != this.rePwdtxt
              || vertifyPassword(this.pwdtxt) != '' || this.nametxt.length > 12) {
                this.setState({
                    isDisabled: true,
                    isShowRePwdWarn : this.pwdtxt == this.rePwdtxt ? false : this.state.isShowRePwdWarn,
                    isShowNameWarn: (this.nametxt == '' || this.nametxt.length > 12) ? true : false,
                }) 
        }else{
            this.setState({
                isDisabled: false,
                isShowRePwdWarn: false,
                isShowNameWarn: false,
            })
        }  
    }

    _isShowRePwdWarn(){
        if(this.pwdtxt != '' &&  !this.state.isShowPwdWarn && this.rePwdtxt != '' 
            && this.pwdtxt != this.rePwdtxt){
            if(!this.state.isShowRePwdWarn){
                this.setState({
                    isShowRePwdWarn: true,
                })
            }
        }else{
            if(this.state.isShowRePwdWarn){
                this.setState({
                    isShowRePwdWarn: false,
                })
            }
        }
    }

    _isShowPwdWarn(){
        let isMatchPwd = '';
        if(this.pwdtxt != ''){
            isMatchPwd = vertifyPassword(this.pwdtxt)
            if(isMatchPwd != ''){//密码不匹配
                this.setState({
                    isShowPwdWarn:true,
                    isDisabled: true,
                    pwdWarn:isMatchPwd,
                })
            }else{//密码匹配
                this.setState({
                    isShowPwdWarn:false,
                    pwdWarn:'',
                })
                this.btnIsEnableClick()
            }  
        }else{
            this.setState({
                isShowPwdWarn:true,
                isDisabled: true,
                pwdWarn:I18n.t('launch.password_warn'),
            })    
        }
    }



    async vertifyInputData(){
        Keyboard.dismiss();
        let warnMessage = '';
        let mnemonic = this.mnemonictxt;
        let pwd = this.pwdtxt;
        let rePwd = this.rePwdtxt;
        if(mnemonic == ''){
            warnMessage = I18n.t('toast.enter_mnemonic')
        }else if(pwd == ''){
            warnMessage = I18n.t('toast.enter_password')
        }else if(rePwd == ''){
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
            this._hideLoading()
            showToast(warnMessage)
        }else{  
            this._showLoding();
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
            const checksumAddress = hdwallet.getChecksumAddressString(); 
            
            var password = this.pwdtxt;
            var params = { keyBytes: 32, ivBytes: 16 }
            var dk = keythereum.create(params);
            var keyObject = await keystoreUtils.dump(password, privateKey, dk.salt, dk.iv); 
            await keystoreUtils.exportToFile(keyObject, "keystore")

            this.props.generateMnemonic(this.mnemonictxt);
            this.props.setWalletAddress(checksumAddress);
            this.props.setWalletName(this.nametxt);//保存默认的钱包名称
            var object = {
                name: this.nametxt,
                address: checksumAddress,
                extra: '',
            }
            var key = StorageKey.User
            StorageManage.save(key, object)
            this._hideLoading()
            this.props.navigation.navigate('Home')
        } catch (err) {
            this._hideLoading()
            showToast(I18n.t('toast.import_mnemonic_error'));
            console.log('createWalletErr:', err)
        }
    }
   
    getRePwdMeasure(){
        rePwdRef.measure()
    } 
    

    isOpenPwd() {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }
    isOpenRePwd() {
        this.setState({ isShowRePassword: !this.state.isShowRePassword });
    }
    renderComponent() {
        let pwdIcon = this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        let rePwdIcon = this.state.isShowRePassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        //let titleText = this.keyBoardIsShow ? '' : I18n.t('launch.import_wallet');
        //let titleIcon = this.keyBoardIsShow ? null : require('../../assets/launch/importIcon.png');

        let titleText =  I18n.t('launch.import_wallet');
        let titleIcon = require('../../assets/launch/importIcon.png');
        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation}/>
                {/*<TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={this.hideKeyboard}>
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                                         keyboardShouldPersistTaps='handled'
        behavior="padding">*/}
                <Animated.View style={[styles.contentContainer,{marginTop:this.containerMarginTop}]}> 
                        
                        <Animated.View style={[styles.titleBox,{height:this.titleHeight}]}>
                              <Animated.Image style={[styles.icon,{height:this.imageHeight}]}  source={titleIcon} resizeMode={'contain'} />
                              <Animated.Text style={[styles.titleTxt,{fontSize:this.textFontSize}]}>{titleText}</Animated.Text>
                        </Animated.View>
                    
                        <View style={styles.inputTextBox}>
                            <TextInput style={[styles.inputArea]}
                                returnKeyType='next'
                                placeholder={I18n.t('launch.input_mnemonic_hint')}
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                multiline={true}
                                // defaultValue={'violin stamp exist price hard coyote cream decide solution cargo sign mixture'}
                                onChange={(event) => {
                                     this.mnemonictxt = event.nativeEvent.text;
                                     this.btnIsEnableClick()
                                }}>
                            </TextInput>
                        </View>
                        <View style={styles.inputBox} >
                            <TextInput style={styles.input}
                                returnKeyType='next' 
                                placeholder={I18n.t('launch.wallet_name_hint')}
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                onChange={(event) => {
                                    this.nametxt = event.nativeEvent.text;
                                    this.btnIsEnableClick()
                                }} 
                                onFocus = {() => {this.btnIsEnableClick(); }}/>
                        </View>  
                        <Text style={this.state.isShowNameWarn ?styles.warnTxt : styles.warnTxtHidden}>{this.state.nameWarn}</Text> 
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                returnKeyType='next'
                                placeholder={I18n.t('launch.set_password_hint')}
                                underlineColorAndroid='transparent'
                                selectionColor='#00bfff'
                                secureTextEntry={!this.state.isShowPassword}
                                onChange={(event) => {
                                    this.pwdtxt = event.nativeEvent.text
                                    this._isShowPwdWarn()
                                }}
                                onFocus = {() => {this.isPwdFocus = true;this._isShowPwdWarn()}}
                                onBlur = {() => {this.isPwdFocus = false}}
                            />
                            <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenPwd()}>
                                <Image style={styles.pwdIcon} source={pwdIcon} resizeMode={'center'} />
                            </TouchableOpacity>
                        </View>
                        <Text style={this.state.isShowPwdWarn ? styles.warnTxt : styles.warnTxtHidden}>{this.state.pwdWarn}</Text>
                        <View style={styles.inputBox} ref="rePwdRef">
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
                                onFocus = {() => {this.isRePwdFocus = true;this.layout(this.refs.rePwdRef)}}
                                onBlur = {() => {this.isRePwdFocus = false;this._isShowRePwdWarn()}}
                            />
                            <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenRePwd()}>
                                <Image style={styles.pwdIcon} source={rePwdIcon} resizeMode={'center'} />
                            </TouchableOpacity>

                        </View>
                        <Text style={this.state.isShowRePwdWarn ? styles.warnTxt : styles.warnTxtHidden}>{this.state.rePwdWarn}</Text>
                        <BlueButtonBig
                                buttonStyle = {styles.buttonBox}
                                isDisabled = {this.state.isDisabled}
                                onPress={() => this.vertifyInputData()}
                                text={I18n.t('launch.import')}
                        />
                </Animated.View>
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
