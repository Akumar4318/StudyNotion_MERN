

import { createSlice } from "@reduxjs/toolkit";

const initialState={
     
  user:null,
  loading:false
}

const ProfileSlice=createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
        },
        setLoading(state,value){
            state.loading=value.payload
        }
    }
})

export const {setToken,setLoading}=ProfileSlice.actions;

export default ProfileSlice.reducer