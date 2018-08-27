import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Alert,Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BlueButtonBig} from '../../components/Button';
import { connect } from 'react-redux';
import {upsetArrayOrder} from './Common';
import {Colors,FontSize} from '../../config/GlobalConfig'
import StatusBarComponent from '../../components/StatusBarComponent';
import {WhiteBgNoTitleHeader} from '../../components/NavigaionHeader'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    contentContainer:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:ScreenHeight*0.05,
        paddingLeft: ScreenWidth*0.08,
        paddingRight: ScreenWidth*0.08,
        //alignItems:'stretch',
    },
    icon:{
        width:48,
        height:48,
    },
    titleTxt:{
        fontSize:20,
        fontWeight:'bold',
        color:Colors.fontBlueColor,
        marginBottom:30,
    },
    contentTxt:{
        fontSize:FontSize.ContentSize,
        color:Colors.fontGrayColor_a0,
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:30,
    },
    mnemonicItem:{
        height:28,
        fontSize:14,
        color:'black',
        lineHeight:28,
        paddingLeft:6,
        paddingRight:6,
        borderWidth:1,
        borderColor:Colors.fontGrayColor,
        backgroundColor:'white',
        marginLeft:8,
        marginRight:8,
        marginBottom:10,  
    },
    mnemonicList:{
        alignSelf:'stretch',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
    },
    mnemonicSortBorder:{
        flex:1,
        justifyContent:'center',
        alignSelf:'stretch',
        backgroundColor:'rgb(237,237,237)',
        borderRadius:8,
        marginTop:30,
        marginBottom:10,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
    },

})

class VerifyMnemonicScreen extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            mnemonicDatas : [],
            sortMnemonicDatas  : []
        }
    }

    componentWillMount(){
        var m = this.props.mnemonic.split(' ');
        var md = upsetArrayOrder(m);
        this.setState({
            mnemonicDatas:md,
       })
    }

    addSortMnemonicFun(i,txt) {
        var smd = this.state.sortMnemonicDatas.slice(0);
        smd.push(txt);
        var md = this.state.mnemonicDatas.slice(0);
        md.splice(i,1)
        this.setState({
             mnemonicDatas: md,
             sortMnemonicDatas:smd,
        });
    }
    removeSortMnemonicFun(i,txt){
        var md = this.state.mnemonicDatas.slice(0);
        md.push(txt);
        var smd = this.state.sortMnemonicDatas.slice(0);
        smd.splice(i,1)
        this.setState({
             mnemonicDatas: md,
             sortMnemonicDatas:smd,
        });
    }

    completeClickFun(){
        if(this.state.sortMnemonicDatas.join(' ') == this.props.mnemonic){
            this.props.navigation.navigate('CreateWallet');
        }else{
            Alert.alert(
                'error',
                'Incorrect match',
            )
        }
        
    }

    render() {
        var renderThis = this;

        var mnemonicView = [];
        this.state.mnemonicDatas.forEach(function(txt,index,b){
            mnemonicView.push(
                <Text key={index} style={styles.mnemonicItem} 
                      onPress = {(e) => {renderThis.addSortMnemonicFun(index,txt)}}
                >{txt}
                </Text>
            )
        })

        var sortMnemonicView = [];
        this.state.sortMnemonicDatas.forEach(function(txt,index,b){
            sortMnemonicView.push(
                <Text key={index} style={styles.mnemonicItem} 
                      onPress = {(e) => {renderThis.removeSortMnemonicFun(index,txt)}}
                >
                {txt}
                </Text>
            )
        })

        return (
            <View style={styles.container}>
                 <StatusBarComponent/>
                 <WhiteBgNoTitleHeader navigation={this.props.navigation}/>
                 <View style={styles.contentContainer}>
                     <Image style={styles.icon} source={require('../../assets/launch/confirmIcon.png')} resizeMode={'center'}/>
                     <Text style={styles.titleTxt}>确认助记词</Text>
                     <Text style={styles.contentTxt}>请按顺序点击助记词，以确认您正确备份。</Text>

                     <View style={styles.mnemonicSortBorder}>
                        <View style={[styles.mnemonicList,]}>
                            {sortMnemonicView}
                        </View>
                     </View>
                     

                     <View style={styles.mnemonicList}>
                         {mnemonicView}
                     </View>
        
                     <View style={styles.buttonBox}>
                         <BlueButtonBig
                             onPress = {()=> this.completeClickFun()}
                             text = '完成'
                         />
                     </View>      
                 </View>
                      
           </View>
        );
    }
}

const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});

export default connect(mapStateToProps,{})(VerifyMnemonicScreen)


