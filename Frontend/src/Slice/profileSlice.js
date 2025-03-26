

import { createSlice } from "@reduxjs/toolkit";

const initialState={
     
  user:null
}

const ProfileSlice=createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
        }
    }
})

export const {setToken}=ProfileSlice.actions;

export default ProfileSlice.reducer