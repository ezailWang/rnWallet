
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image
}from 'react-native'

const styles = StyleSheet.create({
    backBtn:{
        marginLeft:10,
        width:20,
        height:20
    },
    container:{
        justifyContent:"center"
    },
    backItem:{
        width:20,
        height:20
    }
});

export default class BackBtn extends Component {

    static propTypes = {
        onPress: PropTypes.func.isRequired,
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backBtn}
                                  onPress = {this.props.onPress}>
                    <Image style={styles.backItem}
                           resizeMode={'center'}
                           source={require('../assets/common/common_back.png')}>
                    </Image>
                </TouchableOpacity>
            </View>
        )
    }
}