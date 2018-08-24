import React, { Component } from 'react'
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { Colors, Network } from '../../../config/GlobalConfig'
import layoutConstants from '../../../config/LayoutConstants'
import networkManage from '../../../utils/networkManage'
import { store } from '../../../config/store/ConfigureStore'

export default class ChangeNetwork extends Component {

    render() {
        const { network } = store.getState().Core
        return (
            <Modal
                visible={this.props.open}
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => { alert("Modal has been closed.") }}
                style={{ backgroundColor: Colors.blackOpacityColor }}
            >
                <View style={styles.container}
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={this.props.close}
                >
                    <View style={styles.contentContainer}>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => {
                                this.props.onClick(Network.main)
                            }}
                        >
                            <View
                                style={styles.roundView}
                                opacity={network === Network.main ? 1 : 0}
                            />
                            <Text style={[styles.textView,{color:network === Network.main ? Colors.themeColor:Colors.fontGrayColor}]}>{Network.main}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => {
                                this.props.onClick(Network.ropsten)
                            }}
                        >
                            <View
                                style={styles.roundView}
                                opacity={network === Network.ropsten ? 1 : 0}
                            />
                            < Text style={[styles.textView,{color:network === Network.ropsten ? Colors.themeColor:Colors.fontGrayColor}]}>{Network.ropsten}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => {
                                this.props.onClick(Network.kovan)
                            }}
                        >
                            <View
                                style={styles.roundView}
                                opacity={network === Network.kovan ? 1 : 0}
                            />
                            <Text style={[styles.textView,{color:network === Network.kovan ? Colors.themeColor:Colors.fontGrayColor}]}>{Network.kovan}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => {
                                this.props.onClick(Network.rinkeby)
                            }}
                        >
                            <View
                                style={styles.roundView}
                                opacity={network === Network.rinkeby ? 1 : 0}
                            />
                            <Text style={[styles.textView,{color:network === Network.rinkeby ? Colors.themeColor:Colors.fontGrayColor}]}>{Network.rinkeby}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row-reverse',
        backgroundColor: Colors.blackOpacityColor
    },
    contentContainer: {
        backgroundColor: Colors.whiteBackgroundColor,
        height: 200,
        width: 200,
        marginTop: 100,
        marginRight: 50,
        alignItems: 'stretch',
    },
    Btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 50,
        width: 200,
        backgroundColor: Colors.whiteBackgroundColor,
    },
    roundView: {
        backgroundColor: Colors.themeColor,
        marginLeft: 20,
        width: 10,
        height: 10,
        borderRadius: 5
    },
    textView: {
        fontWeight: 'bold',
        fontSize: 15,
        marginRight: 20,
    }
})