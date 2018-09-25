import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,SnapshotViewIOS,TouchableOpacity ,Dimensions,BackHandler} from 'react-native';
import { connect } from 'react-redux';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import {WhiteBgNoTitleHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import {showToast} from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    contentBox:{
        flex:1,
        width:Layout.WINDOW_WIDTH*0.9,
        alignItems:'center',
        alignSelf:'center',
        paddingTop:80,
    },
    icon:{
        width: 72,
        height: 72,
        marginBottom:10,
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
        textAlign:'center',
    },
    mnemonicTxt:{
        alignSelf:'stretch',
        backgroundColor:Colors.bgColor_e,
        fontSize:16,
        color:'black',
        borderRadius: 8,
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

class BackupMnemonicScreen extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            modalVisible : true,
        }
    }
    onCloseModal() {
        this.setState({modalVisible: false});
    }
    
    complete(){
        let _this = this;
        //this.props.navigation.navigate('VerifyMnemonic',{password: this.props.navigation.state.params.password})
        this.props.navigation.navigate('VerifyMnemonic', {
            password: this.props.navigation.state.params.password,
            callback: function () {
                console.log('L_back','back__________________________')
                _this.setState({
                    modalVisible : true,
                })
            }
        })
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation}/>
                <ScreenshotWarn
                    content = {I18n.t('modal.screenshot_warn_content')}
                    btnText = {I18n.t('modal.i_know')}
                    modalVisible = {this.state.modalVisible}
                    onPress = {()=> this.onCloseModal()}
                />
                <View style={styles.contentBox}>    
                    <Image style={styles.icon} source={require('../../assets/launch/backupWordIcon.png')} resizeMode={'center'}/>
                    <Text style={styles.titleTxt}>{I18n.t('launch.backup_mnemonic')}</Text>
                    <Text style={styles.contentTxt}>{I18n.t('launch.backup_mnemonic_prompt')}</Text>
                    <Text style={styles.mnemonicTxt}>{this.props.mnemonic}</Text>    

                    <View style={styles.buttonBox}>
                         <BlueButtonBig
                             onPress = {()=> this.complete()}
                             text = {I18n.t('launch.backup_mnemonic_complete')}
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

