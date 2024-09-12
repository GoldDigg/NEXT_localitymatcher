'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationState, setNotificationState] = useState({ isOpen: false, message: '' });

    const showNotification = useCallback((message) => {
        setNotificationState({ isOpen: true, message });
    }, []);

    const hideNotification = useCallback(() => {
        setNotificationState({ isOpen: false, message: '' });
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notificationState }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
