import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Text,
    Image,
    Linking
} from 'react-native';
import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import { showToast } from '../../utils/Toast';
import { addressToName } from '../../utils/CommonUtil'
import NetworkManager from '../../utils/NetworkManager'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        width: Layout.WINDOW_WIDTH,
        marginTop: 12,
        backgroundColor: 'white'
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
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 25,
        paddingRight: 25,
    },
    itemContentBox: {
        flex: 1,
    },
    itemTitle: {
        color: Colors.fontBlackColor_43,
        fontSize: 16,
        marginBottom: 8,
    },
    itemAddress: {
        color: Colors.fontGrayColor_a1,
        fontSize: 13,
    },
    itemTime: {
        color: Colors.fontGrayColor_a1,
        fontSize: 13,
    },
    itemSeparator: {
        height: 1,
        // backgroundColor:'transparent',
        backgroundColor: Colors.bgGrayColor_ed,
        marginLeft: 15,
        marginRight: 15,
    },
    listFooter: {
        width: Layout.WINDOW_WIDTH * 0.9,
        height: 40,
        alignSelf: 'center',
    },
    listFooterText: {
        height: 40,
        lineHeight: 40,
        fontSize: 14,
        width: Layout.WINDOW_WIDTH * 0.9,
        color: Colors.fontGrayColor_a,
        textAlign: 'center',
    }
})

class MessageCenterScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            isRefreshing: false,
            isLoadMoreing: false,
        }

        this.page = 1;
        this.pageCount = 30;//每页显示的10条数据
        this.haveNextPage = true;//是否还有下一页
        this.callBackIsNeedRefresh = true;

        this.userToken = {}
    }

    async _initData() {
        this.userToken = await StorageManage.load(StorageKey.UserToken)
        if (!this.userToken || this.userToken === null) {
            return;
        }
        this.loadData(true)
    }

    async loadData(isShowLoading) {
        if (isShowLoading) {
            this._showLoding()
        }
        let params = {
            'userToken': this.userToken['userToken'],
            'page': this.page,
            'size': this.pageCount,
        }
        NetworkManager.getMessageList(params)
            .then(response => {
                if (response.code === 200) {
                    this.haveNextPage = response.data.haveNextPage;
                    let list = response.data.messages;
                    let meaasges = [];
                    list.forEach(function (data, index) {
                        let message = {}
                        message.msgId = data.msgId;
                        message.messageType = data.messageType;//(消息类型)  1-消息通知、2-公告
                        message.readStatus = data.readStatus;//（消息状态） 1-未读、2-已读
                        message.updateTime = data.updateTime;
                        message.deviceToken = data.deviceToken;
                        if (data.messageType == 1) {
                            message.hashId = data.hashId;
                            message.transactionType = data.transactionType;//（交易类型） 1-收款、2-转账
                            message.status = data.status;//1-成功、2失败
                            message.symbol = data.symbol;
                            message.fromAddress = data.fromAddress;
                            message.toAddress = data.toAddress;
                            message.transactionValue = data.transactionValue;
                        } else if (data.messageType == 2) {
                            message.alertTitle = data.alertTitle;
                            message.alertSubTitle = data.alertSubTitle;
                            message.contentUrl = data.contentUrl;
                            message.sender = data.sender;
                        }
                        meaasges.push(message)
                    })
                    if (this.page === 1) {
                        this.setState({
                            data: meaasges
                        })
                    } else {
                        this.setState({
                            data: this.state.data.concat(meaasges)
                        })
                    }
                } else {
                    console.log('getMessageList err msg:', response.msg)
                }
                this._hideLoading()
            }).catch(err => {
                console.log('getMessageList err:', err)
                this._hideLoading()
            })

    }



    _onRefresh = (isShowLoading) => {
        let showLoading = isShowLoading == undefined || isShowLoading ? true : false
        if (!this.userToken || this.userToken === null) {
            return;
        }
        if (!this.state.isRefreshing) {
            this.setState({
                isRefreshing: true
            })

            this.page = 1;
            this.loadData(showLoading)

            this.setState({
                isRefreshing: false
            })
        }
    }

    _onLoadMore = () => {
        if (!this.userToken || this.userToken === null) {
            return;
        }
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMoreing && this.haveNextPage) {
            this.setState({
                isLoadMoreing: true
            })
            this.page = this.page + 1
            this.loadData(true)


            this.setState({
                isLoadMoreing: true
            })
        }
    }

    _onPressItem = (item) => {
        if (item.item.readStatus == 1) {
            this.callBackIsNeedRefresh = true;
            this._readMessage(item.item.msgId)
        } else {
            this.callBackIsNeedRefresh = false;
        }

        if (item.item.messageType == 1) {
            this._showLoding()
            this.transactionNotification(item.item)
        } else if (item.item.messageType == 2) {
            this.announcement(item.item)
        }
    }

    _readMessage = async (msgId) => {
        if (!this.userToken || this.userToken === null) {
            return;
        }
        let params = {
            'userToken': this.userToken['userToken'],
            'msgId': msgId,
        }
        NetworkManager.readMessage(params)
            .then((response) => {
                if (response.code === 200) {
                    this._onRefresh(false)
                } else {
                }
            })
            .catch((err) => {
                //console.log('_readMessage err:', err)
            })
    }

    //交易通知
    async transactionNotification(item) {
        let itemSymbol = item.symbol.toUpperCase()
        let isHaveToken = this.routeToTransactionRecoder(item)
        if (!isHaveToken) {
            let allTokens = this.props.allTokens
            let isMatchToken = false;
            for (let i = 0; i < allTokens.length; i++) {
                let token = allTokens[i];
                if (token.symbol.toUpperCase() == itemSymbol) {
                    isMatchToken = true;
                    let tokenInfo = {
                        iconLarge: token.iconLarge,
                        symbol: token.symbol,
                        name: token.name,
                        decimal: token.decimal,
                        address: token.address,
                    }
                    await this.saveTokenToStorage(tokenInfo)
                    await NetworkManager.loadTokenList()
                    break;
                }
            }
            if (isMatchToken) {
                this.routeToTransactionRecoder(item)
            } else {
                this._hideLoading()
            }

        }
    }

    async routeToTransactionRecoder(item) {
        let _this = this;
        let itemSymbol = item.symbol.toUpperCase()
        let tokens = this.props.tokens;
        let isHaveToken = false;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            if (token.symbol.toUpperCase() == itemSymbol) {
                isHaveToken = true;
                let balanceInfo = {
                    amount: token.balance,
                    price: token.price,
                    symbol: token.symbol,
                    address: token.address,
                    decimal: token.decimal
                }
                this.props.setCoinBalance(balanceInfo);

                let transation = await NetworkManager.getTransaction(item.hashId)
                let status = 2;
                if (transation.isError == undefined || transation.isError == false) {
                    status = 0;
                }
                if (status == 0) {
                    let currentBlockNumber = await NetworkManager.getCurrentBlockNumber();
                    if (currentBlockNumber - transation.blockNumber < 12) {
                        status = 1
                    }
                }

                let address = transation.to.toLowerCase() == this.props.walletAddress.toLowerCase() ? transation.from : transation.to
                let transactionDetail = {
                    amount: parseFloat(item.transactionValue),
                    transactionType: item.symbol.toUpperCase(),
                    tranStatus: status,
                    fromAddress: transation.from,
                    toAddress: transation.to,
                    gasPrice: '',
                    transactionHash: transation.hash,
                    blockNumber: transation.blockNumber,
                    transactionTime: item.updateTime + " +0800",
                    remark: I18n.t('transaction.no'),
                    name: addressToName(address, this.props.contactList)
                };
                this._hideLoading()
                this.props.setTransactionDetailParams(transactionDetail);
                this.props.navigation.navigate('TransactionDetail');

                break;
            }
        }
        return isHaveToken;
    }


    //公告
    announcement(item) {
        let _this = this;
        this.props.navigation.navigate('MessageWebView', {
            url: item.contentUrl,
            title: item.alertTitle,
            callback: function (data) {

            }
        })
    }

    //read all
    _readAll = async () => {
        if (!this.userToken || this.userToken === null) {
            return;
        }
        let params = {
            'userToken': this.userToken['userToken'],
        }
        NetworkManager.readAllMessage(params)
            .then((response) => {
                if (response.code === 200) {
                    this._onRefresh(false)
                } else {
                    //console.log('readAllMessage err msg:', response.msg)
                }
            })
            .catch((err) => {
                //console.log('readAllMessage err:', err)
            })
    }

    async saveTokenToStorage(token) {
        let localTokens = await StorageManage.load(StorageKey.Tokens)
        if (!localTokens) {
            localTokens = []
        }

        localTokens.push({
            iconLarge: token.iconLarge,
            symbol: token.symbol,
            name: token.name,
            decimal: parseInt(token.decimal, 10),
            address: token.address,
        })
        StorageManage.save(StorageKey.Tokens, localTokens)
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
            <Text style={styles.emptyListText}>{I18n.t('settings.no_message')}</Text>
        </View>
    )

    _listFooterView = () => (
        this.haveNextPage ? null :
            <View style={styles.listFooter}>
                <Text style={styles.listFooterText}>{I18n.t('settings.no_more_data')}</Text>
            </View>
    )

    _renderItem = (item) => {
        return (
            <Item
                item={item}
                onPressItem={this._onPressItem.bind(this, item)}
            />
        )
    }


    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation}
                    text={I18n.t('settings.message_center')}
                    rightPress={() => this._readAll()}
                    rightText={I18n.t('settings.read_all')} />
                <FlatList
                    style={styles.listContainer}
                    ref={ref => this.flatList = ref}
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}//给定的item生成一个不重复的key
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderEmptyView}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    getItemLayout={(data, index) => ({ length: 80, offset: (80 + 1) * index, index: index })}
                    refreshControl={<RefreshControl
                        onRefresh={this._onRefresh} //下拉刷新
                        refreshing={this.state.isRefreshing}
                        colors={[Colors.themeColor]}
                        tintColor={Colors.whiteBackgroundColor}
                    />}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._onLoadMore} //加载更多
                //ListFooterComponent={this._listFooterView}
                >
                </FlatList>
            </View>
        );
    }
}


class Item extends PureComponent {

    _onPress = () => {
        this.props.onPressItem(this.props.item.item)
    }

    render() {
        const { messageType, updateTime, readStatus } = this.props.item.item || {}
        let title = ''
        let content = '';

        if (messageType == 1) {
            const { transactionType, status, symbol, fromAddress, toAddress, transactionValue } = this.props.item.item || {}
            let title1 = transactionType == 1 ? I18n.t('settings.receipt_notice') : I18n.t('settings.transfer_notice');
            let title2 = transactionValue + symbol.toUpperCase() + ' ';
            let title3 = transactionType == 2 ? (status == 1 ? I18n.t('settings.successful_transfer') : I18n.t('settings.transfer_failed')) : I18n.t('settings.successful_payment')
            title = title1 + title2 + title3;

            let address = transactionType == 1 ? fromAddress : toAddress;
            let content1 = transactionType == 1 ? I18n.t('settings.sender') : I18n.t('settings.receiver');
            content = content1 + address.substr(0, 8) + '......' + address.substr(34, 42)
        } else if (messageType == 2) {
            const { alertTitle, alertSubTitle, sender } = this.props.item.item || {}
            title = I18n.t('settings.announcement') + alertSubTitle;
            content = sender
        }


        return (
            <TouchableOpacity activeOpacity={0.6}
                style={[styles.item, { backgroundColor: readStatus == 2 ? 'white' : Colors.bg_blue }]}
                onPress={this._onPress}>

                <View style={styles.itemContentBox}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <Text style={styles.itemAddress}>{content}</Text>
                    <Text style={styles.itemTime}>{updateTime}</Text>
                </View>

            </TouchableOpacity>
        )
    }
}


const mapStateToProps = state => ({
    allTokens: state.Core.allTokens,
    tokens: state.Core.tokens,
    contactList: state.Core.contactList,
    walletAddress: state.Core.walletAddress,
});
const mapDispatchToProps = dispatch => ({
    addToken: (token) => dispatch(Actions.addToken(token)),
    setCoinBalance: (balanceInfo) => dispatch(Actions.setCoinBalance(balanceInfo)),
    setTransactionDetailParams: (transactionDetail) => dispatch(Actions.setTransactionDetailParams(transactionDetail)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MessageCenterScreen)

