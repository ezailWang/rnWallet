import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation'
import { store } from './config/store/ConfigureStore'
import Navigator from './navigation'


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>

        )
    }
}
