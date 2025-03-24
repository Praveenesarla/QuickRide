import {
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {userGetServices} from '../api';

const ServiceCenterList = () => {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [serviceList, setServiceList] = useState([]);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0';
  // Fetch service list when pincode is updated
  useEffect(() => {
    if (pincode) {
      getServicesList();
    }
  }, [pincode]);

  const getServicesList = async () => {
    try {
      const response = await userGetServices({pincode: '521325'});
      console.log('Service List:', response.data);
      setServiceList(response.data);
    } catch (error) {
      console.log('Error getting Services List:', error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getPincode = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log(`Location: ${latitude}, ${longitude}`);

        const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

        try {
          const response = await axios.get(googleMapsUrl);
          console.log('Google Maps API Response:', response.data);

          const addressComponents =
            response.data.results[0]?.address_components || [];
          const postalCode = addressComponents.find(comp =>
            comp.types.includes('postal_code'),
          );

          if (postalCode) {
            setPincode(postalCode.long_name);
          } else {
            console.warn(
              'Google API: Pincode not found, trying OpenStreetMap...',
            );
            fetchPincodeFromOpenStreetMap(latitude, longitude);
          }
        } catch (err) {
          console.error('Google Maps API Error:', err);
          fetchPincodeFromOpenStreetMap(latitude, longitude);
        }
      },
      error => {
        console.error('Geolocation Error:', error);
        setError(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Fallback: OpenStreetMap if Google fails
  const fetchPincodeFromOpenStreetMap = async (
    latitude: number,
    longitude: number,
  ) => {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
      const response = await axios.get(osmUrl);
      console.log('🌍 OpenStreetMap Response:', response.data);

      const postalCode = response.data.address?.postcode;
      if (postalCode) {
        setPincode(postalCode);
      } else {
        setError('Pincode not found from any source');
      }
    } catch (err) {
      console.error('❌ OpenStreetMap API Error:', err);
      setError('Failed to fetch pincode from any source');
    }
  };

  // Fetch Pincode on Component Mount
  useEffect(() => {
    getPincode();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header />
      <Text style={styles.pincodeText}>
        Pincode: {pincode || 'Fetching...'}
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        contentContainerStyle={{padding: 10, gap: 10}}
        data={serviceList} // ✅ Use fetched service list
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <ServiceCard service={item} />}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No services found</Text>
        }
      />
    </View>
  );
};

export default ServiceCenterList;

const styles = StyleSheet.create({
  pincodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
