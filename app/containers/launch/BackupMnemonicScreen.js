import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Modal,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'

const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        flex:1,
        alignItems:'center',
    },
    contentBox:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:100,
        paddingLeft:20,
        paddingRight:20,
    },
    icon:{
        width:46,
        height:46,
    },

    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:Colors.fontBlueColor,
        marginTop:15,
        marginBottom:30,
    },
    contentTxt:{
        fontSize:FontSize.ContentSize,
        color:Colors.fontDarkGrayColor,
    },
    mnemonicTxt:{
        alignSelf:'stretch',
        backgroundColor:'rgb(237,237,237)',
        fontSize:16,
        color:'black',
        borderRadius:20,
        marginTop:30,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:20,
        paddingBottom:20,
        textAlign:'left',
        lineHeight:25,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,
    }
})

class BackupMnemonicScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalVisible : true,
        }
    }
    onCloseModal() {
        this.setState({modalVisible: false});
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenshotWarn
                    text = '知道了'
                    modalVisible = {this.state.modalVisible}
                    onPress = {()=> this.onCloseModal()}
                />

                <View style={styles.contentBox}>
                    <Image style={styles.icon} source={require('../../assets/launch/mnemonicIcon.jpg')}/>
                    <Text style={styles.titleTxt}>备份助记词</Text>
                    <Text style={styles.contentTxt}>请仔细抄写下方助记词，我们将在下一步验证。</Text>
                    <Text style={styles.mnemonicTxt}>{this.props.mnemonic}</Text>    

                    <View style={styles.buttonBox}>
                         <BlueButtonBig
                             onPress = {()=> this.props.navigation.navigate('VerifyMnemonic')}
                             text = '下一步'
                         />
                    </View>          
                </View>

            </View>    
            
        );
    }
}

const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});

export default connect(mapStateToProps,{})(BackupMnemonicScreen)

