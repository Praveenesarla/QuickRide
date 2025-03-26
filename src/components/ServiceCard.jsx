import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon3 from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';

const ServiceCard = ({
  serviceName = 'Service center name',
  phoneNumber = '2222222222',
  address = '152 Nikko Ridges, Chaseborough 04399',
  kmFar = '5.3',
  service,
}) => {
  const callNumber = phone => {
    let phoneNumber = `tel:${phone}`;
    Linking.openURL(phoneNumber).catch(err =>
      console.error('Error opening dialer:', err),
    );
  };

  console.log('service', service);
  return (
    <View style={styles.cardContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <View style={styles.rowSpaceBetween}>
          <View style={styles.leftContainer}>
            <View style={styles.rowAlignCenter}>
              <Text style={styles.phoneNumber}>{service.phone}</Text>
              <Image
                source={require('../assets/call.png')}
                style={styles.callIcon}
              />
            </View>
            <Text style={styles.address}>{service.address}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Text style={styles.kmText}>{kmFar}</Text>
            <Text style={styles.kmLabel}>k.m. away</Text>
          </View>
        </View>
      </View>
      <View style={styles.rowSpaceAround}>
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>Location</Text>
          <Icon3 name="location-dot" size={12} color="#900" />
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => callNumber(service.phone)}>
          <Text style={styles.actionText}>Call</Text>

          <Icon2 name="phone" size={12} color={colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: responsive.width(0.5),
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(10),
  },
  detailsContainer: {
    width: '100%',
    height: responsive.height(100),
    gap: 5,
  },
  serviceName: {
    color: colors.black,
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(16),
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    gap: 5,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  phoneNumber: {
    fontSize: responsive.fontSize(12),
    color: colors.black,
    fontFamily: fonts.Medium,
  },
  callIcon: {
    width: responsive.width(16),
    height: responsive.height(16),
  },
  address: {
    fontSize: responsive.fontSize(12),
    color: colors.black,
    fontFamily: fonts.Medium,
  },
  distanceContainer: {
    alignItems: 'center',
  },
  kmText: {
    fontFamily: fonts.Medium,
    fontSize: responsive.fontSize(14),
    color: colors.black,
  },
  kmLabel: {
    fontFamily: fonts.Regular,
    color: colors.black,
    fontSize: responsive.fontSize(10),
  },
  rowSpaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: '48%',
    borderColor: colors.red,
    borderWidth: 1,
    height: responsive.height(27),
    borderRadius: responsive.borderRadius(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    color: colors.black,
    fontSize: responsive.fontSize(10),
    fontFamily: fonts.Medium,
  },
});

export default ServiceCard;
