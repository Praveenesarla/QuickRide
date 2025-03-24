import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';

const Header = ({title = 'Default Title', onBackPress}) => (
  <View style={{padding: responsive.padding(10)}}>
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#900" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  </View>
);

const styles = {
  headerContainer: {
    paddingVertical: responsive.padding(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginVertical: responsive.margin(10),
  },
  titleContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: fonts.SemiBold,
    fontSize: responsive.fontSize(14),
    color: colors.black,
    paddingRight: responsive.padding(30),
  },
};

export default Header;
