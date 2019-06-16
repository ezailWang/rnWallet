/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text } from 'react-native';
import { I18n } from '../../../../config/language/i18n';

export default ({ gameOver, bonus,total, current, color, style }) => {
  let rate = (current * 100) / total;
  rate = rate>100?100:rate;
  return (
    <View style={[styles.container, { ...style }]}>
      <Text style={[styles.title]}>
      {gameOver?"":I18n.t('activity.extra.explain_0')} <Text style={{ color, fontSize: 28, fontWeight: '600' }}>{bonus}</Text> ITC
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progress}>
          <View style={[styles.innerProgress, { backgroundColor: color, borderBottomRightRadius:total == current ? 4 : 0 ,borderTopRightRadius:total == current ? 4 : 0, width: `${rate}%` }]} />
        </View>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, { borderBottomColor: color, marginLeft: `${rate}%` }]} />
        </View>
      </View>
      {/* <Progress progress={50} backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2}}
      fillStyle={{backgroundColor : 'yellow'}}/> */}
      {
        gameOver ? null : 
        <Text style={styles.desc}>
          {I18n.t('activity.extra.explain_1')}: {current}/{total} ITC
        </Text>
      }
    </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15.5,
    fontWeight: '500',
  },
  progressContainer: {
    width: 250,
  },
  progress: {
    backgroundColor: '#bdbdbd',
    // width: 250,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginBottom: 12,
  },
  innerProgress: {
    height: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  desc: {
    fontSize: 13,
    color: 'gray',
  },
  triangleContainer: {
    position: 'absolute',
    width: '100%',
    left: -6,
    top: 12,
    zIndex: 999,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    borderLeftColor: 'transparent',
    marginTop: 5,
    marginLeft: -10,
  },
};
