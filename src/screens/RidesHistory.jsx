import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';
import auth from '@react-native-firebase/auth';
import FromToDestination from '../assets/FromToDestination';
import RideCard from '../components/RideCard';
import HistoryCard from '../components/HistoryCard';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserDetails} from '../api';

const RidesHistory = ({navigation}) => {
  const [rides, setRides] = useState([]);
  const [userDataDetails, setUserDataDetails] = useState(null);

  useEffect(() => {
    userDetails();
  }, []);
  const userDetails = async () => {
    try {
      const auth = await getData();
      const response = await getUserDetails(auth.uid, 'rider');
      console.log('rider details', response.data);
      setUserDataDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async key => {
    try {
      const value = await AsyncStorage.getItem('auth');
      const convert = JSON.parse(value);

      return convert;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    const ridesCollectionRef = firestore()
      .collection('all_rides')
      .doc('Completed')
      .collection('rides')
      .where('rider_id', '==', auth().currentUser.uid);

    const unsubscribe = ridesCollectionRef.onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const rideList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRides(rideList);
        console.log('All rides:', rideList);
      } else {
        console.log('No completed rides found.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <View
        style={{
          paddingVertical: responsive.padding(10),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: fonts.SemiBold,
              fontSize: responsive.fontSize(14),
              color: colors.black,
              paddingLeft: responsive.padding(1),
            }}>
            Rides History
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginVertical: responsive.margin(10),
            paddingHorizontal: responsive.padding(10),
          }}>
          <Icon name="arrow-back" size={30} color="#900" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={rides}
        renderItem={({item}) => (
          <HistoryCard
            customerName={item.name}
            fromLocation={item.pick.place}
            paymentMode={item.payment_status}
            toLocation={item.drop.place}
            price={item.rate}
          />
        )}
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
