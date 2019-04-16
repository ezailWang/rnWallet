import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT,
  },
  whiteContainer: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    height: 240,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  childViewContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTypeIcon: {
    width: 25,
    height: 25,
    backgroundColor: 'transparent',
    marginRight: 3,
  },
  coinType: {
    width: 100,
    height: 35,
    marginRight: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTypeText: {
    width: 50,
    textAlign: 'center',
    fontSize: 12,
    marginRight: 3,
  },
  input: {
    width: 190,
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.bgGrayColor_ed,
    padding: 5,
  },
  tr: {
    width: 14,
    height: 8,
  },
  walletSelect: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  walletSelectText: {
    color: Colors.themeColor,
    fontSize: 12,
    marginRight: 5,
  },
  balanceText: {
    width: 170,
    marginRight: 5,
    fontSize: 12,
  },
  titleText: {
    marginTop: 10,
  },
});

export default class ExchangeHeadView extends Component {
  _getLogo = symbol => {
    if (symbol === 'ITC') {
      return require('../../../assets/home/ITC.png');
    }
    if (symbol === 'ETH') {
      return require('../../../assets/home/ETH.png');
    }
    return require('../../../assets/home/null.png');
  };

  render() {
    const {
      onCoinTypeSelectDeposit,
      onCoinTypeSelectRecevie,
      onWalletSelectDeposit,
      onWalletSelectRecevie,
      onExchange,
      currentDepositCoin,
      currentReceiveCoin,
      currentDepositWallet,
      currentReceiveWallet,
      onDepositInputChange,
      depositInputValue,
      onReceiveInputChange,
      receiveInputValue,
      depositPlaceholder,
      receivePlaceholder,
      titleInstantRate,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.whiteContainer}>
          <View style={styles.childViewContainer}>
            <Text style={styles.titleText}>{titleInstantRate}</Text>
          </View>
          <View style={[styles.childViewContainer, { marginTop: 5 }]}>
            <TouchableOpacity onPress={onCoinTypeSelectDeposit} style={styles.coinType}>
              <Image source={currentDepositCoin.coinIcon} style={styles.coinTypeIcon} />
              <Text style={styles.coinTypeText} numberOfLines={1}>
                {currentDepositCoin.symbol}
              </Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
            <TextInput
              returnKeyType="next"
              keyboardType="numeric"
              textAlign="right"
              placeholder={`转出数量${depositPlaceholder}`}
              style={styles.input}
              defaultValue={depositInputValue}
              onChange={e => {
                onDepositInputChange(e.nativeEvent.text);
              }}
            />
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'flex-start', marginTop: 5 }]}>
            <Text style={styles.balanceText}>{`可用余额: ${currentDepositCoin.balance}`}</Text>
            <TouchableOpacity style={styles.walletSelect} onPress={onWalletSelectDeposit}>
              <Text style={styles.walletSelectText} numberOfLines={1}>
                {currentDepositWallet.name}
              </Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
          </View>
          <View style={[styles.childViewContainer, { marginTop: -10 }]}>
            <TouchableOpacity onPress={onCoinTypeSelectRecevie} style={styles.coinType}>
              <Image source={currentReceiveCoin.coinIcon} style={styles.coinTypeIcon} />
              <Text style={styles.coinTypeText}>{currentReceiveCoin.symbol}</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              returnKeyType="done"
              textAlign="right"
              placeholder={`接收数量${receivePlaceholder}`}
              style={styles.input}
              defaultValue={receiveInputValue}
              onChange={e => {
                onReceiveInputChange(e.nativeEvent.text);
              }}
            />
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'flex-start', marginTop: 5 }]}>
            <TouchableOpacity
              style={[styles.walletSelect, { width: 295 }]}
              onPress={onWalletSelectRecevie}
            >
              <Text style={styles.walletSelectText}>{currentReceiveWallet.name}</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'flex-start', marginBottom: 10 }]}>
            <TouchableOpacity
              style={{
                width: 295,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onExchange}
            >
              <Image
                style={{ width: 295, height: 40 }}
                source={require('../../../assets/exchange/icon_buttom.png')}
              />
              <Text
                style={{
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  width: 295,
                  top: 10,
                  height: 40,
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                兑换
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginTop: 5, color: 'white', fontSize: 10 }}>
            Powered by SWFT Blockchain
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            marginTop: 10,
          }}
        >
          <Text style={{ marginTop: 10, marginLeft: 20, color: 'gray' }}>兑换记录</Text>
        </View>
      </View>
    );
  }
}
