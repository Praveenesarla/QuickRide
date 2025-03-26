import {StyleSheet, Text, TouchableOpacity, View, Linking} from 'react-native';
import React from 'react';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';
import FromToDestination from '../assets/FromToDestination';

const RideCard = ({
  pickLocation = '',
  dropLocation = '',
  customerName = 'Unknown Rider',
  priceValue = 0,
  locationFrom = 'Unknown Location',
  locationTo = 'Unknown Location',
  onPress,
}) => {
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${pickLocation.latitude},${pickLocation.longitude}`;
  const openGoogleMaps = () => {
    console.log('Opening maps:', mapLink);
    if (mapLink) {
      let formattedMapLink = mapLink;

      if (mapLink.includes('place_id')) {
        formattedMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          mapLink,
        )}`;
      }

      Linking.openURL(formattedMapLink).catch(err =>
        console.error('An error occurred while opening maps:', err),
      );
    } else {
      console.log('No map link provided');
    }
  };

  return (
    <View style={styles.rideCard}>
      <Text style={styles.riderName}>{customerName}</Text>
      <View style={styles.locationContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <FromToDestination />
          <View style={{gap: 10}}>
            <Text style={styles.fromText}>{locationFrom}</Text>
            <Text style={styles.fromText}>{locationTo}</Text>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.priceText}>Price</Text>
          <Text style={styles.priceValue}>₹{priceValue}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity style={styles.showRideContainer} onPress={onPress}>
          <Text style={styles.showRideText}>Show Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.showRideContainer}
          onPress={openGoogleMaps}>
          <Text style={styles.showRideText}>Show Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideCard;

const styles = StyleSheet.create({
  rideCard: {
    width: '100%',
    height: responsive.height(134),
    borderRadius: responsive.borderRadius(8),
    borderWidth: responsive.width(0.5),
    padding: responsive.padding(5),
    justifyContent: 'space-around',
  },
  riderName: {
    color: colors.black,
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(12),
  },
  fromText: {
    fontSize: responsive.fontSize(11),
    color: colors.black,
    fontFamily: fonts.Regular,
    width: '97%',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    color: colors.black,
    fontSize: responsive.fontSize(10),
    fontFamily: fonts.Regular,
  },
  priceValue: {
    color: colors.black,
    fontSize: responsive.fontSize(16),
    fontFamily: fonts.Black,
  },
  showRideContainer: {
    width: '45%',
    height: responsive.height(25),
    borderWidth: responsive.width(1),
    borderColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showRideText: {
    color: colors.black,
    fontFamily: fonts.Regular,
  },
});
