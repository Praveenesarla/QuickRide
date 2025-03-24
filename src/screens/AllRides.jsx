import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RideCard from '../components/RideCard';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserDetails} from '../api';

const AllRides = ({navigation}) => {
  const [rides, setRides] = useState([]);
  const [userDataDetails, setUserDataDetails] = useState();

  useEffect(() => {
    const ridesCollectionRef = firestore()
      .collection('all_rides')
      .doc('Active')
      .collection('rides');

    const unsubscribe = ridesCollectionRef.onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const rideList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRides(rideList);
        console.log('ridesList', rideList);
      } else {
        console.log('No active rides found.');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    userDetails();
  }, []);

  const userDetails = async () => {
    try {
      const auth = await getData();
      const response = await getUserDetails(auth.uid, 'rider');
      console.log(response.data);
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

  return (
    <View>
      <FlatList
        data={rides}
        renderItem={({item}) => (
          <RideCard
            pickLocation={item.pick}
            dropLocation={item.drop}
            customerName={item.name}
            locationFrom={item.pick?.name}
            locationTo={item.drop?.name}
            priceValue={item.rate}
            onPress={() => navigation.navigate('RidePickup', {ride: item})}
          />
        )}
      />
    </View>
  );
};

export default AllRides;

const styles = StyleSheet.create({});
