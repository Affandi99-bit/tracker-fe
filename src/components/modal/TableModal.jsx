import React, { useState } from "react";
import CreateModal from "./CreateModal";

const TableModal = ({
  pro,
  setShowModal,
  updateData,
  deleteData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setShowModal(false);
    }
  };
  return (
    <>
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
      showModal && (
      <main
        onClick={handleBackdropClick}
        className="backdrop z-30 h-screen backdrop-blur w-full fixed top-0 left-0 flex items-center justify-center"
      >
        <div className=" w-full md:w-[50rem]">
          <section className="relative w-full overflow-hidden h-full bg-dark border border-light rounded-xl">
            {/* Navbar */}
            <nav className=" flex items-center justify-between p-3 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="z-10 text-xs text-light font-body flex items-center gap-2 tracking-widest p-2 w-20 font-semibold transition ease-in-out hover:translate-x-1 active:scale-90 duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#f8f8f8"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
                Back
              </button>
              <div className="flex items-center gap-2">
                {/* Edit */}
                <button
                  onClick={() => setShowEditModal(true)}
                  className=" bg-light cursor-pointer text-dark font-body tracking-widest rounded-md py-2 px-3 font-semibold transition ease-in-out hover:scale-105  duration-300 active:scale-95"
                >
                  Edit
                </button>
              </div>
            </nav>
            {/* Body */}
            <main className="overflow-y-scroll flex flex-col w-full justify-start items-start z-10 text-light font-body p-5 mt-3" style={{ maxHeight: "70vh" }}>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Title</p>
                <p className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{pro.title}</p>
              </div>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Client</p>
                <p className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{pro.client}</p>
              </div>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Person in contact</p>
                <p className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{pro.pic}</p>
              </div>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Project Manager</p>
                <p className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{pro.day[0].crew
                  .filter(member => member.roles && member.roles.includes("Project Manager"))
                  .map(member => member.name)
                  .join(", ")
                }</p>
              </div>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Due Date</p>
                <p className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{new Date(pro.deadline).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Created at</p>
                <p className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{new Date(pro.createdAt).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="flex items-start justify-center mt-2 w-full">
                <p className="w-1/2 text-sm tracking-wide">Crew</p>
                <div className="w-1/2 text-sm font-semibold tracking-widest">:&nbsp;{
                  pro.day?.[0]?.crew?.map((member, i) => (
                    <p
                      key={i}
                      className="pl-5 mt-3 w-full flex items-start justify-center"
                    >
                      <span className="w-1/2">
                        {member.name}
                      </span>
                      <span className="w-1/2 font-normal tracking-normal">
                        :&nbsp;{member.roles.join(', ')}
                      </span>
                    </p>
                  )) || <p className="">No crew members listed</p>
                }</div>
              </div>
            </main>
          </section>
        </div>
      </main>
      )

    </>
  );
};

export default TableModal;
