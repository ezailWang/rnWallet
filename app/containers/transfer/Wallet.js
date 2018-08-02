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
import {setWalletTransferParams} from "../../config/action/Actions";

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

    render(){

        return(

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.ViewForTextStyle}
                    onPress={() =>{
                       store.dispatch(setWalletTransferParams(this.transferProps));
                       this.props.navigation.navigate('Transfer',props={transferType:"ETH"});
                    }}>
                    <Text style={styles.newTextStyle}>进入转账页面</Text>
                </TouchableOpacity>
            </View>
        )
    }
}