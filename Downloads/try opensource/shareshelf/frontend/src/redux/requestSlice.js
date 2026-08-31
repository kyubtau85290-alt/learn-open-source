import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myRequests: [],
  incomingRequests: [],
  currentRequest: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRequestsSuccess: (state, action) => {
      state.loading = false;
      const { role, requests, pagination } = action.payload;
      if (role === 'borrower') {
        state.myRequests = requests;
      } else if (role === 'owner') {
        state.incomingRequests = requests;
      }
      state.pagination = pagination;
    },
    fetchRequestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },
    addRequest: (state, action) => {
      state.myRequests.unshift(action.payload);
    },
    updateRequest: (state, action) => {
      const request = action.payload;
      const myIndex = state.myRequests.findIndex((r) => r._id === request._id);
      if (myIndex !== -1) {
        state.myRequests[myIndex] = request;
      }
      const incomingIndex = state.incomingRequests.findIndex((r) => r._id === request._id);
      if (incomingIndex !== -1) {
        state.incomingRequests[incomingIndex] = request;
      }
    },
    removeRequest: (state, action) => {
      state.myRequests = state.myRequests.filter((r) => r._id !== action.payload);
    },
  },
});

export const {
  fetchRequestsStart,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  setCurrentRequest,
  addRequest,
  updateRequest,
  removeRequest,
} = requestSlice.actions;

export default requestSlice.reducer;
