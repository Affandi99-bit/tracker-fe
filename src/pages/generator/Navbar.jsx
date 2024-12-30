import React from "react";

const Navbar = ({ selectedOption, onOptionChange }) => {
  return (
    <div className="z-50 flex top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-around items-center fixed bg-gray-700 backdrop-blur-sm w-[90%] bg-opacity-20 rounded p-3 shadow">
      <button className="">&larr; Back</button>
      <h1 className="font-bold">
        INALUM CUSTOMER GATHERING 2024 - Breaker - Nova
      </h1>
      <p>Start: 15-11-2024 | Deadline: 16-11-2024</p>
      <select
        className="border p-2 rounded"
        value={selectedOption}
        onChange={onOptionChange}
      >
        <option value="Produksi">Produksi</option>
        <option value="Dokumentasi">Dokumentasi</option>
        <option value="Design">Design</option>
        <option value="Motion">Motion</option>
      </select>
      <button className="shadow bg-green-500 text-white p-2 rounded">
        Export
      </button>
    </div>
  );
};

export default Navbar;
