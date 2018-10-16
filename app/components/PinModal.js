import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize,StorageKey} from '../config/GlobalConfig'
import { showToast } from '../utils/Toast';
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import PinComponent from './PinComponent'
import {
    View,
    StyleSheet,
    Text,
    Modal,
    Animated,
    DeviceEventEmitter,
    
}from 'react-native'


const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        //backgroundColor:'rgba(256,256,256,0.9)',
        backgroundColor:'white',
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

        this.inputPassword = ''
        this.isAnimation = false
    }
    static propTypes = {
        visible:PropTypes.bool.isRequired,
        password:PropTypes.string.isRequired,
    };
    static defaultProps = {
    }


    
    onCirclePressed = (text) => {
        this.inputPassword = this.inputPassword + text;
        let inputlength = this.inputPassword.length;
        //let p = this.props.password.substring(0,inputlength);
        if(inputlength == 6){
            let password =  this.inputPassword;
            this.inputPassword = ''
            this.isAnimation = password != this.props.password
            this.setState({
                    pointsCkeckedCount : 0,
                    delDisabled: true,
            }) 
            setTimeout(()=>{
                if(password == this.props.password){
                    this.hidePinConfirm()
                }else{
                }
            }, 150);
            
            

        }else{
            this.isAnimation = false
            this.setState({
                pointsCkeckedCount : inputlength,
                delDisabled: inputlength==0 ? true : false,
            })
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

    

    hidePinConfirm(){
        let object = {
            pinType: 'PinModal',
            visible:false,
        }
        DeviceEventEmitter.emit('pinIsShow', {pinObject: object});   
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
                      <PinComponent title={I18n.t('launch.enter_password')}
                           pointsCkeckedCount={this.state.pointsCkeckedCount}
                           circlePressed={this.onCirclePressed}
                           deletePressed={this.deletePressed}
                           isAnimation = {this.isAnimation}
                           isShowDeleteBtn = {true}
                           delDisabled = {this.state.delDisabled}>

                      </PinComponent>
                      
                </View>     
            </Modal> 
        )
    }
}