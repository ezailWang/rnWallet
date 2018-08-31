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
    BackHandler
}from 'react-native'
import {Colors,FontSize} from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import {WhiteButtonMiddle} from '../../components/Button'
import PropTypes from 'prop-types'
import {store} from '../../config/store/ConfigureStore'
import {setTransactionDetailParams, setWalletTransferParams,setTransactionRecoders,setCoinBalance} from "../../config/action/Actions";
import networkManage from '../../utils/networkManage';
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Loading from '../../components/LoadingComponent'

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
        height:60,
        backgroundColor:Colors.whiteBackgroundColor,
        marginBottom:0,
        justifyContent:"space-around",
        alignItems:"center",
    },
    header:{
        height:Layout.WINDOW_WIDTH * 0.4,
        backgroundColor:Colors.whiteBackgroundColor,
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
        height:60,
        backgroundColor:Colors.whiteBackgroundColor,
        flexDirection:"row",
        // alignItems:"center"
    },
    icon:{
        marginLeft:20,
        alignSelf:"center",
        width:22,
        height:22,
        // marginTop:10,
        // backgroundColor:"green"
    },
    addressContainer:{
        width:Layout.WINDOW_WIDTH*0.6,
        //backgroundColor:"red",
        marginLeft:10,
        justifyContent:"center"
    },
    transactionValue:{
        flex:1,
        fontSize:FontSize.DetailTitleSize,
        marginLeft:10,
        marginRight:10,
        alignSelf:"center",
        textAlign:"right"
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
                    {this.props.balance}
                </Text>
                <Text style={styles.balanceValueText}>
                    {"≈$"+this.props.value}
                </Text>
            </View>
        )
    }
}

class EmptyComponent extends Component{
    
    render() {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyViewStyle}>未查询到交易记录..</Text>
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
        return (
            <TouchableOpacity   style={[styles.cell,(Platform.OS=='ios' ? styles.shadow :{})]}
                                onPress={()=>{this.props.onPress(this.props.item.index)}}
            >
                <Image style={styles.icon} source={image} resizeMode={'center'}/>
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
                <Text style={[colorStyle,styles.transactionValue]}>
                    {showText}
                </Text>
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

export default class TransactionRecoder extends Component{

    constructor(props){
        super(props);
        
        this.onRefresh = this.onRefresh.bind(this);

        this.state={
            itemList:[],
            isRefreshing:false,
            loadingShow:false,
        }
    }

    componentWillUnmount(){
        this.backHandler && this.backHandler.remove();
    }
    onBackPressed=()=>{ 
        this.props.navigation.goBack();
        return true;
    }

    onRefresh = async ()=>{

        this.setState({
            isRefreshing:true
        })
        let {contractAddress,transferType,decimals} = store.getState().Core.balance;

        const { walletAddress } = store.getState().Core
        let arr = await  networkManage.getTransations({
            contractAddress:contractAddress,
            symbol:transferType,
            decimals:decimals
        });
        store.dispatch(setTransactionRecoders(arr));

        //获取余额信息
        let balanceAmount = await networkManage.getEthBalance();
        let price = await networkManage.getEthPrice();
        
        let balanceInfo = {
            amount:balanceAmount,
            price:price,
            transferType:transferType,
            contractAddress:contractAddress,
            decimals:decimals
        }
        store.dispatch(setCoinBalance(balanceInfo));

        this.setState({
            isRefreshing:false
        })
    }

    didTapTransactionButton= async ()=>{

        this.setState({
            loadingShow:true
        })

        let {amount,price,transferType} = store.getState().Core.balance;
        let { walletAddress } = store.getState().Core
        let suggestGas = await networkManage.getSuggestGasPrice();

        transferProps = {
            transferType:transferType,
            balance:amount,
            suggestGasPrice:parseFloat(suggestGas),
            ethPrice:price,
            fromAddress:walletAddress
        };

        this.setState({
            loadingShow:false
        })

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

        let recoders = store.getState().Core.recoders;
        let recoder = recoders[index];
        let transactionDetail={
            amount:parseFloat(recoder.value),
            transactionType:"ETH",
            fromAddress:recoder.from,
            toAddress:recoder.to,
            gasPrice:recoder.gasPrice,
            remark:"无",
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

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPressed);

        let recoders = store.getState().Core.recoders;
        const { walletAddress } = store.getState().Core
        var itemList = []
        recoders.map((item,i)=>{    
            
            let data = {
                key:i.toString(),
                address:item.to.toLowerCase()==walletAddress.toLowerCase()?item.from:item.to,
                time:timestampToTime(item.timeStamp),
                income:item.to.toLowerCase()==walletAddress.toLowerCase(),
                amount:item.value,
                type:"ether"
            }
            itemList.push(data)
        });

        this.setState({
            "itemList":itemList
        });
    }

    render (){

        let {amount,price} = store.getState().Core.balance;
        let value = parseFloat(amount)*parseFloat(price);
        value = value.toFixed(2);

        let bottomView = {height:60}
        if(Layout.DEVICE_IS_IPHONE_X()){
            bottomView =  {height:80}
        }
        return(
            <View style={styles.container}>
                <StatusBarComponent/>
                <WhiteBgHeader  navigation={this.props.navigation} text='交易记录'/>
                <FlatList   style={styles.flatList}
                            ListHeaderComponent={<Header balance={parseFloat(amount).toFixed(4)}
                                                         value={value}/>}
                            ListEmptyComponent ={<EmptyComponent/>}
                            data={this.state.itemList}
                            renderItem={this.renderItem}
                            refreshControl={<RefreshControl
                                onRefresh={this.onRefresh}
                                refreshing={this.state.isRefreshing}
                                title="Loading..."
                            />}
                            // keyExtractor={(item)=>{item.key}}
                            >
                </FlatList>
                <View style={[styles.bottomBtnView,bottomView]}>
                    <WhiteButtonMiddle  onPress={this.didTapTransactionButton}
                                        text={"转账"}
                                        image={require('../../assets/transfer/recoder/zhuanzhang_icon.png')}/>
                    <WhiteButtonMiddle  onPress={this.didTapShowQrCodeButton}
                                        text={"收款"}
                                        image={require('../../assets/transfer/recoder/shoukuan_icon.png')}/>
                </View>
                <Loading visible={this.state.loadingShow} />
            </View>
        )
    }
}