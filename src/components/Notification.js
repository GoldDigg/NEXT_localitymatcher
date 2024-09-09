import React from 'react';
import { useNotification } from './NotificationContext';

function Notification() {
    const { notificationState, hideNotification } = useNotification();

    if (!notificationState.isOpen) {
        return null;
    }

    return (
        <div className="notification-overlay">
            <div className="notification-dialog">
                <p>{notificationState.message}</p>
                <button onClick={hideNotification} className="notification-button">OK</button>
            </div>
        </div>
    );
}

export default Notification;
