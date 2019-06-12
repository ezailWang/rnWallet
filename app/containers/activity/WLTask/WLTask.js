/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import GroupButton from './components/GroupButton';
import IconTextItem from './components/IconTextItem';
import PageScroller from './components/PageScroller';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';
import { connect } from 'react-redux';
import { showToast } from '../../../utils/Toast';
import NetworkManager from '../../../utils/NetworkManager';
import { I18n } from '../../../config/language/i18n';
import LayoutConstants from '../../../config/LayoutConstants';

class WLTask extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  selectTask = async ()=>{

    let {activeIndex} = this.state

    if(activeIndex == 1){
      this.props.navigation.navigate('WLNode')
    }
    else if(activeIndex == 0){
      this.props.navigation.navigate('WLLock')
    }
    else{

      this._showLoading()

      let {activityEthAddress,activityItcAddress} = this.props
      try {
        const bindRes = await NetworkManager.bindConvertAddress({ 
          itcAddress:activityItcAddress,
          ethAddress:activityEthAddress 
        });

        this._hideLoading()

        console.log('binRes:', bindRes);
        if (bindRes && bindRes.code === 200) {
          this.props.navigation.navigate('ITCActivityMapping')
        }
      } catch (e) {
        this._hideLoading()
        showToast('bindConvertAddress error',30)
        console.log('bindConvertAddress error:', e);
      }

      
    }
  }

  _onBackPressed = ()=>{

    let {navigation, selAvtivityContainerKey} = this.props
    navigation.goBack(selAvtivityContainerKey)
  }


  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderComponent = () => {
    const { activeIndex } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" leftAction={this._onBackPressed} />
        <ImageBackground
          resizeMode="cover"
          source={require('./images/task_banner.png')}
          style={styles.banner}
        >
          <View style={{ marginLeft: 30, marginTop: 40 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{I18n.t('activity.task.task_join')}</Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', marginTop: 10 }}>
              {I18n.t('activity.task.explain_0')}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.infoContainer}>
          <View style={styles.groupButton}>
            <GroupButton
              buttons={[I18n.t('activity.common.superNode'), I18n.t('activity.common.partnerNode'), I18n.t('activity.task.mapping')]}
              activeIndex={activeIndex}
              onPress={index => {
                this.setState({ activeIndex: index });
                this.scoller.goToPage(index);
              }}
            />
          </View>

          <View style={styles.pageContainer}>
            <PageScroller
              ref={ref => {
                this.scoller = ref;
                return this.scoller;
              }}
              deltaDelay={10}
              onPageChange={page => {
                this.setState({
                  activeIndex: page,
                });
              }}
              pageStyle={{
                padding: 10,
                // height: 100,
              }}
            >
              <View style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Image source={require('./images/t1_icon.png')} style={styles.pageIndicator} />
                  <Image
                    source={require('./images/task1_icon.png')}
                    style={{ alignSelf: 'center' }}
                  />
                </View>
                <View style={styles.taskDesc}>
                  <IconTextItem text={I18n.t('activity.task.task_explain_0')} />
                  <IconTextItem text={I18n.t('activity.task.lock_day')} />
                  <IconTextItem text={I18n.t('activity.task.ben_node')} />
                  <IconTextItem text={I18n.t('activity.task.super_node')}  />
                  <IconTextItem text={I18n.t('activity.task.node_ben')}/>
                  <Image source={require('./images/logo.png')} style={styles.pageDecorator} />
                </View>
              </View>
              <View style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Image source={require('./images/t2_icon.png')} style={styles.pageIndicator} />
                  <Image
                    source={require('./images/task2_icon.png')}
                    style={{ alignSelf: 'center' }}
                  />
                </View>
                <View style={styles.taskDesc}>
                  <IconTextItem text={I18n.t('activity.task.vote_limit')} />
                  <IconTextItem text={I18n.t('activity.task.lock_day')} />
                  <IconTextItem text={I18n.t('activity.task.normal_node')} />
                  <IconTextItem text={I18n.t('activity.task.node_ben_1')}  />
                  <Image source={require('./images/logo.png')} style={styles.pageDecorator} />
                </View>
              </View>
              <View style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Image source={require('./images/t3_icon.png')} style={styles.pageIndicator} />
                  <Image
                    source={require('./images/task3_icon.png')}
                    style={{ alignSelf: 'center' }}
                  />
                </View>
                <View style={styles.taskDesc}>
                  <IconTextItem text={I18n.t('activity.task.mapping_0')}  />
                  <IconTextItem text={I18n.t('activity.task.mapping_1')} />
                  <IconTextItem text={I18n.t('activity.task.mapping_2')} />
                  <Image source={require('./images/logo.png')} style={styles.pageDecorator} />
                </View>
              </View>
            </PageScroller>
          </View>
        </View>
        <TouchableOpacity onPress={this.selectTask} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
          <Text style={{ color: 'white' }}>{I18n.t('activity.task.goto')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  selAvtivityContainerKey: state.Core.selAvtivityContainerKey,
  activityEthAddress : state.Core.activityEthAddress,
  activityItcAddress : state.Core.activityItcAddress
});
export default connect(
  mapStateToProps,
)(WLTask);

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  banner: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
  },

  infoContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  groupButton: {
    backgroundColor: '#f8f8f8',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  pageContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  pageDecorator: {
    position: 'absolute',
    right: 0,
    top: 40,
  },

  taskCard: {
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#46b6fe',
    shadowOffset: { height: 3, width: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.5,
    flex: 1,
      // width:LayoutConstants.WINDOW_WIDTH,
      // height:LayoutConstants.WINDOW_WIDTH*1.32
  },
  taskHeader: {
    padding: 15,
    // height: 216,
    flex: 5,
    justifyContent: 'center',
  },
  taskDesc: {
    width: '100%',
    flex: 5,
    // height: 144,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#94d4ff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  pageIndicator: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  button: {
    width: 300,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
};
