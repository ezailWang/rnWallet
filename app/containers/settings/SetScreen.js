import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,TextInput,Alert,ScrollView,TouchableOpacity,BackHandler} from 'react-native';

import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage'
import keystoreUtils from '../../utils/keystoreUtils'
import {NextButton} from '../../components/Button';
import InputTextDialog from '../../components/InputTextDialog';
import {Colors,FontSize,StorageKey}from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import * as Actions from '../../config/action/Actions';
import {showToast} from '../../utils/Toast';
import {WhiteBgHeader} from '../../components/NavigaionHeader';
import Loading from  '../../components/LoadingComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.bgGrayColor,
        paddingBottom:20,
    },
    btnOpacity:{
        flexDirection:'row',
        height:56,
        alignSelf:'stretch',
        alignItems:'center',
        backgroundColor:'#fff',
        marginTop:1,
        paddingLeft:20,
        paddingRight:20,
    },
    btnTxt:{
        flex:1,
        backgroundColor: 'transparent',
        color:Colors.fontBlackColor_43,
        fontSize:FontSize.TitleSize,
        height:56,
        lineHeight:56,
        textAlign:'left',
    },
    headIcon:{
        height:36,
        width:36,
    },
    walletName:{
        fontSize:FontSize.DetailTitleSize,
        color:Colors.fontGrayColor_a1
    },
    buttonBox:{
        marginTop:1,
        justifyContent:'flex-end',
        alignSelf:'stretch',
    },
    marginBottom20:{
        marginBottom:20,
    }
    
})

class SetScreen extends Component {
  
    constructor(props){
        super(props);
        this.state = {
            inputDialogPlaceholder:'',
            modalText:'',
            modalVisible : false,
            loadingVisible:false,
        }
    }

    openInputNameModal() {
        this.setState({
            inputDialogPlaceholder: '请输入钱包名称',
            modalText:this.props.walletName,
            modalVisible: true,
        });
    }
    openInputPwdModal() {
        this.setState({
             inputDialogPlaceholder:'请输入密码',
             modalText:'',
             modalVisible: true,
        });
    }
    closeInputModal(){
        this.setState({modalVisible: false});
    }
    inputDialogConfirmClick(){
        if(this.state.inputDialogPlaceholder == "请输入钱包名称"){
            var name = this.refs.inputTextDialog.state.text;
            if(name==null || name == '' || name == undefined){
                showToast('请输入钱包名称')
            }else{
                this.modifyWalletName(name);
            }
           
        }else{
            var password = this.refs.inputTextDialog.state.text;
            if(password == null || password == '' || password == undefined){
                this.closeInputModal();//隐藏弹框
                showToast('请输入密码')
            }else{
                this.closeInputModal();//隐藏弹框
                this.showLoading()
                this.exportKeyPrivate(password);
            }
            
            
        }
    }
    async  modifyWalletName(name){
       // var name = this.refs.inputTextDialog.state.text;
        var key = StorageKey.User;
        
        var loadUser = await StorageManage.load(key);
        if(loadUser == null){
            loadUser = {
                name: name,
            }
        }else{
            loadUser.name = name;//修改name值
        }
        StorageManage.save(key, loadUser)
        this.props.modifyWalletName(name);

        this.refs.inputTextDialog.state.text = '';
        this.closeInputModal();//隐藏弹框 
    }


    async exportKeyPrivate(password){
        var privateKey = await keystoreUtils.getPrivateKey(password)
        this.closeLoading();//关闭Loading
        if(privateKey == null){
            alert("导出私钥出错");
        }else{
            this.props.navigation.navigate('ExportPrivateKey',{privateKey: privateKey})
        }
    }

    async exportKeystore(){
        //this.showLoading();
        try{ 
            var address = this.props.walletAddress;
            var keystore = await keystoreUtils.importFromFile(address)
            //this.closeLoading();
            this.props.navigation.navigate('ExportKeystore',{keystore: keystore});
        }catch (err) {
          //this.closeLoading();
          alert("导出私钥出错");
          console.log('exportKeystoreErr:', err)
        }
    }

    async exportWallet(){
         var key = 'uesr'
         var user = await StorageManage.load(key);
         var str = await keystoreUtils.importFromFile(user.address)
         var newKeyObject = JSON.parse(str)
    }

    showLoading(){
        this.setState({
            loadingVisible:true,
        })
    }
    closeLoading(){
        this.setState({
            loadingVisible:false,
        })
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
    
    render() {
        return (
            <View style={styles.container}>
                <StatusBarComponent/>
                <WhiteBgHeader  navigation={this.props.navigation} text='设置'/>
                <InputTextDialog
                    ref = "inputTextDialog"
                    placeholder = {this.state.inputDialogPlaceholder}
                    leftTxt = "取消"
                    rightTxt = '确定'
                    leftPress = {()=> this.closeInputModal()}
                    rightPress = {()=> this.inputDialogConfirmClick()}
                    modalVisible = {this.state.modalVisible}
                    initText = {this.state.modalText}
                />
                <TouchableOpacity style={[styles.btnOpacity]} 
                                  activeOpacity={0.6} 
                                  onPress={()=> this.openInputNameModal()}>
                    <Text style={styles.btnTxt}>修改钱包名称</Text>
                    <Text style={styles.walletName}>{this.props.walletName}</Text>
                </TouchableOpacity> 
                
                
                
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.exportKeystore()}
                        text = '导出Keystore'
                    />
                </View> 
                <View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.openInputPwdModal()}
                        text = '导出私钥'
                    />
                </View> 
                <Loading visible={this.state.loadingVisible}>
                </Loading>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    walletName:state.Core.walletName,
    walletAddress:state.Core.walletAddress,
});
const mapDispatchToProps = dispatch => ({
    modifyWalletName: (walletName) => dispatch(Actions.setWalletName(walletName)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SetScreen)


/*
//第一版  先隐藏 【更换图标  导出助记词  修改密码】
<TouchableOpacity style={[styles.btnOpacity]} 
                                  activeOpacity={0.6} 
                                  onPress={()=> this.isOpenModifyModal(true)}>
                    <Text style={styles.btnTxt}>更换图标</Text>
                    <Image style={styles.headIcon} source={require('../../assets/common/photoIcon.png')}/>
                </TouchableOpacity> 
<View style={styles.buttonBox}>
                    <NextButton
                        //onPress = {()=> this.props.navigation.navigate('ReceiptCode')}
                        onPress = {()=> this.exportWallet()}
                        text = '导出助记词'
                    />
                </View>                 

<View style={styles.buttonBox}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('ModifyPassword')}
                        text = '修改密码'
                    />
                </View>   

 <View style={[styles.buttonBox,styles.marginBottom20]}>
                    <NextButton
                        onPress = {()=> this.props.navigation.navigate('PasswordPrompInfo')}
                        text = '密码提示信息'
                    />
                </View>                
 
 */