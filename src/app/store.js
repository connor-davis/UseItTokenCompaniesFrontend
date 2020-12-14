import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";

import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";

import {collectorsSlice} from "./slices/collector.slice";
import {depositsSlice} from "./slices/deposits.slice";
import {itemsSlice} from "./slices/items.slice";
import {loadingSlice} from "./slices/loading.slice";
import {notificationsSlice} from "./slices/notifications.slice";
import {userSlice} from "./slices/user.slice.js";

let userReducer = userSlice.reducer;
let collectorsReducer = collectorsSlice.reducer;
let itemsReducer = itemsSlice.reducer;
let loadingReducer = loadingSlice.reducer;
let notificationsReducer = notificationsSlice.reducer;
let depositsReducer = depositsSlice.reducer;

function loggerMiddleware(store) {
    return function (next) {
        return function (action) {
            console.log(action)
            next(action)
            console.log(store.getState())
        }
    }
}

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    userReducer,
    collectorsReducer,
    itemsReducer,
    loadingReducer,
    notificationsReducer,
    depositsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = configureStore({
    reducer: persistedReducer,
    middleware: [...getDefaultMiddleware({
        serializableCheck: false,
    }), loggerMiddleware]
})

let persistor = persistStore(store)

export {store, persistor};