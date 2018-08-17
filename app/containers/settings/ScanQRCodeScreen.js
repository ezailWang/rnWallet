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
import StatusBarComponent from '../../components/StatusBarComponent';
import {Colors,FontSize} from '../../config/GlobalConfig'
import {showToast} from '../../utils/Toast';
const styles = StyleSheet.create({
    container:{
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


export default class ScanQRCodeScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            animatedValue: new Animated.Value(0),
        }
    }
    componentDidMount() {
        this._scannerLineMove();
    }
    
    //扫描二维码方法
    _onBarCodeRead(e){
         //将返回的结果转为对象
          var result = e.data;
          console.log(e.data);
          showToast('result');
         
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
                <StatusBarComponent/>
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
    _scannerLineMove(){
        this.setState({
            animatedValue: new Animated.Value(0),
        })
        Animated.timing(this.state.animatedValue, {
            toValue: 200,
            duration: 2000,
            easing: Easing.linear
        }).start(()=>this._scannerLineMove());
    }

    componentWillUnmount(){
        
    }
    

    render(){
        return(
            <View style={styles.container}>
                 <Camera
                      style={styles.scanView}
                      onBarCodeRead={e => this._onBarCodeRead(e)}      
                      aspect={Camera.constants.Aspect.fill}
                 > 
                 {this._renderQRScanView()}
                 </Camera> 
                 <Text style={styles.text}>将二维码放入框内，即可自动扫描</Text>
                
            </View>
        )
    }
    
}