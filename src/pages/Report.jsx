import React, { useState } from "react";
import { roles } from "../constant/constant";
const Report = ({ setShowReportGenerator, pro }) => {
  return (
    <main className="fixed top-0 z-40 bg-light w-full h-screen">
      {/* Navbar */}
      <nav className="absolute flex justify-between px-10 text-light sf text-sm tracking-wider items-center top-0 w-[75%] h-10 bg-dark">
        <button
          className="flex gap-1 items-center"
          onClick={() => {
            setShowReportGenerator(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.5}
            stroke="#e8e8e8"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
          Back
        </button>
        <p>{pro.title}</p>
        <p>
          {new Date(pro.createdAt).toLocaleDateString("en-GB")} | {pro.deadline}
        </p>
      </nav>
      {/* Aside */}
      <aside className="absolute top-0 right-0 w-1/4 h-full sf font-thin text-sm tracking-wider">
        <div className="mt-5 px-5">
          <label className="font-medium">Invoice</label>
          <input
            type="date"
            className="border border-dark p-2 rounded w-full mt-1"
          />
        </div>
        <div className="mt-5 px-5">
          <label className="font-medium">DP</label>
          <input
            type="date"
            className="border border-dark p-2 rounded w-full mt-1"
          />
        </div>
        <div className="mt-5 px-5">
          <label className="font-medium">Pelunasan</label>
          <input
            type="date"
            className="border border-dark p-2 rounded w-full mt-1"
          />
        </div>
        <div className="mt-5 px-5">
          <label className="font-medium">Bonus</label>
          <input
            type="date"
            className="border border-dark p-2 rounded w-full mt-1"
          />
        </div>
        <div className="mt-5 px-5">
          <label className="font-medium">Total Expense</label>
          <input
            type="text"
            placeholder="Rp. 0"
            className="border border-dark p-2 rounded w-full mt-1"
            disabled
          />
        </div>
        <div className="mt-5 px-5">
          <label className="font-medium">Link Final</label>
          <input
            type="url"
            placeholder="https://link"
            className="border border-dark p-2 rounded w-full mt-1"
          />
        </div>
        <div className="text-right mt-5 px-5 flex items-center justify-between">
          <button className="border-dashed border border-dark px-4 py-2 rounded">
            Export
          </button>
          <button className="border bg-dark text-light px-4 py-2 rounded">
            Save
          </button>
        </div>
      </aside>
      {/* Content */}
      <main className="w-[75%] h-full flex flex-wrap">
        <section className="w-1/3 h-48 mt-20 ml-1">
          <div className="border border-dark flex items-center gap-5 sf text-xs font-thin">
            {pro.crew.map((item, index) => {
              return (
                <>
                  <input
                    key={index}
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    className="border border-dark p-px rounded outline-none m-1 sf text-xs font-thin"
                  />
                  <p>as</p>
                  <select name="roles" id="">
                    {roles.map((role) => {
                      return (
                        <option
                          className="outline-none"
                          key={role.id}
                          value={role.name}
                        >
                          {role.name}
                        </option>
                      );
                    })}
                  </select>
                </>
              );
            })}
          </div>
        </section>

        {/* <div className="border border-dark w-1/2 h-48 mt-20 ml-1"></div> */}
      </main>
    </main>
  );
};

export default Report;
