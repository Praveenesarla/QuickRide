import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import responsive from '../utils/responsive';
import {OtpInput} from 'react-native-otp-entry';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';

import {
  getRegisterServiceCustomToken,
  sendRegisterRideOtp,
  verifyOtp,
} from '../api';
import {useUser} from '../context/UserContext';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [serviceCenterName, setServiceCenterName] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstn, setGstn] = useState('');
  const [type, setType] = useState('');
  const [googleMapLink, setGoogleMapLink] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [gstnCertificate, setGstnCertificateImage] = useState('');
  const [panImage, setPancardImage] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [mapLink, setMapLink] = useState('');
  const [otpData, setOtpData] = useState();
  const [otp, setOtp] = useState('');
  const [validTime, setValidTime] = useState(60);
  const [otpFlow, setOtpFlow] = useState('Send Otp');
  const navigation = useNavigation();
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

  const creatingProfile = async () => {
    console.log('Profile Creation Started');

    try {
      if (
        !phoneNumber ||
        !name ||
        !type ||
        !gstnCertificate ||
        !panImage ||
        !address ||
        !pincode
      ) {
        console.error('All required fields must be provided');
        return;
      }

      if (!gstnCertificate.file || !panImage.file) {
        console.error(
          'One or more required images are missing a valid Base64 string',
        );
        return;
      }

      const imagesData = {
        gstnCertificate: JSON.stringify(gstnCertificate),
        panImage: JSON.stringify(panImage),
      };

      const requestData = {
        phoneNumber, // Required
        name, // Required
        type, // Required
        address, // Required
        pincode, // Required
        gstn, // Optional
        mapLink, // Optional
        referralCode, // Optional
        email, // Optional
        ...imagesData,
      };

      console.log('Final Request Data:', requestData);

      console.log('Calling API...');
      const response = await getRegisterServiceCustomToken(requestData);

      console.log('API Response:', response);

      await signInWithToken(response?.data?.token);

      console.error('API Response Missing Token:', response);
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
    <ScrollView>
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
        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Shop Name"
          placeholderTextColor="grey"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Service Center Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Car Service Center"
          placeholderTextColor="grey"
          value={type}
          onChangeText={setType}
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

        <Text style={styles.label}>GSTN Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter GSTN Number"
          placeholderTextColor="grey"
          keyboardType="email-address"
          value={gstn}
          onChangeText={setGstn}
        />

        {/* Vehicle Number Input */}

        {/* Address Input */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter Address"
          placeholderTextColor="grey"
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          value={address}
          onChangeText={setAddress}
        />

        {/* Referral Code Input */}
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the Pincode"
          placeholderTextColor="grey"
          value={pincode}
          onChangeText={setPincode}
        />
        <Text style={styles.label}>Google Map Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Google Map Link"
          placeholderTextColor="grey"
          value={mapLink}
          onChangeText={setMapLink}
        />

        <Text style={styles.label}>Upload GSTN Certificate</Text>
        <TouchableOpacity
          onPress={() => pickImage(setGstnCertificateImage)}
          style={styles.imageUploadButton}>
          {gstnCertificate ? (
            <Text>Uploaded</Text>
          ) : (
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon2}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Upload PanCard</Text>
        <TouchableOpacity
          onPress={() => pickImage(setPancardImage)}
          style={styles.imageUploadButton}>
          {panImage ? (
            <Text>Uploaded</Text>
          ) : (
            <Image
              source={require('../assets/uploadImage.png')}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Referral Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Refrral Code"
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

export default SignupScreen;

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
    height: 100,
  },
  title: {
    fontSize: 34,
    width: '100%',
    fontWeight: '800',
    color: '#000',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B82929',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#B82929',
    paddingLeft: 15,
    fontSize: 14,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#B8292929',
  },
  phoneContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B82929',
    borderRadius: 10,
    marginBottom: 15,
  },
  countryCode: {
    backgroundColor: '#B82929',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    fontSize: 14,
  },
  phoneInput: {
    height: 40,
    width: '85%',
    paddingLeft: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#B8292929',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  signupButton: {
    backgroundColor: '#B82929',
    width: '100%',
    padding: 8,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 7,
  },
  loginText: {
    color: '#B82929',
    fontWeight: 'bold',
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
  icon: {
    width: responsive.width(50),
    height: responsive.height(50),
  },
});
