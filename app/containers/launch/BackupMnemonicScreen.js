import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Modal,TouchableOpacity ,Dimensions,BackHandler} from 'react-native';
import { connect } from 'react-redux';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgNoTitleHeader} from '../../components/NavigaionHeader'
import {showToast} from '../../utils/Toast';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    contentBox:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:ScreenHeight*0.15,
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
    },
    icon:{
        width:48,
        height:48,
    },

    titleTxt:{
        fontSize:20,
        fontWeight:'bold',
        color: Colors.fontBlueColor,
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
        //borderRadius:5,
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
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.goBack();
        return true;
    }
    complete(){
        let _this = this;
        //this.props.navigation.navigate('VerifyMnemonic',{password: this.props.navigation.state.params.password})
        this.props.navigation.navigate('VerifyMnemonic', {
            password: this.props.navigation.state.params.password,
            callback: function () {
                _this.setState({
                    modalVisible : true,
                })
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <WhiteBgNoTitleHeader navigation={this.props.navigation}/>
                <ScreenshotWarn
                    content = '如果有人获取你的助记词将直接获取你的资产！请抄写下助记词并放在安全的地方。'
                    btnText = '知道了'
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
                             onPress = {()=> this.complete()}
                             text = '助记词已抄好'
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

