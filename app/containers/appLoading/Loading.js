import { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import JPushModule from 'jpush-react-native';
import DeviceInfo from 'react-native-device-info';
import StorageManage from '../../utils/StorageManage';
import {
  setMonetaryUnit,
  setPinInfo,
  setIsNewWallet,
  setContactList,
  setCurrentWallet,
  setEthWalletList,
  setItcWalletList,
  loadTokenBalance,
} from '../../config/action/Actions';
import { StorageKey } from '../../config/GlobalConfig';
import { I18n } from '../../config/language/i18n';
import NetworkManager from '../../utils/NetworkManager';
import { defaultTokens, defaultTokensOfITC } from '../../utils/Constants';
import Analytics from '../../utils/Analytics';

class Loading extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    // wallet : PropTypes.object,
  };

  /* static defaultProps = {
        wallet : null,
    } */

  async componentDidMount() {
    const { wallet, navigation } = this.props;
    let user = null;
    if (!wallet) {
      user = await this.loadFromStorege();
    }
    Analytics.enable();
    const userToken = await StorageManage.load(StorageKey.UserToken);
    if (!userToken || userToken === null) {
      JPushModule.getRegistrationID(registrationId => {
        const params = {
          system: Platform.OS,
          systemVersion: DeviceInfo.getSystemVersion(),
          deviceModel: DeviceInfo.getModel(),
          deviceToken: registrationId,
          deviceId: DeviceInfo.getUniqueID(),
        };
        Analytics.recordUserId(DeviceInfo.getUniqueID());
        // 设置别名
        JPushModule.setAlias(registrationId, () => {
          // console.log(alias);
        });
        NetworkManager.deviceRegister(params)
          .then(response => {
            if (response.code === 200) {
              StorageManage.save(StorageKey.UserToken, {
                userToken: response.data.userToken,
              });
            } else {
              Analytics.recordErr('deviceRegisterRspErr', response);
            }
          })
          .catch(err => {
            Analytics.recordErr('deviceRegisterCatchErr', err);
          });
      });
    }

    /* JPushModule.addReceiveOpenNotificationListener((map)=>{
            this.props.navigation.navigate('MessageCenter')
        }) */

    if (user) {
      return navigation.navigate('HomeTab');
    }
    return navigation.navigate('FirstLaunch', {
      migrationMode: true,
    });
  }

  loadFromStorege = async () => {
    const { dispatch } = this.props;
    const user = await StorageManage.load(StorageKey.User);
    // const net = await StorageManage.load(StorageKey.Network);
    const language = await StorageManage.load(StorageKey.Language);
    const monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit);
    const pinInfo = await StorageManage.load(StorageKey.PinInfo);
    const contacts = await StorageManage.loadAllDataForKey(StorageKey.Contact);
    let ethWalletList = await StorageManage.load(StorageKey.EthWalletList);
    const itcWalletList = await StorageManage.load(StorageKey.ItcWalletList);
    if (!ethWalletList) {
      ethWalletList = [];
    }
    if (user && user.type === undefined) {
      user.type = 'eth';
      const ethWallet = {
        name: user.name,
        address: user.address,
        extra: user.extra,
        type: 'eth',
      };

      if (ethWalletList) {
        ethWalletList = ethWalletList.concat(ethWallet);
      } else {
        ethWalletList.push(ethWallet);
      }
      StorageManage.save(StorageKey.EthWalletList, ethWalletList);
      StorageManage.save(StorageKey.User, ethWallet);
    }

    if (user && user.type === 'itc') {
      dispatch(loadTokenBalance(defaultTokensOfITC));
    } else {
      dispatch(loadTokenBalance(defaultTokens));
    }

    if (ethWalletList) {
      dispatch(setEthWalletList(ethWalletList));
    }
    if (itcWalletList) {
      dispatch(setItcWalletList(itcWalletList));
    }
    /* if (net) {
            this.props.dispatch(setNetWork(net))
        } */
    if (language) {
      I18n.locale = language.lang;
    } else {
      // let localeLanguage = DeviceInfo.getDeviceLocale();
      const localeLanguage = I18n.locale;
      const lang = localeLanguage.substring(0, 2).toLowerCase();
      if (lang === 'zh') {
        I18n.locale = 'zh';
      } else if (lang === 'ko') {
        I18n.locale = 'ko';
      } else if (lang === 'de') {
        I18n.locale = 'de';
      } else if (lang === 'es') {
        I18n.locale = 'es';
      } else if (lang === 'nl') {
        I18n.locale = 'nl';
      } else if (lang === 'fr') {
        I18n.locale = 'fr';
      } else if (lang === 'ru') {
        I18n.locale = 'ru';
      } else if (lang === 'uk') {
        I18n.locale = 'uk';
      } else {
        I18n.locale = 'en';
      }
    }

    if (monetaryUnit) {
      dispatch(setMonetaryUnit(monetaryUnit));
    } else {
      this.byLanguageSetMonetaryUnit();
    }

    if (pinInfo) {
      dispatch(setPinInfo(pinInfo));
    }

    if (contacts) {
      dispatch(setContactList(contacts));
    }

    dispatch(setIsNewWallet(false));

    if (user) {
      dispatch(setCurrentWallet(user));
      return user;
    }
    console.log('user = null');
    return null;
  };

  byLanguageSetMonetaryUnit() {
    const { dispatch } = this.props;
    const lang = I18n.locale;
    let monetaryUnit = null;
    if (lang === 'zh') {
      monetaryUnit = {
        monetaryUnitType: 'CNY',
        symbol: '¥',
      };
    } else if (lang === 'ko') {
      monetaryUnit = {
        monetaryUnitType: 'KRW',
        symbol: '₩',
      };
    } else if (lang === 'ru') {
      monetaryUnit = {
        monetaryUnitType: 'RUB',
        symbol: '₽',
      };
    } else if (lang === 'uk') {
      monetaryUnit = {
        monetaryUnitType: 'UAH',
        symbol: '₴',
      };
    } else if (lang === 'de' || lang === 'es' || lang === 'nl' || lang === 'fr') {
      monetaryUnit = {
        monetaryUnitType: 'EUR',
        symbol: '€',
      };
    } else {
      monetaryUnit = {
        monetaryUnitType: 'USD',
        symbol: '$',
      };
    }
    StorageManage.save(StorageKey.MonetaryUnit, monetaryUnit);
    dispatch(setMonetaryUnit(monetaryUnit));
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  wallet: state.Core.wallet,
  monetaryUnit: state.Core.monetaryUnit,
  network: state.Core.network,
});

export default connect(mapStateToProps)(Loading);
