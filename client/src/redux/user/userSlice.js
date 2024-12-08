import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState, 
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => { // Fixed typo in reducer name
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart :(state) =>{
      state.loading = true;
    },
    updateUserSuccess : (state,action) =>{
      state.currentUser = action.payload;
      state.loading =false;
      state.error = null;
    },
    updateUserFailure : (state,action)=>{
      state.error = action.payload;
      state.loading =false;
    }
  },
});

export const { signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess } = userSlice.actions; // Fixed typo in action export

export default userSlice.reducer;
