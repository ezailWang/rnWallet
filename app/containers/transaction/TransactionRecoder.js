import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    RefreshControl,
    BackHandler,
    Animated
} from 'react-native'
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { store } from '../../config/store/ConfigureStore'
import { setTransactionDetailParams, setWalletTransferParams, setTransactionRecoders, setCoinBalance, setTransactionRecordList } from "../../config/action/Actions";
import NetworkManager from '../../utils/NetworkManager'
import StatusBarComponent from '../../components/StatusBarComponent'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import LinearGradient from 'react-native-linear-gradient'
import { addressToName } from '../../utils/CommonUtil'
import { showToast } from '../../utils/Toast';
import { __await } from 'tslib';
import { identity } from 'rxjs';
import LayoutConstants from '../../config/LayoutConstants';
const tokenIcon = {
    'ETH': require('../../assets/transfer/ethIcon.png'),
    'ITC': require('../../assets/transfer/itcIcon.png'),
    'MANA': require('../../assets/transfer/manaIcon.png'),
    'DPY': require('../../assets/transfer/dpyIcon.png'),
}

let timer;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    flatList: {
        flex: 1,
        //marginTop:7,
    },
    bottomBtnView: {
        flexDirection: "row",
        height: 45,
        backgroundColor: Colors.whiteBackgroundColor,
        marginBottom: 0,
        // justifyContent:"space-around",
        alignItems: "center",
    },
    header: {
        height: Layout.TRANSFER_HEADER_MAX_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0,
        shadowRadius: 4,
        //elevation: 10
    },
    balanceText: {
        fontSize: 32,
        color: Colors.fontBlueColor,
        alignSelf: "center",
        fontWeight: "500"
    },
    balanceValueText: {
        marginTop: 3,
        fontSize: FontSize.alertTitleSize,
        color: Colors.fontDarkGrayColor,
    },
    emptyListContainer: {
        color: Colors.fontDarkGrayColor,
        marginTop: 120,
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
        width: Layout.WINDOW_WIDTH * 0.9,
        fontSize: 16,
        color: Colors.fontGrayColor_a,
        textAlign: 'center',
    },
    cell: {
        // height:60,
        backgroundColor: Colors.whiteBackgroundColor,
        flexDirection: "row",
        // alignItems:"center"
    },
    icon: {
        marginLeft: 21,
        alignSelf: "center",
        width: 22,
        height: 22,
    },
    addressContainer: {
        width: Layout.WINDOW_WIDTH * 0.4,
        marginLeft: 0,
        justifyContent: "center"
    },
    transcationStatusContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 0,
        justifyContent: "center",
    },
    transactionValue: {
        fontSize: FontSize.DetailTitleSize,
        textAlign: "right",
    },
    transactionFailed: {
        fontSize: FontSize.alertTitleSize,
        textAlign: "right",
        color: Colors.fontDarkGrayColor,
    },
    tranContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 21,
        flexDirection: 'row'
    },
    progresView: {
        marginLeft: 10,
        marginRight: 10,
        height: 25,
        // backgroundColor:"green",
    },
    backImage: {
        position: 'absolute',
        // width:25,
        // height:25,
        left: 12,
        top: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
        zIndex: 10,
    },
    functionBtn: {
        flex: 1,
        justifyContent: "center",
        borderTopColor: Colors.fontGrayColor,
        borderTopWidth: 1
    },
    itemSeparator: {
        height: 7,
        width: Layout.WINDOW_WIDTH,
        backgroundColor: Colors.clearColor,
    },
});

class Header extends Component {

    static propTypes = {
        balance: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    render() {
        return (
            <View style={[styles.header, (Platform.OS == 'ios' ? styles.shadow : {})]}>
                <Text style={styles.balanceText}>
                    {/* {this.props.balance} */}
                </Text>
                <Text style={styles.balanceValueText}>
                    {/* {"≈$"+this.props.value} */}
                </Text>
            </View>
        )
    }
}

class EmptyComponent extends Component {

    static propTypes = {
        show: PropTypes.bool.isRequired
    }

    render() {
        return (
            this.props.show ?
                <View style={styles.emptyListContainer}>
                    <Image style={styles.emptyListIcon} source={require('../../assets/common/no_icon.png')} resizeMode={'contain'} />
                    <Text style={styles.emptyListText}>{I18n.t('transaction.no_transaction_history_found')}</Text>
                </View> : null
        )
    }
}


class ProgressView extends Component {

    // static propTypes={
    //     curProgress:PropTypes.number.isRequested,
    //     totalProgress:PropTypes.number.isRequested
    // }

    render() {

        let AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

        return (
            <View style={styles.progresView}>
                <View style={{ height: 4, flexDirection: 'row', borderRadius: 4, overflow: 'hidden' }}>
                    <AnimatedLinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: this.props.curProgress }}>
                        <Text style={[styles.middleBlueBtnTitle, styles.normalMiddleBtnTitle]}>{this.props.text}</Text>
                    </AnimatedLinearGradient>
                    <View style={{ flex: (this.props.totalProgress - this.props.curProgress), backgroundColor: Colors.fontGrayColor }}>
                    </View>
                </View>
            </View>
        )
    }
}

class Cell extends Component {

    static propTypes = {
        // item:PropTypes.any.isRequested,
        // onPress:PropTypes.any.isRequested
    }

    render() {
        const { key, address, time, income, amount, symbol, name } = this.props.item.item || {}
        let image = require('../../assets/transfer/recoder/direction_left.png');
        let showText = "-" + amount + " " + symbol;
        let colorStyle = { color: Colors.fontRedColor };

        if (income) {
            image = require('../../assets/transfer/recoder/direction_right.png');
            showText = "+" + amount + " " + symbol;
            colorStyle = { color: Colors.fontGreenColor };
        }


        let cellHeight = this.props.item.item.sureBlock <= 12 ? 80 : 60;
        let transcationStatus = this.props.item.item.isError
        if (transcationStatus == "1") {
            image = require('../../assets/transfer/transaction_fail.png');
        }
        return (
            <TouchableOpacity style={[styles.cell, { height: cellHeight }, (Platform.OS == 'ios' ? styles.shadow : {})]}
                onPress={() => { this.props.onPress(this.props.item.index) }}
            >
                <Image style={styles.icon} source={image} resizeMode={'center'} />
                <View style={{ flex: 1 }}>
                    <View style={styles.tranContainer}>
                        <View style={styles.addressContainer}>
                            <Text style={{ fontSize: FontSize.TitleSize, color: Colors.fontBlackColor }}
                                numberOfLines={1}
                                ellipsizeMode={"middle"}>
                                {name == '' ? address : name}
                            </Text>
                            <Text style={{ fontSize: FontSize.alertTitleSize, color: Colors.fontDarkGrayColor }}>
                                {time}
                            </Text>
                        </View>
                        <View style={styles.transcationStatusContainer}>
                            <Text style={[colorStyle, styles.transactionValue]}>
                                {showText}
                            </Text>
                            {transcationStatus == "1" ? <Text style={styles.transactionFailed}>{I18n.t('transaction.transaction_fail')}</Text> : null}
                        </View>
                    </View>
                    {this.props.item.item.sureBlock < 12 ? <ProgressView totalProgress={12} curProgress={this.props.item.item.sureBlock} /> : null}
                </View>
            </TouchableOpacity>
        )
    }
}

//时间戳换时间格式
function timestampToTime(timestamp) {
    let date
    if (timestamp.length === 10) {
        date = new Date(parseInt(timestamp) * 1000);
    } else if (timestamp.length === 13) {
        date = new Date(parseInt(timestamp))
    }
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + ' ' + h + ':' + m + ':' + s
}

export default class TransactionRecoder extends BaseComponent {

    constructor(props) {
        super(props);
        // this.onRefresh = this.onRefresh.bind(this);

        let { amount, price, iconLarge, symbol } = store.getState().Core.balance;

        this.state = {
            itemList: [],
            balance: amount,
            price: price,
            isRefreshing: false,
            scroollY: new Animated.Value(0),
            showNoData: false,
            icon: iconLarge,
            loadIconError: false
        }



        this.symbol = symbol;
        this.firstPage = 100;//第一页最多显示100条转账记录,如果加载更多就将之前的所有记录全都加载出来
        this.totalItemList = [];//加载的所有记录
        this.topBlock = 0;//上次获取的区块高度
        this.endBlock = 0;
        this.isHaveMoreData = true;//是否还有更多数据
        this.isGetRecodering = false;
        this.isLoadMoreing = false;


        this.suggestGas = -1;
        this.ethBalance = -1;

        this.onRefresh = this.onRefresh.bind(this);

    }



    getRecoder = async (isFirst) => {
        if (this._isMounted) {
            if (this.isGetRecodering || this.isLoadMoreing) {
                return
            }
            this.isGetRecodering = true;

            let { address, decimal, price } = store.getState().Core.balance;
            const { wallet } = store.getState().Core
            let startBlock = this.topBlock == 0 ? 0 : parseInt(this.topBlock) + 1;
            let recoders = await NetworkManager.getTransations({
                address: address,
                symbol: this.symbol,
                decimal: decimal
            }, startBlock);

            let lastTransaction = store.getState().Core.newTransaction
            /*if (recoders.length == 0 && this.state.itemList.length == 0 && !lastTransaction) {
                this.isGetRecodering = false;
                return;
            }*/

            let totalRecords = [];
            let currentBlock = await NetworkManager.getCurrentBlockNumber()
            if (isFirst) {
                if (recoders.length > 0) {
                    totalRecords = recoders.reverse();//获取symbol所有的转账记录，所以没有加载更多
                    this.topBlock = totalRecords[0].blockNumber;
                    this.endBlock = 0;
                    this.isHaveMoreData = false;
                    this.totalItemList = await this.refreshItemList(totalRecords, this.symbol, currentBlock);
                }
            } else {
                if (lastTransaction) {
                   let nowAllTransactions = recoders.concat(this.totalItemList);
                    let didContainNewTransaction = false
                    for (const index in nowAllTransactions) {
                        let recoder = nowAllTransactions[index];
                        if (lastTransaction.hash.toLowerCase() == recoder.hash.toLowerCase()) {
                            didContainNewTransaction = true;
                            break;
                        }
                    }
                    if (lastTransaction && lastTransaction.from === wallet.address && lastTransaction.symbol.toLowerCase() == this.symbol.toLowerCase() && didContainNewTransaction == false) {
                        lastTransaction.blockNumber = currentBlock
                        recoders.push(lastTransaction)
                    }
                }


                let recordList = [];
                let totalRecoderList = this.totalItemList;
                recoders.forEach(function (data, index) {
                    let isExist = false;
                    for (let i = 0; i < totalRecoderList.length; i++) {
                        if (data.hash.toLowerCase() == totalRecoderList[i].hash.toLowerCase()) {
                            isExist = true;
                            //当拉取到新交易后，更新区块高度
                            if(data.blockNumber != totalRecoderList[i].blockNumber){
                            totalRecoderList[i].blockNumber = data.blockNumber
                            }
                            break;
                        }
                    }
                    if (!isExist) {
                        recordList.push(data)
                    }
                })
                recordList.reverse();
                totalRecords = recordList.concat(this.totalItemList);
                this.totalItemList = await this.refreshItemList(totalRecords, this.symbol, currentBlock);


            }

            await this.refreshPage(this.totalItemList, false)
            await this.saveStorageTransactionRecoder(this.totalItemList, this.symbol)

            this.isGetRecodering = false;
        }
    }

    //刷新页面
    refreshPage = async (itemList, isFirst) => {
        let balanceInfo = await this.loadBalanceInfo(isFirst)
        if (this._isMounted) {
            //store.dispatch(setTransactionRecoders(recoders));
            this.setState({
                showNoData: true,
                itemList: itemList,
                price: balanceInfo.price,
                balance: balanceInfo.amount,
            });
            store.dispatch(setCoinBalance(balanceInfo));
        }
    }

    refreshItemList = async (newRecoders, symbol, currentBlock) => {
        const { wallet } = store.getState().Core
        let { contactList } = store.getState().Core;
        let newItemList = [];
        newRecoders.map((item, i) => {
            let address = item.to.toLowerCase() == wallet.address.toLowerCase() ? item.from : item.to
            let data = {
                key: i.toString(),
                address: address,
                time: item.time ? item.time : timestampToTime(item.timeStamp),
                income: item.to.toLowerCase() == wallet.address.toLowerCase(),
                amount: item.amount ? item.amount : item.value ? Number(parseFloat(item.value).toFixed(8)) : item.amount,
                symbol: symbol.toLowerCase(),
                sureBlock: currentBlock - item.blockNumber,
                isError: item.isError,
                name: addressToName(address, contactList),

                blockNumber: item.blockNumber,
                from: item.from,
                to: item.to,
                gasPrice: item.gasPrice,
                hash: item.hash,
            }

            newItemList.push(data)
        });

        return newItemList;
    }


    //获取余额信息
    loadBalanceInfo = async (isFirst) => {

        let { address, decimal, price, amount, symbol } = store.getState().Core.balance;
        const { wallet } = store.getState().Core
        let balanceAmount = '';
        if (isFirst) {
            balanceAmount = amount;
        } else {
            if (wallet.type === 'itc') {
                balanceAmount = await NetworkManager.getBalanceOfITC()
            } else if (wallet.type === 'eth') {
                if (symbol != 'ETH') {
                    balanceAmount = await NetworkManager.getEthERC20Balance(address, decimal);
                } else {
                    balanceAmount = await NetworkManager.getEthBalance();
                }
            }
        }
        let balanceInfo = {
            amount: balanceAmount,
            price: price,
            symbol: symbol,
            address: address,
            decimal: decimal
        }
        return balanceInfo
    }

    //存储最新的100条交易记录
    saveStorageTransactionRecoder = async (totalItemList, symbol) => {
        let records = totalItemList;
        this.topBlock = records.length > 0 ? records[0].blockNumber : 0;
        if (totalItemList.length == 0) {
            return
        }
        //将交易记录列表存在store中
        let storeTransferRecords = {
            symbol: symbol.toLowerCase(),
            transferRecords: records
        }
        let transferRecordList = [];
        transferRecordList = store.getState().Core.transferRecordList;
        if (transferRecordList && transferRecordList.length > 0) {
            let pos = -1;
            for (let i = 0; i < transferRecordList.length; i++) {
                if (symbol.toLowerCase() == transferRecordList[i].symbol.toLowerCase()) {
                    pos = i;
                    break;
                }
            }
            if (pos == -1) {
                transferRecordList.push(storeTransferRecords)
            } else {
                transferRecordList.splice(pos, 1, storeTransferRecords)
            }
        } else {
            transferRecordList = [];
            transferRecordList.push(storeTransferRecords)
        }
        if (this._isMounted) {
            store.dispatch(setTransactionRecordList(transferRecordList));
        }

        //将交易记录列表存在本地
        /*let transactionRecoderInfo = {
            transactionRecoder: records.length > 100 ? records.slice(0, 100) : records
        }
        StorageManage.save(StorageKey.TransactionRecoderInfo, transactionRecoderInfo, symbol.toLowerCase())*/
    }



    //从本地 获取转账记录列表
    loadLocalTransactionRecoder = async () => {
        let transferRecordList = [];
        let transactionRecoderInfo = await StorageManage.load(StorageKey.TransactionRecoderInfo, this.symbol.toLowerCase());
        if (transactionRecoderInfo && transactionRecoderInfo.transactionRecoder.length > 0) {
            transferRecordList = transactionRecoderInfo.transactionRecoder
            if (transferRecordList.length > 0) {
                this.topBlock = transferRecordList[0].blockNumber
                this.endBlock = transferRecordList[transferRecordList.length - 1].blockNumber
                this.totalItemList = transferRecordList;

            } else {
                this.isHaveMoreData = false
                this.totalItemList = [];
            }

            await this.refreshPage(this.totalItemList, true)
            await this.saveStorageTransactionRecoder(this.totalItemList, this.symbol)

            return true;
        } else {
            return false;
        }
    }


    //从内存获取转账记录列表
    loadStoreTransactionRecoder = async () => {
        let transferRecordList = store.getState().Core.transferRecordList;
        if (transferRecordList && transferRecordList.length > 0) {
            let isExist = false
            for (let i = 0; i < transferRecordList.length; i++) {
                if (this.symbol.toLowerCase() == transferRecordList[i].symbol.toLowerCase()) {
                    isExist = true
                    transferRecordList = transferRecordList[i].transferRecords;
                    break;
                }
            }

            if (isExist) {
                if (transferRecordList && transferRecordList.length > 0) {
                    this.topBlock = transferRecordList[0].blockNumber
                    this.endBlock = transferRecordList[transferRecordList.length - 1].blockNumber
                    this.totalItemList = transferRecordList;

                } else {
                    this.isHaveMoreData = false
                    this.totalItemList = [];
                }
                await this.refreshPage(this.totalItemList, true)
                await this.saveStorageTransactionRecoder(this.totalItemList, this.symbol)

                return true;

            } else {
                return false
            }
        } else {
            return false;
        }
    }



    onRefresh = async () => {
        if (this._isMounted) {

            this.setState({
                isRefreshing: true
            })

            await this.getRecoder(false)

            this.setState({
                isRefreshing: false
            })
        }
    }

    _onLoadMore = async () => {

        if (this.state.itemList.length >= this.firstPage && this.isHaveMoreData && !this.isLoadMoreing && !this.isGetRecodering) {
            this.isLoadMoreing = true;
            this.isHaveMoreData = false;

            let { address, decimal, price } = store.getState().Core.balance;
            let endBlock = parseInt(this.endBlock) - 1

            let recoders = await NetworkManager.getTransations({
                address: address,
                symbol: this.symbol,
                decimal: decimal
            }, 0, endBlock);
            if (recoders.length == 0) {
                this.isLoadMoreing = false;
                return
            }


            recoders.reverse();
            let currentBlock = await NetworkManager.getCurrentBlockNumber()


            let newTotalItemList = this.totalItemList.concat(recoders);
            this.totalItemList = await this.refreshItemList(newTotalItemList, this.symbol, currentBlock);
            await this.refreshPage(this.totalItemList, false)
            await this.saveStorageTransactionRecoder(this.totalItemList, this.symbol)


            this.isLoadMoreing = false;
        }
    }

    didTapTransactionButton = async () => {

        let { amount, price, symbol } = store.getState().Core.balance;
        let { wallet } = store.getState().Core

        if (this.ethBalance == -1) {
            this._showLoading()
            this.ethBalance = wallet.type === 'itc' ? await NetworkManager.getBalanceOfITC() : await NetworkManager.getEthBalance();
            this._hideLoading()
        }

        if (this.ethBalance <= 0) {
            showToast(I18n.t('transaction.alert_4'))
            return
        }

        let suggestGas = this.suggestGas
        transferProps = {
            transferType: symbol,
            ethBalance: this.ethBalance,
            balance: amount,
            suggestGasPrice: parseFloat(suggestGas),
            ethPrice: price,
            fromAddress: wallet.address,
        };



        store.dispatch(setWalletTransferParams(transferProps));
        this.props.navigation.navigate('Transaction', {
            onGoBack: () => {
                this.refs.flatList.scrollToOffset(0);
                this.getRecoder(false)
                // 刷新首页list
                NetworkManager.loadTokenList()
            },
        });
    };

    didTapShowQrCodeButton = () => {
        this.props.navigation.navigate('ReceiptCode');
    };

    async didTapTransactionCell(item) {
        this._showLoading()
        try {
            let { symbol } = store.getState().Core.balance;
            let recoder = item;
            let currentBlock = await NetworkManager.getCurrentBlockNumber()
            this._hideLoading()
            // "0"--已确认 "1"--错误  "2"--确认中
            let state = recoder.isError

            if (state == "0") {
                let sureBlock = currentBlock - recoder.blockNumber;
                if (sureBlock < 12) {
                    state = "2"
                }
            }

            let transactionDetail = {
                //amount: parseFloat(recoder.value),
                // amount: Number(parseFloat(recoder.value).toFixed(8)),
                amount: item.amount,
                transactionType: symbol,
                fromAddress: recoder.from,
                toAddress: recoder.to,
                gasPrice: recoder.gasPrice,
                remark: I18n.t('transaction.no'),
                transactionHash: recoder.hash,
                blockNumber: recoder.blockNumber,
                transactionTime: item.time + " +0800",
                tranStatus: state,
                name: item.name
            };
            store.dispatch(setTransactionDetailParams(transactionDetail));
            this.props.navigation.navigate('TransactionDetail');
        } catch (err) {
            this._hideLoading()
        } finally {
            this._hideLoading()
        }

    };

    renderItem = (item) => {
        return <Cell item={item}
            onPress={() => this.didTapTransactionCell(item.item)}
            key={item.item} />
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View style={styles.separator} key={`${sectionID}-${rowID}`} />
        )
    }

    //自定义分割线
    _renderItemSeparatorComponent = () => (
        <View style={styles.itemSeparator}>
        </View>
    )

    async _initData() {

        try {
            let isGetTRFromStore = await this.loadStoreTransactionRecoder();//从store获取
            if (!isGetTRFromStore) {
                this.showLoading()
                //let isGetTRFromLocal = await this.loadLocalTransactionRecoder()//本地中获取
                let isGetTRFromLocal = false;
                if (!isGetTRFromLocal) {
                    await this.getRecoder(true) //从远端获取
                }
                this.hideLoading()
            }
        } catch (err) {
            this.hideLoading()
        }
        const wallet = store.getState().Core.wallet
        this.suggestGas = await NetworkManager.getSuggestGasPrice();
        this.ethBalance = wallet.type === 'itc' ? await NetworkManager.getBalanceOfITC() : await NetworkManager.getEthBalance();


        timer = setInterval(() => {
            this.getRecoder(false)
        }, 3 * 1000)
    }

    showLoading() {
        this._showLoading()
        if (this.state.showNoData) {
            this.setState({
                showNoData: false
            })
        }
    }

    hideLoading() {
        this._hideLoading()
        if (this.state.itemList.length == [] && !this.state.showNoData && this._isMounted) {
            this.setState({
                showNoData: true
            })
        }
    }

    getIconImage(symbol) {
        let imageSource = require('../../assets/transfer/naIcon.png')
        if (symbol === 'ETH' || symbol === 'ITC' || symbol === 'MANA' || symbol === 'DPY') {
            imageSource = tokenIcon[symbol]
        }
        return imageSource
    }

    componentWillMount() {
        super.componentWillMount()
        this._isMounted = true
    }

    componentWillUnmount() {
        clearInterval(timer)
        super.componentWillUnmount()
        this._isMounted = false

    }

    _onBackPressed = () => {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
        return true;
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

    renderComponent() {

        let { amount, price } = store.getState().Core.balance;
        const { wallet } = store.getState().Core
        let value = parseFloat(amount) * parseFloat(price);
        value = Number(value.toFixed(8));

        if (amount == null) {
            amount = 0;
            value = 0;
        }

        let bottomView = { height: 50 }
        if (Layout.DEVICE_IS_IPHONE_X()) {
            bottomView = { height: 58 }
        }

        let btnShadowStyle = {
            shadowColor: '#A9A9A9',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 4
        }

        if (Layout.DEVICE_IS_ANDROID) {
            btnShadowStyle = {}
        }

        const space = Layout.TRANSFER_HEADER_MAX_HEIGHT - Layout.TRANSFER_HEADER_MIN_HEIGHT

        const headerHeight = this.state.scroollY.interpolate({
            inputRange: [-Layout.WINDOW_HEIGHT + Layout.TRANSFER_HEADER_MAX_HEIGHT, 0, space],
            outputRange: [Layout.WINDOW_HEIGHT, Layout.TRANSFER_HEADER_MAX_HEIGHT, Layout.TRANSFER_HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })
        const headerZindex = this.state.scroollY.interpolate({
            inputRange: [0, space],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        const headerTextOpacity = this.state.scroollY.interpolate({
            inputRange: [space - Layout.NAVIGATION_HEIGHT() - 30, space],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        const titleTextOpacity = this.state.scroollY.interpolate({
            inputRange: [space - Layout.NAVIGATION_HEIGHT() - 50, space],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        let pr = this.state.balance * this.state.price

        //价格
        let sign = store.getState().Core.monetaryUnit.symbol;
        let priceStr = isNaN(pr) || (pr) === 0 ? '--' : '≈' + sign + (pr).toFixed(2)
        let TouchView = Animated.createAnimatedComponent(TouchableOpacity)

        let iconUri = this.state.icon;
        let icon = this._getLogo(this.symbol, iconUri)
        return (
            <View style={styles.container}>
                <StatusBarComponent barStyle={'light-content'} />
                {/* <BackWhiteButton style={{position: 'absolute',left:20,top:10}} onPress={() => {this.props.navigation.goBack()}}/> */}

                <TouchableOpacity style={styles.backImage}
                    onPress={() => {
                        this.props.navigation.state.params.callback();
                        this.props.navigation.goBack()
                    }}>
                    <Image
                        style={{ marginTop: 0 }}
                        source={require('../../assets/common/common_back_white.png')}
                        resizeMode={'center'}
                    />
                </TouchableOpacity>
                <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    //backgroundColor: 'lightskyblue',
                    height: headerHeight,
                    zIndex: headerZindex,

                }}>
                    <Image
                        style={{ flex: 1, width: Layout.WINDOW_WIDTH }}
                        source={require('../../assets/home/top_bg.png')}
                    />
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            left: 40,
                            width: 100,
                            height: 30,
                            top: Layout.NAVIGATION_HEIGHT() - 32,
                            color: 'white',
                            opacity: titleTextOpacity,
                            fontSize: 18,
                            textAlign: 'left',
                            fontWeight: "500",
                        }}
                    >{this.symbol}</Animated.Text>
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            right: 20,
                            width: 200,
                            height: 30,
                            top: Layout.NAVIGATION_HEIGHT() - 32,
                            color: 'white',
                            opacity: titleTextOpacity,
                            fontSize: 18,
                            textAlign: 'right',
                            fontWeight: "500",
                        }}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.01}
                    >{amount}</Animated.Text>
                    <Animated.Image
                        style={{
                            position: 'absolute',
                            left: 20,
                            bottom: 60,
                            width: 36,
                            height: 36,
                            opacity: headerTextOpacity,
                            borderRadius: 18,
                            backgroundColor: Platform.OS == 'ios' ? 'white' : 'transparent'
                        }}

                        source={iconUri == '' || this.state.loadIconError == true || this.symbol == 'ITC' ? icon : { uri: iconUri }}
                        resizeMode='contain'
                        iosdefaultSource={require('../../assets/home/null.png')}
                        onError={() => {
                            if (this._isMounted) {
                                this.setState({
                                    loadIconError: true,
                                })
                            }
                        }}
                    />
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            left: 60,
                            height: 30,
                            bottom: 55,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 17,
                            textAlign: 'center',
                            fontWeight: "500",
                        }}
                    >{this.symbol}</Animated.Text>
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            right: 20,
                            // height:40,
                            bottom: 58,
                            width: LayoutConstants.WINDOW_WIDTH - 120,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 38,
                            textAlign: 'right',
                            fontWeight: "600",
                        }}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.01}
                    >{this.state.balance}</Animated.Text>
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            right: 20,
                            height: 30,
                            bottom: 32,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 15,
                            textAlign: 'right',
                            fontWeight: "500",
                        }}
                    >{priceStr}</Animated.Text>
                </Animated.View>
                <FlatList style={[styles.flatList]}
                    ListHeaderComponent={<Header balance={Number(parseFloat(amount).toFixed(4))}
                        value={value}
                        style={{ height: headerHeight }} />}
                    ListEmptyComponent={<EmptyComponent show={this.state.showNoData} />}
                    data={this.state.itemList}
                    renderItem={this.renderItem}
                    refreshControl={<RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={this.state.isRefreshing}
                        tintColor={Colors.whiteBackgroundColor}
                    />}
                    getItemLayout={(data, index) => ({ length: 60, offset: (60 + 7) * index, index: index })}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scroollY } } }]
                    )}
                    //keyExtractor={(item)=>{item.key}}
                    keyExtractor={(item, index) => index.toString()}
                    ref="flatList"
                    onEndReachedThreshold={1}
                    onEndReached={this._onLoadMore}
                >
                </FlatList>
                <View style={[styles.bottomBtnView, bottomView, btnShadowStyle]}>
                    <TouchableOpacity style={[styles.functionBtn, { height: bottomView.height }]} onPress={this.didTapTransactionButton}>
                        <Text style={{ color: Colors.fontBlueColor, textAlign: 'center', fontSize: 16 }}>{I18n.t('transaction.transfer')}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: bottomView.height - 10, backgroundColor: Colors.fontGrayColor }} />
                    <TouchableOpacity style={[styles.functionBtn, { height: bottomView.height }]} onPress={this.didTapShowQrCodeButton}>
                        <Text style={{ color: Colors.fontBlueColor, textAlign: 'center', fontSize: 16 }}>{I18n.t('transaction.receipt')}</Text>
                    </TouchableOpacity>
                    {/* <WhiteButtonMiddle  onPress={this.didTapTransactionButton}
                                        text={I18n.t('transaction.transfer')}
                                        image={require('../../assets/transfer/recoder/zhuanzhang_icon.png')}/> */}

                    {/* <WhiteButtonMiddle  onPress={this.didTapShowQrCodeButton}
                                        text={I18n.t('transaction.receipt')}
                                        image={require('../../assets/transfer/recoder/shoukuan_icon.png')}/> */}
                </View>
            </View>
        )
    }
}