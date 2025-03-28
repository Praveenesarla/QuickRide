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

export const startRide = async rideId => {
  console.log('passed Data', rideId);
  try {
    const response = await APIClient.get('/startRide', {
      params: {rideId},
    });
    return response.data;
  } catch (error) {
    console.log('while start ride Error', error);
  }
};

export const cancelRide = async data => {
  console.log('passed Data for cancelRide', data);
  try {
    const response = await APIClient.post('/cancelRideByRider', data);
    return response.data;
  } catch (error) {
    console.log('error while canceling error', error.message);
  }
};

export const finishRide = async rideId => {
  console.log('passed Data', rideId);
  try {
    const response = await APIClient.get('/finishRide', {
      params: {rideId},
    });
    return response.data;
  } catch (error) {
    console.log('while start ride Error', error);
  }
};

export const changeRiderLocation = async data => {
  console.log('passed Data for cancelRide', data);
  try {
    const response = await APIClient.post('/changeRiderLocation', data);
    console.log('rider location updated', response.data);
    return response.data;
  } catch (error) {
    console.log('error while canceling error', error.message);
  }
};

export const raiseBill = async data => {
  console.log('Psseed data for raised bill', data);
  try {
    const response = await APIClient.post('/addBill', data);
    console.log('bill raised sucess', response.data);
    return response.data;
  } catch (error) {
    console.log('error while raising the bill', error.message);
  }
};

export const getUserBill = async phone => {
  console.log('passed Data', phone);
  try {
    const response = await APIClient.get('/checkUserForBill', {
      params: {phone},
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const raiseWithdrawel = async uid => {
  console.log('Passed Data:', uid);

  try {
    const response = await APIClient.get('/raiseWithdrawal', {
      params: {uid},
    });
    return response.data;
  } catch (error) {
    console.error('Error while raising withdrawal:', error);
    return error;
  }
};
