import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';
import FromToDestination from '../assets/FromToDestination';

const HistoryCard = ({
  customerName = 'Parikh Vraj',
  fromLocation = 'Source Location',
  toLocation = 'Destination Location',
  price = '₹324',
  paymentMode = 'Cash',
}) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          borderRadius: responsive.borderRadius(8),
          width: '100%',
          borderWidth: responsive.width(0.5),
          height: responsive.height(83),
          padding: responsive.padding(10),
          justifyContent: 'center',
          gap: 10,
        }}>
        <Text
          style={{
            fontSize: responsive.fontSize(12),
            color: colors.black,
            fontFamily: fonts.Regular,
            paddingLeft: responsive.padding(5),
          }}>
          {customerName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            <FromToDestination height={37} />
            <View style={{gap: 10}}>
              <Text
                style={{
                  fontFamily: fonts.Medium,
                  fontSize: responsive.fontSize(8),
                  color: colors.black,
                }}>
                {fromLocation}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Medium,
                  fontSize: responsive.fontSize(8),
                  color: colors.black,
                }}>
                {toLocation}
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: fonts.Black,
                fontSize: responsive.fontSize(16),
                color: colors.black,
              }}>
              {price}
            </Text>
            <Text
              style={{
                fontFamily: fonts.Medium,
                color: colors.red,
                fontSize: responsive.fontSize(11),
              }}>
              {paymentMode}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
