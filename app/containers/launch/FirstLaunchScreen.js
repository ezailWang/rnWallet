import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView,Image,Alert} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CommonButton from '../../components/CommonButton';
//import { connect } from 'tls';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import { connect } from 'react-redux';
import * as TestAction from '../../config/action/TestAction'

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex:1,
        alignItems:'center',
        backgroundColor:'rgba(85,146,246,1)',
        paddingTop:100,
        paddingLeft:20,
        paddingRight:20,
    },
    logoImg:{
        marginBottom:40,
        width:100,
        height:100,
    },
    marginTop10:{
        marginTop:30,
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
                  {text: 'OK', onPress: () => {this.props.navigation.navigate('BackupMnemonic')}},
                ],
                { cancelable: false }
            )
          }, (error) => {
            Alert.alert(
              'error',
              'mnemonic:' + error.toString(),
              [
                {text: 'OK', onPress: () => {}},
              ],
              { cancelable: false }
            )
          })
    }
    render() {
        return (
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
            </SafeAreaView>

        )
    }
}

const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});
const mapDispatchToProps = dispatch => ({
    generateMnemonic:(mnemonic) => dispatch(TestAction.generateMnemonic(mnemonic)),
});
export default connect(mapStateToProps,mapDispatchToProps)(FirstLaunchScreen)