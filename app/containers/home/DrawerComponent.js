import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react';
import { store } from '../../config/store/ConfigureStore'
import DrawerCell from './component/DrawerCell'
import { Colors } from '../../config/GlobalConfig'
import { I18n } from '../../config/language/i18n'

const DrawerComponent = (props, params) => (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: 80, height: 70, backgroundColor: Colors.bgBlue_drawer_top, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
            <Image source={require('../../assets/home/menu/menu_icon.png')} style={{ height: 46, width: 46, marginLeft: 25 }} />
            <Text style={{ fontSize: 18, marginLeft: 10 }}>{store.getState().Core.walletName}</Text>
        </View>
        <ScrollView style={{ marginTop: 50 }}>
            <DrawerCell
                onClick={() => {
                    //props.navigation.closeDrawer()
                    props.navigation.navigate('Set')
                }}
                text={I18n.t('home.wallet_tool')}
                imageSource={require('../../assets/home/menu/menu_tool.png')}
            />
            <DrawerCell
                onClick={() => {
                    //props.navigation.closeDrawer()
                    props.navigation.navigate('ContactList', { from: 'home' })
                }}
                text={I18n.t('home.contact')}
                imageSource={require('../../assets/home/menu/menu_contact.png')}
            />
            <DrawerCell
                onClick={() => {
                    //props.navigation.closeDrawer()
                    props.navigation.navigate('SystemSet')
                }}
                text={I18n.t('home.system_settings')}
                imageSource={require('../../assets/home/menu/menu_set.png')}
            />
            <View
                style={{ backgroundColor: Colors.bgGrayColor, height: 1, marginHorizontal: 5 }}
            />
            <DrawerCell
                onClick={() => {
                    //props.navigation.closeDrawer()
                    props.navigation.navigate('Feedback')
                }}
                text={I18n.t('home.feedback')}
                imageSource={require('../../assets/home/menu/menu_feedback.png')}
            />
            <DrawerCell
                onClick={() => {
                    //props.navigation.closeDrawer()
                    props.navigation.navigate('AboutUs')
                }}
                text={I18n.t('home.about')}
                imageSource={require('../../assets/home/menu/menu_about.png')}
            />
        </ScrollView>
    </SafeAreaView>
)

export { DrawerComponent }