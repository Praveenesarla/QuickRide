import React, {useEffect, useRef, useState} from 'react';
import {View, Text, PermissionsAndroid, Platform} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {changeRiderLocation} from '../../../api';

const LiveLocationMap = ({rideId}) => {
  const [region, setRegion] = useState(null);
  const watchId = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
          return;
        }
      }
      trackLocation();
    };

    requestLocationPermission();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const trackLocation = () => {
    console.log('trackLocation called');

    watchId.current = Geolocation.watchPosition(
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

        // Call API immediately on location update
        (async () => {
          try {
            await changeRiderLocation({latitude, longitude, rideId});
          } catch (error) {
            console.error('Error updating location (immediate call):', error);
          }
        })();
      },
      error => {
        console.warn('Error tracking location:', error);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );

    // API call every 10 seconds
    intervalRef.current = setInterval(async () => {
      if (region) {
        console.log(
          'Sending API update every 10 sec:',
          region.latitude,
          region.longitude,
        );
        try {
          await changeRiderLocation({
            latitude: region.latitude,
            longitude: region.longitude,
            rideId,
          });
        } catch (error) {
          console.error('Error updating location (interval):', error);
        }
      }
    }, 10000);
  };

  return (
    <View style={{flex: 1}}>
      {region ? (
        <MapView
          style={{flex: 1}}
          initialRegion={region}
          showsUserLocation
          followsUserLocation>
          <Marker coordinate={region} title="You are here" />
        </MapView>
      ) : (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          Fetching location...
        </Text>
      )}
    </View>
  );
};

export default LiveLocationMap;
