import React, { PureComponent } from 'react';
import { View,StyleSheet,Image,Text,Dimensions,TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import {BlueButtonBig} from '../../components/Button';
import {Colors,FontSize} from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import Layout from '../../config/LayoutConstants'
import {showToast} from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    contentContainer:{
        flex:1,
        width:Layout.WINDOW_WIDTH*0.9,
        alignSelf:'center',
        paddingTop:40,
        //alignItems:'stretch',
    },
    icon:{
        alignSelf:'center',
        width:48,
        height:48,
        marginBottom:25,
    },
    blueText:{
        fontSize:18,
        fontWeight:'bold',
        color: Colors.fontBlueColor,
        marginBottom:15,
        marginTop:15,
    },
    itemBox:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:8,
        
    },
    itemCircle:{
        width:4,
        height:4,
        borderRadius: 2,
        marginRight:10,
    },
    itemText:{
        width:Layout.WINDOW_WIDTH*0.9-14,
        color:Colors.fontBlackColor,
        fontSize:14,
    },
    viewBottom:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        marginBottom:40,
    },
    checkBox:{
        flexDirection:'row',
        alignItems:'center',
    },
    checkImage:{
        width:18,
        height:18,
        borderRadius:5,
        marginRight:8,
    },
    checkText:{
        color:Colors.fontBlackColor,
        fontSize:14,
    }
})

export default class BackupWalletScreen extends BaseComponent {
   
    constructor(props) {
        super(props);
        this.state = {
            isCheck:false,
        }
    }

    isReadPress() {
        this.setState({ isCheck: !this.state.isCheck });
    }

    renderComponent() {
        return (
            <View style={styles.container}>
                <WhiteBgHeader  navigation={this.props.navigation} text={I18n.t('launch.backup_wallet')}/>
                <View style={styles.contentContainer}>
                     <Image style={styles.icon} source={require('../../assets/launch/backup.png')} resizeMode={'center'}/>
               
                     <Text style={styles.blueText}>为什么要备份助记词</Text>
                     <Item content={'助记词可以恢复您的钱包，拥有助记词就能完全控制该地址的资产。'}></Item>
                     <Item content={'我们不存储助记词，也无法帮您找回，请务必备份好您的助记词。'}></Item>

                     <Text style={styles.blueText}>如何备份助记词</Text>
                     <Item content={'请将助记词抄写在纸上，并存放在安全的地方。'}></Item>
                     <Item content={'切勿将助记词保存至邮箱、网盘等，更不要使用网络工具进行传输。'}></Item>
                
                    
                
                     <View style={styles.viewBottom}>
                         <TouchableOpacity style={styles.checkBox} activeOpacity={0.6} onPress={() => this.isReadPress()}>
                             <Image style={styles.checkImage} source={require('../../assets/common/scanIcon.png')} resizeMode={'center'} ></Image>
                             <Text style={styles.checkText}>我已读，并且已经准备好纸和笔</Text>
                         </TouchableOpacity>
                         <BlueButtonBig
                             buttonStyle={{marginTop:10}}
                             isDisabled = {!this.state.isCheck}
                             onPress = {()=> this.props.navigation.navigate('BackupMnemonic',{password: this.props.navigation.state.params.password})}
                             text = {I18n.t('launch.backup_mnemonic')}
                         />
                     </View>
                       
                </View>
                         
            </View>
        );
    }
}


class Item extends PureComponent{
    static propTypes = {
        content: PropTypes.string.isRequired,
    };
    render(){
        return(
            <View style={styles.itemBox}>
                <LinearGradient colors={['#32beff', '#0095eb', '#2093ff']}
                                 start={{x:0,y:0}}
                                 end={{x:1,y:1}}
                                 style={styles.itemCircle}>
                </LinearGradient>
                <Text style={styles.itemText}>{this.props.content}</Text>
            </View>
        )
    }
}
