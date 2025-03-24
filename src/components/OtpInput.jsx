import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import responsive from '../utils/responsive';
import {colors} from '../constants/theme';

const OTPInput = ({length = 6, onComplete}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef(Array(length).fill(null));

  const handleChangeText = (text, index) => {
    if (/^\d$/.test(text)) {
      // Allow only numbers
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input
      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      // Call onComplete when all fields are filled
      if (newOtp.join('').length === length && onComplete) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={ref => (inputsRef.current[index] = ref)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          value={otp[index]}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={event => handleKeyPress(event, index)}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  input: {
    color: 'white',
    width: responsive.width(45),
    height: responsive.height(45),
    borderWidth: responsive.width(1),
    borderRadius: responsive.borderRadius(8),
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: responsive.fontSize(20),
    marginHorizontal: responsive.margin(5),
    backgroundColor: '#B8292980',
  },
});

export default OTPInput;
