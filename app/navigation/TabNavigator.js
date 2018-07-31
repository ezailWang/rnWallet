/*
 screen：和导航的功能是一样的，对应界面名称，可以在其他页面通过这个screen传值和跳转。

    navigationOptions：配置TabNavigator的一些属性
         title：标题，会同时设置导航条和标签栏的title
         tabBarVisible：是否隐藏标签栏。默认不隐藏(true)
         tabBarIcon：设置标签栏的图标。需要给每个都设置
         tabBarLabel：设置标签栏的title。推荐

    tabBarPosition：设置tabbar的位置，iOS默认在底部，安卓默认在顶部。（属性值：'top'，'bottom'）
         swipeEnabled：是否允许在标签之间进行滑动
         animationEnabled：是否在更改标签时显示动画
         lazy：是否根据需要懒惰呈现标签，而不是提前，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐为true
         trueinitialRouteName： 设置默认的页面组件
         backBehavior：按 back 键是否跳转到第一个Tab(首页)， none 为不跳转

    tabBarOptions：配置标签栏的一些属性
         activeTintColor：label和icon的前景色 活跃状态下
         activeBackgroundColor：label和icon的背景色 活跃状态下
         inactiveTintColor：label和icon的前景色 不活跃状态下
         inactiveBackgroundColor：label和icon的背景色 不活跃状态下
         showLabel：是否显示label，默认开启 style：tabbar的样式
         labelStyle：label的样式安卓属性
         activeTintColor：label和icon的前景色 活跃状态下
         inactiveTintColor：label和icon的前景色 不活跃状态下
         showIcon：是否显示图标，默认关闭
         showLabel：是否显示label，默认开启 style：tabbar的样式
         labelStyle：label的样式 upperCaseLabel：是否使标签大写，默认为true
         pressColor：material涟漪效果的颜色（安卓版本需要大于5.0）
         pressOpacity：按压标签的透明度变化（安卓版本需要小于5.0）
         scrollEnabled：是否启用可滚动选项卡 tabStyle：tab的样式
         indicatorStyle：标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
         labelStyle：label的样式
         iconStyle：图标样式
*/

import React, { PureComponent } from 'react'
import {
    Image,
    StyleSheet, 
} from 'react-native'

import { TabNavigator } from 'react-navigation'

//获取component
import Home from '../../../../../Desktop/wallet/wallet/app/module/main/Wallet'
import Mine from '../../../../../Desktop/wallet/wallet/app/module/transfer/Transfer'

//获取tab图标
const MainTabSelectedIcon = require("sel_0.png");
const MainTabUnSelectedIcon = require("nor_0.png");
const MineTabSelectedIcon = require("sel_1.png");
const MineTabUnSelectedIcon = require("nor_1.png");


export default MainTab = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions:({navigation, screeProps}) => ({
            //这里设置StackNavigator属性和一般情况下Tabbar不同页面可能会不同的属性

            //设置StackNavigator属性
            header:null,
            headerTitle: '首页',
            headerStyle: styles.navigator,
            headerTitleStyle: styles.navigatorTitle,
            gesturesEnabled:true,

            //这里设置Tabbar不同页面可能会不同的属性
            tabBarVisible: true,
            tabBarLabel:'首页',
            tabBarIcon:(({tintColor,focused}) => {
                return(
                    <Image 
                        source={focused ? MainTabSelectedIcon : MainTabUnSelectedIcon}
                        style={styles.tabbarImage} 
                    />
                )
            }),
        })
    },
    Mine: {
        screen: Mine,
        navigationOptions:({navigation, screeProps}) => ({
            //这里设置StackNavigator属性和一般情况下Tabbar不同页面可能会不同的属性

            //设置StackNavigator属性
            header:null,
            headerTitle: '我的',
            headerStyle:styles.navigator,
            headerTitleStyle:styles.navigatorTitle,
            gesturesEnabled:true,

            //这里设置Tabbar不同页面可能会不同的属性
            tabBarVisible: true,
            tabBarLabel:'我的',
            tabBarIcon:(({tintColor,focused}) => {
                return(
                    <Image 
                        source={focused ? MineTabSelectedIcon : MineTabUnSelectedIcon}
                        style={styles.tabbarImage} 
                    />
                )
            }),
        })
    }
},{
    //这里设置的是一般情况下Tabbar共同的属性
    tabBarPosition:'bottom', // 设置tabbar的位置，iOS默认在底部，安卓默认在顶部。（属性值：'top'，'bottom')
    swipeEnabled:false, // 是否允许在标签之间进行滑动。
    animationEnabled: false, // 是否在更改标签时显示动画。
    lazy:true, // 是否根据需要懒惰呈现标签，而不是提前制作，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐改成true哦。
    initialRouteName:'', // 设置默认的页面组件
    backBehavior:'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions:{
          activeTintColor:'#d81e06', // label和icon的前景色 活跃状态下（选中）。
          inactiveTintColor:'#515151', // label和icon的前景色 不活跃状态下(未选中)。
          labelStyle:{
              fontSize: 12,
          }, //label的样式。
    }
})

const styles = StyleSheet.create({
    navigatorTitle:{
        fontSize:17,
        color:'white',
    },
    navigator:{
        backgroundColor:'#d81e06',
    },
    tabbarImage:{
        width:25,
        height:25,
        marginBottom:-3,
    },
});