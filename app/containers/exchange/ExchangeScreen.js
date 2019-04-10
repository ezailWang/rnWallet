import React from 'react';
import { FlatList, StyleSheet, Text, Animated, View } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import { ExchangeCell, ExchangeEmptyComponent } from './component/ExchangeCell';
import { ItemDivideComponent } from '../home/component/HomeCell';
import ExchangeHeadView from './component/ExchangeHeadView';
import StatusBarComponent from '../../components/StatusBarComponent';
import { Colors } from '../../config/GlobalConfig';
import LayoutConstants from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import ExchangeFlatListModal from './component/ExchangeFlatListModal';
import ExchangeStepModal from './component/ExchangeStepModal';
// import NetworkManager from '../../utils/NetworkManager';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default class ExchangeScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataTest: [
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
        { symbol: 'ETH', iconLarge: '' },
      ],
      statusbarStyle: 'light-content',
      scroollY: new Animated.Value(0),
    };
    this.listRef = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();

    // NetworkManager.queryOrderState({
    //   equipmentNo: DeviceInfo.getUniqueID(),
    //   sourceType: Platform.OS.toUpperCase(),
    //   orderId: '62195fb5-e22e-4bf0-9c8f-9490b1da9eca',
    // })
    //   .then(data => {
    //     console.log('queryOrderState data:', data);
    //   })
    //   .catch(e => {
    //     console.log('queryOrderState e', e);
    //   });
    // NetworkManager.queryAllTrade({
    //   equipmentNo: DeviceInfo.getUniqueID(),
    //   sourceType: Platform.OS.toUpperCase(),
    // })
    //   .then(data => {
    //     console.log('queryAllTrade data--:', data);
    //   })
    //   .catch(e => {
    //     console.log('queryAllTrade e--:', e);
    //   });
    // NetworkManager.getBaseInfo({ depositCoinCode: 'ETH', receiveCoinCode: 'ITC' })
    //   .then(getBaseInfoData => {
    //     console.log('getBaseInfoData:---', getBaseInfoData);
    //     if (getBaseInfoData.resCode === '800') {
    //       const contentData = getBaseInfoData.data;
    //       const params = {
    //         equipmentNo: DeviceInfo.getUniqueID(),
    //         sessionUuid: '',
    //         sourceType: Platform.OS.toUpperCase(),
    //         userNo: '',
    //         depositCoinCode: 'ETH',
    //         receiveCoinCode: 'ITC',
    //         depositCoinAmt: '8',
    //         receiveCoinAmt: (8 * contentData.instantRate).toString(),
    //         receiveSwftAmt: '0',
    //         destinationAddr: '0xF16bCF19B170e692d967b1AC5dc2c8c8F7B1b72f',
    //         refundAddr: '0xF16bCF19B170e692d967b1AC5dc2c8c8F7B1b72f',
    //       };
    //       NetworkManager.accountExchange(params)
    //         .then(accountExchangeData => {
    //           console.log('accountExchange data--:', accountExchangeData);
    //         })
    //         .catch(e => {
    //           console.log('accountExchange e--:', e);
    //         });
    //     } else {
    //       console.log(' getBaseInfo resMsg', getBaseInfoData.resMsg);
    //     }
    //   })
    //   .catch(e => {
    //     console.log('e:---', e);
    //   });
  }

  renderItem = item => <ExchangeCell item={item} onClick={() => this.onClickCell(item)} />;

  onClickCell = item => {
    this.props.navigation.navigate('ExchangeDetail');
    console.log('item---:', item);
  };

  renderComponent = () => {
    const { dataTest, statusbarStyle, scroollY } = this.state;
    const topBg = require('../../assets/exchange/bg1.png');
    const headerHeight = scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        LayoutConstants.WINDOW_HEIGHT,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      extrapolate: 'clamp',
    });
    const headerZindex = scroollY.interpolate({
      inputRange: [
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const headerTextOpacity = scroollY.interpolate({
      inputRange: [
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT -
          LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT -
          20,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const headerBgImageScale = scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        LayoutConstants.WINDOW_HEIGHT / LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT + 1.1,
        1,
        1,
      ],
      extrapolate: 'clamp',
    });

    const headerBgImageTranslateY = scroollY.interpolate({
      inputRange: [
        -LayoutConstants.WINDOW_HEIGHT + LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
        0,
        LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT,
      ],
      outputRange: [
        0,
        0,
        -(LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT - LayoutConstants.EXCHANGE_HEADER_MIN_HEIGHT),
      ],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <StatusBarComponent barStyle={statusbarStyle} />
        <ExchangeFlatListModal
          ref={modalCoinList => {
            console.log('modalCoinList--:', modalCoinList);
            this.modalCoinList = modalCoinList;
          }}
          selectCategory="coinSelect"
          onSelect={item => {
            console.log('coinSelet item--:', item);
          }}
        />
        <ExchangeFlatListModal
          ref={modalWalletList => {
            this.modalWalletList = modalWalletList;
          }}
          selectCategory="walletSelect"
          onSelect={item => {
            console.log('walletSelect item--:', item);
          }}
        />
        <ExchangeStepModal
          ref={modalExchangeStep => {
            console.log('modalExchangeStep--:', modalExchangeStep);
            this.modalExchangeStep = modalExchangeStep;
          }}
          didTapSurePasswordBtn={password => {
            console.log('passwor--:', password);
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: Colors.themeColor,
            height: headerHeight,
            zIndex: headerZindex,
          }}
        >
          <Animated.Image
            style={{
              height: LayoutConstants.EXCHANGE_HEADER_MAX_HEIGHT,
              width: LayoutConstants.WINDOW_WIDTH,
              transform: [{ translateY: headerBgImageTranslateY }, { scale: headerBgImageScale }],
            }}
            source={topBg}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: (LayoutConstants.WINDOW_WIDTH - 200) / 2,
              top: LayoutConstants.DEVICE_IS_IPHONE_X() ? 55 : 35,
              opacity: headerTextOpacity,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                width: 200,
                color: 'white',
                fontSize: 16,
                lineHeight: 16,
                textAlign: 'center',
              }}
              onPress={() => {
                this.listRef.current.scrollToOffset(0);
              }}
            >
              1 ETH ≈ 888 ITC
            </Text>
          </Animated.View>
        </Animated.View>
        <FlatList
          renderItem={this.renderItem}
          data={dataTest}
          ref={this.listRef}
          ItemSeparatorComponent={ItemDivideComponent}
          ListEmptyComponent={ExchangeEmptyComponent}
          ListHeaderComponent={
            <ExchangeHeadView
              onCoinTypeSelect={() => {
                this.modalCoinList.showFlatModal();
              }}
              onWalletSelect={() => {
                this.modalWalletList.showFlatModal();
              }}
              onExchange={() => {
                console.log('--------show------', this.modalExchangeStep);
                this.modalExchangeStep.showStepView();
              }}
            />
          }
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroollY } } }])}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index })}
        />
      </View>
    );
  };
}
