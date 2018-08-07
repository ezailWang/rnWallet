import React, { Component } from 'react';
import { View,StyleSheet,Image,Text,Modal,TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ScreenshotWarn from '../../components/ScreenShowWarn';
import CommonButton from '../../components/CommonButton';

const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        flex:1,
        alignItems:'center',
    },

    
    contentBox:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:100,
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
    mnemonicTxt:{
        alignSelf:'stretch',
        backgroundColor:'rgb(237,237,237)',
        fontSize:16,
        color:'black',
        borderRadius:20,
        marginTop:30,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:20,
        paddingBottom:20,
        textAlign:'left',
        lineHeight:25,

    },
    buttonBox:{
        flex:1,
        justifyContent:'flex-end',
        alignSelf:'stretch',
        marginBottom:30,

    }
})

class BackupMnemonicScreen extends Component {

    
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
        tabBarVisible: true,
    })

    constructor(props){
        super(props);
        this.state = {
            modalVisible : true,
        }
    }
    onCloseModal() {
        this.setState({modalVisible: false});
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenshotWarn
                    text = '知道了'
                    modalVisible = {this.state.modalVisible}
                    onPress = {()=> this.onCloseModal()}
                />

                <View style={styles.contentBox}>
                    <Image style={styles.icon} source={require('../../assets/launch/mnemonicIcon.jpg')}/>
                    <Text style={styles.titleTxt}>备份助记词</Text>
                    <Text style={styles.contentTxt}>请仔细抄写下方助记词，我们将在下一步验证。</Text>
                    <Text style={styles.mnemonicTxt}>{this.props.mnemonic}</Text>    

                    <View style={styles.buttonBox}>
                         <CommonButton
                             onPress = {()=> this.props.navigation.navigate('VerifyMnemonic')}
                             text = '下一步'
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

export default connect(mapStateToProps,{})(BackupMnemonicScreen)

