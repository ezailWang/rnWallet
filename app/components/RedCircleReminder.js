import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'

export default class RedCircleReminder extends PureComponent {
    static propTypes = {
        isShow:PropTypes.bool.isRequired,
        number: PropTypes.number,
        circleStyle: PropTypes.object,
        textStyle: PropTypes.object,
    }
    static defaultProps = {
        number:0
    }
    render() {
        let number = this.props.number
        let numberStr = number > 99 ? '99+' : number + '';
        let textSize =  number > 99 ? styles.textSize10 : (number < 10 ? styles.textSize14 : styles.textSize12)
        return (
                this.props.isShow ? 
                     <View  style={[styles.circle,this.props.circleStyle]}>
                            { number==0 ? null : <Text  style={[styles.text,textSize,this.props.textStyle]}>{numberStr}</Text>}
                     </View> : null
        )
    }
}

const styles = StyleSheet.create({
    circle: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'red',
        borderRadius:11,
    },
    text: {
        color:'white',
        lineHeight:20,
        textAlign:'center'
    },

    textSize14:{
        fontSize:14,
    },
    textSize12:{
        fontSize:12,
    },
    textSize10:{
        fontSize:10,
    },
})