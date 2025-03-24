import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FromToDestination2 from '../../assets/FromToDestination2';
import responsive from '../../utils/responsive';
import {colors, fonts} from '../../constants/theme';

const CustomerDetails = ({
  customerName = 'Customer Name',
  fromAddress = 'Pickup Location',
  toAddress = 'Drop Location',
  distance = '0 km',
  price = '₹0',
  onAcceptRide = () => {},
}) => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.customerHeader}>
        <Text style={styles.customerName}>{customerName}</Text>
      </View>
      <View style={styles.rideCard}>
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <FromToDestination2 />
            <View style={styles.locationDetails}>
              <Text style={styles.fromText}>{fromAddress}</Text>
              <Text style={styles.distanceText}>{distance}</Text>
              <Text style={styles.fromText}>{toAddress}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceValue}>{price}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.acceptButton} onPress={onAcceptRide}>
          <Text style={styles.acceptText}>Accept Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  customerHeader: {
    borderBottomWidth: 0.7,
    paddingBottom: responsive.padding(5),
  },
  customerName: {
    fontSize: responsive.fontSize(14),
    fontFamily: fonts.SemiBold,
    color: colors.black,
    paddingLeft: responsive.padding(10),
  },
  rideCard: {
    flex: 1,
    marginTop: responsive.margin(10),
    padding: responsive.padding(10),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationDetails: {
    gap: 10,
  },
  fromText: {
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(12),
    color: colors.gray,
  },
  distanceText: {
    fontFamily: fonts.Black,
    fontSize: responsive.fontSize(14),
    color: colors.black,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceValue: {
    fontSize: responsive.fontSize(16),
    fontFamily: fonts.Bold,
    color: colors.primary,
  },
  acceptButton: {
    width: '100%',
    height: responsive.height(34),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  acceptText: {
    color: colors.cement,
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(14),
  },
};

export default CustomerDetails;
