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
import { I18n } from '../config/language/i18n';
const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(179,179,179,0.8)',
        //zIndex:10,
    },
    contentBox:{
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
    icon:{
        width:80,
        height:80,
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'bold',
        color:Colors.fontBlackColor_31,
        marginTop:15,
        marginBottom:20,
    },
    contentTxt:{
        fontSize:16,
        alignSelf:'stretch',
        marginBottom:30,
        color:Colors.fontBlackColor_31,
    },
    btnOpacity:{
        height:40,
        alignSelf:'stretch',
        borderRadius:20,
        backgroundColor: '#ff3635',
    },
    txt:{
        backgroundColor: 'transparent',
        color:'#fff',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
        fontWeight:'bold',
    }
});
export default class ScreenshotWarn extends Component{
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        content:PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired,
        modalVisible: PropTypes.bool.isRequired,
    }

    
    
   render(){
        return(
            <Modal
                  animationType={'fade'}
                  transparent={true}
                  visible={this.props.modalVisible}
                  onRequestClose={()=>{
                     //Alert.alert("Modal has been closed.");
                  }}
                  onShow={()=>{
                     //Alert.alert("Modal has been show.");
                  }}
                  
            >
                <View style={styles.modeBox}>
                  <View style={styles.contentBox}>
                     <Image style={styles.icon} source={require('../assets/launch/warnIcon.png')}/>
                     <Text style={styles.titleTxt}>{I18n.t('modal.screenshot_warn')}</Text>
                     <Text style={styles.contentTxt}>{this.props.content}</Text>
                     <TouchableOpacity style={styles.btnOpacity} activeOpacity={0.6} onPress = {this.props.onPress}>
                         <Text style={styles.txt}>{this.props.btnText}</Text>
                     </TouchableOpacity>
                  </View> 
                </View>     
            </Modal>      

        );
    }
}