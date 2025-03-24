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
import {useNavigation} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import responsive from '../utils/responsive';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState('');
  const [validTime, setValidTime] = useState(60);
  const navigation = useNavigation();

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

  const handleSignup = async () => {};

  // Function to verify OTP
  const confirmCode = async () => {
    try {
      await confirm.confirm(otp);
      console.log('Phone authentication successful');
    } catch (error) {
      console.error('Invalid OTP:', error);
    }
  };

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
      {confirm && (
        <>
          <Text style={styles.label}>OTP</Text>
          <OTPInputView
            style={styles.otpContainer}
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={styles.otpBox}
            onCodeChanged={setOtp}
          />
          <View style={styles.resendContainer}>
            <TouchableOpacity onPress={handleSignup} disabled={validTime > 0}>
              <Text
                style={[
                  styles.resendText,
                  validTime === 0 ? styles.resendActive : styles.resendDisabled,
                ]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
            <Text style={styles.validTime}> Valid: {validTime}s</Text>
          </View>
        </>
      )}

      {/* Vehicle Number Input */}
      <Text style={styles.label}>Vehicle Number (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Vehicle Number"
        placeholderTextColor="grey"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      {/* Address Input */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Address"
        placeholderTextColor="grey"
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
        style={styles.signupButton}
        onPress={confirm ? confirmCode : handleSignup}>
        <Text style={styles.buttonText}>
          {confirm ? 'Verify OTP' : 'Create Profile'}
        </Text>
      </TouchableOpacity>

      {/* Navigation to Login */}
      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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
    paddingVertical: 0,
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
    width: '90%',
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
});
