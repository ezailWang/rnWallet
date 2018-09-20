import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react';
import { store } from '../../config/store/ConfigureStore'
import DrawerCell from './component/DrawerCell'
import { Colors } from '../../config/GlobalConfig'
import { I18n } from '../../config/language/i18n'
import { NavigationActions, DrawerActions } from 'react-navigation'
import PropTypes from 'prop-types';
import BaseComponent from '../base/BaseComponent'

class DrawerComponent extends BaseComponent {
    constructor(props) {
        super(props)
        this._setStatusBarStyleLight();
    }
    navigateToScreen = (route, params) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: params
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    renderComponent() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ marginTop: 80, height: 70, backgroundColor: Colors.bgBlue_drawer_top, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <Image source={require('../../assets/home/menu/menu_icon.png')} style={{ height: 46, width: 46, marginLeft: 25 }} />
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{store.getState().Core.walletName}</Text>
                </View>
                <ScrollView style={{ marginTop: 50 }}>
                    <DrawerCell
                        onClick={this.navigateToScreen('Set')}
                        text={I18n.t('home.wallet_tool')}
                        imageSource={require('../../assets/home/menu/menu_tool.png')}
                    />
                    <DrawerCell
                        onClick={this.navigateToScreen('ContactList', { from: 'home' })}
                        text={I18n.t('home.contact')}
                        imageSource={require('../../assets/home/menu/menu_contact.png')}
                    />
                    <DrawerCell
                        onClick={this.navigateToScreen('SystemSet')}
                        text={I18n.t('home.system_settings')}
                        imageSource={require('../../assets/home/menu/menu_set.png')}
                    />
                    <View
                        style={{ backgroundColor: Colors.bgGrayColor, height: 1, marginHorizontal: 5 }}
                    />
                    <DrawerCell
                        onClick={this.navigateToScreen('Feedback')}

                        text={I18n.t('home.feedback')}
                        imageSource={require('../../assets/home/menu/menu_feedback.png')}
                    />
                    <DrawerCell
                        onClick={this.navigateToScreen('AboutUs')}
                        text={I18n.t('home.about')}
                        imageSource={require('../../assets/home/menu/menu_about.png')}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

DrawerComponent.prototypes = {
    navigation: PropTypes.object
}

export default DrawerComponent;