import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import { I18n } from '../config/language/i18n';
import PinCircle from './PinCircle'
import PinPoint from './PinPoint'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Modal,
    Animated,
    Vibration
}from 'react-native'


const styles = StyleSheet.create({
    pinBox:{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:'center',
        alignItems:'center',
    },
    title:{
        fontSize:18,
        color:Colors.fontBlackColor_43,
        marginTop:80,
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
        color:Colors.fontBlueColor
    },
    deleteTextUnClickable:{
        fontSize:16,
        color:Colors.fontBlackColor_43,
    }

})

export default class PinComponent extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
        }

        this.translateXValue = new Animated.Value(0);
        this.inputPassword = ''
    }
    static propTypes = {
        title : PropTypes.string.isRequired,
        pointsCkeckedCount:PropTypes.number.isRequired,
        circlePressed: PropTypes.func.isRequired,
        deletePressed: PropTypes.func,
        isAnimation:PropTypes.bool,
        isShowDeleteBtn:PropTypes.bool,
        delDisabled:PropTypes.bool, 
    };
    static defaultProps = {
        pointsCkeckedCount : 0,
        isAnimation:false,
        isShowDeleteBtn : false,
        delDisabled:false,
    }
    
    onCirclePressed = (text) => {
        this.props.circlePressed(text)
    }

    deletePressed = () => {
        this.props.deletePressed()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isAnimation == true){
            this.startAnimation()
        }
    }

    startAnimation(){
        Vibration.vibrate([0,150],false)
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
            <View style={styles.pinBox}>
                      <Text style={styles.title}>{this.props.title}</Text>
                      <Animated.View style={[styles.pointBox,{marginLeft:this.translateXValue}]}>
                           <PinPoint pointStyle={styles.pointStyle}
                                      isChecked={this.props.pointsCkeckedCount > 0 ? true : false}
                                      ></PinPoint>
                           <PinPoint pointStyle={styles.pointStyle}
                                      isChecked={this.props.pointsCkeckedCount > 1 ? true : false}
                                      ></PinPoint>
                           <PinPoint pointStyle={styles.pointStyle}
                                      isChecked={this.props.pointsCkeckedCount > 2 ? true : false}
                                      ></PinPoint>
                           <PinPoint pointStyle={styles.pointStyle}
                                      isChecked={this.props.pointsCkeckedCount > 3 ? true : false}
                                      ></PinPoint>
                           <PinPoint pointStyle={styles.pointStyle}
                                      isChecked={this.props.pointsCkeckedCount > 4 ? true : false}
                                      ></PinPoint>
                           <PinPoint pointStyle={styles.pointStyle}
                                      isChecked={this.props.pointsCkeckedCount > 5 ? true : false}
                                      ></PinPoint>
                      </Animated.View>
                      <View style={styles.circleBox}>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {1}
                                      text2 = {''}
                                      onPress = {this.onCirclePressed}></PinCircle>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {2}
                                      text2 = {'A B C'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {3}
                                      text2 = {'D E F'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                      </View>
                      <View style={styles.circleBox}>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {4}
                                      text2 = {'G H I'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {5}
                                      text2 = {'J K L'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {6}
                                      text2 = {'M N O'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                      </View>
                      <View style={styles.circleBox}>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {7}
                                      text2 = {'P Q R S'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {8}
                                      text2 = {'R U V'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {9}
                                      text2 = {'W X Y Z'}
                                      onPress = {this.onCirclePressed}></PinCircle>
                      </View>
                      <View style={styles.circleBox}>
                          <PinCircle circleStyle={styles.circleStyle}
                                      text1 = {0}
                                      text2 = {''}
                                      onPress = {this.onCirclePressed}
                                      isNeedLetter = {false}></PinCircle>
                      </View>
                      {
                          this.props.isShowDeleteBtn ?  
                          <View style={styles.deleteBox}>
                                <TouchableOpacity style={styles.deleteBtn}
                                    activeOpacity={0.6}
                                    disabled={this.props.delDisabled}
                                    onPress = {this.deletePressed}>
                                      <Text style={this.props.delDisabled ? styles.deleteTextUnClickable : styles.deleteText}>{I18n.t('home.delete')}</Text>
                                </TouchableOpacity>    
                          </View> : null
                      }
                      
                </View>
        )
    }
}