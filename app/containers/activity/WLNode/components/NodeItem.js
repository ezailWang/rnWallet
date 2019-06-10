/* eslint-disable no-use-before-define */
import React from 'react';
import { View, Text , TouchableOpacity} from 'react-native';

export default ({idx,no, address, count , onPress}) => {
  return (
    <TouchableOpacity onPress={()=>{onPress(idx)}} style={styles.container}>
      <View style={styles.leftInfoView}>
        <Text style={styles.no}>{no}</Text>
        <Text style={styles.address}  ellipsizeMode="middle" numberOfLines={1}>{address}</Text>
      </View>
      <Text style={styles.count}>
        {' '}
        {count}
        <Text style={styles.unit}> ITC</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    width: '90%',
    padding: 20,
    marginBottom: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { height: 3, width: 0 },
    shadowRadius: 3,
    shadowOpacity: 0.5,
    backgroundColor: 'white',
  },
  no: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#727272',
  },
  leftInfoView:{
    flex:6
  },
  count: {
    flex:4,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00aeff',
    textAlign:'right'
  },
  unit: {
    fontSize: 16,
    marginLeft: 10,
  },
};
