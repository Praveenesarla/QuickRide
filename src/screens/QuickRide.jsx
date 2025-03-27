import React, {useEffect, useRef, useState} from 'react';
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
import MapView, {Marker, Polyline} from 'react-native-maps';
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
import {
  acceptRide,
  cancelRide,
  changeRiderLocation,
  finishRide,
  getUserDetails,
  startRide,
} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const QuickRide = ({route, navigation}) => {
  const intervalRef = useRef(null);
  const [region2, setRegion2] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [watchId, setWatchId] = useState(null);
  const {ride} = route.params;
  const [modalVisible, setModalVisible] = useState(true);
  const [riderId, setRiderId] = useState('');
  const [region, setRegion] = useState(null);
  const [rideData, setRideData] = useState({});
  const [bottomSheetFlow, setBottomSheetFlow] = useState('CustomerDetails');
  const [otpModal, setModal] = useState(true);
  const [userDataDetails, setUserDataDetails] = useState();
  const [uid, setUid] = useState();
  const [rideStatus, setRideStatus] = useState(null);
  console.log('rideDataDetails', ride);

  useEffect(() => {
    trackLocation();
  }, []);

  const handleNewRideStatus = () => {
    if (rideData?.drop && rideData?.pick) {
      const origin = `${rideData.pick.latitude},${rideData.pick.longitude}`;
      const destination = `${rideData.drop.latitude},${rideData.drop.longitude}`;
      fetchRouteCoordinates(origin, destination);
    }
  };

  const handleAcceptedRideStatus = () => {
    requestLocationPermission();
  };

  // Effect to handle rideStatus changes
  useEffect(() => {
    if (rideStatus === 'New') {
      handleNewRideStatus();
    } else if (rideStatus === 'Accepted') {
      handleAcceptedRideStatus();
    } else {
      if (watchId) {
        Geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [rideStatus, rideData?.drop, rideData?.pick]);

  // Map Route if rideStatus is New

  useEffect(() => {
    if (rideData?.drop && rideData?.pick) {
      const origin = `${rideData?.pick.latitude},${rideData?.pick.longitude}`;
      const destination = `${rideData?.drop.latitude},${rideData?.drop.longitude}`;

      fetchRouteCoordinates(origin, destination);
    }
  }, [rideData?.drop, rideData?.pick]);

  const fetchRouteCoordinates = async (origin, destination) => {
    const API_KEY = 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0';
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      console.log('Google Maps API Response:', response.data);

      if (response.data.status === 'OK') {
        const points = response.data.routes[0].overview_polyline.points;
        console.log('Polyline points:', points);

        const coordinates = decodePolyline(points);
        setRouteCoordinates(coordinates);

        // Set the region to focus on the route
        setRegion2({
          latitude: (rideData.pick.latitude + rideData.drop.latitude) / 2,
          longitude: (rideData.pick.longitude + rideData.drop.longitude) / 2,
          latitudeDelta:
            Math.abs(rideData.pick.latitude - rideData.drop.latitude) + 0.05,
          longitudeDelta:
            Math.abs(rideData.pick.longitude - rideData.drop.longitude) + 0.05,
        });
      } else {
        console.error('Error fetching route:', response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const decodePolyline = (t, e = 5) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / Math.pow(10, e),
        longitude: lng / Math.pow(10, e),
      });
    }

    return points;
  };
  // Map Route if rideStatus is New

  // Update Riders Location At each 5 seconds

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
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      // error => console.log('Error fetching initial location:', error),
      {enableHighAccuracy: true},
    );
    trackLocation();
  };

  const trackLocation = () => {
    console.log('trackLocation called');

    // Start watching the location
    const id = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(
          'Updated location from watchPosition:',
          latitude,
          longitude,
        );

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        (async () => {
          try {
            const response = await changeRiderLocation({
              latitude,
              longitude,
              rideId: ride?.id,
            });
            console.log(
              // 'Location updated successfully (immediate call):',
              response,
            );
          } catch (error) {
            // console.log('Error updating location (immediate call):', error);
          }
        })();
      },
      error => {
        // console.log('Error tracking location:', error);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );
    setWatchId(id);

    // if (intervalRef.current) {
    //   clearInterval(intervalRef.current);
    // }

    intervalRef.current = setInterval(async () => {
      if (region) {
        // console.log('Interval running. Current region:', region);
        try {
          const response = await changeRiderLocation({
            latitude: region.latitude,
            longitude: region.longitude,
            rideId: ride?.id,
          });
          // console.log('Location updated successfully (interval):', response);
        } catch (error) {
          // console.log('Error updating location (interval):', error);
        }
      } else {
        // console.log('Region is not set, skipping API call.');
      }
    }, 10000);
  };
  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [watchId]);

  useEffect(() => {
    if (rideStatus === 'Accepted') {
      requestLocationPermission();
    } else {
      if (watchId) {
        Geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [rideStatus]);

  // Update Riders Location At each 5 seconds

  useEffect(() => {
    if (!ride?.id) return;

    const rideDocRef = firestore()
      .collection('all_rides')
      .doc('Active')
      .collection('rides')
      .doc(ride.id);

    const unsubscribe = rideDocRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();

        setRideData(data);
        setRideStatus(data.status);

        console.log(`Ride Data for ID ${ride.id}:`, data);
        console.log(`Ride Status for ID ${ride.id}:`, data.status);
      } else {
        console.log(`Ride with ID ${ride.id} not found.`);
      }
    });

    return () => unsubscribe();
  }, [ride]);

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
      console.log('ride otp', rideData.otp);
      navigation.navigate('otpEnters', {otp: rideData.otp, ride: ride});
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackPress = () => {
    // Add navigation logic if needed
  };

  const handleStartRide = async () => {
    const rideId = ride.id;
    const data = rideId;
    try {
      const response = await startRide(data);
      console.log('handleStartRide', response);
    } catch (error) {
      console.log('handleStartRideError', error);
    }
  };

  const handlePreFinishRide = async () => {
    console.log('riderDatatobe Mo', rideData.rate, rideData.payment_status);
    setRideStatus('PreFinish');
  };

  const handleFinishRide = async () => {
    const rideId = ride.id;
    const data = rideId;
    try {
      const response = await finishRide(data);
      navigation.navigate('history');
      console.log('handle Finish Ride', response);
    } catch (error) {
      console.log('handleStartRideError', error);
    }
  };

  const handleCancelRide = async () => {
    const data = {
      uid: userDataDetails.uid,
      rider_id: rideData.rider_id,
      ride_id: ride.id,
    };
    try {
      const response = await cancelRide(data);
      console.log('handleStartRide', response);
    } catch (error) {
      console.log('handleStartRideError', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* MapView */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          showsUserLocation={true}
          region={region2}
          initialRegion={{
            latitude: rideData.pick?.latitude || 37.78825,
            longitude: rideData.pick?.longitude || -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {/* Show route and markers if rideStatus is "New" */}
          {rideStatus === 'New' && routeCoordinates.length > 0 && (
            <>
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="blue"
              />
              <Marker
                coordinate={{
                  latitude: rideData.pick.latitude,
                  longitude: rideData.pick.longitude,
                }}
                title="Pickup Location"
                description={rideData.pick.place}
              />
              <Marker
                coordinate={{
                  latitude: rideData.drop.latitude,
                  longitude: rideData.drop.longitude,
                }}
                title="Drop Location"
                description={rideData.drop.place}
              />
            </>
          )}
          {/* Show present location if rideStatus is "Accepted" */}
          {rideStatus === 'Accepted' && region && (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title="Your Location"
            />
          )}
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

      <View style={styles.bottomSheet}>
        <View style={styles.bottomDraggerView}>
          <BottomSheetPointer />
        </View>
        {{
          New: (
            <CustomerDetails
              onAcceptRide={acceptingRide}
              customerName={ride.name}
              distance="23"
              fromAddress={ride.drop.place}
              price={ride.rate}
              toAddress={ride.pick.place}
            />
          ),
          PreFinish: (
            <DestinationReachedCard
              paymentStatus={rideData.payment_status}
              price={rideData.rate}
              onFinishRide={handleFinishRide}
            />
          ),
          Started: (
            <PaymentCard
              onPressFinishRide={handlePreFinishRide}
              name={ride.name}
              price={ride.rate}
            />
          ),
          Accepted: (
            <RiderStartedCard
              locationName={ride.pick.place}
              price={ride.rate}
              distanceRemaining="5 km"
              onStartRide={handleStartRide}
              onCancelRide={handleCancelRide}
            />
          ),
        }[rideStatus] || null}
      </View>
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
