import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import { I18n } from '../../../config/language/i18n';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT,
  },
  whiteContainer: {
    marginTop: LayoutConstants.DEVICE_IS_IPHONE_X ? 80 : 55,
    marginLeft: 20,
    marginRight: 20,
    height:
      LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT -
      (LayoutConstants.DEVICE_IS_IPHONE_X ? 150 : 125),
    backgroundColor: 'white',
    borderRadius: 10,
  },
  childViewContainer: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTypeIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    marginRight: 3,
    marginTop: 5,
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
    width: 40,
    textAlign: 'center',
    fontSize: 13,
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
    width: 10,
    height: 6,
  },
  walletSelect: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  walletSelectText: {
    color: Colors.themeColor,
    fontSize: 13,
    marginRight: 5,
  },
  balanceText: {
    width: 170,
    marginRight: 5,
    fontSize: 12,
    color: '#d2d2d2',
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
      instantRate,
      onExchange,
      onRefore,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.whiteContainer}>
          <View style={styles.childViewContainer}>
            <Text style={styles.titleText}>{`1 ${currentDepositCoin.symbol}`}</Text>
            <TouchableOpacity onPress={onRefore}>
              <Image
                source={require('../../../assets/exchange/refore.png')}
                style={[styles.coinTypeIcon, { marginLeft: 7, marginRight: 7 }]}
              />
            </TouchableOpacity>
            <Text style={styles.titleText}>{`${
              instantRate !== '' ? parseFloat(instantRate).toFixed(6) : '?'
            } ${currentReceiveCoin.symbol}`}</Text>
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
              placeholder={`${I18n.t('exchange.transfer_amount')}${depositPlaceholder}`}
              style={styles.input}
              defaultValue={depositInputValue}
              onChange={e => {
                onDepositInputChange(e.nativeEvent.text);
              }}
            />
          </View>
          <View
            style={[
              styles.childViewContainer,
              { paddingTop: 5, alignItems: 'flex-start', marginTop: 5 },
            ]}
          >
            <Text style={styles.balanceText}>{`${I18n.t('exchange.available_balance')}: ${
              currentDepositCoin.balance
            }`}</Text>
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
              placeholder={`${I18n.t('exchange.receiving_quantity')}${receivePlaceholder}`}
              style={styles.input}
              defaultValue={receiveInputValue}
              onChange={e => {
                onReceiveInputChange(e.nativeEvent.text);
              }}
            />
          </View>
          <View
            style={[
              styles.childViewContainer,
              { paddingTop: 5, alignItems: 'flex-start', marginTop: 5 },
            ]}
          >
            <TouchableOpacity
              style={[styles.walletSelect, { width: 295 }]}
              onPress={onWalletSelectRecevie}
            >
              <Text style={styles.walletSelectText}>{currentReceiveWallet.name}</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.childViewContainer,
              { paddingTop: 0, alignItems: 'flex-start', marginBottom: 15 },
            ]}
          >
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
                  fontSize: 15,
                }}
              >
                {I18n.t('exchange.create_exchange_order')}
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
          <Text style={{ marginTop: 20, marginLeft: 20, color: 'gray' }}>
            {I18n.t('exchange.exchange_record')}
          </Text>
        </View>
      </View>
    );
  }
}
