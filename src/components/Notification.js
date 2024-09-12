'use client';

import React, { useEffect, useRef } from 'react';
import { useNotification } from './NotificationContext';

function Notification() {
    const { notificationState, hideNotification } = useNotification();
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && notificationState.isOpen) {
                hideNotification();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [notificationState.isOpen, hideNotification]);

    useEffect(() => {
        if (notificationState.isOpen) {
            buttonRef.current?.focus();
        }
    }, [notificationState.isOpen]);

    if (!notificationState.isOpen) {
        return null;
    }

    return (
        <div className="notification-overlay">
            <div className="notification-dialog" role="dialog" aria-modal="true">
                <p>{notificationState.message}</p>
                <button 
                    ref={buttonRef}
                    onClick={hideNotification} 
                    className="notification-button"
                    aria-label="Close notification"
                >
                    OK
                </button>
            </div>
        </div>
    );
}

export default Notification;
