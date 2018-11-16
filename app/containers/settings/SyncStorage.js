import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Text,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions'
import StorageManage from '../../utils/StorageManage'
import {BlueButtonBig} from '../../components/Button'
import {Colors,StorageKey} from '../../config/GlobalConfig'
import {WhiteBgHeader} from '../../components/NavigaionHeader'
import { androidPermission } from '../../utils/PermissionsAndroid';
import { showToast } from '../../utils/Toast';
import { I18n } from '../../config/language/i18n'
import Layout from '../../config/LayoutConstants'
import NetworkManager from '../../utils/NetworkManager';
import {CommonTextInput} from '../../components/TextInputComponent'
import RemindDialog from '../../components/RemindDialog'
import BaseComponent from '../base/BaseComponent';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    contentBox:{
        marginTop:10,
        width:Layout.WINDOW_WIDTH*0.9,
        alignSelf:'center',
    },
    text:{
        color:Colors.fontBlackColor,
        fontSize:13,
        marginBottom:3,
        marginTop:12,
    },
    textInput:{
        //marginBottom:15,
    },
    warnTxt:{
        fontSize:10,
        color:'red',
        alignSelf:'flex-end',
        paddingTop: 5,
        paddingLeft:10,
    },
    warnTxtHidden:{
        height:0
    },
    button:{
        marginTop:40,
    },
    deleteTouchable:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
    },
    deleteText:{
        fontSize:16,
        color:Colors.fontBlueColor,
    },
    
})

class SyncStorage extends BaseComponent {
   
    constructor(props){
        super(props);
        this.state = {
    
        }

        this.data=0;
    }

    _initData() { 
        
    }

  
    syncStorage(){
        //let {id,resolve,reject,syncParams:{ extraFetchOptions, someFlag}} = params;

        let allTokensParams = {
            //'network': this.props.network,
            'network': 'main',
        }
        NetworkManager.getAllTokens(allTokensParams).then((response) => {
            if (response.code === 200) {
                this.data = this.data + 1;
                StorageManage.save('syncStorage',this.data,'1')
                console.log('L_network','网络加载')   
            } else {
                console.log('L_test err msg:', response.msg)
            }
        }).catch((err) => {
            console.log('L_test err:', err)
        })

    }

    
    async saveModify(){
        let a = await StorageManage.syncLoad('syncStorage',this.syncStorage(),'1')
        console.log('L_getdata',a)
    }

   async remove(){
    StorageManage.remove('syncStorage','1')
   }
    
    renderComponent() {
        return (
            <View style={styles.container}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={() => {
                     Keyboard.dismiss()
                  }}>
                <WhiteBgHeader  navigation={this.props.navigation} 
                                text={''}
                              />
               

                <View style={styles.contentBox}>
                
                    <BlueButtonBig
                         buttonStyle= {styles.button}
                         onPress = {()=> this.saveModify()}
                         text = {I18n.t('settings.save_changes')}
                    />

                     <BlueButtonBig
                         buttonStyle= {styles.button}
                         onPress = {()=> this.remove()}
                         text = {'delete'}
                    />
                  
                </View>
                     
            </View>    
        );
    }
}


const mapStateToProps = state => ({
    contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
    setContactList: (contacts) => dispatch(Actions.setContactList(contacts)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SyncStorage)


