import { useState } from "react";
import { tags, crew, payment } from "../constant/constant";

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
    payment: "",
  };
  const [formData, setFormData] = useState(isEditing ? initialData : fromDatas);
  const [newCrewMember, setNewCrewMember] = useState("");
  const [additionalCrewMembers, setAdditionalCrewMembers] = useState(
    isEditing
      ? formData.crew
          .filter(
            (member) =>
              !crew.some(
                (constantMember) => constantMember.name === member.name
              )
          )
          .map((member) => ({
            id: Date.now() + Math.random(),
            value: member.name,
          }))
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setShowModal(false);
    }
  };
  const inputHandle = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "crew" && type === "checkbox") {
      const updatedCrew = checked
        ? [...formData.crew, { name: value }]
        : formData.crew.filter((member) => member.name !== value);
      setFormData({ ...formData, crew: updatedCrew });
    } else if (name === "status" && type === "checkbox") {
      const updatedStatus = checked
        ? [...formData.status, value]
        : formData.status.filter((status) => status !== value);
      setFormData({ ...formData, status: updatedStatus });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addNewCrewMember = () => {
    if (newCrewMember.trim()) {
      const updatedCrew = [...formData.crew, { name: newCrewMember.trim() }];
      setFormData({ ...formData, crew: updatedCrew });
      setNewCrewMember("");
    }
  };
  const addAdditionalCrewField = () => {
    setAdditionalCrewMembers((prev) => [
      ...prev,
      { id: Date.now(), value: "" },
    ]);
  };

  const handleAdditionalCrewChange = (id, value) => {
    setAdditionalCrewMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, value } : member))
    );
  };

  const removeAdditionalCrewField = (id) => {
    setAdditionalCrewMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // const allCrew = [
    //   ...crew.filter((member) =>
    //     formData.crew.some((selected) => selected.name === member.name)
    //   ),
    //   ...additionalCrewMembers.map((member) => ({ name: member.value })),
    // ];
    const allCrew = [
      ...crew
        .filter((member) =>
          formData.crew.some((selected) => selected.name === member.name)
        )
        .map((member) => ({
          name: member.name,
          payment:
            formData.crew.find((selected) => selected.name === member.name)
              ?.payment || "",
        })),
      ...additionalCrewMembers.map((member) => ({
        name: member.value,
        payment: "",
      })),
    ];
    const finalData = { ...formData, crew: allCrew };

    console.log("Form Data Submitted:", formData);
    if (isEditing) {
      await updateData(finalData);
      setTableModal(false);
    } else {
      await addNewData(finalData);
    }
    setShowModal(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (isEditing && formData._id) {
      setIsLoadingDelete(true);
      await deleteData(formData._id);
      setShowModal(false);
      setTableModal(false);
    }
  };

  return (
    showModal && (
      <div>
        <main
          className="backdrop fixed overflow-y-auto z-20 top-0 w-full h-screen backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <div
            className={`absolute overflow-auto max-h-[90dvh] no-scrollbar flex justify-center items-start gap-1 bottom-0 left-1/2 transform -translate-x-1/2`}
          >
            <section className="relative rounded-lg bg-dark shadow-lg w-screen md:w-[44rem] h-full">
              <div className="flex justify-between items-center p-2">
                <p className="sf tracking-widest font-bold text-2xl text-white">
                  {isEditing ? "EDIT TASK" : "CREATE NEW TASK"}
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="z-10 bg-red-500 text-white sf tracking-widest rounded-md p-2 w-20 font-semibold transition ease-in-out hover:scale-105  duration-300 active:scale-95"
                >
                  Close
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full h-full lg:flex flex-col gap-1 p-2 "
              >
                <section className="flex gap-1  ">
                  <div className="w-full lg:flex gap-1 flex-col">
                    <div className="flex flex-col lg:flex-row gap-1 mb-1 lg:mb-0">
                      <input
                        required
                        placeholder="Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={inputHandle}
                        className="rounded-md p-2 w-full sf tracking-widest outline-none"
                      />
                      <label
                        htmlFor="deadline"
                        className="rounded-md p-2 w-full text-gray-400 bg-white sf tracking-widest outline-none flex justify-between items-center"
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
                    <section className="flex flex-row gap-1">
                      <input
                        required
                        placeholder="Client"
                        type="text"
                        name="client"
                        value={formData.client}
                        onChange={inputHandle}
                        className="rounded-md p-2 w-full sf tracking-widest outline-none mb-1 lg:mb-0"
                      />

                      <input
                        required
                        placeholder="Client PIC"
                        type="string"
                        name="pic"
                        value={formData.pic}
                        onChange={inputHandle}
                        className="rounded-md p-2 w-full sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </section>
                    <div className="flex gap-1">
                      <select
                        required
                        name="pm"
                        value={formData.pm}
                        onChange={inputHandle}
                        className="rounded-md text-gray-500 p-2 w-1/2 sf tracking-widest outline-none mb-1 lg:mb-0 "
                      >
                        <option className="" value="">
                          Select PM
                        </option>
                        {crew.map((option) => (
                          <option
                            className="bg-dark text-gray-400"
                            key={option.index}
                            value={option.name}
                          >
                            {option.name}
                          </option>
                        ))}
                      </select>
                      {/* Type */}
                      <div className="rounded-md bg-white p-2 flex gap-1 w-1/2">
                        <p className="sf hidden md:block tracking-widest text-gray-400 font-medium">
                          Type :
                        </p>
                        {tags.projectType.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row w-32 items-center gap-2 sf tracking-widest cursor-pointer text-gray-400`}
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
                    </div>

                    <div className="flex gap-1">
                      <input
                        placeholder="Document Links"
                        type="text"
                        name="final_report_file"
                        value={formData.final_report_file}
                        onChange={inputHandle}
                        className="rounded-md p-2 h-full w-full sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                      <input
                        placeholder="Final File Link"
                        type="text"
                        name="final_file"
                        value={formData.final_file}
                        onChange={inputHandle}
                        className="rounded-md p-2 h-full w-full sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </div>
                  </div>
                </section>
                <div className="lg:flex flex-col gap-1 w-full">
                  <section className="flex-wrap lg:flex-nowrap flex gap-1">
                    {/* Crew */}
                    <div className="rounded-md w-[36rem] bg-white p-2 ">
                      <p className="sf tracking-widest text-gray-400 font-medium">
                        Crew
                      </p>
                      <div className="flex flex-wrap overflow-x-hidden">
                        {crew.map((option, index) => (
                          <label
                            key={index}
                            className={`flex flex-row items-center w-1/2 gap-2 sf tracking-widest cursor-pointer text-gray-400`}
                          >
                            <input
                              type="checkbox"
                              name="crew"
                              value={option.name}
                              checked={formData.crew.some(
                                (member) => member.name === option.name
                              )}
                              onChange={inputHandle}
                              className="peer hidden"
                            />
                            <div className="size-5 flex rounded-md border border-[#a2a1a833] bg-dark peer-checked:bg-light transition">
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
                            {option.name}
                          </label>
                        ))}
                        <section>
                          {additionalCrewMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-1 text-gray-400"
                            >
                              <input
                                type="text"
                                placeholder="Add Crew"
                                value={member.value}
                                onChange={(e) =>
                                  handleAdditionalCrewChange(
                                    member.id,
                                    e.target.value
                                  )
                                }
                                className="bg-white border-b border-gray-400 outline-none p-1 w-[80%]"
                              />
                              <button
                                type="button"
                                className="text-lg"
                                onClick={() =>
                                  removeAdditionalCrewField(member.id)
                                }
                              >
                                -
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="text-gray-400"
                            onClick={addAdditionalCrewField}
                          >
                            Additional crew +
                          </button>
                        </section>
                      </div>
                    </div>

                    <main className="flex flex-row lg:flex-col gap-1 w-full">
                      {/* Progress */}
                      <div className="rounded-md bg-white p-2 w-full ">
                        <p className="sf tracking-widest text-gray-400 font-medium">
                          Progress
                        </p>
                        {tags.progress.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row items-center gap-2 sf tracking-widest cursor-pointer text-gray-400 `}
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
                      {/* Add-ons */}
                      <div className="rounded-md bg-white p-2 w-full">
                        <p className="sf tracking-widest text-gray-400 font-medium">
                          Add-on
                        </p>
                        {tags.addons.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row items-center gap-2 sf tracking-widest cursor-pointer text-gray-400`}
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
                    </main>
                    {/* Categories */}
                    <div className="rounded-md bg-white p-2 w-full">
                      <p className="sf tracking-widest text-gray-400 font-medium">
                        Project Categories
                      </p>
                      <div className="flex w-64 justify-between flex-wrap">
                        {tags.projectCategories.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row w-32 items-center gap-1  sf tracking-widest cursor-pointer text-gray-400`}
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
                    </div>
                  </section>
                </div>

                {/* Notes */}
                <div className="flex items-center justify-end gap-1 my-1 lg:my-0">
                  <textarea
                    placeholder="Notes"
                    name="note"
                    value={formData.note}
                    onChange={inputHandle}
                    className="rounded-md p-2 w-full h-32 sf tracking-widest outline-none"
                  />
                  <div className="rounded-md bg-white h-32 p-2 w-1/3 ">
                    <p className="sf tracking-widest text-gray-400 font-medium">
                      Payment Client
                    </p>
                    {payment.map((option) => (
                      <label
                        htmlFor={`hr-${option.value}`}
                        key={option.value}
                        className={`flex flex-row items-center gap-2 sf tracking-widest cursor-pointer text-gray-400`}
                      >
                        <input
                          id={`hr-${option.value}`}
                          type="checkbox"
                          name="payment"
                          value={option.value}
                          checked={formData.payment.includes(option.value)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const { value } = e.target;
                            let updatedPayment = [...formData.payment];
                            if (isChecked) {
                              updatedPayment = [...formData.payment, value];
                            } else {
                              updatedPayment = formData.payment.filter(
                                (payment) => payment !== value
                              );
                            }
                            setFormData((prevState) => ({
                              ...prevState,
                              payment: updatedPayment,
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
                </div>
                {/* Buttons */}
                <div className="flex gap-1">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-500 flex items-center justify-center gap-1 text-white sf tracking-widest rounded-md py-2 w-full font-semibold"
                    >
                      Delete
                      {isLoadingDelete && (
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 24 24"
                          className="size-5 animate-spin"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
                            stroke="#f8f8f8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  <button
                    type="submit"
                    onClick={addNewCrewMember}
                    className="bg-green-500 flex justify-center gap-1 items-center text-white sf tracking-widest rounded-md py-2 w-full font-semibold"
                  >
                    {isEditing ? "Update" : "Add"}
                    {isLoading && (
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        className="size-5 animate-spin"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
                          stroke="#f8f8f8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </section>{" "}
            {isEditing ? (
              <div className="relative bg-dark">
                <section className="w-96 relative rounded-lg border-light ">
                  <p className="sf tracking-widest p-1 font-bold text-light">
                    Edit Bonuses
                  </p>
                  <form className="w-full h-full lg:flex flex-col gap-1 p-2 ">
                    <div className="w-full lg:flex gap-1 flex-col">
                      <div className="flex flex-col gap-1">
                        {formData.crew.map((item, index) => {
                          return (
                            <div key={Math.random()} className="flex gap-1">
                              <input
                                placeholder="Name"
                                readOnly
                                type="text"
                                value={item.name}
                                className="rounded-md p-2 w-full sf tracking-widest outline-none"
                              />
                              <select
                                placeholder="Bonus"
                                value={item.payment}
                                onChange={(e) => {
                                  const updatedCrew = [...formData.crew];
                                  updatedCrew[index].payment = e.target.value;
                                  setFormData({
                                    ...formData,
                                    crew: updatedCrew,
                                  });
                                }}
                                className="rounded-md p-2 w-full sf tracking-widest outline-none"
                              >
                                <option value="">Select Bonus</option>
                                {payment.map((tag) => (
                                  <option key={tag.value} value={tag.value}>
                                    {tag.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-green-500 text-white sf tracking-widest rounded-md py-2 w-full font-semibold"
                    >
                      Save
                    </button>
                  </form>
                </section>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    )
  );
};

export default CreateModal;
