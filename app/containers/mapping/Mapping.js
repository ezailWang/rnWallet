import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../config/LayoutConstants';
import MappingTermsScreen from './MappingTermsScreen';

class Mapping extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._isMounted = false;
  }

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
