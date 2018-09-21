
import {
    createStackNavigator,
    createSwitchNavigator,
    createDrawerNavigator
} from 'react-navigation'
import { Provider, connect } from 'react-redux';
import {
    FirstLaunchRouteConfig,
    HomeRouteConfig,
    Loading,
} from './RouteConfig'
import {
    HomeStackNavigationConfig,
    FirstLaunchStackNavigationConfig,
    HomeDrawerConfig
} from './NavigatorConfig'
import {
    BackHandler
} from 'react-native'
import { showToast } from '../utils/Toast';
let lastBackPressed = 0;
/**
 * 导航结构不同模块功能分开放入不同的导航栈内，全部放入一个导航栈，容易内存泄露
 */
//首次启动导航栈
const FirstLaunchNavigation = createStackNavigator(FirstLaunchRouteConfig, FirstLaunchStackNavigationConfig)

//主页导航栈
const HomeNavigation = createStackNavigator(HomeRouteConfig, HomeStackNavigationConfig)
/**const homeGetStateForAction = HomeNavigation.router.getStateForAction;
HomeNavigation.router.getStateForAction = (action,state)=>{
    console.log('L_index_state1',state)
    if(state && state.routes.length === 1 && action.type == 'Navigation/BACK'){
        //在首页按了物理键返回
        if((lastBackPressed + 2000)  >=  Date.now()){
            console.log('L_index1','退出')
            BackHandler.exitApp;
        }else{
            console.log('L_index1','再按一次')
            showToast('再按一次退出应用');
            lastBackPressed = Date.now();
            //return {...state};
            const routes = [...state.routes];
            return{
                ...state,
                ...state.routes,
                index:routes.length -1,
            }
        }
    }
    return homeGetStateForAction(action,state);
}**/

//隐藏二级页面的侧滑菜单
HomeNavigation.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
      drawerLockMode = 'locked-closed';
    }
    return {
      drawerLockMode,
    };
  };

//首页侧滑导航
const HomeDrawer = createDrawerNavigator({
    HomeNav: {
        screen: HomeNavigation
    }
}, HomeDrawerConfig)

//导航栈选择
const SwicthNavigation = createSwitchNavigator({
    Apploading: Loading,
    Home: HomeDrawer,
    FirstLaunch: FirstLaunchNavigation,
}, {
        initialRouteName: 'Apploading',
        backBehavior: 'none',
    })


export default SwicthNavigation