import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Color,
    TouchableOpacity,
} from 'react-native'
import layoutConstants from '../../../config/LayoutConstants'

tokeniCon = {
    'ETH' : require('../../../assets/home/ETH.png'),
    'ITC' : require('../../../assets/home/ITC.png'),
    'MANA' : require('../../../assets/home/MANA.png'),
    'DPY' : require('../../../assets/home/DPY.png'),
}


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
        const { symbol, balance } = this.props.item.item || {}
        var imageSource = require('../../../assets/home/null.png')
        if (symbol === 'ETH' || symbol === 'ITC' || symbol === 'MANA' || symbol === 'DPY') {
            imageSource = tokeniCon[symbol]
        }
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.props.onClick}
            >
                <View style={styles.leftView}>
                    <Image style={styles.icon}
                        source={imageSource}
                    ></Image>
                    <Text>{symbol}</Text>
                </View>
                <View style={styles.rightView}>
                    <Text 
                    style={{fontSize:20}}
                    >{balance}</Text>
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
        height: 60,
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
        width: 24,
        height: 24,
        backgroundColor: 'transparent',
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