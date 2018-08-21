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
const styles = StyleSheet.create({
    modeBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        //backgroundColor:'rgba(255,255,155,0.8)',
        backgroundColor:'transparent',
    },
    contentBox:{
        backgroundColor:'white',
        borderRadius:5,
        height:100,
        width:100,
        justifyContent:'center',
        alignItems:'center',
    },
    textBox:{
        textAlign:'center',
        marginTop:12,
    }
    
});

const ANIMATION = ['none','slide','fade']
const SIZES = ['small','normal','large']

export default class LoadingComponent extends PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            visible : false,
        }
    }

    static propTypes = {
        animation:PropTypes.oneOf(ANIMATION),
        size:PropTypes.oneOf(SIZES),
        overlayColor:PropTypes.string,
        contentStyle:PropTypes.object,
        loadingColor:PropTypes.string,
        textContent:PropTypes.string,
        fontSize:PropTypes.number,
        fontColor:PropTypes.string,
    }

    static defaultProps = {
        animation:'none', //Modal是否需要动画 {'none','slide','fade'}
        overlayColor: 'transparent',//'rgba(0, 0, 0, 0.8)', //背景颜色
        contentStyle:{},//圈圈背景样式
        size:'large',//圈圈的大小，{'small','normal','large'}
        loadingColor: Colors.themeColor,//圈圈的颜色
        textContent:'Loading...',//显示的文字
        fontSize:14,//字体大小
        fontColor:Colors.themeColor,//字体颜色
    }

    componentWillReceiveProps(nextProps){
        const {visible} = nextProps;
        this.setState({visible:nextProps.visible})
    }

    close(){
        if(Platform.OS === 'android'){
            setTimeout(()=>{
                this.setState({
                    visible : false,
                })
            },1000);
        }else{
            this.setState({
                visible : false,
            })
        }   
    }
    show(){
        this.setState({
            visible : true,
        })
    }

    renderContent(){
        return (
            <View style={[styles.modeBox,{backgroundColor:this.props.overlayColor}]}>
                <View style={[styles.contentBox,this.props.contentStyle]}>
                    <ActivityIndicator
                        animating={true}
                        color={this.props.loadingColor}
                        size={this.props.size}
                        /**style={{
                            width:80,
                            height:80,
                        }}**/
                    />
                    <Text style={[styles.textBox,{color:this.props.fontColor,fontSize:this.props.fontSize}]}>{this.props.textContent}</Text>      
                    </View> 
            </View>     
        )
    }

    render(){
        const {visible} = this.props;
       /** if(!visible){
            return null;
        }**/
        return(
            <Modal
                  animationType={this.props.animation}
                  transparent={true}
                  visible={visible}
                  onRequestClose={()=>{
                      //this.close()
                      console.log('L','Loading onRequestClose')
                  }}
                  onShow={()=>{
                    //this.show()
                    console.log('L','Loading onShow')
                  }}     
            >
                {this.renderContent()}
            </Modal>      

        );
    }
}

