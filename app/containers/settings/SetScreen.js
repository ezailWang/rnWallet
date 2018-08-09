import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,Alert,ScrollView,TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import {NextButton} from '../../components/Button';
import ModifyNameDialog from '../../components/ModifyNameDialog';
import {Colors,FontSize}from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.bgGrayColor,
        paddingTop:20,
    },
    btnOpacity:{
        flexDirection:'row',
        height:56,
        alignSelf:'stretch',
        alignItems:'center',
        backgroundColor:'#fff',
        marginTop:1,
        paddingLeft:20,
        paddingRight:20,
    },
    btnTxt:{
        flex:1,
        backgroundColor: 'transparent',
        color:Colors.fontBlackColor_43,
        fontSize:FontSize.TitleSize,
        height:56,
        lineHeight:56,
        textAlign:'left',
    },
    headIcon:{
        height:36,
        width:36,
    },
    walletName:{
        fontSize:FontSize.DetailTitleSize,
        color:Colors.fontGrayColor_a1
    },
    buttonBox:{
        marginTop:1,
        justifyContent:'flex-end',
        alignSelf:'stretch',
    },
    marginBottom20:{
        marginBottom:20,
    }
    
})

export default class SetScreen extends Component {
  
    constructor(props){
        super(props);
        this.state = {
            modalVisible : false,
        }
    }

    isOpenModifyModal(modalVisible) {
        this.setState({modalVisible: modalVisible});
    }
    modifyWalletName(){
        var name = this.refs.modifyNameDialog.state.name;
        isOpenModifyModal(false);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <ModifyNameDialog
                    ref = "modifyNameDialog"
                    placeholder = "钱包名称"
                    leftTxt = "取消"
                    rightTxt = '确定'
                    leftPress = {()=> this.isOpenModifyModal(false)}
                    rightPress = {()=> this.modifyWalletName()}
                    modalVisible = {this.state.modalVisible}
                />

                <TouchableOpacity style={[styles.btnOpacity]} 
                                  activeOpacity={0.6} 
                                  onPress={()=> this.isOpenModifyModal(true)}>
                    <Text style={styles.btnTxt}>更换图标</Text>
                    <Image style={styles.headIcon} source={require('../../assets/common/photoIcon.png')}/>
                </TouchableOpacity> 
                <TouchableOpacity style={[styles.btnOpacity]} 
                                  activeOpacity={0.6} 
                                  onPress={()=> this.isOpenModifyModal(true)}>
                    <Text style={styles.btnTxt}>修改钱包名称</Text>
                    <Text style={styles.walletName}>Wallet Name</Text>
                </TouchableOpacity> 
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('ModifyPassword')}
                        text = '修改密码'
                    />
                </View>   
                <View style={[styles.buttonBox,styles.marginBottom20]}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('PasswordPrompInfo')}
                        text = '密码提示信息'
                    />
                </View> 

                <View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('ReceiptCode')}
                        text = '导出助记词'
                    />
                </View> 
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('TransactionDetail')}
                        text = '导出Keystore'
                    />
                </View> 
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> {this.props.navigation.navigate('BackupMnemonic')}}
                        text = '导出私钥'
                    />
                </View> 
            </View>
        );
    }
}



