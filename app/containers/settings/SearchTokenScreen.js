import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
    Image,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import NetworkManager from '../../utils/NetworkManager';
//import {CachedImage,ImageCache} from 'react-native-img-cache'
//import {Image as CacheImage,CacheManager} from "react-native-expo-image-cache";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    topBox: {
        backgroundColor: Colors.whiteBackgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        height: 46,
        marginTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
    },
    backBox: {
        height: 46,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    backIcon: {
        width: 22,
        height: 22,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: Colors.backgroundColor,
    },
    searchIcon: {
        width: 18,
        height: 18,
        marginLeft: 10,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: Colors.fontGrayColor_a0,
        fontSize: 13,
        height: 28,
        paddingVertical: 0,
    },
    cancelBox: {
        height: 30,
        paddingRight: 15,
        paddingLeft: 15,
        justifyContent: 'center',
    },
    cancelIcon: {
        width: 18,
        height: 18,
    },
    line: {
        backgroundColor: Colors.backgroundColor,
        height: 10,
        width: Layout.WINDOW_WIDTH,
    },
    listContainer: {
        flex: 1,
        width: Layout.WINDOW_WIDTH,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 72,
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
    },
    itemIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    itemCenterBox: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    itemName: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
    },
    itemFullName: {
        fontSize: 12,
        color: Colors.fontGrayColor_a,
    },
    itemAddress: {
        fontSize: 12,
        color: Colors.fontGrayColor_a,
    },
    itemRightBox: {
        height: 30,
        justifyContent: 'center',
    },

    itemAddOrRemoveBtn: {
        height: 30,
        lineHeight: 30,
        fontSize: 14,
        borderRadius: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    itemAddBtn: {
        borderColor: Colors.fontBlueColor,
        backgroundColor: Colors.fontBlueColor
    },
    itemRemoveBtn: {
        borderWidth: 1,
        borderColor: Colors.fontBlueColor,
        backgroundColor: 'transparent'
    },
    itemAddText: {
        color: 'white',
    },
    itemRemoveText: {
        color: Colors.fontBlueColor,
    },
    itemSeparator: {
        height: 2,
        width: Layout.WINDOW_WIDTH - 20,
        backgroundColor: Colors.backgroundColor,
    },
    emptyListContainer: {
        flex: 1,
        paddingTop: 80,
        //height:Layout.WINDOW_HEIGHT - Layout.DEVICE_IS_IPHONE_X() ? 112 : 88,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        //marginBottom:20,
    },
    emptyListBox: {
        alignItems: 'center'
    },
    emptyListIcon: {
        width: 94,
        height: 114,
        marginBottom: 23,
    },
    emptyListText: {
        fontSize: 16,
        width: Layout.WINDOW_WIDTH * 0.8,
        color: Colors.fontGrayColor_a,
        textAlign: 'center',
    },
    toFeedbackBtn: {
        height: 36,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 50,
        borderWidth: 1.5,
        borderRadius: 5,
        borderColor: Colors.fontBlueColor,
    },
    feedBackText: {
        fontSize: 16,
        color: Colors.fontBlueColor,
        lineHeight: 34,
    }

})

class SearchTokenScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            datas: [],//列表数据
            searchValue: '',
            isShowEmptyView: false,
        }

        this.searchText = '';
        this.allTokens = [];//所有的tokens
        this.searchTokens = [];//搜索到符合的条件的tokens
        this.addedTokens = [];//已经添加的Tokens
    }

    _initData() {
        //this._getAllTokens()   
        this.allTokens = this.props.allTokens
        let addTokens = [];
        this.props.tokens.forEach(function (token, index, b) {
            token.isAdded = true
            addTokens.push(token)

        })
        this.addedTokens = addTokens
    }

    _getAllTokens() {
        let params = {
            //'network': this.props.network,
            'network': 'main',
        }
        NetworkManager.getAllTokens(params).then((response) => {
            if (response.code === 200) {
                this.allTokens = response.data
            } else {
                console.log('getAllTokens err msg:', response.msg)
            }
        }).catch((err) => {
            console.log('getAllTokens err:', err)
        })

    }

    //自定义分割线
    _renderItemSeparatorComponent = () => (
        <View style={styles.itemSeparator}>
        </View>
    )



    //空布局
    _renderEmptyView = () => (
        this.state.isShowEmptyView ?
            <View style={styles.emptyListContainer}>

                <View style={styles.emptyListBox}>
                    <Image style={styles.emptyListIcon} source={require('../../assets/common/no_icon.png')} resizeMode={'contain'} />
                    <Text style={styles.emptyListText}>{I18n.t('settings.no_related_currency_found')}</Text>
                    <TouchableOpacity activeOpacity={0.6}
                        style={styles.toFeedbackBtn}
                        onPress={this._toFeedbackPress}>
                        <Text style={styles.feedBackText}>{I18n.t('settings.feedback')}</Text>
                    </TouchableOpacity>
                </View>
            </View> : null
    )

    _toFeedbackPress = () => {
        this.props.navigation.navigate('Feedback')
    }

    _renderItem = (item) => {
        return (
            <ItemView
                item={item}
                addOrRemoveItem={this._addOrRemoveItem.bind(this, item)}
            />
        )
    }

    _addOrRemoveItem = async (item) => {
        let token = item.item;
        let index = this.addedTokens.findIndex(addedToken => addedToken.address == token.address);
        let isAdd = token.isAdded;
        if (isAdd) {
            if (index >= 0) {
                //this.addedTokens.splice(index, 1,token)
            } else {
                //添加
                this.props.addToken(token)
                this.addedTokens.push(token)
            }
        } else {
            //移除
            this.props.removeToken(token.address)
            this.addedTokens.splice(index, 1)
        }
        this._saveData()
        this.refreshDatas();


    }

    _saveData = async () => {
        //this._showLoding()
        let tokens = this.addedTokens;
        let localTokens = [];
        tokens.forEach(function (value, index, b) {
            if (index != 0 && index != 1) {
                localTokens.push({
                    iconLarge: value.iconLarge,
                    symbol: value.symbol,
                    name: value.name,
                    decimal: parseInt(value.decimal, 10),
                    address: value.address,
                })
            }
        })

        let key = StorageKey.Tokens + this.props.wallet.address
        StorageManage.save(key, localTokens)
        setTimeout(() => {
            DeviceEventEmitter.emit('changeTokens', {});
        }, 0);

        //this._hideLoading()

    }


    _backPress = () => {
        this._goBack()
    }

    _onBackPressed = () => {
        this._goBack()
        return true;
    }

    _goBack = () => {
        let addedTokens = this.addedTokens;
        this.props.navigation.state.params.callback({ addedTokens: addedTokens });
        this.props.navigation.goBack()
    }

    _onChangeText(text) {
        this.searchText = text.trim();
        if (this.searchText == '') {
            this.searchTokens = [];
            this.setState({
                datas: [],
                isShowEmptyView: false,
            })
        } else {
            this._matchToken()
        }


    }

    _matchToken = () => {
        let _this = this
        this.searchTokens = [];
        let allTokens = this.allTokens;
        let searchContent = this.searchText;
        /*for(let i=0;i<allTokens.length;i++){
            let token = allTokens[i];
            let symbol  = token.symbol.trim().toLowerCase()
            if(symbol.indexOf(searchContent.trim().toLowerCase())>=0){
                this.searchTokens.push(token)
            }
        }*/

        allTokens.forEach(function (token, index) {
            let symbol = token.symbol.trim().toLowerCase()
            if (symbol.indexOf(searchContent.trim().toLowerCase()) >= 0) {
                _this.searchTokens.push(token)
            }
        })
        this.refreshDatas();
    }
    refreshDatas = () => {
        let datas = [];
        let addedTokens = this.addedTokens;
        this.searchTokens.forEach(function (data, index) {
            let isAdded = false;//是否已添加
            for (let i = 0; i < addedTokens.length; i++) {
                if (data.address == addedTokens[i].address) {
                    isAdded = true;
                    break;
                }
            }
            let obj = {
                iconLarge: data.iconLarge,
                symbol: data.symbol,
                name: data.name,
                decimal: data.decimal,
                address: data.address,
                isAdded: isAdded,
            }
            datas.push(obj)
        })
        this.setState({
            datas: datas,
            isShowEmptyView: true
        })
        this.searchText = '';
    }

    _cancelPress = () => {
        this.searchText = '';
        this.searchTokens = [];
        this.refs.searchInputRef.clear()
        this.setState({
            datas: [],
            isShowEmptyView: false,
            searchValue:''
            
        })
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <TouchableOpacity activeOpacity={0.6}
                        style={styles.backBox}
                        onPress={this._backPress}>
                        <Image style={styles.backIcon} source={require('../../assets/common/common_back.png')} resizeMode='contain' />
                    </TouchableOpacity>
                    <View style={styles.searchBox}>
                        <Image style={styles.searchIcon} source={require('../../assets/common/search.png')} resizeMode='contain' />
                        <TextInput style={styles.searchInput}
                            ref="searchInputRef"
                            //ref={textInput => this.TextInput = textInput}
                            autoFocus={true}
                            placeholderTextColor={Colors.fontGrayColor_a0}
                            placeholder={I18n.t('settings.input_token_name')}
                            onChangeText={(text) => {
                                this.setState({
                                    searchValue: text
                                })
                                this._onChangeText(text)
                            }}>{this.state.searchValue}</TextInput>
                        <TouchableOpacity activeOpacity={0.6}
                            style={styles.cancelBox}
                            onPress={this._cancelPress}>
                            <Image style={styles.cancelIcon} source={require('../../assets/common/delete.png')} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.line}></View>
                <FlatList
                    style={styles.listContainer}
                    ref={ref => this.flatList = ref}
                    data={this.state.datas}
                    keyExtractor={(item, index) => index.toString()}//给定的item生成一个不重复的key
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderEmptyView}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    getItemLayout={(datas, index) => ({ length: 72, offset: (72 + 2) * index, index: index })}>
                </FlatList>
            </View>
        );
    }
}


class ItemView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loadIconError: false,
            //isAdded : false,
        }
    }

    /*componentWillReceiveProps(nextProps){
        let nextIsAdded = nextProps.item.item.isAdded
        if(nextIsAdded == '' ||  nextIsAdded == undefined || !nextIsAdded){
            this.setState({
                isAdded : false,
            })
        }else{
            this.setState({
                isAdded : true,
            })
        }
    }*/

    _itemAddOrRemovePress = () => {
        let preTokenIsAdded = this.props.item.item.isAdded;
        this.props.item.item.isAdded = (preTokenIsAdded == undefined || preTokenIsAdded == false) ? this.props.item.item.isAdded = true : this.props.item.item.isAdded = false
        this.props.addOrRemoveItem(this.props.item.item)
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

    render() {
        const { iconLarge, symbol, name, address, isAdded } = this.props.item.item || {}
        let icon = this._getLogo(symbol, iconLarge);
        let _address = address.substr(0, 6) + '......' + address.substr(36, 42);
        let isHideBtn = symbol.toLowerCase() == 'eth' || symbol.toLowerCase() == 'itc' ? true : false
        let btnTxt = (isAdded == undefined || !isAdded) ? I18n.t('settings.add') : I18n.t('settings.remove');
        let fullName = name == '' || name == undefined ? '...' : name;

        return (
            <View style={styles.item}>
                <Image style={styles.itemIcon}
                    iosdefaultSource={require('../../assets/home/null.png')}
                    source={iconLarge == '' || this.state.loadIconError == true || symbol == 'ITC' ? icon : { uri: iconLarge }}
                    cache='force-cache'
                    resizeMode='contain'
                    onError={() => {
                        this.setState({
                            loadIconError: true,
                        })
                    }} />
                <View style={styles.itemCenterBox}>
                    <Text style={styles.itemName}>{symbol}</Text>
                    <Text style={styles.itemFullName}>{fullName}</Text>
                    <Text style={styles.itemAddress}>{_address}</Text>
                </View>
                {
                    isHideBtn ? null :
                        <TouchableOpacity activeOpacity={0.6}
                            style={[styles.itemRightBox, styles.itemAddOrRemoveBtn, isAdded ? styles.itemRemoveBtn : styles.itemAddBtn]}
                            onPress={this._itemAddOrRemovePress}>
                            <Text style={[isAdded ? styles.itemRemoveText : styles.itemAddText]}>{btnTxt}
                            </Text>
                        </TouchableOpacity>
                }
            </View>
        )
    }
}


const mapStateToProps = state => ({
    allTokens: state.Core.allTokens,
    tokens: state.Core.tokens,
    network: state.Core.network,
    wallet: state.Core.wallet,
});
const mapDispatchToProps = dispatch => ({
    addToken: (token) => dispatch(Actions.addToken(token)),
    removeToken: (token) => dispatch(Actions.removeToken(token)),
    setCurrentWallet: (wallet) => dispatch(Actions.setCurrentWallet(wallet)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchTokenScreen)

