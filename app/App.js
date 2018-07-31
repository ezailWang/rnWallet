// import React, { Component } from 'react';
// import { StatusBar } from 'react-native';
// import { Provider } from 'react-redux';
// import { store } from './config/store/ConfigureStore'
// import Navigators from './navigation/navigation';
//
//
// export default class App extends Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <Navigators />
//             </Provider>
//         );
//     }
// }

import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation'
import { store } from './config/store/ConfigureStore'

import RouteConfig from './navigation/RouteConfig'
import StackNavigatorConfig from './navigation/StackNavigatorConfig'

const Navigator = StackNavigator(RouteConfig, StackNavigatorConfig);

export default class App extends PureComponent {
    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>
        )
    }
}
