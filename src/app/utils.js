import axios from 'axios';

import {store} from "./store";

import {setItems} from "./slices/items.slice";
import {setUser} from "./slices/user.slice.js";
import {setLoading} from "./slices/loading.slice";
import {addNotification} from "./slices/notifications.slice";
import {setCollectors} from "./slices/collector.slice";

let dispatch = store.dispatch;

function fetchCollectors() {
    let {user} = store.getState().userReducer;

    axios.get(API_URL + "/collector/", {
        headers: {
            "Authorization": "Bearer " + user.token,
            "secure_secret": user.secure_secret,
        }
    }).then((result) => {
        if (result) {
            if (result.data.success) {
                let sorted = result.data.data.sort((a, b) => {
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;

                    return 0;
                });

                let filtered = sorted.filter((filter) => filter.uid !== user.uid);

                dispatch(setCollectors(filtered));
            } else dispatch(setCollectors([]));
        }
    });
}

function fetchItems() {
    let {user} = store.getState().userReducer;

    axios.get(API_URL + "/items", {
        headers: {
            "Authorization": "Bearer " + user.token,
            "secure_secret": user.secure_secret,
        }
    }).then((result) => {
        if (result.data.success) dispatch(setItems(result.data.data.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;

            return 0;
        })))
        else dispatch(setItems([]));

    });
}

axios.interceptors.request.use(function (config) {
    console.log(config);
    dispatch(setLoading(true))
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    console.log(response);
    if (response.data.error) {
        switch (response.data.error) {
            case "user-not-found":
                let no_user = {
                    title: "",
                    content: "That user was not found, please try again."
                };

                dispatch(addNotification({notification: no_user, closeAfter: 5}))
                break;
            case "password-mismatch":
                let password_mismatch = {
                    title: "",
                    content: "Incorrect password, please try again."
                };

                dispatch(addNotification({notification: password_mismatch, closeAfter: 5}))
                break;
            case "authentication-error":
                let authentication_error = {
                    title: "",
                    content: "Failed to authenticate."
                };

                dispatch(addNotification({notification: authentication_error, closeAfter: 5}))
                break;
            case "unauthorized":
                let unauthorized = {
                    title: "",
                    content: "You are not allowed to do that."
                }

                dispatch(addNotification({notification: unauthorized, closeAfter: 5}))
                break;
            default:
                break;
        }
    }
    dispatch(setLoading(false))
    return response;
}, function (error) {
    if (error.response) {
        if (error.response.data === "Unauthorized") {
            dispatch(setUser({}));
            dispatch(setCollectors([]));
            dispatch(setItems([]));
        }
    }

    window.location.href = "/";

    return Promise.reject(error);
});

const API_URL = "https://utapi.connordavis.work";
// const API_URL = "http://localhost";

export {
    axios,
    API_URL,
    fetchCollectors,
    fetchItems,
};