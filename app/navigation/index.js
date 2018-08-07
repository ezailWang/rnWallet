<<<<<<< HEAD
import {
    StackNavigator,
    SwitchNavigator
} from 'react-navigation'
import {
    FirstLaunchRouteConfig,
    HomeRouteConfig,
    Loading,
    RouteConfig,
    TestRouteConfig
} from './RouteConfig'
import {
    HomeStackNavigationConfig,
    FirstLaunchStackNavigationConfig,
    StackNavigationConfig,
    TestStackNavigationConfig
} from './NavigatorConfig'
=======
import { StackNavigator, SwitchNavigator } from 'react-navigation'
import { FirstLaunchRouteConfig, HomeRouteConfig, Loading, RouteConfig } from './RouteConfig'
import { HomeStackNavigationConfig, FirstLaunchStackNavigationConfig } from './NavigatorConfig'
>>>>>>> c82aeba2588a9c06229652440b5fdf419c89fe33


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
<<<<<<< HEAD
const SwicthNavigation = SwitchNavigator({
    Apploading: Loading,
    FirstLaunch: FirstLaunchNavigation,
    Home: HomeNavigation,
    Stack: OldStackNavigator,
    Test:TestNavigation,
}, {
    initialRouteName: 'FirstLaunch'
}, )
=======
const SwicthNavigation = SwitchNavigator(
    {
        Apploading: Loading,
        FirstLaunch: FirstLaunchNavigation,
        Home: HomeNavigation,
    },
    {
        initialRouteName: 'Apploading'
    },
)
>>>>>>> c82aeba2588a9c06229652440b5fdf419c89fe33

export default SwicthNavigation