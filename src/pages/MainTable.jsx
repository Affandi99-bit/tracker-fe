import React, { Suspense, useState, useEffect } from "react";
import { TableModal, Loader } from "../components";
import { findTagColor } from "../utils/utils";
const DataTable = ({ tableData, setSelectedRowData, setShowModal }) => {
  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowModal(true);
  };

  return (
    <tbody className="text-center ">
      {tableData.map((row, index) => (
        <tr
          onClick={() => handleRowClick(row)}
          className={`h-20 w-screen montserrat text-xs font-medium tracking-wide transition ease-in-out duration-300 ${
            index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"
          } hover:translate-x-3 duration-200 transition-all`}
          key={row._id}
        >
          <td className="w-10">
            <div className="font-semibold px-3 flex items-center justify-center ">
              {index + 1}
            </div>
          </td>
          <td className="w-20">{row.title}</td>
          <td className="w-20">{row.client}</td>
          <td className="w-20">{row.pic}</td>
          <td className="w-32">{row.deadline}</td>
          <td className="w-48">
            <div className="flex flex-wrap gap-1 justify-start items-center">
              {row.status.map((chip, i) => (
                <p
                  key={i}
                  style={{
                    backgroundColor: findTagColor(chip),
                  }}
                  className="rounded-md w-[3.6rem] py-[0.15rem]"
                >
                  <span className="text-white text-xs font-extralight">
                    {chip}
                  </span>
                </p>
              ))}
            </div>
          </td>
          <td className="w-48">
            <div className="flex gap-3 my-1 flex-wrap items-center justify-center">
              {row.crew.map((member, i) => (
                <p key={i}>{member}</p>
              ))}
            </div>
          </td>
          <td className="w-32">{row.pm}</td>
          <td className="w-32">
            {row.final_file ? (
              <a
                target="_blank"
                className="truncate w-32 text-blue-500 hover:underline"
                href={`${row.final_file}`}
              >
                Go to File
              </a>
            ) : null}
          </td>
          <td className="w-32">
            {row.final_report_file ? (
              <a
                target="_blank"
                className="truncate w-32 text-blue-500 hover:underline"
                href={`${row.final_report_file}`}
              >
                Go to Report File
              </a>
            ) : null}
          </td>
          <td className=" w-48 overflow-hidden whitespace-nowrap text-ellipsis">
            {row.note}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

const MainTable = ({
  tableData,
  updateData,
  deleteData,
  searchQuery,
  selectedTags,
  isSortedDesc,
  setSortedData,
  showHidden,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [sortedData, setSortedDataLocal] = useState(tableData);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    if (!tableData) return;

    const filteredTableData = tableData.filter((item) => {
      const Month = new Date();
      Month.setMonth(Month.getMonth() - 1);

      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const isWithinMonth =
        new Date(item.createdAt) >= Month &&
        new Date(item.createdAt) <= new Date();

      const isDone = item.status.includes("done");

      const isOngoing =
        isWithinMonth ||
        item.status.includes("ongoing") ||
        (!isDone && !isWithinMonth);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item.status.includes(tag));

      return matchesSearch && matchesTags && (showHidden || isOngoing);
    });

    const sorted = [...filteredTableData].sort((a, b) => {
      return isSortedDesc
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

    setSortedData(sorted);
    setSortedDataLocal(sorted);
  }, [tableData, isSortedDesc, searchQuery, selectedTags, showHidden]);

  const handleDate = () => {
    setIsSorted((prev) => !prev);

    const sortedByDeadline = [...sortedData].sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return isSorted ? dateA - dateB : dateB - dateA;
    });

    setSortedDataLocal(sortedByDeadline);
  };

  if (!tableData || !sortedData) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col h-screen">
      <section className="flex-grow overflow-x-scroll lg:overflow-x-hidden">
        <table className="border-collapse mt-10 select-none relative w-full table-fixed">
          <thead className="montserrat">
            <tr>
              <th className="w-10 sticky top-[2.5rem] md:top-[2.8rem] border-none bg-dark text-light text-md z-10 h-10">
                ID
              </th>
              <th className="w-32 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                TITLE
              </th>
              <th className="w-20 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                CLIENT
              </th>
              <th className="w-20 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                PIC
              </th>
              <th
                onClick={handleDate}
                className="w-32 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10"
              >
                <div className=" flex items-center justify-center cursor-pointer">
                  DUE DATE
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </th>
              <th className="w-48 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                TAGS
              </th>
              <th className="w-48 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                CREW
              </th>
              <th className="w-20 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                PM
              </th>
              <th className="w-32 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                FINAL FILE
              </th>
              <th className="w-32 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                DOCUMENTS
              </th>
              <th className="w-32 sticky top-[2.5rem] md:top-[2.8rem] border-none  bg-dark text-light text-md z-10 h-10">
                NOTE
              </th>
            </tr>
          </thead>
          <Suspense fallback={<Loader />}>
            <DataTable
              tableData={isSorted ? sortedData : sortedData}
              setSelectedRowData={setSelectedRowData}
              setShowModal={setShowModal}
            />
          </Suspense>
        </table>
        {showModal && (
          <TableModal
            pro={selectedRowData}
            showModal={showModal}
            setShowModal={setShowModal}
            updateData={updateData}
            deleteData={deleteData}
          />
        )}
      </section>
    </main>
  );
};

export default MainTable;
