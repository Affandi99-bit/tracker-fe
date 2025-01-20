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
          className={`h-20 w-screen sf tracking-widest text-xs ${
            index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
          } hover:brightness-75`}
          key={row._id}
        >
          <td className="w-10 border-x border-gray-400">
            <div className="font-semibold px-3 flex items-center justify-center ">
              {index + 1}
            </div>
          </td>
          <td className="w-20 border-x border-gray-400">{row.title}</td>
          <td className="w-20 border-x border-gray-400">{row.client}</td>
          <td className="w-20 border-x border-gray-400">{row.pic}</td>
          <td className="w-32 border-x border-gray-400">{row.deadline}</td>
          <td className="w-20 border-x border-gray-400">
            <div className="flex flex-wrap gap-1 justify-center items-center">
              {row.status.map((chip, i) => (
                <p
                  key={i}
                  style={{
                    backgroundColor: findTagColor(chip),
                  }}
                  className="rounded-md w-[3.6rem] py-[0.15rem]"
                >
                  <span className="text-light text-xs font-thin">{chip}</span>
                </p>
              ))}
            </div>
          </td>
          <td className="w-20 border-x border-gray-400">
            <div className="flex flex-wrap gap-1 justify-center items-center">
              {row.type.map((chip, i) => (
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
          <td className="w-28 border-x border-gray-400">
            <div className="flex flex-wrap gap-1 justify-center items-center">
              {row.categories.map((chip, i) => (
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

          <td className="w-32 border-x border-gray-400">{row.pm}</td>
          <td className="w-32 border-x border-gray-400">
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
          <td className="w-32 border-x border-gray-400">
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
          <td className=" w-48 border-x border-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
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
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pm.toLowerCase().includes(searchQuery.toLowerCase());

      const isWithinMonth = new Date(item.createdAt) >= oneMonthAgo;
      const isNotDone = !item.status.includes("Done");
      const isOngoing = item.status.includes("Ongoing");
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(
          (tag) =>
            item.status.includes(tag) ||
            item.type?.includes(tag) ||
            item.categories?.includes(tag)
        );

      return (
        matchesSearch &&
        matchesTags &&
        (showHidden || (isWithinMonth && isNotDone) || isOngoing)
      );
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
  const handleTitle = () => {
    setIsSorted((prev) => !prev);

    const sortedByTitle = [...sortedData].sort((a, b) => {
      return isSorted
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });

    setSortedDataLocal(sortedByTitle);
  };
  if (!tableData || !sortedData) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col h-screen">
      <section className="flex-grow overflow-x-scroll lg:overflow-x-hidden">
        <table className="border-collapse  mt-[6rem] select-none relative w-full table-fixed">
          <thead className="sf tracking-widest">
            <tr>
              <th className="w-10 sticky top-0 border-none bg-light text-dark shadow text-md z-10 h-10">
                ID
              </th>
              <th
                onClick={handleTitle}
                className="w-32 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10"
              >
                <div className=" flex items-center justify-center cursor-pointer">
                  Project Title
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
              <th className="w-20 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Client
              </th>
              <th className="w-20 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                PIC
              </th>
              <th
                onClick={handleDate}
                className="w-32 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10"
              >
                <div className=" flex items-center justify-center cursor-pointer">
                  Due Date
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
              <th className="w-20 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Progress
              </th>
              <th className="w-20 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Status
              </th>
              <th className="w-28 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Type
              </th>
              <th className="w-20 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                PM
              </th>
              <th className="w-32 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Final File
              </th>
              <th className="w-32 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Documents
              </th>
              <th className="w-32 sticky top-0 border-none  bg-light text-dark shadow text-md z-10 h-10">
                Note
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
      {/* <Produksi selectedProject={selectedRowData} /> */}
    </main>
  );
};

export default MainTable;
