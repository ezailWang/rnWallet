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
import BlueButton from '../BlueButton';

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
        paddingBottom:40,
        marginLeft:20,
        marginRight:20,
        borderRadius:5,
    },
    inputText:{
        height:40,
        alignSelf:'stretch',
        paddingLeft:10,
        borderRadius:5,
        borderColor:'rgb(236,236,236)',
        borderWidth:1,
        color:'rgb(146,146,146)',
    },
    buttonBox:{
        flexDirection:'row',
        marginTop:40,
    },
    leftBtnOpacity:{
        flex:1,
        height:40,
        alignSelf:'stretch',
        borderRadius:20,
        backgroundColor: 'transparent',
        borderColor:'rgb(85,146,246)',
        borderWidth:1,
        
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
                        onChange={(event) => {
                            renderThis.inputText(event);
                        }}
                    />
                    <View style={styles.buttonBox}>
                        <TouchableOpacity style={[styles.leftBtnOpacity]} activeOpacity={0.6} onPress = { this.props.leftPress }>
                            <Text style={styles.leftBtnTxt}>{this.props.leftTxt}</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.rightBtnBox}>
                            <BlueButton
                                onPress = { this.props.rightPress}
                                text = {this.props.rightTxt}
                            /> 
                        </View> 
                    </View>
                </View>    
                </View>     
            </Modal>      

        );
    }
}