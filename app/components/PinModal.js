import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import PinCircle from './PinCircle'
import PinPoint from './PinPoint'
import {
    View,
    StyleSheet,
    Text,
    Modal,
    Animated,
}from 'react-native'


const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        backgroundColor:'rgba(256,256,256,0.9)',
        alignItems:'center',
    },
})

export default class PinModal extends PureComponent{
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
                  }}
                  onShow={()=>{
                  }}
                  
            >
                <View style={styles.modeBox}>
                      <StatusBarComponent barStyle={'dark-content'} /> 
                      <PinComponent title={I18n.t('launch.repeat_new_password')}
                           pointsCkeckedCount={this.state.pointsCkeckedCount}
                           circlePressed={this.onCirclePressed}
                           deletePressed={this.deletePressed}
                           isAnimation = {false}
                           isShowDeleteBtn = {true}
                           delDisabled = {this.state.delDisabled}>

                      </PinComponent>
                      
                </View>     
            </Modal> 
        )
    }
}