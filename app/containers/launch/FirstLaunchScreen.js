import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import LinearGradient from 'react-native-linear-gradient'

import {RightBlueNextButton,RightWhiteNextButton} from '../../components/Button'
import {Colors} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import SplashScreen from 'react-native-splash-screen'

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

class FirstLaunchScreen extends Component {

    componentDidMount(){
        SplashScreen.hide()
    }
    
    createClickFun() {

        walletUtils.generateMnemonic().then((data) => {
            this.props.generateMnemonic(data)
            this.props.navigation.navigate('BackupWallet');
        }, (error) => {
            Alert.alert(
                'error',
                'mnemonic:' + error.toString(),
                [
                    { text: 'OK', onPress: () => { } },
                ],
                { cancelable: false }
            )
        })
    }
    render() {
        return (
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={styles.contentContainer}>
                <StatusBarComponent/>            
                <Image style={styles.logoImg} source={require('../../assets/common/logo_icon.png')} resizeMode={'center'}/>

                <RightBlueNextButton
                        onPress={() => this.createClickFun()}
                        text='创建钱包'/>
                <View style={styles.btnMargin}>
                </View>
                <RightWhiteNextButton
                        onPress={()=> this.props.navigation.navigate('ImportWallet')}
                        text='导入钱包'/> 
               
               
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(Actions.generateMnemonic(mnemonic)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FirstLaunchScreen)