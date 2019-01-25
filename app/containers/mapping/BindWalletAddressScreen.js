import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Actions from '../../config/action/Actions';
import { BlueButtonBig } from '../../components/Button';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  topBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrayColor_ed,
    marginTop: 20,
  },
  topTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTitle: {
    color: Colors.fontBlackColor_43,
    fontSize: 14,
    flex: 1,
  },
  topChangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingLeft: 10,
  },
  changeText: {
    color: Colors.fontGrayColor_a0,
    fontSize: 14,
    paddingRight: 5,
  },
  changeIcon: {
    width: 10,
    height: 10,
  },
  line: {
    height: 1,
    backgroundColor: Colors.bgGrayColor_ed,
  },
  topConetntBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  logoIcon: {
    width: 40,
    height: 40,
  },
  topContent: {
    marginLeft: 10,
  },
  topWalletName: {
    color: Colors.fontBlackColor_43,
    fontSize: 14,
  },
  topWalletAddress: {
    color: Colors.fontGrayColor_a0,
    fontSize: 12,
    marginTop: 2,
  },

  descBox: {
    width: Layout.WINDOW_WIDTH * 0.9,
    borderRadius: 5,
    backgroundColor: Colors.bg_blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  descText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    width: Layout.WINDOW_WIDTH * 0.85,
  },
  warnText: {
    color: 'white',
    fontSize: 12,
    width: Layout.WINDOW_WIDTH * 0.85,
    marginTop: 2,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },

  bottomBox: {
    width: Layout.WINDOW_WIDTH,
    height: Layout.DEVICE_IS_IPHONE_X() ? 100 : 80,
    backgroundColor: 'white',
    paddingBottom: Layout.DEVICE_IS_IPHONE_X() ? 20 : 0,
    alignItems: 'center',
  },

  item: {
    flexDirection: 'row',
    height: 66,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 20,
  },
  itemConetntView: {
    flex: 1,
    justifyContent: 'center',
  },
  itemBindName: {
    fontSize: 15,
    color: Colors.fontGrayColor_a1,
  },
  itemName: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
  },
  itemAddress: {
    fontSize: 13,
    color: Colors.fontGrayColor_a1,
    marginTop: 2,
  },
  itemCheckedImg: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  itemSeparator: {
    height: 1,
    width: Layout.WINDOW_WIDTH - 20,
    backgroundColor: Colors.bgGrayColor_ed,
    alignSelf: 'center',
  },
  emptyListContainer: {
    marginTop: 150,
    width: Layout.WINDOW_WIDTH * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyListIcon: {
    width: 94,
    height: 114,
    marginBottom: 23,
  },
  emptyListText: {
    fontSize: 16,
    width: Layout.WINDOW_WIDTH * 0.9,
    color: Colors.fontGrayColor_a,
    textAlign: 'center',
  },
  footer: {
    width: Layout.WINDOW_WIDTH * 0.8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  footerTouch: {
    flex: 1,
    marginTop: 22,
  },
  footerImg: {
    width: Layout.WINDOW_WIDTH * 0.8,
    height: ((Layout.WINDOW_WIDTH * 0.8) / 268) * 44,
  },
  footerTxt: {
    color: Colors.fontGrayColor_a,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
});

class BindWalletAddressScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletList: [],
      itcWallet: {
        name: 'wallet',
        address: '0xf6C9e322b688A434833dE530E4c23CFA4e579a7a',
      },
      isDisabled: true,
    };

    this.selectedWallet = null;
    this.flatList = React.createRef();
  }

  _initData = () => {
    const wallets = [];
    for (let i = 0; i < 10; i++) {
      const wallet = {
        name: `wallet${i}`,
        address: '0xf6C9e322b688A434833dE530E4c23CFA4e579a7a',
        isChecked: false,
        bind: i === 2,
      };
      wallets.push(wallet);
    }
    this.setState({
      walletList: wallets,
    });
  };

  nextBtn() {
    this.props.navigation.navigate('ItcMappingService');
  }

  // 自定义分割线
  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />;

  // 空布局
  _renderEmptyView = () => (
    <View style={styles.emptyListContainer}>
      <Image
        style={styles.emptyListIcon}
        source={require('../../assets/common/no_icon.png')}
        resizeMode="contain"
      />
      <Text style={styles.emptyListText}>{I18n.t('settings.no_data')}</Text>
    </View>
  );

  _renderFooterView = () => <Footer onFooterItem={this._onFooterItem} />;

  _onFooterItem = () => {
    showToast('123');
  };

  _renderItem = item => <Item item={item} onPressItem={() => this._onPressItem(item)} />;

  _onPressItem = item => {
    const choseWallet = item.item;
    this.selectedWallet = choseWallet;

    const wallets = this.state.walletList;
    const newWallets = [];
    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      if (wallet.isChecked) {
        wallet.isChecked = false;
      }
      if (choseWallet.name === wallet.name) {
        wallet.isChecked = true;
      }
      newWallets.push(wallet);
    }

    this.setState({
      walletList: newWallets,
      isDisabled: false,
    });
  };

  _onChaneAddressPress = () => {
    const _this = this;
    this.props.navigation.navigate('ChangeBindAddress', {
      callback(data) {
        _this.setState({
          itcWallet: data.itcWallet,
        });
      },
    });
  };

  _onBackPressed = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  backPressed() {
    this.props.navigation.navigate('Home');
  }

  renderComponent = () => {
    const { address, name } = this.state.itcWallet;
    const _address = `${address.substr(0, 8)}...${address.substr(34, 42)}`;
    return (
      <View style={styles.container}>
        <WhiteBgHeader
          navigation={this.props.navigation}
          text={I18n.t('mapping.binding_wallet_address')}
          leftPress={() => this.backPressed()}
        />
        <View style={styles.contentBox}>
          <View style={styles.topBox}>
            <View style={styles.topTitleBox}>
              <Text style={styles.topTitle}>{I18n.t('mapping.binding_wallet_address_title')}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.topChangeBox}
                onPress={this._onChaneAddressPress}
              >
                <Text style={styles.changeText}>{I18n.t('mapping.change')}</Text>
                <Image
                  style={styles.changeIcon}
                  source={require('../../assets/common/right_gray.png')}
                  resizeMode="center"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.topConetntBox}>
              <Image
                style={styles.logoIcon}
                source={require('../../assets/set/itc_icon.png')}
                resizeMode="center"
              />
              <View style={styles.topContent}>
                <Text style={styles.topWalletName}>{name}</Text>
                <Text style={styles.topWalletAddress}>{_address}</Text>
              </View>
            </View>
          </View>
          <LinearGradient
            style={styles.descBox}
            colors={['#3fc1ff', '#66ceff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.descText}>{I18n.t('mapping.binding_wallet_address_desc')}</Text>
            <Text style={styles.warnText}>{I18n.t('mapping.binding_wallet_address_warn')}</Text>
          </LinearGradient>
          <FlatList
            style={styles.listContainer}
            ref={this.flatList}
            data={this.state.walletList}
            keyExtractor={(item, index) => index.toString()} // 给定的item生成一个不重复的key
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmptyView}
            ListFooterComponent={this._renderFooterView}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
            getItemLayout={(data, i) => ({
              length: 80,
              offset: (89 + 1) * i,
              index: i,
            })}
          />
        </View>

        <View style={styles.bottomBox}>
          <BlueButtonBig
            isDisabled={this.state.isDisabled}
            onPress={() => this.nextBtn()}
            text={I18n.t('mapping.next')}
          />
        </View>
      </View>
    );
  };
}

class Item extends PureComponent {
  render() {
    const { item, onPressItem } = this.props;
    const { name, address, isChecked, bind } = item.item || {};
    const _name = bind ? name + I18n.t('mapping.bind') : name;
    const _address = `${address.substr(0, 8)}...${address.substr(34, 42)}`;
    const checkIcon = isChecked
      ? require('../../assets/launch/check_on.png')
      : require('../../assets/launch/check_off.png');
    const icon = bind ? require('../../assets/mapping/bind_icon.png') : checkIcon;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        {...this.props}
        style={styles.item}
        onPress={onPressItem}
        disabled={bind}
      >
        <View style={styles.itemConetntView}>
          <Text style={bind ? styles.itemBindName : styles.itemName}>{_name}</Text>
          <Text style={styles.itemAddress}>{_address}</Text>
        </View>
        <Image style={styles.itemCheckedImg} source={icon} resizeMode="center" />
      </TouchableOpacity>
    );
  }
}

class Footer extends PureComponent {
  render() {
    const { onFooterItem } = this.props;
    const img = require('../../assets/mapping/addBg.png');
    return (
      <View style={styles.footer}>
        <View style={styles.itemSeparator} />
        <TouchableOpacity activeOpacity={0.6} style={styles.footerTouch} onPress={onFooterItem}>
          <Image style={styles.footerImg} source={img} resizeMode="center" />
        </TouchableOpacity>
        <Text style={styles.footerTxt}>{I18n.t('mapping.import_erc_wallet')}</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BindWalletAddressScreen);
