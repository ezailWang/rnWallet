import React, { Component } from 'react';
import { View,StyleSheet,Image,TextInput,Alert,ScrollView,TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import {BlueButtonBig} from '../../components/Button'
import StatusBarComponent from '../../components/StatusBarComponent';
import {Colors,FontSize} from '../../config/GlobalConfig'
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.bgGrayColor,
        paddingTop:10,
    },
    inputBox:{
        alignSelf:'stretch',
        flexDirection:'row',
        alignItems:'center',
        height:66,
        backgroundColor:'#fff',
        paddingLeft:20,
        paddingRight:20,
    },
    inputText:{
        flex:1,
        height:40,
        color:'rgb(146,146,146)',
    },
    pwdBtnOpacity:{
        height:66,
        width:40,
        justifyContent:'center',
        alignItems:'center'
    },
    pwdIcon:{
        height:20,
    },
    buttonBox:{
        alignSelf:'stretch',
        marginTop:40,
        marginLeft:20,
        marginRight:20,
    }
    
})

export default class PasswordPrompInfoScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            isShowPassword:false,
            passwordPrompInfo : '',
        }
    }
    isOpenPwd() {
        this.setState({isShowPassword: !this.state.isShowPassword});
    }
    save(){

    }

    render() {
        let pwdIcon= this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.jpg') : require('../../assets/launch/pwdIcon.jpg');
        return (
            
            <View style={styles.container}>
                <StatusBarComponent/>
                <View style={styles.inputBox}> 
                    <TextInput style={styles.inputText} 
                           placeholder='请输入密码提示信息'
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           secureTextEntry={!this.state.isShowPassword} 
                           /**selection={
                                //start:{this.state.passwordPrompInfo.length},
                                //end:{this.state.passwordPrompInfo.length},
                           }**/
                           onChange={(event) => {
                                this.setState({
                                    passwordPrompInfo: event.nativeEvent.text
                                })
                           }}
                    />
                    <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress = {()=>this.isOpenPwd() }>
                         <Image style={styles.pwdIcon} source={pwdIcon}/>
                    </TouchableOpacity>
                    
                </View>
                <View style={{marginTop:10}}>
                    <BlueButtonBig
                            onPress = {()=> this.save()}
                            text = '保存'/>
                </View>
                
            </View>
        );
    }
}



