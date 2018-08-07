import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
//import { connect } from 'tls';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import { connect } from 'react-redux';
import * as TestAction from '../../config/action/TestAction'
import LinearGradient from 'react-native-linear-gradient'

import {WhiteButtonBig,ClarityWhiteButtonBig} from '../../components/Button'
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
        marginLeft:10,
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
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={styles.contentContainer}>
                <Image style={styles.logoImg} source={require('../../assets/launch/logo.png')} />
                <WhiteButtonBig style={{marginBottom:20}}
                                onPress={() => this.createClickFun()}
                                text='创建钱包'>
                    <View style={styles.rightIcon}>
                    </View>
                </WhiteButtonBig>
                <ClarityWhiteButtonBig onPress={() => this.props.navigation.navigate('ImportWallet')}
                               text='导入钱包'/>
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