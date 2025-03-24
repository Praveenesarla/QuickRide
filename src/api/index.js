import {APIClient} from './axios.config';

export const sendRideOtp = async phone => {
  try {
    const response = await APIClient.get('/sendRideOtp', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const sendRegisterRideOtp = async phone => {
  try {
    const response = await APIClient.get('/sendRegisterRideOtp', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOtp = async (phone, orderId, otp) => {
  try {
    console.log('Sending OTP verification request:', {phone, orderId, otp});
    const response = await APIClient.get('/verifyOtp', {
      params: {phoneNumber: phone, orderId, otp},
    });
    console.log('OTP verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error Verifying OTP:', error?.response?.data || error);
    throw error;
  }
};

export const getCustomToken = async phone => {
  try {
    const response = await APIClient.get('/getCustomToken', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.error('Error get Custom Token:', error);
    throw error;
  }
};

export const getRegisterRiderCustomToken = async data => {
  try {
    console.log('API Payload:', JSON.stringify(data, null, 2));

    const response = await APIClient.post(
      '/getRegisterRiderCustomToken',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getRegisterServiceCustomToken = async data => {
  console.log('passed Data', data);
  try {
    const response = await APIClient.post(
      '/getRegisterServiceCustomToken',
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting Register Custom Token:', error);
    throw error;
  }
};

export const getUserDetails = async (uid, type) => {
  console.log(uid, type);
  try {
    const response = await APIClient.get('/getUserDetails', {
      params: {uid, type},
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching user details:', error);
    throw error;
  }
};

export const userGetServices = async data => {
  try {
    const response = await APIClient.post('/listServiceCenters', data);
    return response.data;
  } catch (error) {
    console.error('Error fething the services', error);
  }
};

export const riderPaymentSuccess = async data => {
  console.log('data', data);
  try {
    const response = await APIClient.get('/rider-payment-success', {
      params: {data},
    });
    return response.data;
  } catch (error) {
    console.error('Error in payment success:', error);
    throw error;
  }
};

export const createOrder = async data => {
  console.log('recieve Data', data);
  try {
    const response = await APIClient.post('/createOrder', data);
    return response.data;
  } catch (error) {
    console.log('Error creating order:', error);
    throw error;
  }
};

export const acceptRide = async data => {
  console.log('passed data', data);
  try {
    const response = await APIClient.post('/acceptRide', data);
    return response.data;
  } catch (error) {
    console.log('error while accept', error.message);
  }
};
