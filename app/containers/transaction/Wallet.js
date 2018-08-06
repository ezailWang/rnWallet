import React,{PureComponent} from 'react'

import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    View
} from 'react-native'

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
    },
    newTextStyle:{
        fontSize:20,
        color:"white"
    },
    ViewForTextStyle:{
        height:50,
        width:ScreenWidth/3,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'blue',
        marginTop:100,
    }
});

import {store} from '../../config/store/ConfigureStore'
import {setTransactionDetailParams, setWalletTransferParams} from "../../config/action/Actions";

export default class Wallet extends PureComponent{

    constructor(props){
        super(props);
    }

    transferProps = {
        transferType:"ETH",
        balance:77.77,
        suggestGasPrice:5,
        ethPrice:3000.12,
        fromAddress:"0x6043a81ae4A052381b21aac944DE408C809f0774"
    };

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

    render(){

        return(

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.ViewForTextStyle}
                    onPress={() =>{
                       store.dispatch(setWalletTransferParams(this.transferProps));
                       this.props.navigation.navigate('Transaction',props={transferType:"ETH"});
                    }}>
                    <Text style={styles.newTextStyle}>转账页面</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ViewForTextStyle}
                    onPress={() =>{
                        store.dispatch(setTransactionDetailParams(this.transactionDetail));
                        this.props.navigation.navigate('TransactionDetail');
                    }}>
                    <Text style={styles.newTextStyle}>转账记录页面</Text>
                </TouchableOpacity>
            </View>
        )
    }
}