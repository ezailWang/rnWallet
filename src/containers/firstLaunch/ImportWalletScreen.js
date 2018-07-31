import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlueButton from '../../components/BlueButton';

import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:40,
        paddingLeft:20,
        paddingRight:20,
        //alignItems:'stretch',
    },
    icon:{
        width:46,
        height:46,
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
        textAlignVertical:'top',
    },
    inputText:{
        height:40,
    },
    inputTextBox:{
        alignSelf:'stretch',
        paddingLeft:10,
        borderRadius:5,
        borderColor:'rgb(241,241,241)',
        borderWidth:1,
        color:'rgb(146,146,146)',
        marginBottom:10,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        alignSelf:'stretch',
    }
})

export default class CreateWalletScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <Ionicons.Button
                name="ios-arrow-back"
                size={25}
                color='skyblue'
                backgroundColor='rgba(85,146,246,1)'
                onPress={() => navigation.goBack()}
            />
        ),
        tabBarVisible: false,
    })

    constructor(props){
        super(props);
        this.state = {
            mnemonic:'',
            password:'',
            prePassword : '',
            passwordHint:'',
        }
    }

    vertifyInputData(){
       var mnemonicIsOK =  walletUtils.validateMnemonic(this.state.mnemonic);//验证助记词
       var warnMessage = '';
       if(mnemonicIsOK){
             if(this.state.password = ''  || this.state.password == null || this.state.password == undefined){
                  warnMessage = "请输入密码"
             }else if(this.state.rePassword = '' || this.state.rePassword == null || this.state.rePassword == undefined){
                  warnMessage = "请输入重复密码"
             }else if(this.state.password != this.state.rePassword){
                  warnMessage = "请输入一致的密码"
             }
       }else{
          warnMessage='请输入正确的助记词'
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
            this.importWallet;
        }
    }

    importWallet = async () => { 
        var m =  this.state.mnemonic;
        const seed = walletUtils.mnemonicToSeed(this.state.mnemonic)
        const seedHex = seed.toString('hex')
        var hdwallet = HDWallet.fromMasterSeed(seed)
        const derivePath = "m/44'/60'/0'/0/0"
        hdwallet.setDerivePath(derivePath)
        const privateKey = hdwallet.getPrivateKey()
        const checksumAddress = hdwallet.getChecksumAddressString()
        storage.save({
            key:'user',
            data:{
                name:'',
                address:checksumAddress,
                extra:this.state.passwordHint,
            },
        });
        var password = this.state.password || 'testpassword'
        var params = { keyBytes: 32, ivBytes: 16 }
        var dk = keythereum.create(params);
        var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv)
        console.log('keyObject:', keyObject)
        await keystoreUtils.exportToFile(keyObject, "keystore")
        var str = await keystoreUtils.importFromFile(keyObject.address)
        var newKeyObject = JSON.parse(str)
        console.log('newKeyObject', newKeyObject)
    }

    


    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.icon} source={require('../../img/importIcon.jpg')}/>
                <Text style={styles.titleTxt}>导入钱包</Text>
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={'always'}>
                <TextInput style={[styles.inputTextBox,styles.inputArea]} 
                          // returnKeyType='next' 
                           placeholder="输入助记词"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           onChange={(event) => {
                            this.setState({
                                password: event.nativeEvent.text
                            })
                           }}></TextInput>
               
                <TextInput style={[styles.inputTextBox,styles.inputText]} 
                         //  returnKeyType='next' 
                           placeholder="设置密码"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           selectTextOnFocus={true}
                           onChange={(event) => {
                            this.setState({
                                password: event.nativeEvent.text
                            })
                           }}></TextInput>
                <TextInput style={[styles.inputTextBox,styles.inputText]} 
                          // returnKeyType='next' 
                           placeholder="重复密码"
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           secureTextEntry={true}
                           onChange={(event) => {
                            this.setState({
                                password: event.nativeEvent.text
                            })
                           }}></TextInput>
                <TextInput style={[styles.inputTextBox,styles.inputText,{marginBottom:40}]} 
                          // returnKeyType='next' 
                           placeholder="密码提示(选填)"
                           underlineColorAndroid='transparent' 
                           secureTextEntry={true}
                           onChange={(event) => {
                            this.setState({
                                password: event.nativeEvent.text
                            })
                           }}></TextInput>       
                <View style={styles.buttonBox}>
                          <BlueButton
                                onPress = {()=> this.vertifyInputData()}
                                text = '导入'
                          />
                </View> 
                </ScrollView>            
            </View>
        );
    }
}

