import React from 'react'
import './Popup.css';
const Popup = ({onConfirm, onCancel, text, cancelText='No', confirmText='Yes'}) => {
    return (
        <div className="SkipModal">
            <div className="modal-body">
                <h5>{text}</h5>
                <div className="d-flex justify-center">
                    <button className="skip-button" onClick={onConfirm}>{confirmText}</button>
                    <button className="next-button" 
                    onClick={onCancel}
                    >{cancelText}</button>
                </div>
            </div>
        </div>
    )
};
export default Popup;

