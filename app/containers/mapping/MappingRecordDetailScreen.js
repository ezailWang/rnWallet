import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../../config/action/Actions';
import { Colors, FontSize } from '../../config/GlobalConfig';
import { I18n } from '../../config/language/i18n';
import Layout from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(248,248,248,0.8)',
  },
  scrollView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  boxView: {
    flex: 1,
    width: Layout.WINDOW_WIDTH,
  },
  headerBox: {
    width: Layout.WINDOW_WIDTH,
    height: 160,
  },
  headerTitleBox: {
    flexDirection: 'row',
    width: Layout.WINDOW_WIDTH,
  },
  headerTitleTouch: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  headerTitleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: FontSize.HeaderSize,
    color: 'white',
    marginLeft: -40,
  },
  amountView: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  amountTxt: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },
  unitTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 5,
    marginBottom: 2,
  },
  whiteBox: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  whiteView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH - 40,
    height: 15,
  },

  contentBox: {
    width: Layout.WINDOW_WIDTH,
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    marginBottom: 20,
  },

  infoView: {
    alignSelf: 'center',
    width: Layout.WINDOW_WIDTH - 40,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  infoContent: {
    width: Layout.WINDOW_WIDTH - 70,
    paddingBottom: 15,
    // height:100,
  },
  vLine: {
    height: 1,
    width: Layout.WINDOW_WIDTH - 70,
    backgroundColor: Colors.bgGrayColor_e5,
  },
  titleView: {
    width: Layout.WINDOW_WIDTH - 70,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  titleTxt: {
    fontSize: 15,
    color: Colors.fontBlackColor_43,
  },
  itemView: {
    width: Layout.WINDOW_WIDTH - 70,
    marginTop: 10,
    alignItems: 'center',
    // height:50,
  },
  itemTitle: {
    fontSize: 15,
    width: Layout.WINDOW_WIDTH - 70,
    color: Colors.fontBlackColor_43,
  },
  itemContent: {
    marginTop: 2,
    color: Colors.fontGrayColor_a,
    width: Layout.WINDOW_WIDTH - 70,
    fontSize: 13,
  },
  lineView: {
    width: Layout.WINDOW_WIDTH - 40,
    // borderBottomWidth:1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 5,
  },
});

class MappingRecordDetailScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      status: -1,
      time: '',
    };
    this.mappingDetail = null; // status 0 已申请 1 申请中  2 已完成
    this._setStatusBarStyleLight();
  }

  _initData = () => {
    this.mappingDetail = this.props.navigation.state.params.mappingDetail;
    this.setState({
      amount: this.mappingDetail.amount,
      status: this.mappingDetail.status,
      time: this.mappingDetail.time,
    });
  };

  goBackBtn = () => {
    this.props.navigation.goBack();
  };

  renderComponent = () => {
    let headerMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      headerMarginTop = { marginTop: 48 };
    }
    const headerBg = require('../../assets/home/top_bg.png');

    const info1IsDone = this.state.status !== 0;
    const info2IsDone = this.state.status === 2;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ImageBackground style={styles.headerBox} source={headerBg}>
            <View style={styles.headerTitleBox}>
              <TouchableOpacity
                style={[styles.headerTitleTouch, headerMarginTop]}
                onPress={this.goBackBtn}
              >
                <Image
                  style={styles.backIcon}
                  resizeMode="center"
                  source={require('../../assets/common/common_back_white.png')}
                />
              </TouchableOpacity>
              <View style={[styles.headerTitleView, headerMarginTop]}>
                <Text style={styles.headerTitle}>{I18n.t('mapping.mapping_record')}</Text>
              </View>
            </View>
            <View style={styles.amountView}>
              <Text style={styles.amountTxt}>{this.state.amount}</Text>
              <Text style={styles.unitTxt}>ITC</Text>
            </View>
            <View style={styles.whiteBox}>
              <View style={styles.whiteView} />
            </View>
          </ImageBackground>
          <View style={[styles.contentBox]}>
            <View style={[styles.infoView]}>
              <View style={[styles.infoContent]}>
                <TitleView isCompleted={info1IsDone} content={I18n.t('mapping.destroy_itc')} />
                <View style={styles.vLine} />
                <ItemView
                  title={`${I18n.t('mapping.send_address')}(Erc20)`}
                  content="0xf6C9e322b688A434833dE530E4c23CFA4e579a78"
                />
                <ItemView
                  title={I18n.t('mapping.destroy_address')}
                  content="0xf6C9e322b688A434833dE530E4c23CFA4e579a78"
                />
                <ItemView title="TxHash" content="0xf6C9e322b688A434833dE530E4c23CFA4e579a78" />
                <ItemView
                  title={I18n.t('mapping.transaction_hour')}
                  content="2018-11-06 18:18:06 +0800"
                />
              </View>
              <Line type={this.state.status === 0 ? 1 : 2} />
            </View>
            <View
              style={[
                styles.infoView,
                { marginTop: 15, paddingTop: 15, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
              ]}
            >
              <View style={[styles.infoContent]}>
                <TitleView
                  isCompleted={info2IsDone}
                  content={I18n.t('mapping.native_itc_issuance')}
                />
                <View style={styles.vLine} />
                {this.state.status === 0 ? (
                  <ItemView
                    title={I18n.t('mapping.transfer_unsuccess_title')}
                    content={I18n.t('mapping.transfer_unsuccess_desc')}
                  />
                ) : (
                  <View>
                    <ItemView
                      title={I18n.t('mapping.collection_address')}
                      content="0xf6C9e322b688A434833dE530E4c23CFA4e579a78"
                    />
                    <ItemView title="TxHash" content="0xf6C9e322b688A434833dE530E4c23CFA4e579a78" />
                    <ItemView
                      title={I18n.t('mapping.transaction_hour')}
                      content="2018-11-06 18:18:06 +0800"
                    />
                  </View>
                )}
              </View>
              <Line type={this.state.status} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
}

class ItemView extends PureComponent {
  render() {
    const { title, content } = this.props;
    return (
      <View style={styles.itemView}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemContent}>{content}</Text>
      </View>
    );
  }
}

class TitleView extends PureComponent {
  render() {
    const { isCompleted, content } = this.props;
    const titleIcon = isCompleted
      ? require('../../assets/mapping/doneIcon.png')
      : require('../../assets/mapping/ingIcon.png');
    return (
      <View style={styles.titleView}>
        <Image style={styles.titleIcon} resizeMode="center" source={titleIcon} />
        <Text style={styles.titleTxt}>{content}</Text>
      </View>
    );
  }
}

class Line extends PureComponent {
  render() {
    const { type } = this.props;
    const bgColor = type === 1 ? '#0094ff' : '#fff';
    return (
      /* <LinearGradient
                style={[styles.lineView,{borderColor:type == 2 ? '#95C06D' : type == 1 ? '#0094ff' : '#fff'}]}
                colors={type == 2 ? ['#95C06D', '#6F9D44'] : type == 1 ? ['#0094ff', '#66ceff'] : ['#000', '#fff']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}>
            </LinearGradient> */
      <View
        style={[
          styles.lineView,
          {
            borderColor: type === 2 ? '#95C06D' : bgColor,
            backgroundColor: type === 2 ? '#95C06D' : bgColor,
          },
        ]}
      />
    );
  }
}

const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({
  setContactList: contacts => dispatch(Actions.setContactList(contacts)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MappingRecordDetailScreen);
