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
    switch(parseInt(webType)){
        case 0:{
            var title = I18n.t('activity.web.explain_0')
            var link = 'https://wallet.iotchain.io/VotePolicy.html'
            break
        }
        case 1:{
            var title = I18n.t('activity.web.explain_1')
            var link = 'https://wallet.iotchain.io/InviteRank.html'
            break
        }
        case 2:{
          var title = I18n.t('activity.web.explain_2')
          var link = 'https://wallet.iotchain.io/InviteRank.html'
          break
        }
        case 3:{
          var title = I18n.t('activity.web.explain_3')
          var link = 'https://wallet.iotchain.io/SuperNodePolicy.html'
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
            />
          </View>
        </View>
      )
  }
}


export default WebViewScreen;
