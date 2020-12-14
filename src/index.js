import React from 'react';

import ReactDOM from 'react-dom';

import io from "socket.io-client";

import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import './index.css';

import { persistor, store } from './app/store';
import { setCollectors } from "./app/slices/collector.slice";
import { setDeposits } from './app/slices/deposits.slice';
import { setItems } from "./app/slices/items.slice";

let dispatch = store.dispatch;

let socket = io("https://utapi.connordavis.work");

socket.on("connect", () => {
    console.log("Connected to SOCKET");
});

socket.on("disconnect", () => {
    console.log("Disconnected from SOCKET");
});

socket.on("collector-change", ({ type, data: { _idRef, document } }) => {
    let collectors = store.getState().collectorsReducer.collectors;

    switch (type) {
        case "insert":
            dispatch(setCollectors([...collectors, document]));

            break;
        case "update":
            let updateFilter = collectors.filter((filter) => filter.uid !== document.uid);
            dispatch(setCollectors([...updateFilter, document]));

            break;
        case "delete":
            let deleteFilter = collectors.filter((filter) => filter._id !== _idRef);
            dispatch(setCollectors(deleteFilter));

            break;
        default:
            break;
    }
});

socket.on("item-change", ({ type, data: { _idRef, document } }) => {
    let items = store.getState().itemsReducer.items;

    switch (type) {
        case "insert":
            dispatch(setItems([...items, document]));

            break;
        case "update":
            let updateFilter = items.filter((filter) => filter.id !== _idRef);
            dispatch(setItems([...updateFilter, document]));

            break;
        case "delete":
            let deleteFilter = items.filter((filter) => filter.id !== _idRef);
            dispatch(setItems(deleteFilter));

            break;
        default:
            break;
    }
});

socket.on("deposit-change", ({ type, data: { _idRef, document } }) => {
    let deposits = store.getState().depositsReducer.deposits;

    switch (type) {
        case "insert":
            dispatch(setItems([...deposits, document]));

            break;
        case "update":
            let updateFilter = deposits.filter((filter) => filter._id !== _idRef);
            dispatch(setDeposits([...updateFilter, document]));

            break;
        case "delete":
            console.log(_idRef, document);

            let deleteFilter = deposits.filter((filter) => filter._id !== _idRef);
            dispatch(setDeposits(deleteFilter));

            break;
        default:
            break;
    }
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);