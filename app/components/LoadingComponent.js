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
        backgroundColor:'rgba(255,255,155,0.8)',
        zIndex:1000,
    },
    contentBox:{
        height:100,
        justifyContent:'center',
        alignItems:'center',
    },
    textBox:{
        width:220,
        textAlign:'center'
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
        loadingColor:PropTypes.string,
        textContent:PropTypes.string,
        fontSize:PropTypes.number,
        fontColor:PropTypes.string,
    }

    static defaultProps = {
        animation:'none',
        size:'large',
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        loadingColor: 'white',
        textContent:'Loading...',
        fontSize:14,
        fontColor:'white',
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
                <View style={styles.contentBox}>
                    <ActivityIndicator
                        animating={true}
                        color={this.props.loadingColor}
                        size={this.props.size}
                        style={{
                            width:80,
                            height:80,
                        }}/>
                    <Text style={[styles.textBox,{color:this.props.fontColor,fontSize:this.props.fontSize}]}>{this.props.textContent}</Text>      
                    </View> 
            </View>     
        )
    }

    render(){
        const {visible} = this.state;
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

