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
    width: 90,
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
    width: 160,
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
    const { onCoinTypeSelect, onWalletSelect, onExchange } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.whiteContainer}>
          <View style={styles.childViewContainer}>
            <Text style={styles.titleText}>1 Eth = 888 ITC</Text>
          </View>
          <View style={[styles.childViewContainer, { marginTop: 5 }]}>
            <TouchableOpacity onPress={onCoinTypeSelect} style={styles.coinType}>
              <Image source={this._getLogo('ETH')} style={styles.coinTypeIcon} />
              <Text style={styles.coinTypeText}>ETH</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
            <TextInput
              returnKeyType="next"
              keyboardType="numeric"
              textAlign="right"
              placeholder="转出数量"
              style={styles.input}
            />
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'flex-start', marginTop: 5 }]}>
            <Text style={styles.balanceText}>可用余额：888</Text>
            <TouchableOpacity style={styles.walletSelect} onPress={onWalletSelect}>
              <Text style={styles.walletSelectText}>钱包 name1</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
          </View>
          <View style={[styles.childViewContainer, { marginTop: -10 }]}>
            <TouchableOpacity onPress={onCoinTypeSelect} style={styles.coinType}>
              <Image source={this._getLogo('ITC')} style={styles.coinTypeIcon} />
              <Text style={styles.coinTypeText}>ITC</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              returnKeyType="done"
              textAlign="right"
              placeholder="接收数量"
              style={styles.input}
            />
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'flex-start', marginTop: 5 }]}>
            <TouchableOpacity
              style={[styles.walletSelect, { width: 285 }]}
              onPress={onWalletSelect}
            >
              <Text style={styles.walletSelectText}>钱包 name2</Text>
              <Image source={require('../../../assets/exchange/icon_tr.png')} style={styles.tr} />
            </TouchableOpacity>
          </View>
          <View style={[styles.childViewContainer, { alignItems: 'flex-start', marginBottom: 10 }]}>
            <TouchableOpacity
              style={{
                width: 285,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onExchange}
            >
              <Image
                style={{ width: 285, height: 40 }}
                source={require('../../../assets/exchange/icon_buttom.png')}
              />
              <Text
                style={{
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  width: 285,
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
