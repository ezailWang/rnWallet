import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlueButton from '../../components/BlueButton';

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
        alignSelf:'stretch',
        marginTop:20,
        marginBottom:10,

    }
})

export default class UserRegulationScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <Ionicons.Button
                name="ios-arrow-back"
                size={25}
                color='skyblue'
                backgroundColor='rgba(255,255,255,0)'
                onPress={() => navigation.goBack()}
            />
        ),
        tabBarVisible: false,
    })

    render() {
        return (
            <View style={styles.container}>
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
                    <BlueButton
                        onPress = {()=> this.props.navigation.navigate('BackupMnemonic')}
                        text = '我已阅读并同意以上条款'
                    />
                </View>    
                 
                         
            </View>
        );
    }
}
