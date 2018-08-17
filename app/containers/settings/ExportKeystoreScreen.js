import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,ScrollView,TextInput} from 'react-native';
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import { connect } from 'react-redux';
import {BlueButtonBig} from '../../components/Button'
import {Colors,FontSize} from '../../config/GlobalConfig'
import ScreenshotWarn from '../../components/ScreenShowWarn';
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from  '../../components/LoadingComponent';
import {showToast} from '../../utils/Toast';

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
        marginTop:40,
        marginBottom:40,
        paddingTop:15,
        paddingBottom:15,
    },
    privateKeyScroll:{
        //overflow:'auto',
        flex:1,
        //justifyContent:'center',  
        paddingLeft:15,
        paddingRight:15,  
    },
    privateKeyText:{
        color:Colors.fontBlackColor_31,
        fontSize:16,
        lineHeight:22,
        textAlignVertical:'center',
    },
    buttonBox:{
        alignItems:'center',
    }
    
})

export default class ExportKeystoreScreen extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            keystore : '',
            screenshotWarnVisible : false,
            loadingVisible:false,
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        return true;
    }

    componentDidMount() {
       this.exportKeystore()
    }

    async exportKeystore(){
        try{
              //this.refs.loading.show();
              this.setState({
                 loadingVisible:true
              })
              var key = 'uesr'
              var user = await StorageManage.load(key);
              console.log('user', user)
              if(user == null){
                  throw "请先创建或导入钱包"
              }
              var str = await keystoreUtils.importFromFile(user.address)
              //var newKeyObject = JSON.parse(str)
              //this.refs.loading.close()
             this.setState({
                keystore:str,
                loadingVisible:false,
                screenshotWarnVisible:true
             })
        }catch (err) {
            showToast(err);
            console.log('exportKeystoreErr:', err)
        }
    }
    onCloseModal() {
        requestAnimationFrame(() => {//下一帧就立即执行回调,可以异步来提高组件的响应速度
            this.setState({screenshotWarnVisible: false});
        });
    }
    copy(){
        Clipboard.setString(this.state.keystore);
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <ScreenshotWarn
                    content = '如果有人获取你的Keystore将可能获取你的资产！请妥善保管Keystore。'
                    btnText = '知道了'
                    modalVisible = {this.state.screenshotWarnVisible}
                    onPress = {()=> this.onCloseModal()}
                />
                <View style={styles.contentBox}>    
                    <View style={styles.warnBox}>
                        <Image style={styles.warnIcon} source={require('../../assets/set/ShieldIcon.png')} resizeMode={'contain'}/>
                        <Text style={styles.warnTxt}>拥有Keystore就能完全控制该地址的资产，切勿保存至邮箱、网盘等，更不要使用网络工具进行传输。</Text>
                    </View> 
            
                    <View style={styles.privateKeyBox}>
                        <ScrollView style={styles.privateKeyScroll}>
                            <Text style={styles.privateKeyText}>
                              {this.state.keystore}        
                            </Text> 
                        </ScrollView>
                    </View>    
                    
                   
                    
                    <View style={styles.buttonBox}>
                        <BlueButtonBig
                            onPress = {()=> this.copy()}
                            text = '复制Keystore'
                        />
                    </View>        
                </View>
                <Loading visible={this.state.loadingVisible}>
                </Loading>
            </View>    
        );
    }
}
/**
 * 
 * 
 */


