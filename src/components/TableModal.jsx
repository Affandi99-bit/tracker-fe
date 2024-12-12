import { useState } from "react";
import CreateModal from "./CreateModal";
import { findTagColor } from "../utils/utils";
import { Report } from "../pages";
const TableModal = ({
  pro,
  showModal,
  setShowModal,
  updateData,
  deleteData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setShowModal(false);
    }
  };

  return (
    showModal && (
      <main
        onClick={handleBackdropClick}
        className="backdrop z-30 h-screen w-full fixed top-0 backdrop-blur-[2px]"
      >
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <section className="relative rounded-lg  bg-dark shadow-lg w-screen h-screen lg:w-[80rem] lg:h-[30rem]">
            <button
              onClick={() => setShowModal(false)}
              className="z-20 absolute right-5 top-10 lg:top-5 bg-red-500 text-white montserrat rounded-md py-2 px-3 font-semibold tracking-wide transition ease-in-out hover:scale-105  duration-300 active:scale-95"
            >
              Close
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              className="z-10 absolute right-5 bottom-16 lg:bottom-5 bg-green-500 text-white montserrat rounded-md py-2 px-3 font-semibold tracking-wide transition ease-in-out hover:scale-105  duration-300 active:scale-95"
            >
              Edit
            </button>

            <main className="flex flex-col-reverse lg:flex-row w-full justify-start lg:items-start">
              <section className="text-light p-5 h-full w-full lg:w-1/2">
                <h1 className="montserrat font-bold text-2xl">{pro.title}</h1>
                <div className="flex flex-wrap">
                  {pro.status.map((chip, i) => (
                    <p
                      key={i}
                      style={{
                        backgroundColor: findTagColor(chip),
                      }}
                      className="rounded-md w-[15%] text-center p-1 m-1"
                    >
                      <span className="text-white text-sm font-extralight">
                        {chip}
                      </span>
                    </p>
                  ))}
                </div>
                <h3 className="montserrat mb-5 text-lg font-bold">
                  {pro.client} - {pro.pic}
                </h3>
                <p className="montserrat">
                  <span className="font-bold">Project Manager :</span> {pro.pm}
                </p>
                <p className="montserrat font-bold">Note :</p>
                <p className=" montserrat pl-5 text-sm">{pro.note}</p>
              </section>
              <section className="z-10 text-light p-5 h-full w-1/2 flex flex-col items-start">
                <div>
                  <h1 className="montserrat font-bold text-2xl">
                    Event Date : {pro.deadline}
                  </h1>
                  <p className="montserrat font-bold">Crew :</p>
                  <div className="flex flex-col flex-wrap h-40">
                    {pro.crew.map((member, i) => (
                      <p key={i} className="pl-10">
                        {member}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-32 lg:bottom-20 flex gap-3 items-center montserrat font-bold tracking-wider">
                  {pro.final_file ? (
                    <a
                      href={pro.final_file}
                      target="_blank"
                      className="lg:w-56 lg:h-20 size-20 flex items-center justify-center p-2 backdrop-blur-[2px] bg-light text-light bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 rounded-lg"
                    >
                      Final File
                    </a>
                  ) : null}
                  {pro.final_report_file ? (
                    <a
                      href={pro.final_report_file}
                      target="_blank"
                      className="lg:w-56 lg:h-20 size-20 flex items-center justify-center p-2 backdrop-blur-[2px] bg-light text-light bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 rounded-lg"
                    >
                      Event Report
                    </a>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          // setShowReportGenerator(true);
                          alert("BA Generator Under Development");
                        }}
                        className="size-20 flex items-center justify-center p-2 backdrop-blur-[2px] bg-light text-light bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 rounded-lg"
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
                <p className="absolute opacity-65 montserrat tracking-wide bottom-16 lg:bottom-2 left-2">
                  Created at{" "}
                  {new Date(pro.createdAt).toLocaleDateString("en-GB")}
                </p>
              </section>
              <img
                src="/logo.png"
                alt="logo"
                className="opacity-5  absolute right-0 top-20 z-0 object-contain -rotate-12"
              />
            </main>
          </section>
        </div>

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

        {showReportGenerator && (
          <Report setShowReportGenerator={setShowReportGenerator} />
        )}
      </main>
    )
  );
};

export default TableModal;
