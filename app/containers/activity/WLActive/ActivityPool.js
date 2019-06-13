import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  WebView
} from 'react-native';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import { Colors, FontSize } from '../../../config/GlobalConfig';
import { I18n } from '../../../config/language/i18n';
import Layout from '../../../config/LayoutConstants';
import BaseComponent from '../../base/BaseComponent';
import NetworkManager from '../../../utils/NetworkManager';

const contentWidth = Layout.WINDOW_WIDTH * 0.9;
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
    height: 180,
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  amountTxt: {
    fontSize: 30,
    width:Layout.WINDOW_WIDTH,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginTop:20,
    height:40,
  },
  unitTxt: {
    fontSize: 14,
    width:Layout.WINDOW_WIDTH,
    // fontWeight: '700',
    color: 'white',
    // marginLeft: 5,
    marginBottom: 2,
    textAlign: 'center',
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
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    fontSize: 11,
  },
  lineView: {
    width: Layout.WINDOW_WIDTH - 40,
    // borderBottomWidth:1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 5,
  },
});

const BaseScript =`
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 300);
    } ())
`

class MappingRecordDetailScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
        address:'0x',
        benefitTime:'0',
        estimateReward:0,
        poolReward:0,
        height:601
    };
    this._setStatusBarStyleLight();
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  goBackBtn = () => {
    this.props.navigation.goBack();
  };

  /**
   * web端发送过来的交互消息
   */
  onMessage (event) {
    try {
    
      console.log(event.nativeEvent.data)

      const action = JSON.parse(event.nativeEvent.data)
      if (action.type === 'setHeight' && action.height > 0) {

        console.log('网页的高度'+action.height )

        if(this.state.height != 601){
            this.props.navigation.navigate('WebViewScreen',{
                webType:1
            })
        }

        this.setState({ height: action.height })
      }

    } catch (error) {
      // pass
    }
  }


  _initData = async ()=>{

    this._showLoading()

    try{
        let res = await NetworkManager.querylastWinner()
        
        if(res.code == 200 && res.data.address){

            let {address, benefitTime, estimateReward, poolReward} = res.data
            
            this.setState({
                address,
                benefitTime,
                estimateReward,
                poolReward
            },()=>{
                this._hideLoading()
            })
        }
    }
    catch(err){
        console.log(err)
        this._hideLoading()
    }
    
  }

  componentWillMount() {
    super.componentWillMount()
    this._isMounted=true
  }

  componentWillUnmount(){
    super.componentWillUnmount()
  }


  renderComponent = () => {
    let headerMarginTop = { marginTop: 24 };
    if (Layout.DEVICE_IS_IPHONE_X()) {
      headerMarginTop = { marginTop: 48 };
    }
    const headerBg = require('../../../assets/home/top_bg.png');

    let {address,benefitTime,estimateReward,poolReward} = this.state

    let desUrl = I18n.locale == 'zh' ? "https://wallet.iotchain.io/PlanPoolDetail.html" : "https://wallet.iotchain.io/PlanPoolDetail_en.html"

    return (
      <View style={styles.container}>
          <ImageBackground style={styles.headerBox} source={headerBg}>
            <View style={styles.headerTitleBox}>
              <TouchableOpacity
                style={[styles.headerTitleTouch, headerMarginTop]}
                onPress={this.goBackBtn}
              >
                <Image
                  style={styles.backIcon}
                  resizeMode="center"
                  source={require('../../../assets/common/common_back_white.png')}
                />
              </TouchableOpacity>
              <View style={[styles.headerTitleView, headerMarginTop]}>
                <Text style={styles.headerTitle}>{I18n.t('activity.power.title')}</Text>
              </View>
            </View>
            <View style={styles.amountView}>
              <Text style={styles.amountTxt}>{Number(poolReward) }</Text>
              <Text style={styles.unitTxt}>{I18n.t('activity.power.unit')}</Text>
            </View>
            <View style={styles.whiteBox}>
              <View style={styles.whiteView} />
            </View>
          </ImageBackground>
          <ScrollView
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            // bounces={false}  
          >
          <View style={[styles.contentBox]}>
            <View style={[styles.infoView]}>
              <View style={[styles.infoContent]}>
                <TitleView isCompleted={true} content={I18n.t('activity.power.node')} />
                <View style={styles.vLine} />
                <ItemView title={I18n.t('activity.power.address')} content={address} />
                <ItemView title={I18n.t('activity.power.time')} content={benefitTime} />
                <ItemView title={I18n.t('activity.power.benfit')} fontStyle={{color:Colors.fontBlueColor,fontSize:18,fontWeight:'bold'}} content={Number(estimateReward) + ' ITC'} />
              </View>
              {/* <Line type={3} /> */}
            </View>
          </View>
          <WebView
            injectedJavaScript={BaseScript}
            source={{uri:desUrl}}
            style={{width:Layout.WINDOW_WIDTH,height: this.state.height}}
            bounces={false}
            scrollEnabled={false}
            automaticallyAdjustContentInsets
            decelerationRate='normal'
            scalesPageToFit
            javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
            domStorageEnabled // 适用于安卓
            scrollEnabled={false}
            onMessage={this.onMessage.bind(this)}
            onNavigationStateChange={(state)=>{
                console.log('stateChanged'+JSON.stringify(state,null,2))
            }}
            />
            </ScrollView>
      </View>
    );
  };
}

class ItemView extends PureComponent {
  render() {
    const { title, content ,fontStyle} = this.props;
    return (
      <View style={styles.itemView}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={[styles.itemContent,fontStyle]}>{content}</Text>
      </View>
    );
  }
}

class TitleView extends PureComponent {
  render() {
    const { isCompleted, content } = this.props;
    return (
      <View style={styles.titleView}>
        <Text style={styles.titleTxt}>{content}</Text>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  contactList: state.Core.contactList,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MappingRecordDetailScreen);
