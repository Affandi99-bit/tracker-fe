import React, { Suspense, useState, useEffect } from "react";
import { TableModal, Loader, ReadonlyModal, Tooltip } from "../components";
import { useToast } from "../components/ToastContext";
import { findTagColor } from "../utils/utils";
import Kanban from "./Kanban";
import Report from "./Report";

const calculateOverallProgress = ({ project }) => {
  if (!Array.isArray(project.kanban)) return 0;

  let totalSteps = 0;
  let completedSteps = 0;

  project.kanban.forEach(division => {
    if (!Array.isArray(division.steps)) return;

    division.steps.forEach(step => {
      if (!Array.isArray(step.items)) return;

      totalSteps += 1;

      const allItemsDone = step.items.length === 0
        ? true
        : step.items.every(item => item.done === true);
      if (allItemsDone) completedSteps += 1;
    });
  });

  return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
};

const DeleteModal = ({ show, onCancel, onConfirm, loading }) => {
  if (!show) return null;
  return (
    <div className="fixed top-0 left-0 z-50 glass w-full h-full flex items-center justify-center">
      <section className="bg-dark rounded-xl border border-light/50 p-5 text-light flex flex-col justify-center items-center w-xl h-48">
        <p className="text-center font-body mb-4">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>
        <div className="flex items-center gap-5 w-full mt-5 justify-end">
          <button
            className="w-20 h-10 border border-light text-light rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="w-20 h-10 bg-light text-dark rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                className="size-4 animate-spin"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
                  stroke="#222222"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) :
              "Delete"
            }
          </button>
        </div>
      </section>
    </div>
  );
};

const DataTable = ({
  tableData,
  setSelectedRowData,
  setShowModal,
  setSelectedKanbanProject,
  setKanban,
  setShowReadonlyModal,
  setReadonlyRow,
  deleteData,
  updateData,
  setShowReport,
  setReportRow
}) => {
  const [loadingId, setLoadingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const { showToast } = useToast();

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowModal(true);
  };

  const handleDeleteClick = (row) => {
    setRowToDelete(row);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoadingId(rowToDelete._id);
    try {
      await deleteData(rowToDelete._id);
      setShowDeleteModal(false);
      showToast("Project Deleted", "error");
    } finally {
      setLoadingId(null);
      setRowToDelete(null);
    }
  };

  return (
    <>
      <tbody className="text-center mx-10 ">
        {tableData.map((row, index) => {
          return (
            <tr
              onClick={() => handleRowClick(row)}
              className={`h-20 w-screen font-body tracking-widest focus:outline-none focus:brightness-75 ${index % 2 === 0 ? "bg-[#262626]" : "bg-[#303030]"
                } hover:brightness-90`}
              key={row._id}
            >
              <td className="text-xs font-bold tracker-wider text-light text-start pl-7">{row.title}</td>
              <td className="text-xs font-semibold text-light text-start pl-2">{row.client}</td>
              <td className="text-xs font-semibold text-light text-start pl-2">{row.pic}</td>
              <td className="text-xs font-semibold text-light text-start pl-2">{row.day[0].crew
                .filter(member => member.roles && member.roles.includes("Project Manager"))
                .map(member => member.name)
                .join(", ")
              }</td>
              <td className="text-xs font-bold text-start pl-2 text-[#269fc6]">
                {new Date(row.deadline).toLocaleDateString("en-GB")}
              </td>
              <td className="text-xs pl-2">
                <div className="flex flex-wrap gap-1 justify-start items-center">
                  {/* Show categories chips */}
                  {row.categories.map((chip, i) => (
                    <p
                      key={`cat-${i}`}
                      style={{
                        backgroundColor: findTagColor(chip),
                      }}
                      className="rounded-xl w-18 h-5 text-light text-[0.60rem] font-semibold tracking-widest flex items-center justify-center"
                    >
                      {chip}
                    </p>
                  ))}
                  {/* Show type chips */}
                  {Array.isArray(row.type) && row.type.map((type, i) => (
                    <p
                      key={`type-${i}`}
                      style={{
                        backgroundColor: findTagColor(type),
                      }}
                      className="rounded-xl w-18 h-5 text-light text-[0.60rem] font-semibold tracking-widest flex items-center justify-center "
                    >
                      {type}
                    </p>
                  ))}
                </div>
              </td>
              <td className="text-xs text-start pl-2">
                <div className="flex flex-col gap-1 justify-start items-start">
                  <div className="w-28 rounded-full h-2.5 bg-gray-700/25">
                    <div
                      className="bg-light h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${calculateOverallProgress({ project: row })}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-[#269fc6] text-xs w-28 text-end">
                    {Math.round(calculateOverallProgress({ project: row }))}%
                  </p>
                </div>
              </td>
              <td className=" text-xs">
                <div className="w-full flex px-2 gap-3 justify-start items-center">
                  {/* Track */}
                  <Tooltip position="bottom" content={"Kanban"}>
                    <button
                      id="track-button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedKanbanProject(row);
                        setKanban(true);
                      }}
                      className=""
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f8f8f8" className="size-4 hover:size-5 hover:scale-105 duration-300 active:scale-95 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                      </svg>
                    </button>
                  </Tooltip>
                  {/* Report */}
                  <Tooltip position="bottom" content={"BA Generator"}>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setReportRow(row);
                        setShowReport(true);
                      }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f8f8f8" className="size-4 hover:size-5 hover:scale-105 duration-300 active:scale-95 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </button>
                  </Tooltip>
                  {/* Share */}
                  <Tooltip position="bottom" content={"Share"}>
                    <button
                      id="share-button"
                      onClick={e => {
                        e.stopPropagation();
                        setReadonlyRow(row);
                        setShowReadonlyModal(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#f8f8f8" className="size-4 hover:size-5 hover:scale-105 duration-300 active:scale-95 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                    </button>
                  </Tooltip>
                  {/* Delete */}
                  <Tooltip position="bottom" content={"Delete"}>
                    <button
                      id="delete-button"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteClick(row);
                      }}
                    >
                      {loadingId === row._id ? (
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 24 24"
                          className="size-4 animate-spin"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
                            stroke="#f8f8f8"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#f8f8f8" className="size-4 hover:size-5 hover:scale-105 duration-300 active:scale-95 cursor-pointer">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      )}
                    </button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
      <DeleteModal
        show={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setRowToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={loadingId !== null}
      />
    </>
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

  const [kanban, setKanban] = useState(false);
  const [selectedKanbanProject, setSelectedKanbanProject] = useState(null);
  const [showReadonlyModal, setShowReadonlyModal] = useState(false);
  const [readonlyRow, setReadonlyRow] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportRow, setReportRow] = useState(null);

  useEffect(() => {
    if (!tableData) return;

    const filteredTableData = tableData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pm.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(
          (tag) =>
            (item.done === "boolean" && item.done.includes(tag)) ||
            item.type?.includes(tag) ||
            item.categories?.includes(tag)
        );

      const isNotDone = item.done !== true && !item.archived;
      const isOngoing = item.done === false;

      return matchesSearch && matchesTags && (showHidden || isNotDone || isOngoing);
    });

    const sorted = [...filteredTableData].sort((a, b) =>
      isSortedDesc
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setSortedData(sorted);
    setSortedDataLocal(sorted);
  }, [tableData, isSortedDesc, searchQuery, selectedTags, showHidden]);

  const handleDate = () => {
    setIsSorted(prev => !prev);
    const sortedByDeadline = [...sortedData].sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return isSorted ? dateA - dateB : dateB - dateA;
    });
    setSortedDataLocal(sortedByDeadline);
  };

  const handleTitle = () => {
    setIsSorted(prev => !prev);
    const sortedByTitle = [...sortedData].sort((a, b) =>
      isSorted ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    setSortedDataLocal(sortedByTitle);
  };

  if (!tableData || !sortedData) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col h-screen z-40">
      <section className="flex-grow mt-20 mb-3 md:mx-12 rounded-2xl overflow-x-scroll no-scrollbar">
        <table className="border-collapse mt-0 select-none relative w-full table-fixed">
          <thead className="font-body tracking-widest">
            <tr className="text-start">
              <th onClick={handleTitle} className="w-40 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark rounded-tl-2xl">
                <div className="px-2 flex items-center justify-start gap-2 cursor-pointer">
                  Project Title
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>

                </div>
              </th>
              <th className="text-start px-2 w-20 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark">Client</th>
              <th className="text-start px-2 w-20 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark">PIC Client</th>
              <th className="text-start px-2 w-20 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark">PM</th>
              <th onClick={handleDate} className="text-start px-2 w-20 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark">
                <div className="flex items-center justify-start cursor-pointer">Due Date <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
                </div>
              </th>
              <th className="text-start px-2 w-32 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark">Type</th>
              <th className="text-start px-2 w-28 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark">Progress</th>
              <th className="text-start px-2 w-20 sticky top-0 border-none text-sm z-10 h-10 bg-light text-dark rounded-tr-2xl">Action</th>
            </tr>
          </thead>
          <Suspense fallback={<Loader />}>
            <DataTable
              tableData={sortedData}
              setSelectedRowData={setSelectedRowData}
              setShowModal={setShowModal}
              deleteData={deleteData}
              updateData={updateData}
              setSelectedKanbanProject={setSelectedKanbanProject}
              setKanban={setKanban}
              setShowReadonlyModal={setShowReadonlyModal}
              setReadonlyRow={setReadonlyRow}
              setShowReport={setShowReport}
              setReportRow={setReportRow}
            />
          </Suspense>
        </table>
      </section>

      {kanban && selectedKanbanProject && (
        <Kanban
          setKanban={setKanban}
          updateData={updateData}
          project={selectedKanbanProject}
          selectedTypes={selectedKanbanProject.type}
        />
      )}
      {showReadonlyModal && (
        <ReadonlyModal
          key={readonlyRow?._id}
          link={`${window.location.origin}/readonly/${readonlyRow._id}`}
          onClose={() => setShowReadonlyModal(false)}
        />
      )}
      {showModal && (
        <TableModal
          pro={selectedRowData}
          showModal={showModal}
          setShowModal={setShowModal}
          updateData={updateData}
          deleteData={deleteData}
        />
      )}
      {showReport && (
        <Report
          setShowReportGenerator={setShowReport}
          pro={reportRow}
          updateData={updateData}
        />
      )}
    </main>
  );
};

export default MainTable;
