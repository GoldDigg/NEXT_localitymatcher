import React, { createContext, useState, useContext } from 'react';

const ConfirmationContext = createContext();

export const ConfirmationProvider = ({ children }) => {
    const [confirmationState, setConfirmationState] = useState({ isOpen: false, message: '', onConfirm: null, showCancel: false });

    const showConfirmation = (message, onConfirm = null, showCancel = true) => {
        setConfirmationState({ isOpen: true, message, onConfirm, showCancel });
    };

    const hideConfirmation = () => {
        setConfirmationState({ isOpen: false, message: '', onConfirm: null, showCancel: false });
    };

    const handleConfirm = () => {
        if (confirmationState.onConfirm) {
            confirmationState.onConfirm();
        }
        hideConfirmation();
    };

    const contextValue = {
        showConfirmation,
        hideConfirmation,
        handleConfirm,
        confirmationState
    };

    return (
        <ConfirmationContext.Provider value={contextValue}>
            {children}
            {confirmationState.isOpen && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <p>{confirmationState.message}</p>
                        <button onClick={handleConfirm}>{confirmationState.showCancel ? 'Ja' : 'OK'}</button>
                        {confirmationState.showCancel && (
                            <button onClick={hideConfirmation}>Nej</button>
                        )}
                    </div>
                </div>
            )}
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = () => {
    const context = useContext(ConfirmationContext);
    if (context === undefined) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
};
