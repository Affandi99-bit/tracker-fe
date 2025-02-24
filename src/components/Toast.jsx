import React, { useState, useEffect } from "react";

const Toast = ({ message, show, onClose }) => {
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
            className={`fixed flex items-center gap-1 z-50 top-5 right-3 px-4 py-2 bg-dark text-light sf text-sm rounded-lg shadow-lg transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f8f8f8" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {message}
        </div>
    );
};

export default Toast;
