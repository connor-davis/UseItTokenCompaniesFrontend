import {createSlice} from "@reduxjs/toolkit";
const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: []
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications = [...state.notifications, {
                ...action.payload.notification,
                closeAfter: action.payload.closeAfter,
                id: Math.random() * 1000000
            }]
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
        }
    }
});

const {addNotification, removeNotification} = notificationsSlice.actions;

const selectNotifications = (state) => state.notificationsReducer.notifications;

export {
    notificationsSlice,
    addNotification,
    removeNotification,
    selectNotifications
}