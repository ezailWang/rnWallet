import React, { PureComponent } from 'react';
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.bgGrayColor,
        alignItems:'center',
    },
    listContainer:{
        flex:1,
        width:Layout.WINDOW_WIDTH*0.9,
        paddingTop:15,
        paddingBottom:15,
    },
    emptyListContainer:{
        flex:1,
        backgroundColor:"red",
        justifyContent:'center',
        alignItems: 'center',
    },
    item:{
        height:60,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: Colors.borderColor_e,
        borderWidth: 1,
        backgroundColor:'white'
    },
    itemCircle:{
        width:40,
        height:40,
        borderRadius: 20,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:15,
        marginRight:12
    },
    itemLetter:{
        fontSize:18,
        fontWeight:'bold',
        color:'white'
    },
    itemRightView:{
        flex:1,
    },
    itemName:{
        fontSize:15,
        color:Colors.fontBlackColor,
        marginBottom:2,
    },
    itemAddress:{
        fontSize:13,
        color:Colors.fontGrayColor_a1,
    },
    itemSeparator:{
        height:10,
        backgroundColor:'transparent',
    }
})

export default class ContactListScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            data:[],//列表数据
        }
    }

    _initData() { 
        this.loadContactData();
    }

    async loadContactData(){
        let contactData = await StorageManage.loadAllDataForKey(StorageKey.Contact)
        this.setState({
            data:contactData,
        })
        //var ids = await StorageManage.loadIdsForKey(StorageKey.Contact)
    }

    _onPressItem = (item) => {
        var _this = this;
        let contactInfo = item.item;
        let index = item.index;
        //this.props.navigation.navigate('',{contactInfo:item.item,index:item.index});
        this.props.navigation.navigate('ContactInfo', {
            contactInfo:item.item,
            index:item.index,
            callback: function (data) {
                _this.loadContactData()
            }
        })
    }

    //自定义分割线
    _renderItemSeparatorComponent = () => (
        <View style={styles.itemSeparator}>
        </View>
    )

    //空布局
    _renderEmptyView = () => (
        <View style={styles.emptyListContainer}>
            <Text>数据为空</Text>
        </View>
    )

    _renderItem = (item) => {
        return(
            <FlatListItem
                 item = {item}
                 onPressItem = {this._onPressItem.bind(this, item)}
            />     
        )
    }

    addContact = async () => {
        var _this = this;
        this.props.navigation.navigate('CreateContact', {
            callback: function (data) {
                _this.loadContactData();
            }
        })
    }
    

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={'地址簿'}
                                rightPress={() => this.addContact()}
                                rightIcon={require('../../assets/common/scanIcon.png')}/>
                <FlatList
                    style = {styles.listContainer}
                    ref = {ref=>this.flatList = ref}
                    data = {this.state.data}
                    keyExtractor = {(item,index)=>index.toString()}//给定的item生成一个不重复的key
                    renderItem = {this._renderItem}
                    ListEmptyComponent = {this._renderEmptyView}
                    ItemSeparatorComponent = {this._renderItemSeparatorComponent}
                    getItemLayout={(data, index) => ({ length: 60, offset: (60+10) * index, index: index })}>

                </FlatList>
            </View>    
        );
    }
}


class FlatListItem extends PureComponent{


    _onPress = () =>{
        this.props.onPressItem(this.props.item.item)
    }

    render(){
        const { name, address, remark } = this.props.item.item || {}
        let letter = name.substr(0,1);
        let _letter = letter +'';
        if((letter >= 'a' && letter <= 'z')){
            _letter = letter.toUpperCase();
        }else{
            _letter = letter;
        }
        let _address = address.substr(0,8) + '...' + address.substr(34,42)
        return(
            <TouchableOpacity activeOpacity={0.6}
                {...this.props}
                style={styles.item}
                onPress={this._onPress}>
                 <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                                 start={{x:0,y:0}}
                                 end={{x:1,y:1}}
                                 style={styles.itemCircle}>
                    <Text style={styles.itemLetter}>{_letter}</Text>
                </LinearGradient>
               
                <View style={styles.itemRightView}>
                    <Text style={styles.itemName}>{name}</Text>
                    <Text style={styles.itemAddress}>{_address}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}


