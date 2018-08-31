import React, { Component } from 'react';
import { View, StyleSheet, Image,Dimensions,BackHandler,PermissionsAndroid,Platform,Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import {RightBlueNextButton,RightWhiteNextButton} from '../../components/Button'
import {Colors} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import SplashScreen from 'react-native-splash-screen'
import { androidPermission } from '../../utils/permissionsAndroid';
import {showToast} from '../../utils/Toast';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        paddingTop: 150,
    },
    logoImg: {
        marginBottom: 50,
        width: 120,
        height: 120,
    },
    marginTop10: {
        marginTop: 30,
    },
    nextIcon:{
        width:15,
        height:15,
        marginTop:10,
        marginLeft:10,
        zIndex:20,
    },
    btnMargin:{
       height:20,
    }
});

export default  class FirstLaunchScreen extends Component {
    componentDidMount() {
        SplashScreen.hide()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);
    }
    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.goBack();
        return true;
    }

    //验证android读写权限
    async vertifyAndroidPermissions(isCreateWallet) {
        if (Platform.OS === 'android') {
            var readWritePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            //var writePermission = await androidPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (readWritePermission) {  
                this.nextRoute(isCreateWallet)
            } else {
                Alert.alert(
                    'warn',
                    '请允许读写内存卡权限',
                )
            }
        } else {
            this.nextRoute(isCreateWallet)
        }
    }

    nextRoute(isCreateWallet){
        if(isCreateWallet){
            this.props.navigation.navigate('CreateWallet')
        }else{
            this.props.navigation.navigate('ImportWallet')
        }
    }
    
   
    render() {
        return (
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={styles.contentContainer}>
                <StatusBarComponent/>            
                <Image style={styles.logoImg} source={require('../../assets/common/logo_icon.png')} resizeMode={'center'}/>

                <RightBlueNextButton
                        onPress={() => this.vertifyAndroidPermissions(true)}
                        text='创建钱包'/>
                <View style={styles.btnMargin}>
                </View>
                <RightWhiteNextButton
                        onPress={()=> this.vertifyAndroidPermissions(false)}
                        text='导入钱包'/> 
               
               
            </LinearGradient>
        )
    }
}
