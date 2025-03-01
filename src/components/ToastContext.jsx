import React, { createContext, useState, useContext } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const hideToast = () => {
        setToast({ show: false, message: '' });
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Toast
                message={toast.message}
                show={toast.show}
                onClose={hideToast}
                type={toast.type}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
