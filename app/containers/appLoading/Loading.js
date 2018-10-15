import React, { Component } from 'react'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    setWalletAddress,
    setWalletName,
    setNetWork,
    setMonetaryUnit,
    setPinInfo
} from '../../config/action/Actions'
import { StorageKey } from '../../config/GlobalConfig'
import { I18n, getLanguages } from '../../config/language/i18n'
import { showToast } from '../../utils/Toast'
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
        if (net) {
            this.props.dispatch(setNetWork(net))
        }
        if (language) {
            I18n.locale = language.lang
        }else{
            //let localeLanguage = DeviceInfo.getDeviceLocale();
            let localeLanguage = I18n.locale;
            let lang = localeLanguage.substring(0,2).toLowerCase()
            if(lang == 'zh'){
                I18n.locale = 'zh';
            }else if(lang == 'ko'){
                I18n.locale = 'ko';
            }else if(lang == 'de'){                
                I18n.locale = 'de';
            }else if(lang == 'es'){                
                I18n.locale = 'es';
            }else if(lang == 'nl'){                
                I18n.locale = 'nl';
            }else{
                I18n.locale = 'en';
            }
        }
        
        if (monetaryUnit) {
            this.props.dispatch(setMonetaryUnit(monetaryUnit))
        } else {
            this.byLanguageSetMonetaryUnit()
        }

        if(pinInfo){
            this.props.dispatch(setPinInfo(pinInfo))
        }



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
        } else if (lang == 'en') {
            monetaryUnit = {
                monetaryUnitType: 'USD',
                symbol: '$'
            }
        } else if (lang == 'ko') {
            monetaryUnit = {
                monetaryUnitType: 'KRW',
                symbol: '₩'
            }
        }else if (lang == 'de' || lang == 'es' ||lang == 'nl'){
            monetaryUnit = {
                monetaryUnitType: 'EUR',
                symbol: '€'
            }
        }
        StorageManage.save(StorageKey.MonetaryUnit, monetaryUnit)
        this.props.dispatch(setMonetaryUnit(monetaryUnit))
    }

    render() {
        return null
    }
}

const mapStateToProps = state => ({
    walletAddress: state.Core.walletAddress,
    monetaryUnit: state.Core.monetaryUnit
});

export default connect(mapStateToProps)(Loading);