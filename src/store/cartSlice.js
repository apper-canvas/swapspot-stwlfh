import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isOpen: false
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.items.find(item => item.id === action.payload.id);
      
      if (itemExists) {
        // If item already exists, increment quantity
        itemExists.quantity += 1;
      } else {
        // Otherwise add new item with quantity 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, toggleCart } = cartSlice.actions;

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartIsOpen = state => state.cart.isOpen;
export const selectCartItemCount = state => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = state => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;