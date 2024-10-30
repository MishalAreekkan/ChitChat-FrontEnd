import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const authState = {
    authToken: localStorage.getItem('authToken') ?localStorage.getItem('authToken'):null,
    user: localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken')):null
}

export const authSlice = createSlice({
    name:'auth',
    initialState: authState,
    reducers:{
        setAuthToken : (state,action)=>{
            console.log(action,'llllllllllllllll');
            state.authToken = action.payload
            console.log(state.authToken,'lllllllllllllyylll');
            state.user = jwtDecode(action.payload.access)
            console.log(state.user,'lllllllllllldhdllll');
            localStorage.setItem('authToken',action.payload.access)
        },
        removeAuthToken : (state)=>{
            state.authToken = null
            state.user = null
            localStorage.removeItem('authToken')
        }
    }
})
export const {setAuthToken,removeAuthToken} = authSlice.actions
export default authSlice.reducer