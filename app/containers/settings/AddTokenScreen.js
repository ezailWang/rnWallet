import React, { PureComponent } from 'react';
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    Platform,
    Image
} from 'react-native';

import PropTypes from 'prop-types'
import StorageManage from '../../utils/StorageManage'
import { connect } from 'react-redux';
import NetworkManager from '../../utils/NetworkManager';
import * as Actions from '../../config/action/Actions'
import { Colors, StorageKey } from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../base/BaseComponent'
import { addressToName } from '../../utils/CommonUtil'

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
        borderRadius:5,
        backgroundColor: Colors.backgroundColor,
    },
    searchIcon:{
        width:18,
        height:18,
        marginRight:10,
        marginLeft:10,
    },
    searchInput:{
        flex:1,
        color:Colors.fontGrayColor_a0,
        fontSize:13,
    },
    cancelBox:{
        height:38,
        paddingLeft:10,
    },
    cancelText:{
        height:38,
        lineHeight:38,
        fontSize:14,
        color:Colors.fontBlackColor_43,
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
        borderRadius:5,
        paddingLeft:20,
        paddingRight:20,  
    },
    itemAddBtn:{
        borderColor:Colors.fontBlueColor,
        backgroundColor:Colors.fontBlueColor
    },
    itemRemoveBtn:{
        borderWidth:1,
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
    }
   
})

class AddTokenScreen extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
            datas:[],//列表数据
        }
        this.addedTokens = [];//已经添加的Tokens
        this.tokenList = [];
    }

    async _initData() { 
        this._loadData()
    }

    _loadData(){
        let allTokens = [];
        let defaultTokens = [];//默认的
        let addTokens = [];//添加的
        console.log('L_tokens',this.props.tokens)
        this.props.tokens.forEach(function (token, index, b) {
            token.isAdded = true
            if(index == 0 || index == 1){
                defaultTokens.push(token)
            }else{
                addTokens.unshift(token)
            }
        })
        allTokens = defaultTokens.concat(addTokens)
        this.tokenList = [].concat(allTokens);
        this.addedTokens = [].concat(allTokens);
        this.setState({
            datas : allTokens 
        })
    }


    //自定义分割线
    _renderItemSeparatorComponent = () => (
        <View style={styles.itemSeparator}>
        </View>
    )


    _renderItem = (item) => {
        return(
            <ItemView
                 item = {item}
                 addOrRemoveItem = {this._addOrRemoveItem.bind(this,item)} 
            />     
        )
    }

    _addOrRemoveItem = async(item) => {
        let token = item.item;
        let index = this.tokenList.findIndex(addedToken => addedToken.address == token.address);
        let addedIndex = this.addedTokens.findIndex(addedToken => addedToken.address == token.address);
        let isAdd = token.isAdded;

        this.tokenList.splice(index, 1, token)
        if(isAdd){
             //添加
             this.props.addToken(token)
             this.addedTokens.push(token)
        }else{
            //移除
            this.props.removeToken(token.address)
            this.addedTokens.splice(addedIndex, 1)
        }
        let list = this.tokenList
        this.setState({
            datas: list,
        })
    }

   
   
    _search = async() =>{
        let _this = this;
        this.props.navigation.navigate('SearchToken', {
            callback: async (data) => {
                _this._loadData()
                /*let tokens = data.addedTokens
                _this._showLoding()
                let localTokens = [];
                tokens.forEach(function (value, index, b) {
                    if(index != 0 && index != 1){
                        localTokens.push({
                            iconLarge: value.iconLarge,
                            symbol: value.symbol,
                            name: value.name,
                            decimal: parseInt(value.decimal, 10),
                            address: value.address,
                        })
                    } 
                })
                StorageManage.save(StorageKey.Tokens, localTokens)
                //await NetworkManager.loadTokenList()
                _this._loadData()
                _this._hideLoading()*/
            }
        });
    }

    _backPress = () =>{
        this._saveData()
    }

    _onBackPressed = () => {
        this._saveData()
        return true;
    }

    _saveData = async() => {
        this._showLoding()
        let tokens = this.addedTokens;
        let localTokens = [];
        tokens.forEach(function (value, index, b) {
            if(index != 0 && index != 1){
                localTokens.push({
                    iconLarge: value.iconLarge,
                    symbol: value.symbol,
                    name: value.name,
                    decimal: parseInt(value.decimal, 10),
                    address: value.address,
                })
            } 
        })
        StorageManage.save(StorageKey.Tokens, localTokens)

        this._hideLoading()
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
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
                     <TouchableOpacity activeOpacity={0.6}
                                       style={styles.searchBox}
                                       onPress={this._search}>
                            <Image style={styles.searchIcon} source={require('../../assets/common/search.png')} resizeMode='contain'/>  
                            <Text  style={styles.searchInput} >{I18n.t('settings.input_token_name')}</Text>      
                     </TouchableOpacity>
                </View>
                <View style = {styles.line}></View>
                <FlatList
                     style = {styles.listContainer}
                     ref = {ref=>this.flatList = ref}
                     data = {this.state.datas}
                     keyExtractor = {(item,index)=>index.toString()}//给定的item生成一个不重复的key
                     renderItem = {this._renderItem}
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
    }

    _itemAddOrRemovePress = () =>{
        let preTokenIsAdded = this.props.item.item.isAdded;
        let nowToken = (preTokenIsAdded == undefined || preTokenIsAdded == false)  ? this.props.item.item.isAdded = true : this.props.item.item.isAdded = false
        this.props.addOrRemoveItem(nowToken)
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
        let icon = this._getLogo(symbol,iconLarge)

        let _address = address.substr(0,6) + '---' + address.substr(36,42);
        let isHideBtn = symbol.toLowerCase() == 'eth' || symbol.toLowerCase() == 'itc' ?  true : false
        let btnTxt = (isAdded == undefined || !isAdded) ? I18n.t('settings.add') : I18n.t('settings.remove');
        let fullName = name=='' || name ==undefined ? '---' : name;
 
        return(
            <View style={styles.item}>
                <Image style={styles.itemIcon}  
                       source={ iconLarge=='' ||  this.state.loadIconError == true  || symbol == 'ITC' ? icon  : {uri:iconLarge}} 
                       resizeMode='contain'
                       iosdefaultSource={require('../../assets/home/null.png')}
                       onError = {()=>{
                            this.setState({
                               loadIconError:true,
                            })
                       }}/>
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
                        <Text style={[styles.itemAddOrRemoveText,isAdded ? styles.itemRemoveText : styles.itemAddText]}>{btnTxt}
                        </Text>          
                    </TouchableOpacity>
                }
                
            </View>
        )
    }
}


const mapStateToProps = state => ({
    tokens: state.Core.tokens,
});
const mapDispatchToProps = dispatch => ({
    addToken : (token) => dispatch(Actions.addToken(token)),
    removeToken: (token) => dispatch(Actions.removeToken(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddTokenScreen)

