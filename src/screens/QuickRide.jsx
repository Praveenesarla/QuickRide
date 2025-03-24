import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import responsive from '../utils/responsive';
import {colors, fonts} from '../constants/theme';
import BottomSheetPointer from '../assets/BottomSheetPointer';
import Icon from 'react-native-vector-icons/Feather';
import BackButton from 'react-native-vector-icons/Ionicons';
import CustomerDetails from '../components/mapscreen/CustomerDetails';
import DestinationReachedCard from '../components/mapscreen/DestinationReachedCard';
import PaymentCard from '../components/mapscreen/PaymentCard';
import RiderStartedCard from '../components/mapscreen/RiderStartedCard';
import OtpEnters from './OtpEnters';
import {acceptRide, getUserDetails} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuickRide = ({route, navigation}) => {
  const {ride} = route.params;
  const [modalVisible, setModalVisible] = useState(true);
  const [region, setRegion] = useState(null);
  const [bottomSheetFlow, setBottomSheetFlow] = useState('CustomerDetails');
  const [otpModal, setModal] = useState(true);
  const [userDataDetails, setUserDataDetails] = useState();
  const [uid, setUid] = useState();
  const [rideStatus, setRideStatus] = useState(null);
  console.log('ride data', ride.id);

  useEffect(() => {
    if (!ride.id) return;

    const rideDocRef = firestore()
      .collection('all_rides')
      .doc('Active')
      .collection('rides')
      .doc(ride.id);

    const unsubscribe = rideDocRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const rideData = docSnapshot.data();
        setRideStatus(rideData.status);
        console.log(`Ride ID: ${ride.id}, Status: ${rideData.status}`);
      } else {
        console.log(`Ride with ID ${ride.id} not found.`);
      }
    });

    return () => unsubscribe();
  }, [ride]);

  useEffect(() => {
    requestLocationPermission();
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

  const acceptingRide = async () => {
    console.log('userDetails', userDataDetails);
    const data = {
      name: userDataDetails.name,
      memberId: userDataDetails.memberId,
      uid: userDataDetails.uid,
      phone: userDataDetails.phone,
      email: userDataDetails.email,
      vehicleName: userDataDetails.vehicleName,
      vehicleNumber: userDataDetails.vehicleNumber,
      rideId: ride.id,
    };
    try {
      const response = await acceptRide(data);
      console.log('accepting suceess', response);
      navigation.navigate('otpEnters', ride.otp);
    } catch (error) {
      console.log(error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }
    trackLocation();
  };

  const trackLocation = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10, interval: 5000},
    );
  };

  const handleBackPress = () => {
    // Add navigation logic if needed
  };

  return (
    <View style={styles.container}>
      {/* MapView */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={region}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {region && <Marker coordinate={region} title="You are here" />}
        </MapView>
        <TouchableOpacity style={{top: 10, left: 10}}>
          <BackButton
            onPress={handleBackPress}
            name="arrow-back"
            size={27}
            color="#000000"
          />
        </TouchableOpacity>
      </View>

      {/* Full-Screen OTP Modal */}
      {/* <Modal animationType="slide" transparent={true} visible={otpModal}>
        <View style={styles.fullScreenModal}>
          <OtpEnters />
        </View>
      </Modal> */}

      {/* Bottom Sheet Modal */}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.bottomSheet}>
          <View style={styles.bottomDraggerView}>
            <BottomSheetPointer />
          </View>
          {{
            New: <CustomerDetails onAcceptRide={acceptingRide} />,
            Finished: <DestinationReachedCard />,
            Started: <PaymentCard />,
            Accepted: <RiderStartedCard />,
          }[rideStatus] || null}
        </View>
      </Modal>
    </View>
  );
};

export default QuickRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: '70%',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    gap: 10,
  },
  bottomDraggerView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  fullScreenModal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
