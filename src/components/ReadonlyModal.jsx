import React, { useEffect, useRef, useState } from 'react'

const ReadonlyModal = ({ link, onClose }) => {
    const modalRef = useRef(null);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setOpen(false);
                if (onClose) onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!open) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
    };

    return (
        <div className='fixed top-0 left-0 z-50 glass w-full h-full flex items-center justify-center'>
            <section
                ref={modalRef}
                className='bg-dark rounded-lg p-5 text-light flex flex-col justify-center items-center w-xl h-48'
            >
                <p className='text-center font-body'>
                    This project is in readonly mode. You can share the link below for others to view.
                </p>
                <div className='flex items-center gap-5 w-full mt-5'>
                    <input
                        type="text"
                        readOnly
                        value={link}
                        className='glass outline-none border border-white rounded-2xl h-10 w-full px-3'
                    />
                    <button
                        className='px-4 py-2 bg-light text-dark rounded-lg hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                        onClick={handleCopy}
                    >
                        Copy
                    </button>
                </div>
            </section>
        </div>
    )
}

export default ReadonlyModal