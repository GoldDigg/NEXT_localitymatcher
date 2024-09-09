import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationState, setNotificationState] = useState({ isOpen: false, message: '' });

    const showNotification = (message) => {
        setNotificationState({ isOpen: true, message });
    };

    const hideNotification = () => {
        setNotificationState({ isOpen: false, message: '' });
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notificationState }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
