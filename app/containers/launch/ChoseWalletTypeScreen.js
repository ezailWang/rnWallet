import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import { Colors, FontSize } from '../../config/GlobalConfig'
import { connect } from 'react-redux'
import * as Actions from '../../config/action/Actions';
import { WhiteBgNoTitleHeader } from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    title: {
        width: Layout.WINDOW_WIDTH * 0.8,
        alignSelf:'center',
        textAlign:'center',
        height:80,
        fontSize:16,
        color:Colors.fontBlackColor_43,
        lineHeight:80,

    },
    itemBox: {
        width: Layout.WINDOW_WIDTH * 0.9,
        flexDirection: 'row',
        height:66,
        alignItems:'center',
        backgroundColor:'white',
        borderRadius:5,
        borderWidth:1,
        borderColor:Colors.bgColor_e,
        paddingLeft:15,
        paddingRight:15,
        marginBottom:15,
        fontSize:15,
        color:Colors.fontBlackColor_43,
        alignSelf:'center'
    },
    itemIcon:{
        width:40,
        height:40,
    },
    itemContent:{
        flex:1,
        marginLeft:10,
        marginRight:10,
    },
    itemNext:{
        width:10,
        height:17,
    }

})

class ChoseWalletTypeScreen extends BaseComponent {

    constructor(props) {
        super(props);
    }

   
   
    toImportWallet = (walletType) => {
        /*let params = this.props.createWalletParams;
        params.walletType = walletType
        this.props.setCreateWalletParams(params);
        this.props.navigation.navigate('ImportWallet')*/
    }

    renderComponent() {
       
        return (
            <View style={styles.container}>
                <WhiteBgNoTitleHeader navigation={this.props.navigation} />

                <Text style={styles.title}>{I18n.t('settings.chose_wallet_type')}</Text>
                <Item icon={require('../../assets/common/eth_logo.png')} content={I18n.t('settings.eth_wallet')} itemPress={()=>this.toImportWallet('eth')}></Item>
                <Item icon={require('../../assets/common/itc_logo.png')} content={I18n.t('settings.itc_wallet')} itemPress={()=>this.toImportWallet('itc')}></Item>
            </View>
        );
    }
}


class Item extends PureComponent {
    static propTypes = {
        content: PropTypes.string.isRequired,
        icon: PropTypes.number.isRequired,
        itemPress: PropTypes.func.isRequired,
    };
    render() {
        let icon = this.props.icon
        return (
            <TouchableOpacity style={styles.itemBox} activeOpacity={0.6} onPress={this.props.itemPress}>
                <Image style={styles.itemIcon} source={icon} resizeMode={'center'} ></Image>
                <Text style={styles.itemContent}>{this.props.content}</Text>
                <Image style={styles.itemNext} source={require('../../assets/set/next.png')} resizeMode={'center'} ></Image>
            </TouchableOpacity>
        )
    }
}


const mapStateToProps = state => ({
    createWalletParams: state.Core.createWalletParams,
});
const mapDispatchToProps = dispatch => ({
    setCreateWalletParams: (params) => dispatch(Actions.setCreateWalletParams(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChoseWalletTypeScreen)
