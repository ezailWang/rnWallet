import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import CommonButton from '../../components/CommonButton';
//import { connect } from 'tls';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import { connect } from 'react-redux';
import * as TestAction from '../../config/action/TestAction'
import LinearGradient from 'react-native-linear-gradient'

import {WhiteButtonBig,ClarityWhiteButtonBig,BlueButtonBig,BlueButtonMiddle,WhiteButtonMiddle,WhiteButtonSmall,BlueButtonSmall} from '../../components/Button'
import {Colors} from '../../config/GlobalConfig'

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        paddingTop: 150,
    },
    logoImg: {
        marginBottom: 50,
        width: 100,
        height: 100,
    },
    marginTop10: {
        marginTop: 30,
    },
    rightIcon:{
        width:15,
        height:15,
        marginTop:10,
        marginRight:10,
        backgroundColor:"red"
    }
});

class FirstLaunchScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        header:null,
    })

    createClickFun() {
        walletUtils.generateMnemonic().then((data) => {
            this.props.generateMnemonic(data)
            Alert.alert(
                'success',
                'Produce mnemonic success',
                [
                    { text: 'OK', onPress: () => { this.props.navigation.navigate('BackupMnemonic') } },
                ],
                { cancelable: false }
            )
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
/** 
            <SafeAreaView style={styles.container} >
            <View style = {styles.contentContainer}>
                <Image style={styles.logoImg} source={require('../../assets/launch/logo.png')}/>
                <CommonButton
                    //onPress = {this.createClickFun}
                    onPress = {()=> this.props.navigation.navigate('BackupMnemonic')}
                    text = '创建钱包'
                    bgColor = '#fff'
                    fontColor = 'rgb(85,146,246)'
                    borderColor = '#fff'
                />
                <View style={{height:20}}></View>
                <CommonButton
                    onPress = {()=> this.props.navigation.navigate('ImportWallet')}
                    text = '导入钱包'
                    bgColor = 'transparent'
                    fontColor =  '#fff'
                    borderColor = '#fff'
                />
            </View>
            </SafeAreaView>**/

            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={styles.contentContainer}>
                <Image style={styles.logoImg} source={require('../../assets/launch/logo.png')} />
                <WhiteButtonBig  style={{marginBottom:20}}
                              onPress={() => this.createClickFun}
                              text='创建钱包'>
                    <Image style={styles.rightIcon}>
                    </Image>
                </WhiteButtonBig>
                <ClarityWhiteButtonBig style={{marginTop:20}}
                               onPress={() => this.props.navigation.navigate('ImportWallet')}
                               text='导入钱包'/>
                <BlueButtonBig text={"蓝色中号"}
                               onPress={()=>{}}/>
                <BlueButtonMiddle text={"蓝色中号"}
                                  onPress={()=>{}}>
                </BlueButtonMiddle>
                <WhiteButtonMiddle text={"白色中号"}
                                   onPress={()=>{}}>
                </WhiteButtonMiddle>
                <WhiteButtonSmall text={"白色小号"}
                                   onPress={()=>{}}>
                </WhiteButtonSmall>
                <BlueButtonSmall text={"蓝色小号"}
                                  onPress={()=>{}}>
                </BlueButtonSmall>
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    mnemonic: state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic: (mnemonic) => dispatch(TestAction.generateMnemonic(mnemonic)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FirstLaunchScreen)