import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image
} from 'react-native'
import PropTypes from 'prop-types'
import Layout from '../../../config/LayoutConstants'

export default class OvalButton extends Component {

    static propTypes = {
        onClick: PropTypes.func.isRequired,
        showText: PropTypes.string.isRequired,
        renderIcon: PropTypes.number.isRequired,
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onClick}>
                <Image style={styles.image} source={this.props.renderIcon} />
                <Text style={styles.text}>{this.props.showText}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: Layout.WINDOW_WIDTH * 0.28,
        height: 30,
        backgroundColor: 'transparent',
        borderRadius: 18,
        borderColor: '#7FCEF2',
        borderWidth: 1.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin:10
    },
    image: {
       // width: 20,
       // height: 20,
        marginRight:5
    },
    text: {
        color: 'white',
        //fontSize: 12
    }

})