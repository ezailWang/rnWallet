import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './config/store/ConfigureStore';
import Navigator from './navigation';
import Analytics from './utils/Analytics';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getCurrentRouteName(currentState);
            const prevScreen = getCurrentRouteName(prevState);
            if (prevScreen !== currentScreen) {
              Analytics.setCurrentScreen(currentScreen);
            }
          }}
        />
      </Provider>
    );
  }
}
