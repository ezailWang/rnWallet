import React,{Component} from 'react'
import{
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image
}from 'react-native'

import {Colors,FontSize} from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import {WhiteButtonMiddle} from '../../components/Button'
import PropTypes from 'prop-types'

import {store} from '../../config/store/ConfigureStore'
import {setTransactionDetailParams, setWalletTransferParams} from "../../config/action/Actions";


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
        elevation: 10
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
        // width:20,
        // height:20,
        // marginTop:10,
        // backgroundColor:"green"
    },
    addressContainer:{
        width:Layout.WINDOW_WIDTH*0.5,
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
        balance:PropTypes.number,
        value:PropTypes.number,
    };

    render(){
        return (
            <View style={[styles.header,styles.shadow]}>
                <Text style={styles.balanceText}>
                    {this.props.balance}
                </Text>
                <Text style={styles.balanceValueText}>
                    {"≈￥"+this.props.value}
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
        let showText = "-"+amount.toFixed(4)+" "+type;
        let colorStyle = {color:Colors.fontRedColor};

        if(income){
            image = require('../../assets/transfer/recoder/direction_right.png');
            showText = "+"+amount.toFixed(4)+" "+type;
            colorStyle = {color:Colors.fontGreenColor};
        }
        return (
            <TouchableOpacity   style={[styles.cell,styles.shadow]}
                                onPress={()=>{this.props.onPress(this.props.item.index)}}
            >
                <Image style={styles.icon} source={image}/>
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

    didTapTransactionButton=()=>{

        transferProps = {
            transferType:"ETH",
            balance:77.77,
            suggestGasPrice:5,
            ethPrice:3000.12,
            fromAddress:"0x6043a81ae4A052381b21aac944DE408C809f0774"
        };
        store.dispatch(setWalletTransferParams(transferProps));
        this.props.navigation.navigate('Transaction',props={transferType:"ETH"});
    };

    didTapShowQrCodeButton=()=>{
        //console.warn("展示二维码");
        this.props.navigation.navigate('ReceiptCode');
    };

    didTapTransactionCell=(index)=>{

        //console.warn("查看第"+index+"条记录的信息");

        transactionDetail={
            amount:"101.22",
            transactionType:"ETH",
            fromAddress:"0x6043a81ae4A052381b21aac944DE408C809f0774",
            toAddress:"0x6043a81ae4A052381b21aac944DE408C809f0774",
            gasPrice:"0.0021",
            remark:"无",
            transactionHash:"0x5c570db1b576046b96bd95b3b0214f459657bc91577278d48072342c35fa5380",
            blockNumber:"6097412",
            transactionTime:"07/05/2018 12:08:16 +0800"
        };

        store.dispatch(setTransactionDetailParams(transactionDetail));
        this.props.navigation.navigate('TransactionDetail');
    };

    renderItem = (item) => {
        return <Cell item={item}
                     onPress={this.didTapTransactionCell}
                     key={item.item.key}/>
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
          <View style={styles.separator} key={`${sectionID}-${rowID}`}/>
        )
    }

    render (){

        let recoders = store.getState().Core.recoders;

        const { walletAddress } = store.getState().Core
        console.warn(walletAddress);

        var itemList = []
        recoders.map((item,i)=>{
            
            let data = {
                key:i.toString(),
                address:item.to,
                time:timestampToTime(item.timeStamp),
                income:item.to.toLowerCase()==walletAddress.toLowerCase(),
                amount:10.20,
                type:"ether"
            }
            itemList.push(data)
        });


        let {amount,value} = store.getState().Core.balance;

        let bottomView = {height:60}
        if(Layout.DEVICE_IS_IPHONE_X()){
            bottomView =  {height:80}
        }
        return(
            <View style={styles.container}>
                <FlatList   style={styles.flatList}
                            ListHeaderComponent={<Header balance={amount}
                                                         value={value}/>}
                            ListEmptyComponent ={<EmptyComponent/>}
                            data={itemList}
                            renderItem={this.renderItem}
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
            </View>
        )
    }
}