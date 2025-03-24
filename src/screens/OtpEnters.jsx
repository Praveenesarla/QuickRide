import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';
import OTPInput from '../components/OtpInput';

const OtpEnters = ({route, navigation}) => {
  const {rideOtp} = route.params;

  const handleOTPComplete = otp => {
    if (otp === rideOtp) {
      navigation.navigate('RidePickup');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          marginVertical: responsive.margin(10),
          paddingHorizontal: responsive.padding(10),
        }}>
        <Icon name="arrow-back" size={30} color="#900" />
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/otp.png')}
          style={{width: '100%', height: responsive.height(232)}}
        />

        <Text
          style={{
            color: colors.black,
            fontFamily: fonts.SemiBold,
            fontSize: responsive.fontSize(16),
          }}>
          Verify the OTP from
          <Text style={{color: colors.red}}> Parikh Vraj</Text>
        </Text>

        <OTPInput length={4} onComplete={handleOTPComplete} />
        <Text
          style={{
            color: colors.black,
            fontFamily: fonts.SemiBold,
            fontSize: responsive.fontSize(12),
            paddingVertical: responsive.padding(20),
          }}>
          Didn’t receive the OTP?
          <Text style={{color: colors.red}}> resend OTP</Text>
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: 'auto',
          padding: responsive.padding(10),
        }}>
        <View
          style={{
            width: '100%',
            height: responsive.height(34),
            borderRadius: responsive.borderRadius(8),
            backgroundColor: colors.red,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: responsive.padding(10),
            marginHorizontal: responsive.margin(10),
          }}>
          <Text
            style={{
              color: colors.cement,
              fontFamily: fonts.Medium,
              fontSize: responsive.fontSize(14),
            }}>
            Verify OTP
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OtpEnters;

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
