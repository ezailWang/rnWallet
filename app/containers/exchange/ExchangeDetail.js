import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { TransparentBgHeader } from '../../components/NavigaionHeader';
import { Colors } from '../../config/GlobalConfig';

import BaseComponent from '../base/BaseComponent';
import LayoutConstants from '../../config/LayoutConstants';
import NetworkManager from '../../utils/NetworkManager';
import { showToast } from '../../utils/Toast';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
    width: LayoutConstants.WINDOW_WIDTH,
  },
  content: {
    width: LayoutConstants.WINDOW_WIDTH * 0.9,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  statusIcon: {
    width: 70,
    height: 70,
    marginTop: 20,
    alignSelf: 'center',
  },
  cellView: {
    flexDirection: 'row',
    flex: 1,
    height: 40,
    alignItems: 'center',
  },
  leftText: {
    marginLeft: 20,
    color: Colors.blackOpacityColor,
  },
  rightText: {
    width: LayoutConstants.WINDOW_WIDTH - 150,
    marginLeft: 20,
  },
  lineView: {
    width: LayoutConstants.WINDOW_WIDTH - 60,
    height: 0.5,
    opacity: 0.3,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: 'gray',
  },
});

export default class ExChangeDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderState: '',
      orderId: '',
      depositCoinAmt: '',
      receiveCoinAmt: '',
      depositCoinCode: '',
      receiveCoinCode: '',
      depositAddr: '',
      recevieAddr: '',
      beginDate: '',
      dealReceiveCoinAmt: '',
    };
    this._setStatusBarStyleLight();
  }

  componentDidMount() {
    super.componentDidMount();
    const { orderItem } = this.props.navigation.state.params;
    NetworkManager.queryOrderState({
      equipmentNo: DeviceInfo.getUniqueID(),
      sourceType: Platform.OS.toUpperCase(),
      orderId: orderItem.orderId,
    })
      .then(rsp => {
        if (rsp.resCode === '800') {
          this.setState({
            orderId: rsp.data.orderId,
            tradeState: orderItem.tradeState,
            orderState: rsp.data.orderState,
            depositCoinAmt: rsp.data.depositCoinAmt,
            receiveCoinAmt: rsp.data.receiveCoinAmt,
            depositCoinCode: rsp.data.depositCoinCode,
            receiveCoinCode: rsp.data.receiveCoinCode,
            depositAddr: rsp.data.refundAddr,
            recevieAddr: rsp.data.destinationAddr,
            beginDate: orderItem.beginDate,
            dealReceiveCoinAmt: rsp.data.dealReceiveCoinAmt,
          });
        } else {
          showToast(rsp.resMsg, 30);
        }
      })
      .catch(e => {
        DeviceEventEmitter.emit('netRequestErr', e);
      });
  }

  _getStatusIcon = () => {
    switch (this.state.orderState) {
      case 'not_complete':
      case 'exchange':
        return require('../../assets/transfer/trans_ing.png');
      case 'trade_fail':
      case 'timeout':
        return require('../../assets/transfer/trans_fail.png');
      case 'complete':
        return require('../../assets/transfer/trans_ok.png');
      default:
        return require('../../assets/transfer/trans_ing.png');
    }
  };

  _getStatusTitle = () => {
    if (this.state.tradeState === 'complete') {
      return '已完成';
    }
    switch (this.state.orderState) {
      case 'wait_deposits':
        return '待存币';
      case 'wait_exchange':
        return '交换中';
      case 'fial':
        return '兑换失败';
      case 'timeout':
        return '超时';
      case 'wait_send':
        return '待发币';
      default:
        return '';
    }
  };

  renderComponent = () => {
    const statusIcon = this._getStatusIcon();
    const statusTitle = this._getStatusTitle();
    return (
      <ImageBackground
        style={styles.container}
        source={require('../../assets/launch/splash_bg.png')}
      >
        <TransparentBgHeader navigation={this.props.navigation} text="详情" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Image style={styles.statusIcon} source={statusIcon} resizeMode="contain" />
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 5,
                color: Colors.blackOpacityColor,
                fontSize: 15,
                fontWeight: '200',
              }}
            >
              {statusTitle}
            </Text>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>支付金额</Text>
              <Text style={[styles.rightText, { fontSize: 24, fontWeight: 'bold' }]}>{`${
                this.state.depositCoinAmt
              } ${this.state.depositCoinCode}`}</Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>换取金额</Text>
              <Text style={[styles.rightText, { fontSize: 24, fontWeight: 'bold' }]}>{`${
                this.state.dealReceiveCoinAmt === ''
                  ? this.state.receiveCoinAmt
                  : this.state.dealReceiveCoinAmt
              } ${this.state.receiveCoinCode}`}</Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>付款地址</Text>
              <Text style={styles.rightText}>{this.state.depositAddr}</Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>收款地址</Text>
              <Text style={styles.rightText}>{this.state.recevieAddr}</Text>
            </View>
            <View style={styles.lineView} />
            <View style={styles.cellView}>
              <Text style={styles.leftText}>兑换时间</Text>
              <Text style={styles.rightText}>{this.state.beginDate}</Text>
            </View>
            <View style={[styles.cellView, { alignItems: 'flex-start' }]}>
              <Text style={styles.leftText}>交易号</Text>
              <Text
                style={[styles.rightText, { color: Colors.themeColor, marginLeft: 33 }]}
                numberOfLines={1}
              >
                {this.state.orderId}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };
}
