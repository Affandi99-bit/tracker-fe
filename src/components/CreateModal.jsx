import { useState } from "react";
import { tags } from "../constant/constant";
const CreateModal = ({
  showModal,
  setShowModal,
  addNewData,
  updateData,
  deleteData,
  isEditing,
  initialData,
  setTableModal,
}) => {
  const fromDatas = {
    title: "",
    pm: "",
    deadline: "",
    status: [],
    crew: [],
    client: "",
    pic: "",
    final_file: "",
    final_report_file: "",
    note: "",
  };
  const [formData, setFormData] = useState(isEditing ? initialData : fromDatas);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setShowModal(false);
    }
  };
  const inputHandle = (e) => {
    const { name, value, checked } = e.target;
    if (name === "crew") {
      const crewArray = value.split(",").map((member) => member.trim());
      setFormData({ ...formData, [name]: crewArray });
    } else if (name === "status") {
      if (checked) {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateData(formData);
      setTableModal(false);
    } else {
      await addNewData(formData);
    }
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (isEditing && formData._id) {
      await deleteData(formData._id);
      setShowModal(false);
      setTableModal(false);
    }
  };

  return (
    showModal && (
      <div>
        <main
          className="backdrop fixed z-20 top-0 w-full h-screen backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <section className="relative overflow-y-scroll lg:overflow-y-hidden rounded-lg bg-dark shadow-lg lg:w-max lg:h-full w-screen h-full">
              <div className="flex justify-between items-center p-2">
                <p className="hidden lg:block montserrat font-bold text-2xl text-white">
                  {isEditing ? "EDIT TASK" : "CREATE NEW TASK"}
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="z-10 bg-red-500 text-white montserrat rounded-md p-2 w-20 font-semibold tracking-wide transition ease-in-out hover:scale-105  duration-300 active:scale-95"
                >
                  Close
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full h-full lg:flex flex-col gap-1 p-2 "
              >
                <div className="w-full lg:flex gap-1 flex-col">
                  <div className="flex flex-col lg:flex-row gap-1">
                    <input
                      required
                      placeholder="Title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={inputHandle}
                      className="rounded-md p-2 w-full montserrat outline-none"
                    />
                    <label
                      htmlFor="deadline"
                      className="rounded-md p-2 w-full bg-white montserrat outline-none flex justify-between items-center"
                    >
                      <p className="text-gray-400">Event Date:</p>
                      <input
                        required
                        className="bg-white"
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={inputHandle}
                      />
                    </label>
                  </div>
                  <section className="flex flex-col lg:flex-row gap-1">
                    <input
                      required
                      placeholder="Client"
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={inputHandle}
                      className="rounded-md p-2 w-full montserrat outline-none"
                    />

                    <input
                      required
                      placeholder="Client PIC"
                      type="string"
                      name="pic"
                      value={formData.pic}
                      onChange={inputHandle}
                      className="rounded-md p-2 w-full montserrat outline-none"
                    />
                  </section>
                  <input
                    required
                    placeholder="Project Manager"
                    type="text"
                    name="pm"
                    value={formData.pm}
                    onChange={inputHandle}
                    className="rounded-md p-2 w-full montserrat outline-none"
                  />
                </div>
                <div className="lg:flex flex-col gap-1 w-full">
                  <div className="lg:flex gap-1">
                    <input
                      required
                      type="text"
                      placeholder="Crew(comma-separated)"
                      name="crew"
                      value={formData.crew.join(", ")}
                      onChange={inputHandle}
                      className="rounded-md p-2 h-full w-full montserrat outline-none"
                    />
                    <input
                      placeholder="Document Links"
                      type="text"
                      name="final_report_file"
                      value={formData.final_report_file}
                      onChange={inputHandle}
                      className="rounded-md p-2 h-full w-full montserrat outline-none"
                    />
                    <input
                      placeholder="Final File Link"
                      type="text"
                      name="final_file"
                      value={formData.final_file}
                      onChange={inputHandle}
                      className="rounded-md p-2 h-full w-full montserrat outline-none"
                    />
                  </div>
                  {/* TAGS */}
                  <section className="lg:flex gap-1">
                    {/* Progress */}
                    <div className="rounded-md bg-white p-2 w-full">
                      <p className="montserrat text-gray-400 font-medium">
                        Progress
                      </p>
                      {tags.progress.map((option) => (
                        <label
                          htmlFor={`hr-${option.value}`}
                          key={option.value}
                          className={`flex flex-row items-center gap-2 montserrat cursor-pointer text-gray-400`}
                        >
                          <input
                            id={`hr-${option.value}`}
                            type="checkbox"
                            name="progress"
                            value={option.value}
                            checked={formData.status.includes(option.value)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const { value } = e.target;
                              let updatedStatus = [...formData.status];
                              if (isChecked) {
                                updatedStatus = [...formData.status, value];
                              } else {
                                updatedStatus = formData.status.filter(
                                  (status) => status !== value
                                );
                              }
                              setFormData((prevState) => ({
                                ...prevState,
                                status: updatedStatus,
                              }));
                            }}
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
                    {/* Type */}
                    <div className="rounded-md bg-white p-2 w-full">
                      <p className="montserrat text-gray-400 font-medium">
                        Project Type
                      </p>
                      {tags.projectType.map((option) => (
                        <label
                          htmlFor={`hr-${option.value}`}
                          key={option.value}
                          className={`flex flex-row items-center gap-2 montserrat cursor-pointer text-gray-400`}
                        >
                          <input
                            id={`hr-${option.value}`}
                            type="checkbox"
                            name="type"
                            value={option.value}
                            checked={formData.status.includes(option.value)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const { value } = e.target;
                              let updatedStatus = [...formData.status];
                              if (isChecked) {
                                updatedStatus = [...formData.status, value];
                              } else {
                                updatedStatus = formData.status.filter(
                                  (status) => status !== value
                                );
                              }
                              setFormData((prevState) => ({
                                ...prevState,
                                status: updatedStatus,
                              }));
                            }}
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

                    {/* Add-ons */}
                    <div className="rounded-md bg-white p-2 w-full">
                      <p className="montserrat text-gray-400 font-medium">
                        Add-on
                      </p>
                      {tags.addons.map((option) => (
                        <label
                          htmlFor={`hr-${option.value}`}
                          key={option.value}
                          className={`flex flex-row items-center gap-2 montserrat cursor-pointer text-gray-400`}
                        >
                          <input
                            id={`hr-${option.value}`}
                            type="checkbox"
                            name="status"
                            value={option.value}
                            checked={formData.status.includes(option.value)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const { value } = e.target;
                              let updatedStatus = [...formData.status];
                              if (isChecked) {
                                updatedStatus = [...formData.status, value];
                              } else {
                                updatedStatus = formData.status.filter(
                                  (status) => status !== value
                                );
                              }
                              setFormData((prevState) => ({
                                ...prevState,
                                status: updatedStatus,
                              }));
                            }}
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
                    {/* Categories */}
                    <section className="rounded-md bg-white p-2">
                      <p className="montserrat text-gray-400 font-medium">
                        Project Categories
                      </p>
                      <div className="flex w-64 justify-between flex-wrap">
                        {tags.projectCategories.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row w-32 items-center gap-1  montserrat cursor-pointer text-gray-400`}
                          >
                            <input
                              id={`hr-${option.value}`}
                              type="checkbox"
                              name="status"
                              value={option.value}
                              checked={formData.status.includes(option.value)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const { value } = e.target;
                                let updatedStatus = [...formData.status];
                                if (isChecked) {
                                  updatedStatus = [...formData.status, value];
                                } else {
                                  updatedStatus = formData.status.filter(
                                    (status) => status !== value
                                  );
                                }
                                setFormData((prevState) => ({
                                  ...prevState,
                                  status: updatedStatus,
                                }));
                              }}
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
                  </section>
                </div>
                {/* Notes */}
                <div className="flex justify-between">
                  <textarea
                    placeholder="Notes"
                    name="note"
                    value={formData.note}
                    onChange={inputHandle}
                    className="rounded-md p-2 w-full h-32 montserrat outline-none"
                  />
                </div>
                {/* Buttons */}
                <div className="flex gap-1">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-500 text-white montserrat rounded-md py-2 w-full font-semibold tracking-wide"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-green-500 text-white montserrat rounded-md py-2 w-full font-semibold tracking-wide"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    )
  );
};

export default CreateModal;
