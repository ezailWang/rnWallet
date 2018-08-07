import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonButton from '../../components/CommonButton';
import { connect } from 'react-redux';
import CommonFun from './Common';

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:40,
        paddingLeft:20,
        paddingRight:20,
        //alignItems:'stretch',
    },
    icon:{
        width:46,
        height:46,
    },
    titleTxt:{
        fontSize:18,
        fontWeight:'500',
        color:'rgb(85,146,246)',
        marginTop:15,
        marginBottom:30,
    },
    contentTxt:{
        fontSize:16,
        color:'rgb(175,175,175)',
    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        alignSelf:'stretch',
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
        borderColor:'rgb(230,230,230)',
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
        marginTop:10,
    },
    mnemonicSortBorder:{
        alignSelf:'stretch',
        backgroundColor:'rgb(237,237,237)',
        borderRadius:20,
        marginTop:30,
        marginBottom:10,
        paddingLeft:12,
        paddingRight:12,
        paddingTop:12,
        paddingBottom:12,
        height: 142,
        alignItems:'center'
    },

})

class VerifyMnemonicScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <Ionicons.Button
                name="ios-arrow-back"
                size={25}
                color='skyblue'
                backgroundColor='rgba(255,255,255,0)'
                onPress={() => navigation.goBack()}
            />
        ),
        tabBarVisible: false,
    })
   
    constructor(props){
        super(props);
        this.state = {
            mnemonicDatas : [],
            sortMnemonicDatas  : []
        }
    }

    componentWillMount(){
        var m = this.props.mnemonic.split(' ');
        var md = CommonFun.upsetArrayOrder(m);
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
            this.props.navigation.navigate('CreateWallet');
            /**Alert.alert(
                'error',
                'Incorrect match',
            )**/
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
                 <Image style={styles.icon} source={require('../../assets/launch/confirmIcon.jpg')}/>
                 <Text style={styles.titleTxt}>确认助记词</Text>
                 <Text style={styles.contentTxt}>请按顺序点击助记词，以确认您正确备份。</Text>

                <View style={[styles.mnemonicList,styles.mnemonicSortBorder]}>
                     {sortMnemonicView}
                 </View>

                 <View style={styles.mnemonicList}>
                     {mnemonicView}
                 </View>
        
                 <View style={styles.buttonBox}>
                      <CommonButton
                         onPress = {()=> this.completeClickFun()}
                         text = '完成'
                      />
                 </View>            
           </View>
        );
    }
}

const mapStateToProps = state => ({
    mnemonic:state.Core.mnemonic,
});

export default connect(mapStateToProps,{})(VerifyMnemonicScreen)


