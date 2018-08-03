import { AppRegistry, YellowBox } from 'react-native';
import React, { Component } from 'react';
import './shim';
import App from './app/App';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Module RNRandomBytes']);

AppRegistry.registerComponent('rnWallet', () => App);