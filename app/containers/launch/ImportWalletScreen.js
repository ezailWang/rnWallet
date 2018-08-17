import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,ScrollView,TouchableOpacity,Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'
import * as Actions from '../../config/action/Actions'
import { connect } from 'react-redux';
import {Colors} from '../../config/GlobalConfig'
import {BlueButtonBig} from '../../components/Button'
import StatusBarComponent from '../../components/StatusBarComponent';
import {resetStringBlank}  from '../../containers/launch/Common';
import Loading from '../../components/LoadingComponent';

import {showToast} from '../../utils/Toast';
const styles = StyleSheet.create({
    box:{
        flex:1
    },
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.backgroundColor,
        paddingTop:40,
        paddingLeft:20,
        paddingRight:20,
        //alignItems:'stretch',
    },
    icon:{
        width:48,
        height:48,
    },
    scrollView:{
        flex:1,
        alignSelf:'stretch',
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:'rgb(85,146,246)',
        marginTop:15,
        marginBottom:30,
    },
    inputArea:{
        height:120,
        //textAlign:'start',
        fontSize:16,
        lineHeight:30,
        textAlignVertical:'top',
    },
    inputText:{
        height:42,
    },
    inputTextBox:{
        alignSelf:'stretch',
        paddingLeft:15,
        paddingRight:15,
        borderRadius:5,
        borderColor:'rgb(241,241,241)',
        borderWidth:1,
        color:'rgb(146,146,146)',
        marginBottom:10,
    },
    buttonBox:{
        flex:1,
        //justifyContent:'center',
        alignSelf:'center',
    },
    inputBox:{
        alignSelf:'stretch',
        flexDirection:'row',
        alignItems:'center',
        height:42,
        borderRadius:5,
        borderColor:Colors.borderColor_e,
        borderWidth:1,
        paddingLeft:10,
        marginBottom:10,
    },
    input:{
        flex:1,
        height:42,
        color:Colors.fontGrayColor_a0,
    },
    pwdBtnOpacity:{
        height:42,
        width:42,
        justifyContent:'center',
        alignItems:'center'
    },
    pwdIcon:{
        height:20,
    },
})

class ImportWalletScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            mnemonic:'',
            password:'',
            rePassword:'',
            passwordHint:'',
            loadingVisible:false,
        }
    }

    vertifyInputData(){
        
       console.log('L',this.state.mnemonic)
       const m =resetStringBlank(this.state.mnemonic);//将字符串中的多个空格缩减为一个空格
      // const m = await walletUtils.generateMnemonic()
       var mnemonicIsOK =  walletUtils.validateMnemonic(m);//验证助记词
       var warnMessage = '';
       console.log('L_mnemonicIsOK',mnemonicIsOK+'')
       if(mnemonicIsOK){
             if(this.state.password == ''  || this.state.password == null || this.state.password == undefined){
                  warnMessage = "请输入密码"
             }else if(this.state.rePassword == '' || this.state.rePassword == null || this.state.rePassword == undefined){
                  warnMessage = "请输入重复密码"
             }else if(this.state.password != this.state.rePassword){
                  warnMessage = "请输入一致的密码"
             }
       }else{
          warnMessage='请输入正确的助记词'
       }
       if(warnMessage!=''){
            showToast(warnMessage)
        }else{
            this.importWallet();
        }
    }
    
    async importWallet(){ 
       
        try{
            this.setState({
                loadingVisible : true,
            })
             //console.log('L','开始导入')
             var m =  this.state.mnemonic;
             const seed = walletUtils.mnemonicToSeed(m)
             const seedHex = seed.toString('hex')
             var hdwallet = HDWallet.fromMasterSeed(seed)
             const derivePath = "m/44'/60'/0'/0/0"
             hdwallet.setDerivePath(derivePath)
             const privateKey = hdwallet.getPrivateKey()
             const checksumAddress = hdwallet.getChecksumAddressString()
             //console.log('L3_prikey:', hdwallet.getPrivateKeyString())
            // console.log('L4_address:', checksumAddress)
             var object = {
                name: 'wallet',//默认的钱包名称
                address: checksumAddress,
                extra: this.state.pwdHint,
             }
             var key = 'uesr'
             StorageManage.save(key, object)
            //var loadRet = await StorageManage.load(key)
            //console.log('L5_user:', loadRet)
        
            var password = this.state.password;
            //console.log('L6_password:', password)
            var params = { keyBytes: 32, ivBytes: 16 }
            var dk = keythereum.create(params);
            var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv)
            //console.log('L7_keyObject:', keyObject)
            await keystoreUtils.exportToFile(keyObject, "keystore")
            //var str = await keystoreUtils.importFromFile(keyObject.address)
            //var newKeyObject = JSON.parse(str)
            // console.log('L8_newKeyObject', newKeyObject)
            this.props.generateMnemonic(this.state.mnemonic);
            this.props.setWalletAddress(checksumAddress);
            this.props.setWalletName('wallet');//保存默认的钱包名称
            //console.log('L9', '完成')   
            
       }catch (err) {
            showToast(err);
            console.log('createWalletErr:', err)
       }finally{
            this.setState({
                loadingVisible : false,
            })  
       }
    }

    isOpenPwd() {
        this.setState({isShowPassword: !this.state.isShowPassword});
    }

    isOpenRePwd() {
        this.setState({isShowRePassword: !this.state.isShowRePassword});
    }

    
    render() {
        let pwdIcon= this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        let rePwdIcon= this.state.isShowRePassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        return (
           
            <View style={styles.container}>
                
                <StatusBarComponent/>
                <Image style={styles.icon} source={require('../../assets/launch/importIcon.png')} resizeMode={'center'}/>
                <Text style={styles.titleTxt}>导入钱包</Text>
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}>
                <TextInput style={[styles.inputTextBox,styles.inputArea]} 
                          // returnKeyType='next' 
                           placeholder="输入助记词"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           multiline={true}
                           onChange={(event) => {
                                 this.setState({
                                     mnemonic: event.nativeEvent.text
                                 })
                           }}>
                </TextInput>
               
                

                 <View style={styles.inputBox}> 
                    <TextInput style={styles.input} 
                           placeholder='设置密码'
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           secureTextEntry={!this.state.isShowPassword} 
                           onChange={(event) => {
                                this.setState({
                                    password: event.nativeEvent.text
                                })
                           }}
                    />
                    <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress = {()=>this.isOpenPwd() }>
                         <Image style={styles.pwdIcon} source={pwdIcon} resizeMode={'center'}/>
                    </TouchableOpacity>
                    
                </View>   

                <View style={styles.inputBox}> 
                    <TextInput style={styles.input} 
                           placeholder='重复密码'
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           secureTextEntry={!this.state.isShowRePassword} 
                           onChange={(event) => {
                                this.setState({
                                    rePassword: event.nativeEvent.text
                                })
                           }}
                    />
                    <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress = {()=>this.isOpenRePwd() }>
                         <Image style={styles.pwdIcon} source={rePwdIcon} resizeMode={'center'}/>
                    </TouchableOpacity>
                    
                </View> 
                <TextInput style={[styles.inputTextBox,styles.inputText,{marginBottom:40}]} 
                          // returnKeyType='next' 
                           placeholder="密码提示(选填)"
                           underlineColorAndroid='transparent' 
                           secureTextEntry={true}
                           onChange={(event) => {
                            this.setState({
                                passwordHint: event.nativeEvent.text
                            })
                           }}>
                </TextInput>
                <View style={styles.buttonBox}>
                          <BlueButtonBig
                                onPress = {()=> this.vertifyInputData()}
                                text = '导入'
                          />
                </View> 
                </ScrollView>
                <Loading visible={this.state.loadingVisible}/> 
            </View>  
                    
           
        );
    }
}

const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(Actions.generateMnemonic(mnemonic)),
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName:(name) => dispatch(Actions.setWalletName(name))
});
export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)


