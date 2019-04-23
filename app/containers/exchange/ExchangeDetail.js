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
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import I18n from 'react-native-i18n';
import { TransparentBgHeader } from '../../components/NavigaionHeader';
import { Colors } from '../../config/GlobalConfig';
import BaseComponent from '../base/BaseComponent';
import LayoutConstants from '../../config/LayoutConstants';
import NetworkManager from '../../utils/NetworkManager';
import { showToast } from '../../utils/Toast';
import ExchangeStepModal from './component/ExchangeStepModal';
import KeystoreUtils from '../../utils/KeystoreUtils';
import { setExchangeDepositStatus } from '../../config/action/Actions';
import { defaultSupportExchangeTokens } from '../../utils/Constants';

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

class ExChangeDetail extends BaseComponent {
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
      platformAddr: '',
      instantRate: '',
      depositCoinFeeAmt: '',
    };
    this._setStatusBarStyleLight();
  }

  async componentDidMount() {
    super.componentDidMount();
    this._showLoading();
    await this.updateOrderDetail();
    this._hideLoading();
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this._isMounted = false;
  }

  _getStatusIcon = () => {
    switch (this.state.tradeState) {
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

  startSendTransaction = async privateKey => {
    let txHash;
    try {
      await NetworkManager.sendTransaction(
        {
          address: defaultSupportExchangeTokens.find(
            token => token.symbol === this.state.depositCoinCode
          ).address,
          symbol: this.state.depositCoinCode,
          decimal: defaultSupportExchangeTokens.find(
            token => token.symbol === this.state.depositCoinCode
          ).decimal,
        },
        this.state.platformAddr,
        this.state.depositCoinAmt,
        await NetworkManager.getSuggestGasPrice({ type: 'eth' }),
        privateKey,
        async hash => {
          txHash = hash;
        },
        true,
        this.state.depositAddr
      );
    } catch (e) {
      this._hideLoading();
      showToast('transaction error', 30);
    }
    this._hideLoading();
    if (txHash) {
      showToast('存币成功', -30);
      this.props.setExchangeDepositStatus(true);
    } else {
      showToast('存币失败', -30);
    }
  };

  getPriKey = async password => {
    try {
      return await KeystoreUtils.getPrivateKey(password, this.state.depositAddr, 'eth');
    } catch (err) {
      showToast('check privateKey error', 30);
      return null;
    }
  };

  updateCoinInfo = () => {
    const { depositCoinCode, receiveCoinCode } = this.state;
    NetworkManager.getBaseInfo({
      depositCoinCode,
      receiveCoinCode,
    })
      .then(getBaseInfoData => {
        if (getBaseInfoData.resCode === '800') {
          const dataInfo = getBaseInfoData.data;
          this.setState({
            instantRate: dataInfo.instantRate,
          });
        } else {
          showToast(getBaseInfoData.resMsg, 30);
        }
      })
      .catch(e => {
        DeviceEventEmitter.emit('netRequestErr', e);
      });
  };

  updateOrderDetail = async () => {
    const { orderItem } = this.props.navigation.state.params;
    await NetworkManager.queryOrderState({
      equipmentNo: DeviceInfo.getUniqueID(),
      sourceType: Platform.OS.toUpperCase(),
      orderId: orderItem.orderId,
    })
      .then(rsp => {
        if (rsp.resCode === '800') {
          this.setState(
            {
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
              platformAddr: rsp.data.platformAddr,
              depositCoinFeeAmt: rsp.data.depositCoinFeeAmt,
            },
            () => {
              this.updateCoinInfo();
            }
          );
        } else {
          showToast(rsp.resMsg, 30);
        }
      })
      .catch(e => {
        DeviceEventEmitter.emit('netRequestErr', e);
      });
  };

  renderComponent = () => {
    const statusIcon = this._getStatusIcon();
    const statusTitle = this._getStatusTitle();
    return (
      <ImageBackground
        style={styles.container}
        source={require('../../assets/launch/splash_bg.png')}
      >
        <ExchangeStepModal
          ref={modalExchangeStep => {
            this.modalExchangeStep = modalExchangeStep;
          }}
          didTapSurePasswordBtn={async password => {
            const priKey = await this.getPriKey(password);
            if (priKey == null) {
              showToast(I18n.t('modal.password_error'), 30);
            } else {
              this.modalExchangeStep.closeStepView();
              this._showLoading();
              await this.startSendTransaction(priKey);
            }
          }}
          onCancelClick={() => {
            this.modalExchangeStep.closeStepView();
          }}
          depositSymbol={this.state.depositCoinCode}
          receiveSymbol={this.state.receiveCoinCode}
          depositValue={this.state.depositCoinAmt}
          receiveValue={this.state.receiveCoinAmt}
          instantRate={this.state.instantRate}
          fromAddress={this.state.depositAddr}
          depositCoinFeeAmt={this.state.depositCoinFeeAmt}
        />
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
                fontWeight: '300',
              }}
            >
              {statusTitle}
            </Text>
            {this.state.orderState === 'wait_deposits' && !this.props.depositStatus ? (
              <TouchableOpacity
                style={{ alignSelf: 'center', marginTop: 5 }}
                onPress={() => {
                  this.modalExchangeStep.showStepView();
                }}
              >
                <Text style={{ color: Colors.themeColor }}>继续交易</Text>
              </TouchableOpacity>
            ) : null}
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

const mapStateToProps = state => ({
  depositStatus: state.Core.depositStatus,
});

const mapDispatchToProps = dispatch => ({
  setExchangeDepositStatus: depositStatus => dispatch(setExchangeDepositStatus(depositStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExChangeDetail);
