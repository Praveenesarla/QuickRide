import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';
import FromToDestination from '../assets/FromToDestination';
import RideCard from '../components/RideCard';
import HistoryCard from '../components/HistoryCard';

const RidesHistory = () => {
  return (
    <View>
      <View
        style={{
          paddingVertical: responsive.padding(10),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            marginVertical: responsive.margin(10),
            paddingHorizontal: responsive.padding(10),
          }}>
          <Icon name="arrow-back" size={30} color="#900" />
        </View>
        <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: fonts.SemiBold,
              fontSize: responsive.fontSize(14),
              color: colors.black,
              paddingRight: responsive.padding(30),
            }}>
            Rides History
          </Text>
        </View>
      </View>
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={({item}) => <HistoryCard />}
        contentContainerStyle={{
          paddingHorizontal: responsive.padding(10),
          gap: 10,
        }}
      />
    </View>
  );
};

export default RidesHistory;

const styles = StyleSheet.create({});
