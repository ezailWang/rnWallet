import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Text,Alert } from 'react-native';


const styles = StyleSheet.create({
    btnOpacity:{
        height:40,
        alignSelf:'stretch',
        borderColor:'transparent',
        borderWidth:1,
        borderRadius:20,
        backgroundColor: 'rgb(85,146,246)',
    },
    txt:{
        backgroundColor: 'transparent',
        color:'#fff',
        fontSize:16,
        height:40,
        lineHeight:40,
        textAlign:'center',
    }
});

export default class CommonButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        bgColor:PropTypes.number,
        fontColor:PropTypes.number,
        height:PropTypes.number,
        fontSize:PropTypes.number,
        borderColor:PropTypes.number,
    }
    render() {
        return (
            <TouchableOpacity 
               style={[styles.btnOpacity,
                       this.props.bgColor == undefined ? {}: {backgroundColor:this.props.bgColor},
                       this.props.borderColor == undefined ? {}: {borderColor:this.props.borderColor},
                       this.props.height == undefined ? {}: {height:this.props.height},
                       ]
                    } 
                activeOpacity={0.6} 
                onPress = { this.props.onPress }>
                <Text style={[styles.txt,
                              this.props.fontColor == undefined ? {}: {color:this.props.fontColor},
                              this.props.height == undefined ? {}: {height:this.props.height},
                              this.props.lineHeight == undefined ? {}: {lineHeight:this.props.height},
                              this.props.fontSize == undefined ? {}: {fontSize:this.props.fontSize},
                              ]}>{this.props.text}
                </Text>
            </TouchableOpacity>
        )
    }
}