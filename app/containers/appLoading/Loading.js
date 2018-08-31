import React, { Component } from 'react'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    setWalletAddress, 
    setWalletName,
    setWalletPasswordPrompt,
    setNetWork
} from '../../config/action/Actions'
import { StorageKey } from '../../config/GlobalConfig'
//import NavigationActions from 'react-navigation/src/NavigationActions';
import {NavigationActions} from 'react-navigation';

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
        console.log('L_load',"开始")
        if (!this.props.walletAddress) {
            await this.loadFromStorege()
        }
        if (this.props.walletAddress) {
            console.log('L_load_1',"进入Home")
            return this.props.navigation.navigate('HomeScreen')
        } else {
            console.log('L_load_1',"进入FirstLaunch")
            return this.props.navigation.navigate('FirstLaunch', {
                migrationMode: true
            })
        }
    }
    componentWillUnmount(){
        console.log('L_load',"结束")
    }

    loadFromStorege = async () => {
        var data = await StorageManage.load(StorageKey.User)
        var net = await StorageManage.load(StorageKey.Network)
        if (data) {
            if (data['address']) {
                this.props.dispatch(setWalletAddress(data['address']))
            }
            if(data['name']){
                this.props.dispatch(setWalletName(data['name']))
            }
            if(data['extra']){
                this.props.dispatch(setWalletPasswordPrompt(data['extra']))
            }
        if(net){
            this.props.dispatch(setNetWork(net))
        }    
        } else {
            console.log('data = null')
        }
        console.log('L_data',data)
    }

    render() {
        return null
    }
}

const mapStateToProps = state => ({
    walletAddress: state.Core.walletAddress,
});

export default connect(mapStateToProps)(Loading);