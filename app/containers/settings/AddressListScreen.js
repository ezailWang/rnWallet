import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import { addressToName } from '../../utils/CommonUtil'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
    },

    headerContainer: {
        flexDirection: 'row',
        width: Layout.WINDOW_WIDTH,
        height: Layout.NAVIGATION_HEIGHT(),
        backgroundColor: Colors.whiteBackgroundColor,
        //zIndex: 10,
        paddingTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24
    },
    headerButtonBox: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
    },
    headerTitleBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    headerIcon: {
        height: 25,
        width: 25,
    },
    headerTitleLeft: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        height: 30,
        paddingTop: 5,
        paddingBottom: 5,
        width: 110,

    },
    headerTitleRight: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        height: 30,
        paddingTop: 5,
        paddingBottom: 5,
        width: 110,
    },
    headerTitleChecked: {
        backgroundColor: Colors.fontBlueColor,
    },
    headerTitleUnChecked: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.fontBlueColor,
    },
    headerTitleText: {
        //fontSize: I18n.locale == 'zh' ? 15 : 12,
        height: 20,
        lineHeight: 20,
        textAlign: 'center',
    },
    headerTitleCheckedText: {
        color: 'white',
    },
    headerTitleUnCheckedText: {
        color: Colors.fontBlueColor,
    },


    listContainer: {
        flex: 1,
        width: Layout.WINDOW_WIDTH,
        // alignItems:'center',
        paddingTop: 12,
        paddingBottom: 15,
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
    item: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15
    },
    itemCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 12
    },
    itemLetter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    itemRightView: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
        marginBottom: 2,
    },
    itemAddress: {
        fontSize: 12,
        color: Colors.fontGrayColor_a1,
    },
    itemSeparator: {
        height: 10,
        backgroundColor: 'transparent',
    },
    rAItem: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 30,
        paddingRight: 30,
    },
    rAItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    rAItemAddress: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
        marginBottom: 2,
    },
    rAItemTime: {
        fontSize: 12,
        color: Colors.fontGrayColor_a1,
    },
    rAItemSeparator: {
        height: 1,
        backgroundColor: 'transparent',
        marginLeft: 15,
        marginRight: 15,
    },
})

class AddressListScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            contactDatas: [],
            recentAddressDatas: [],
            isCheckedContactList: true,
        }


        this.recentAddressList = [];
        this.from = undefined;//从哪个页面跳转过来的
    }

    async _initData() {
        this.from = this.props.navigation.state.params.from;

        let recentTransferAddress= await StorageManage.loadAllDataForKey(StorageKey.RecentTransferAddress);
        this.recentAddressList = recentTransferAddress.reverse()
        this.refreshData()
    }

    refreshData(){
        let contactData = this.props.contactList;
        this.recentAddressList.forEach(function (recentAddress, index, b) {
            let address = recentAddress.address;
            let isMathAddressName = '';
            for(let i=0;i<contactData.length;i++){
                if(address.toUpperCase() == contactData[i].address.toUpperCase()){
                    isMathAddressName = contactData[i].name;
                    break;
                }
            }
            recentAddress.name = isMathAddressName;
        })

        this.setState({
            contactDatas: contactData,
            recentAddressDatas: this.recentAddressList
        })
    }

    
    loadContactData() {
        this.refreshData();
    }

    _onContactPressItem = (item) => {
        var _this = this;
        //this.props.navigation.navigate('',{contactInfo:item.item,index:item.index});
        if (this.from == 'transaction') {
            //返回转账页面
            this.props.navigation.state.params.callback({ toAddress: item.item.address });
            this.props.navigation.goBack()
        } else {
            //跳转到联系人详情页
            this.props.navigation.navigate('ContactInfo', {
                contactInfo: item.item,
                index: item.index,
                callback: function (data) {
                    _this.loadContactData()
                }
            })
        }
    }

    _onRecentAddressItem = (item) => {
        let _this = this;
        if (this.from == 'transaction') {
            //返回转账页面
            this.props.navigation.state.params.callback({ toAddress: item.item.address });
            this.props.navigation.goBack()
        }
    }


    _renderItemContact = (item) => {
        return (
            <ContactItem
                item={item}
                onPressItem={this._onContactPressItem.bind(this, item)}
            />
        )
    }


    _renderItemRecentAddress = (item) => {
        return (
            <RecentAddressItem
                item={item}
                onPressItem={this._onRecentAddressItem.bind(this, item)}
            />
        )
    }

    addContact = async () => {
        let _this = this;
        this.props.navigation.navigate('CreateContact', {
            callback: function (data) {
                _this.loadContactData();
            }
        })
    }



    _checkedContact = () => {
        this.setState({
            isCheckedContactList: true
        })

    }

    _checkedRecentTransfersAddress = () => {
        this.setState({
            isCheckedContactList: false
        })
    }



    //自定义分割线
    _renderItemSeparatorComponent = (isContactList) => (
        <View style={isContactList ? styles.itemSeparator : styles.rAItemSeparator}>
        </View>
    )

    //空布局
    _renderEmptyView = (isContactList) => (
        <View style={styles.emptyListContainer}>
            <Image style={styles.emptyListIcon} source={require('../../assets/common/no_icon.png')} resizeMode={'contain'} />
            <Text style={styles.emptyListText}>{isContactList ? I18n.t('settings.no_contact') : I18n.t('settings.no_data')}</Text>
        </View>
    )

    renderComponent() {
        let isCheckedContactList = this.state.isCheckedContactList;
        let headerTitleFontSize = I18n.locale == 'zh' ? 15 : 12;
        return (
            <View style={styles.container}>
                <View style={[styles.headerContainer]}>
                    <TouchableOpacity style={[styles.headerButtonBox]} onPress={() => { this.props.navigation.goBack() }}>
                        <Image style={styles.headerIcon}
                            resizeMode={'center'}
                            source={require('../../assets/common/common_back.png')}>
                        </Image>
                    </TouchableOpacity>

                    <View style={[styles.headerTitleBox]}>
                        <TouchableOpacity style={[styles.headerTitleLeft, isCheckedContactList ? styles.headerTitleChecked : styles.headerTitleUnChecked]}
                            onPress={this._checkedContact}
                        >
                            <Text style={[styles.headerTitleText, { fontSize: headerTitleFontSize }, isCheckedContactList ? styles.headerTitleCheckedText : styles.headerTitleUnCheckedText]}>{I18n.t('settings.address_book')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.headerTitleRight, isCheckedContactList ? styles.headerTitleUnChecked : styles.headerTitleChecked]}
                            onPress={this._checkedRecentTransfersAddress}
                        >
                            <Text style={[styles.headerTitleText, { fontSize: headerTitleFontSize }, isCheckedContactList ? styles.headerTitleUnCheckedText : styles.headerTitleCheckedText]}>{I18n.t('settings.recent_transfers')}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.headerButtonBox]} onPress={isCheckedContactList ? this.addContact : () => { }}>
                        {isCheckedContactList ?
                            <Image style={styles.headerIcon}
                                resizeMode={'center'}
                                source={require('../../assets/set/add.png')}>
                            </Image> : null}
                    </TouchableOpacity>
                </View>
                {isCheckedContactList ?
                    <FlatList
                        style={styles.listContainer}
                        ref='contactList'
                        data={this.state.contactDatas}
                        keyExtractor={(item, index) => index.toString()}//给定的item生成一个不重复的key
                        renderItem={this._renderItemContact}
                        ListEmptyComponent={() => this._renderEmptyView(true)}
                        ItemSeparatorComponent={() => this._renderItemSeparatorComponent(true)}
                        getItemLayout={(data, index) => ({ length: 60, offset: (60 + 10) * index, index: index })}>

                    </FlatList> :
                    <FlatList
                        style={styles.listContainer}
                        ref='recentAddressList'
                        data={this.state.recentAddressDatas}
                        keyExtractor={(item, index) => index.toString()}//给定的item生成一个不重复的key
                        renderItem={this._renderItemRecentAddress}
                        ListEmptyComponent={() => this._renderEmptyView(false)}
                        ItemSeparatorComponent={() => this._renderItemSeparatorComponent(false)}
                        getItemLayout={(data, index) => ({ length: 60, offset: (60 + 1) * index, index: index })}>

                    </FlatList>
                }
            </View>
        );
    }
}


class ContactItem extends PureComponent {


    _onPress = () => {
        this.props.onPressItem(this.props.item.item)
    }

    render() {
        const { name, address, remark } = this.props.item.item || {}
        let letter = name.substr(0, 1);
        let _letter = letter + '';
        if ((letter >= 'a' && letter <= 'z')) {
            _letter = letter.toUpperCase();
        } else {
            _letter = letter;
        }
        let _address = address.substr(0, 8) + '...' + address.substr(34, 42)
        return (
            <TouchableOpacity activeOpacity={0.6}
                {...this.props}
                style={styles.item}
                onPress={this._onPress}>
                <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.itemCircle}>
                    <Text style={styles.itemLetter}>{_letter}</Text>
                </LinearGradient>

                <View style={styles.itemRightView}>
                    <Text style={styles.itemName}>{name}</Text>
                    <Text style={styles.itemAddress}>{_address}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class RecentAddressItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loadIconError: false,
        }
    }

    _getLogo = (symbol, iconLarge) => {
        if (symbol == 'ITC') {
            return require('../../assets/home/ITC.png');
        }
        if (iconLarge == '') {
            if (symbol == 'ETH') {
                return require('../../assets/home/ETH.png');
            } else if (symbol == 'ITC') {
                return require('../../assets/home/ITC.png');
            } else {
                return require('../../assets/home/null.png');
            }
        } else {
            if (this.state.loadIconError) {
                return require('../../assets/home/null.png');
            }
        }
    }

    _onPress = () => {
        this.props.onPressItem(this.props.item.item)
    }

    render() {
        const { address, symbol, time, iconLarge ,name} = this.props.item.item || {}
        let icon = this._getLogo(symbol, iconLarge);
        let _name = name == '' ? '' : ' ('+name.trim()+')'
        let _address = address.substr(0, 8) + '...' + address.substr(34, 42) +  _name;
        let _time = time + ' +0800'
        return (
            <TouchableOpacity activeOpacity={0.6}
                style={styles.rAItem}
                onPress={this._onPress}>
                <Image style={styles.rAItemIcon}
                    iosdefaultSource={require('../../assets/home/null.png')}
                    source={iconLarge == '' || this.state.loadIconError == true || symbol == 'ITC' ? icon : { uri: iconLarge }}
                    cache='force-cache'
                    resizeMode='contain'
                    onError={() => {
                        this.setState({
                            loadIconError: true,
                        })
                    }} />

                <View style={styles.itemRightView}>
                    <Text style={styles.rAItemAddress}>{_address}</Text>
                    <Text style={styles.rAItemTime}>{_time}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}


const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddressListScreen)
