import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, WebView, TouchableOpacity, Image, Text, Platform, ScrollView } from 'react-native';
import { WhiteBgHeader } from '../../components/NavigaionHeader'
import { BlueButtonBig } from '../../components/Button'
import { Colors } from '../../config/GlobalConfig'
import Layout from '../../config/LayoutConstants'
import { I18n } from '../../config/language/i18n'
import BaseComponent from '../../containers/base/BaseComponent'



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    contentBox: {
        width: Layout.WINDOW_WIDTH,
    },
    webview: {
        width: Layout.WINDOW_WIDTH * 0.9,
        alignSelf: 'center',
        marginBottom: 20,
    },
    checkBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: Layout.WINDOW_WIDTH * 0.9 - 20,
        alignSelf: 'center',
        marginTop: 20,
    },
    checkImage: {
        width: 18,
        height: 18,
        borderRadius: 5,
        marginRight: 8,
    },
    checkText: {
        width: (Layout.WINDOW_WIDTH * 0.9 - 20) - 26,
        color: Colors.fontBlueColor,
        fontSize: 14,
    },
    button: {
        //width:Layout.WINDOW_WIDTH*0.8,
        marginTop: 10,
        alignSelf: 'center'
    }
});

const GetWebviewHeight = `(function(){
    var height = null;
    function changeHeight(){
        if(document.body.scrollHeight != height){
            height = document.body.scrollHeight;
            if(window.postMessage){
                window.postMessage(JSON.stringify({
                    type:'setHeight',
                    height:height,
                }))
            }
        }
    }
    setInterval(changeHeight,300);
} ())
`
export default class MessageWebViewScreen extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            title:'',
            url:'',
            webviewHeight: Layout.WINDOW_HEIGHT,
        }
    }

    _initData() {
        let title =  this.props.navigation.state.params.title
        let url = this.props.navigation.state.params.url
        this.setState({
            title : title, 
            url : url
        })
    }


    onMessage(event) {
        try {
            const action = JSON.parse(event.nativeEvent.data)
            if (action.type == 'setHeight' && action.height > 0) {
                this.setState({
                    webviewHeight: action.height
                })
            }
        } catch (err) {

        }
    }

    backPressed() {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
    }

    _onBackPressed = () => {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack()
        return true;
    }

    renderComponent() {
        let contentUrl = this.state.url;
        return (
            <View style={styles.container} >
                <WhiteBgHeader navigation={this.props.navigation} text={this.state.title} leftPress={() => this.backPressed()} />
                <ScrollView style={[styles.contentBox]}>
                    <WebView
                        style={[styles.webview, { height: this.state.webviewHeight }]}
                        source={{html: contentUrl}}
                        //injectedJavaScript={GetWebviewHeight}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        decelerationState='normal'
                        startInLoadingState={true}
                        bounces={false}
                        scrollEnabled={false}
                        automaticallyAdjustContentInsets={true}
                        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
                        //onMessage={this.onMessage.bind(this)}
                        domStorageEnabled={true}
                    />
                </ScrollView>
            </View>
        )
    }
}
