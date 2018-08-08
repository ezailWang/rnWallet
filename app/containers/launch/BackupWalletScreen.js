import React, { Component } from 'react';
import { View,StyleSheet,Image,Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BlueButtonBig} from '../../components/Button';
import StatusBarComponent from '../../components/StatusBarComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:100,
        paddingLeft:20,
        paddingRight:20,
        //alignItems:'stretch',
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
    contentTxt:{
        fontSize:16,
        color:'rgb(175,175,175)',
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
                <Image style={styles.icon} source={require('../../assets/launch/backupWalletIcon.jpg')}/>
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
