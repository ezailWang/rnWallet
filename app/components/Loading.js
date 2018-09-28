import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing,
    Modal,
    Button,
    ActivityIndicator,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';
import {Colors,FontSize} from '../config/GlobalConfig'
import loadingImage from '../assets/common/loadingIcon.png'

let lastBackTime = 0;

const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',
        //zIndex:10,
    },
    modeContent:{
        backgroundColor:'rgba(246,246,246,0.6)',
        width:130,
        height:150,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
    },
    animationImg:{
        width:68,
        height:77,
    },
    text:{
        marginTop:10,
        color:Colors.fontBlueColor1,
        fontSize:15,

    }
    
});
export default class Loading extends PureComponent{
    
    constructor(props){
        super(props);
        
        this.isAnimation = true;//是否执行动画
        this.rotateValue = new Animated.Value(0);
        this.animationLoading = Animated.timing(
            this.rotateValue,
            {
                toValue:360,
                duration:900,
                easing:Easing.linear
            }
        );
    }
    static propTypes = {
        visible:PropTypes.bool.isRequired,
    }

    static defaultProps = {
        visible:false,
    }
   
    componentDidMount(){
        //组件加载完成后启动动画
        this.startAnimation();
    }
    startAnimation(){
        console.log('L_isAnimation',this.isAnimation)
        if(this.isAnimation){
            this.rotateValue.setValue(0);
            this.animationLoading.start(()=>this.startAnimation());//循环旋转
        }
        //Animated.loop(animationLoading).start();//开始动画
        //setTimeout(Animated.loop(animationLoading).stop, 5000); // 5秒后停止动画，可用于任意时刻停止动画
    }

    componentWillReceiveProps(nextProps){
        const {visible} = nextProps;
        console.log('L_ReceiveProps',visible)
        console.log('L_time',Date.now()-lastBackTime)
        lastBackTime = Date.now();
        
        if(visible){
            console.log('L_ReceiveProps','循环动画')
            this.isAnimation = true;//循环动画
        }else{
            console.log('L_ReceiveProps','停止动画')
            this.isAnimation = false;//停止动画
        }
    }
    
    render(){
        console.log('L_render','Loading消失')
        const {visible} = this.props;
        /*if(!visible){
            return null;
        }*/
       
        const animatedTransform = {
            transform:[
                {rotateY: this.rotateValue.interpolate(
                         {  inputRange: [0, 360],
                            outputRange: ['0deg', '360deg']
                         })
                }  
            ]
        };
        return(
            <Modal
                  animationType={'none'}
                  transparent={true}
                  visible={visible}
                  onRequestClose={()=>{
                     //Alert.alert("Modal has been closed.");
                  }}
                  onShow={()=>{
                     //Alert.alert("Modal has been show.");
                  }}
            >
                <View style={styles.modeBox}>
                        <View style = {styles.modeContent}>
                             <Animated.Image style = {[animatedTransform,styles.animationImg]} source = {loadingImage} resizeMode={'contain'}/>
                             <Text style={styles.text}>Loading</Text>
                        </View>
                </View>     
            </Modal>      

        );
    }
}