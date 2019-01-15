import React, { PureComponent } from 'react';
import { View, Linking, DeviceEventEmitter, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import StorageManage from '../../utils/StorageManage';
import Layout from '../../config/LayoutConstants';
import { StorageKey } from '../../config/GlobalConfig';
import { I18n } from '../../config/language/i18n';
import ItcMappingServiceScreen from './ItcMappingServiceScreen';
import MappingTermsScreen from './MappingTermsScreen';

class Mapping extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._isMounted = false;
  }

  componentDidMount() {}

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#32beff', '#32beff']}>
        <View
          style={{
            flex: 1,
            marginTop: Layout.DEVICE_IS_IPHONE_X() ? 44 : 20,
            backgroundColor: 'white',
          }}
        >
          <MappingTermsScreen />
        </View>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  wallet: state.Core.wallet,
  monetaryUnit: state.Core.monetaryUnit,
  network: state.Core.network,
});

export default connect(mapStateToProps)(Mapping);
