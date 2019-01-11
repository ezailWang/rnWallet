import React, { Component } from 'react'
import { Platform, Linking, DeviceEventEmitter } from 'react-native'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    setNetWork,
    setMonetaryUnit,
    setPinInfo,
    setIsNewWallet,
    setContactList,
    setAllTokens,
    setCurrentWallet,
    setEthWalletList,
    setItcWalletList,
    loadTokenBalance
} from '../../config/action/Actions'
import { StorageKey } from '../../config/GlobalConfig'
import { I18n } from '../../config/language/i18n'
import JPushModule from 'jpush-react-native'
import NetworkManager from '../../utils/NetworkManager'
import DeviceInfo from 'react-native-device-info'
import { defaultTokens ,defaultTokensOfITC} from '../../utils/Constants'
class Loading extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.shape({
            navigate: PropTypes.func.isRequired,
        }).isRequired,
        //wallet : PropTypes.object,
    }

    /*static defaultProps = {
        wallet : null,
    }*/

    async componentDidMount() {
        if (!this.props.wallet) {
            await this.loadFromStorege()
        }
        let userToken = await StorageManage.load(StorageKey.UserToken)
        if (!userToken || userToken === null) {
            JPushModule.getRegistrationID(registrationId => {
                let params = {
                    'system': Platform.OS,
                    'systemVersion': DeviceInfo.getSystemVersion(),
                    'deviceModel': DeviceInfo.getModel(),
                    'deviceToken': registrationId,
                    'deviceId': DeviceInfo.getUniqueID(),
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
        }

        /*JPushModule.addReceiveOpenNotificationListener((map)=>{
            this.props.navigation.navigate('MessageCenter')
        })*/
        let params = {
            'system': Platform.OS,
            'version': DeviceInfo.getVersion() + '(' + DeviceInfo.getBuildNumber() + ')',
            'language': I18n.locale
        }

        if (this.props.wallet) {
            return this.props.navigation.navigate('HomeTab')
        } else {
            return this.props.navigation.navigate('FirstLaunch', {
                migrationMode: true,
            })
        }


    }

    loadFromStorege = async () => {
        let user = await StorageManage.load(StorageKey.User)
        let net = await StorageManage.load(StorageKey.Network)
        let language = await StorageManage.load(StorageKey.Language)
        let monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit)
        let pinInfo = await StorageManage.load(StorageKey.PinInfo)
        let contacts = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        let ethWalletList = await StorageManage.load(StorageKey.EthWalletList)
        let itcWalletList = await StorageManage.load(StorageKey.ItcWalletList)
        if (!ethWalletList) {
            ethWalletList = []
        }
        if (user && user.type === undefined) {
            user.type = 'eth'
            let ethWallet = {
                name: user.name,
                address: user.address,
                extra: user.extra,
                type: 'eth'
            }

            if (ethWalletList) {
                ethWalletList = ethWalletList.concat(ethWallet)
            } else {
                ethWalletList.push(ethWallet)
            }
            StorageManage.save(StorageKey.EthWalletList, ethWalletList)
            StorageManage.save(StorageKey.User, ethWallet)
        }

        if(user && user.type == 'itc'){
            this.props.dispatch(loadTokenBalance(defaultTokensOfITC))
        }else{
            this.props.dispatch(loadTokenBalance(defaultTokens))
        }

        if (ethWalletList) {
            this.props.dispatch(setEthWalletList(ethWalletList))
        }
        if (itcWalletList) {
            this.props.dispatch(setItcWalletList(itcWalletList))
        }
        /*if (net) {
            this.props.dispatch(setNetWork(net))
        }*/
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
        this.getMessageCount()



        if (user) {
            this.props.dispatch(setCurrentWallet(user))
        } else {
            console.log('user = null')
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

   

    //获取未度消息数
    async getMessageCount() {

        let userToken = await StorageManage.load(StorageKey.UserToken)
        if (!userToken || userToken === null) {
            return;
        }
        let params = {
            'userToken': userToken['userToken'],
        }
        NetworkManager.getUnReadMessageCount(params)
            .then(response => {
                if (response.code === 200) {
                    let messageCount = response.data.account;
                    DeviceEventEmitter.emit('messageCount', { messageCount: messageCount });
                } else {
                    console.log('getMessageCount err msg:', response.msg)
                }
            }).catch(err => {
                console.log('getMessageCount err:', err)
            })
    }

    render() {
        return null
    }
}

const mapStateToProps = state => ({
    wallet: state.Core.wallet,
    monetaryUnit: state.Core.monetaryUnit,
    network: state.Core.network,
});

export default connect(mapStateToProps)(Loading);