import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import ScreenshotWarn from './ScreenShowWarn'
import PinComponent from './PinComponent'
//import Pin from './Pin'

import {
    View,
    StyleSheet,
    Modal,
    DeviceEventEmitter
}from 'react-native'


const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        backgroundColor:'rgba(256,256,256,0.9)',
        alignItems:'center',
    }

})

export default class PinModalSet extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            pointsCkeckedCount : 0, 
            delDisabled: true,
            isShowWarn:true,
        }
        this.inputPassword = ''
    }
    static propTypes = {
        visible:PropTypes.bool.isRequired,
    };
    static defaultProps = {
        visible:false
    }
    
    onCirclePressed = (text) => {
        this.inputPassword = this.inputPassword + text;
        let inputlength = this.inputPassword.length;
        if(inputlength == 6){
            let password =  this.inputPassword;
            this.inputPassword = ''
            this.setState({
                pointsCkeckedCount : 0,
                delDisabled: true,
            })
            this.hidePinSet(password)
        }else{
            this.setState({
                pointsCkeckedCount : inputlength,
                delDisabled: false,
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

    hidePinSet(password){
        let object = {
            pinType: 'PinModalSet',
            visible: false,
            pinPassword : password
        }
        DeviceEventEmitter.emit('pinIsShow', {pinObject: object});
    }

    onCloseWarn(){
        this.setState({
            isShowWarn:false,
        })
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
                      {/*<ScreenshotWarn
                           content = {I18n.t('modal.ping_id_warn1')}
                           content1 = {I18n.t('modal.ping_id_warn2')}
                           btnText = {I18n.t('modal.i_know')}
                           modalVisible = {this.state.isShowWarn}
                           onPress = {()=> this.onCloseWarn()}
                      />*/}
                      <PinComponent title={I18n.t('launch.set_login_password')}
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