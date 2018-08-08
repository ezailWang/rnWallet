import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,ScrollView} from 'react-native';
import {BlueButtonBig,HeaderButton} from '../../components/Button';
import StatusBarComponent from '../../components/StatusBarComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:60,
        paddingLeft:20,
        paddingRight:20,
        //alignItems:'stretch',
    },
    scrollView:{
        flex:1,
    },
    contentTxt:{
        fontSize:16,
        lineHeight:26,
        textAlign:'left',
        color:'rgb(99,99,99)',
    },
    buttonBox:{
        justifyContent:'flex-end',
        marginTop:20,
        marginBottom:10,
    }
})

export default class UserRegulationScreen extends Component {


    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.contentTxt}>
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    没有妥善备份就无法保障资产安全。删除程序或钱包后，你需要备份文件来恢复钱包。
                    </Text>
                </ScrollView>     
                <View style={styles.buttonBox}>
                    <BlueButtonBig
                        onPress = {()=> this.props.navigation.navigate('BackupMnemonic')}
                        text = '我已阅读并同意以上条款'
                    />
                </View>            
            </View>
        );
    }
}
