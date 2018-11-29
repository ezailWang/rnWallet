import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from '../config/GlobalConfig'
import {BlueButtonSmall,WhiteButtonSmall} from './Button'
import Layout from '../config/LayoutConstants'

const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        // justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.blackOpacityColor,
    },
    contentBox:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:30,
        paddingBottom:30,
        marginTop:Layout.WINDOW_HEIGHT*0.23,
        marginLeft:20,
        marginRight:20,
        //borderRadius:5,
    },
    inputBox: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
    },
    inputText:{
        flex:1,
        height: 42,
        color:Colors.fontGrayColor_a0
    },
    
    pwdBtnOpacity: {
        height: 42,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pwdIcon: {
        width:20,
        height: 20/14*9,
    },
    buttonBox:{
        flexDirection:'row',
        marginTop:20,
    },
    leftBtnOpacity:{
        flex:1,
        height:40,
        alignSelf:'stretch',
    },
    leftBtnTxt:{
        color:'rgb(85,146,246)',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
    },
    rightBtnBox:{
        flex:1,
        marginLeft:20,
    },

});
export default class InputTextDialog extends Component{
    static propTypes = {
        placeholder:PropTypes.string.isRequired,
        leftPress: PropTypes.func.isRequired,
        rightPress: PropTypes.func.isRequired,
        rightTxt: PropTypes.string.isRequired,
        leftTxt:PropTypes.string.isRequired,
        modalVisible: PropTypes.bool.isRequired,
        onChangeText: PropTypes.func,
        rightBtnDisabled : PropTypes.bool,
    }
    static defaultProps = {
        rightBtnDisabled:false
    }

    constructor(props){
        super(props);
        this.state = {
            //text : '',
            isShowPassword : false,
        }
    }
    isOpenPwd() {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }
    closePwd(){
        this.setState({ isShowPassword: false});
    }
    leftPressed=()=>{ 
        this.closePwd()
        this.props.leftPress()
    }
    rightPressed=()=>{
        this.closePwd()
        this.props.rightPress()
    }
    onChangeText=(text)=>{
        this.props.onChangeText(text) 
    }
    render(){
        let pwdIcon = this.state.isShowPassword ? require('../assets/launch/pwdOpenIcon.png') : require('../assets/launch/pwdHideIcon.png');
        return(
            <Modal
                  onStartShouldSetResponder={() => false}
                  animationType={'fade'}
                  transparent={true}
                  visible={this.props.modalVisible}
                  onRequestClose={()=>{
                        //只有android点击物理返回键的时候才调用
                  }}
                  onShow={()=>{
                  }}
            >
                <View style={styles.modeBox}>
                <View style={styles.contentBox}>
                    <View style={styles.inputBox}>
                         <TextInput style={styles.inputText} 
                            placeholderTextColor = {Colors.fontGrayColor_a0}
                             returnKeyType='done'
                             placeholder= {this.props.placeholder}
                             underlineColorAndroid='transparent' 
                             selectionColor='#00bfff' 
                             secureTextEntry={!this.state.isShowPassword}
                             onChangeText={this.onChangeText}
                        ></TextInput>
                        <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenPwd()}>
                            <Image style={styles.pwdIcon} source={pwdIcon} resizeMode={'center'} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.buttonBox}>
                        <View style={[styles.leftBtnOpacity]}>
                            <WhiteButtonSmall onPress={this.leftPressed}
                                              text={this.props.leftTxt}>
                            </WhiteButtonSmall>
                        </View>
                        <View style={styles.rightBtnBox}>
                            <BlueButtonSmall onPress = { this.rightPressed}
                                             text = {this.props.rightTxt}
                                             isDisabled = {this.props.rightBtnDisabled}>
                            </BlueButtonSmall>
                        </View> 
                    </View>
                </View>    
                </View>     
            </Modal>      

        );
    }
}