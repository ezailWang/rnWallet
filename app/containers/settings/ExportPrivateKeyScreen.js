import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Clipboard,BackHandler} from 'react-native';
import keythereum from 'keythereum'
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import { connect } from 'react-redux';
import {BlueButtonBig} from '../../components/Button'
import {Colors,FontSize} from '../../config/GlobalConfig'
import ScreenshotWarn from '../../components/ScreenShowWarn';
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from  '../../components/LoadingComponent';
import {showToast} from '../../utils/Toast';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    contentBox:{
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,
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
    },
    buttonBox:{
        alignItems:'center'
    }
})

export default class ExportPrivateKeyScreen extends BaseComponent {

    /**static navigationOptions = ({ navigation }) => ({
       
    })**/
   

    constructor(props){
        super(props);
        this.state = {
            privateKey : '',
            screenshotWarnVisible : false,
        }
    }

    _initData() {
        this.showPrivateKey();
    }
   
    showPrivateKey(){
        var privateKey = this.props.navigation.state.params.privateKey;
        var privateKeyHex = privateKey.toString('hex');
        this.setState(
            {
               privateKey: privateKeyHex,
               screenshotWarnVisible:true
            });
    }


    onCloseModal() {
        requestAnimationFrame(() => {//下一帧就立即执行回调,可以异步来提高组件的响应速度
            this.setState({screenshotWarnVisible: false});
        });
    }
    copy(){
        Clipboard.setString(this.state.privateKey);
    }
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.export_private_key')}/>
                <ScreenshotWarn
                    content = {I18n.t('settings.export_private_key_modal_prompt')}
                    btnText = {I18n.t('modal.i_know')}
                    modalVisible = {this.state.screenshotWarnVisible}
                    onPress = {()=> this.onCloseModal()}
                />
                <View style={styles.contentBox}>    
                    <View style={styles.warnBox}>
                        <Image style={styles.warnIcon} source={require('../../assets/set/ShieldIcon.png')} resizeMode={'contain'}/>
                        <Text style={styles.warnTxt}>{I18n.t('settings.export_private_key_prompt')}</Text>
                    </View> 
                    <View style={styles.privateKeyBox}>
                         <Text style={styles.privateKeyText}>{this.state.privateKey}</Text>  
                    </View>   
                
                     <View style={styles.buttonBox}>
                        <BlueButtonBig
                            onPress = {()=> this.copy()}
                            text = {I18n.t('settings.copy_private_key')}
                        />
                    </View>        
                </View>
            </View>    
        );
    }
}



