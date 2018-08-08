import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,Alert,ScrollView,Platform,PermissionsAndroid} from 'react-native';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as TestAction from '../../config/action/TestAction'

import {androidPermission}  from '../../utils/permissionsAndroid';

import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';

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
        width:46,
        height:46,
    },
    titleTxt:{
        fontSize:FontSize.HeaderSize,
        fontWeight:'500',
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
        height:40,
        paddingLeft:10,
        borderRadius:5,
        borderColor:'rgb(241,241,241)',
        borderWidth:1,
        color:Colors.fontBlackColor,
        marginBottom:10,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        //alignSelf:'stretch',
        marginBottom:30,
    }
})

class CreateWalletScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            walletName:'',
            password:'',
            prePassword : '',
            passwordHint:'',
        }
    }
    //验证android读写权限
    async vertifyPermissions(){
        if(Platform.OS === 'android'){
            console.log('L', 'Android')
            var  readPermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
            if(readPermission){
                var  writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE); 
                console.log('L', '获得读权限')
                if(writePermission){
                    console.log('L', '获得写权限')
                    this.vertifyInputData()
                }else{
                    Alert.alert(
                        'warn',
                        '请允许写入内存卡权限',
                    )
                }
            }else{
                Alert.alert(
                    'warn',
                    '请允许读取内存卡权限',
                )
            }
            
        }else{
            console.log('L', 'IOS')
            this.vertifyInputData()
        }

    }

    vertifyInputData(){

      
        
        
        var warnMessage = "";
        if(this.state.walletName == '' || this.state.walletName == null || this.state.walletName == undefined){
            warnMessage = "请输入钱包名称"
        }else if(this.state.password = ''  || this.state.password == null || this.state.password == undefined){
            warnMessage = "请输入密码"
        }else if(this.state.rePassword = '' || this.state.rePassword == null || this.state.rePassword == undefined){
            warnMessage = "请输入重复密码"
        }else if(this.state.password != this.state.rePassword){
            warnMessage = "请输入一致的密码"
        }
        if(warnMessage!=""){
            Alert.alert(
                'warn',
                warnMessage,
                [
                  {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            )
        }else{
            console.log('L', '开始')
            this.startCreateWallet();
        }
    }

    async startCreateWallet(){ 
        console.log('L1', '进入')
        var m =  this.props.mnemonic;//助记词
        console.log('L2', m)
        const seed = walletUtils.mnemonicToSeed(m)
        const seedHex = seed.toString('hex')
        var hdwallet = HDWallet.fromMasterSeed(seed)
        const derivePath = "m/44'/60'/0'/0/0"
        hdwallet.setDerivePath(derivePath)
        const privateKey = hdwallet.getPrivateKey()
        const checksumAddress = hdwallet.getChecksumAddressString()
        console.log('L3_address:', checksumAddress)
        var object = {
            name: this.state.walletName,
            address: checksumAddress,
            extra: this.state.passwordHint,
        }
        var key = 'uesr'
        StorageManage.save(key, object)
        var loadRet = await StorageManage.load(key)
        console.log('L4_loadRet:', loadRet)
        //StorageManage.remove(key)
        
        var password = this.state.passwordHint;
        console.log('L5_password:',password )
        var params = { keyBytes: 32, ivBytes: 16 }
        var dk = keythereum.create(params);
        var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv)
        console.log('L6_keyObject:', keyObject)
        await keystoreUtils.exportToFile(keyObject, "keystore")
        var str = await keystoreUtils.importFromFile(keyObject.address)
        var newKeyObject = JSON.parse(str)
        console.log('L7_keyObject', newKeyObject)
    }
    
    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <Image style={styles.icon} source={require('../../assets/launch/createWalletIcon.jpg')}/>
                <Text style={styles.titleTxt}>创建钱包</Text>
                
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
        
                <TextInput style={styles.inputText} 
                           //returnKeyType='next' 
                           placeholder="密码"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           secureTextEntry={true}
                           onChange={(event) => {
                            this.setState({
                                password: event.nativeEvent.text
                            })
                        }}/>
                <TextInput style={styles.inputText} 
                           //returnKeyType='next' 
                           placeholder="重复密码"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           secureTextEntry={true}
                           onChange={(event) => {
                                this.setState({
                                    rePassword: event.nativeEvent.text
                                })
                            }}/>
                <TextInput style={[styles.inputText,{marginBottom:40}]} 
                           //returnKeyType='next' 
                           placeholder="密码提示(选填)"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           onChange={(event) => {
                                this.setState({
                                    passwordHint: event.nativeEvent.text
                                })
                            }}/>
                            
                <View style={styles.buttonBox}>

                        <BlueButtonBig
                            onPress = {()=> this.vertifyInputData()}
                            text = '创建'
                        />
                </View> 
                
            </View>
        );
    }
}


const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});
export default connect(mapStateToProps,{})(CreateWalletScreen)

