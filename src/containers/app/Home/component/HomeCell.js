import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Color,
    TouchableOpacity,
} from 'react-native'
import layoutConstants from '../../../../config/layoutConstants'

class ItemDivideComponent extends Component {
    render() {
        return (
            <View style={styles.separator} />
        );
    }
}

class EmptyComponent extends Component {
    render() {
        return (
            <View style={styles.emptyView}>
                <Text style={{ fontSize: 20 }}>还没有资产哦~</Text>
            </View>
        )
    }
}

class HomeCell extends Component {
    render() {
        const { name, value } = this.props.item.item || {}
        return (
            <TouchableOpacity 
            style={styles.container}
            onPress={this.props.onClick}
            >
                <View style={styles.leftView}>
                    <Image style={styles.icon}></Image>
                    <Text>{name}</Text>
                </View>
                <View style={styles.rightView}>
                    <Text>{value}</Text>
                    <Text>≈888</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
    },
    leftView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    rightView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    separator: {
        flex: 1,
        backgroundColor: 'rgb(247,248,249)',
        height: 10,
    },
    icon: {
        width: 20,
        height: 20,
        backgroundColor: 'black',
        borderRadius: 10,
        marginRight: 10
    },
    emptyView: {
        flex: 1,
        height: layoutConstants.WINDOW_HEIGHT - layoutConstants.HOME_HEADER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export { ItemDivideComponent, HomeCell, EmptyComponent }