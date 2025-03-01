import React, { useState, useEffect } from "react";

const Toast = ({ message, show, onClose, type }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            className={`fixed border flex items-center gap-1 z-50 top-5 right-3 px-4 py-2 bg-dark text-light sf text-sm rounded-lg shadow-lg transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"
                } ${type === 'success' ? 'border-green-500' :
                    type === 'error' ? 'border-red-500' : 'border-light'
                }`}
        >
            {type === 'error' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ) : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke='#22c55e'
                className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>}

            {message}
        </div>
    );
};

export default Toast;
