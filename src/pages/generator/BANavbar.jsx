import React from "react";

const Navbar = ({
  selectedOption,
  onOptionChange,
  setShowReportGenerator,
  title,
  deadline,
  createat,
}) => {
  return (
    <div className="z-50 flex top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-around items-center fixed bg-gray-700 backdrop-blur-sm w-[90%] bg-opacity-20 rounded p-3 shadow">
      <button
        onClick={() => {
          setShowReportGenerator(false);
        }}
        className=""
      >
        &larr; Back
      </button>
      <h1 className="font-bold">{title}</h1>
      <p>
        <span>{createat}</span> | <span>{deadline}</span>
      </p>
      <select
        className="border p-2 rounded"
        value={selectedOption}
        onChange={onOptionChange}
      >
        <option value="">Select Template</option>
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
