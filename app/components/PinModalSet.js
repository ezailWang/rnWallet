import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import { I18n } from '../config/language/i18n';
import StatusBarComponent from './StatusBarComponent';
import LinearGradient from 'react-native-linear-gradient'
import PinComponent from './PinComponent'
//import Pin from './Pin'

import {
    View,
    StyleSheet,
    Modal,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
}from 'react-native'


const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        backgroundColor:'rgba(256,256,256,0.9)',
        alignItems:'center',
    },

    warnContainer:{
        width:Layout.WINDOW_WIDTH,
        height:Layout.WINDOW_HEIGHT,
        position: 'absolute',
        backgroundColor:'rgba(179,179,179,0.8)',
        zIndex:100,
        justifyContent:'center',
        alignItems:'center',
    },

    warnBox:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40,
        paddingBottom:40,
        marginLeft:40,
        marginRight:40,
        
    },
    warnIcon:{
        width:80,
        height:80,
    },
    warnTitleTxt:{
        fontSize:18,
        fontWeight:'bold',
        color:Colors.fontBlackColor_31,
        marginTop:15,
        marginBottom:20,
    },
    warnContentTxt:{
        fontSize:16,
        alignSelf:'stretch',
        color:Colors.fontBlackColor_31,
        marginTop:4,
    },
    warnBtnOpacity:{
        height:40,
        alignSelf:'stretch',
        borderRadius:5,
        backgroundColor: '#ff3635',
        marginTop:30,
    },
    linearGradient:{
        height:40,
        alignSelf:'stretch',
        borderRadius:5,
    },
    warnTxt:{
        backgroundColor: 'transparent',
        color:'#fff',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
        fontWeight:'bold',   
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

    iknow(){
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
                      <PinComponent title={I18n.t('launch.set_login_password')}
                           pointsCkeckedCount={this.state.pointsCkeckedCount}
                           circlePressed={this.onCirclePressed}
                           deletePressed={this.deletePressed}
                           isAnimation = {false}
                           isShowDeleteBtn = {true}
                           delDisabled = {this.state.delDisabled}>

                      </PinComponent>
                      {this.state.isShowWarn ? 
                      <View style={styles.warnContainer}>
                          <View style={styles.warnBox}>
                               <Image style={styles.warnIcon} source={require('../assets/common/warningIcon.png')}/>
                               <Text style={styles.warnTitleTxt}>{}</Text>
                               <Text style={styles.warnContentTxt}>{I18n.t('modal.ping_id_warn1')}</Text>
                               <Text style={styles.warnContentTxt}>{I18n.t('modal.ping_id_warn2')}</Text>
                               <TouchableOpacity style={styles.warnBtnOpacity} activeOpacity={0.6} onPress = {() => this.iknow()}>
                                     <LinearGradient colors={['#ff3455', '#e90329']}
                                           start={{x:0,y:0}}
                                           end={{x:0,y:1}}
                                           style={[styles.linearGradient]}>
                                           <Text style={styles.warnTxt}>{I18n.t('modal.i_know')}</Text>
                                     </LinearGradient>    
                               </TouchableOpacity>
                          </View> 
                      </View> : null}
                </View>     
            </Modal> 
        )
    }
}