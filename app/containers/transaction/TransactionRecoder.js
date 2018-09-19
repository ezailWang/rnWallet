import React,{Component} from 'react'
import{
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
}from 'react-native'
import {Colors,FontSize} from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import {WhiteButtonMiddle, BackButton,BackWhiteButton} from '../../components/Button'
import PropTypes from 'prop-types'
import {store} from '../../config/store/ConfigureStore'
import {setTransactionDetailParams, setWalletTransferParams,setTransactionRecoders,setCoinBalance} from "../../config/action/Actions";
import networkManage from '../../utils/networkManage'
import StatusBarComponent from '../../components/StatusBarComponent'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Loading from '../../components/LoadingComponent'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import LinearGradient from 'react-native-linear-gradient'

const tokenIcon = {
    'ETH': require('../../assets/home/ETH.png'),
    'ITC': require('../../assets/home/ITC.png'),
    'MANA': require('../../assets/home/MANA.png'),
    'DPY': require('../../assets/home/DPY.png'),
}


const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:Colors.backgroundColor
    },
    flatList:{
        flex:1,
    },
    bottomBtnView:{
        flexDirection:"row",
        height:45,
        backgroundColor:Colors.whiteBackgroundColor,
        marginBottom:0,
        // justifyContent:"space-around",
        alignItems:"center",
    },
    header:{
        height:Layout.TRANSFER_HEADER_MAX_HEIGHT,
        alignItems:"center",
        justifyContent:"center",
    },
    shadow:{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        //elevation: 10
    },
    balanceText:{
        fontSize:32,
        color:Colors.fontBlueColor,
        alignSelf:"center",
        fontWeight:"500"
    },
    balanceValueText:{
        marginTop:3,
        fontSize:FontSize.alertTitleSize,
        color:Colors.fontDarkGrayColor,
    },
    emptyViewStyle:{
        alignSelf:"center",
        marginTop:80,
        color:Colors.fontDarkGrayColor,
        fontSize:FontSize.HeaderSize,
    },
    cell:{
        marginTop:7,
        // height:60,
        backgroundColor:Colors.whiteBackgroundColor,
        flexDirection:"row",
        // alignItems:"center"
    },
    icon:{
        marginLeft:20,
        alignSelf:"center",
        width:22,
        height:22,
    },
    addressContainer:{
        width:Layout.WINDOW_WIDTH*0.4,
        marginLeft:0,
        justifyContent:"center"
    },
    transcationStatusContainer:{
        flex:1,
        marginLeft:10,
        marginRight:0,
        justifyContent:"center",
    },
    transactionValue:{
        fontSize:FontSize.DetailTitleSize,
        textAlign:"right",
    },
    transactionFailed:{
        fontSize:FontSize.alertTitleSize,
        textAlign:"right",
        color:Colors.fontDarkGrayColor,
    },
    tranContainer:{
        flex:1,
        marginLeft:10,
        marginRight:10,
        // backgroundColor:"red",
        flexDirection:'row'
    },
    progresView:{
        marginLeft:10,
        marginRight:10,
        height:25,
        // backgroundColor:"green",
    }
});

class Header extends Component{

    static propTypes={
        balance:PropTypes.any.isRequired,
        value:PropTypes.any.isRequired,
    };

    render(){
        return (
            <View style={[styles.header,(Platform.OS=='ios' ? styles.shadow :{})]}>
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

class EmptyComponent extends Component{
    
    static propTypes={
        show:PropTypes.bool.isRequired
    }

    render() {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyViewStyle}>{this.props.show?I18n.t('transaction.no_transaction_history_found'):''}</Text>
            </View>
        )
    }
}


class  ProgressView extends Component{

    // static propTypes={
    //     curProgress:PropTypes.number.isRequested,
    //     totalProgress:PropTypes.number.isRequested
    // }

    render(){

        let AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

        return (
            <View style={styles.progresView}>
                <View style={{height:4,flexDirection:'row',borderRadius:4,overflow: 'hidden'}}>
                    <AnimatedLinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                                    start={{x:0,y:1}}
                                    end={{x:1,y:1}}
                                    style={{flex:this.props.curProgress}}>
                        <Text style={[styles.middleBlueBtnTitle,styles.normalMiddleBtnTitle]}>{this.props.text}</Text>
                    </AnimatedLinearGradient>
                    <View style={{flex:(this.props.totalProgress - this.props.curProgress),backgroundColor:Colors.fontGrayColor}}>
                    </View>
                </View>
            </View>
        )
    }
}

class Cell extends Component{

    static propTypes={
        // item:PropTypes.any.isRequested,
        // onPress:PropTypes.any.isRequested
    }

    render(){
        const {key,address,time,income,amount,type} = this.props.item.item || {}
        let image = require('../../assets/transfer/recoder/direction_left.png');
        let showText = "-"+amount+" "+type;
        let colorStyle = {color:Colors.fontRedColor};

        if(income){
            image = require('../../assets/transfer/recoder/direction_right.png');
            showText = "+"+amount+" "+type;
            colorStyle = {color:Colors.fontGreenColor};
        }   
        
        
        let cellHeight = this.props.item.item.sureBlock <= 12 ? 80 : 60;
        let transcationStatus = this.props.item.item.isError

        if (transcationStatus == "1"){
            image = require('../../assets/transfer/trans_fail.png');
        }
        return (
            <TouchableOpacity   style={[styles.cell,{height:cellHeight},(Platform.OS=='ios' ? styles.shadow :{})]}
                                onPress={()=>{this.props.onPress(this.props.item.index)}}
            >
                <Image style={styles.icon} source={image} resizeMode={'center'}/>
                <View style={{flex:1}}>
                    <View style={styles.tranContainer}>
                        <View style={styles.addressContainer}>
                            <Text style={{fontSize:FontSize.TitleSize,color:Colors.fontBlackColor}}
                                numberOfLines={1}
                                ellipsizeMode={"middle"}>
                                {address}
                            </Text>
                            <Text style={{fontSize:FontSize.alertTitleSize,color:Colors.fontDarkGrayColor}}>
                                {time}
                            </Text>
                        </View>
                        <View style={styles.transcationStatusContainer}>
                            <Text style={[colorStyle,styles.transactionValue]}>
                                {showText}
                            </Text>
                            {transcationStatus == "1"?<Text style={styles.transactionFailed}>交易失败</Text>:null}
                        </View>
                    </View>
                    {this.props.item.item.sureBlock < 12 ? <ProgressView totalProgress={12} curProgress={this.props.item.item.sureBlock}/>:null}
                </View>  
            </TouchableOpacity>
        )
    }
}

//时间戳换时间格式
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}

export default class TransactionRecoder extends BaseComponent{

    constructor(props){
        super(props);
        this.onRefresh = this.onRefresh.bind(this);

        let {amount,price} = store.getState().Core.balance;

        this.state={
            itemList:[],
            balance:amount,
            price:price,
            isRefreshing:false,
            scroollY: new Animated.Value(0),
            showNoData:false
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    getRecoder = async ()=>{

        let {contractAddress,symbol,decimals,price} = store.getState().Core.balance;

        const { walletAddress } = store.getState().Core
        let recoders = await  networkManage.getTransations({
            contractAddress:contractAddress,
            symbol:symbol,
            decimals:decimals
        });
        let currentBlock = await networkManage.getCurrentBlockNumber()

        store.dispatch(setTransactionRecoders(recoders));

        var itemList = []
        recoders.map((item,i)=>{    
            
            let data = {
                key:i.toString(),
                address:item.to.toLowerCase()==walletAddress.toLowerCase()?item.from:item.to,
                time:timestampToTime(item.timeStamp),
                income:item.to.toLowerCase()==walletAddress.toLowerCase(),
                amount:item.value,
                type:symbol.toLowerCase(),
                sureBlock:currentBlock-item.blockNumber+1,
                isError:item.isError
            }

            //测试数据
            if(i < 11){
                data.sureBlock=i+1
            }

            if(i == recoders.length - 3){
                data.isError="1"
            }

            itemList.push(data)
        });
        //反序
        itemList.reverse();

        //获取余额信息
        let balanceAmount = '';

        if (symbol != 'ETH') {
            balanceAmount = await networkManage.getERC20Balance(contractAddress, decimals);
        }
        else {
            balanceAmount = await networkManage.getEthBalance();
        }

        let balanceInfo = {
            amount:balanceAmount,
            price:price,
            symbol:symbol,
            contractAddress:contractAddress,
            decimals:decimals
        }

        this.setState({
            showNoData:true,
            itemList:itemList,
            price:price,
            balance:balanceAmount
        });

        store.dispatch(setCoinBalance(balanceInfo));
    }

    onRefresh = async ()=>{

        this.setState({
            isRefreshing:true
        })

        this.getRecoder()
        
        this.setState({
            isRefreshing:false
        })
    }

    didTapTransactionButton= async ()=>{

        this._showLoding()

        let {amount,price,symbol,ethBalance} = store.getState().Core.balance;
        let { walletAddress } = store.getState().Core
        let suggestGas = await networkManage.getSuggestGasPrice();

        transferProps = {
            transferType:symbol,
            balance:amount,
            suggestGasPrice:parseFloat(suggestGas),
            ethPrice:price,
            fromAddress:walletAddress,
            ethBalance:ethBalance
        };

        this._hideLoading()

        store.dispatch(setWalletTransferParams(transferProps));
        this.props.navigation.navigate('Transaction', {
            onGoBack: () => this.onRefresh(),
          });
    };

    didTapShowQrCodeButton=()=>{
        //console.warn("展示二维码");
        this.props.navigation.navigate('ReceiptCode');
    };

    didTapTransactionCell=(index)=>{

        let {symbol} = store.getState().Core.balance;
        let recoders = store.getState().Core.recoders;
        let recoder = recoders[recoders.length-index-1];
        let transactionDetail={
            amount:parseFloat(recoder.value),
            transactionType:symbol,
            fromAddress:recoder.from,
            toAddress:recoder.to,
            gasPrice:recoder.gasPrice,
            remark:I18n.t('transaction.no'),
            transactionHash:recoder.hash,
            blockNumber:recoder.blockNumber,
            transactionTime:timestampToTime(recoder.timeStamp)+" +0800"
        };

        store.dispatch(setTransactionDetailParams(transactionDetail));
        this.props.navigation.navigate('TransactionDetail');
    };

    renderItem = (item) => {
        return <Cell item={item}
                     onPress={this.didTapTransactionCell}
                     key={item.item}/>
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
          <View style={styles.separator} key={`${sectionID}-${rowID}`}/>
        )
    }

    async _initData(){
        
        this._showLoding()
        await this.getRecoder()
        this._hideLoading()
    }

    getIconImage(symbol){

        let imageSource = require('../../assets/home/null.png')
        if (symbol === 'ETH' || symbol === 'ITC' || symbol === 'MANA' || symbol === 'DPY') {
                imageSource = tokenIcon[symbol]
        }
        return imageSource
    }

    renderComponent (){

        let {amount,price,symbol} = store.getState().Core.balance;
        let value = parseFloat(amount)*parseFloat(price);
        value = value.toFixed(2);

        if (amount == null){
            amount = 0;
            value = 0;
        }

        let bottomView = {height:50}
        if(Layout.DEVICE_IS_IPHONE_X()){
            bottomView =  {height:58}
        }

        let btnShadowStyle = { 
            shadowColor: '#A9A9A9',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation:4
        }

        if(Layout.DEVICE_IS_ANDROID){
            btnShadowStyle = {}
        }

        const space =  Layout.TRANSFER_HEADER_MAX_HEIGHT - Layout.TRANSFER_HEADER_MIN_HEIGHT

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
            inputRange: [space - Layout.NAVIGATION_HEIGHT() - 60, space],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        const titleTextOpacity = this.state.scroollY.interpolate({
            inputRange: [space - Layout.NAVIGATION_HEIGHT() - 60, space],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        let pr = this.state.balance * this.state.price

        //价格
        let priceStr = isNaN(pr) || (pr) === 0 ? '--' : '≈' + I18n.t('home.currency_symbol') + (pr).toFixed(2)
        let TouchView = Animated.createAnimatedComponent(TouchableOpacity)
        return(
            <View style={styles.container}>
            <StatusBarComponent barStyle={'light-content'} />
            {/* <BackWhiteButton style={{position: 'absolute',left:20,top:10}} onPress={() => {this.props.navigation.goBack()}}/> */}
            <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'lightskyblue',
                    height: headerHeight,
                    zIndex: headerZindex,
                }}>
                    <Image
                        style={{ flex: 1, width: Layout.WINDOW_WIDTH }}
                        source={require('../../assets/home/hp_bg.png')}
                        
                    />
                    <TouchView style={{position: 'absolute',width:20,height:20,left:30,top:20,backgroundColor:'red'}}
                               onPress={()=>{
                                   this.props.navigation.goBack()
                                }}>
                                <Image 
                                    style={{marginTop:0}}
                                    source={require('../../assets/common/common_back_white.png')}
                                    resizeMode={'center'}
                                />
                    </TouchView>
                    {/* <AnimatedBackButton
                        style={{
                            position: 'absolute',
                            left: 30,
                            top:Layout.NAVIGATION_HEIGHT() - 34,
                            backgroundColor: 'white',
                        }}
                        /> */}
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            left: 0,
                            width:Layout.WINDOW_WIDTH,
                            height:30,
                            top:Layout.NAVIGATION_HEIGHT() - 34,
                            color: 'white',
                            opacity: titleTextOpacity,
                            fontSize: 20,
                            textAlign:'center',
                            fontWeight:"500"
                        }}
                    >{symbol}</Animated.Text>
                    <Animated.Image
                        style={{
                            position: 'absolute',
                            left: 20,
                            bottom:60,
                            width:28,
                            height:28,
                            opacity: headerTextOpacity,
                        }}
                        source={this.getIconImage(symbol)}
                    />
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            left: 60,
                            height:30,
                            bottom: 55,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 17,
                            textAlign:'center',
                            fontWeight:"500"
                        }}
                    >{symbol}</Animated.Text>
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            left: 60,
                            height:30,
                            bottom: 55,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 17,
                            textAlign:'center',
                            fontWeight:"500"
                        }}
                    >{symbol}</Animated.Text>
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            right: 20,
                            height:40,
                            bottom: 58,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 35,
                            textAlign:'right',
                            fontWeight:"700"
                        }}
                    >{this.state.balance}</Animated.Text> 
                    <Animated.Text
                        style={{
                            position: 'absolute',
                            right: 20,
                            height:30,
                            bottom: 32,
                            color: 'white',
                            opacity: headerTextOpacity,
                            fontSize: 15,
                            textAlign:'right',
                            fontWeight:"500"
                        }}
                    >{priceStr}</Animated.Text>            
                </Animated.View>
                <FlatList   style={styles.flatList}
                            ListHeaderComponent={<Header balance={parseFloat(amount).toFixed(4)}
                                                         value={value} 
                                                         style={{height:headerHeight}}/>}
                            ListEmptyComponent ={<EmptyComponent show={this.state.showNoData}/>}
                            data={this.state.itemList}
                            renderItem={this.renderItem}
                            refreshControl={<RefreshControl
                                onRefresh={this.onRefresh}
                                refreshing={this.state.isRefreshing}
                                tintColor={Colors.whiteBackgroundColor}
                            />}
                            scrollEventThrottle={10}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: this.state.scroollY } } }]
                            )}
                            // keyExtractor={(item)=>{item.key}}
                            >
                </FlatList>
                <View style={[styles.bottomBtnView,bottomView,btnShadowStyle]}>
                    <TouchableOpacity style={{flex:1,justifyContent:"center",height:bottomView.height,backgroundColor:"red"}} onPress={this.didTapTransactionButton}>
                        <Text style={{color:Colors.fontBlueColor,textAlign:'center'}}>转账</Text>
                    </TouchableOpacity> 
                    <View style={{width:50,marginTop:5,marginBottom:5,backgroundColor:Colors.fontBlackColor}} /> 
                    <TouchableOpacity style={{flex:1,justifyContent:"center",height:bottomView.height,backgroundColor:"green"}} onPress={this.didTapShowQrCodeButton}>
                        <Text style={{color:Colors.fontBlueColor,textAlign:'center'}}>收款</Text>
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