import React, { Component } from 'react'
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native'
import { Colors } from '../../config/GlobalConfig'
import layoutConstants from '../../config/LayoutConstants'
import ImageButton from '../../components/ImageButton'
import { black } from '../../../node_modules/ansi-colors';

export default class AddToken extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tokenAddress:'',
            tokenSymbol:'',
            tokenDecimals:0,
        }
    }
    render() {
        return (
            <Modal
                visible={this.props.open}
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => { alert("Modal has been closed.") }}
                style={{ backgroundColor: Colors.blackOpacityColor }}
            >
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <View style={styles.TopContainer}>
                            <Text style={styles.TopText}> 添加资产 </Text>
                            <ImageButton
                                btnStyle={styles.BackBtn}
                                onClick={this.props.close}
                                backgroundImageSource={require('../../assets/home/addTokenBack.png')}
                            />
                        </View>
                        <View style={styles.MiddleContainer}>
                            <TextInput style={styles.TextInput}
                                placeholder='资产名称'
                                onChange={(event)=>{
                                    this.setState({
                                        tokenSymbol:event.nativeEvent.text
                                    })
                                }}
                            />
                            <TextInput style={styles.TextInput}
                                placeholder='合约地址'
                                onChange={(event)=>{
                                    this.setState({
                                        tokenAddress:event.nativeEvent.text
                                    })
                                }}
                            />
                            <TextInput style={styles.TextInput}
                                placeholder='小数精度'
                                onChange={(event)=>{
                                    this.setState({
                                        tokenDecimals:event.nativeEvent.text
                                    })
                                }}
                            />
                        </View>
                        <View style={styles.BottomContainer}>
                            <TouchableOpacity
                                style={styles.BottomBtn}
                                onPress={()=>{
                                    this.props.onClickAdd(this.state)
                                }}
                            >
                                <Text style={{ color: Colors.whiteBackgroundColor, fontWeight: 'bold', fontSize: 15 }}>添加</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blackOpacityColor
    },
    contentContainer: {
        backgroundColor: Colors.whiteBackgroundColor,
        height: layoutConstants.WINDOW_HEIGHT * 0.45,
        width: layoutConstants.WINDOW_WIDTH * 0.84,
        marginTop: layoutConstants.WINDOW_HEIGHT * 0.2,
        alignSelf: 'center',
        alignItems: 'stretch',
    },
    TopContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    MiddleContainer: {
        flex: 3,
    },
    BottomContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    TextInput: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.borderColor_e,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    BottomBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginVertical: 20,
        borderRadius: (layoutConstants.WINDOW_HEIGHT * 0.45 * 1 / 3 - 40) / 2,
        backgroundColor: Colors.themeColor,
    },
    BackBtn: {
        marginRight: 10,
        position: 'absolute',
        right: 10,

    },
    TopText: {
        alignSelf: 'center',
        fontSize: 20
    }
})