import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        item => item.name === action.payload.name,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({...action.payload, quantity: 1});
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.name !== action.payload);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.name === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.name === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            item => item.name !== action.payload,
          );
        }
      }
    },
  },
});

export const {addItem, removeItem, incrementQuantity, decrementQuantity} =
  orderSlice.actions;
export default orderSlice.reducer;
