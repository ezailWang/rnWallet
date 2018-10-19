import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,ScrollView,TouchableOpacity,BackHandler} from 'react-native';

import {connect} from 'react-redux';
import {BlueButtonBig} from '../../components/Button'
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import {showToast} from '../../utils/Toast';
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.bgGrayColor,
        paddingTop:20,
    },
    inputBox:{
        alignSelf:'stretch',
        flexDirection:'row',
        alignItems:'center',
        height:66,
        backgroundColor:'#fff',
        marginBottom:1,
        paddingLeft:20,
        paddingRight:20,
    },
    inputTxt:{
        width:80,
        fontSize:FontSize.ContentSize,
        color:Colors.fontGrayColor_a0,
    },
    inputText:{
        flex:1,
        height:40,
        color:Colors.fontDarkColor,
    },
    buttonBox:{
        //alignSelf:'stretch',
        marginTop:40,
        marginBottom:30,
        marginLeft:20,
        marginRight:20,
    },
    forgetPwdBox:{
        flexDirection:'row',
        marginLeft:20,
        marginRight:20,
    },
    forgetPwdTxt:{
        marginLeft:10,
        marginRight:10,
        fontSize:FontSize.DetailTitleSize,
        color:Colors.fontBlackColor_43
    },
    importTxt:{
        fontSize:FontSize.DetailTitleSize,
        color:Colors.fontBlueColor,
        textDecorationLine:'underline',
    },
    
})

export default class ModifyPasswordScreen extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            curPassword : '',
            newPassword : '',
            newRePassword : '',
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.goBack();
        return true;
    }
    
    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <WhiteBgHeader  navigation={this.props.navigation} text='修改密码'/>
                <View style={styles.inputBox}> 
                    <Text style={styles.inputTxt}>当前密码</Text>
                    <TextInput style={styles.inputText} 
                           placeholderTextColor = {Colors.fontGrayColor_a0}
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           secureTextEntry={true} 
                           onChange={(event) => {
                                this.setState({
                                    curPassword: event.nativeEvent.text
                                })
                            }}
                    />
                </View>
                <View style={styles.inputBox}> 
                    <Text style={styles.inputTxt}>新密码</Text>
                    <TextInput style={styles.inputText} 
                           placeholderTextColor = {Colors.fontGrayColor_a0}
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           secureTextEntry={true}
                           onChange={(event) => {
                                this.setState({
                                    newPassword: event.nativeEvent.text
                                })
                            }}
                    />
                </View>
                <View style={styles.inputBox}> 
                    <Text style={styles.inputTxt}>重复新密码</Text>
                    <TextInput style={styles.inputText} 
                           placeholderTextColor = {Colors.fontGrayColor_a0}
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff' 
                           secureTextEntry={true}
                           onChange={(event) => {
                                this.setState({
                                    newRePassword: event.nativeEvent.text
                                })
                            }}
                    />
                </View>

                <View style={styles.buttonBox}>
                        <BlueButtonBig
                            onPress = {()=> this.vertifyInputData()}
                            text = '完成'
                        />
                </View> 
                <View style={styles.forgetPwdBox}>
                   <Text style={styles.forgetPwdTxt}>忘记密码？导入助记词或私钥可重置密码,</Text>
                   <Text style={styles.importTxt} onPress = {()=> this.props.navigation.navigate('ImportWallet')}>马上导入</Text>
                </View>
            </View>
        );
    }
}



