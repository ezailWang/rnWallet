import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Text,
    Image,
    DeviceEventEmitter,
    Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { Colors, StorageKey } from '../../config/GlobalConfig'
import StorageManage from '../../utils/StorageManage'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
import lodash from 'lodash'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgGrayColor,
    },

    itemHeaderBox: {
        width: Layout.WINDOW_WIDTH,
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
        marginTop: 12,
    },
    itemHeaderIcon: {
        width: 30,
        height: 30,
    },
    itemHeaderTitle: {
        flex: 1,
        fontSize: 14,
        color: Colors.fontBlackColor_43,
        marginLeft: 2,
    },
    itemHeaderTouchable: {
        height: 42,
        alignSelf: 'flex-end',
        justifyContent: 'center'

    },
    itemHeaderBtnTxt: {
        fontSize: 14,
        color: Colors.fontBlueColor,
    },

    itemBox: {
        height: 46,
        width: Layout.WINDOW_WIDTH,
    },
    itemTouchBox: {
        width: Layout.WINDOW_WIDTH,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 20,
        backgroundColor: 'white'
    },
    itemContentView: {
        flex: 1,
        flexDirection: 'column',
    },
    itemName: {
        fontSize: 14,
        color: Colors.fontBlackColor_43,
    },
    itemAddress: {
        fontSize: 12,
        color: Colors.fontGrayColor_a,
    },
    itemNextIcon: {
        width: 12,
        height: 18,
    },
    itemLine: {
        width: Layout.WINDOW_WIDTH,
        height: 1,
        backgroundColor: Colors.bgGrayColor_ed
    }



})

class WalletListScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            itcWallets: [],
            ethWallets: [],
        }
    }

    _initData() {
        this.refreshPage()
    }

    refreshPage() {
        let itcWallets = lodash.cloneDeep(this.props.itcWalletList)
        let ethWallets = lodash.cloneDeep(this.props.ethWalletList)
        this.setState({
            itcWallets: itcWallets,
            ethWallets: ethWallets,
        })
    }

    createEthOrItcWallet = (walletType) => {
        let params = {
            walletType: walletType,
            from: 2
        }
        this.props.setCreateWalletParams(params);
        this.props.navigation.navigate('CreateWallet')
    }

    itcWalletOnPress = (wallet) => {

    }

    ethWalletOnPress = (wallet,type) => {
        let _this = this;
        this.props.navigation.navigate('Set', {
            walletType: type,
            wallet: wallet,
            callback: function () {
                _this.refreshPage()
            }
        })
    }

    _changeWalletEmitter = (data) => {
        this.refreshPage()
    }

    renderComponent() {
        let _this = this;
        let itcWalletsView = [], ethWalletsView = [];
        this.state.itcWallets.forEach(function (wallet, index) {
            itcWalletsView.push(
                <Item key={index} wallet={wallet} onItemPressed={() => _this.ethWalletOnPress(wallet,'itc')} />
            )
        })

        this.state.ethWallets.forEach(function (wallet, index) {
            ethWalletsView.push(
                <Item key={index} wallet={wallet} onItemPressed={() => _this.ethWalletOnPress(wallet,'eth')} />
            )
        })
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation} text={I18n.t('settings.set')} />
                <ScrollView style={{ marginBottom: 12 }} showsVerticalScrollIndicator={false}>
                    <ItemHeader title={I18n.t('settings.itc_wallet')} icon={require('../../assets/set/itc_icon.png')}
                        isShowButton = {this.state.itcWallets.length >= 10 ?  false : true}
                        btnText={I18n.t('settings.create_itc_wallet')} onItemHeaderPressed={()=>this.createEthOrItcWallet('itc')}></ItemHeader>
                    {itcWalletsView}
                    <ItemHeader title={I18n.t('settings.eth_wallet')} icon={require('../../assets/set/eth_icon.png')}
                        isShowButton = {this.state.ethWallets.length >= 10 ?  false : true}
                        btnText={I18n.t('settings.create_eth_wallet')} onItemHeaderPressed={() => this.createEthOrItcWallet('eth')}></ItemHeader>
                    {ethWalletsView}
                </ScrollView>
            </View>
        );
    }
}


class ItemHeader extends PureComponent {

    static propTypes = {
        title: PropTypes.string.isRequired,
        icon: PropTypes.number.isRequired,
        btnText: PropTypes.string.isRequired,
        onItemHeaderPressed: PropTypes.func.isRequired,
        isShowButton: PropTypes.bool.isRequired,
    };

    static defaultProps = {
    }

    render() {

        return (
            <View style={styles.itemHeaderBox}>
                <Image style={styles.itemHeaderIcon} source={this.props.icon} resizeMode={'center'}></Image>
                <Text style={styles.itemHeaderTitle}>{this.props.title}</Text>

                {
                    this.props.isShowButton ?
                        <TouchableOpacity activeOpacity={0.6}
                            style={styles.itemHeaderTouchable}
                            onPress={this.props.onItemHeaderPressed}>
                            <Text style={styles.itemHeaderBtnTxt}>+{this.props.btnText}</Text>
                        </TouchableOpacity> : null
                }

            </View>
        )
    }
}


class Item extends PureComponent {

    static propTypes = {
        onItemPressed: PropTypes.func.isRequired,
        wallet: PropTypes.object.isRequired,
        isNeedLine: PropTypes.bool,
        isDisabled: PropTypes.bool,
    };

    static defaultProps = {
        isNeedLine: true,
        isDisabled: false,
    }

    onItemPressed = () => {
        let wallet = this.props.wallet
        this.props.onItemPressed(wallet)
    }
    render() {
        let wallet = this.props.wallet
        let address = wallet.address.substr(0, 8) + '...' + wallet.address.substr(34, 42)
        return (
            <View style={styles.itemBox}>
                <TouchableOpacity activeOpacity={0.6}
                    style={styles.itemTouchBox}
                    onPress={this.props.onItemPressed}
                    disabled={this.props.isDisabled}>

                    <View style={styles.itemContentView}>
                        <Text style={styles.itemName}>{wallet.name}</Text>
                        <Text style={styles.itemAddress}>{address}</Text>
                    </View>

                    <Image style={styles.itemNextIcon} source={require('../../assets/set/next.png')} resizeMode={'center'}></Image>
                </TouchableOpacity>
                {
                    this.props.isNeedLine ? <View style={styles.itemLine}></View> : null
                }
            </View>


        )
    }
}




const mapStateToProps = state => ({
    ethWalletList: state.Core.ethWalletList,
    itcWalletList: state.Core.itcWalletList,
});
const mapDispatchToProps = dispatch => ({
    setItcWalletList: (itcWalletList) => dispatch(Actions.setItcWalletList(itcWalletList)),
    setEthWalletList: (ethWalletList) => dispatch(Actions.setEthWalletList(ethWalletList)),
    setCurrentWallet: (wallet) => dispatch(Actions.setCurrentWallet(wallet)),
    setCreateWalletParams: (params) => dispatch(Actions.setCreateWalletParams(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(WalletListScreen)
