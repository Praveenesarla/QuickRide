import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import responsive from '../../utils/responsive';
import {colors, fonts} from '../../constants/theme';
import CustomButton from '../CustomButton';

const DestinationReachedCard = ({
  onFinishRide,
  paymentStatus = 'Not Paid',
  price = 150,
}) => {
  const isPaid = paymentStatus === 'Paid';

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsive.padding(10),
        gap: 5,
      }}>
      {/* Rupee Icon with Price */}
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Icon name="rupee" size={50} color={colors.black} />
        <Text
          style={{
            fontSize: responsive.fontSize(40),
            fontFamily: fonts.Bold,
            color: colors.black,
          }}>
          {price}
        </Text>
      </View>

      {/* Payment Status */}
      <Text
        style={{
          fontSize: responsive.fontSize(16),
          fontFamily: fonts.SemiBold,
          color: isPaid ? 'green' : 'red',
        }}>
        {isPaid ? 'Paid Successfully' : 'Should be Collected'}
      </Text>

      {/* Finish Ride Button */}
      <CustomButton title="Finish Ride" onPress={onFinishRide} />
    </View>
  );
};

export default DestinationReachedCard;
