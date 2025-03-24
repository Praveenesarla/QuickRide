import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, fonts} from '../../constants/theme';
import responsive from '../../utils/responsive';

const PaymentCard = ({
  name = 'Gun Park',
  km = '4.6 km',
  price = '₹74',
  onPressCash = () => {},
  onPressQR = () => {},
}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleSelect = type => {
    setSelectedPayment(type);
    if (type === 'Cash') {
      onPressCash();
    } else {
      onPressQR();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rider Started</Text>
        <View style={styles.kmContainer}>
          <Text style={styles.kmText}>{km}</Text>
          <Text style={styles.remainsText}>Remains</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.priceText}>{price}</Text>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedPayment === 'Cash' && styles.selectedButton,
            ]}
            onPress={() => handleSelect('Cash')}>
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    selectedPayment === 'Cash' ? colors.white : colors.black,
                },
              ]}>
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedPayment === 'QR' && styles.selectedButton,
            ]}
            onPress={() => handleSelect('QR')}>
            <Text
              style={[
                styles.buttonText,
                {color: selectedPayment === 'QR' ? colors.white : colors.black},
              ]}>
              QR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    width: '100%',
    height: responsive.height(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: responsive.width(1),
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(5),
  },
  headerText: {
    fontFamily: fonts.SemiBold,
    color: colors.black,
    fontSize: responsive.fontSize(14),
  },
  kmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kmText: {
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(12),
    color: colors.black,
  },
  remainsText: {
    fontFamily: fonts.Regular,
    fontSize: responsive.fontSize(10),
    color: colors.black,
  },
  content: {
    padding: responsive.padding(10),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: responsive.padding(16),
  },
  nameText: {
    fontFamily: fonts.SemiBold,
    color: colors.black,
    fontSize: responsive.fontSize(16),
  },
  priceText: {
    color: colors.black,
    fontFamily: fonts.Bold,
    fontSize: responsive.fontSize(16),
  },
  button: {
    width: '47%',
    borderRadius: responsive.borderRadius(4),
    borderWidth: responsive.width(1),
    borderColor: colors.red,
    height: responsive.height(34),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: responsive.fontSize(14),
    fontFamily: fonts.Bold,
  },
  selectedButton: {
    backgroundColor: colors.red,
  },
});

export default PaymentCard;
