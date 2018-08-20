import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,Alert,ScrollView,Platform,PermissionsAndroid,TouchableOpacity} from 'react-native';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'

import {androidPermission}  from '../../utils/permissionsAndroid';

import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from '../../components/LoadingComponent';
import {showToast} from '../../utils/Toast';

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:40,
        paddingLeft:20,
        paddingRight:20,
    },
    icon:{
        width:48,
        height:48,
    },
    titleTxt:{
        fontSize:20,
        fontWeight:'bold',
        color:Colors.fontBlueColor,
        marginTop:15,
        marginBottom:30,
    },
    scrollView:{
        flex:1,
        alignSelf:'stretch',
        
    },
    inputText:{
        alignSelf:'stretch',
        height:42,
        paddingLeft:10,
        borderRadius:5,
        borderColor:Colors.borderColor_e,
        borderWidth:1,
        color:Colors.fontGrayColor_a0,
        marginBottom:10,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,
        alignSelf:'center'
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

class CreateWalletScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            walletName:'',
            pwd:'',
            rePwd: '',
            pwdHint:'',
            isShowPassword:false,
            isShowRePassword:false,
            loadingVisible:false,
        }

        //this.startCreateWallet=this.startCreateWallet.bind(this);
    }

    isOpenPwd() {
        this.setState({isShowPassword: !this.state.isShowPassword});
    }

    isOpenRePwd() {
        this.setState({isShowRePassword: !this.state.isShowRePassword});
    }

    //验证android读写权限
    async vertifyPermissions(){
        if(Platform.OS === 'android'){
            var  readPermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
            if(readPermission){
                var  writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE); 
                if(writePermission){
                    this.vertifyInputData()
                }else{
                    this.stopLoading()
                    Alert.alert(
                        'warn',
                        '请允许写入内存卡权限',
                    )
                }
            }else{
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

    vertifyInputData(){
        var walletName = this.state.walletName;
        var pwd = this.state.pwd;
        var rePwd = this.state.rePwd;
        
        var warnMessage = "";
        if(walletName == '' || walletName == null || walletName == undefined){
            warnMessage = "请输入钱包名称"
        }else if(pwd == ''  || pwd == null || pwd == undefined){
            warnMessage = "请输入密码"
        }else if(rePwd == '' || rePwd == null || rePwd == undefined){
            warnMessage = "请输入重复密码"
        }else if(pwd != rePwd){
            warnMessage = "请输入一致的密码"
        }else if(this.props.mnemonic == ''  || this.props.mnemonic == null || this.props.mnemonic == undefined){
            warnMessage = "助记词生成失败"
        }
        if(warnMessage!=""){
            this.stopLoading()
            showToast(warnMessage);
        }else{
            this.setState({
                loadingVisible : true,
            })
            setTimeout(()=>{
                console.log('L_','开始创建钱包')
                this.startCreateWallet();//创建钱包
            },2000);
        }
    }

    async startCreateWallet(){ 
        try{
            
             console.log('L1', '进入');
             var m =  this.props.mnemonic;//助记词
             console.log('L2_mnemonic', m)

             const seed = walletUtils.mnemonicToSeed(m)
             const seedHex = seed.toString('hex')
             var hdwallet = HDWallet.fromMasterSeed(seed)
             const derivePath = "m/44'/60'/0'/0/0"
             hdwallet.setDerivePath(derivePath)
             const privateKey = hdwallet.getPrivateKey()
             const checksumAddress = hdwallet.getChecksumAddressString()
             console.log('L3_prikey:', hdwallet.getPrivateKeyString())
             console.log('L4_address:', checksumAddress)
             var object = {
                 name: this.state.walletName,
                 address: checksumAddress,
                 extra: this.state.pwdHint,
             }
             var key = 'uesr'
             StorageManage.save(key, object)
             //var loadRet = await StorageManage.load(key)
             //console.log('L5_user:', loadRet)
        
             var password = this.state.pwd;
             console.log('L6_pwd:', this.state.pwd)
             console.log('L6_password:', password)
             var params = { keyBytes: 32, ivBytes: 16 }
             var dk = keythereum.create(params);
             var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv)
             console.log('L7_keyObject:', keyObject)
             await keystoreUtils.exportToFile(keyObject, "keystore")
             //var str = await keystoreUtils.importFromFile(keyObject.address)
             //var newKeyObject = JSON.parse(str)
             //console.log('L8_newKeyObject', newKeyObject)
             this.props.setWalletAddress(checksumAddress);
             this.props.setWalletName(this.state.walletName);
             console.log('L9', '完成')
        }catch (err) {
            showToast(err);
            console.log('createWalletErr:', err)
        }finally{
           this.stopLoading()
       }
    }

    stopLoading(){
        this.setState({
            loadingVisible : false,
        })
    }
    
    render() {
        let pwdIcon= this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        let rePwdIcon= this.state.isShowRePassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
               
                <Image style={styles.icon} source={require('../../assets/launch/createWalletIcon.png')} resizeMode={'center'}/>
                <Text style={styles.titleTxt}>创建钱包</Text>
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}>
                <TextInput style={styles.inputText} 
                           //returnKeyType='next' 
                           placeholder="钱包名称"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           onChange={(event) => {
                                this.setState({
                                    walletName: event.nativeEvent.text
                                })
                            }}/>
                <View style={styles.inputBox}> 
                    <TextInput style={styles.input} 
                           placeholder='密码'
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           secureTextEntry={!this.state.isShowPassword} 
                           onChange={(event) => {
                                this.setState({
                                    pwd: event.nativeEvent.text
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
                                    rePwd: event.nativeEvent.text
                                })
                           }}
                    />
                    <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress = {()=>this.isOpenRePwd() }>
                         <Image style={styles.pwdIcon} source={rePwdIcon} resizeMode={'center'}/>
                    </TouchableOpacity>
                    
                </View>          
                <TextInput style={[styles.inputText,{marginBottom:40}]} 
                           //returnKeyType='next' 
                           placeholder="密码提示(选填)"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           onChange={(event) => {
                                this.setState({
                                    pwdHint: event.nativeEvent.text
                                })
                            }}/>
                <View style={styles.buttonBox}>
                    <BlueButtonBig
                        onPress = {()=> this.vertifyPermissions()}
                        text = '创建'
                    />
                </View>   
                </ScrollView>  
                <Loading visible={this.state.loadingVisible}></Loading>
            </View>
        );
    }
}




const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName:(name) => dispatch(Actions.setWalletName(name))
});
export default connect(mapStateToProps,mapDispatchToProps)(CreateWalletScreen)

