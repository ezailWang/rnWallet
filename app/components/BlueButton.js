import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Text } from 'react-native';


const styles = StyleSheet.create({
    btnOpacity:{
        height:40,
        alignSelf:'stretch',
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

export default class BlueButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        return (
            <TouchableOpacity style={[styles.btnOpacity]} activeOpacity={0.6} onPress = { this.props.onPress }>
                <Text style={styles.txt}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}