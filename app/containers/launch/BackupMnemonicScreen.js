import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Modal,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
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
        width:48,
        height:48,
    },

    titleTxt:{
        fontSize:20,
        fontWeight:'bold',
        color:Colors.fontBlueColor,
        marginTop:15,
        marginBottom:30,
    },
    contentTxt:{
        fontSize:FontSize.ContentSize,
        color:Colors.fontGrayColor_a0,
    },
    mnemonicTxt:{
        alignSelf:'stretch',
        backgroundColor:Colors.bgColor_e,
        fontSize:16,
        color:'black',
        borderRadius:5,
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
                <StatusBarComponent/>
                <ScreenshotWarn
                    text = '知道了'
                    modalVisible = {this.state.modalVisible}
                    onPress = {()=> this.onCloseModal()}
                />
                <View style={styles.contentBox}>    
                    <Image style={styles.icon} source={require('../../assets/launch/mnemonicIcon.png')} resizeMode={'center'}/>
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

