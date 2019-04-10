import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: LayoutConstants.EXCHANGE_HEADER_CONTENT_HEIGHT,
  },
  whiteContainer: {
    backgroundColor: 'white',
    marginTop: 70,
    marginLeft: 20,
    marginRight: 20,
    height: 200,
    borderRadius: 10,
  },
  childViewContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetsContainer: {
    backgroundColor: 'transparent',
    height: LayoutConstants.EXCHANGE_HEADER_LADDER_HEIGHT,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: LayoutConstants.EXCHANGE_HEADER_LADDER_HEIGHT,
    marginLeft: 21,
  },
  assetsBox: {
    backgroundColor: 'transparent',
  },
  addressContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: LayoutConstants.EXCHANGE_HEADER_LADDER_HEIGHT,
    marginLeft: 21,
  },
  bottomAddAssetsContainer: {
    backgroundColor: 'white',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default class ExchangeHeadView extends Component {
  render() {
    const { onCoinTypeSelect, onWalletSelect, onExchange } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.whiteContainer}>
          <View style={styles.childViewContainer}>
            <Text>1 Eth = 888 ITC</Text>
          </View>
          <View style={styles.childViewContainer}>
            <TouchableOpacity
              onPress={onCoinTypeSelect}
              style={{ width: 80, height: 30, borderWidth: 1, borderRadius: 2 }}
            />
            <TextInput style={{ width: 160, height: 30, borderWidth: 1, borderRadius: 2 }} />
          </View>
          <View style={styles.childViewContainer}>
            <Text>可用余额：888</Text>
            <TouchableOpacity onPress={onWalletSelect}>
              <Text>钱包 name1</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.childViewContainer}>
            <TouchableOpacity
              onPress={onCoinTypeSelect}
              style={{ width: 80, height: 30, borderWidth: 1, borderRadius: 2 }}
            />
            <TextInput style={{ width: 160, height: 30, borderWidth: 1, borderRadius: 2 }} />
          </View>
          <View style={styles.childViewContainer}>
            <TouchableOpacity onPress={onWalletSelect}>
              <Text>钱包 name2</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.childViewContainer}>
            <TouchableOpacity onPress={onExchange}>
              <Text>兑换</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 5, color: 'white' }}>Powered by SWFT Blockchain</Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            marginTop: 30,
          }}
        >
          <Text style={{ marginTop: 10, marginLeft: 20, color: 'gray' }}>兑换记录</Text>
        </View>
      </View>
    );
  }
}
