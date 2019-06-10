import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Clipboard,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import Layout from '../../../config/LayoutConstants';
import { androidPermission } from '../../../utils/PermissionsAndroid';
import { TransparentBgHeader } from '../../../components/NavigaionHeader';
import { Colors, StorageKey, Network } from '../../../config/GlobalConfig';
import { showToast } from '../../../utils/Toast';
import { I18n } from '../../../config/language/i18n';
import BaseComponent from '../../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    paddingTop: 30,
    width: Layout.WINDOW_WIDTH * 0.82,
    alignItems: 'center',
  },
  qrCodeBox: {
    width: Layout.WINDOW_WIDTH * 0.82 - 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoIcon: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: -20,
    zIndex: 10,
  },
  titleTxt: {
    fontSize: 15,
    color: Colors.fontDarkColor,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 55,
  },
  qrCode: {
    width: 180,
    height: 180,
    marginTop: 65,
    backgroundColor: Colors.bgGrayColor,
  },
  adderssTxt: {
    width: 180,
    fontSize: 14,
    marginTop: 15,
    color: Colors.fontBlackColor,
  },
  btnImageBackground: {
    alignItems: 'center',
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH * 0.82 - 3,
    height: Layout.WINDOW_WIDTH * 0.82 * 0.22,
    marginTop: -1,
    // alignSelf: 'stretch',
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 20,
  },
  btnOpacity: {
    // backgroundColor:'transparent',
    width: Layout.WINDOW_WIDTH * 0.82,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 16,
    color: Colors.fontBlueColor,
    fontWeight: '500',
    marginTop: 20,
  },
  itcBox: {
    width: Layout.WINDOW_WIDTH * 0.82,
    alignSelf: 'center',
  },
  itcTextWarn: {
    width: Layout.WINDOW_WIDTH * 0.82,
    color: 'white',
    fontSize: 13,
  },
});

class MyQrcode extends BaseComponent {
  constructor(props) {
    super(props);
    this._setStatusBarStyleLight();
    this.state = {
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    super.componentWillUnmount();
  }

  copyAddress() {
    Clipboard.setString(this.props.activityEthAddress);
    showToast(I18n.t('toast.copied'));
  }

  renderComponent = () => (
    <ImageBackground style={styles.container} source={require('../../../assets/launch/splash_bg.png')}>
      <TransparentBgHeader
        navigation={this.props.navigation}
        text={I18n.t('activity.qrcode.myqrcode')}
      />

      <View style={styles.contentContainer}>
        <View style={styles.contentBox}>
          <Image
            style={styles.logoIcon}
            source={require('../../../assets/set/logoWhiteBg.png')}
            resizeMode="contain"
          />
          <View style={styles.qrCodeBox}>
            <View style={styles.qrCode}>
              <QRCode
                value={this.props.activityEthAddress}
                size={180}
                bgColor="#000"
                fgColor="#fff"
                onLoad={() => {}}
                onLoadEnd={() => {}}
              />
            </View>

            <Text style={styles.adderssTxt}>{this.props.activityEthAddress}</Text>
          </View>

          <ImageBackground
            style={styles.btnImageBackground}
            source={require('../../../assets/set/qrBtnBg.png')}
            resizeMode="contain"
          >
            <TouchableOpacity
              style={[styles.btnOpacity]}
              activeOpacity={0.6}
              onPress={() => this.copyAddress()}
            >
              <Text style={styles.btnTxt}>{I18n.t('settings.copy_payment_address')}</Text>
            </TouchableOpacity>
          </ImageBackground>

        </View>
      </View>
    </ImageBackground>
  );
}

const mapStateToProps = state => ({
  activityEthAddress : state.Core.activityEthAddress,
  selAvtivityContainerKey: state.Core.selAvtivityContainerKey,
});

export default connect(
  mapStateToProps,
  {}
)(MyQrcode);
