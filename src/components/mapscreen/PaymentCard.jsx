import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, fonts} from '../../constants/theme';
import responsive from '../../utils/responsive';

const PaymentCard = ({
  name = 'Gun Park',
  km = '4.6 km',
  price = '₹74',
  onPressFinishRide = () => {},
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rider Started</Text>
        <View style={styles.kmContainer}>
          <Text style={styles.kmText}>{km}</Text>
          <Text style={styles.remainsText}>Remains</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.priceText}>₹{price}</Text>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={onPressFinishRide}>
            <Text style={styles.buttonText}>Finish Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    width: '100%',
    height: responsive.height(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: responsive.width(1),
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(5),
  },
  headerText: {
    fontFamily: fonts.SemiBold,
    color: colors.black,
    fontSize: responsive.fontSize(14),
  },
  kmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kmText: {
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(12),
    color: colors.black,
  },
  remainsText: {
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(10),
    color: colors.black,
  },
  content: {
    padding: responsive.padding(10),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: responsive.padding(16),

    marginTop: responsive.margin(20),
  },
  nameText: {
    fontFamily: fonts.SemiBold,
    color: colors.black,
    fontSize: responsive.fontSize(16),
  },
  priceText: {
    color: colors.black,
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(16),
  },
  finishButton: {
    width: '100%',
    borderRadius: responsive.borderRadius(4),
    height: responsive.height(34),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B82929',
  },
  buttonText: {
    fontSize: responsive.fontSize(14),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
});

export default PaymentCard;
