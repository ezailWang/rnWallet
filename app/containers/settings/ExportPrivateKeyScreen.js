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
import Loading from  '../../components/LoadingComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
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
        fontSize:14,
        lineHeight:16,
    },
    privateKeyBox:{
        height:150,
        backgroundColor:Colors.bgGrayColor_ed,
        borderRadius:5,
        justifyContent:'center',
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15,
        marginTop:40,
        marginBottom:40,
    },
    privateKeyText:{
         //textAlignVertical:'center',
        color:Colors.fontBlackColor_31,
        fontSize:16,
        lineHeight:22,
    }
})

export default class ExportPrivateKeyScreen extends Component {

    /**static navigationOptions = ({ navigation }) => ({
       
    })**/
   

    constructor(props){
        super(props);
        this.state = {
            privateKey : '',
            screenshotWarnVisible : false,
            loadingVisible : false,
        }
    }
    componentDidMount() {
        
        this.exportPrivateKey()
    }
    async exportPrivateKey(){
        //this.refs.loading.show();
        this.setState({
            loadingVisible:true,
        })
        var password = this.props.navigation.state.params.password;
        //console.log('password_', password)
        var key = 'uesr'
        var user = await StorageManage.load(key);//获取地址
        //console.log('user', user)
        var keyStoreStr = await keystoreUtils.importFromFile(user.address)//导出KeyStore
        console.log("keyStoreStr",keyStoreStr); 
        var keyStoreObject = JSON.parse(keyStoreStr)
        var privateKey = await keythereum.recover(password, keyStoreObject);//导出privateKey
        console.log("privateKey",privateKey); 
        var privateKeyHex = privateKey.toString('hex');
        console.log("privateKey",privateKeyHex);
        //this.refs.loading.close();
        this.setState(
            {
                privateKey: privateKeyHex,
                loadingVisible:false,
                screenshotWarnVisible:true
        });
       
       
       
    }


    onCloseModal() {
        console.log('L',"关闭弹框1")
        requestAnimationFrame(() => {//下一帧就立即执行回调,可以异步来提高组件的响应速度
            console.log('L',"关闭弹框2")
            this.setState({screenshotWarnVisible: false});
        });
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
                    modalVisible = {this.state.screenshotWarnVisible}
                    onPress = {()=> this.onCloseModal()}
                />
                <View style={styles.contentBox}>    
                    <View style={styles.warnBox}>
                        <Image style={styles.warnIcon} source={require('../../assets/set/ShieldIcon.png')} resizeMode={'contain'}/>
                        <Text style={styles.warnTxt}>拥有私钥就能完全控制该地址的资产，切勿保存至邮箱、网盘等，更不要使用网络工具进行传输。</Text>
                    </View> 
                    <View style={styles.privateKeyBox}>
                         <Text style={styles.privateKeyText}>{this.state.privateKey}</Text>  
                    </View>   
                    <BlueButtonBig
                        onPress = {()=> this.copy()}
                        text = '复制Private Key'
                    />         
                </View>
                <Loading ref = "loading"
                         visible={this.state.loadingVisible}>
                </Loading>
            </View>    
        );
    }
}



