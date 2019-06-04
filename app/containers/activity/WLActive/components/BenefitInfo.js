/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, Image } from 'react-native';

export default ({ total, forest, cycle, invite, source }) => {
  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.total}>
            <Text>总收益(ITC)</Text>
            <Text style={styles.totalText}>{total}</Text>
          </View>
          <Image source={require('../images/rightBlue.png')} />
        </View>
        <View style={styles.divider} />
        <View style={styles.detailInfo}>
          <DetailInfo label="森林收益" value={forest} />
          <DetailInfo label="参与轮数" value={cycle} />
        </View>
        <View style={styles.detailInfo}>
          <DetailInfo label="邀请收益" value={invite} />
          <DetailInfo label="溯源收益" value={source} />
        </View>
      </View>
    </View>
  );
};

const DetailInfo = ({ label, value }) => {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const styles = {
  body: {
    backgroundColor: '#f8f8f8',
  },
  container: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  header: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  totalText: {
    fontSize: 18,
    color: '#4EAAED',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e4',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  detailInfo: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  detailLabel: {
    color: '#9f9f9f',
  },
  detailValue: {
    marginLeft: 20,
  },
};
