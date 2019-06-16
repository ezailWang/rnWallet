import React, { PureComponent } from 'react';
import { View, StyleSheet, WebView} from 'react-native';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import LayoutConstants from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';
import { I18n } from '../../config/language/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  webviewBox: {
    flex: 1,
    width:LayoutConstants.WINDOW_WIDTH ,
    backgroundColor: Colors.backgroundColor,
  },
});

class WebViewScreen extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render(){

    let { webType } = this.props.navigation.state.params;
    switch(webType){
        case 0:{
            var title = I18n.t('activity.web.explain_0')
            var link = I18n.locale === 'zh' ? 'https://wallet.iotchain.io/VotePolicy.html' : 'https://wallet.iotchain.io/VotePolicy_en.html'
            break
        }
        case 1:{
            var title = I18n.t('activity.web.explain_1')
            var link = I18n.locale === 'zh' ?'https://wallet.iotchain.io/InviteRank.html' :'https://wallet.iotchain.io/InviteRank_en.html'  
            break
        }
        case 2:{
          var title = I18n.t('activity.web.explain_2')
          var link = I18n.locale === 'zh' ? 'https://wallet.iotchain.io/InviteRank.html':'https://wallet.iotchain.io/InviteRank_en.html'
          break
        }
        case 3:{
          var title = I18n.t('activity.web.explain_3')
          var link = I18n.locale === 'zh' ? 'https://wallet.iotchain.io/SuperNodePolicy.html':'https://wallet.iotchain.io/SuperNodePolicy_en.html'
          break
        }
        case 4:{
          var title = I18n.t('activity.web.explain_4')
          var link = I18n.locale === 'zh' ? 'https://wallet.iotchain.io/ActivityTotalRule.html':'https://wallet.iotchain.io/ActivityTotalRule_en.html'
          break
        }
        default:
            break
    }

    return (
        <View style={styles.container}>
          <WhiteBgHeader
            navigation={this.props.navigation}
            text={title}
          />
          <View style={styles.contentBox}>
            <WebView
                source={{uri:link}}
                style={styles.webviewBox}
                startInLoadingState
                bounces={false}
                scrollEnabled
                automaticallyAdjustContentInsets
                domStorageEnabled
            />
          </View>
        </View>
      )
  }
}


export default WebViewScreen;
