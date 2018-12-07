import React, { Component,PureComponent } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
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
import NetworkManager from '../../utils/NetworkManager';
import { CommonTextInput } from '../../components/TextInputComponent'
import RemindDialog from '../../components/RemindDialog'
import BaseComponent from '../base/BaseComponent';
import LinearGradient from 'react-native-linear-gradient'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentBox: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems:'center'
    },
    contentDescBox: {
        width: Layout.WINDOW_WIDTH * 0.9,
        height: 60,
        borderRadius: 5,
        backgroundColor: Colors.bg_blue,
        justifyContent: 'center',
        marginTop: 20,
       // marginBottom: 20,
    },
    contentDescText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        paddingLeft:20,
        paddingRight:20,
        alignSelf:'center'
    },
    warnText:{
        color:'red',
        fontSize:14,
        width: Layout.WINDOW_WIDTH * 0.85,
        marginTop:10,
        marginBottom:10,
    },
    listContainer: {
        flex: 1,
        width:Layout.WINDOW_WIDTH,
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
        height: 80,
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 20,
    },
    itemConetntView: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
    },
    itemAddress: {
        fontSize: 13,
        color: Colors.fontGrayColor_a1,
        marginTop:2
    },
    itemCheckedImg: {
        width: 22,
        height: 22,
        marginRight: 10,
    },
    itemSeparator: {
        height: 1,
        width:Layout.WINDOW_WIDTH-20,
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
        alignSelf:'center'
    },
    footerTouch: {
        flex: 1,
        marginTop:22,
    },
    footerImg: {
        width: Layout.WINDOW_WIDTH * 0.8,
        height: Layout.WINDOW_WIDTH * 0.8 / 268 * 44
    },
    footerTxt: {
        color: Colors.fontGrayColor_a,
        fontSize: 15,
        marginTop:10,
        marginBottom:10,
    }
})

class BindReplaceAddressErcScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            walletList: [],
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
                isChecked: false
            }
            wallets.push(wallet)
        }
        this.setState({
            walletList: wallets
        })

    }
    nextBtn() {
        console.log('L__________')
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
    _onFooterItem =  () => {
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
        let choseWallet  = item.item;
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

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation}
                    text={I18n.t('mapping.binding_replace_address')} />
                <View style={styles.contentBox}>
                    <LinearGradient
                        style={styles.contentDescBox}
                        colors={['#3fc1ff', '#66ceff']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}>
                        <Text style={styles.contentDescText}>{I18n.t('mapping.binding_replace_address_erc_desc')}</Text>
                    </LinearGradient>
                    <Text style={styles.warnText}>{I18n.t('mapping.binding_replace_address_erc_warn')}</Text>
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
                        isDisabled={!this.state.isDisabled}
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
        const { name, address, isChecked } = this.props.item.item || {}
        let _address = address.substr(0, 8) + '...' + address.substr(34, 42)

        let checkIcon = isChecked ? require('../../assets/launch/check_on.png') : require('../../assets/launch/check_off.png');
        return (
            <TouchableOpacity activeOpacity={0.6}
                {...this.props}
                style={styles.item}
                onPress={this._onPress}>

                <View style={styles.itemConetntView}>
                    <Text style={styles.itemName}>{name}</Text>
                    <Text style={styles.itemAddress}>{_address}</Text>
                </View>
                <Image style={styles.itemCheckedImg} source={checkIcon} resizeMode={'center'} ></Image>
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
export default connect(mapStateToProps, mapDispatchToProps)(BindReplaceAddressErcScreen)


