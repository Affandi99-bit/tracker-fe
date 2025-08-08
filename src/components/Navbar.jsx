import React, { useState } from "react";
import { tags } from "../constant/constant";
import { Link } from 'react-router-dom'
import Tooltip from "./Tooltip";
import { useToast } from "./ToastContext";
const Dropdown = ({ selectedTags, setSelectedTags }) => {
  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };
  return (
    <>
      <section className="p-5s bg-dark border border-light/25 rounded-xl fixed top-16 right-5 z-20">
        <h1 className="text-xl font-bold text-center text-light font-body tracking-widest p-2">
          Filters
        </h1>
        <div className="w-full p-2 flex flex-col justify-start items-center">
          {tags.projectCategories.map((option) => (
            <label
              htmlFor={`hr-${option.value}`}
              key={option.value}
              className={`flex flex-row w-32 items-center gap-2 text-xs font-body tracking-widest cursor-pointer text-light p-2`}
            >
              <input
                id={`hr-${option.value}`}
                type="checkbox"
                name="status"
                value={option.value}
                checked={selectedTags.includes(option.value)}
                onChange={() => handleTagChange(option.value)}
                className="peer hidden"
              />
              <div
                htmlFor={`hr-${option.value}`}
                className="size-5 flex rounded-md border border-[#a2a1a833] bg-dark peer-checked:bg-light transition"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="size-5 stroke-dark"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              {option.title}
            </label>
          ))}

          {tags.projectType.map((option) => (
            <label
              htmlFor={`hr-${option.value}`}
              key={option.value}
              className={`flex flex-row w-32 items-center gap-2 font-body text-xs tracking-widest cursor-pointer text-light p-2`}
            >
              <input
                id={`hr-${option.value}`}
                type="checkbox"
                name="status"
                value={option.value}
                checked={selectedTags.includes(option.value)}
                onChange={() => handleTagChange(option.value)}
                className="peer hidden"
              />
              <div
                htmlFor={`hr-${option.value}`}
                className="size-5 flex rounded-md border border-[#a2a1a833] bg-dark peer-checked:bg-light transition"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="size-5 stroke-dark"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              {option.title}
            </label>
          ))}
        </div>
      </section>
    </>
  );
};

const Navbar = ({
  onSearch,
  onArchive,
  showHidden,
  selectedTags,
  setSelectedTags,
  onLogout,
  showCreateModal,
  setShowCreateModal,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showLastMonth, setShowLastMonth] = useState(false);
  const { showToast } = useToast();
  const handleInput = (e) => {
    onSearch(e.target.value);
  };

  const handleArchiveToggle = () => {
    setShowLastMonth((prev) => !prev);
    onArchive();
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    onLogout();
  };


  return (
    <>
      {showFilter ? (
        <Dropdown
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onSearch={onSearch}
        />
      ) : null}
      <section className="fixed select-none z-10 top-0 flex flex-col justify-between items-start bg-dark py-3 px-5 w-full overflow-hidden">
        <div className="flex justify-between items-center w-full">
          <img
            src="/PM.webp"
            alt="PM"
            onClick={() => {
              window.location.reload();
            }}
            className="hidden md:block w-40 object-contain cursor-pointer"
          />
          <div className="flex gap-5 items-start">
            {/* Search Input */}
            <Tooltip position="left" content={"Search"}>
              <div className="relative flex gap-3 items-start">
                {showSearch ? (
                  <input
                    type="text"
                    onChange={handleInput}
                    className="border text-light border-light/25 glass rounded-xl px-2 py-1 w-40 outline-none scale-95"
                    placeholder="Search..."
                  />
                ) : null}
                <button className='transition ease-in-out hover:scale-110  duration-300 active:scale-90 cursor-pointer '>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#E8E8E8"
                    className="size-6"
                    onClick={() => { }}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>
            </Tooltip>
            {/* SOP Button */}
            <Tooltip position="left" content={"SOP Library"}>
              <Link to={"/sop"}>
                <button id="sop"
                  // onClick={() => { showToast("Under Development", "error"); }}
                  className="transition ease-in-out hover:scale-110  duration-300 active:scale-90 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </button>
              </Link>
            </Tooltip>
            {/* Archive Button */}
            <Tooltip position="left" content={"Archive"}>
              <button id="archive" onClick={handleArchiveToggle} className="transition ease-in-out hover:scale-110  duration-300 active:scale-90 cursor-pointer">
                {showHidden || showArchive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    onClick={() => setShowArchive(false)}
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                    onClick={() => setShowArchive(true)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                )}
              </button>
            </Tooltip>

            {/* Filter */}
            <Tooltip position="left" content={"Filter"}>
              <button
                onClick={() => {
                  setShowFilter(!showFilter);
                }}
                id="filter"
                className="transition ease-in-out hover:scale-110  duration-300 active:scale-90 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                  />
                </svg>
              </button>
            </Tooltip>
            {/* Create */}
            <button
              onClick={() => setShowCreateModal(!showCreateModal)}
              className="px-3 py-1 flex items-center justify-center bg-light text-dark font-body  rounded-xl transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#222222"
                className={`size-4 transition-all duration-300 ${showCreateModal ? "rotate-45" : "rotate-180"
                  }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create
            </button>
            {/* Logout Button */}
            <Tooltip position="left" content={"Log-Out"}>
              <button
                onClick={handleLogout}
                className="rotate-180 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="gray"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      </section >

    </>
  );
};

export default Navbar;
