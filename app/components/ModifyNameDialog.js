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
import CommonButton from './CommonButton';
import {Colors} from '../config/GlobalConfig'
import {BlueButtonSmall,WhiteButtonSmall} from '../components/Button'
import Layout from '../config/LayoutConstants'

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
        paddingTop:30,
        paddingBottom:30,
        marginTop:Layout.WINDOW_HEIGHT*0.23,
        marginLeft:20,
        marginRight:20,
        //borderRadius:5,
    },
    inputText:{
        height:40,
        alignSelf:'stretch',
        paddingLeft:10,
        borderRadius:5,
        borderColor:Colors.fontGrayColor,
        borderWidth:1,
        color:Colors.fontBlackColor
    },
    buttonBox:{
        flexDirection:'row',
        marginTop:20,
    },
    leftBtnOpacity:{
        flex:1,
        height:40,
        alignSelf:'stretch',
        //borderRadius:20,
        //backgroundColor: 'transparent',
        //borderColor:'rgb(85,146,246)',
        //borderWidth:1,
    },
    leftBtnTxt:{
        color:'rgb(85,146,246)',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
    },
    rightBtnBox:{
        flex:1,
        marginLeft:20,
    }

});
export default class ModifyNameDialog extends Component{
    static propTypes = {
        placeholder:PropTypes.string.isRequired,
        leftPress: PropTypes.func.isRequired,
        rightPress: PropTypes.func.isRequired,
        rightTxt: PropTypes.string.isRequired,
        leftTxt:PropTypes.string.isRequired,
        modalVisible: PropTypes.bool.isRequired,
    }
    constructor(props){
        super(props);
        this.state = {
            name : '',
        }
    }

    inputText(event){
        this.setState({
            name: event.nativeEvent.text
        })
    }
   render(){
        var renderThis = this;
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
                    <TextInput style={styles.inputText} 
                        placeholder= {this.props.placeholder}
                        underlineColorAndroid='transparent' 
                        selectionColor='#00bfff' 
                        ref={(input)=>{
                            this.inputText=input;
                        }}
                        onChange={(event) => {
                            renderThis.inputText(event);
                        }}
                    />
                    <View style={styles.buttonBox}>
                     
                        <View style={[styles.leftBtnOpacity]}>
                            <WhiteButtonSmall onPress={this.props.leftPress}
                                              text={this.props.leftTxt}>
                            </WhiteButtonSmall>
                        </View>
                        <View style={styles.rightBtnBox}>
                            <BlueButtonSmall onPress = { this.props.rightPress}
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