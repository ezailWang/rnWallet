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
                    <TouchableOpacity style={styles.assetsBox} onPress = {this.props.onHideAssets} activeOpacity={1}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, color: 'white' ,}}> {I18n.t('home.total_assets')} </Text>
                        <ImageButton
                            btnStyle={{ marginLeft: 5 }}
                            imageStyle={{ width: 17, height: 11 }}
                            onClick={this.props.onHideAssets}
                            backgroundImageSource={this.props.hideAssetsIcon}
                        />
                    </View>
                    <Text style={{ fontSize: 39, color: 'white', fontWeight:'700' ,marginLeft:-3,paddingLeft:0}}> {this.props.totalAssets} </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.addressContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17.3 }}> {this.props.walletName} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={{ color: 'white', fontSize: 12,}}> {this.props.address} </Text>
                        <ImageButton
                            btnStyle={{width: 30, height:22,paddingRight:10,}}
                            imageStyle={{ width: 13, height: 13 }}
                            onClick={this.props.onQRCode}
                            backgroundImageSource={this.props.QRCodeIcon}
                        />
                    </View>
                </View>
                <View style={styles.bottomAddAssetsContainer}>
                    <Text style={{ fontSize: 14, marginLeft: 21, color: Colors.homeAssetsTestColor, fontWeight: '600' }}> {I18n.t('home.assets')} </Text>
                    <ImageButton
                        btnStyle={{ width: 32, height: 32, marginRight: 18 }}
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
        marginLeft: 21,
    },
    assetsBox:{
        backgroundColor: 'transparent',
    },
    addressContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: layoutConstants.HOME_HEADER_LADDER_HEIGHT,
        marginLeft: 21,

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
