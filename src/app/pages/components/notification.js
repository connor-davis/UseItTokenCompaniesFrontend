import React from "react";

import {useDispatch, useSelector} from "react-redux";

import {removeNotification, selectNotifications} from "../../slices/notifications.slice";

import "../../styles/global.scss";
import "../../styles/notifications.scss";

function Notification() {
    let dispatch = useDispatch();
    let notifications = useSelector(selectNotifications);

    function closeNotification(id) {
        dispatch(removeNotification(id))
    }

    return (
        <div className="notifications">
            {notifications.map((notification) => {
                    if (notification.closeAfter !== undefined) setTimeout(() => {
                        dispatch(removeNotification(notification.id));
                    }, notification.closeAfter * 1000);

                    return (
                        <div key={notification.id} className="notification-component"
                             onClick={closeNotification.bind(this, notification.id)}>
                            <div className="notification-component-title">{notification.title}</div>
                            <div className="notification-component-content">{notification.content}</div>
                        </div>
                    );
                }
            )}
        </div>
    );
}

export default Notification;