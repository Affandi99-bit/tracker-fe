import { useState } from "react";
import { tags } from "../constant/constant";
import { payment } from "../constant/constant";
import { crew } from "../constant/constant";
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

  const handleNewCrewChange = (e) => {
    setNewCrewMember(e.target.value);
  };
  const addNewCrewMember = () => {
    if (newCrewMember.trim()) {
      const updatedCrew = [...formData.crew, { name: newCrewMember.trim() }];
      setFormData({ ...formData, crew: updatedCrew });
      setNewCrewMember("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
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
        {/* {isEditing ? (
          <div className="fixed z-30 right-40 top-20">
            <section className="w-96 relative rounded-lg border-light bg-dark">
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
                              setFormData({ ...formData, crew: updatedCrew });
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
                {/* <button
                  type="submit"
                  className="bg-green-500 text-white sf tracking-widest rounded-md py-2 w-full font-semibold tracking-wide"
                >
                  Save
                </button> 
              {/* </form>
            </section>
          </div>
        ) : null} */}
        <main
          className="backdrop fixed z-20 top-0 w-full h-screen backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <div
            className={`absolute bottom-0 lg:bottom-10 left-1/2 transform -translate-x-1/2`}
          >
            <section className="relative overflow-y-auto rounded-lg bg-dark shadow-lg w-screen md:w-full h-full">
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
                className="w-full h-full overflow-auto max-h-[80dvh] lg:flex flex-col gap-1 p-2 "
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
                            value={option.value}
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
                    <div className="rounded-md bg-white p-2 ">
                      <p className="sf tracking-widest text-gray-400 font-medium">
                        Crew
                      </p>
                      <div className="flex flex-wrap">
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
                        <input
                          type="text"
                          value={newCrewMember}
                          onChange={handleNewCrewChange}
                          placeholder="Other.."
                          className="bg-white border-b border-gray-400 sf outline-none"
                        />
                        {/* <button
                          className="bg-slate-400 m-1 p-2"
                          type="button"
                          onClick={addNewCrewMember}
                        >
                          +
                        </button>
                        <button
                          className="bg-slate-400 m-1 p-2"
                          type="button"
                          onClick={() => setNewCrewMember("")}
                        >
                          -
                        </button> */}
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
                      className="bg-red-500 text-white sf tracking-widest rounded-md py-2 w-full font-semibold"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    onClick={addNewCrewMember}
                    className="bg-green-500 text-white sf tracking-widest rounded-md py-2 w-full font-semibold"
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
