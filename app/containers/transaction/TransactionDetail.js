import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Clipboard, Image, Linking, ImageBackground } from 'react-native';
import QRCode from 'react-native-qrcode';
import Layout from '../../config/LayoutConstants'
import { TransparentBgHeader } from '../../components/NavigaionHeader'
import { Colors } from '../../config/GlobalConfig';
import { store } from '../../config/store/ConfigureStore'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'; 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    countBox: {
        flexDirection: 'row',
        //marginTop: Layout.WINDOW_HEIGHT * 0.05,
        marginTop: Layout.WINDOW_HEIGHT * 0.03,
        marginBottom:Layout.WINDOW_HEIGHT * 0.1,
        justifyContent: 'center'
    },

    contentBox: {
        width: Layout.WINDOW_WIDTH * 0.9,
        alignSelf: 'center',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingLeft: 20,
        paddingRight: 20,
       // paddingTop: Layout.WINDOW_HEIGHT * 0.08,
       // paddingBottom: Layout.WINDOW_HEIGHT * 0.07,
        paddingTop: Layout.WINDOW_HEIGHT * 0.07,
        paddingBottom: Layout.WINDOW_HEIGHT * 0.06,
    },
    statusIcon: {
        position: 'absolute',
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginTop: -60,
        zIndex:10,
    },
    countTxt: {
        fontSize: 39,
        color: 'white',
        fontWeight: '700',
    },
    coinTypeTxt: {
        fontSize: 15,
        marginLeft: 6,
        marginBottom: 2,
        color: 'white',
        alignSelf: 'flex-end',
    },
    fontBlue: {
        fontSize: 13,
        color: Colors.fontBlueColor
    },
    fontBlack: {
        fontSize: 13,
        color: Colors.fontBlackColor,
    },
    fontGray: {
        fontSize: 13,
        color: Colors.fontDarkGrayColor,
    },
    marginTop2: {
        //marginTop: Layout.WINDOW_HEIGHT * 0.009,
        marginTop: Layout.WINDOW_HEIGHT * 0.007,
        //marginTop:6
    },
    marginTop10: {
        //marginTop: Layout.WINDOW_HEIGHT * 0.02,
        //marginTop:16
        marginTop: Layout.WINDOW_HEIGHT * 0.016,
    },
    marginTop12: {
        marginTop: Layout.WINDOW_HEIGHT * 0.025,
    },
    bottomBox: {
        flexDirection: 'row',
        //marginTop: Layout.WINDOW_HEIGHT * 0.045,
        marginTop: Layout.WINDOW_HEIGHT * 0.04,
        //marginTop: 35,
    },
    infoLeftBox: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 0
    },
    qrCodeBox: {
        marginLeft: 20,
    },
    copyBtn: {
        height: 29,
        marginTop: Layout.WINDOW_HEIGHT * 0.02,
        //marginTop: 16,
        borderRadius: 5,
        borderWidth: 1.2,
        borderColor: Colors.themeColor
    },
    copyBtnTxt: {
        backgroundColor: 'transparent',
        color: Colors.themeColor,
        fontSize: 13,
        height: 29,
        lineHeight: 29,
        textAlign: 'center',
    },
})

export default class TransactionDetail extends BaseComponent {

    constructor(props) {
        super(props);

        this.copyUrl = this.copyUrl.bind(this);

        let params = store.getState().Core.transactionDetail;

        this.state = {
            amount: params.amount,
            transactionType: params.transactionType,
            fromAddress: params.fromAddress,
            toAddress: params.toAddress,
            gasPrice: params.gasPrice,
            remark: params.remark,
            transactionHash: params.transactionHash,
            blockNumber: params.blockNumber,
            transactionTime: params.transactionTime,
            tranStatus:params.state
        };
        this._setStatusBarStyleLight()
    }


    didTapTransactionNumber = () => {

        var baiduURL = 'https://rinkeby.etherscan.io/tx/' + this.state.transactionHash;
        // var baiduURL = 'https://etherscan.io/tx/'+ this.state.transactionHash;

        Linking.canOpenURL(baiduURL).then(supported => {
            if (!supported) {
                console.warn('Can\'t handle url: ' + baiduURL);
            } else {
                return Linking.openURL(baiduURL);
            }
        }).catch(err => console.error('An error occurred', baiduURL));
    }

    copyUrl() {
        Clipboard.setString(this.state.transactionHash);
        showToast(I18n.t('toast.copied'));
    }

    renderComponent() {
        let statusIcon
        if (this.state.tranStatus == "0") {
            statusIcon = require('../../assets/transfer/trans_ok.png')
        } else if (this.state.tranStatus == "2") {
            statusIcon = require('../../assets/transfer/trans_ing.png')
        } else if (this.state.tranStatus == "1") {
            statusIcon = require('../../assets/transfer/trans_fail.png')
        }

        // console.log(this.state.tranStatus)
        return (
            <ImageBackground style={styles.container} source={require('../../assets/launch/splash_bg.png')}>
                <TransparentBgHeader navigation={this.props.navigation} text={I18n.t('transaction.transaction_details')} />
                <View style={styles.countBox}>
                    <Text style={styles.countTxt}>{this.state.amount}</Text>
                    <Text style={styles.coinTypeTxt}>{this.state.transactionType}</Text>
                </View>
                <View style={styles.contentBox}>
                    <View style={styles.content}>

                        <Text style={[styles.fontGray]}>{I18n.t('transaction.sending_party')}</Text>
                        <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.fromAddress}</Text>

                        <Text style={[styles.fontGray, styles.marginTop10]}>{I18n.t('transaction.beneficiary')}</Text>
                        <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.toAddress}</Text>

                        <Text style={[styles.fontGray, styles.marginTop10]}>{I18n.t('transaction.miner_cost')}</Text>
                        <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.gasPrice + " gwei"}</Text>

                        <View style={styles.bottomBox}>
                            <View style={styles.infoLeftBox}>
                                <Text style={[styles.fontGray]}>{I18n.t('transaction.transaction_number')}</Text>
                                <TouchableOpacity style={[styles.marginTop2]} activeOpacity={0.6} onPress={this.didTapTransactionNumber}>
                                    <Text style={[styles.fontBlue]}
                                        numberOfLines={1}
                                        ellipsizeMode={"middle"}>{this.state.transactionHash}</Text>
                                </TouchableOpacity>
                                <Text style={[styles.fontGray, styles.marginTop10]}>{I18n.t('transaction.block')}</Text>
                                <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.blockNumber}</Text>
                                <Text style={[styles.fontGray, styles.marginTop10]}>{I18n.t('transaction.transaction_time')}</Text>
                                <Text style={[styles.fontBlack, styles.marginTop2]}>{this.state.transactionTime}</Text>
                            </View>
                            <View style={[styles.qrCodeBox, { marginTop: 6 }]}>
                                <QRCode
                                    value={this.state.transactionHash}
                                    size={96}
                                    bgColor='#000'
                                    fgColor='#fff'
                                    onLoad={() => { }}
                                    onLoadEnd={() => { }}
                                />
                                <TouchableOpacity style={[styles.copyBtn]} activeOpacity={0.6} onPress={this.copyUrl}>
                                    <Text style={styles.copyBtnTxt}>{I18n.t('transaction.copy_address')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Image style={styles.statusIcon} source={statusIcon} resizeMode={'center'}></Image>
                </View>

            </ImageBackground>
        );
    }
}