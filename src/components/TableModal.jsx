import React, { useState } from "react";
import CreateModal from "./CreateModal";
import { Report, Kanban } from "../pages";

const TableModal = ({
  pro,
  showModal,
  setShowModal,
  updateData,
  deleteData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setShowModal(false);
    }
  };
  return (
    <>
      {showReportGenerator && (
        <Report setShowReportGenerator={setShowReportGenerator} pro={pro} updateData={updateData} />
      )}
      {showKanban && (
        <Kanban setKanban={setShowKanban} project={pro} updateData={updateData} />
      )}
      showModal && (
      <main
        onClick={handleBackdropClick}
        className="backdrop z-30 h-screen backdrop-blur w-full fixed top-0 left-0"
      >
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[95%] h-[35rem]">
          <section className="relative overflow-hidden h-full bg-light border border-dark rounded">
            <nav className="fixed w-full top-0 z-20 flex items-center justify-between p-3 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="z-10 font-body flex items-center gap-2 tracking-widest p-2 w-20 font-semibold transition ease-in-out hover:translate-x-1 active:scale-90 duration-300"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                </span>
                Back
              </button>
              <div className="flex flex-col items-center justify-center">
                <h1 className="font-body text-dark tracking-widest font-bold text-2xl">
                  {pro.title}
                </h1>
                <div className="flex font-body flex-wrap">
                  {[...pro.status, ...pro.categories, ...pro.type].map(
                    (chip, i) => (
                      <>
                        <p key={i} className="text-dark text-center">
                          &nbsp;
                          <span className=" tracking-widest text-[0.60rem] leading-[0.5rem] font-thin">
                            {chip}
                          </span>
                          &nbsp; |
                        </p>
                      </>
                    )
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  setShowKanban(true);
                }} className="size-10 flex items-center justify-center p-2 glass transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className=" bg-dark cursor-pointer text-light font-body tracking-widest rounded-md py-2 px-3 font-semibold transition ease-in-out hover:scale-105  duration-300 active:scale-95"
                >
                  Edit
                </button>
              </div>
            </nav>

            <main className="flex flex-col lg:flex-row w-full justify-start lg:items-start">
              <section className=" z-10 text-dark p-5 h-full w-full lg:w-1/2 mt-20">
                <p className="font-body tracking-widest font-bold text-xl">
                  {pro.client} - {pro.pic}
                </p>
                <p className="font-body tracking-widest font-bold text-md">
                  Due Date :
                  <span className="text-xs font-normal">
                    &nbsp;{new Date(pro.deadline).toLocaleDateString("en-GB")}
                  </span>{" "}
                </p>
                <p className="font-body tracking-widest font-bold text-md">
                  Project Manager :
                  <span className="text-xs font-normal">&nbsp;{pro.pm}</span>
                </p>
                <p className="font-body tracking-widest font-bold">Note :</p>
                <textarea
                  readOnly
                  className="no-scrollbar outline-none font-body tracking-widest h-32 w-96 pl-5 text-xs"
                  value={pro.note}
                />

                <div className="flex gap-3 items-center font-body tracking-widest font-bold">
                  {pro.final_file ? (
                    <a
                      href={pro.final_file}
                      target="_blank"
                      className="lg:w-56 lg:h-20 size-20 flex items-center justify-center p-2 glass transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-lg"
                    >
                      Final File
                    </a>
                  ) : null}
                  {pro.final_report_file ? (
                    <a
                      href={pro.final_report_file}
                      target="_blank"
                      className="lg:w-56 lg:h-20 size-20 flex items-center justify-center p-2 glass transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-lg"
                    >
                      Event Report
                    </a>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowReportGenerator(true);
                        }}
                        className="size-20 flex items-center justify-center p-2 glass transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <p className="absolute opacity-65 font-body tracking-widest bottom-16 lg:bottom-2 left-2">
                  Created at{" "}
                  {new Date(pro.createdAt).toLocaleDateString("en-GB")}
                </p>
              </section>
              <section className="relative z-10 text-dark p-5 h-full w-1/2 flex flex-col items-start mt-20 gradient">
                <p className="font-body tracking-widest font-bold">Crew :</p>
                <div className="flex flex-col flex-wrap h-40 overflow-y-auto">
                  {
                    pro.day?.[0]?.crew?.map((member, i) => (
                      <p
                        key={i}
                        className="pl-5 flex justify-start items-center font-body tracking-widest"
                      >
                        <span className="text-xs font-normal">
                          {member.name}
                        </span>
                      </p>
                    )) || <p className="text-xs pl-5">No crew members listed</p>
                  }
                </div>

              </section>
              <img
                src="/logo.webp"
                alt="logo"
                className="absolute select-none z-0 -bottom-20 -right-20 opacity-10 -rotate-12 mix-blend-difference object-contain"
              />
            </main>
          </section>
        </div>
      </main>
      {showEditModal && (
        <CreateModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          initialData={pro}
          updateData={updateData}
          isEditing={true}
          deleteData={deleteData}
          setTableModal={setShowModal}
        />
      )}
      )
    </>
  );
};

export default TableModal;
