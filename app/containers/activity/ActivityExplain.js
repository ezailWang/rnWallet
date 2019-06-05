import React, { PureComponent } from 'react';
import { View, StyleSheet, WebView} from 'react-native';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import LayoutConstants from '../../config/LayoutConstants';
import BaseComponent from '../base/BaseComponent';

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

class ActivityExplain extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render(){

    let { webType } = this.props.navigation.state.params;


    // console.warn('选择的type是：'+webType)

    switch(Number(webType)){
        case 0:{
            var title = '投票说明'
            var link = 'https://wallet.iotchain.io/VotePolicy.html'
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
                source={{uri:'https://wallet.iotchain.io/VotePolicy.html'}}
                style={styles.webviewBox}
            />
          </View>
        </View>
      )
  }
}


export default ActivityExplain;
