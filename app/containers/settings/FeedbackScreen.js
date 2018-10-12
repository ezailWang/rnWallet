import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    Keyboard,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import { BlueButtonBig } from '../../components/Button'
import { Colors } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import { validateEmail } from '../../utils/commonUtil'
import { CommonTextInput } from '../../components/TextInputComponent'
import BaseComponent from '../base/BaseComponent';
import ImagePicker from 'react-native-image-picker';
import ImageButton from '../../components/ImageButton'
import DeviceInfo from 'react-native-device-info'
import networkManage from '../../utils/networkManage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgGrayColor,
    },
    keyboardAwareScrollView: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingTop: 40,
    },
    contentBox: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: Layout.WINDOW_WIDTH * 0.9,
    },
    text: {
        color: Colors.fontBlackColor,
        fontSize: 13,
        marginBottom: 3,
    },
    textInput: {
        marginBottom: 12,
    },
    desTextInput: {
        height: 130,
        paddingTop: 10,
        marginBottom: 10,
        textAlign: 'left',
        textAlignVertical: 'top',
    },
    warnTxt: {
        fontSize: 10,
        color: 'red',
        alignSelf: 'flex-end',
        marginBottom: 10,
        paddingLeft: 10,
    },
    warnTxtHidden: {
        height: 0
    },
    button: {
        marginTop: 40,
    }
})

export default class FeedbackScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,
            isShowEmailWarn: false,
            emailWarn: I18n.t('toast.email_format_incorrect'),
            photoArray: [],
        }

        this.name = '';
        this.email = '';
        this.description = '';
        this.keyBoardIsShow = false;
        this.isEmailFocus = false
    }

    _initData() {

    }

    _addEventListener() {
        super._addEventListener()
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandler);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandler);
    }

    _removeEventListener() {
        super._removeEventListener()
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    }

    keyboardDidShowHandler = (event) => {
        this.keyBoardIsShow = true;
    }
    keyboardDidHideHandler = (event) => {
        this.keyBoardIsShow = false;
    }
    hideKeyboard = () => {
        if (this.keyBoardIsShow) {
            Keyboard.dismiss();
        }
    }

    btnIsEnableClick() {
        if (this.name == '' || this.email == '' || this.description == '') {
            if (!this.state.isDisabled) {
                this.setState({
                    isDisabled: true
                })
            }
        } else {
            if (this.state.isDisabled) {
                this.setState({
                    isDisabled: false
                })
            }
        }
    }
    vertifyEmail() {
        let emailIsOk = true
        if (this.email != '') {
            emailIsOk = validateEmail(this.email)
            this.setState({
                isShowEmailWarn: !emailIsOk,
                isDisabled: this.name == '' || this.description == '' || !emailIsOk
            })
        } else {
            if (!this.state.isDisabled) {
                this.setState({
                    isDisabled: true
                })
            }
        }
    }

    nameOnChangeText = (text) => {
        this.name = text;
        this.btnIsEnableClick()
    };
    emailOnChangeText = (text) => {
        this.email = text;
        this.vertifyEmail()
    };
    descriptionOnChangeText = (text) => {
        this.description = text;
        this.btnIsEnableClick()
    };

    submit() {
        Keyboard.dismiss();
        let params = {
            'userId': '1',
            'name': this.name,
            'mailAddress': this.email,
            'system': Platform.OS,
            'systemVersion': DeviceInfo.getSystemVersion(),
            'deviceModel': DeviceInfo.getModel(),
            'content': this.description
        }
        this._showLoding()
        networkManage.uploadFeedback(params, this.state.photoArray)
            .then(res => {
                this._hideLoading()
                if (res.code === 200) {
                    showToast(I18n.t('toast.submitted_successfully'))
                    this.props.navigation.goBack()
                } else {
                    showToast(res.msg)
                }
            }).catch(err => {
                showToast(I18n.t('toast.submitted_failed'))
                this._hideLoading()
            })
    }

    renderComponent() {
        let photoSelectComponents = []
        this.state.photoArray.forEach((value, index, array) => {
            photoSelectComponents.push(
                <View
                    key={index}
                    style={{ width: 56, height: 56, marginRight: 10, marginTop: 5 }}
                >
                    <Image
                        style={{ width: 56, height: 56 }}
                        source={value}
                    />
                    <ImageButton
                        btnStyle={{ position: 'absolute', right: 5, top: 5, width: 14, height: 14 }}
                        backgroundImageSource={require('../../assets/home/delete.png')}
                        onClick={() => {
                            this.setState(previousState => {
                                let newArray = previousState.photoArray.concat()
                                newArray.splice(index,1)
                                return { photoArray: newArray }
                            })
                        }}
                    />
                </View>
            )
        })

        return (
            <View style={styles.container}
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => {
                    Keyboard.dismiss()
                }}>
                <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.feedback')} />
                <KeyboardAvoidingView style={styles.keyboardAwareScrollView}
                    keyboardShouldPersistTaps='handled'
                    behavior="padding">
                    <View style={styles.contentBox}>
                        <Text style={styles.text}>{I18n.t('settings.nickname')}</Text>
                        <CommonTextInput
                            textInputStyle={styles.textInput}
                            onChangeText={this.nameOnChangeText} />

                        <Text style={styles.text}>{I18n.t('settings.contact_email')}</Text>
                        <CommonTextInput
                            textInputStyle={styles.textInput}
                            onChangeText={this.emailOnChangeText}
                            keyboardType={'email-address'}
                            onFocus={() => { this.isEmailFocus = true; }}
                            onBlur={() => { this.isEmailFocus = false; }} />
                        <Text style={this.state.isShowEmailWarn ? styles.warnTxt : styles.warnTxtHidden}>{this.state.emailWarn}</Text>
                        <Text style={styles.text}>{I18n.t('settings.problem_description')}</Text>
                        <CommonTextInput
                            textInputStyle={styles.desTextInput}
                            returnKeyType={"done"}
                            onChangeText={this.descriptionOnChangeText}
                            multiline={true} />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {photoSelectComponents}
                            {
                                this.state.photoArray.length < 9 ?
                                    <ImageButton
                                        btnStyle={{ width: 56, height: 56 ,marginTop:5}}
                                        imageStyle={{ width: 56, height: 56 }}
                                        backgroundImageSource={require('../../assets/home/kuang.png')}
                                        onClick={() => {
                                            ImagePicker.launchImageLibrary(null, (response) => {
                                                if (response.didCancel) {
                                                    console.log('User cancelled image picker');
                                                } else if (response.error) {
                                                    console.log('ImagePicker Error: ', response.error);
                                                } else if (response.customButton) {
                                                    console.log('User tapped custom button: ', response.customButton);
                                                } else {
                                                    const source = { uri: response.uri };
                                                    this.setState(previousState => {
                                                        let newArray = previousState.photoArray.concat()
                                                        newArray.push(source)
                                                        return { photoArray: newArray }
                                                    })
                                                }
                                            })
                                        }}
                                    />
                                    : null}
                        </View>
                        <BlueButtonBig
                            buttonStyle={styles.button}
                            isDisabled={this.state.isDisabled}
                            onPress={() => {
                                console.log('submit11')
                                this.submit()
                            }}
                            text={I18n.t('settings.submit')}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}


