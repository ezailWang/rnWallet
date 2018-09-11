import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Dimensions,BackHandler} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgNoTitleHeader} from '../../components/NavigaionHeader'
import {showToast} from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    contentContainer:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:ScreenHeight*0.15,
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
        //alignItems:'stretch',
    },
    icon:{
        width:48,
        height:48,
    },
    titleTxt:{
        fontSize:20,
        fontWeight:'bold',
        color: Colors.fontBlueColor,
        marginBottom:40,
    },
    contentTxt:{
        fontSize:FontSize.ContentSize,
        color:Colors.fontGrayColor_a0,
        textAlign:'center',
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,

    }
})

export default class BackupWalletScreen extends BaseComponent {
   
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation}/>
                <View style={styles.contentContainer}>
                <Image style={styles.icon} source={require('../../assets/launch/backup.png')} resizeMode={'center'}/>
                <Text style={styles.titleTxt}>{I18n.t('launch.backup_wallet')}</Text>
                <Text style={styles.contentTxt}>{I18n.t('launch.backup_wallet_prompt')}</Text>
                
                <View style={styles.buttonBox}>
                    <BlueButtonBig
                        onPress = {()=> this.props.navigation.navigate('BackupMnemonic',{password: this.props.navigation.state.params.password})}
                        text = {I18n.t('launch.backup_mnemonic')}
                    />
                </View>    
                </View>
                         
            </View>
        );
    }
}
