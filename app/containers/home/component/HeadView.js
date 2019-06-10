import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ImageButton from '../../../components/ImageButton';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import { I18n } from '../../../config/language/i18n';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: LayoutConstants.HOME_HEADER_CONTENT_HEIGHT,
  },
  assetsContainer: {
    backgroundColor: 'transparent',
    height: LayoutConstants.HOME_HEADER_LADDER_HEIGHT,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: LayoutConstants.HOME_HEADER_LADDER_HEIGHT,
    marginLeft: 21,
  },
  assetsBox: {
    backgroundColor: 'transparent',
  },
  addressContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: LayoutConstants.HOME_HEADER_LADDER_HEIGHT,
    marginLeft: 21,
  },
  bottomAddAssetsContainer: {
    backgroundColor: 'white',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
});

export default class HeadView extends Component {
  static propTypes = {
    onQRCode: PropTypes.func.isRequired,
    onAddAssets: PropTypes.func.isRequired,
    walletName: PropTypes.string,
    address: PropTypes.string,
    totalAssets: PropTypes.string,
  };

  static defaultProps = {
    hideAssetsIcon: LayoutConstants.DEFAULT_IAMGE,
    QRCodeIcon: LayoutConstants.DEFAULT_IAMGE,
    addAssetsIcon: LayoutConstants.DEFAULT_IAMGE,
  };

  render() {
    const {
      onHideAssets,
      hideAssetsIcon,
      totalAssets,
      walletName,
      address,
      addAssetsIcon,
      QRCodeIcon,
      onQRCode,
      onAddAssets,
      isHaveAddTokenBtn,
      bannerImage,
      onBanner,
    } = this.props;
    return (
      <View style={styles.container}>
        {/* <View style={styles.topViewContainer}>
                </View> */}
        <View style={styles.assetsContainer}>
          <TouchableOpacity style={styles.assetsBox} onPress={onHideAssets} activeOpacity={1}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 14, color: 'white' }}> {I18n.t('home.total_assets')} </Text>
              <ImageButton
                btnStyle={{ marginLeft: 5 }}
                imageStyle={{ width: 17, height: 11 }}
                onClick={onHideAssets}
                backgroundImageSource={hideAssetsIcon}
              />
            </View>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.01}
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 39,
                color: 'white',
                fontWeight: '700',
                marginLeft: -3,
                paddingLeft: 0 /* width: LayoutConstants.WINDOW_WIDTH - 50 */,
              }}
            >
              {' '}
              {totalAssets}{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addressContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17.3 }}>
              {' '}
              {walletName}{' '}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 12 }}> {address} </Text>
            <ImageButton
              btnStyle={{ width: 30, height: 22, paddingRight: 10 }}
              imageStyle={{ width: 13, height: 13 }}
              onClick={onQRCode}
              backgroundImageSource={QRCodeIcon}
            />
          </View>
        </View>
        <View
          style={{
            height: 100,
            paddingLeft: 21,
            paddingRight: 21,
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 20,
          }}
        >
          <ImageButton
            btnStyle={{ width: '100%', height: '100%' }}
            imageStyle={{ width: LayoutConstants.WINDOW_WIDTH, height: LayoutConstants.WINDOW_WIDTH * 0.25 }}
            onClick={onBanner}
            backgroundImageSource={bannerImage}
          />
        </View>
        <View style={styles.bottomAddAssetsContainer}>
          <Text
            style={{
              fontSize: 14,
              marginLeft: 21,
              color: Colors.homeAssetsTestColor,
              fontWeight: '600',
            }}
          >
            {' '}
            {I18n.t('home.assets')}{' '}
          </Text>
          {isHaveAddTokenBtn ? (
            <ImageButton
              btnStyle={{ width: 32, height: 32, marginRight: 18 }}
              onClick={onAddAssets}
              backgroundImageSource={addAssetsIcon}
            />
          ) : null}
        </View>
      </View>
    );
  }
}
