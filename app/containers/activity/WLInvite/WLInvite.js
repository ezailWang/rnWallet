/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar,Clipboard,ScrollView } from 'react-native';
import DescView from '../../../components/DescView';
import TextLink from '../../../components/TextLink';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import { I18n } from '../../../config/language/i18n';
import { showToast } from '../../../utils/Toast';
import { connect } from 'react-redux';
import LayoutConstants from '../../../config/LayoutConstants';

class WLInvite extends BaseComponent {

  componentWillMount() {
    super.componentWillMount()
    this._isMounted=true
  }
  componentWillUnmount(){
    super.componentWillUnmount()

    this.setState({
      finish:true
    })
  }
  render() {
    const { navigation } = this.props;
    const descArr = [
      I18n.t('activity.invite.desc1'),
      I18n.t('activity.invite.desc2'),
      I18n.t('activity.invite.desc3'),
    ];
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavHeader navigation={navigation} color="white" text="邀请好友" />
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.imgContainer}>
          <Image source={require('./images/img.png')} style={styles.banner} resizeMode='contain'/>
        </View>
        <Text style={styles.title}>{I18n.t('activity.invite.rewardMore')}</Text>
        <DescView descArr={descArr} />
        <TouchableOpacity style={styles.button} onPress={() => {
          let copyContent = I18n.t('activity.invite.inviteCode').replace("%s",this.props.activityEthAddress)
          Clipboard.setString(copyContent);
          this._showAlert(I18n.t('toast.copied'))
        }}>
          <Text style={{ color: 'white' }}>{I18n.t('activity.invite.copyCode')}</Text>
        </TouchableOpacity>
        <TextLink style={{marginBottom:20}} color="#01a1f1" text={I18n.t('activity.invite.myQrcode')} onPress={() => {
          navigation.navigate("MyQrcode")
        }}/>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  activityEthAddress : state.Core.activityEthAddress,
  selAvtivityContainerKey: state.Core.selAvtivityContainerKey,
});

export default connect(
  mapStateToProps,
  {}
)(WLInvite);

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imgContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 30
  },
  banner: {
    width: 270,
    height: 143
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4792F6',
    marginVertical: 30,
    alignSelf: 'center',
  },
  scrollView:{
    flex:1,
    width:LayoutConstants.WINDOW_WIDTH
  },
  button: {
    width: 250,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    backgroundColor: '#01a1f1',
    marginVertical: 25,
  },
};
