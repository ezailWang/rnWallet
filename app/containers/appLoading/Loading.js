import React, { Component } from 'react'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    setWalletAddress,
    setWalletName,
    setNetWork
} from '../../config/action/Actions'
import { StorageKey } from '../../config/GlobalConfig'
import { I18n, getLanguages } from '../../config/language/i18n'

class Loading extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.shape({
            navigate: PropTypes.func.isRequired,
        }).isRequired,
        walletAddress: PropTypes.string,
    }

    static defaultProps = {
        walletAddress: null
    }

    async componentDidMount() {
        if (!this.props.walletAddress) {
            await this.loadFromStorege()
        }
        if (this.props.walletAddress) {
            return this.props.navigation.navigate('Home')
        } else {
            return this.props.navigation.navigate('FirstLaunch', {
                migrationMode: true
            })
        }
    }

    loadFromStorege = async () => {
        var data = await StorageManage.load(StorageKey.User)
        var net = await StorageManage.load(StorageKey.Network)
        var language = await StorageManage.load(StorageKey.Language)
        if (net) {
            this.props.dispatch(setNetWork(net))
        }
        if (language) {
            I18n.locale = language
        }
        if (data) {
            if (data['address']) {
                this.props.dispatch(setWalletAddress(data['address']))
            }
            if (data['name']) {
                this.props.dispatch(setWalletName(data['name']))
            }
        } else {
            console.log('data = null')
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = state => ({
    walletAddress: state.Core.walletAddress,
});

export default connect(mapStateToProps)(Loading);