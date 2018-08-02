/*
    --- 路由配置 ---
    initialRouteName：设置默认的页面组件，必须是上面已注册的页面组件
    initialRouteParams：初始路由参数

    navigationOptions：配置StackNavigator的一些属性。

        title：标题，如果设置了这个导航栏和标签栏的title就会变成一样的，不推荐使用
        header：可以设置一些导航的属性，如果隐藏顶部导航栏只要将这个属性设置为null
        headerTitle：设置导航栏标题，推荐
        headerBackTitle：设置跳转页面左侧返回箭头后面的文字，默认是上一个页面的标题。可以自定义，也可以设置为null
        headerTruncatedBackTitle：设置当上个页面标题不符合返回箭头后的文字时，默认改成"返回"
        headerRight：设置导航条右侧。可以是按钮或者其他视图控件
        headerLeft：设置导航条左侧。可以是按钮或者其他视图控件
        headerStyle：设置导航条的样式。背景色，宽高等
        headerTitleStyle：设置导航栏文字样式
        headerBackTitleStyle：设置导航栏‘返回’文字样式
        headerTintColor：设置导航栏颜色
        headerPressColorAndroid：安卓独有的设置颜色纹理，需要安卓版本大于5.0
        gesturesEnabled：是否支持滑动返回手势，iOS默认支持，安卓默认关闭
*/

const StackNavigationConfig = {
    initialRouteName: 'Set',
    //initialRouteName: 'Home',
    //initialRouteName: 'Wallet',
    //initialRouteName: 'FirstLaunch',
    headerMode: 'float',
    navigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: "white",
        },
        headerTitleStyle:{ 
            flex:1,
            alignSelf:'center',
            textAlign:'center',
            color:'rgb(57,57,57)',
            fontSize:16,
            
        },
        headerBackTitle:null
    })
};

export default StackNavigationConfig;
