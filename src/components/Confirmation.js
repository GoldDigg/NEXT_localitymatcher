import React from 'react';
import { useConfirmation } from './ConfirmationContext';

function Confirmation() {
    const { confirmationState, handleConfirm, hideConfirmation } = useConfirmation();

    if (!confirmationState.isOpen) {
        return null;
    }

    return (
        <div className="confirmation-overlay">
            <div className="confirmation-dialog">
                <p>{confirmationState.message}</p>
                <div className="confirmation-actions">
                    {confirmationState.showCancel ? (
                        <>
                            <button onClick={handleConfirm} className="confirm-button">Ja</button>
                            <button onClick={hideConfirmation} className="cancel-button">Nej</button>
                        </>
                    ) : (
                        <button onClick={handleConfirm} className="confirm-button">OK</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
