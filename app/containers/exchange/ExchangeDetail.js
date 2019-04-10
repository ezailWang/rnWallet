import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, ScrollView } from 'react-native';
import { TransparentBgHeader } from '../../components/NavigaionHeader';
import { Colors } from '../../config/GlobalConfig';

import BaseComponent from '../base/BaseComponent';
import LayoutConstants from '../../config/LayoutConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
    width: LayoutConstants.WINDOW_WIDTH,
  },
  content: {
    width: LayoutConstants.WINDOW_WIDTH * 0.9,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  statusIcon: {
    width: 70,
    height: 70,
    marginTop: 40,
    alignSelf: 'center',
  },
  cellView: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    height: 40,
    alignItems: 'center',
  },
  leftText: {
    marginLeft: 20,
    color: Colors.blackOpacityColor,
  },
  rightText: {
    width: LayoutConstants.WINDOW_WIDTH - 200,
    marginLeft: 20,
  },
  lineView: {
    width: LayoutConstants.WINDOW_WIDTH - 60,
    height: 0.3,
    opacity: 0.5,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: 'gray',
  },
});

export default class ExChangeDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._setStatusBarStyleLight();
  }

  renderComponent = () => {
    const statusIcon = require('../../assets/transfer/trans_ok.png');

    return (
      <ImageBackground
        style={styles.container}
        source={require('../../assets/launch/splash_bg.png')}
      >
        <TransparentBgHeader navigation={this.props.navigation} text="详情" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Image style={styles.statusIcon} source={statusIcon} resizeMode="contain" />
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>交易成功</Text>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>支付金额</Text>
              <Text style={[styles.rightText, { fontSize: 25, fontWeight: 'bold' }]}>0.78ETH</Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>换取金额</Text>
              <Text style={[styles.rightText, { fontSize: 25, fontWeight: 'bold' }]}>0.78ETH</Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>付款地址</Text>
              <Text style={styles.rightText}>
                13311111111111111111111111111111111111111111111111
              </Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>收款地址</Text>
              <Text style={styles.rightText}>444444444444444444499999999999</Text>
            </View>
            <View style={styles.lineView} />
            <View style={styles.cellView}>
              <Text style={styles.leftText}>支付金额</Text>
              <Text style={styles.rightText}>0.78ETH</Text>
            </View>
            <View style={styles.cellView}>
              <Text style={styles.leftText}>交易号</Text>
              <Text style={styles.rightText}>0.78ETH</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };
}
