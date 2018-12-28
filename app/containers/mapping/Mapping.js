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
import StatusBarComponent from '../../components/StatusBarComponent'
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
        //this.choseMappingTabHandler = DeviceEventEmitter.addListener('choseMappingTab', this._choseMappingTabEmitter);
    }

    componentWillUnmount() {
        this._isMounted = false;
        //this.choseMappingTabHandler && this.choseMappingTabHandler.remove();
    }

    _choseMappingTabEmitter = (data) => {
        /*if(this._isMounted){
        }
        setTimeout(()=>{
            I18n.locale == 'zh' ? 
            this.props.navigation.navigate('MappingTerms') :
            this.props.navigation.navigate('ItcMappingService')
        }, 0);*/
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBarComponent barStyle='dark-content' />
                <View style={{ flex: 1, marginTop: Layout.DEVICE_IS_IPHONE_X() ? 44 : 20, backgroundColor: 'white' }}>
                    <MappingTermsScreen></MappingTermsScreen>
                </View>
            </View>
        )
        //I18n.locale == 'zh' ? <ItcMappingServiceScreen></ItcMappingServiceScreen> :
    }
}

const mapStateToProps = state => ({
    wallet: state.Core.wallet,
    monetaryUnit: state.Core.monetaryUnit,
    network: state.Core.network,
});

export default connect(mapStateToProps)(Mapping);