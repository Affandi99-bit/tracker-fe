import React from "react";

const Finance = () => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg mt-10">
      <div className="mt-5">
        <label>Invoice</label>
        <input type="date" className="border p-2 rounded w-full mt-1" />
      </div>
      <div className="mt-5">
        <label>DP</label>
        <input type="date" className="border p-2 rounded w-full mt-1" />
      </div>
      <div className="mt-5">
        <label>Pelunasan</label>
        <input type="date" className="border p-2 rounded w-full mt-1" />
      </div>
      <div className="mt-5">
        <label>Bonus</label>
        <input type="date" className="border p-2 rounded w-full mt-1" />
      </div>
      <div className="mt-5">
        <label>Total Expense</label>
        <input
          type="text"
          placeholder="Rp. 0"
          className="border p-2 rounded w-full mt-1"
          disabled
        />
      </div>
      <div className="mt-5">
        <label>Link Final</label>
        <input
          type="url"
          placeholder="https://link"
          className="border p-2 rounded w-full mt-1"
        />
      </div>
      <div className="text-right mt-5">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default Finance;
