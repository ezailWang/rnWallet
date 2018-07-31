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
       // zIndex:10,
        backgroundColor:'#fff',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40,
        paddingBottom:40,
        marginLeft:40,
        marginRight:40,
        
    },
    icon:{
        width:50,
        height:50,
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:'rgb(66,66,66)',
        marginTop:15,
        marginBottom:20,
    },
    contentTxt:{
        fontSize:16,
        alignSelf:'stretch',
        marginBottom:30,
    },
    btnOpacity:{
        height:40,
        alignSelf:'stretch',
        borderRadius:20,
        backgroundColor: 'red',
    },
    txt:{
        backgroundColor: 'transparent',
        color:'#fff',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
    }
});
export default class ScreenshotWarn extends Component{
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
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
                     <Image style={styles.icon} source={require('../../img/warnIcon.jpg')}/>
                     <Text style={styles.titleTxt}>请勿截图</Text>
                     <Text style={styles.contentTxt}>如果有人获取你的助记词将直接获取你的资产！请抄写下助记词冰村放在安全的地方。</Text>
                     <TouchableOpacity style={styles.btnOpacity} activeOpacity={0.6} onPress = {this.props.onPress}>
                         <Text style={styles.txt}>{this.props.text}</Text>
                     </TouchableOpacity>
                  </View> 
                </View>     
            </Modal>      

        );
    }
}