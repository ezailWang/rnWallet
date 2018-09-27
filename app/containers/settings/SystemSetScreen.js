import React, { PureComponent } from 'react';
import { 
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    Image,
    Linking 
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import {Colors,StorageKey} from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
    },
    image:{
        alignSelf:'center',
        width:150,
        height:150,
        marginTop:80,
        marginBottom:6,
    },
    title:{
        alignSelf:'center',
        color:Colors.fontBlackColor,
        fontSize:20,
        fontWeight:'bold',
        marginBottom:6,
    },
    version:{
        alignSelf:'center',
        color:Colors.fontBlackColor,
        fontSize:13,
        fontWeight:'bold',
        marginBottom:80,
    },
    itemContainer:{
        marginTop:10,
    },
    itemBox:{
        height:51,
        alignSelf:'stretch',
    },
    itemTouchable:{
        height:50,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        paddingLeft:20,
        paddingRight:20,
    },
    itemTitle:{
        flex:1,
        fontSize:15,
        color:Colors.fontBlackColor_43,
    },
    itemRightBox:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    itemContent:{
        fontSize:15,
        color:Colors.fontBlackColor_43,
        marginRight:20,
    },
    itemImage:{
        width:20,
    },
    itemLine:{
        height:1,
        //backgroundColor:Colors.bgColor_e
        marginBottom:1,
    }
})

class SystemSetScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            langStr:'',
            monetaryUnitStr:''
        }
    }

    _initData() { 
        let lang = I18n.locale
        let str;
        if(lang == 'zh'){
            str = '简体中文'
        }else if(lang == 'en'){
            str = 'English'
        }else if(lang == 'ko'){
            str = '한국어'
        }
        let mUnitStr = this.props.monetaryUnit.monetaryUnitStr
        this.setState({
            langStr:str,
            monetaryUnitStr:mUnitStr,
        })
    }


    _choseLanguage= () =>{
        let _this = this;
        this.props.navigation.navigate('ChoseLanguage', {
            callback: function (data) {
                _this.setState({
                    langStr:data.language.langStr,
                    monetaryUnitStr:data.monetaryUnit.monetaryUnitStr,
                })
            }
        })
    }

    _choseMonetaryUnit= () =>{
        let _this = this;
        this.props.navigation.navigate('ChoseMonetaryUnit', {
            callback: function (data) {
                _this.setState({
                    monetaryUnitStr:data.monetaryUnit.monetaryUnitStr,
                })
            }
        })
    }



    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('settings.system_settings')}/>
                <View  style={styles.itemContainer}>
                    <Item title={I18n.t('settings.language')} content = {this.state.langStr} onPressed= {this._choseLanguage}></Item> 
                    <Item title={I18n.t('settings.currency_unit')} content = {this.state.monetaryUnitStr} onPressed= {this._choseMonetaryUnit}></Item>
                </View>
               
            </View>    
        );
    }
}


class Item extends PureComponent{

    static propTypes = {
        onPressed:PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        isDisabled : PropTypes.bool,
    };

    static defaultProps = {
        isDisabled:false,
    }

    render(){
        return(
            <View style={styles.itemBox}>
                <TouchableOpacity activeOpacity={0.6}
                         style={styles.itemTouchable}
                         onPress={this.props.onPressed}
                         disabled={this.props.isDisabled}>
                         <Text style={styles.itemTitle}>{this.props.title}</Text>
                         <View style={styles.itemRightBox}>
                             <Text style={styles.itemContent}>{this.props.content}</Text>
                             <Image style={styles.itemImage} source={require('../../assets/set/next.png')} resizeMode={'center'}></Image>
                         </View>
                </TouchableOpacity>
                <View style={styles.itemLine}></View>
            </View>
            
        )
    }
}



const mapStateToProps = state => ({
    monetaryUnit:state.Core.monetaryUnit,
});

export default connect(mapStateToProps, {})(SystemSetScreen)
