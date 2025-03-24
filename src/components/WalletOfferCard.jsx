import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import responsive from '../utils/responsive';

const WalletOfferCard = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsive.width(225),
    height: responsive.height(50),
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Outfit-Medium',
    fontSize: responsive.fontSize(14),
    color: '#000000',
  },
});

export default WalletOfferCard;
