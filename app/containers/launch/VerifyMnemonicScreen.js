import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Alert,Dimensions,BackHandler} from 'react-native';
import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'
import {BlueButtonBig} from '../../components/Button';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import {upsetArrayOrder} from './Common';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgNoTitleHeader} from '../../components/NavigaionHeader'
import {showToast} from '../../utils/Toast';
import Loading from '../../components/LoadingComponent';
import { StorageKey } from '../../config/GlobalConfig'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    contentContainer:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:ScreenHeight*0.05,
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
        //alignItems:'stretch',
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
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,
    },
    mnemonicItem:{
        height:28,
        fontSize:14,
        color:'black',
        lineHeight:28,
        paddingLeft:6,
        paddingRight:6,
        borderWidth:1,
        borderColor:Colors.fontGrayColor,
        backgroundColor:'white',
        marginLeft:6,
        marginRight:6,
        marginBottom:10,  
    },
    mnemonicList:{
        alignSelf:'stretch',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        marginTop:10,
    },
    mnemonicSortBorder:{
        //flex:1.2,
        //height:166,
        justifyContent:'center',
        alignSelf:'stretch',
        backgroundColor:Colors.bgColor_e,
        borderRadius:8,
        marginTop:30,
        marginBottom:10,
        paddingTop:38,
        paddingBottom:38,
        paddingLeft:8,
        paddingRight:8,
    },

})

class VerifyMnemonicScreen extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            mnemonicDatas : [],
            sortMnemonicDatas  : [],
            loadingVisible: false,
            isDisabled:true,//创建按钮是否可以点击
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
        return true;
    }

    backPressed(){
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
    }

    componentWillMount(){
        var m = this.props.mnemonic.split(' ');
        var md = upsetArrayOrder(m);
        this.setState({
            mnemonicDatas:md,
       })
    }


    

    addSortMnemonicFun(i,txt) {
        var smd = this.state.sortMnemonicDatas.slice(0);
        smd.push(txt);
        var md = this.state.mnemonicDatas.slice(0);
        md.splice(i,1)
        this.setState({
             mnemonicDatas: md,
             sortMnemonicDatas:smd,
        });
        this.btnIsEnableClick();
    }
    removeSortMnemonicFun(i,txt){
        var md = this.state.mnemonicDatas.slice(0);
        md.push(txt);
        var smd = this.state.sortMnemonicDatas.slice(0);
        smd.splice(i,1)
        this.setState({
             mnemonicDatas: md,
             sortMnemonicDatas:smd,
        });
        this.btnIsEnableClick();
    }

    btnIsEnableClick(){
        let isSortcomplete = false;
        let sortLength = this.state.sortMnemonicDatas.length + 1;

        if(sortLength == 12){
            isSortcomplete = false;
        }else{
            isSortcomplete = true;
        }

        this.setState({
            isDisabled : isSortcomplete
        })
    }

    completeClickFun(){
        this.setState({
            loadingVisible: true,
        })
        setTimeout(() => {
            this.startCreateWallet();//创建钱包
        }, 2000);
        /**if(this.state.sortMnemonicDatas.join(' ') == this.props.mnemonic){
            this.setState({
                loadingVisible: true,
            })
            setTimeout(() => {
                this.startCreateWallet();//创建钱包
            }, 2000);
        }else{
            Alert.alert(
                '备份失败',
                '请检查助记词是否正确',
            )
        }**/
        
    }

    async startCreateWallet() {
        try {
            var m = this.props.mnemonic;//助记词
            const seed = walletUtils.mnemonicToSeed(m)
            const seedHex = seed.toString('hex')
            var hdwallet = HDWallet.fromMasterSeed(seed)
            const derivePath = "m/44'/60'/0'/0/0"
            hdwallet.setDerivePath(derivePath)
            const privateKey = hdwallet.getPrivateKey()
            const checksumAddress = hdwallet.getChecksumAddressString()
            //console.log('L3_prikey:', hdwallet.getPrivateKeyString())
            
            var password = this.props.navigation.state.params.password;
            var params = { keyBytes: 32, ivBytes: 16 }
            var dk = keythereum.create(params);
            var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv,{kdfparams:{c:100}})
            await keystoreUtils.exportToFile(keyObject, "keystore")
            console.log('LL_keyObject',"keyObject完成");
            //var str = await keystoreUtils.importFromFile(keyObject.address)
            //var newKeyObject = JSON.parse(str)

            var object = {
                name: this.state.walletName,
                address: checksumAddress,
                extra: '',
            }
            StorageManage.save(StorageKey.User, object)
            //var loadRet = await StorageManage.load(key)

            this.props.setWalletAddress(checksumAddress);
            this.props.setWalletName(this.props.walletName);
            //console.log('LL_create',"完成");
            this.stopLoading()
            this.props.navigation.navigate('Home')  
        } catch (err) {
            this.stopLoading()
            showToast('创建钱包出错');
            console.log('createWalletErr:', err)
        }
    }

    stopLoading(){
        this.setState({
            loadingVisible: false,
        })
    }

    render() {
        var renderThis = this;
        var mnemonicView = [];
        this.state.mnemonicDatas.forEach(function(txt,index,b){
            mnemonicView.push(
                <Text key={index} style={styles.mnemonicItem} 
                      onPress = {(e) => {renderThis.addSortMnemonicFun(index,txt)}}
                >{txt}
                </Text>
            )
        })

        var sortMnemonicView = [];
        this.state.sortMnemonicDatas.forEach(function(txt,index,b){
            sortMnemonicView.push(
                <Text key={index} style={styles.mnemonicItem} 
                      onPress = {(e) => {renderThis.removeSortMnemonicFun(index,txt)}}
                >
                {txt}
                </Text>
            )
        })

        return (
            <View style={styles.container}>
                 <StatusBarComponent/>
                 <WhiteBgNoTitleHeader navigation={this.props.navigation} onPress={()=>this.backPressed()}/>
                 <View style={styles.contentContainer}>
                     <Image style={styles.icon} source={require('../../assets/launch/confirmIcon.png')} resizeMode={'center'}/>
                     <Text style={styles.titleTxt}>确认助记词</Text>
                     <Text style={styles.contentTxt}>请按顺序点击助记词，以确认您正确备份。</Text>

                     <View style={styles.mnemonicSortBorder}>
                        <View style={[styles.mnemonicList,]}>
                            {sortMnemonicView}
                        </View>
                     </View>
                     

                     <View style={styles.mnemonicList}>
                         {mnemonicView}
                     </View>
        
                     <View style={styles.buttonBox}>
                         <BlueButtonBig
                             isDisabled = {this.state.isDisabled}
                             onPress = {()=> this.completeClickFun()}
                             text = '完成'
                         />
                     </View>      
                 </View> 
                 <Loading visible={this.state.loadingVisible}></Loading> 
           </View>
        );
    }
}

const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
    walletName:state.Core.walletName,
});
const mapDispatchToProps = dispatch => ({
    setWalletAddress: (address) => dispatch(Actions.setWalletAddress(address)),
    setWalletName: (name) => dispatch(Actions.setWalletName(name))
});

export default connect(mapStateToProps,mapDispatchToProps)(VerifyMnemonicScreen)


