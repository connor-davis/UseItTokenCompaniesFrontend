import {createSlice} from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        loading: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

const {setLoading} = loadingSlice.actions;

const selectLoading = (state) => state.loadingReducer.loading;

export {
    loadingSlice,
    setLoading,
    selectLoading
}