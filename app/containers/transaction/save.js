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

    render(){
        const {address,time,income,amount,type} = this.props.item.item || {}

        let image = require('../../assets/transfer/recoder/direction_left.png');
        let showText = "-"+amount.toFixed(8)+" "+type;
        let colorStyle = {color:Colors.fontRedColor};

        if(income){
            image = require('../../assets/transfer/recoder/direction_right.png');
            showText = "+"+amount.toFixed(8)+" "+type;
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
                <Text style={[colorStyle,{fontSize:FontSize.DetailTitleSize,marginLeft:10,marginRight:20}]}>
                    {showText}
                </Text>
            </TouchableOpacity>
        )
    }
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
        console.warn("展示二维码");
    };

    didTapTransactionCell=(index)=>{

        console.warn("查看第"+index+"条记录的信息");
    };

    renderItem = (item) => {
        return <Cell item={item}
                     onPress={()=>{this.didTapTransactionCell()}}/>
    }

    render (){

        let testData=[
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:true,amount:10.1,type:"ether"},
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:true,amount:10.1,type:"ether"},
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:false,amount:10.1,type:"ether"},
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:true,amount:10.1,type:"ether"},,
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:false,amount:10.1,type:"ether"},
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:true,amount:10.1,type:"ether"},
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:false,amount:10.1,type:"ether"},
            {address:"0x6043a81ae4A052381b21aac944DE408C809f0774",time:"3/16/2018",income:false,amount:10.1,type:"ether"}
        ];


        let bottomView = {height:60}
        if(Layout.DEVICE_IS_IPHONE_X()){
            bottomView =  {height:80}
        }
        return(
            <View style={styles.container}>
                <FlatList   style={styles.flatList}
                            ListHeaderComponent={<Header balance={0.2368}
                                                         value={1439.125}/>}
                            ListEmptyComponent ={<EmptyComponent/>}
                            data={testData}
                            renderItem={this.renderItem}>
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