import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import PingCircle from './PingCircle'
import PingPoint from './PingPoint'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Modal,
    Animated,
    Easing
}from 'react-native'


const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        backgroundColor: 'white',
        alignItems:'center',
    },
    title:{
        fontSize:18,
        color:Colors.fontBlackColor_43,
        marginTop:100,
        marginBottom:20,
    },
    pointBox:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:30,
    },
    pointStyle:{
        marginLeft:10,
        marginRight:10,
    },
    circleBox:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:15,
    },
    circleStyle:{
        marginLeft:10,
        marginRight:10,
    },
    deleteBox:{
        width:264,
        marginTop:30,
        alignItems:'flex-end',
    },
    deleteBtn:{
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
    },
    deleteText:{
        fontSize:16,
        color:'blue'
    },
    deleteTextUnClickable:{
        fontSize:16,
        color:Colors.fontBlackColor_43,
    }

})

export default class PingModal extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            pointsCkeckedCount : 0, 
            delDisabled: true,
        }

        this.translateXValue = new Animated.Value(0);
        this.pwd = '123456'
        this.inputPassword = ''
    }
    static propTypes = {
        visible:PropTypes.bool.isRequired,
    };
    static defaultProps = {
    }
    
    onCirclePressed = (text) => {
        this.inputPassword = this.inputPassword + text;
        let inputlength = this.inputPassword.length;
        let p = this.pwd.substring(0,inputlength);
        if(this.inputPassword == p){
            if(inputlength == 6){
                let password =  this.inputPassword;
                this.inputPassword = ''
                this.setState({
                    pointsCkeckedCount : 0,
                    delDisabled: true,
                })
            }else{
                this.setState({
                    pointsCkeckedCount : inputlength,
                    delDisabled: false,
                })
            }
        }else{
            this.inputPassword = ''
            this.setState({
                pointsCkeckedCount : 0,
                delDisabled: true,
            })
            this.startAnimation()
        }
        
    }

    deletePressed = () => {
        this.inputPassword = this.inputPassword.substring(0,this.inputPassword.length-1);
        let inputlength = this.inputPassword.length;
        if(inputlength == 0){
            this.inputPassword = ''
            this.setState({
                pointsCkeckedCount : 0,
                delDisabled: true,
            })
        }else{
            this.setState({
                pointsCkeckedCount : inputlength,
                delDisabled: false,
            })
        }
    }

    startAnimation(){
        Animated.sequence([
            Animated.timing(this.translateXValue,{
                duration:50,
                toValue:-20
            }),
            Animated.timing(this.translateXValue,{
                duration:50,
                toValue:40
            }),
            Animated.timing(this.translateXValue,{
                duration:50,
                toValue:0
            }),
        ]).start();  
    }

    render(){
        return(
            <Modal
                  onStartShouldSetResponder={() => false}
                  animationType={'fade'}
                  transparent={true}
                  visible={this.props.visible}
                  onRequestClose={()=>{
                     //Alert.alert("Modal has been closed.");
                  }}
                  onShow={()=>{
                     //Alert.alert("Modal has been show.");
                  }}
                  
            >
                <View style={styles.modeBox}>
                      <StatusBarComponent barStyle={'dark-content'} /> 
                      <Text style={styles.title}>{I18n.t('launch.set_login_password')}</Text>
                      <Animated.View style={[styles.pointBox,{marginLeft:this.translateXValue}]}>
                           <PingPoint pointStyle={styles.pointStyle}
                                      isChecked={this.state.pointsCkeckedCount > 0 ? true : false}
                                      ></PingPoint>
                           <PingPoint pointStyle={styles.pointStyle}
                                      isChecked={this.state.pointsCkeckedCount > 1 ? true : false}
                                      ></PingPoint>
                           <PingPoint pointStyle={styles.pointStyle}
                                      isChecked={this.state.pointsCkeckedCount > 2 ? true : false}
                                      ></PingPoint>
                           <PingPoint pointStyle={styles.pointStyle}
                                      isChecked={this.state.pointsCkeckedCount > 3 ? true : false}
                                      ></PingPoint>
                           <PingPoint pointStyle={styles.pointStyle}
                                      isChecked={this.state.pointsCkeckedCount > 4 ? true : false}
                                      ></PingPoint>
                           <PingPoint pointStyle={styles.pointStyle}
                                      isChecked={this.state.pointsCkeckedCount > 5 ? true : false}
                                      ></PingPoint>
                      </Animated.View>
                      <View style={styles.circleBox}>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {1}
                                      text2 = {''}
                                      onPress = {this.onCirclePressed}></PingCircle>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {2}
                                      text2 = {'A B C'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {3}
                                      text2 = {'D E F'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                      </View>
                      <View style={styles.circleBox}>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {4}
                                      text2 = {'G H I'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {5}
                                      text2 = {'J K L'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {6}
                                      text2 = {'M N O'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                      </View>
                      <View style={styles.circleBox}>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {7}
                                      text2 = {'P Q R S'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {8}
                                      text2 = {'R U V'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {9}
                                      text2 = {'W X Y Z'}
                                      onPress = {this.onCirclePressed}></PingCircle>
                      </View>
                      <View style={styles.circleBox}>
                          <PingCircle circleStyle={styles.circleStyle}
                                      text1 = {0}
                                      text2 = {''}
                                      onPress = {this.onCirclePressed}></PingCircle>
                      </View>
                      <View style={styles.deleteBox}>
                          <TouchableOpacity style={styles.deleteBtn}
                                activeOpacity={0.6}
                                disabled={this.state.delDisabled}
                                onPress = {this.deletePressed}>
                                      <Text style={this.state.delDisabled ? styles.deleteTextUnClickable : styles.deleteText}>{I18n.t('home.delete')}</Text>
                          </TouchableOpacity>    
                      </View>
                </View>     
            </Modal> 
        )
    }
}