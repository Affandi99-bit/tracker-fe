import { useState } from "react";
import { tags, crew } from "../constant/constant";

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
    categories: [],
    type: [],
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
          .map((member, index) => ({
            id: index,
            value: member.name,
          }))
      : []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

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
    const updatedCrew = additionalCrewMembers.map((member) =>
      member.id === id ? { ...member, name: value } : member
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      crew: [
        ...prevFormData.crew.filter(
          (crewMember) =>
            !additionalCrewMembers.some(
              (additionalMember) => additionalMember.id === crewMember.id
            )
        ),
        ...updatedCrew,
      ],
    }));
  };

  const removeAdditionalCrewField = (id) => {
    setAdditionalCrewMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        <main className="fixed overflow-y-auto z-20 top-0 text-dark h-screen">
          <section className="relative overflow-auto w-screen h-full no-scrollbar bg-zinc-100 ">
            <section className="hidden fixed -right-40 -bottom-56 select-none md:flex gap-1 z-0">
              <img
                src="/camera.png"
                className="object-contain size-[70rem] scale-x-[-1] -rotate-45"
                alt=""
              />
            </section>
            <div className="flex justify-between items-center p-2 mb-5">
              <button
                onClick={() => setShowModal(false)}
                className="z-10 sf flex items-center gap-2 tracking-widest p-2 w-20 font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95"
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
              <p className="sf tracking-widest font-bold text-2xl ">
                {isEditing ? "EDIT TASK" : "CREATE NEW TASK"}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-1 p-2 w-full "
            >
              <section className="flex select-none flex-col w-full md:w-1/2 z-10">
                <div className="flex flex-col gap-1 w-full">
                  {/* Title */}
                  <label className="sf font-semibold tracking-widest flex flex-col">
                    Title
                    <input
                      required
                      placeholder="Title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={inputHandle}
                      className="glass border border-gray-400 font-light rounded p-2 sf tracking-widest outline-none"
                    />
                  </label>
                  <div className="flex flex-col md:flex-row gap-1">
                    {/* Client */}
                    <label className="sf font-semibold tracking-widest flex flex-col">
                      Client
                      <input
                        required
                        placeholder="Client"
                        type="text"
                        name="client"
                        value={formData.client}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                    {/* PIC */}
                    <label className="sf font-semibold tracking-widest flex flex-col">
                      Client PIC
                      <input
                        required
                        placeholder="Client PIC"
                        type="text"
                        name="pic"
                        value={formData.pic}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                    {/* Deadline */}
                    <label className="sf font-semibold tracking-widest flex flex-col">
                      Event Date:
                      <input
                        required
                        className="glass border border-gray-400 font-light rounded p-2 sf tracking-widest outline-none mb-1 lg:mb-0"
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={inputHandle}
                      />
                    </label>
                  </div>
                  <section className="flex gap-1 items-center w-full">
                    {/* Final File */}
                    <label className="sf font-semibold tracking-widest">
                      Final File Link
                      <input
                        placeholder="Final File Link"
                        type="text"
                        name="final_file"
                        value={formData.final_file}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 h-full w-full sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                    {/* Document */}
                    <label className="sf font-semibold tracking-widest">
                      Document Links
                      <input
                        placeholder="Document Links"
                        type="text"
                        name="final_report_file"
                        value={formData.final_report_file}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 h-full w-full sf tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                    {/* PM */}
                    <label className="sf font-semibold tracking-widest flex flex-col">
                      Select PM
                      <select
                        required
                        name="pm"
                        value={formData.pm}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 sf tracking-widest outline-none mb-1 lg:mb-0 "
                      >
                        <option className="bg-dark text-light" value="">
                          N/A
                        </option>
                        {crew.map((option) => (
                          <option
                            className="bg-dark text-light"
                            key={option.index}
                            value={option.name}
                          >
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </section>
                  <section className="flex gap-1 w-full">
                    {/* Progress */}
                    <div className="glass border border-gray-400 font-light rounded p-2 ">
                      <p className="sf tracking-widest font-medium">Progress</p>
                      {tags.progress.map((option) => (
                        <label
                          htmlFor={`hr-${option.value}`}
                          key={option.value}
                          className={`flex flex-row items-center gap-2 sf tracking-widest cursor-pointer  `}
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
                            className="size-5 flex rounded border-dark border border-gray-400-[#a2a1a833] bg-dark peer-checked:bg-light transition"
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
                    <div className="glass border border-gray-400 font-light rounded p-2 ">
                      <p className="sf tracking-widest font-medium">
                        Project Type
                      </p>
                      <div className="">
                        {tags.projectType.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row w-32 items-center gap-1 sf tracking-widest cursor-pointer `}
                          >
                            <input
                              id={`hr-${option.value}`}
                              type="checkbox"
                              name="type"
                              value={option.value}
                              checked={formData.type.includes(option.value)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const { value } = e.target;
                                let updatedType = [...formData.type];
                                if (isChecked) {
                                  updatedType = [...formData.type, value];
                                } else {
                                  updatedType = formData.type.filter(
                                    (type) => type !== value
                                  );
                                }
                                setFormData((prevState) => ({
                                  ...prevState,
                                  type: updatedType,
                                }));
                              }}
                              className="peer hidden"
                            />
                            <div
                              htmlFor={`hr-${option.value}`}
                              className="size-5 flex rounded border-dark border border-gray-400-[#a2a1a833] bg-dark peer-checked:bg-light transition"
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
                    {/* Categories */}
                    <div className="glass border border-gray-400 font-light rounded p-2 w-full">
                      <p className="sf hidden md:block tracking-widest font-medium">
                        Categories :
                      </p>
                      <div className="flex justify-between flex-wrap">
                        {tags.projectCategories.map((option) => (
                          <label
                            htmlFor={`hr-${option.value}`}
                            key={option.value}
                            className={`flex flex-row w-1/2 items-center gap-2 sf tracking-widest cursor-pointer `}
                          >
                            <input
                              id={`hr-${option.value}`}
                              type="checkbox"
                              name="categories"
                              value={option.value}
                              checked={formData.categories.includes(
                                option.value
                              )}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const { value } = e.target;
                                let updatedCategories = [
                                  ...formData.categories,
                                ];
                                if (isChecked) {
                                  updatedCategories = [
                                    ...formData.categories,
                                    value,
                                  ];
                                } else {
                                  updatedCategories =
                                    formData.categories.filter(
                                      (categories) => categories !== value
                                    );
                                }
                                setFormData((prevState) => ({
                                  ...prevState,
                                  categories: updatedCategories,
                                }));
                              }}
                              className="peer hidden"
                            />
                            <div
                              htmlFor={`hr-${option.value}`}
                              className="size-5 flex border-dark rounded border border-gray-400-[#a2a1a833] bg-dark peer-checked:bg-light transition"
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
                  {/* Crew */}
                  <div className="glass border border-gray-400 font-light rounded p-2 ">
                    <p className="sf tracking-widest font-medium">Crew</p>
                    <div className="flex flex-wrap overflow-x-hidden">
                      {crew.map((option, index) => (
                        <label
                          key={index}
                          className={`flex flex-row items-center w-1/2 gap-2 sf tracking-widest cursor-pointer `}
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
                          <div className="size-5 flex rounded border border-gray-400 border-dark-[#a2a1a833] bg-dark peer-checked:bg-light transition">
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
                            className="flex items-center gap-1 "
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
                              className=" border border-gray-400-gray-400 outline-none p-1 w-[80%]"
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
                          className=""
                          onClick={addAdditionalCrewField}
                        >
                          Additional crew +
                        </button>
                      </section>
                    </div>
                  </div>
                  {/* Notes */}
                  <textarea
                    placeholder="Notes"
                    name="note"
                    value={formData.note}
                    onChange={inputHandle}
                    className="glass border border-gray-400 font-light rounded p-2 h-40 sf w-full tracking-widest outline-none"
                  />
                  {/* Buttons */}
                  <div className="flex justify-between gap-1">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className=" flex border-dashed border border-gray-400 items-center justify-center gap-1 sf tracking-widest rounded py-2 w-56 font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95"
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
                              stroke="#222222"
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
                      className="border bg-dark text-light flex justify-center gap-1 items-center sf tracking-widest rounded  py-2 w-56 font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95"
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
                </div>
              </section>
            </form>
          </section>
        </main>
      </div>
    )
  );
};

export default CreateModal;
