import React, {Component,} from 'react'
import {StyleSheet,
    TouchableOpacity,
    View,
    Text,
    InteractionManager,
    Animated,
    Easing,
    Platform,
    Image,
    Alert} from 'react-native'
import Camera from 'react-native-camera';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import { connect } from 'react-redux';
import StorageManage from '../../utils/StorageManage'
import * as Actions from '../../config/action/Actions'
import StatusBarComponent from '../../components/StatusBarComponent';
import {Colors,FontSize} from '../../config/GlobalConfig'
import {showToast} from '../../utils/Toast';
import {WhiteBgHeader} from '../../components/NavigaionHeader'
const styles = StyleSheet.create({
    container:{
       flex:1,
    },
    contentContainer:{
        flex:1,
        backgroundColor:'#000',
        justifyContent:'center',
        alignItems:'center',
    },
    scanView:{
        width:200,
        height:200,
        backgroundColor:'transparent'
    },
    scanBorder:{
        position: 'absolute',
        borderColor: 'rgb(85,146,246)',
        width: 200,
        height: 200,
       
    },
    topLeft:{
        borderLeftWidth: 2,
        borderTopWidth: 2,
        top: 0,
        left: 0,
    },
    topRight:{
        borderRightWidth: 2,
        borderTopWidth: 2,
        top: 0,
        right: 0,
    },
    bottomLeft:{
        borderLeftWidth: 2,
        borderBottomWidth: 2,
    },
    bottomRight:{
        borderRightWidth: 2,
        borderBottomWidth: 2,
        bottom: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    scanLine:{
        height:2,
        width:200,
        backgroundColor:'rgb(85,146,246)'
    },
    text:{
        fontSize:15,
        color:'#fff',
        marginTop:12,
    }
    
});


class ScanQRCodeScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            isGetResult:false,//是否获得扫描结果
            isAnimatin:true,//是否需要执行扫描动画
            animatedValue: new Animated.Value(0),
        }
        this.scanLine = Animated.timing(this.state.animatedValue, {
            toValue: 200,
            duration: 2000,
            easing: Easing.linear
        });
    }

    componentDidMount() {
        this.scanLineMove();;
    }
    
    //扫描二维码结果
    _onBarCodeRead(e){
          if(!this.state.isGetResult){//避免多次返回
                this.setState({
                    isGetResult:true,
                    isAnimatin:false,
                })
                var result = e.data;
                console.log('scanResult',result);
                //this.props.navigation.navigate('Transaction',{transferAddress: result})
                this.props.navigation.state.params.callback({toAddress: result});
                //this.props.navigation.state.params.refresh();
                this.props.navigation.goBack()
          }
    }

    //扫描框
    _renderQRScanView(){
        const animatedStyle = {
            transform:[
                {translateY : this.state.animatedValue}
            ]
        };
        return(
            <View style={styles.scanView}>
                <View style={[styles.scanBorder,styles.topLeft]}></View>
                <View style={[styles.scanBorder,styles.topRight]}></View>
                <View style={[styles.scanBorder,styles.bottomLeft]}></View>
                <View style={[styles.scanBorder,styles.bottomRight]}></View>
                <Animated.View style={[animatedStyle,{alignItems:'center'}]}>
                    <View style={styles.scanLine}/>
                </Animated.View>
            </View>
        )
    }

    //扫描条动画
    scanLineMove(){
        if(this.state.isAnimatin){
            this.state.animatedValue.setValue(0);
            this.scanLine.start(()=>this.scanLineMove());//循环扫描
        }
    }

    stopLineMove(){
        this.setState({
            isAnimatin:false
        })
    }

    componentWillUnmount(){
        //this.state.animatedValue.stopAnimation()
        this.stopLineMove();
    }


    render(){
        return(
            <View style={styles.container}>
             <StatusBarComponent/>
             <WhiteBgHeader  navigation={this.props.navigation} text='扫描二维码'/>
             <View style={styles.contentContainer}>
                 <Camera
                      style={styles.scanView}
                      onBarCodeRead={e => this._onBarCodeRead(e)}      
                      aspect={Camera.constants.Aspect.fill}
                 > 
                 {this._renderQRScanView()}
                 </Camera> 
                 <Text style={styles.text}>将二维码放入框内，即可自动扫描</Text>
             </View> 
            </View>
        )
    }
    
}


const mapStateToProps = state => ({
    balance:state.Core.balance,
});

export default connect(mapStateToProps, {})(ScanQRCodeScreen)