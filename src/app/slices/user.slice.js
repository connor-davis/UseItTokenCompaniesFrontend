import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {}
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
});

const {setUser} = userSlice.actions;

const selectUser = (state) => state.userReducer.user;

export {
    userSlice,
    setUser,
    selectUser
}