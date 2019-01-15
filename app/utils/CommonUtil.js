import { DeviceEventEmitter } from 'react-native';
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

export { validateEmail, addressToName, getMessageCount };
