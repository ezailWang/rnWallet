import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors,FontSize} from '../config/GlobalConfig'
import {
    View,
    StyleSheet,
    Animated,
    Easing
}from 'react-native'


const styles = StyleSheet.create({
    pointBox:{
        width:8,
        height:8,
        borderRadius: 4,
        borderWidth:1,
        borderColor:Colors.fontBlueColor,
        
    },
    pointBoxUnchecked:{
        backgroundColor:'transparent',
    },
    pointBoxChecked:{
        backgroundColor: Colors.fontBlueColor,
    }
})

export default class PinPoint extends PureComponent{
    constructor(props){
        super(props);
    }
    static propTypes = {
        isChecked: PropTypes.bool.isRequired,
        pointStyle: PropTypes.object, 

    };
    static defaultProps = {
        isChecked:false,
    }


    render(){
        
        return(
            <View style={[styles.pointBox,this.props.pointStyle,this.props.isChecked ? styles.pointBoxChecked : styles.pointBoxUnchecked]}> 
            </View>
        )
    }
}