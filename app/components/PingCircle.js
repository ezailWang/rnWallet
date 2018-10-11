import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text
}from 'react-native'


const styles = StyleSheet.create({
    circleContainer:{
        width:68,
        height:68,
        alignItems:'center',
        justifyContent:'center'
    },
    circleBox:{
        width:66,
        height:66,
        borderRadius: 33,
        borderWidth:1,
        borderColor:'blue',
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center'
    },
    text1:{
        fontSize:26,
        color:Colors.fontBlackColor_43,
    },
    text2:{
        fontSize:10,
        color:Colors.fontBlackColor_43,
    }
})

export default class PingCircle extends PureComponent{
    static propTypes = {
        text1:PropTypes.number.isRequired,
        text2:PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
        isDisabled : PropTypes.bool,
        circleStyle: PropTypes.object,
    };
    static defaultProps = {
        isDisabled:false
    }

    onPressed=()=>{
        this.props.onPress(this.props.text1)
    }
    render(){
        return(
            <View style={[styles.circleContainer,this.props.circleStyle]}>
                <TouchableOpacity style={[styles.circleBox]}
                              activeOpacity={0.6}
                              disabled={this.props.isDisabled}
                              onPress = {this.onPressed}> 
                    <Text style={styles.text1}>{this.props.text1}</Text>
                    <Text style={styles.text2}>{this.props.text2}</Text>
                </TouchableOpacity>
            </View>
            
        )
    }
}