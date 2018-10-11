import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Alert, ScrollView, TouchableOpacity,BackHandler } from 'react-native';

import StorageManage from '../../utils/StorageManage'
import { BlueButtonBig } from '../../components/Button'
import StatusBarComponent from '../../components/StatusBarComponent';
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Loading from '../../components/LoadingComponent';
import { store } from '../../config/store/ConfigureStore'
import { setWalletPasswordPrompt } from '../../config/action/Actions'
import { showToast } from '../../utils/Toast';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.bgGrayColor,
    },
    inputBox: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        height: 66,
        backgroundColor: '#fff',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
    },
    inputText: {
        flex: 1,
        height: 40,
        color: 'rgb(146,146,146)',
    },
    pwdBtnOpacity: {
        height: 66,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pwdIcon: {
        height: 20,
    },
    buttonBox: {
        alignSelf: 'stretch',
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
    },
})

export default class PasswordPrompInfoScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowPassword: false,
            passwordPrompInfo: '',

        }
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
    
    isOpenPwd() {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }

    async save() {
        var key = StorageKey.User
        var extra = this.state.passwordPrompInfo;
        if (extra === '') {
            Alert.alert(
                'warn',
                '请输入密码提示',
            )
            return
        }
        var loadUser = await StorageManage.load(key);
        if (loadUser == null) {
            loadUser = {
                extra: extra,
            }
        } else {
            loadUser.extra = extra;//修改extra值
        }
        store.dispatch(setWalletPasswordPrompt(extra))
        StorageManage.save(key, loadUser)
        showToast('保存密码提示成功')
        this.props.navigation.goBack()
    }

    render() {
        let pwdIcon = this.state.isShowPassword ? require('../../assets/launch/pwdOpenIcon.png') : require('../../assets/launch/pwdHideIcon.png');
        return (

            <View style={styles.container}>
                <StatusBarComponent />
                <WhiteBgHeader navigation={this.props.navigation} text='密码提示信息' />
                <View style={styles.inputBox}>
                    <TextInput style={styles.inputText}
                        placeholderTextColor = {Colors.fontGrayColor_a0}
                        placeholder='请输入密码提示信息'
                        underlineColorAndroid='transparent'
                        selectionColor='#00bfff'
                        secureTextEntry={!this.state.isShowPassword}
                        /**selection={
                             //start:{this.state.passwordPrompInfo.length},
                             //end:{this.state.passwordPrompInfo.length},
                        }**/
                        onChange={(event) => {
                            this.setState({
                                passwordPrompInfo: event.nativeEvent.text
                            })
                        }}
                    />
                    <TouchableOpacity style={[styles.pwdBtnOpacity]} activeOpacity={0.6} onPress={() => this.isOpenPwd()}>
                        <Image style={styles.pwdIcon} source={pwdIcon} resizeMode={'center'} />
                    </TouchableOpacity>

                </View>
                <View style={{ marginTop: 10 }}>
                    <BlueButtonBig
                        onPress={() => this.save()}
                        text='保存' />
                </View>
            </View>
        );
    }
}



