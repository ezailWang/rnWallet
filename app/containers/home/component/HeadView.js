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
import { I18n } from '../../../config/language/i18n'

export default class HeadView extends Component {

    static propTypes = {
        onQRCode: PropTypes.func.isRequired,
        onAddAssets: PropTypes.func.isRequired,
        walletName: PropTypes.string,
        address: PropTypes.string,
        totalAssets: PropTypes.string,
    }

    static defaultProps = {
        hideAssetsIcon: layoutConstants.DEFAULT_IAMGE,
        QRCodeIcon: layoutConstants.DEFAULT_IAMGE,
        addAssetsIcon: layoutConstants.DEFAULT_IAMGE
    }

    render() {
        return (
            <View
                style={styles.container}>
                {/* <View style={styles.topViewContainer}>
                </View> */}
                <View style={styles.assetsContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, color: 'white' }}> {I18n.t('home.total_assets')} </Text>
                        <ImageButton
                            btnStyle={{ marginLeft: 5 }}
                            imageStyle={{ width: 17, height: 11 }}
                            onClick={this.props.onHideAssets}
                            backgroundImageSource={this.props.hideAssetsIcon}
                        />
                    </View>
                    <Text style={{ fontSize: 30, color: 'white' }}> {this.props.totalAssets} </Text>
                </View>
                <View style={styles.addressContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}> {this.props.walletName} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 12, marginTop: 2 }}> {this.props.address} </Text>
                        <ImageButton
                            btnStyle={{ marginLeft: 8 }}
                            imageStyle={{ width: 13, height: 13 }}
                            onClick={this.props.onQRCode}
                            backgroundImageSource={this.props.QRCodeIcon}
                        />
                    </View>
                </View>
                <View style={styles.bottomAddAssetsContainer}>
                    <Text style={{ fontSize: 17, marginLeft: 23, color: Colors.homeAssetsTestColor, fontWeight: '300' }}> {I18n.t('home.assets')} </Text>
                    <ImageButton
                        btnStyle={{ width: 30, height: 30, marginRight: 18 }}
                        onClick={this.props.onAddAssets}
                        backgroundImageSource={this.props.addAssetsIcon}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        height: layoutConstants.HOME_HEADER_CONTENT_HEIGHT,
    },
    assetsContainer: {
        backgroundColor: 'transparent',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        marginLeft: 23,
    },
    addressContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        marginLeft: 23,

    },
    bottomAddAssetsContainer: {
        backgroundColor: 'white',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    }

})
