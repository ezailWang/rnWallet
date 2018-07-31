import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,Alert,ScrollView,TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlueButton from '../../components/BlueButton';


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
        marginBottom:1,
        paddingLeft:20,
        paddingRight:20,
    },
    inputTxt:{
        width:80,
        fontSize:15,
        color:'rgb(182,182,182)'
    },
    inputText:{
        flex:1,
        height:40,
        color:'rgb(146,146,146)',
    },
    buttonBox:{
        alignSelf:'stretch',
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
        fontSize:13,
        color:'rgb(182,182,182)'
    },
    importTxt:{
        fontSize:14,
        color:'rgb(85,146,246)',
        textDecorationLine:'underline',
    },
    
})

export default class ModifyPasswordScreen extends Component {
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
        title:'修改密码'
    
    })

    constructor(props){
        super(props);
        this.state = {
            curPassword : '',
            newPassword : '',
            newRePassword : '',
        }
    }


    render() {
        return (
            <View style={styles.container}>

                <View style={styles.inputBox}> 
                    <Text style={styles.inputTxt}>当前密码</Text>
                    <TextInput style={styles.inputText} 
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
                        <BlueButton
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



