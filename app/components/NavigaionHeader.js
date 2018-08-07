import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    StatusBar
}from 'react-native'

//import {StackNavigator} from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import {BackWhiteButton} from './Button'
import PropType from 'prop-types'
import Layout from '../config/LayoutConstants'

//返回按钮
class BlueHeader extends Component {
    //
    static propTypes = {
        navigation:PropType.object.isRequired
    };

    render() {

        let height = Layout.NAVIGATION_HEIGHT();

        return (
            <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                            style={[{height:height}]}>
                <BackWhiteButton onPress={() => {
                    this.props.navigation.goBack()
                }}/>
            </LinearGradient>
        )
    }
}

export {
    BlueHeader
}