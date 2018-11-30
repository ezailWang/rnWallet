import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import LayoutConstants from '../../../config/LayoutConstants'
import { Colors } from '../../../config/GlobalConfig'
import RedCircleReminder from '../../../components/RedCircleReminder'

class DrawerCell extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
    }

    static defaultProps = {
        imageSource: LayoutConstants.DEFAULT_IAMGE,
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.props.onClick}
            >
                <Image
                    style={styles.image}
                    source={this.props.imageSource}
                    resizeMode={'center'}
                />
                <Text
                    style={styles.text}
                >{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

class DrawerCellReminder extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        isShowReminder :PropTypes.bool.isRequired,
        noticeNumber : PropTypes.number,
    }

    static defaultProps = {
        imageSource: LayoutConstants.DEFAULT_IAMGE,
        noticeNumber:0
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.props.onClick}
            >
                <Image
                    style={styles.imageMessage}
                    source={this.props.imageSource}
                    resizeMode={'center'}
                />
                <Text
                    style={styles.text}
                >{this.props.text}</Text>

                <View style={[{flex:1,height: 50,justifyContent:"center",marginRight:40}]}>
                    <RedCircleReminder 
                        isShow={this.props.isShowReminder}
                        number={this.props.noticeNumber}
                        circleStyle = {{alignSelf:'flex-end'}}/>
                </View>
                
            </TouchableOpacity>
        )
    }
}

export {DrawerCell,DrawerCellReminder}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: LayoutConstants.HOME_DRAWER_WIDTH,
        height: 50,
        alignItems:'center'
    },
    image: {
        width: 14,
        height: 13,
        marginLeft: 25,
        //marginVertical: 15,
    },
    imageMessage: {
        width: 14,
        height: 15,
        marginLeft: 25,
    },
    text: {
        fontSize: 15,
        marginLeft: 12,
        //marginVertical: 15,
        color: Colors.fontBlackColor_31
    }

})