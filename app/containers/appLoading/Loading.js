import React, { Component } from 'react'
import { Platform, Alert, Linking } from 'react-native'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    setWalletAddress,
    setWalletName,
    setNetWork,
    setMonetaryUnit,
    setPinInfo,
    setIsNewWallet,
    setContactList,
    setAllTokens
} from '../../config/action/Actions'
import { StorageKey } from '../../config/GlobalConfig'
import { I18n } from '../../config/language/i18n'
import JPushModule from 'jpush-react-native'
import NetworkManager from '../../utils/NetworkManager'
import DeviceInfo from 'react-native-device-info'
import { __await } from 'tslib';
class Loading extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.shape({
            navigate: PropTypes.func.isRequired,
        }).isRequired,
        walletAddress: PropTypes.string,
    }

    static defaultProps = {
        walletAddress: null
    }

    async componentDidMount() {

        if (!this.props.walletAddress) {
            await this.loadFromStorege()
        }
        JPushModule.getRegistrationID(registrationId => {
            let params = {
                'system': Platform.OS,
                'systemVersion': DeviceInfo.getSystemVersion(),
                'deviceModel': DeviceInfo.getModel(),
                'deviceToken': registrationId,
                'deviceId': DeviceInfo.getUniqueID(),
                'walletAddress':this.props.walletAddress ? this.props.walletAddress : 0,
            }
            //设置别名
            JPushModule.setAlias(registrationId, (alias) => {

            })
            NetworkManager.deviceRegister(params)
                .then((response) => {
                    if (response.code === 200) {
                        StorageManage.save(StorageKey.UserToken, { 'userToken': response.data.userToken })
                    } else {
                        console.log('deviceRegister err msg:', response.msg)
                    }
                })
                .catch((err) => {
                    console.log('deviceRegister err:', err)
                })
        })


        /*JPushModule.addReceiveOpenNotificationListener((map)=>{
            this.props.navigation.navigate('MessageCenter')
        })*/
        let params = {
            'system': Platform.OS,
            'version': DeviceInfo.getVersion() + '(' + DeviceInfo.getBuildNumber() + ')',
            'language': I18n.locale
        }
        //清除小标
        if (Platform.OS === 'ios') {
            JPushModule.setBadge(0, (result) => {
            })
        }

        NetworkManager.getVersionUpdateInfo(params)
            .then((response) => {
                if (response.code === 200) {
                    Alert.alert(
                        I18n.t('toast.update_tip'),
                        response.data.content.split('&').join('\n'),
                        [
                            {
                                text: I18n.t('toast.go_update'), onPress: () => {
                                    const baseUrl = response.data.updateUrl
                                    Linking.canOpenURL(baseUrl)
                                        .then((supported) => {
                                            if (supported) {
                                                Linking.openURL(baseUrl)
                                            }
                                        })
                                }
                            },
                            { text: I18n.t('modal.cancel'), onPress: () => { }, style: 'cancel' },
                        ],
                    )
                } else {
                    console.log('getVersionUpdateInfo err msg:', response.msg)
                }
            })
            .catch((err) => {
                console.log('getVersionUpdateInfo err:', err)
            })



        /*if (!this.props.walletAddress) {
            await this.loadFromStorege()
        }*/
        if (this.props.walletAddress) {
            return this.props.navigation.navigate('Home')
        } else {
            return this.props.navigation.navigate('FirstLaunch', {
                migrationMode: true
            })
        }


    }

    loadFromStorege = async () => {
        var data = await StorageManage.load(StorageKey.User)
        var net = await StorageManage.load(StorageKey.Network)
        var language = await StorageManage.load(StorageKey.Language)
        var monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit)
        let pinInfo = await StorageManage.load(StorageKey.PinInfo)
        let contacts = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        //addDefaultTokens();
        if (net) {
            this.props.dispatch(setNetWork(net))
        }
        if (language) {
            I18n.locale = language.lang
        } else {
            //let localeLanguage = DeviceInfo.getDeviceLocale();
            let localeLanguage = I18n.locale;
            let lang = localeLanguage.substring(0, 2).toLowerCase()
            if (lang == 'zh') {
                I18n.locale = 'zh';
            } else if (lang == 'ko') {
                I18n.locale = 'ko';
            } else if (lang == 'de') {
                I18n.locale = 'de';
            } else if (lang == 'es') {
                I18n.locale = 'es';
            } else if (lang == 'nl') {
                I18n.locale = 'nl';
            } else if (lang == 'fr') {
                I18n.locale = 'fr';
            } else if (lang == 'ru') {
                I18n.locale = 'ru';
            } else if (lang == 'uk') {
                I18n.locale = 'uk';
            } else {
                I18n.locale = 'en';
            }
        }

        if (monetaryUnit) {
            this.props.dispatch(setMonetaryUnit(monetaryUnit))
        } else {
            this.byLanguageSetMonetaryUnit()
        }

        if (pinInfo) {
            this.props.dispatch(setPinInfo(pinInfo))
        }

        if (contacts) {
            this.props.dispatch(setContactList(contacts))
        }

        this.props.dispatch(setIsNewWallet(false))
        this.getAllTokens()

        if (data) {
            if (data['address']) {
                this.props.dispatch(setWalletAddress(data['address']))
            }
            if (data['name']) {
                this.props.dispatch(setWalletName(data['name']))
            }
        } else {
            console.log('data = null')
        }
    }

    byLanguageSetMonetaryUnit() {
        let lang = I18n.locale
        let monetaryUnit = null;
        if (lang == 'zh') {
            monetaryUnit = {
                monetaryUnitType: 'CNY',
                symbol: '¥'
            }
        } else if (lang == 'ko') {
            monetaryUnit = {
                monetaryUnitType: 'KRW',
                symbol: '₩'
            }
        } else if (lang == 'ru') {
            monetaryUnit = {
                monetaryUnitType: 'RUB',
                symbol: '₽'
            }
        } else if (lang == 'uk') {
            monetaryUnit = {
                monetaryUnitType: 'UAH',
                symbol: '₴'
            }
        } else if (lang == 'de' || lang == 'es' || lang == 'nl' || lang == 'fr') {
            monetaryUnit = {
                monetaryUnitType: 'EUR',
                symbol: '€'
            }
        } else {
            monetaryUnit = {
                monetaryUnitType: 'USD',
                symbol: '$'
            }
        }
        StorageManage.save(StorageKey.MonetaryUnit, monetaryUnit)
        this.props.dispatch(setMonetaryUnit(monetaryUnit))
    }

    async getAllTokens() {
        let allTokensParams = {
            //'network': this.props.network,
            'network': 'main',
        }
        NetworkManager.getAllTokens(allTokensParams).then((response) => {
            if (response.code === 200) {
                this.props.dispatch(setAllTokens(response.data))
            } else {
                console.log('getAllTokens err msg:', response.msg)
            }
        }).catch((err) => {
            console.log('getAllTokens err:', err)
        })
    }

    render() {
        return null
    }
}

const mapStateToProps = state => ({
    walletAddress: state.Core.walletAddress,
    monetaryUnit: state.Core.monetaryUnit,
    network: state.Core.network,
});

export default connect(mapStateToProps)(Loading);