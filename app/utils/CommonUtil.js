import { DeviceEventEmitter } from 'react-native';
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils';
import StorageManage from './StorageManage';
import NetworkManager from './NetworkManager';
import { StorageKey } from '../config/GlobalConfig';

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

function createBlackHoleAddress(ethAddress, itcAddress) {
  return walletUtils.toChecksumAddress(
    `0x00000000000000000000${walletUtils
      .keccak(ethAddress + itcAddress)
      .toString('hex')
      .slice(-20)}`
  );
}

export { validateEmail, addressToName, getMessageCount, createBlackHoleAddress };
