import React, { PureComponent } from 'react';
import { View, StyleSheet, WebView} from 'react-native';
import { Colors } from '../../config/GlobalConfig';
import { WhiteBgHeader } from '../../components/NavigaionHeader';
import Layout from '../../config/LayoutConstants';
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
  }
});

class ActivityExplain extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render(){

    let { webType } = this.props.navigation.state.params;


    console.warn('选择的type是：'+webType)

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
                source={{uri:link}}
                style={{marginTop: 20}}
            />
          </View>
        </View>
      )
  }
}


export default ActivityExplain;
