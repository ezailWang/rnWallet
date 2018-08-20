
import {
    StackNavigator,
    SwitchNavigator
} from 'react-navigation'
import {
    FirstLaunchRouteConfig,
    HomeRouteConfig,
    Loading,
    TestRouteConfig
} from './RouteConfig'
import {
    HomeStackNavigationConfig,
    FirstLaunchStackNavigationConfig,
    TestStackNavigationConfig
} from './NavigatorConfig'



/**
 * 导航结构不同模块功能分开放入不同的导航栈内，全部放入一个导航栈，容易内存泄露
 */
//首次启动导航栈
const FirstLaunchNavigation = StackNavigator(FirstLaunchRouteConfig, FirstLaunchStackNavigationConfig)

//主页导航栈
const HomeNavigation = StackNavigator(HomeRouteConfig, HomeStackNavigationConfig)

//测试导航栈
const TestNavigation = StackNavigator(TestRouteConfig,TestStackNavigationConfig)

//导航栈选择

const SwicthNavigation = SwitchNavigator({
    Apploading: Loading,
    FirstLaunch: FirstLaunchNavigation,
    Home: HomeNavigation,
    Test:TestNavigation,
}, {
    initialRouteName: 'Home',
}, )


export default SwicthNavigation