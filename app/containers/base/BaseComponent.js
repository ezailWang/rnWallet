import React, {PureComponent} from 'react';
import {StyleSheet,View,BackHandler} from 'react-native';
import StatusBarComponent from '../../components/StatusBarComponent';
import Loading from '../../components/LoadingComponent';
let lastBackPressed = 0;
export default class BaseComponent extends PureComponent{

    constructor(props){
        super(props);
        this.renderComponent = this.renderComponent.bind(this);
       
        this._addEventListener = this._addEventListener.bind(this);
        this._removeEventListener = this._removeEventListener.bind(this);
        this._showLoding = this._showLoding.bind(this);
        this._hideLoading = this._hideLoading.bind(this);
    }


    componentWillMount() {
        console.log('L_base','componentWillMount')
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this._onBackPressed);//Android物理返回键监听
        this._addEventListener();
    }
    
    componentWillUnmount(){
        console.log('L_base','componentWillUnmount')
        this.backHandler && this.backHandler.remove();
        this._removeEventListener();
    }

    _onBackPressed=()=>{ 
        console.log('L_base','_onBackPressed')
        console.log('L_base',this.props.navigation)
        let routeName = this.props.navigation.state.routeName;
        console.log('L_base',"routeName:" + routeName);
        if(routeName == 'FirstLaunch' || routeName == 'Home'){
            //在首页按了物理键返回,Home、FirstLaunch
            if ((lastBackPressed + 2000) >= Date.now()) {
                BackHandler.exitApp;
                return false;
            } else {
                showToast(I18n.t('toast.exit_app'));
                lastBackPressed = Date.now();
                return true;
            }
        }else{
            this.props.navigation.goBack();
        }
        
        return true;
    }

    _addEventListener(){
        console.log('L_base','_addEventListener')
    }

    _removeEventListener(){
        console.log('L_base','_removeEventListener')
    }

    _showLoding(){
        console.log('L_base','_showLoding')
        this.setState({
            isShowLoading:true,
        })
    }

    _hideLoading(){
        console.log('L_base','_hideLoading')
        this.setState({
            isShowLoading:false,
        })
    }

    //渲染子组件
    renderComponent(){
        console.log('L_base','renderComponent')
    };

    render(){
        console.log('L_base','render')
        console.log('L_isShowLoading',this.state.isShowLoading)
        return (
            <View style={styles.container}>
                 <StatusBarComponent barStyle='light-content'/>
                 {this.renderComponent()}
                 <Loading visible={this.state.isShowLoading}/>
            </View>
        )
    }
}





const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})