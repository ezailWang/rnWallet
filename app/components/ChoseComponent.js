import React, {Component,PureComponent} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
}from 'react-native'
import PropTypes from 'prop-types';
import Layout from '../config/LayoutConstants'
import {Colors} from '../config/GlobalConfig'

const styles = StyleSheet.create({
    choseItem:{
        //width:Layout.WINDOW_WIDTH,
        height:41, 
    },
    choseItemContent:{
        height:40,
        flexDirection:'row',
        alignSelf:'stretch',
        alignItems:'center',
        backgroundColor:'white',
        paddingLeft:20,
        paddingRight:20,
    },
    choseItemText:{
        flex:1,
        color:Colors.fontBlackColor,
        fontSize:16,
    },
    choseItemIcon:{
        width:13,
        height:9,
    },
    choseItemLine:{
        height:1,
        backgroundColor:Colors.bgGrayColor,
    }
})

class ChoseItem extends PureComponent {
    static propTypes = {
          itemPress: PropTypes.func.isRequired,
          content: PropTypes.string.isRequired,
          isCheck:PropTypes.bool.isRequired,
          choseItemStyle: PropTypes.object,
          choseItemContentStyle: PropTypes.object,
          isShowLine : PropTypes.bool,
    };
    static defaultProps = {
        isShowLine:true,
    }
    render() {
        let checkIcon = this.props.isCheck ? require('../assets/set/ok.png') : null;
        return (
            <View style={[styles.choseItem,this.props.choseItemStyle]}>
                <TouchableOpacity style={[styles.choseItemContent,this.props.choseItemContentStyle]}
                                  onPress = {this.props.itemPress}>
                         <Text style={styles.choseItemText}>{this.props.content}</Text>
                         <Image style={styles.choseItemIcon} source={checkIcon} resizeMode={'contain'}></Image>          
                </TouchableOpacity>  
                {this.props.isShowLine ? <View style={styles.choseItemLine}></View> : null}                
                
            </View>  
        )
    }
}

export {
    ChoseItem,
}