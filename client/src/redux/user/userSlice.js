import { createSlice } from "@reduxjs/toolkit";

const intialState={
    currentUser : null,
    error : null,
    loading : null,
    
};
const userSlice=createSlice({
    name :'user',
    intialState,
    reducers :{
        signInStart :(state)=>{
            state.loading=true;
        },
        signInSucess :(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure :(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        }
    }

});

export const {signInStart,signInSucess,signInFailure}=userSlice.actions;

export default userSlice.reducer;