import { StackNavigator } from 'react-navigation';
import FirstLaunchScreen from './FirstLaunchScreen';
import BackupMnemonicScreen from './BackupMnemonicScreen';
import BackupWalletScreen from './BackupWalletScreen';
import CreateWalletScreen from './CreateWalletScreen';
import ImportWalletScreen from './ImportWalletScreen';
import UserRegulationScreen from './UserRegulationScreen';
import VerifyMnemonicScreen from './VerifyMnemonicScreen';


export default FirstLaunchContainers = StackNavigator({
    FirstLaunch: { screen: FirstLaunchScreen },
    BackupMnemonic: { screen: BackupMnemonicScreen },
    BackupWallet: { screen: BackupWalletScreen },
    CreateWallet: { screen: CreateWalletScreen },
    BackupMnemonic: { screen: BackupMnemonicScreen },
    UserRegulation: { screen: UserRegulationScreen },
    VerifyMnemonic: { screen: VerifyMnemonicScreen },
},
    {
        navigationOptions: {
            headerTitleStyle: { fontSize: 18, color: 'skyblue' },
        },
        gesturesEnabled: true,
        initialRouteName: 'FirstLaunch',
        headerMode: 'none'
    }
);