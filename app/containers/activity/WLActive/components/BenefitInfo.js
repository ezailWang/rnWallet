/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text, Image,TouchableOpacity } from 'react-native';
import { I18n } from '../../../../config/language/i18n';

export default ({ total, forest, cycle, invite, source, onPress }) => {
  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.header}>
            <View style={styles.total}>
              <Text>{I18n.t('activity.common.totalReward')}(ITC)</Text>
              <Text style={styles.totalText}>{total}</Text>
            </View>
            <Image source={require('../images/rightBlue.png')} style={{width:20,height:20}} />
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.detailInfo}>
          <DetailInfo label={I18n.t('activity.common.poolReward')} value={forest} />
          <DetailInfo label={I18n.t('activity.nodeSummary.joinRound')} value={cycle} />
        </View>
        <View style={styles.detailInfo}>
          <DetailInfo label={I18n.t('activity.common.inviteReward')} value={invite} />
          <DetailInfo label={I18n.t('activity.common.treeReward')} value={source} />
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
    fontSize: 20,
    color: '#4EAAED',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e4',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
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
