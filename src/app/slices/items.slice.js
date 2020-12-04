import {createSlice} from "@reduxjs/toolkit";

const itemsSlice = createSlice({
    name: "items",
    initialState: {
        items: []
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        }
    }
});

const {setItems} = itemsSlice.actions;

const selectItems = (state) => state.itemsReducer.items;

export {
    itemsSlice,
    setItems,
    selectItems
}