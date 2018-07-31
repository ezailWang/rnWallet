import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,Alert,ScrollView} from 'react-native';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as TestAction from '../../config/action/TestAction'
import BlueButton from '../../components/BlueButton';


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
        fontSize:18,
        fontWeight:'500',
        color:'rgb(85,146,246)',
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
        color:'rgb(146,146,146)',
        marginBottom:10,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        alignSelf:'stretch',
        marginBottom:30,
    }
})

class CreateWalletScreen extends Component {
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
        tabBarVisible: true,
    })

    constructor(props){
        super(props);
        this.state = {
            walletName:'',
            password:'',
            prePassword : '',
            passwordHint:'',
        }
    }

    vertifyInputData(){
        console.log('vertifyInputData', 'vertifyInputData')
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
        var m =  this.props.mnemonic;
        console.log('L2', m)
        const seed = walletUtils.mnemonicToSeed(this.props.mnemonic)
        console.log('L3', seed)
        const seedHex = seed.toString('hex')
        var hdwallet = HDWallet.fromMasterSeed(seed)
        console.log('L4', hdwallet)
        const derivePath = "m/44'/60'/0'/0/0"
        hdwallet.setDerivePath(derivePath)
        const privateKey = hdwallet.getPrivateKey()
        const checksumAddress = hdwallet.getChecksumAddressString()
        console.log('L5', privateKey)
        console.log('L6', checksumAddress)
        storage.save({
            key:'user',
            data:{
                name:this.state.walletName,
                address:checksumAddress,
                extra:this.state.passwordHint,
            },
        });

        var password = this.state.password || 'testpassword'
        var params = { keyBytes: 32, ivBytes: 16 }
        var dk = keythereum.create(params);
        console.log('L7', dk)
        var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv)
        console.log('L8:', keyObject)
        await keystoreUtils.exportToFile(keyObject, "keystore")
        console.log('L9', 'exportToFile '+ 'complete')
        var str = await keystoreUtils.importFromFile(keyObject.address)
        console.log('L10', str)
        var newKeyObject = JSON.parse(str)
        console.log('L11', newKeyObject)
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.icon} source={require('../../assets/launch/createWalletIcon.jpg')}/>
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
                        <BlueButton
                            onPress = {()=> this.vertifyInputData()}
                            text = '创建'
                        />
                </View> 
                </ScrollView>         
            </View>
        );
    }
}


const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});
export default connect(mapStateToProps,{})(CreateWalletScreen)

