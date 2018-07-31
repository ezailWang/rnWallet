/*
    --- 路由配置 ---

   * 所有组件都必须在这里注册
   * 在这里设置的navigationOptions的权限 > 对应页面里面的 static navigationOptions的设置 > StackNavigator()第二个参数里navigationOptions的设置
   * 该配置文件会在App.js里的StackNavigator(导航组件)里使用。

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

    screen：对应界面名称，需要填入import之后的页面

    mode：定义跳转风格
        card：使用iOS和安卓默认的风格
        modal：iOS独有的使屏幕从底部画出。类似iOS的present效果

    headerMode：返回上级页面时动画效果
        float：iOS默认的效果
        screen：滑动过程中，整个页面都会返回
        none：无动画

    cardStyle：自定义设置跳转效果
        transitionConfig： 自定义设置滑动返回的配置
        onTransitionStart：当转换动画即将开始时被调用的功能
        onTransitionEnd：当转换动画完成，将被调用的功能

    path：路由中设置的路径的覆盖映射配置
*/

import {
    walletTest,
    rpcTest,
    keystoreTest,
    networkTest,
    FirstLaunchContainers,
    mainContainers,
    Wallet,
    Transfer,
    FirstLaunchScreen,
    BackupMnemonicScreen,
    BackupWalletScreen,
    CreateWalletScreen,
    ImportWalletScreen,
    UserRegulationScreen,
    VerifyMnemonicScreen,
    HomeScreen,
    SetContainers,
    SetScreen,
    ModifyPasswordScreen,
    PasswordPrompInfoScreen
} from '../containers/containers';

const RouteConfig = {
    FirstLaunch: {
        screen:FirstLaunchScreen,
        navigationOptions: ({navigation}) => ({
            header:null
        })
    },
    BackupMnemonic: {
        screen: BackupMnemonicScreen
    },
    BackupWallet: {
        screen: BackupWalletScreen
    },
    CreateWallet: {
        screen: CreateWalletScreen
    },
    BackupMnemonic: {
        screen: BackupMnemonicScreen
    },
    UserRegulation: {
        screen: UserRegulationScreen
    },
    VerifyMnemonic: {
        screen: VerifyMnemonicScreen
    },
    ImportWallet: {
        screen: ImportWalletScreen
    },
    HomeScreen:{
        screen: HomeScreen
    },
    Wallet: {
        screen:Wallet,
        navigationOptions: ({navigation}) => ({
            title: '主页信息',
        })
    },
    Transfer: {
        screen: Transfer,
        navigationOptions: ({navigation}) => ({
            headerTitle: `${this.props.transferType}转账`,
            gesturesEnable: false
        })
    },
    WalletTest: {
        screen:walletTest
    },
    RpcTest: {
        screen:rpcTest
    },
    KeystoreTest: {
        screen:keystoreTest
    },
    NetworkTest: {
        screen:networkTest
    },
    Set:{
        screen: SetScreen
    },
    ModifyPassword:{
        screen:ModifyPasswordScreen
    },
    PasswordPrompInfo:{
        screen:PasswordPrompInfoScreen
    },
};

export default RouteConfig;