/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import GroupButton from './components/GroupButton';
import IconTextItem from './components/IconTextItem';
import PageScroller from './components/PageScroller';
import NavHeader from '../../../components/NavHeader';
import BaseComponent from '../../base/BaseComponent';

export default class WLTask extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  selectTask = ()=>{

    let {activeIndex} = this.state

    if(activeIndex == 1){
      this.props.navigation.navigate('WLNode')
    }
    else if(activeIndex == 0){
      this.props.navigation.navigate('WLLock')
    }
  }

  render() {
    const { activeIndex } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavHeader navigation={navigation} color="transparent" />
        <ImageBackground
          resizeMode="cover"
          source={require('./images/banner.png')}
          style={styles.banner}
        >
          <View style={{ marginLeft: 30, marginTop: 40 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>加入涡轮计划</Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', marginTop: 10 }}>
              从以下任务中选择一个完成，即可加入涡轮计划
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.infoContainer}>
          <View style={styles.groupButton}>
            <GroupButton
              buttons={['超级节点', '伙伴节点', '提前换币']}
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
                  <IconTextItem text="质押10万ICT" />
                  <IconTextItem text="锁定90天" />
                  <IconTextItem text="成为涡轮权益节点" />
                  <IconTextItem text="涡轮森林超级节点奖励" />
                  <IconTextItem text="后期节点运营收益" />
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
                  <IconTextItem text="投票600个ITC" />
                  <IconTextItem text="锁定90天" />
                  <IconTextItem text="成为涡轮普通节点" />
                  <IconTextItem text="后期共享节点运营收益" />
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
                  <IconTextItem text="映射600个ITC" />
                  <IconTextItem text="无锁定期" />
                  <IconTextItem text="成为涡轮普通节点" />
                  <Image source={require('./images/logo.png')} style={styles.pageDecorator} />
                </View>
              </View>
            </PageScroller>
          </View>
        </View>
        <TouchableOpacity onPress={this.selectTask} style={[styles.button, { backgroundColor: '#01a1f1' }]}>
          <Text style={{ color: 'white' }}>去完成</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
  },
  taskHeader: {
    padding: 15,
    // height: 216,
    flex: 6,
    justifyContent: 'center',
  },
  taskDesc: {
    width: '100%',
    flex: 4,
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
    left: 10,
  },
  button: {
    width: 300,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    marginBottom: 5,
  },
};
