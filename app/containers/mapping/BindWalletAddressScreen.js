import React, { Component, PureComponent } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { BlueButtonBig } from '../../components/Button'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
import LinearGradient from 'react-native-linear-gradient'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    contentBox: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center'
    },
    topBox: {
        width: Layout.WINDOW_WIDTH * 0.9,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.bgGrayColor_ed,
        marginTop: 20,
    },
    topTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topTitle: {
        color: Colors.fontBlackColor_43,
        fontSize: 14,
        flex: 1,
    },
    topChangeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingLeft: 10,
    },
    changeText: {
        color: Colors.fontGrayColor_a0,
        fontSize: 14,
        paddingRight: 5
    },
    changeIcon: {
        width: 10,
        height: 10,
    },
    line: {
        height: 1,
        backgroundColor: Colors.bgGrayColor_ed,
    },
    topConetntBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    logoIcon: {
        width: 40,
        height: 40,
    },
    topContent: {
        marginLeft: 10,
    },
    topWalletName: {
        color: Colors.fontBlackColor_43,
        fontSize: 14,
    },
    topWalletAddress: {
        color: Colors.fontGrayColor_a0,
        fontSize: 12,
        marginTop: 2,
    },



    descBox: {
        width: Layout.WINDOW_WIDTH * 0.9,
        borderRadius: 5,
        backgroundColor: Colors.bg_blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    descText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        width: Layout.WINDOW_WIDTH * 0.85,
    },
    warnText: {
        color: 'white',
        fontSize: 12,
        width: Layout.WINDOW_WIDTH * 0.85,
        marginTop: 2,
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,
        width: Layout.WINDOW_WIDTH,
    },

    bottomBox: {
        width: Layout.WINDOW_WIDTH,
        height: Layout.DEVICE_IS_IPHONE_X() ? 100 : 80,
        backgroundColor: 'white',
        paddingBottom: Layout.DEVICE_IS_IPHONE_X() ? 20 : 0,
        alignItems: 'center'
    },

    item: {
        flexDirection: 'row',
        height: 66,
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 20,
    },
    itemConetntView: {
        flex: 1,
        justifyContent: 'center',
    },
    itemBindName: {
        fontSize: 15,
        color: Colors.fontGrayColor_a1,
    },
    itemName: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
    },
    itemAddress: {
        fontSize: 13,
        color: Colors.fontGrayColor_a1,
        marginTop: 2
    },
    itemCheckedImg: {
        width: 22,
        height: 22,
        marginRight: 10,
    },
    itemSeparator: {
        height: 1,
        width: Layout.WINDOW_WIDTH - 20,
        backgroundColor: Colors.bgGrayColor_ed,
        alignSelf: 'center',
    },
    emptyListContainer: {
        marginTop: 150,
        width: Layout.WINDOW_WIDTH * 0.9,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    emptyListIcon: {
        width: 94,
        height: 114,
        marginBottom: 23,
    },
    emptyListText: {
        fontSize: 16,
        width: Layout.WINDOW_WIDTH * 0.9,
        color: Colors.fontGrayColor_a,
        textAlign: 'center',
    },
    footer: {
        width: Layout.WINDOW_WIDTH * 0.8,
        alignItems: 'center',
        alignSelf: 'center'
    },
    footerTouch: {
        flex: 1,
        marginTop: 22,
    },
    footerImg: {
        width: Layout.WINDOW_WIDTH * 0.8,
        height: Layout.WINDOW_WIDTH * 0.8 / 268 * 44
    },
    footerTxt: {
        color: Colors.fontGrayColor_a,
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
    }
})

class BindWalletAddressScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            walletList: [],
            itcWallet: {
                name: 'wallet',
                address: '0xf6C9e322b688A434833dE530E4c23CFA4e579a7a'
            },
            isDisabled: true,
        }

        selectedWallet = null;
    }

    _initData() {

        let wallets = [];
        for (let i = 0; i < 10; i++) {
            let wallet = {
                name: 'wallet' + i,
                address: '0xf6C9e322b688A434833dE530E4c23CFA4e579a7a',
                isChecked: false,
                bind: i == 2 ? true : false
            }
            wallets.push(wallet)
        }
        this.setState({
            walletList: wallets
        })

    }
    nextBtn() {
        this.props.navigation.navigate('ItcMappingService')
    }

    //自定义分割线
    _renderItemSeparatorComponent = () => (
        <View style={styles.itemSeparator}>
        </View>
    )

    //空布局
    _renderEmptyView = () => (
        <View style={styles.emptyListContainer}>
            <Image style={styles.emptyListIcon} source={require('../../assets/common/no_icon.png')} resizeMode={'contain'} />
            <Text style={styles.emptyListText}>{I18n.t('settings.no_data')}</Text>
        </View>
    )

    _renderFooterView = () => {
        return (
            <Footer
                onFooterItem={this._onFooterItem.bind(this)}
            />
        )
    }
    _onFooterItem = () => {
        showToast('123')
    }


    _renderItem = (item) => {
        return (
            <Item
                item={item}
                onPressItem={this._onPressItem.bind(this, item)}
            />
        )
    }
    _onPressItem = (item) => {
        let choseWallet = item.item;
        this.selectedWallet = choseWallet


        let wallets = this.state.walletList;
        let newWallets = [];
        for (let i = 0; i < wallets.length; i++) {
            let wallet = wallets[i]
            if (wallet.isChecked) {
                wallet.isChecked = false
            }
            if (choseWallet.name == wallet.name) {
                wallet.isChecked = true
            }
            newWallets.push(wallet)
        }

        this.setState({
            walletList: newWallets,
            isDisabled: false
        })
    }

    _onChaneAddressPress = () => {
        let _this = this;
        this.props.navigation.navigate('ChangeBindAddress', {
            callback: function (data) {
                let itcWallet = data.itcWallet;
                _this.setState({
                    itcWallet: itcWallet
                })
            }
        })
    }

    _onBackPressed = () => {
        this.props.navigation.navigate('Home')
        return true;
    }

    backPressed() {
        this.props.navigation.navigate('Home')
    }

    renderComponent() {
        let itcWallet = this.state.itcWallet;
        let _address = itcWallet.address.substr(0, 8) + '...' + itcWallet.address.substr(34, 42)
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation}
                    text={I18n.t('mapping.binding_wallet_address')}
                    leftPress={() => this.backPressed()} />
                <View style={styles.contentBox}>
                    <View style={styles.topBox}>
                        <View style={styles.topTitleBox}>
                            <Text style={styles.topTitle}>{I18n.t('mapping.binding_wallet_address_title')}</Text>
                            <TouchableOpacity activeOpacity={0.6}
                                style={styles.topChangeBox}
                                onPress={this._onChaneAddressPress}>
                                <Text style={styles.changeText}>{I18n.t('mapping.change')}</Text>
                                <Image style={styles.changeIcon} source={require('../../assets/common/right_gray.png')} resizeMode={'center'} ></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.topConetntBox}>
                            <Image style={styles.logoIcon} source={require('../../assets/set/itc_icon.png')} resizeMode={'center'} ></Image>
                            <View style={styles.topContent}>
                                <Text style={styles.topWalletName} >{itcWallet.name}</Text>
                                <Text style={styles.topWalletAddress} >{_address}</Text>
                            </View>
                        </View>
                    </View>
                    <LinearGradient
                        style={styles.descBox}
                        colors={['#3fc1ff', '#66ceff']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}>
                        <Text style={styles.descText}>{I18n.t('mapping.binding_wallet_address_desc')}</Text>
                        <Text style={styles.warnText}>{I18n.t('mapping.binding_wallet_address_warn')}</Text>
                    </LinearGradient>
                    <FlatList
                        style={styles.listContainer}
                        ref={ref => this.flatList = ref}
                        data={this.state.walletList}
                        keyExtractor={(item, index) => index.toString()}//给定的item生成一个不重复的key
                        renderItem={this._renderItem}
                        ListEmptyComponent={this._renderEmptyView}
                        ListFooterComponent={this._renderFooterView}
                        ItemSeparatorComponent={this._renderItemSeparatorComponent}
                        getItemLayout={(data, index) => ({ length: 80, offset: (89 + 1) * index, index: index })}>

                    </FlatList>
                </View>


                <View style={styles.bottomBox}>
                    <BlueButtonBig
                        isDisabled={this.state.isDisabled}
                        onPress={() => this.nextBtn()}
                        text={I18n.t('mapping.next')}
                    />
                </View>
            </View>
        );
    }
}



class Item extends PureComponent {


    _onPress = () => {
        this.props.onPressItem(this.props.item.item)
    }
    render() {
        const { name, address, isChecked, bind } = this.props.item.item || {}
        let _name = bind ? name + I18n.t('mapping.bind') : name
        let _address = address.substr(0, 8) + '...' + address.substr(34, 42)
        let checkIcon = isChecked ? require('../../assets/launch/check_on.png') : require('../../assets/launch/check_off.png');
        return (
            <TouchableOpacity activeOpacity={0.6}
                {...this.props}
                style={styles.item}
                onPress={this._onPress}
                disabled={bind}>

                <View style={styles.itemConetntView}>
                    <Text style={bind ? styles.itemBindName : styles.itemName}>{_name}</Text>
                    <Text style={styles.itemAddress}>{_address}</Text>
                </View>
                {
                    bind ? <Image style={styles.itemCheckedImg} source={require('../../assets/mapping/bind_icon.png')} resizeMode={'center'} ></Image> :
                        <Image style={styles.itemCheckedImg} source={checkIcon} resizeMode={'center'} ></Image>
                }

            </TouchableOpacity>
        )
    }
}

class Footer extends PureComponent {
    render() {
        let img = require('../../assets/mapping/addBg.png')
        return (
            <View style={styles.footer}>
                <View style={styles.itemSeparator}></View>
                <TouchableOpacity activeOpacity={0.6}
                    style={styles.footerTouch}
                    onPress={this.props.onFooterItem}>
                    <Image style={styles.footerImg} source={img} resizeMode={'center'} ></Image>
                </TouchableOpacity>
                <Text style={styles.footerTxt}>{I18n.t('mapping.import_erc_wallet')}</Text>
            </View>

        )
    }
}


const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(BindWalletAddressScreen)


