import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import responsive from '../../utils/responsive';
import {colors, fonts} from '../../constants/theme';
import CustomButton from '../CustomButton';

const DestinationReachedCard = ({onFinishRide}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsive.padding(10),
        gap: 5,
      }}>
      <Icon name="check-circle" size={100} color="green" />
      <Text
        style={{
          fontSize: responsive.fontSize(20),
          fontFamily: fonts.SemiBold,
          color: colors.black,
        }}>
        You reached the destination!
      </Text>
      <CustomButton title="Finish Ride" onPress={onFinishRide} />
    </View>
  );
};

export default DestinationReachedCard;
