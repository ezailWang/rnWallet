import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom, SwitchNavigator } from 'react-navigation';
import {
    walletTest,
    rpcTest,
    keystoreTest,
    networkTest,
    FirstLaunchContainers,
    mainContainers,
} from '../containers';

const TestNavigator = StackNavigator(
    {
        WalletTest: { screen: walletTest },
        RpcTest: { screen: rpcTest },
        KeystoreTest: { screen: keystoreTest },
        NetworkTest: { screen: networkTest }
    },
    {
        initialRouteName: 'KeystoreTest',
        headerMode: 'none',
    }
);

export default SwitchNavigator(
    {
        FirstLaunch: FirstLaunchContainers,
        Test: TestNavigator,
        main: mainContainers
    },
    {
        initialRouteName: 'main',
    }
);