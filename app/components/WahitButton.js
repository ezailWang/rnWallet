import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View,StyleSheet, TouchableOpacity, Text } from 'react-native';


const styles = StyleSheet.create({
    btnOpacity:{
        height:40,
        borderRadius:20,
        borderColor:'#fff',
        borderWidth:1,
        alignSelf:'stretch',
        backgroundColor: 'rgb(85,146,246)',
        marginBottom:20,
    },
    txt:{
        color:'#fff',
        fontSize:16,
        lineHeight:40,
        textAlign:'center',
    }
});

export default class WhiteButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }
    render() {
        return (
            <TouchableOpacity style={styles.btnOpacity} activeOpacity={0.6} onPress = { this.props.onPress }>
                <Text style={styles.txt}>{this.props.text}</Text>
            </TouchableOpacity> 
        )
    }
}