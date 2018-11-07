import React, { PureComponent } from 'react';
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    TextInput,
    Image,
    Platform
} from 'react-native';

import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import networkManage from '../../utils/networkManage';
//import {CachedImage,ImageCache} from 'react-native-img-cache'
//import {Image as CacheImage,CacheManager} from "react-native-expo-image-cache";
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        alignItems:'center',
    },
    topBox:{ 
        backgroundColor:Colors.whiteBackgroundColor, 
        flexDirection:'row',
        alignItems:'center',
        height:46,
        marginTop: Layout.DEVICE_IS_IPHONE_X() ? 48 : 24,
    },
    backBox:{
        height:46,
        justifyContent:'center',
        paddingLeft:15,
        paddingRight:15,
    },
    backIcon:{
        width:22,
        height:22,
    },
    searchBox:{
        flex:1,
        flexDirection:'row',
        height:30,
        marginRight:15,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        backgroundColor: Colors.backgroundColor,
    },
    searchIcon:{
        width:20,
        height:20,
        marginLeft:10,
        marginRight:10,
    },
    searchInput:{
        flex:1,
        color:Colors.fontGrayColor_a0,
        fontSize:13,
        height:28,
        paddingVertical:0,
    },
    cancelBox:{
        height:30,
        paddingRight:15,
        paddingLeft:15,
        justifyContent:'center',
    },
    cancelIcon:{
        width:20,
        height:20,
    },
    line:{
        backgroundColor:Colors.backgroundColor,
        height:10,
        width:Layout.WINDOW_WIDTH,
    },
    listContainer:{
        flex:1,
        width:Layout.WINDOW_WIDTH,
        marginTop:10,
        paddingLeft:10,
        paddingRight:10,
    },
    item:{
        flexDirection:'row',
        alignItems:'center',
        height:72,
        backgroundColor:'white',
        paddingLeft:20,
        paddingRight:20,
    },
    itemIcon:{
        width:30,
        height:30,
        borderRadius:15,
        marginRight:10,
    },
    itemCenterBox:{
        flex:1,
        flexDirection:'column',
        alignItems:'flex-start',
    },
    itemName:{
        fontSize:15,
        color:Colors.fontBlackColor_43,
    },
    itemFullName:{
        fontSize:12,
        color:Colors.fontGrayColor_a,
    },
    itemAddress:{
        fontSize:12,
        color:Colors.fontGrayColor_a,
    },
    itemRightBox:{
        height:30,
        justifyContent:'center',
    },
   
    itemAddOrRemoveBtn:{
        height:30,
        lineHeight:30,
        fontSize:14,
        borderWidth:1,
        borderRadius:5,
        paddingLeft:20,
        paddingRight:20,
        
    },
    itemAddBtn:{
        borderColor:Colors.fontBlueColor,
        backgroundColor:Colors.fontBlueColor
    },
    itemRemoveBtn:{
        borderColor:Colors.fontBlueColor,
        backgroundColor:'transparent'
    },
    itemAddText:{
        color:'white',
    },
    itemRemoveText:{
        color:Colors.fontBlueColor,
    },
    itemSeparator:{
        height:2,
        width:Layout.WINDOW_WIDTH-20,
        backgroundColor:Colors.backgroundColor,
    },
    emptyListContainer:{
        flex:1,
        paddingTop:80,
        //height:Layout.WINDOW_HEIGHT - Layout.DEVICE_IS_IPHONE_X() ? 112 : 88,
        justifyContent:'center',
        backgroundColor:'white',
        alignItems:'center',
        //marginBottom:20,
    },
    emptyListBox:{
        alignItems:'center'
    },
    emptyListIcon:{
        width:94,
        height:114,
        marginBottom:23,     
    },
    emptyListText:{
        fontSize:16,
        width:Layout.WINDOW_WIDTH*0.8,
        color:Colors.fontGrayColor_a,
        textAlign:'center',
    },
    toFeedbackBtn:{
        height:40,
        paddingLeft:26,
        paddingRight:26,
        marginTop:50,
        borderWidth:1.5,
        borderRadius:5,
        borderColor:Colors.fontBlueColor,
    },
    feedBackText:{
        fontSize:16,
        color:Colors.fontBlueColor,
        lineHeight:40,
    }
   
})

class SearchTokenScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            datas:[],//列表数据
        }

        this.searchText = '';
        this.allTokens = [];//所有的tokens
        this.searchTokens = [];//搜索到符合的条件的tokens
        this.addedTokens = [];//已经添加的Tokens
    }

    _initData() { 
        this._getAllTokens()   
        let addTokens = [];
        this.props.tokens.forEach(function (token, index, b) {
            token.isAdded = true
            addTokens.push(token)
           
        })
        this.addedTokens = addTokens
    }

    _getAllTokens(){
        let params = {
            //'network': this.props.network,
            'network': 'main',
        }
        networkManage.getAllTokens(params).then((response)=>{
            if(response.code === 200){
                this.allTokens = response.data
            }else{
                console.log('getAllTokens err msg:', response.msg)
            }
        }).catch((err)=>{
           console.log('getAllTokens err:', err)
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
            
             <View style={styles.emptyListBox}>
                     <Image style={styles.emptyListIcon} source={require('../../assets/common/no_icon.png')} resizeMode={'contain'}/>
                     <Text style={styles.emptyListText}>{I18n.t('settings.no_related_currency_found')}</Text>
                     <TouchableOpacity activeOpacity={0.6}
                               style={styles.toFeedbackBtn}
                               onPress={this._toFeedbackPress}>
                            <Text style={styles.feedBackText}>{I18n.t('settings.feedback')}</Text>          
                     </TouchableOpacity> 
             </View>
        </View>
    )

    _toFeedbackPress = () => {
        this.props.navigation.navigate('Feedback')
    }

    _renderItem = (item) => {
        return(
            <ItemView
                 item = {item}
                 onPressItem = {this._onPressItem.bind(this, item)}
                 addOrRemoveItem = {this._addOrRemoveItem.bind(this,item)} 
            />     
        )
    }

    _onPressItem = (item) => {
    }

    _addOrRemoveItem = async(item) => {
        
        let token = item.item;
        let index = this.addedTokens.findIndex(addedToken => addedToken.address == token.address);
        let isAdd = token.isAdded;

        console.log('L_add_remove',token)
        if(isAdd){
            if(index >=0){
                //this.addedTokens.splice(index, 1,token)
            }else{
                //添加
                this.props.addToken(token)
                this.addedTokens.push(token)
            }
        }else{
            //移除
            this.props.removeToken(token.address)
            this.addedTokens.splice(index, 1)
        }
        this.refreshDatas();
    }

   
    _backPress = () =>{
        this._saveData()
    }

    _onBackPressed = () => {
        this._saveData()
        return true;
    }

    _saveData = () => {
        let addedTokens = this.addedTokens;
        this.props.navigation.state.params.callback({addedTokens:addedTokens});
        this.props.navigation.goBack()
    }

    _onChangeText=(text)=>{
        this.searchText = text.trim();
        if(this.searchText == ''){
            this.searchTokens=[];
            this.setState({
                datas: [],
            })
        }else{
            this._matchToken()
        }
       
        
    }
    
    _matchToken=()=>{
        this.searchTokens=[];
        let allTokens = this.allTokens;
        let searchContent = this.searchText;
        for(let i=0;i<allTokens.length;i++){
            let token = allTokens[i];
            let symbol  = token.symbol.trim().toLowerCase()
            if(symbol.indexOf(searchContent.trim().toLowerCase())>=0){
                this.searchTokens.push(token)
            }
        }
        this.refreshDatas(); 
    }
    refreshDatas = () =>{
        let datas = [];
        let addedTokens = this.addedTokens;
        this.searchTokens.forEach(function (data, index) {
            let isAdded = false;//是否已添加
            let imgCache = '';
            for(let i=0;i<addedTokens.length;i++){
                if(data.address == addedTokens[i].address){
                    isAdded = true;
                    imgCache = addedTokens[i].imgCache
                    break;
                }
            }
            let obj = {
                iconLarge: data.iconLarge,
                symbol: data.symbol,
                name: data.name,
                decimal: data.decimal,
                address: data.address,
                isAdded:isAdded,
                imgCache : imgCache,
            }
            datas.push(obj)
        })
        this.setState({
            datas: datas,
        })
    }

    _cancelPress = () =>{
        this.searchText = '';
        this.searchTokens=[];
        this.refs.searchInput.clear()
        this.setState({
            datas: [],
        })
    }
   
    renderComponent() {
        return (
            <View style={styles.container}>
                <View style={styles.topBox}>
                     <TouchableOpacity activeOpacity={0.6}
                                       style={styles.backBox}
                                       onPress={this._backPress}>
                          <Image style={styles.backIcon} source={require('../../assets/common/common_back.png')} resizeMode='contain'/>          
                     </TouchableOpacity>
                     <View style={styles.searchBox}>
                         <Image style={styles.searchIcon} source={require('../../assets/set/add.png')} resizeMode='contain'/>  
                         <TextInput style={styles.searchInput} 
                                    ref="searchInput"
                                    autoFocus={true}
                                    placeholderTextColor = {Colors.fontGrayColor_a0}
                                    placeholder={I18n.t('settings.input_token_name')}
                                    onChangeText={this._onChangeText}></TextInput>
                         <TouchableOpacity activeOpacity={0.6}
                                              style={styles.cancelBox}
                                              onPress={this._cancelPress}>
                                 <Image style={styles.cancelIcon} source={require('../../assets/set/add.png')} resizeMode='contain'/>         
                         </TouchableOpacity>           
                     </View>
                </View>
                <View style = {styles.line}></View>
                <FlatList
                     style = {styles.listContainer}
                     ref = {ref=>this.flatList = ref}
                     data = {this.state.datas}
                     keyExtractor = {(item,index)=>index.toString()}//给定的item生成一个不重复的key
                     renderItem = {this._renderItem}
                     ListEmptyComponent = {this._renderEmptyView}
                     ItemSeparatorComponent = {this._renderItemSeparatorComponent}
                     getItemLayout={(datas, index) => ({ length: 72, offset: (72+2) * index, index: index })}>
                </FlatList>
            </View>    
        );
    }
}


class ItemView extends PureComponent{

    constructor(props){
        super(props);
        this.state = {
            loadIconError: false,
        }
        this.imgCache = '' 
    }

    _itemAddOrRemovePress = () =>{
        let preTokenIsAdded = this.props.item.item.isAdded;
        let nowToken = (preTokenIsAdded == undefined || preTokenIsAdded == false)  ? this.props.item.item.isAdded = true : this.props.item.item.isAdded = false
        this.props.item.item.isAdded = nowToken
        this.props.item.item.imgCache = this.imgCache
        console.log("LLLLLLLL",this.props.item.item)
        this.props.addOrRemoveItem(this.props.item.item)
    }

    _onItemPress = () =>{
        this.props.onPressItem(this.props.item.item)
    }

    _getLogo = (symbol,iconLarge) =>{
        if(symbol == 'ITC'){
            return require('../../assets/home/ITC.png');
        }
        if(iconLarge == ''){
            if(symbol == 'ETH'){
                return require('../../assets/home/ETH.png');
            }else if(symbol == 'ITC'){
                return require('../../assets/home/ITC.png');
            }else{
                return require('../../assets/home/null.png');
            }
        }else {
            if(this.state.loadIconError){
                return require('../../assets/home/null.png');
            }
        }
    }

    render(){
        const { iconLarge, symbol, name,decimal,address,isAdded} = this.props.item.item || {}
        let icon = this._getLogo(symbol,iconLarge);
        let _address = address.substr(0,6) + '---' + address.substr(36,42);
        let isHideBtn = symbol.toLowerCase() == 'eth' || symbol.toLowerCase() == 'itc' ?  true : false
        let btnTxt = (isAdded == undefined || !isAdded) ? I18n.t('settings.add') : I18n.t('settings.remove');
        let fullName = name=='' || name ==undefined ? '---' : name;

        /*if(iconLarge != ''){
            let imgCache = ImageCache.get().getPath(iconLarge)
            console.log('L_cache',imgCache)
            if(imgCache != '' && imgCache != undefined){
                //iconUri =  Platform.OS == 'android' ? 'file://' +  imgCache : imgCache
                this.props.item.item.imgCache = imgCache
            }
            console.log('Litem',this.props.item.item)
        }*/
       

        return(
            <TouchableOpacity activeOpacity={1}
                {...this.props}
                style={styles.item}
                onPress={this._onItemPress}
                disabled={true}>
                <Image style={styles.itemIcon} 
                        //defaultSource={require('../../assets/home/null.png')}
                        //source={ icon=='uri' ? icon  : {uri:iconLarge}} 
                        source={ iconLarge=='' ||  this.state.loadIconError == true  || symbol == 'ITC' ? icon  : {uri:iconLarge}} 
                        cache='force-cache'
                        resizeMode='contain'
                        onError = {()=>{
                            this.setState({
                                loadIconError:true,
                            })
                        }}
                        onLoad = {(event)=>{
                            console.log('L_load',event.nativeEvent)
                        }}/>

                  {/*<CachedImage style = {styles.itemIcon} 
                              source={ iconLarge=='' ||  this.state.loadIconError == true  || symbol == 'ITC' ? icon  : {uri:iconLarge}} 
                              resizeMode='contain'
                              onLoad = {(event)=>{
                                    if(iconLarge !='' && this.state.loadIconError == false ){
                                        let imgCache = ImageCache.get().getPath(iconLarge)
                                        //console.log('LimgCache',symbol +  '-------'+ imgCache)
                                        if(imgCache != '' &&  imgCache != undefined){
                                            this.imgCache = imgCache
                                        }else{
                                            this.imgCache = ''
                                        }
                                    }
                                    
                              }}
                              onError = {()=>{
                                     //console.log('Litem2',symbol +  '-------'+ '失败')
                                     this.imgCache = ''
                                     this.setState({
                                         loadIconError:true,
                                     })
                                    
                              }} />  */}
                 
                 <View style={styles.itemCenterBox}>
                    <Text style={styles.itemName}>{symbol}</Text>
                    <Text style={styles.itemFullName}>{fullName}</Text>
                    <Text style={styles.itemAddress}>{_address}</Text>
                 </View>
                 {
                    isHideBtn ? null :
                    <TouchableOpacity activeOpacity={0.6}
                                  style={[styles.itemRightBox,styles.itemAddOrRemoveBtn,isAdded ? styles.itemRemoveBtn : styles.itemAddBtn]}
                                  onPress={this._itemAddOrRemovePress}>
                        <Text style={[isAdded ? styles.itemRemoveText : styles.itemAddText]}>{btnTxt}
                        </Text>          
                    </TouchableOpacity>
                 }
                
            </TouchableOpacity>
        )
    }
}


const mapStateToProps = state => ({
    tokens: state.Core.tokens,
    network : state.Core.network,
});
const mapDispatchToProps = dispatch => ({
    addToken : (token) => dispatch(Actions.addToken(token)),
    removeToken: (token) => dispatch(Actions.removeToken(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchTokenScreen)

