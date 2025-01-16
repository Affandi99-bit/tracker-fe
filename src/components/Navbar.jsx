import { useState, useEffect } from "react";
import { tags } from "../constant/constant";
import { due, filter, arsip, asc, add, edit, del, ba } from "../assets";
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
      <section className="w-[25rem] bg-dark rounded-md fixed bottom-14 left-1/2 transform -translate-x-1/2 z-20">
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

const Guide = () => {
  return (
    <section className="w-[60%] h-[85%] bg-dark rounded-md fixed top-20 left-1/2 transform -translate-x-1/2 z-30">
      <h1 className="text-2xl text-center text-light sf tracking-widest font-bold p-2">
        Guide
      </h1>
      <ul className="list-decimal px-10 h-[27rem] overflow-y-auto">
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>Klik DUE DATE untuk mengurutkan dari deadline paling lama</p>
          <img src={due} alt="" />
        </li>
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>Klik Filter untuk filter item berdasarkan kategori</p>
          <img src={filter} alt="" />
        </li>
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>
            Klik Arsip untuk menyimpan item dangan kategori DONE. Jika sudah
            membuat project data dan tidak ditampilkan di layar. Mungkin ada
            dalam arsip
          </p>
          <img src={arsip} alt="" />
        </li>
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>Klik Urutkan untuk mengatur urutan item</p>
          <img src={asc} alt="" />
        </li>
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>
            Untuk additional crew, klik tombol Additional Crew untuk menampilkan
            text input untuk diisi crew tambahan
          </p>
          <img src={add} alt="" />
        </li>
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>Klik Edit untuk mengubah detail item yang ada</p>
          <img src={edit} alt="" />
        </li>
        <li className="text-sm font-thin text-light sf tracking-wider">
          <p>Klik Hapus untuk menghapus item yang tidak diperlukan</p>
          <img src={del} alt="" />
        </li>
      </ul>
    </section>
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
  const [showGuide, setShowGuide] = useState(false);

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
      {showGuide ? <Guide /> : null}
      {showFilter ? (
        <Dropdown
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onSearch={onSearch}
        />
      ) : null}
      <section className="fixed select-none z-0 top-0 flex justify-between items-center bg-dark py-3 px-5 w-full overflow-hidden">
        <img
          src="/PM.png"
          alt="PM"
          onClick={() => {
            window.location.reload();
          }}
          className=" w-56 object-contain cursor-pointer"
        />
        <div className="flex gap-5 items-center">
          <button
            onClick={() => {
              setShowGuide(!showGuide);
            }}
            className="hover:brightness-75 animate-[wiggle_1s_ease-in-out_infinite]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#f8f8f8"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </button>
          <img src="/black.png" alt="PM" className=" w-56 object-contain" />
        </div>
      </section>
      <nav className="fixed z-20 px-5 rounded-t-xl bg-dark bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-7 h-12">
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
              className="absolute border border-dark left-1/2 transform -translate-x-1/2 -top-12 bg-light text-dark rounded px-2 py-1 w-40 outline-none scale-95"
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
