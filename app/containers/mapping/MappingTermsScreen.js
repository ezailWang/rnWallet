import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Text,
  Image,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Actions from '../../config/action/Actions';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgNoBackHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
import { I18n } from '../../config/language/i18n';
import BaseComponent from '../base/BaseComponent';
import { BlueButtonBig } from '../../components/Button';
import { showToast } from '../../utils/Toast';
import StatusBarComponent from '../../components/StatusBarComponent';

const rightViewHeight = Layout.WINDOW_HEIGHT - 100 - 48 - (Layout.DEVICE_IS_IPHONE_X() ? 118 : 64);
const stepItemWidth = Layout.WINDOW_WIDTH - 50 - 20;
const stepItemHeight = rightViewHeight / 3;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentBox: {
    flex: 1,
    marginTop: 20,
  },
  contentView: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
  },
  contentLeft: {
    width: 50,
    marginTop: 6,
    //  backgroundColor: 'yellow'
  },
  contentRight: {
    flex: 1,
    marginRight: 20,
  },
  bottomBox: {
    width: Layout.WINDOW_WIDTH,
    alignItems: 'center',
    // backgroundColor: 'white',
    // todo height: 120,
    height: 100,
    margin: 0,
    padding: 0,
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Layout.WINDOW_WIDTH * 0.9 - 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  checkImage: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 8,
  },
  checkText: {
    width: Layout.WINDOW_WIDTH * 0.9 - 20 - 26,
    color: Colors.fontBlueColor,
    fontSize: 14,
  },
  button: {
    // width:Layout.WINDOW_WIDTH*0.8,
    marginTop: 10,
    padding: 0,
    alignSelf: 'center',
  },

  stepItemBox: {
    width: stepItemWidth,
    height: stepItemHeight,
    marginRight: 20,
    alignItems: 'center',
  },
  stepItemTitleBox: {
    width: stepItemWidth,
    height: 32,
    flexDirection: 'row',
  },
  stepItemBgArrow: {
    width: 15,
    height: 24,
    alignSelf: 'center',
  },
  stepItemTitleBg: {
    width: stepItemWidth - 10,
    height: 32,
    borderRadius: 5,
    marginLeft: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItemTitle: {
    width: stepItemWidth - 50,
    lineHeight: 32,
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    paddingLeft: 15,
    paddingRight: 20,
  },
  stepItemBgDesc: {
    color: Colors.fontBlackColor_43,
    fontSize: 14,
    width: stepItemWidth - 50,
    marginTop: 10,
  },
  stepItemImg: {
    marginTop: 10,
    width: stepItemWidth - 100,
    height: ((stepItemWidth - 100) / 212) * 54,
  },

  liItemBox: {
    width: 60,
    height: stepItemHeight,
    alignItems: 'center',
  },
  liItemNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3fc1ff',
  },
  liItemNumText: {
    fontSize: 14,
    color: 'white',
  },
  liItemLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#D7F0FF',
  },
});

export default class MappingTermsScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAgree: false,
    };
    this._setStatusBarStyleDark();
  }

  _initData() {}

  isAgreePress = () => {
    this.setState({ isAgree: !this.state.isAgree });
  };

  startBtn() {
    this.props.navigation.navigate('BindWalletAddress');
  }

  renderComponent() {
    const checkIcon = this.state.isAgree
      ? require('../../assets/launch/check_on.png')
      : require('../../assets/launch/check_off.png');
    return (
      <View style={styles.container}>
        <StatusBarComponent barStyle="light-content" />

        <WhiteBgNoBackHeader text={I18n.t('mapping.itc_mapping_service')} />
        <View style={styles.contentBox}>
          <View style={styles.contentView}>
            <View style={styles.contentLeft}>
              <LiItem num="1" />
              <LiItem num="2" />
              <LiItem num="3" isShowLine={false} />
            </View>
            <View style={styles.contentRight}>
              <StepItem
                title={`STEP 1: ${I18n.t('mapping.bind_map_address')}`}
                desc={I18n.t('mapping.bind_map_address_des')}
                image={require('../../assets/mapping/mappingStepOne.png')}
              />
              <StepItem
                title={`STEP 2: ${I18n.t('mapping.application_mapping')}`}
                desc={I18n.t('mapping.application_mapping_des')}
                image={require('../../assets/mapping/mappingStepTwo.png')}
              />
              <StepItem
                title={`STEP 3: ${I18n.t('mapping.native_issuance')}`}
                desc={I18n.t('mapping.native_issuance_des')}
                image={require('../../assets/mapping/mappingStepThree.png')}
              />
            </View>
          </View>
          <View style={styles.bottomBox}>
            {/* <TouchableOpacity style={styles.checkBox} activeOpacity={0.6} onPress={this.isAgreePress}>
                            <Image style={styles.checkImage} source={checkIcon} resizeMode={'center'} ></Image>
                            <Text style={styles.checkText}>{I18n.t('mapping.read_and_agreed')}</Text>
        </TouchableOpacity> */}
            <BlueButtonBig
              buttonStyle={styles.button}
              isDisabled={!this.state.isAgree}
              onPress={() => this.startBtn()}
              text={I18n.t('mapping.upcoming_start')}
            />
          </View>
        </View>
      </View>
    );
  }
}

class LiItem extends PureComponent {
  static defaultProps = {
    isShowLine: true,
  };

  render() {
    return (
      <View style={styles.liItemBox}>
        <View style={styles.liItemNum}>
          <Text style={styles.liItemNumText}>{this.props.num}</Text>
        </View>
        {this.props.isShowLine ? <View style={styles.liItemLine} /> : null}
      </View>
    );
  }
}

class StepItem extends PureComponent {
  render() {
    const image = this.props.image;
    return (
      <View style={styles.stepItemBox}>
        <View style={styles.stepItemTitleBox}>
          <Image
            style={styles.stepItemBgArrow}
            source={require('../../assets/mapping/leftTriangle.png')}
            resizeMode="center"
          />
          <LinearGradient
            colors={['#3fc1ff', '#66ceff']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={styles.stepItemTitleBg}
          >
            <Text style={styles.stepItemTitle}>{this.props.title}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.stepItemBgDesc}>{this.props.desc}</Text>
        <Image style={styles.stepItemImg} source={image} resizeMode="contain" />
      </View>
    );
  }
}
