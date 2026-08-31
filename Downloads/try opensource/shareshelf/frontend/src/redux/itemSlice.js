import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  myItems: [],
  currentItem: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    fetchItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchItemsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    },
    fetchItemsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMyItemsSuccess: (state, action) => {
      state.loading = false;
      state.myItems = action.payload.items;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    addItem: (state, action) => {
      state.myItems.unshift(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.myItems.findIndex((item) => item._id === action.payload._id);
      if (index !== -1) {
        state.myItems[index] = action.payload;
      }
    },
    removeItem: (state, action) => {
      state.myItems = state.myItems.filter((item) => item._id !== action.payload);
    },
  },
});

export const {
  fetchItemsStart,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchMyItemsSuccess,
  setCurrentItem,
  addItem,
  updateItem,
  removeItem,
} = itemSlice.actions;

export default itemSlice.reducer;
