import React, { PureComponent } from 'react'
import { View, Linking, DeviceEventEmitter, Platform } from 'react-native'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Layout from '../../config/LayoutConstants'
import { StorageKey } from '../../config/GlobalConfig'
import { I18n } from '../../config/language/i18n'
import ItcMappingServiceScreen from '../mapping/ItcMappingServiceScreen'
import MappingTermsScreen from '../mapping/MappingTermsScreen'
import LinearGradient from 'react-native-linear-gradient'
class Mapping extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {

        }
        this._isMounted = false;
    }

    componentDidMount() {

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
                <View style={{ flex: 1, marginTop: Layout.DEVICE_IS_IPHONE_X() ? 44 : 20, backgroundColor: 'white' }}>
                    <MappingTermsScreen></MappingTermsScreen>
                </View>
            </LinearGradient>
        )

    }
}

const mapStateToProps = state => ({
    wallet: state.Core.wallet,
    monetaryUnit: state.Core.monetaryUnit,
    network: state.Core.network,
});

export default connect(mapStateToProps)(Mapping);