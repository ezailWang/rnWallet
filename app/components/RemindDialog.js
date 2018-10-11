import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from '../config/GlobalConfig'
import {BlueButtonSmall,WhiteButtonSmall} from './Button'
import Layout from '../config/LayoutConstants'
import { I18n } from '../config/language/i18n'

const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        // justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.blackOpacityColor,
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
        marginTop:Layout.WINDOW_HEIGHT*0.23,
        marginLeft:20,
        marginRight:20,
        //borderRadius:5,
    },
    text:{
        fontSize:15,
        color:Colors.fontBlackColor,
        textAlign:'center',
    },
    buttonBox:{
        flexDirection:'row',
        marginTop:40,
    },
    leftBtnBox:{
        flex:1,
    },
    rightBtnBox:{
        flex:1,
        marginLeft:20,
    },
   
});
export default class RemindDialog extends Component{
    static propTypes = {
        content:PropTypes.string.isRequired,
        leftPress: PropTypes.func.isRequired,
        rightPress: PropTypes.func.isRequired,
        modalVisible: PropTypes.bool.isRequired,
        rightTxt: PropTypes.string,
        leftTxt:PropTypes.string,
    }

    static defaultProps = {
        leftTxt: I18n.t('modal.cancel'),
        rightTxt: I18n.t('modal.confirm'),
    }

    /**constructor(props){
        super(props);
        this.state = {
            isVisible : false,
        }
    }

    componentWillMount(){
        console.log('L——componentWillMount',this.props.modalVisible) 
        this.setState({
            isVisible : this.props.modalVisible,
        })
    }

    componentWillReceiveProps(nextProps){
        console.log('L——componentWillReceiveProps',this.props.modalVisible) 
        console.log('L——componentWillReceiveProps1',nextProps) 
        this.setState({
            isVisible : nextProps.modalVisible,
        })
    }

    showModal(){
        if(!this.state.isVisible){
            this.setState({
                isVisible : true,
            })
        }   
    }

    hideModal(){
        if(this.state.isVisible){
            this.setState({
                isVisible : false,
            })
        } 
    }
    
    leftPressed=()=>{
        console.log('LLLL',this.props.leftPress) 
        if(this.props.leftPress != undefined){
            this.props.leftPress
        }else{
            this.hideModal();
        } 
    }
    
    rightPressed=()=>{
        console.log('LLLL1',this.props.rightPress) 
        this.props.rightPress
    }**/

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
                    <Text style={styles.text}>{this.props.content}</Text>
                    <View style={styles.buttonBox}>
                        <View style={styles.leftBtnBox}>
                            <WhiteButtonSmall onPress={this.props.leftPress}
                                              text={this.props.leftTxt}>
                            </WhiteButtonSmall>
                        </View>
                        <View style={styles.rightBtnBox}>
                            <BlueButtonSmall onPress = {this.props.rightPress}
                                             text = {this.props.rightTxt}>
                            </BlueButtonSmall>
                        </View> 
                    </View>
                </View>    
                </View>     
            </Modal>      

        );
    }
}