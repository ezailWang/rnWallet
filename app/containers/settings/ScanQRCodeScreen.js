import React, {Component,} from 'react'
import {View, StyleSheet, Alert} from 'react-native'

import BarCode from 'react-native-smart-barcode'
 
//https://www.jianshu.com/p/8e8bc89bfe2c
const styles = StyleSheet.create({
    container:{
       flex:1,
       backgroundColor:'#000',
    },
    barCode:{
        flex:1,
    }
});


export default class ScanQRCodeScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            viewAppear:false,
        }
    }

    componentDidMount(){
        //启动定时器
        this.timer = setTimeout(
            () => this.setState({viewAppear: true}),
            256
        );
        //this._listeners = [
        //    this.props.navigator.navigationContext.addListener('didfocus',viewAppearCallBack)
        //]
    }

    componentWillUnmount(){
       // this._listeners && this._listeners.forEach(listener => listener.remove());
       this.timer && clearTimeout(this.timer)
    }

    _onBarCodeRead = (e) => {
        //e.nativeEvent.data.type
        //e.nativeEvent.data.code
        
        this._stopScan()
        Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
            {text: 'OK', onPress: () => this._startScan()},
        ])
        return e.nativeEvent.data.code;
    }
    _startScan = (e) =>{
        this._barCode.startScan()
    }
    _stopScan = (e) =>{
        this._barCode.stopScan()
    }

    render(){
        return (
        <View style={styles.container}>
            {
                this.state.viewAppear ?
                <BarCode style={styles.barCode}
                     scannerRectWidth={220}
                     scannerRectHeight={220}
                     //scannerRectCornerColor='rgb(85,146,246)'
                     ref={ component => this._barCode = component }
                     onBarCodeRead={this._onBarCodeRead}>
                </BarCode> :
                null
            }

        </View>
        )
    }
}