import React, { Component } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'

export default class ImageButton extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        backgroundImageSource: PropTypes.number.isRequired,
    }
    render() {
        return (
            <TouchableOpacity
                style={[styles.btnDefaultStyle, this.props.btnStyle]}
                onPress={this.props.onClick}
            >
                <Image
                    style={[styles.backgroundImageStyle,this.props.imageStyle]}
                    source={this.props.backgroundImageSource}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    btnDefaultStyle: {
        width: 20,
        height: 20,
    },
    backgroundImageStyle: {
        width:20,
        height:20,
    }
})