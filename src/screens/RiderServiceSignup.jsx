import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import responsive from '../utils/responsive';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {colors} from '../constants/theme';
import {OtpInput} from 'react-native-otp-entry';
import {ScrollView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';

import {
  getRegisterRiderCustomToken,
  sendRegisterRideOtp,
  verifyOtp,
} from '../api';
import {useUser} from '../context/UserContext';

const RiderServiceSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpData, setOtpData] = useState();
  const [validTime, setValidTime] = useState(60);
  const navigation = useNavigation();
  const [vehicleType, setVehicleType] = useState(null);
  const [dlImage, setDlImage] = useState(null);
  const [rcImage, setRcImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [riderImage, setRiderImage] = useState(null);
  const [otpFlow, setOtpFlow] = useState('Send Otp');
  const {setUser} = useUser();

  const pickImage = async (setImage, imageName) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        const selectedImage = result.assets[0];

        if (!selectedImage.uri || !selectedImage.type) {
          console.error('Invalid Image Format:', selectedImage);
          return;
        }

        const base64String = await RNFS.readFile(selectedImage.uri, 'base64');

        const imageData = {
          name: imageName || selectedImage.fileName || 'image.jpg',
          file: base64String,
          type: selectedImage.type,
        };

        setImage(imageData);
        console.log('Image Set:', imageData);
      } else {
        console.warn('No Image Selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const data = [
    {label: 'Bike', value: 'Bike'},
    {label: 'Auto', value: 'Auto'},
    {label: 'Mini', value: 'Mini'},
    {label: 'Sedan', value: 'Sedan'},
    {label: 'XL', value: 'XL'},
    {label: 'Parcel Bike', value: 'Parcel Bike'},
    {label: '3 Wheeler Eclectric', value: '3 Wheeler Eclectric'},
    {label: '3 Wheeler', value: '3 Wheeler'},
    {label: 'Tata Ace', value: 'Tata Ace'},
    {label: 'Pickup 8ft', value: 'Pickup 8ft'},
    {label: 'Eeco', value: 'Eeco'},
    {label: 'Pickup 18ft', value: 'Pickup 18ft'},
  ];

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === vehicleType && ( // Use vehicleType instead of value
          <AntDesign
            style={styles.icon}
            color={colors.red}
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  // Function to handle user registration
  // const handleSignup = async () => {
  //   try {
  //     const confirmation = await auth().signInWithPhoneNumber(
  //       `+91${phoneNumber}`,
  //     );
  //     setConfirm(confirmation);
  //     startTimer();
  //   } catch (error) {
  //     console.error('Error sending OTP:', error);
  //   }
  // };

  const sendingOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      console.log('Enter a valid 10-digit phone number.');
      return;
    }
    try {
      const response = await sendRegisterRideOtp(phoneNumber);
      console.log('OTP Sent Successfully:', response);
      setOtpFlow('Verify Otp');
      setOtpData(response);
    } catch (error) {
      console.log(
        'Failed to send OTP:',
        error?.response?.data || error.message,
      );
    }
  };

  const verifyingOtp = async () => {
    try {
      console.log('otpp', otpData?.data?.orderId);
      const response = await verifyOtp(
        phoneNumber,
        otpData?.data?.orderId,
        otp,
      );
      console.log(response);
      setOtpFlow('Create Profile');
    } catch (error) {
      console.log('verify Otp erorr', error);
    }
  };

  const creatingProfile = async () => {
    console.log('Profile Create Started');

    try {
      if (
        !phoneNumber ||
        !name ||
        !vehicleNumber ||
        !vehicleName ||
        !vehicleType ||
        !dlImage ||
        !rcImage ||
        !panImage ||
        !riderImage
      ) {
        console.error('All required fields must be provided');
        return;
      }

      if (
        !dlImage.file ||
        !rcImage.file ||
        !panImage.file ||
        !riderImage.file
      ) {
        console.error('One or more images are missing a valid Base64 string');
        return;
      }

      const imagesData = {
        dlImage: JSON.stringify(dlImage),
        rcImage: JSON.stringify(rcImage),
        panImage: JSON.stringify(panImage),
        riderImage: JSON.stringify(riderImage),
      };

      const requestData = {
        phoneNumber,
        name,
        email, // Optional
        vehicleType,
        vehicleName,
        vehicleNumber,
        ...imagesData,
        address, // Optional
        referralCode, // Optional
      };

      console.log('Final Request Data:', requestData);

      console.log('Calling API...');
      const response = await getRegisterRiderCustomToken(requestData);

      console.log('API Response:', response);

      if (response?.data?.token) {
        await signInWithToken(response.data.token);
      } else {
        console.error('API Response Missing Token:', response);
      }
    } catch (error) {
      console.error('API Call Failed:', error.response?.data || error.message);
    }
  };

  async function signInWithToken(customToken) {
    try {
      const userCredential = await auth().signInWithCustomToken(customToken);
      console.log('User signed in:', userCredential.user);
      console.log('User data stored in AsyncStorage');

      setUser(userCredential.user);

      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  // Timer function for OTP expiration
  const startTimer = () => {
    setValidTime(60);
    const timer = setInterval(() => {
      setValidTime(prev => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require('../assets/login.png')}
        resizeMode="cover"
        style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create a Profile</Text>

        {/* Name Input */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Full Name"
          placeholderTextColor="grey"
          value={name}
          onChangeText={setName}
        />

        {/* Email Input */}
        <Text style={styles.label}>Email ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email ID"
          placeholderTextColor="grey"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Phone Number Input */}
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter Your Phone Number"
            placeholderTextColor="grey"
            keyboardType="phone-pad"
            value={phoneNumber}
            maxLength={10}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* OTP Input - Only Show After Sending OTP */}
        {otpFlow === 'Verify Otp' && (
          <>
            <Text style={styles.label}>OTP</Text>
            <OtpInput
              numberOfDigits={6}
              onTextChange={text => setOtp(text)}
              theme={{
                pinCodeContainerStyle: styles.pinCodeContainerStyle,
                containerStyle: styles.pinContainer,
              }}
            />
            <View style={{flexDirection: 'row', marginRight: 'auto', gap: 4}}>
              <TouchableOpacity onPress={() => {}} disabled={validTime > 0}>
                <Text
                  style={[
                    styles.resendText,
                    validTime === 0
                      ? styles.resendActive
                      : styles.resendDisabled,
                  ]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
              <Text style={styles.validTime}> Valid: {validTime}s</Text>
            </View>
          </>
        )}

        {/* Vehicle Number Input */}
        <Text style={styles.label}>Vehicle Type</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Vehicle Type"
          searchPlaceholder="Search..."
          value={vehicleType}
          onChange={item => {
            setVehicleType(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={colors.red}
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
        />

        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Name"
          placeholderTextColor="grey"
          value={vehicleName}
          onChangeText={setVehicleName}
        />

        <Text style={styles.label}>Vehicle Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Number"
          placeholderTextColor="grey"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />

        <Text style={styles.label}>Upload DL Image</Text>
        <TouchableOpacity
          onPress={() => pickImage(setDlImage)}
          style={styles.imageUploadButton}>
          {dlImage ? (
            <Ionicons
              style={styles.icon}
              color={colors.red}
              name="checkmark-circle"
              size={60}
            />
          ) : (
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon2}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Upload RC Image</Text>
        <TouchableOpacity
          onPress={() => pickImage(setRcImage)}
          style={styles.imageUploadButton}>
          {rcImage ? (
            <Ionicons
              style={styles.icon}
              color={colors.red}
              name="checkmark-circle"
              size={60}
            />
          ) : (
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon2}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.label}>Upload Pan Card</Text>
        <TouchableOpacity
          onPress={() => pickImage(setPanImage)}
          style={styles.imageUploadButton}>
          {panImage ? (
            <Ionicons
              style={styles.icon}
              color={colors.red}
              name="checkmark-circle"
              size={60}
            />
          ) : (
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon2}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.label}>Upload Selfie</Text>
        <TouchableOpacity
          onPress={() => pickImage(setRiderImage)}
          style={styles.imageUploadButton}>
          {riderImage ? (
            <Ionicons
              style={styles.icon}
              color={colors.red}
              name="checkmark-circle"
              size={60}
            />
          ) : (
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon2}
            />
          )}
        </TouchableOpacity>

        {/* Address Input */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Type here..."
          placeholderTextColor="grey"
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          value={address}
          onChangeText={setAddress}
        />

        {/* Referral Code Input */}
        <Text style={styles.label}>Referral Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Referral Code"
          placeholderTextColor="grey"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        {/* Signup Button */}
        <TouchableOpacity
          onPress={
            otpFlow === 'Send Otp'
              ? sendingOtp
              : otpFlow === 'Verify Otp'
              ? verifyingOtp
              : otpFlow === 'Create Profile'
              ? creatingProfile
              : undefined
          }
          style={styles.signupButton}>
          <Text style={styles.buttonText}>{otpFlow}</Text>
        </TouchableOpacity>

        {/* Navigation to Login */}
        <View style={styles.loginContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}> Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default RiderServiceSignup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: responsive.padding(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: responsive.padding(20),
  },
  logo: {
    width: '50%',
    height: responsive.height(100),
  },
  title: {
    fontSize: responsive.fontSize(34),
    width: '100%',
    fontWeight: '800',
    color: '#000',
    marginBottom: responsive.margin(20),
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: responsive.padding(16),
    fontWeight: 'bold',
    color: '#B82929',
    marginBottom: responsive.margin(6),
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: responsive.width(1),
    borderRadius: responsive.borderRadius(10),
    borderColor: '#B82929',
    paddingLeft: responsive.padding(15),
    fontSize: responsive.fontSize(14),
    marginBottom: responsive.margin(15),
    color: '#000',
    backgroundColor: '#B8292929',
  },
  phoneContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderWidth: responsive.width(1),
    borderColor: '#B82929',
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(15),
  },
  countryCode: {
    backgroundColor: '#B82929',
    color: '#fff',
    paddingHorizontal: responsive.padding(15),
    paddingVertical: responsive.padding(10),
    borderTopLeftRadius: responsive.borderRadius(10),
    borderBottomLeftRadius: responsive.borderRadius(10),
    fontSize: responsive.fontSize(14),
  },
  phoneInput: {
    height: responsive.height(40),
    width: '85%',
    paddingLeft: responsive.padding(12),
    fontSize: responsive.fontSize(14),
    color: '#000',
    backgroundColor: '#B8292929',
    borderTopRightRadius: responsive.borderRadius(10),
    borderBottomRightRadius: responsive.borderRadius(10),
  },
  signupButton: {
    backgroundColor: '#B82929',
    width: '100%',
    padding: responsive.padding(8),
    borderRadius: responsive.borderRadius(10),
    marginTop: responsive.margin(20),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: responsive.margin(7),
  },
  loginText: {
    color: '#B82929',
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: responsive.width(2),
    borderColor: colors.red,
    width: '100%',
    marginVertical: responsive.margin(2),
    height: responsive.height(40),
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: responsive.margin(5),
  },
  item: {
    padding: responsive.padding(17),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: responsive.fontSize(16),
  },
  placeholderStyle: {
    fontSize: responsive.fontSize(16),
    color: colors.red,
  },
  selectedTextStyle: {
    fontSize: responsive.fontSize(16),
  },
  iconStyle: {
    width: responsive.width(20),
    height: responsive.height(20),
  },
  inputSearchStyle: {
    height: responsive.height(40),
    fontSize: responsive.fontSize(16),
  },
  imageUploadButton: {
    width: '100%',
    height: responsive.height(100),
    backgroundColor: '#B8292929',
    borderRadius: responsive.borderRadius(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: responsive.borderRadius(10),
  },
  icon2: {
    width: responsive.width(50),
    height: responsive.height(50),
    resizeMode: 'contain',
  },
  textArea: {
    width: '100%',
    height: responsive.height(120),
    borderWidth: responsive.width(1),
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(10),
    fontSize: responsive.fontSize(16),
    textAlignVertical: 'top',
    borderColor: '#B82929',
    backgroundColor: '#B8292929',
  },
});
