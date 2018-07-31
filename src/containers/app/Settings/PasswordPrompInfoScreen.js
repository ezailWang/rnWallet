import React, { Component } from 'react';
import { View,StyleSheet,Image,TextInput,Alert,ScrollView,TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlueButton from '../../../components/BlueButton';


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'rgb(248,248,248)',
        paddingTop:20,
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
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <Ionicons.Button
                name="ios-arrow-back"
                size={25}
                color='skyblue'
                backgroundColor='transparent'
                onPress={() => navigation.goBack()}
            />
        ),
        tabBarVisible: true,
        title:'密码提示信息'
    
    })

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
       
        return (
            <View style={styles.container}>

                <View style={styles.inputBox}> 
                    <TextInput style={styles.inputText} 
                           placeholder='请输入密码提示信息'
                           underlineColorAndroid='transparent' 
                           selectionColor='#00bfff'
                           secureTextEntry={!this.state.isShowPassword} 
                           selection={
                                //start:{this.state.passwordPrompInfo.length},
                                //end:{this.state.passwordPrompInfo.length},
                           }
                           onChange={(event) => {
                                this.setState({
                                    passwordPrompInfo: event.nativeEvent.text
                                })
                           }}
                    />
                    <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress = {()=>this.isOpenPwd() }>
                         <Image style={styles.pwdIcon} source={this.state.isShowPassword ? require('../../../img/pwdOpenIcon.jpg') : require('../../../img/pwdIcon.jpg')}/>
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.buttonBox}>
                        <BlueButton
                            onPress = {()=> this.save()}
                            text = '保存'
                        />
                </View> 
                
            </View>
        );
    }
}



