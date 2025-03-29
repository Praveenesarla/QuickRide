import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import axios from 'axios';

const RouteMap = ({pick, drop}) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = React.useRef(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAvG0ZP37y_tEwcQiLaHaCTLR9ceMHbnJ0';

  useEffect(() => {
    if (pick && drop) {
      fetchRoute();
    }
  }, [pick, drop]);

  const fetchRoute = async () => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${pick.latitude},${pick.longitude}&destination=${drop.latitude},${drop.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      const points = decodePolyline(
        response.data.routes[0].overview_polyline.points,
      );
      setRouteCoords(points);

      // Fit route within the screen
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(points, {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Function to decode Google Polyline (Converts encoded points to Lat/Lng)
  const decodePolyline = encoded => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({latitude: lat / 1e5, longitude: lng / 1e5});
    }
    return points;
  };

  return (
    <View style={{flex: 1}}>
      {routeCoords.length > 0 ? (
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          initialRegion={{
            latitude: pick.latitude,
            longitude: pick.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {/* Pickup Marker */}
          <Marker coordinate={pick} title="Pickup" pinColor="green" />

          {/* Drop-off Marker */}
          <Marker coordinate={drop} title="Drop-off" pinColor="red" />

          {/* Route Line */}
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="blue"
          />
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="blue" style={{marginTop: 20}} />
      )}
    </View>
  );
};

export default RouteMap;
