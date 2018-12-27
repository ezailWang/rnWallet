import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing,
    Modal,
    Button,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {Colors,FontSize} from '../config/GlobalConfig'
import LinearGradient from 'react-native-linear-gradient'
import { I18n } from '../config/language/i18n';
const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(179,179,179,0.8)',
    },
    contentBox:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40,
        paddingBottom:30,
        marginLeft:30,
        marginRight:30,
        
    },
    icon:{
        width:80,
        height:80,
        marginTop:15,
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'bold',
        color:Colors.fontBlackColor_31,
        marginBottom:15,
    },
    contentTxt:{
        fontSize:16,
        alignSelf:'stretch',
        color:Colors.fontBlackColor_31,
        marginTop:4,
    },
    btnOpacity:{
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
    txt:{
        backgroundColor: 'transparent',
        color:'#fff',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
        fontWeight:'bold',   
    },

    notRemindOpacity:{
        paddingTop:12,
        paddingBottom:10,
        alignItems:'center',
        flexDirection:'row'
    },
    notRemindIcon:{
        width:18,
        height:18,
    },
    notRemindText:{
        marginLeft:6,
        color:Colors.fontBlackColor_43,
        fontSize:14,
    }
});
export default class ScreenshotWarn extends Component{
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        content:PropTypes.string.isRequired,
        modalVisible: PropTypes.bool.isRequired,
        btnText: PropTypes.string.isRequired,  
        title:PropTypes.string,
        content1:PropTypes.string,     
        isShowNotRemindBtn:  PropTypes.bool, 
        notRemindPress:PropTypes.func,
        isNotRemind:PropTypes.bool
    }

    static defaultProps = {
        title:'',
        content1:'',
        isShowNotRemindBtn:false,
        isNotRemind:false,
    }
    
    
   render(){
        let choseIcon = this.props.isNotRemind ? require('../assets/set/chose_off.png') : require('../assets/set/chose.png');
        return(
            <Modal
                  onStartShouldSetResponder={() => false}
                  animationType={'fade'}
                  transparent={true}
                  visible={this.props.modalVisible}
                  onRequestClose={()=>{
                    
                  }}
                  onShow={()=>{
                     
                  }}
                  
            >
                <View style={styles.modeBox}>
                  <View style={styles.contentBox}>
                     <Image style={styles.icon} source={require('../assets/common/warningIcon.png')}/>
                     {this.props.title !='' ? <Text style={styles.titleTxt}>{this.props.title}</Text> : null}
                     <Text style={styles.contentTxt}>{this.props.content}</Text>
                     <Text style={styles.contentTxt}>{this.props.content1}</Text>
                     <TouchableOpacity style={styles.btnOpacity} activeOpacity={0.6} onPress = {this.props.onPress}>
                            <LinearGradient colors={['#ff3455', '#e90329']}
                                start={{x:0,y:0}}
                                end={{x:0,y:1}}
                                style={[styles.linearGradient]}>
                                      <Text style={styles.txt}>{this.props.btnText}</Text>
                            </LinearGradient>    
                     </TouchableOpacity>
                     {
                        this.props.isShowNotRemindBtn ? 
                        <TouchableOpacity style={styles.notRemindOpacity} activeOpacity={0.6} onPress = {this.props.notRemindPress}>
                            <Image style={styles.notRemindIcon}
                                   source={choseIcon} resizeMode='contain'/>
                            <Text style={styles.notRemindText}>{I18n.t('modal.not_remind_again')}</Text> 
                        </TouchableOpacity> : null
                     }
                     
                  </View> 
                </View>     
            </Modal>      

        );
    }
}