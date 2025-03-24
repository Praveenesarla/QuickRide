import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';

const CustomButton = ({title = 'Button', onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: responsive.height(34),
    borderRadius: responsive.borderRadius(5),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsive.margin(10),
  },
  text: {
    color: colors.cement,
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(14),
  },
});

export default CustomButton;
