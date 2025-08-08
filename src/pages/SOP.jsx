import React, { useState } from 'react'
import { Link } from 'react-router-dom'
const SOP = () => {
    return (
        <div className='bg-dark font-body text-light min-h-screen'>
            <nav className="fixed top-0 flex justify-between items-center p-4 w-full">
                <Link to={"/"}>
                    <button id='back' onClick={() => { }} className='w-32 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center items-center gap-2 text-xs'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </button>
                </Link>
                {/* Search Input */}
                <div className="relative flex items-center gap-2">
                    {/* {showSearch ? ( */}
                    <input
                        type="text"
                        // onChange={handleInput}
                        className="border text-light border-light/25 glass rounded-xl px-2 py-1 w-40 outline-none scale-95"
                        placeholder="Search..."
                    />
                    {/* ) : null} */}
                    <button onClick={() => { }} className='transition ease-in-out hover:scale-110  duration-300 active:scale-90 cursor-pointer '>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#E8E8E8"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </button>
                </div>
            </nav>
            <main className="pt-16 px-4">
                <h1 className="text-2xl font-bold mb-4">SOP Library</h1>
                <p className="text-light/75 mb-8">This section is under development. Stay tuned for updates!</p>
                {/* Add your SOP content here */}
            </main>
        </div>

    )
}

export default SOP