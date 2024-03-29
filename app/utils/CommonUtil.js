import { DeviceEventEmitter } from 'react-native';
import StorageManage from './StorageManage';
import NetworkManager from './NetworkManager';
import { StorageKey } from '../config/GlobalConfig';
import store from '../config/store/ConfigureStore';
import { I18n } from '../config/language/i18n';

function validateEmail(email) {
  const mailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (mailRegex.test(email)) {
    return true;
  }
  return false;
}

function addressToName(address, contacts) {
  let addressName = '';
  const { length } = contacts;
  for (let i = 0; i < length; i++) {
    if (contacts[i].address.toLowerCase() === address.toLowerCase()) {
      const { name } = contacts[i];
      addressName = name;
      break;
    }
  }
  return addressName;
}

// 获取未度消息数
async function getMessageCount() {
  const userToken = await StorageManage.load(StorageKey.UserToken);
  if (!userToken || userToken === null) {
    return;
  }
  const params = {
    userToken: userToken.userToken,
  };
  NetworkManager.getUnReadMessageCount(params)
    .then(response => {
      if (response.code === 200) {
        const messageCount = response.data.account;
        DeviceEventEmitter.emit('messageCount', { messageCount });
      } else {
        console.log('getMessageCountErr msg:', response.msg);
      }
    })
    .catch(err => {
      console.log('getMessageCountErr:', err);
    });
}

function getMonetaryUnitSymbol() {
  // 优先判断货币 如果货币本地没有再使用语言
  // const currentLocale = I18n.currentLocale()
  // var monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit)
  const { monetaryUnit } = store.getState().Core;

  if (monetaryUnit) {
    const { symbol } = monetaryUnit;
    return symbol;
  }
  const currentLocale = I18n.locale;
  if (currentLocale.includes('zh')) {
    return '¥';
  }
  if (currentLocale.includes('ko')) {
    return '₩';
  }
  if (currentLocale.includes('ru')) {
    return '₽';
  }
  if (currentLocale.includes('uk')) {
    return '₴';
  }
  if (
    currentLocale.includes('de') ||
    currentLocale.includes('es') ||
    currentLocale.includes('nl') ||
    currentLocale.includes('fr')
  ) {
    return '€';
  }
  // 默认美元
  return '$';
}

export { validateEmail, addressToName, getMessageCount, getMonetaryUnitSymbol };
