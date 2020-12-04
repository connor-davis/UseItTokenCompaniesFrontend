import {createSlice} from "@reduxjs/toolkit";

const collectorsSlice = createSlice({
    name: "collectors",
    initialState: {
        collectors: []
    },
    reducers: {
        setCollectors: (state, action) => {
            state.collectors = action.payload;
        }
    }
});

let {setCollectors} = collectorsSlice.actions;

let selectCollectors = (state) => state.collectorsReducer.collectors;

export {
    collectorsSlice,
    setCollectors,
    selectCollectors,
}