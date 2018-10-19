import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from '../config/GlobalConfig'
import Layout from '../config/LayoutConstants'
import { I18n } from '../config/language/i18n'

const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(179,179,179,0.8)',
    },
    contentBox:{
        width:260,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40,
        borderRadius:5,
    },
    title:{
        fontSize:16,
        color:Colors.fontBlackColor_43,
        textAlign:'center',
        marginBottom:10,
        fontWeight:'500',
    },
    content:{
        fontSize:14,
        color:Colors.fontBlackColor_43,
        textAlign:'center',
    },
    line:{
        marginTop:30,
        width:260,
        height:1,
        backgroundColor:Colors.borderColor_e
    },
    buttonBox:{
        height:40,
        width:260, 
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        fontSize:16,
        color:Colors.fontBlueColor,
        fontWeight:'500',
    }
    
   
});
export default class MyAlert extends Component{
    static propTypes = {
        modalVisible:PropTypes.bool.isRequired,
        title:PropTypes.string,
        content:PropTypes.string.isRequired,
        okPress:PropTypes.func.isRequired,
        
    }

    static defaultProps = {
        title: I18n.t('modal.prompt')
    }

    render(){
        return(
            <Modal
                  onStartShouldSetResponder={() => false}
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
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.content}>{this.props.content}</Text>
                    <View style={styles.line}></View>
                    <TouchableOpacity style={styles.buttonBox}
                                      onPress = { this.props.okPress }>
                         <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>    
                </View>     
            </Modal>      

        );
    }
}