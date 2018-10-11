import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Animated
} from 'react-native'
import layoutConstants from '../../../config/LayoutConstants'
import { Colors } from '../../../config/GlobalConfig'

MIN_HEIGHT = 65
MAX_HEIGHT = 80

class AddTokenInput extends Component {

    render() {
        return (
            <Animated.View style={[styles.container, this.props.inputStyle, { height: this.props.checkTextColor === Colors.clearColor ? MIN_HEIGHT : MAX_HEIGHT }]}>
                <Text style={{ height: 15, marginLeft: 20, fontSize: 14, color: Colors.addTokenLeftTitleColor }}>{this.props.title}</Text>
                <TextInput style={styles.TextInput}
                    placeholderTextColor = {Colors.fontGrayColor_a0}
                    onChange={this.props.onChange}
                    keyboardType={this.props.keyboardType}
                    returnKeyType={this.props.returnKeyType}
                    ref={this.props.ref}
                    onFocus={this.props.onFocus}
                />
                <Text style={[{ height: 20, alignSelf: 'flex-end', color: this.props.checkTextColor, marginHorizontal: 20, fontSize: 12 }]}
                    >{this.props.checkText}</Text>
            </Animated.View>
        )
    }
}

export default AddTokenInput

const styles = StyleSheet.create({
    container: {
        width: layoutConstants.WINDOW_WIDTH,
        backgroundColor: 'white',
        // justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 5,
    },
    TextInput: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: Colors.addTokenBorderColor,
        borderRadius: 5,
        height: 40,
        width: layoutConstants.WINDOW_WIDTH - 40,
        marginLeft: 20,
        paddingHorizontal: 10,
        paddingVertical: 0
    },

})