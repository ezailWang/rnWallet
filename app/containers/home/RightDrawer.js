
import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, DeviceEventEmitter,ImageBackground } from 'react-native'
import { setItcWalletList, setEthWalletList, setCurrentWallet, setCreateWalletParams, setTransactionRecordList,loadTokenBalance } from '../../config/action/Actions'
import { store } from '../../config/store/ConfigureStore'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { I18n } from '../../config/language/i18n'
import StorageManage from '../../utils/StorageManage'
import { NavigationActions, DrawerActions } from 'react-navigation'
import PropTypes from 'prop-types';
import BaseComponent from '../base/BaseComponent'
import StatusBarComponent from '../../components/StatusBarComponent';
import { BlurView } from 'react-native-blur';
import Loading from '../../components/Loading';
import LayoutConstants from '../../config/LayoutConstants'
import { defaultTokens ,itcDefaultTokens} from '../../utils/Constants'

class RightDrawer extends BaseComponent {
    navigateToScreen = (route, params) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: params
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
        this._barStyle = 'light-content'
    }

    constructor(props) {
        super(props);
        this.state = {
            refreshPage: false,
        }

    }


    itcWalletOnPress = async (wallet) => {
        this.props.navigation.closeDrawer()
        StorageManage.save(StorageKey.User, wallet)
        store.dispatch(setCurrentWallet(wallet));

        store.dispatch(setTransactionRecordList([]));
        StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo)
        store.dispatch(loadTokenBalance(itcDefaultTokens))
        this.setState({
            refreshPage: !this.state.refreshPage
        })
        
        DeviceEventEmitter.emit('changeWallet', {openRightDrawer:false});
    }



    ethWalletOnPress = async (wallet) => {
        this.props.navigation.closeDrawer()
        StorageManage.save(StorageKey.User, wallet)
        store.dispatch(setCurrentWallet(wallet));

        store.dispatch(setTransactionRecordList([]));
        StorageManage.clearMapForkey(StorageKey.TransactionRecoderInfo)
        store.dispatch(loadTokenBalance(defaultTokens))
        this.setState({
            refreshPage: !this.state.refreshPage
        })
        
        DeviceEventEmitter.emit('changeWallet', {openRightDrawer:false});
    }

    createEthOrItcWallet = (walletType) => {
        let params = {
            walletType: walletType,
            from: 1
        }
        store.dispatch(setCreateWalletParams(params));
        this.props.navigation.navigate('CreateWallet')
    }

    

    render() {
        let { wallet, itcWalletList, ethWalletList } = store.getState().Core
        let currentWallet = wallet;

        //这个地方直接render，防止把其他页面的状态栏颜色改了
        let _this = this;
        if (this.props.navigation.state.isDrawerOpen) {
            this._barStyle = 'dark-content'
        } else {
            this._barStyle = 'light-content'
        }

        let itcWalletsView = [], ethWalletsView = [];
        itcWalletList.forEach(function (wallet, index) {
            let isSelected = wallet.address.toLowerCase() == currentWallet.address.toLowerCase()
            itcWalletsView.push(
                <Item key={index} wallet={wallet} isSelected={isSelected} itemOnPress={() => _this.itcWalletOnPress(wallet)} />
            )
        })

        ethWalletList.forEach(function (wallet, index) {
            let isSelected = wallet.address.toLowerCase() == currentWallet.address.toLowerCase()
            ethWalletsView.push(
                <Item key={index} wallet={wallet} isSelected={isSelected} itemOnPress={() => _this.ethWalletOnPress(wallet)} />
            )
        })

        
        
        return (
            <SafeAreaView style={styles.container}>
                <StatusBarComponent barStyle={this._barStyle} />

                <ScrollView style={{ paddingTop: 50, paddingBottom: 20, }} showsVerticalScrollIndicator={false}>
                    <ItemHeader icon={require('../../assets/set/itc_icon.png')} text={I18n.t('settings.itc_wallet')}></ItemHeader>
                    {itcWalletsView}
                    {itcWalletList.length >=10 ? null : <AddButton text={I18n.t('settings.create_itc_wallet')} addOnPress={() => this.createEthOrItcWallet('itc')}></AddButton>}
                       
                    <ItemHeader icon={require('../../assets/set/eth_icon.png')} text={I18n.t('settings.eth_wallet')}></ItemHeader>
                    {ethWalletsView}
                    {ethWalletList.length >= 10 ? null : <AddButton text={I18n.t('settings.create_eth_wallet')} addOnPress={() => this.createEthOrItcWallet('eth')}></AddButton>}
                    
                </ScrollView>
                {Platform.OS === 'ios' && this.state.showBlur && <BlurView
                    style={styles.blurStyle}
                    blurType='light'
                    blurAmount={10}
                />}
                {this.state.isShowLoading == undefined ? null : <Loading visible={this.state.isShowLoading} />}
            </SafeAreaView>
        )
    }
}




class Item extends PureComponent {

    static propTypes = {
        wallet: PropTypes.object.isRequired,
        itemOnPress: PropTypes.func.isRequired,
        isSelected: PropTypes.bool,
        isNeedLine: PropTypes.bool,
        itemStyle: PropTypes.object,
    };

    static defaultProps = {
        isSelected: false,
        isNeedLine: false,
    }

    itemOnPress = () => {
        let wallet = this.props.wallet;
        this.props.itemOnPress(wallet)
    }

    render() {
        let wallet = this.props.wallet;
        let isSelected = this.props.isSelected;
        return (
            <View style={[styles.itemBox, this.props.itemStyle]}>
                <TouchableOpacity activeOpacity={0.6}
                    style={styles.itemTouchable}
                    onPress={this.itemOnPress}
                    disabled={isSelected}>
                    <View style={[styles.itemCircle, isSelected ? styles.itemBlueCircle : styles.itemGrayCircle]}></View>
                    <Text style={[styles.itemText, isSelected ? styles.itemBlueText : styles.itemGrayText]}>{wallet.name}</Text>
                </TouchableOpacity>

                {
                    this.props.isNeedLine ? <View style={styles.itemLine}></View> : null
                }

            </View>

        )
    }
}

class ItemHeader extends PureComponent {

    static propTypes = {
        icon: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
    };

    render() {
        let icon = this.props.icon
        return (
            <View style={styles.itemHeaderBox}>
                <View activeOpacity={0.6}
                    style={styles.itemHeaderView}>
                    <Image style={styles.itemHeaderIcon} source={icon} resizeMode={'center'} />
                    <Text style={styles.itemHeaderText}>{this.props.text}</Text>
                </View>
                <View style={styles.itemHeaderLine}></View>
            </View>

        )
    }
}


class AddButton extends PureComponent {

    static propTypes = {
        text: PropTypes.string.isRequired,
        addOnPress: PropTypes.func.isRequired,
    };

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.addButtonBox}
                onPress={this.props.addOnPress}>
                <ImageBackground style={styles.addButtonBg} source={require('../../assets/common/add_bg.png')} resizeMode={'contain'}>
                        <Image style={styles.addIcon} source={require('../../assets/common/add_icon.png')} resizeMode={'contain'} />
                        <Text style={styles.addButtonText}>{this.props.text}</Text>
                </ImageBackground>
                {/*<Image style={styles.addImage} source={addBg} resizeMode={'center'} />*/}
            </TouchableOpacity>

        )
    }
}


const styles = StyleSheet.create({
    blurStyle: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
        height: LayoutConstants.WINDOW_HEIGHT,
        zIndex: 1000,
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    addButtonBox: {
        width: 195,
        height: 40,
        alignSelf: 'center',
        marginTop:20,
        //borderStyle:'dashed',
    },
    addButtonBg:{
        width: 195,
        height: 40,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },
    addIcon:{
        width:15,
        height:15,
    },
    addButtonText:{
        lineHeight:38,
        textAlign:'center',
        color:Colors.fontGrayColor_a,
        fontSize:14,
        marginLeft:10,
    },


    itemHeaderBox: {
        height: 40,
        marginTop: 20,
    },
    itemHeaderView: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingLeft: 20,
    },
    itemHeaderIcon: {
        height: 30,
        width: 30,
    },
    itemHeaderText: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
        marginLeft: 10,
    },
    itemHeaderLine: {
        height: 1,
        backgroundColor: Colors.bgGrayColor,
    },
    itemBox: {
        height: 36,
    },
    itemTouchable: {
        flexDirection: 'row',
        height: 36,
        alignItems: 'center',
        paddingLeft: 32,
        paddingRight: 32,
    },
    itemCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    itemGrayCircle: {
        backgroundColor: Colors.fontGrayColor,
    },
    itemBlueCircle: {
        backgroundColor: Colors.fontBlueColor,
    },
    itemText: {
        fontSize: 13,
        marginLeft: 15,
    },
    itemGrayText: {
        color: Colors.fontGrayColor_a1,
    },
    itemBlueText: {
        color: Colors.fontBlueColor,
    },
    itemLine: {
        height: 1,
        backgroundColor: Colors.bgGrayColor,
    }



})

RightDrawer.prototypes = {
    navigation: PropTypes.object
}


export default RightDrawer