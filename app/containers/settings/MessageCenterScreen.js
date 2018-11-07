import React, { PureComponent } from 'react';
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import { addressToName } from '../../utils/commonUtil'

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.backgroundColor,
        alignItems:'center',
    },
    listContainer:{
        flex:1,
        width:Layout.WINDOW_WIDTH,
        marginTop:12,
        backgroundColor:'white'
    },
    emptyListContainer:{
        marginTop:150,
        width:Layout.WINDOW_WIDTH*0.9,
        justifyContent:'center',
        alignSelf:'center',
        alignItems:'center'
    },
    emptyListIcon:{
        width:94,
        height:114,
        marginBottom:23,     
    },
    emptyListText:{
        fontSize:16,
        width:Layout.WINDOW_WIDTH*0.9,
        color:Colors.fontGrayColor_a,
        textAlign:'center',
    },
    item:{
        height:80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'white',
        paddingLeft:25,
        paddingRight:25,
    },
    itemContentBox:{
        flex:1,
    },
    itemTitle:{
        color:Colors.fontBlackColor_43,
        fontSize:16,
        marginBottom:8,
    },
    itemAddress:{
        color:Colors.fontGrayColor_a1,
        fontSize:13,
    },
    itemTime:{
        color:Colors.fontGrayColor_a1,
        fontSize:13,
    },
    itemRightView:{
        justifyContent:'center',
        marginRight:20,
    },
    itemRedCircle:{
        width:4,
        height:4,
        borderRadius: 2,
        backgroundColor:'red',
    },
    itemSeparator:{
        height:1,
        // backgroundColor:'transparent',
        backgroundColor:Colors.bgGrayColor_ed,
        marginLeft:15,
        marginRight:15,
    }
})

class MessageCenterScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            data:[],//列表数据
        }

    }

    _initData() { 
        this.loadData()
    }

    loadData(){
        /*let a = []
       for(let i=0;i<20;i++){
           let obj = {
               title:'收款通知'+i,
               address:'12345678'+'....'+i,
               time:'2018-10-20' + 'i'
           }
           a.push(obj);
       }
       this.setState({
             data:a
       })*/
    }

    _onPressItem = (item) => {
        //this.props.navigation.navigate('TransactionRecoder');
    }
    
    //自定义分割线
    _renderItemSeparatorComponent = () => (
        <View style={styles.itemSeparator}>
        </View>
    )

    //空布局
    _renderEmptyView = () => (
        <View style={styles.emptyListContainer}>
            <Image style={styles.emptyListIcon} source={require('../../assets/common/no_icon.png')} resizeMode={'contain'}/>
            <Text style={styles.emptyListText}>{I18n.t('settings.no_contact')}</Text>
        </View>
    )

    _renderItem = (item) => {
        return(
            <Item
                 item = {item}
                 onPressItem = {this._onPressItem.bind(this, item)}
            />     
        )
    }


    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={I18n.t('settings.message_center')}/>
                <FlatList
                    style = {styles.listContainer}
                    ref = {ref=>this.flatList = ref}
                    data = {this.state.data}
                    keyExtractor = {(item,index)=>index.toString()}//给定的item生成一个不重复的key
                    renderItem = {this._renderItem}
                    ListEmptyComponent = {this._renderEmptyView}
                    ItemSeparatorComponent = {this._renderItemSeparatorComponent}
                    getItemLayout={(data, index) => ({ length: 80, offset: (80+1) * index, index: index })}>

                </FlatList>
            </View>    
        );
    }
}


class Item extends PureComponent{


    _onPress = () =>{
        this.props.onPressItem(this.props.item.item)
    }

    render(){
        const { title, address, time } = this.props.item.item || {}
        let isReaded = false;
        return(
            <TouchableOpacity activeOpacity={0.6}
                style={styles.item}
                onPress={this._onPress}>

                <View style={styles.itemContentBox}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <Text style={styles.itemAddress}>{address}</Text>
                    <Text style={styles.itemTime}>{time}</Text>
                </View>
                <View style={styles.itemRightView}>
                    {isReaded ? null : <View style={styles.itemRedCircle}></View>}
                </View>
            </TouchableOpacity>
        )
    }
}


const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MessageCenterScreen)

