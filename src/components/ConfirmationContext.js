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
                <div className="confirmation-modal" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="confirmation-content" style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <p style={{
                            marginBottom: '20px',
                            fontSize: '16px',
                            textAlign: 'center'
                        }}>{confirmationState.message}</p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px'
                        }}>
                            <button onClick={handleConfirm} style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: 'white',
                                backgroundColor: '#4CAF50',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>{confirmationState.showCancel ? 'Ja' : 'OK'}</button>
                            {confirmationState.showCancel && (
                                <button onClick={hideConfirmation} style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    backgroundColor: '#f44336',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>Nej</button>
                            )}
                        </div>
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
