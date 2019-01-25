import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import { Colors, FontSize } from '../config/GlobalConfig'




const styles = StyleSheet.create({
    iconBox: {
        // flex: 1,
        height: 30,
        width: Layout.SCREEN_WIDTH / 3,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    lfView:{
        flex:1,
    },
    icon: {
        height: 20,
        width:20,
        alignSelf: 'center',
        margin:0,
        padding:0,
    },
    redRemindM: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 11,
        marginRight: 10,
        textAlign: 'center',
        lineHeight: 20,
        alignSelf: 'flex-start',
        alignItems:'center',
        justifyContent: 'center',
    },
    redRemindS: {
        width: 8,
        height: 8,
        backgroundColor: 'red',
        borderRadius: 4,
        marginRight: 10,
        textAlign: 'center',
        alignSelf: 'flex-start',
    },
    text:{
        color: 'white',
    },
    textSize13: {
        fontSize: 13,
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
});
export default class TabIcon extends PureComponent {

    constructor(props) {
        super(props);
    }
    static propTypes = {
        icon: PropTypes.number,
        isShowRedRemind: PropTypes.bool,
        count: PropTypes.number,
    }

    static defaultProps = {
        isShowRedRemind: false,
        count: 0,
    }



    render() {

        let redCircleStyle = this.props.count <= 0 ? styles.redRemindS : styles.redRemindM
        let count = this.props.count > 99 ? '99+' : (this.props.count <= 0 ? '' : this.props.count);
        let textSize = this.props.count > 99 ? styles.textSize10 : (this.props.count < 10 ? styles.textSize13 : styles.textSize12);
        return (
            <View style={styles.iconBox}>
                <View style={styles.lfView}></View>
                <Image style={styles.icon} source={this.props.icon} resizeMode={'contain'}></Image>
                <View style={styles.lfView}>
                    {
                        this.props.isShowRedRemind ? 
                        <View style={redCircleStyle}>
                             <Text style={[styles.text, textSize]}>{count}</Text>
                        </View>    
                         : null
                    }
                </View>

            </View>

        );
    }
}