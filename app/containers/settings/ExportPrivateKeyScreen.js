import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard} from 'react-native';
import keythereum from 'keythereum'
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import { connect } from 'react-redux';
import {BlueButtonBig} from '../../components/Button'
import {Colors,FontSize} from '../../config/GlobalConfig'
import ScreenshotWarn from '../../components/ScreenShowWarn';
import StatusBarComponent from '../../components/StatusBarComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.whiteBackgroundColor,
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,
    },
    contentBox:{
        flex:1,
        alignItems:'stretch',
    },
    warnBox:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:Colors.bgBlue_9a,
        paddingTop:10,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:10,  
    },
    warnIcon:{
        width:42,
        height:42,
        marginRight:10,
    },
    warnTxt:{
        flex:1,
        color:Colors.fontWhiteColor,
        fontSize:15,
        lineHeight:20,
    },
    privateKeyBox:{
        height:160,
        backgroundColor:Colors.bgGrayColor,
        borderRadius:5,
        justifyContent:'center',
        textAlignVertical:'center',
        color:Colors.fontBlackColor_31,
        fontSize:16,
        lineHeight:22,
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15,
        marginTop:40,
        marginBottom:40,
    }
    
})

export default class ExportPrivateKeyScreen extends Component {

    /**static navigationOptions = ({ navigation }) => ({
        navigation.state.params.passoword
    })**/
   


    constructor(props){
        super(props);
        this.state = {
            privateKey : '',
            modalVisible : true,
        }
    }
    componentDidMount() {
        this.exportPrivateKey()
    }
    async exportPrivateKey(){
       var password = this.props.navigation.state.params.password;
       console.log('password_', password)
        var key = 'uesr'
        var user = await StorageManage.load(key);//获取地址
        console.log('user', user)
        var keyStoreStr = await keystoreUtils.importFromFile(user.address)//导出KeyStore
        console.log("keyStoreStr",keyStoreStr); 
        var keyStoreObject = JSON.parse(keyStoreStr)
        var privateKey = await keythereum.recover(password, keyStoreObject);//导出privateKey
        console.log("privateKey",privateKey); 
        var privateKeyHex = privateKey.toString('hex');
        console.log("privateKey",privateKeyHex); 
        this.setState({privateKey: privateKeyHex});
    }

    onCloseModal() {
        this.setState({modalVisible: false});
    }
    copy(){
        Clipboard.setString(this.state.privateKey);
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <ScreenshotWarn
                    content = '如果有人获取你的私钥将可能获取你的资产！请抄写下私钥并存放在安全的地方。'
                    btnText = '知道了'
                    modalVisible = {this.state.modalVisible}
                    onPress = {()=> this.onCloseModal()}
                />
                <View style={styles.contentBox}>    
                    <View style={styles.warnBox}>
                        <Image style={styles.warnIcon} source={require('../../assets/set/ShieldIcon.png')} resizeMode={'contain'}/>
                        <Text style={styles.warnTxt}>拥有私钥就能完全控制该地址的资产，切勿保存至邮箱、网盘等，更不要使用网络工具进行传输。</Text>
                    </View>    
                    <Text style={styles.privateKeyBox}>{this.state.privateKey}</Text>  
                    <BlueButtonBig
                        onPress = {()=> this.copy()}
                        text = '复制Private Key'
                    />         
                </View>

            </View>    
        );
    }
}



