import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Text,Image } from 'react-native';


const styles = StyleSheet.create({
    btnOpacity:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:40,
        backgroundColor: 'transparent',
        marginLeft:18,
        marginRight:18,
    },
    txt:{
        backgroundColor: 'transparent',
        color:'rgb(85,146,246)',
        fontSize:15,
        height:40,
        lineHeight:40,
        textAlign:'center',
    },
    img:{
        height:26,
        width:26,
    }
    
});

class Class {

}

export default class HeaderButton extends Component {
    /**static propTypes = {
        onPress: {},
        text: '',
        img:'',
    }**/
    render() {
        return (
            <TouchableOpacity style={[styles.btnOpacity]} activeOpacity={0.6} onPress = { this.props.onPress }>
            {
                this.props.img ? 
                <Image style={styles.img} source={this.props.img}/> :
                <Text style={styles.txt}>{this.props.text}</Text>
            }   
            </TouchableOpacity>
        )
    }
}
