import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserDetails, fetchUserByPhone, getUserBill, raiseBill} from '../api';
import firestore from '@react-native-firebase/firestore';
import BillCard from '../components/ServicePartner/BillCard';
import {colors, fonts} from '../constants/theme';
import responsive from '../utils/responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import QRCode from 'react-native-qrcode-svg';

const ServiceProviderService = () => {
  const [transactions, setTransactions] = useState();
  const [billId, setBillId] = useState('Q12345');
  const [userDataDetails, setUserDataDetails] = useState();
  const [bills, setBills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    vehicleNumber: '',
    description: '',
    amount: '',
  });

  useEffect(() => {
    if (!userDataDetails?.uid) return;

    const billsCollectionRef = firestore()
      .collection('partners')
      .doc(userDataDetails?.uid)
      .collection('bills')
      .orderBy('timestamp', 'desc');

    const unsubscribe = billsCollectionRef.onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const billsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('bills', bills);
        setBills(billsList);
      } else {
        setBills([]);
      }
    });

    return () => unsubscribe();
  }, [userDataDetails?.uid]);

  useEffect(() => {
    userDetails();
  }, []);

  const userDetails = async () => {
    try {
      const auth = await getData();
      const response = await getUserDetails(auth.uid, 'partner');
      console.log('userDetials', response.data);
      setUserDataDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('auth');
      return JSON.parse(value);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const checkingUserExists = async () => {
    if (
      !formData.phone ||
      !formData.amount ||
      !formData.description ||
      formData.phone.length !== 10
    ) {
      Toast.show({
        type: 'error',
        text1: 'All fields are Required',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }

    const phone = formData.phone;
    try {
      const response = await getUserBill(phone);
      if (response.success) {
        addingBill(
          response.data.phone,
          response.data.name,
          response.data.vehicle,
          response.data.user_id,
        );
      } else {
        setModalVisible(false);
        Toast.show({
          type: 'error',
          text1: 'User Not Exist',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const addingBill = async (phone, name, vehicle, userId) => {
    const data = {
      phone: phone,
      name: name,
      vehicle: vehicle,
      description: formData.description,
      user_id: userId,
      amount: parseInt(formData.amount),
      uid: userDataDetails.uid,
    };
    try {
      const response = await raiseBill(data);
      setBillId(response.billId);
      console.log('response', response);
      setQrVisible(true);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={bills}
        renderItem={({item}) => <BillCard item={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              resizeMode="contain"
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.emptyText}>No Bills Available</Text>
            <Text style={styles.emptyText}>0 Bills Available</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: responsive.margin(10),
          }}>
          <Icon name="plus" size={35} color="black" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={qrVisible}
        onRequestClose={() => setQrVisible(false)}>
        <View style={styles.qrModalContainer}>
          <View style={styles.qrModalContent}>
            <QRCode
              value={`https://quickserviceindia.co.in/bill/${userDataDetails?.uid}/${billId}`}
              size={200}
              backgroundColor="white"
              color="black"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                paddingVertical: responsive.padding(30),
              }}>
              <TouchableOpacity
                onPress={() => setQrVisible(false)}
                style={styles.cancelButton}>
                <Text style={styles.qrButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.cancelButton}>
                <Text style={styles.qrButtonText}>Mark as Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}>
            <Text style={styles.modalTitle}>Raise a Bill</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={text => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />
              {loading && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                editable={false}
              />
              <Text style={styles.label}>Vehicle Number</Text>
              <TextInput
                editable={false}
                style={styles.input}
                value={formData.vehicleNumber}
                onChangeText={text => handleInputChange('vehicleNumber', text)}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={text => handleInputChange('description', text)}
                multiline
              />
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={formData.amount}
                onChangeText={text => handleInputChange('amount', text)}
                keyboardType="numeric"
              />
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={checkingUserExists}>
                <Text style={styles.submitButtonText}>Raise Bill</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default ServiceProviderService;

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginVertical: responsive.margin(300),
  },
  logo: {
    width: 300,
    height: 100,
  },
  emptyText: {
    fontFamily: fonts.Bold,
    color: colors.red,
    fontSize: responsive.fontSize(20),
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.darkGray,
    marginTop: 10,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  submitButton: {
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  qrButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  qrModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qrModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  qrModalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
