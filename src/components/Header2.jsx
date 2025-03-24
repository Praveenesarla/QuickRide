import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import responsive from '../utils/responsive';

const Header2 = ({screen = ''}) => {
  return (
    <View style={styles.header}>
      {!['Services', 'Quick Ride', 'Wallet', 'Profile'].includes(screen) && (
        <TouchableOpacity onPress={() => console.log('')}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerText}>{screen}</Text>
      {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
    </View>
  );
};

export default Header2;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: responsive.padding(15),
  },
  headerText: {
    fontSize: responsive.fontSize(22),
    fontFamily: 'Outfit-SemiBold',
    color: '#000000',
  },
  logo: {height: responsive.height(40), width: responsive.width(120)},
});
