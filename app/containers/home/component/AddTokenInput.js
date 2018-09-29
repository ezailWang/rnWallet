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

MIN_HEIGHT = 80
MAX_HEIGHT = 100

class AddTokenInput extends Component {

    render() {
        return (
            <Animated.View style={[styles.container,this.props.inputStyle, {height:this.props.checkTextColor === Colors.clearColor ? MIN_HEIGHT : MAX_HEIGHT}]}>
                <Text style={{ marginLeft: 20, fontSize: 14, color: Colors.addTokenLeftTitleColor }}>{this.props.title}</Text>
                <TextInput style={styles.TextInput}
                    onChange={this.props.onChange}
                    keyboardType={this.props.keyboardType}
                    returnKeyType={this.props.returnKeyType}
                    ref={this.props.ref}
                    onFocus={this.props.onFocus}
                />
                <Text style={[{ alignSelf: 'flex-end', color: this.props.checkTextColor, marginHorizontal: 20, fontSize: 12 }]}>{this.props.checkText}</Text>
            </Animated.View>
        )
    }
}

export default AddTokenInput

const styles = StyleSheet.create({
    container: {
        width: layoutConstants.WINDOW_WIDTH,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 10,
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