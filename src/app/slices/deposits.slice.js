import {createSlice} from "@reduxjs/toolkit";

const depositsSlice = createSlice({
    name: "deposits",
    initialState: {
        deposits: []
    },
    reducers: {
        setDeposits: (state, action) => {
            state.deposits = action.payload;
        }
    }
});

const {setDeposits} = depositsSlice.actions;

const selectDeposits = (state) => state.depositsReducer.deposits;

export {
    depositsSlice,
    setDeposits,
    selectDeposits,
}