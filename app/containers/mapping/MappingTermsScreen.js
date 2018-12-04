import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Text,
    Image,
    Linking
} from 'react-native';
import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import { showToast } from '../../utils/Toast';
import { addressToName } from '../../utils/CommonUtil'
import NetworkManager from '../../utils/NetworkManager'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        width: Layout.WINDOW_WIDTH,
        //marginTop: 12,
        backgroundColor: 'white'
    },
    emptyListContainer: {
        marginTop: 150,
        width: Layout.WINDOW_WIDTH * 0.9,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    emptyListIcon: {
        width: 94,
        height: 114,
        marginBottom: 23,
    },
    emptyListText: {
        fontSize: 16,
        width: Layout.WINDOW_WIDTH * 0.9,
        color: Colors.fontGrayColor_a,
        textAlign: 'center',
    },
    item: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 25,
        paddingRight: 25,
    },
    itemContentBox: {
        flex: 1,
    },
    itemTitle: {
        color: Colors.fontBlackColor_43,
        fontSize: 16,
        marginBottom: 8,
    },
    itemAddress: {
        color: Colors.fontGrayColor_a1,
        fontSize: 13,
    },
    itemTime: {
        color: Colors.fontGrayColor_a1,
        fontSize: 13,
    },
    itemSeparator: {
        height: 1,
        // backgroundColor:'transparent',
        backgroundColor: Colors.bgGrayColor_ed,
        marginLeft: 15,
        marginRight: 15,
    },
    listFooter: {
        width: Layout.WINDOW_WIDTH * 0.9,
        height: 40,
        alignSelf: 'center',
    },
    listFooterText: {
        height: 40,
        lineHeight: 40,
        fontSize: 14,
        width: Layout.WINDOW_WIDTH * 0.9,
        color: Colors.fontGrayColor_a,
        textAlign: 'center',
    }
})

export default class MappingTermsScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
           isAgree : false
        }

    }

    _initData() {
        
    }

   
    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader navigation={this.props.navigation}
                    text={I18n.t('settings.message_center')} />
               
            </View>
        );
    }
}


