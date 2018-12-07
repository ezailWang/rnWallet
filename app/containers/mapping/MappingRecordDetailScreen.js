import React, { Component, PureComponent } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import { BlueButtonBig } from '../../components/Button'
import { Colors, StorageKey, FontSize } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import NetworkManager from '../../utils/NetworkManager';
import { CommonTextInput } from '../../components/TextInputComponent'
import RemindDialog from '../../components/RemindDialog'
import BaseComponent from '../base/BaseComponent';
import LinearGradient from 'react-native-linear-gradient'
import ProgressView from '../../components/ProgressView'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    headerBox: {
        width: Layout.WINDOW_WIDTH,
        height: Layout.WINDOW_WIDTH / 320 * 211
    },
    headerTitleBox: {
        flexDirection: 'row',
        width: Layout.WINDOW_WIDTH,
    },
    headerTitleTouch: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
    },
    backIcon: {
        height: 25,
        width: 25,
    },
    headerTitleView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    headerTitle: {
        fontSize: FontSize.HeaderSize,
        color: 'white',
        marginLeft: -40,
    },
    amountView: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 40,
    },
    amountTxt: {
        fontSize: 30,
        fontWeight: '700',
        color: 'white'
    },
    unitTxt: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginLeft: 5,
        marginBottom: 2,
    },


    lineView: {
        width: Layout.WINDOW_WIDTH - 40,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    contentBox: {
        width: Layout.WINDOW_WIDTH,
        flex:1,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
    },
    contentView: {
        position: 'absolute',
        marginTop: -10,
        width: Layout.WINDOW_WIDTH - 40,
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        zIndex:10,
    },
    infoView: {
        alignSelf: 'center',
        width: Layout.WINDOW_WIDTH - 40,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    infoContent: {
        width: Layout.WINDOW_WIDTH - 70,
        //height:100,
    },
    vLine: {
        height: 1,
        width: Layout.WINDOW_WIDTH - 70,
        backgroundColor: Colors.bgGrayColor_e5,
    },
    titleView: {
        width: Layout.WINDOW_WIDTH - 70,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    titleTxt: {
        fontSize: 15,
        color: Colors.fontBlackColor_43,
    },
    itemView: {
        width: Layout.WINDOW_WIDTH - 70,
        marginTop: 15,
        alignItems: 'center',
        //height:50,
    },
    itemTitle: {
        fontSize: 15,
        width: Layout.WINDOW_WIDTH - 70,
        color: Colors.fontBlackColor_43,
    },
    itemContent: {
        marginTop: 3,
        color: Colors.fontGrayColor_a,
        width: Layout.WINDOW_WIDTH - 70,
        fontSize: 13,
    }

})

class MappingRecordDetailScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            status: -1,
            time: ''
        }
        this.mappingDetail = null; // status 0 已申请 1 申请中  2 已完成
    }

    _initData() {
        this.mappingDetail = this.props.navigation.state.params.mappingDetail
        this.setState({
            amount: this.mappingDetail.amount,
            status: this.mappingDetail.status,
            time: this.mappingDetail.time,
        })

    }

    goBackBtn = () => {
        this.props.navigation.goBack()
    }


    renderComponent() {

        let headerMarginTop = { marginTop: 24 };
        if (Layout.DEVICE_IS_IPHONE_X()) {
            headerMarginTop = { marginTop: 48 };
        }
        let headerBg = require('../../assets/home/hp_bg.png')

        let info1IsDone = this.state.status == 0 ? false : true
        let info2IsDone = this.state.status == 2 ? true : false

        return (
            <View style={styles.container}>
                <ImageBackground style={styles.headerBox} source={headerBg}>
                    <View style={styles.headerTitleBox}>
                        <TouchableOpacity style={[styles.headerTitleTouch, headerMarginTop]}
                            onPress={this.goBackBtn}
                        >
                            <Image style={styles.backIcon}
                                resizeMode={'center'}
                                source={require('../../assets/common/common_back_white.png')}>
                            </Image>
                        </TouchableOpacity>
                        <View style={[styles.headerTitleView, headerMarginTop]}>
                            <Text style={styles.headerTitle}>{I18n.t('mapping.mapping_record')}</Text>
                        </View>

                    </View>
                    <View style={styles.amountView}>
                        <Text style={styles.amountTxt}>{this.state.amount}</Text>
                        <Text style={styles.unitTxt}>ITC</Text>
                    </View>

                </ImageBackground>
                <View style={[styles.contentBox]}>
                    <View style={[styles.contentView]}>
                        <View style={[styles.infoView]}>
                            <View style={[styles.infoContent]}>
                                <TitleView isCompleted={info1IsDone} content={I18n.t('mapping.destroy_itc')}></TitleView>
                                <View style={styles.vLine}></View>
                                <ItemView title={I18n.t('mapping.send_address') + '(Erc20)'} content={'0xf6C9e322b688A434833dE530E4c23CFA4e579a78'}></ItemView>
                                <ItemView title={I18n.t('mapping.destroy_address')} content={'0xf6C9e322b688A434833dE530E4c23CFA4e579a78'}></ItemView>
                                <ItemView title={'TxHash'} content={'0xf6C9e322b688A434833dE530E4c23CFA4e579a78'}></ItemView>
                                <ItemView title={I18n.t('mapping.transaction_hour')} content={'2018-11-06 18:18:06 +0800'}></ItemView>
                            </View>
                            <Line isCompleted={info1IsDone}></Line>
                        </View>
                        <View style={[styles.infoView]}>
                            <View style={[styles.infoContent]}>
                                <TitleView isCompleted={info2IsDone} content={I18n.t('mapping.native_itc_issuance')}></TitleView>
                                <View style={styles.vLine}></View>
                                {this.state.status == 0 ?
                                    <ItemView title={I18n.t('mapping.transfer_unsuccess_title')} content={I18n.t('mapping.transfer_unsuccess_desc')}></ItemView>
                                    :
                                    <View>
                                        <ItemView title={I18n.t('mapping.collection_address')} content={'0xf6C9e322b688A434833dE530E4c23CFA4e579a78'}></ItemView>
                                        <ItemView title={'TxHash'} content={'0xf6C9e322b688A434833dE530E4c23CFA4e579a78'}></ItemView>
                                        <ItemView title={I18n.t('mapping.transaction_hour')} content={'2018-11-06 18:18:06 +0800'}></ItemView>
                                    </View>}

                            </View>
                            {
                                this.state.status == 0 ? null : <Line isCompleted={info2IsDone}></Line>
                            }

                        </View>
                    </View>
                </View>

            </View>
        );
    }
}



class ItemView extends PureComponent {

    render() {
        return (
            <View style={styles.itemView}>
                <Text style={styles.itemTitle}>{this.props.title}</Text>
                <Text style={styles.itemContent}>{this.props.content}</Text>
            </View>
        )
    }
}

class TitleView extends PureComponent {

    render() {
        let titleIcon = this.props.isCompleted ? require('../../assets/mapping/doneIcon.png') : require('../../assets/mapping/ingIcon.png')
        return (
            <View style={styles.titleView}>
                <Image style={styles.titleIcon} resizeMode={'center'} source={titleIcon} ></Image>
                <Text style={styles.titleTxt}>{this.props.content}</Text>
            </View>
        )
    }
}

class Line extends PureComponent {

    render() {
        let isCompleted = this.props.isCompleted
        return (
            <LinearGradient
                style={styles.lineView}
                colors={isCompleted ? ['#a0a0a0', '#a0a0a0', '#a0a0a0'] : ['#66ceff', '#0094ff']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}>
            </LinearGradient>
        )
    }
}


const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MappingRecordDetailScreen)


