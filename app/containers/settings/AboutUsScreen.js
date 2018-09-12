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
    itemBox:{
        height:41
    },
    item:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
    },
    itemTitle:{
        flex:1,
        fontSize:15,
        color:Colors.fontBlackColor,
        paddingLeft:20,
    },
    itemTouchable:{
        alignItems:'center',
        paddingRight:20,
    },
    itemUrl:{
        fontSize:15,
        color:Colors.fontBlueColor,
    },
    itemLine:{
        height:1,
        backgroundColor:Colors.bgColor_e
    }
})

export default class AboutUsScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
        }
    }

    _initData() { 

    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={'关于'}/>
                <Image style={styles.image} source={require('../../assets/common/logo_icon.png')} resizeMode={'center'}></Image>
                <Text style={styles.title}>ITC Wallet</Text>
                <Text style={styles.version}>1.0.1</Text>
                <Item title={'Website'} url={'iotchain.io'} isDisabled={false}></Item> 
                <Item title={'Email'} url={'support@iotchain.io'} isDisabled={true}></Item>
                <Item title={'Telegram'} url={'https://t.me/IoTChain'} isDisabled={false}></Item>
            </View>    
        );
    }
}


class Item extends PureComponent{

    static propTypes = {
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        isDisabled : PropTypes.bool,
    };

    _onPress = () =>{
        let url;
        if(this.props.url.substr(0,5) == 'https'){
            url = this.props.url;
        }else{
            url = 'https://' + this.props.url;
        }
        
        Linking.canOpenURL(url).then(supported=>{
            if(supported){
                Linking.openURL(url)
            }else{
                showToast('打不开')
            }
        }).catch(err=> console.log('openURLError', err))
        
    }

    render(){
        return(
            <View style={styles.itemBox}>
                <View style={styles.item}>
                    <Text style={styles.itemTitle}>{this.props.title}</Text>
                    <TouchableOpacity activeOpacity={0.6}
                         style={styles.itemTouchable}
                         onPress={this._onPress}
                         disabled={this.props.isDisabled}>
                         <Text style={styles.itemUrl}>{this.props.url}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemLine}></View>
            </View>
            
        )
    }
}


