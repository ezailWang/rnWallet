import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native'
import layoutConstants from '../../../config/LayoutConstants'
import { Colors } from '../../../config/GlobalConfig'

class AddTokenInput extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ marginLeft: 20, fontSize: 16 }}>{this.props.title}</Text>
                <TextInput style={styles.TextInput}
                    onChange={this.props.onChange}
                    keyboardType={this.props.keyboardType}
                    returnKeyType={this.props.returnKeyType}
                    ref={this.props.ref}
                />
                <Text style={[{ alignSelf: 'flex-end', color: this.props.checkTextColor, marginHorizontal: 20, fontSize: 14 }]}>{this.props.checkText}</Text>
            </View>
        )
    }
}

export default AddTokenInput

const styles = StyleSheet.create({
    container: {
        width: layoutConstants.WINDOW_WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    TextInput: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: Colors.bgGrayColor,
        borderRadius: 5,
        height: 40,
        width: layoutConstants.WINDOW_WIDTH - 40,
        marginLeft: 20,
        paddingHorizontal: 10,
        paddingVertical: 0
    },

})