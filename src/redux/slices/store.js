import {configureStore} from '@reduxjs/toolkit';
import orderReducer from './orderSlice.js';

const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});

export default store;
