import React, { PureComponent } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, BackHandler, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Colors, FontSize, StorageKey } from '../../config/GlobalConfig'
import * as Actions from '../../config/action/Actions';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.bgGrayColor,
        paddingBottom: 20,
    },
    topBg:{
        paddingTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
        width:Layout.WINDOW_WIDTH,
        alignItems:'center',
    },
    topTitle:{
        marginTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
        color:'white',
        fontSize:FontSize.HeaderSize
    },
    topLog:{
        width:100,
        marginTop:16,
        marginBottom:16
    },

    itemBox: {
        width: Layout.WINDOW_WIDTH,
    },
    itemTouchable: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        width: Layout.WINDOW_WIDTH,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:'white'
    },
    itemIcon: {
        width: 14,
    },
    itemTitle: {
        flex: 1,
        color: Colors.fontBlackColor_43,
        fontSize: 14,
        marginLeft: 12,
    },
    itemRightView: {
        flexDirection: 'row',
    },
    itemRedCircle: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 11,
        marginRight: 10,  
    },
    itemRedCircleText:{
        lineHeight:22,
        color: 'white',
        textAlign:'center',
    },
    itemLine:{
        width: Layout.WINDOW_WIDTH,
        height:1,
        backgroundColor:'transparent'
    },
    itemNextIcon: {
        width: 12,
        height:18,
    },
    textSize14: {
        fontSize: 14,
    },
    textSize12: {
        fontSize: 12,
    },
    textSize10: {
        fontSize: 10,
    },
    marginTop10: {
        marginTop: 10,
    }

})

class Item extends PureComponent {

    static propTypes = {
        itemStyle: PropTypes.object,
        itemOnPress: PropTypes.func,
        isDisabled: PropTypes.bool,
        count: PropTypes.number,
        title: PropTypes.string,
        isNeedLine: PropTypes.bool,
    };

    static defaultProps = {
        isDisabled: false,
        isNeedLine: true,
        count: 0,
    }

    render() {
        let icon = this.props.icon
        let isShowRed = this.props.count <= 0 ? false : true;
        let count, textSize;
        if (isShowRed) {
            count = this.props.count <= 99 ? this.props.count : '99+';
            textSize = this.props.count > 99 ? styles.textSize10 : (this.props.count < 10 ? styles.textSize14 : styles.textSize12);
        }
    
        return (
            <View style={[styles.itemBox, this.props.itemStyle]}>
                <TouchableOpacity activeOpacity={0.6}
                    style={styles.itemTouchable}
                    onPress={this.props.itemOnPress}
                    disabled={this.props.isDisabled}>
                    <Image style={styles.itemIcon} source={icon} resizeMode={'contain'} />
                    <Text style={styles.itemTitle}>{this.props.title}</Text>
                    <View style={styles.itemRightView}>
                        {isShowRed ? <View style={styles.itemRedCircle}><Text style={[styles.itemRedCircleText, textSize]}>{count}</Text></View>: null}
                        <Image style={styles.itemNextIcon} source={require('../../assets/set/next.png')} resizeMode={'center'} />
                    </View>
                </TouchableOpacity>
                {
                    this.props.isNeedLine ? <View style={styles.itemLine}></View> : null
                }
            </View>

        )
    }
}


class MyScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            newMessageCounts: 0,
            refreshPage: false,
        }
        this._setStatusBarStyleLight()
    }

    _messageCountEmitter = (data) =>{
        let messageCount =  data.messageCount;
        this.setState({
            newMessageCounts:messageCount
        })
    }

    gotoSet = () =>{
        let _this = this;
        this.props.navigation.navigate('SystemSet', {
            callback: function () {
               /* _this.setState({
                    refreshPage: ! _this.state.refreshPage,
                })
               _this.props.navigation.navigate('HomeTab')*/ 
            }
        })
    }

    renderComponent() {
        let topBg = require('../../assets/launch/splash_bg.png')
        let topLogo = require('../../assets/launch/splash_logo.png')
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.topBg} source={topBg}>
                    {/*<Text style={styles.topTitle}>{I18n.t('home.my')}</Text>*/}
                    <Image style={styles.topLog} source={topLogo} resizeMode={'contain'} />
                </ImageBackground>
                <Item title={I18n.t('settings.message_center')} icon={require('../../assets/home/menu/menu_notice.png')} itemOnPress={()=>this.props.navigation.navigate('MessageCenter')}
                      count={this.state.newMessageCounts}></Item>
                <Item title={I18n.t('home.wallet_tool')} icon={require('../../assets/home/menu/menu_tool.png')} itemOnPress={()=>this.props.navigation.navigate('WalletList')}></Item>
                <Item title={I18n.t('home.contact')} icon={require('../../assets/home/menu/menu_contact.png')} itemOnPress={()=>this.props.navigation.navigate('ContactList', {from: 'home'})}></Item>
                <Item title={I18n.t('home.system_settings')} icon={require('../../assets/home/menu/menu_set.png')} itemOnPress={this.gotoSet} isNeedLine={false}></Item>
                <Item title={I18n.t('home.feedback')} icon={require('../../assets/home/menu/menu_feedback.png')} itemOnPress={()=>this.props.navigation.navigate('Feedback')} itemStyle={styles.marginTop10}></Item>
                <Item title={I18n.t('home.about')} icon={require('../../assets/home/menu/menu_about.png')} itemOnPress={()=>this.props.navigation.navigate('AboutUs')} isNeedLine={false}></Item>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    myLanguage: state.Core.myLanguage,
});
const mapDispatchToProps = dispatch => ({
   
});
export default connect(mapStateToProps, mapDispatchToProps)(MyScreen)


