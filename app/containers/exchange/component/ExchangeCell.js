import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 21,
  },
  leftTextViews: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 21,
  },
  rightView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 21,
  },
  separator: {
    flex: 1,
    backgroundColor: 'rgb(247,248,249)',
    height: 1,
    marginHorizontal: 10,
  },
  icon: {
    width: 26,
    height: 26,
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  emptyView: {
    flex: 1,
    height: LayoutConstants.WINDOW_HEIGHT - LayoutConstants.HOME_HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const tokeniCon = {
//   ETH: require('../../../assets/home/ETH.png'),
//   ITC: require('../../../assets/home/ITC.png'),
//   MANA: require('../../../assets/home/MANA.png'),
//   DPY: require('../../../assets/home/DPY.png'),
// };

class ExchangeEmptyComponent extends Component {
  render() {
    return (
      <View style={styles.emptyView}>
        <Text style={{ fontSize: 20 }}>暂无兑换记录</Text>
      </View>
    );
  }
}

class ExchangeModalCoinSelectCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadIconError: false,
    };
  }

  static propTypes = {};

  _getLogo = (symbol, iconLarge) => {
    if (symbol === 'ITC') {
      return require('../../../assets/home/ITC.png');
    }
    if (iconLarge === '') {
      if (symbol === 'ETH') {
        return require('../../../assets/home/ETH.png');
      }
    }
    return require('../../../assets/home/null.png');
  };

  render() {
    const { item, onClick } = this.props;
    const { symbol, iconLarge } = item.item || {};
    const { loadIconError } = this.state;
    const icon = this._getLogo(symbol, iconLarge);
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Image
              style={styles.icon}
              source={
                iconLarge === '' || loadIconError === true || symbol === 'ITC'
                  ? icon
                  : { uri: iconLarge }
              }
              resizeMode="contain"
              iosdefaultSource={require('../../../assets/home/null.png')}
              onError={() => {
                this.setState({
                  loadIconError: true,
                });
              }}
            />
            <View style={styles.leftTextViews}>
              <Text style={{ fontSize: 15, color: Colors.themeColor }}>
                {'0.888ETH -> 8888ITC'}
              </Text>
              <Text style={{ fontSize: 13, color: Colors.fontDarkGrayColor }}>04-10 18:88</Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../../assets/home/null.png')}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class ExchangeModalWalletSelectCell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {};

  render() {
    const { item, onClick } = this.props;
    const { name, address } = item.item || {};
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <View style={styles.leftTextViews}>
              <Text style={{ fontSize: 15, color: Colors.themeColor }}>{name}</Text>
              <Text style={{ fontSize: 13, color: Colors.fontDarkGrayColor }}>{address}</Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../../assets/home/null.png')}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class ExchangeCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadIconError: false,
    };
  }

  static propTypes = {};

  _getLogo = (symbol, iconLarge) => {
    if (symbol === 'ITC') {
      return require('../../../assets/home/ITC.png');
    }
    if (iconLarge === '') {
      if (symbol === 'ETH') {
        return require('../../../assets/home/ETH.png');
      }
    }
    return require('../../../assets/home/null.png');
  };

  render() {
    const { item, onClick } = this.props;
    const { symbol, iconLarge } = item.item || {};
    const { loadIconError } = this.state;
    const icon = this._getLogo(symbol, iconLarge);
    return (
      <TouchableHighlight onPress={onClick}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Image
              style={styles.icon}
              source={
                iconLarge === '' || loadIconError === true || symbol === 'ITC'
                  ? icon
                  : { uri: iconLarge }
              }
              resizeMode="contain"
              iosdefaultSource={require('../../../assets/home/null.png')}
              onError={() => {
                this.setState({
                  loadIconError: true,
                });
              }}
            />
            <View style={styles.leftTextViews}>
              <Text style={{ fontSize: 14, color: Colors.themeColor }}>
                {'0.888ETH -> 8888ITC'}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.fontDarkGrayColor }}>04-10 18:88</Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <Text style={{ fontSize: 13, color: Colors.fontGrayColor_a }}>兑换成功</Text>
            <Image
              resizeMode="contain"
              style={{ width: 9, height: 15, marginLeft: 10 }}
              source={require('../../../assets/exchange/back_g.png')}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export {
  ExchangeCell,
  ExchangeModalCoinSelectCell,
  ExchangeEmptyComponent,
  ExchangeModalWalletSelectCell,
};
