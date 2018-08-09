import React, { Component } from 'react';
import { View,StyleSheet,Image,Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:100,
        paddingLeft:40,
        paddingRight:40,
        //alignItems:'stretch',
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
        marginBottom:40,
    },
    contentTxt:{
        fontSize:FontSize.ContentSize,
        color:Colors.fontGrayColor_a0,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,

    }
})

export default class BackupWalletScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <Image style={styles.icon} source={require('../../assets/launch/backup.png')} resizeMode={'center'}/>
                <Text style={styles.titleTxt}>备份钱包</Text>
                <Text style={styles.contentTxt}>没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。</Text>
                
                <View style={styles.buttonBox}>
                    <BlueButtonBig
                        onPress = {()=> this.props.navigation.navigate('BackupMnemonic')}
                        text = '备份助记词'
                    />
                </View>    
                 
                         
            </View>
        );
    }
}
