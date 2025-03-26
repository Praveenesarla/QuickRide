import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import responsive from '../../utils/responsive';
import {colors, fonts} from '../../constants/theme';

const RiderStartedCard = ({
  item,
  locationName = 'Location Name',
  price = '₹0',
  distanceRemaining = '0 km',
  onStartRide = () => {},
  onCancelRide = () => {},
}) => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.statusText}>Rider Started</Text>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{distanceRemaining}</Text>
          <Text style={styles.remainsText}>Remains</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.locationName]}>{locationName}</Text>
          <Text style={styles.price}>₹{price}</Text>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={onStartRide}>
          <Text style={styles.startButtonText}>Start Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startButton, styles.cancelButton]}
          onPress={onCancelRide}>
          <Text style={styles.startButtonText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  headerContainer: {
    width: '100%',
    height: responsive.height(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: responsive.width(1),
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(5),
  },
  statusText: {
    fontFamily: fonts.SemiBold,
    color: colors.black,
    fontSize: responsive.fontSize(14),
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(12),
    color: colors.black,
  },
  remainsText: {
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(10),
    color: colors.black,
  },
  detailsContainer: {
    padding: responsive.padding(10),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationName: {
    fontFamily: fonts.SemiBold,
    color: colors.black,
    fontSize: responsive.fontSize(14),
    width: '75%',
  },
  price: {
    color: colors.black,
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(16),
  },
  startButton: {
    width: '100%',
    height: responsive.height(34),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green,
    marginVertical: responsive.margin(10),
  },
  cancelButton: {
    backgroundColor: colors.red,
  },
  startButtonText: {
    fontSize: responsive.fontSize(14),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
};

export default RiderStartedCard;
