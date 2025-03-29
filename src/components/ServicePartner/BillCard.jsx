import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, fonts} from '../../constants/theme';
import responsive from '../../utils/responsive';

const BillCard = ({
  item,
  billId = 'N/A',
  name = 'Unknown',
  phone = 'Not Provided',
  vehicle = 'Not Specified',
  description = 'No Description',
  paymentStatus = 'UnPaid',
  amount = 0,
}) => {
  console;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Bill ID: <Text style={styles.value}>{item?.id}</Text>
      </Text>
      <Text style={styles.label}>
        Name: <Text style={styles.value}>{name}</Text>
      </Text>
      <Text style={styles.label}>
        Phone: <Text style={styles.value}>{phone}</Text>
      </Text>
      <Text style={styles.label}>
        Vehicle: <Text style={styles.value}>{vehicle}</Text>
      </Text>
      <Text style={styles.label}>
        Description: <Text style={styles.value}>{description}</Text>
      </Text>
      <Text style={styles.label}>
        Payment Status:{' '}
        <Text
          style={[
            styles.value,
            {color: paymentStatus === 'Paid' ? 'green' : 'red'},
          ]}>
          {paymentStatus}
        </Text>
      </Text>
      <Text style={styles.label}>
        Amount: <Text style={styles.value}>₹{amount}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: responsive.margin(10),
    width: '95%',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.black,
    fontFamily: fonts.Black,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 3,
  },
  value: {
    fontSize: responsive.fontSize(16),
    fontWeight: '500',
    color: '#666',
  },
});

export default BillCard;
