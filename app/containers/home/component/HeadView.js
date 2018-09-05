import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native'
import PropTypes from 'prop-types'
import OvalButton from './OvalButton'
import ImageButton from '../../../components/ImageButton'
import layoutConstants from '../../../config/LayoutConstants'
import { Colors } from '../../../config/GlobalConfig'
import LinearGradient from 'react-native-linear-gradient'

export default class HeadView extends Component {

    static propTypes = {
        // onSwitchWallet: PropTypes.func.isRequired,
        onSet: PropTypes.func.isRequired,
        onQRCode: PropTypes.func.isRequired,
        onAddAssets: PropTypes.func.isRequired,
        walletName: PropTypes.string,
        address: PropTypes.string,
        totalAssets: PropTypes.string,

    }

    static defaultProps = {
        switchWalletIcon: layoutConstants.DEFAULT_IAMGE,
        headIcon: layoutConstants.DEFAULT_IAMGE,
        setBtnIcon: layoutConstants.DEFAULT_IAMGE,
        QRbtnIcon: layoutConstants.DEFAULT_IAMGE,
        addAssetsIcon: layoutConstants.DEFAULT_IAMGE
    }

    render() {
        return (
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
                <View style={styles.topViewContainer}>
                </View>
                <View style={styles.headContainer}>
                    <Image
                        style={{ width: 50, height: 50, marginLeft: 25, borderRadius: 25 }}
                        source={this.props.headIcon}
                    />
                    <View style={{ margin: 10, backgroundColor: 'transparent' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}> {this.props.walletName} </Text>
                            {/* <ImageButton
                                btnStyle={{ width: 15, height: 15 }}
                                imageStyle={{ width: 15, height: 15 }}
                                onClick={this.props.onSwitchWallet}
                                backgroundImageSource={this.props.switchWalletIcon}
                            /> */}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <Text style={{ color: 'white', fontSize: 12 }}> {this.props.address} </Text>
                            <ImageButton
                                btnStyle={{ width: 15, height: 15 }}
                                imageStyle={{ width: 15, height: 15 }}
                                onClick={this.props.onAddressCopy}
                                backgroundImageSource={this.props.addressCopyIcon}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.assetsContainer}>
                    <Text style={{ fontSize: 15, color: 'white' }}> 总资产 </Text>
                    <Text style={{ fontSize: 40, color: 'white' }}> ${this.props.totalAssets} </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <OvalButton
                        onClick={this.props.onSet}
                        showText="设置"
                        renderIcon={this.props.setBtnIcon}
                    />
                    <OvalButton
                        onClick={this.props.onQRCode}
                        showText="二维码"
                        renderIcon={this.props.QRbtnIcon}
                    />
                </View>
                <View style={styles.bottomAddAssetsContainer}>
                    <Text style={{ marginLeft: 10, color: 'rgb(30,174,245)' }}> 资产 </Text>
                    <ImageButton
                        btnStyle={{ marginRight: 10 }}
                        onClick={this.props.onAddAssets}
                        backgroundImageSource={this.props.addAssetsIcon}
                    />
                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        height: layoutConstants.HOME_HEADER_HEIGHT,
    },
    topViewContainer: {
        backgroundColor: 'transparent',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end'
    },
    headContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT

    },
    assetsContainer: {
        backgroundColor: 'transparent',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomAddAssetsContainer: {
        backgroundColor: 'rgb(247,248,249)',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }

})
