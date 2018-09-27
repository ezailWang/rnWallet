import React, {Component,PureComponent} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
}from 'react-native'
import PropTypes from 'prop-types';
import {Colors} from '../config/GlobalConfig'

const styles = StyleSheet.create({
    commonTextInput:{
        //justifyContent:'center',
        height:36,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        paddingLeft:10,
        paddingRight:10,
        color:Colors.fontBlackColor_43,
        fontSize:13,
    }
})


//返回按钮
class CommonTextInput extends Component {
    static propTypes = {
          placeholder: PropTypes.string,
          returnKeyType: PropTypes.string,
          defaultValue: PropTypes.string,//展示的value
          textInputStyle: PropTypes.object,//添加/修改的样式
          onChangeText: PropTypes.func,
          onFocus:PropTypes.func,
          onBlur:PropTypes.func,
          keyboardType: PropTypes.string,
          multiline: PropTypes.bool,
    };

    static defaultProps = {
        placeholder:'',
        returnKeyType:'next',
        defaultValue:'',
        textInputStyle:{},
        multiline:false,
    }

    

    render() {
        return (
            <TextInput style={[styles.commonTextInput,this.props.textInputStyle]}
                       placeholder={this.props.placeholder}
                       returnKeyType={this.props.returnKeyType}
                       keyboardType={this.props.keyboardType}
                       onChangeText={this.props.onChangeText}
                       multiline={this.props.multiline}
                       onFocus={this.props.onFocus}
                       onBlur={this.props.onBlur}
                       >{this.props.defaultValue}
            </TextInput>
        )
    }
}


export {
    CommonTextInput,
}