import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Text ,Image} from 'react-native';


const styles = StyleSheet.create({
    btnOpacity:{
        flexDirection:'row',
        height:56,
        alignSelf:'stretch',
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:20,
        paddingRight:20,
    },
    txt:{
        flex:1,
        backgroundColor: 'transparent',
        color:'rgb(87,87,87)',
        fontSize:16,
        height:56,
        lineHeight:56,
        textAlign:'left',
    },
    icon:{
        width:10,
    }
});

export default class NextButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        return (
            <TouchableOpacity style={[styles.btnOpacity]} activeOpacity={0.6} onPress = { this.props.onPress }>
                <Text style={styles.txt}>{this.props.text}</Text>
                <Image style={styles.icon} source={require('../../img/nextIcon.jpg')}/>
            </TouchableOpacity>
        )
    }
}