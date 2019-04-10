import React, { Component } from 'react';
import { Modal, FlatList, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import LayoutConstants from '../../../config/LayoutConstants';
import { Colors } from '../../../config/GlobalConfig';
import { ItemDivideComponent } from '../../home/component/HomeCell';
import { ExchangeModalCoinSelectCell, ExchangeModalWalletSelectCell } from './ExchangeCell';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackOpacityColor,
    justifyContent: 'flex-end',
    // flexDirection: 'column-reverse',
  },
});
export default class ExchangeFlatListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      dataTest: [
        { name: 'itc0', address: '1123131...123123', select: false, symbol: 'ETH', iconLarge: '' },
        { name: 'itc0', address: '1123131...123123', select: false, symbol: 'ETH', iconLarge: '' },
        { name: 'itc0', address: '1123131...123123', select: false, symbol: 'ETH', iconLarge: '' },
        { name: 'itc0', address: '1123131...123123', select: false, symbol: 'ETH', iconLarge: '' },
        { name: 'itc0', address: '1123131...123123', select: true, symbol: 'ETH', iconLarge: '' },
        { name: 'itc0', address: '1123131...123123', select: false, symbol: 'ETH', iconLarge: '' },
        { name: 'itc0', address: '1123131...123123', select: false, symbol: 'ETH', iconLarge: '' },
      ],
    };
  }

  static propsType = {
    selectCategory: PropTypes.string.isRequired,
  };

  renderItem = item => {
    const { selectCategory, onSelect } = this.props;
    if (selectCategory === 'coinSelect') {
      return (
        <ExchangeModalCoinSelectCell
          item={item}
          onClick={() => {
            onSelect(item);
          }}
        />
      );
    }
    if (selectCategory === 'walletSelect') {
      return (
        <ExchangeModalWalletSelectCell
          item={item}
          onClick={() => {
            onSelect(item);
          }}
        />
      );
    }
    return null;
  };

  showFlatModal() {
    this.setState({
      show: true,
    });
  }

  closeFlatModal() {
    this.setState({
      show: false,
    });
  }

  render() {
    const { show, dataTest } = this.state;
    const { selectCategory } = this.props;
    return (
      <Modal animationType="fade" visible={show} transparent>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.closeFlatModal();
            }}
          >
            <View
              style={{
                backgroundColor: 'transparent',
                width: LayoutConstants.WINDOW_WIDTH,
                height: LayoutConstants.WINDOW_HEIGHT - 300,
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{ backgroundColor: 'white', width: LayoutConstants.WINDOW_WIDTH, height: 300 }}
          >
            <FlatList
              data={dataTest}
              renderItem={this.renderItem}
              ItemSeparatorComponent={ItemDivideComponent}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(data, index) => ({ length: 50, offset: 60 * index, index })}
              ListHeaderComponent={
                <Text
                  style={{
                    width: LayoutConstants.WINDOW_WIDTH,
                    height: 40,
                    marginTop: 20,
                    marginLeft: 20,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  {selectCategory === 'coinSelect' ? '币种选择' : '钱包选择'}
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  }
}
