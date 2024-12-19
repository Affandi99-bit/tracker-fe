import { useState } from "react";
import { tags, payment } from "../constant/constant";

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
      <section className="w-[25rem] bg-dark rounded-md fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-2xl text-center text-light sf tracking-widest font-bold p-2">
          Filters
        </h1>
        <div className="w-full p-2 flex justify-start items-center flex-wrap">
          {tags.progress.map((option) => (
            <label
              htmlFor={`hr-${option.value}`}
              key={option.value}
              className={`flex flex-row w-32 items-center gap-2 sf tracking-widest cursor-pointer text-light p-2`}
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
          {tags.projectCategories.map((option) => (
            <label
              htmlFor={`hr-${option.value}`}
              key={option.value}
              className={`flex flex-row w-32 items-center gap-2 sf tracking-widest cursor-pointer text-light p-2`}
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
          {tags.addons.map((option) => (
            <label
              htmlFor={`hr-${option.value}`}
              key={option.value}
              className={`flex flex-row w-32 items-center gap-2 sf tracking-widest cursor-pointer text-light p-2`}
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
              className={`flex flex-row w-32 items-center gap-2 sf tracking-widest cursor-pointer text-light p-2`}
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
  onSort,
  onArchive,
  showHidden,
  selectedTags,
  setSelectedTags,
  onLogout,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showLastMonth, setShowLastMonth] = useState(false);

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
      <section className="fixed select-none top-0 flex justify-center items-center bg-dark py-2 px-5 w-full overflow-hidden">
        <div
          onClick={() => {
            window.location.reload();
          }}
          className="flex items-center cursor-pointer"
        >
          <img src="/logo.png" alt="logo" className="block md:hidden w-6 " />
        </div>
        <div className="flex flex-col items-center justify-center">
          <img src="/black.png" alt="logo" className="hidden md:block w-40" />
          <img
            src="/PM.png"
            alt="PM"
            onClick={() => {
              window.location.reload();
            }}
            className="hidden w-56 mt-3 object-contain lg:block cursor-pointer"
          />
        </div>
      </section>
      <nav className="fixed z-20 px-5 rounded-t-xl bg-dark bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-5 h-10">
        {/* Filter Button */}
        <button
          onClick={() => {
            setShowFilter(!showFilter);
          }}
          id="filter"
          className="transition ease-in-out hover:scale-110  duration-300 active:scale-90"
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
        {/* Archive Button */}
        <button id="archive" onClick={handleArchiveToggle}>
          {showHidden || showArchive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              onClick={() => setShowArchive(false)}
              className="size-6  transition ease-in-out hover:scale-110  duration-300 active:scale-90"
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
              className="size-6  transition ease-in-out hover:scale-110  duration-300 active:scale-90"
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
        {/* Search Input */}
        <div className="relative flex gap-3 items-center">
          {showSearch ? (
            <input
              type="text"
              onChange={handleInput}
              className="absolute border border-dark left-1/2 transform -translate-x-1/2 -top-10 bg-light text-dark rounded-t-md px-2 py-1 w-40 outline-none scale-95"
              placeholder="Search..."
            />
          ) : null}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#E8E8E8"
            className="size-6 cursor-pointer  transition ease-in-out hover:scale-110  duration-300 active:scale-90 "
            onClick={() => setShowSearch(!showSearch)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        {/* Ascending Toggle */}
        <button id="asc/desc" onClick={onSort}>
          {showArrow ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#e8e8e8"
              className="size-6 cursor-pointer  transition ease-in-out hover:scale-110  duration-300 active:scale-90"
              onClick={() => {
                setShowArrow(false);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 18.75 7.5-7.5 7.5 7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#E8E8E8"
              className="size-6 cursor-pointer  transition ease-in-out hover:scale-110  duration-300 active:scale-90"
              onClick={() => setShowArrow(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
              />
            </svg>
          )}
        </button>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rotate-180 transition ease-in-out hover:scale-105 duration-300 active:scale-95"
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
      </nav>
    </>
  );
};

export default Navbar;
