import React, { Suspense, useState, useEffect } from "react";
import { TableModal, Loader } from "../components";
import { findTagColor } from "../utils/utils";
const DataTable = ({ tableData, setSelectedRowData, setShowModal }) => {
  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowModal(true);
  };

  return (
    <tbody className="text-center">
      {tableData.map((row, index) => (
        <tr
          onClick={() => handleRowClick(row)}
          className="cursor-pointer montserrat text-xs font-medium tracking-wide h-20  transition ease-in-out hover:opacity-75 duration-300"
          style={{
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#E8E8E8",
          }}
          key={row._id}
        >
          <td className="p-2 font-semibold">{index + 1}</td>
          <td className="p-2">{row.title}</td>
          <td className="p-2 ">{row.client}</td>
          <td className="p-2 ">{row.pic}</td>
          <td className="p-2">{row.deadline}</td>
          <td className="p-2 flex-flex-col justify-center items-center w-full">
            {row.status.map((chip, i) => (
              <p
                key={i}
                style={{
                  backgroundColor: findTagColor(chip),
                }}
                className="rounded-md w-2/3 p-1 m-1"
              >
                <span className="text-white text-sm font-extralight">
                  {chip}
                </span>
              </p>
            ))}
          </td>
          <td className="p-2 flex flex-col items-center justify-center h-32">
            {row.crew.map((member, i) => (
              <p key={i}>{member}</p>
            ))}
          </td>
          <td className="p-2">{row.pm}</td>
          <td className="p-2 truncate">{row.final_file}</td>
          <td className="p-2 truncate">{row.final_report_file}</td>
          <td className="p-2 truncate">{row.note}</td>
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

  useEffect(() => {
    const sorted = tableData.sort((a, b) => {
      return isSortedDesc
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });
    setSortedData(sorted);
  }, [tableData, isSortedDesc]);

  const filteredData = tableData.filter((item) => {
    const Month = new Date();
    Month.setMonth(Month.getMonth() - 1);

    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const isOngoing =
      (new Date(item.createdAt) >= Month &&
        new Date(item.createdAt) <= new Date()) ||
      item.status == "ongoing";

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => item.status.includes(tag));

    return matchesSearch && matchesTags && (showHidden || isOngoing);
  });

  return (
    <>
      <table className="table-fixed select-none w-full mt-[3rem] ">
        <thead className="sticky overflow-x-scroll top-[3.5rem] bg-dark text-light text-md z-10 h-10 montserrat">
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>CLIENT</th>
            <th>PIC</th>
            <th>EVENT DATE</th>
            <th>TAGS</th>
            <th>CREW</th>
            <th>PM</th>
            <th>FINAL FILE</th>
            <th>DOCUMENTS</th>
            <th>NOTE</th>
          </tr>
        </thead>
        <Suspense fallback={<Loader />}>
          <DataTable
            tableData={filteredData}
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
    </>
  );
};

export default MainTable;
