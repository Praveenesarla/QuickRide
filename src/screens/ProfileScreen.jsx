import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';
import logo from '../assets/logo.png';
import responsive from '../utils/responsive';
import {deleteAccount, getUserDetails, saveUserDetails} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../context/UserContext';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'Vraj Parikh',
    email: 'v@gmail.com',
    phone: '723468245',
    bank: 'BOB Bank',
    address: '42475 Duke Street, Lake Odastad 42944',
    memberId: 'Q274749P892',
    vehicle: 'Honda',
    refer: '',
    orders: 2,
  });
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const {setUser} = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    userDetails();
  }, []);

  const updateProfile = async data => {
    try {
      const auth = await getData();
      const res = await saveUserDetails({uid: auth.uid, ...data});
      console.log('Profile updated successfully:', res);
      await userDetails();
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  const handleEdit = field => {
    setSelectedField(field);
    setEditValue(userData?.[field] || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    const updatedField = {[selectedField]: editValue};

    await updateProfile(updatedField);

    setUserData(prev => ({...prev, ...updatedField}));

    setModalVisible(false);
  };

  const userAccountDelete = async () => {
    try {
      const auth = await getData();
      const response = await deleteAccount(auth.uid, 'rider');
      navigation.navigate();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const userDetails = async () => {
    try {
      const auth = await getData();
      const response = await getUserDetails(auth.uid, 'rider');
      console.log('userDetails', response.data);
      setUserData(response.data);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('auth');
      setUser(null);

      console.log(' User logged out');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.sftcdn.net/images/t_app-icon-m/p/d0659adc-964d-4eea-8e7e-18f9678d79ac/2936336398/cool-profile-pictures-for-boys-logo',
          }}
          style={styles.profileLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>{userData?.name}</Text>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Personal Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <InfoRow
          label="Name"
          value={userData?.name}
          onPress={() => handleEdit('name')}
        />
        <InfoRow
          label="Email"
          value={userData?.email}
          onPress={() => handleEdit('email')}
        />
        <InfoRow
          label="Phone Number"
          value={userData?.phone}
          // onPress={() => handleEdit('phone')}
        />
        <InfoRow
          label="Bank A/C"
          value={userData?.bank}
          onPress={() => handleEdit('bank')}
        />
        <InfoRow
          label="Address"
          value={userData?.address}
          onPress={() => handleEdit('address')}
        />
        <InfoRow
          label="Ride History"
          value={userInfo?.orders}
          onPress={() => navigation.navigate('history')}
        />
      </View>

      {/* Some Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Some information</Text>
        <InfoRow
          label="Member ID"
          value={userData?.memberId}
          onPress={() => handleEdit('memberId')}
        />
        <InfoRow
          label="Vehicle Name"
          value={userData?.vehicle}
          onPress={() => handleEdit('vehicle')}
        />
        <InfoRow
          label="Refer and Earn"
          value={userData?.refer}
          onPress={() => handleEdit('refer')}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            {
              padding: 10,
              height: responsive.height(40),
              justifyContent: 'center',
            },
          ]}
          activeOpacity={0.6}
          onPress={userAccountDelete}>
          <View style={styles.buttonContent}>
            <Icon name="trash-can-outline" size={14} color="red" />
            <Text style={styles.buttonLabel}>Delete Account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              padding: 10,
              height: responsive.height(40),
              justifyContent: 'center',
            },
          ]}
          activeOpacity={0.6}
          onPress={handleLogout}>
          <View style={styles.buttonContent}>
            <Icon name="logout" size={14} color="red" />
            <Text style={styles.buttonLabel}>Log out</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeading}>Edit {selectedField}</Text>

            <TextInput
              style={styles.inputField}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="Enter new value"
              placeholderTextColor="#aaa"
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.btnLabel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.saveBtn]}
                onPress={handleSave}>
                <Text style={styles.btnLabel}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable Component for Info Rows
const InfoRow = ({label, value, onPress}) => (
  <TouchableOpacity style={styles.infoRow} onPress={onPress}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.infoValue}>{value}</Text>
      <Icon name="chevron-right" size={20} color="gray" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F8F8'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: responsive.padding(10),
  },
  headerText: {
    fontSize: responsive.fontSize(20),
    fontFamily: 'Outfit-SemiBold',
    width: '50%',
    color: '#000000',
  },
  logo: {height: responsive.height(40), width: responsive.width(120)},
  profileLogo: {
    height: responsive.height(40),
    width: responsive.width(40),
    borderRadius: responsive.borderRadius(50),
  },
  infoContainer: {
    padding: responsive.padding(16),
    backgroundColor: '#FFF',
    marginBottom: responsive.margin(10),
  },
  sectionTitle: {
    fontSize: responsive.fontSize(16),
    fontFamily: 'Outfit-SemiBold',
    marginBottom: responsive.margin(8),
    color: '#000000',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsive.padding(12),
    borderBottomWidth: responsive.width(1),
    borderBottomColor: '#EAEAEA',
  },
  infoLabel: {
    fontSize: responsive.fontSize(14),
    color: '#000000',
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Outfit-SemiBold',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  infoValue: {
    fontSize: responsive.fontSize(14),
    color: '#000000',
    textAlign: 'right',
    fontFamily: 'Outfit-Light',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsive.padding(10),
    marginTop: responsive.margin(20),
  },
  deleteButton: {
    borderColor: 'red',
    borderWidth: responsive.width(1),
    borderRadius: responsive.borderRadius(10),
  },
  logoutButton: {
    borderColor: 'red',
    borderWidth: responsive.width(1),
    borderRadius: responsive.borderRadius(10),
  },
  buttonLabel: {
    fontSize: responsive.fontSize(12),
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: responsive.padding(20),
    borderRadius: responsive.borderRadius(10),
    width: '80%',
  },
  modalTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    marginBottom: responsive.margin(10),
  },
  input: {
    borderWidth: responsive.width(1),
    borderColor: '#ccc',
    borderRadius: responsive.borderRadius(5),
    padding: responsive.padding(10),
    marginBottom: responsive.margin(20),
  },
  modalButtonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  cancelButton: {backgroundColor: 'gray', marginRight: responsive.margin(10)},
  saveButton: {backgroundColor: 'blue'},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#B82929',
    marginBottom: 15,
  },
  inputField: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#B82929',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
  },
  saveBtn: {
    backgroundColor: '#B82929',
  },
  btnLabel: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Outfit-Medium',
  },
});

export default ProfileScreen;
