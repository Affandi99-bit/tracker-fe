import React, { useState, useEffect } from "react";
import { tags, crew as crewList } from "../constant/constant";
import { useToast } from './ToastContext';
// import { roleProduction } from "../constant/constant";
import { useRoleProduction } from '../constant/constant'

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
  const { showToast } = useToast();
  const roleProduction = useRoleProduction();
  const initialFormData = {
    title: "",
    pm: "",
    deadline: new Date().toISOString().split('T')[0],
    client: "",
    pic: "",
    final_file: "",
    final_report_file: "",
    note: "",
    categories: [],
    type: [],
    day: [
      {
        crew: [],
        expense: {
          rent: [],
          operational: [],
          orderlist: [],
        },
        note: '',
        totalExpenses: 0,
      },
    ],
    status: false,
  };
  const [formData, setFormData] = useState(isEditing ? {
    ...initialData,
    deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
    status: initialData.status || false,
  } : initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [additionalCrewMembers, setAdditionalCrewMembers] = useState(
    isEditing
      ? (initialData.day[0]?.crew || [])
        .filter(
          (member) =>
            !crewList.some(
              (constantMember) => constantMember.name === member.name
            )
        )
        .map((member, index) => ({
          id: index,
          value: member.name,
        }))
      : []
  );

  useEffect(() => {
    setFormData(prevFormData => {
      const baseCrew = (prevFormData.day[0]?.crew || []).filter(
        member => !member.id
      );
      const additional = additionalCrewMembers
        .filter(member => member.value.trim() !== "")
        .map(member => ({
          id: member.id,
          name: member.value,
          roles: []
        }));
      return {
        ...prevFormData,
        day: [{
          ...prevFormData.day[0],
          crew: [...baseCrew, ...additional]
        }]
      };
    });
  }, [additionalCrewMembers]);

  const inputHandle = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "crew" && type === "checkbox") {
      const currentCrew = formData.day[0]?.crew || [];
      const updatedCrew = checked
        ? [...currentCrew, { name: value, roles: [] }]
        : currentCrew.filter((member) => member.name !== value);

      setFormData({
        ...formData,
        day: [
          {
            ...formData.day[0] || {},
            crew: updatedCrew,
          },
        ],
      });
    } else if (name === "type" && type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        type: checked
          ? [...prev.type, value]
          : prev.type.filter(item => item !== value)
      }));
    } else if (name === "categories" && type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter(item => item !== value)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addAdditionalCrewField = () => {
    setAdditionalCrewMembers((prev) => [
      ...prev,
      { id: Date.now(), value: "" },
    ]);
  };

  const handleAdditionalCrewChange = (id, value) => {
    setAdditionalCrewMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, value } : member
      )
    );
    setFormData(prevFormData => {
      const currentDay = prevFormData.day[0] || {};
      const updatedCrew = (currentDay.crew || []).map(member =>
        member.id === id ? { ...member, name: value } : member
      );
      return {
        ...prevFormData,
        day: [{ ...currentDay, crew: updatedCrew }]
      };
    });
  };

  const removeAdditionalCrewField = (id) => {
    setAdditionalCrewMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
    setFormData(prevFormData => ({
      ...prevFormData,
      day: [{
        ...prevFormData.day[0] || {},
        crew: (prevFormData.day[0]?.crew || []).filter(member => member.id !== id)
      }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const allCrew = [
      ...(formData.day[0].crew || []).filter(m => m.name.trim() !== ""),
      ...additionalCrewMembers
        .filter(member => member.value.trim() !== "")
        .map(member => ({
          name: member.value.trim(),
          roles: []
        }))
    ].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

    const finalData = {
      ...formData,
      status: false, // always push as ongoing
      day: [{
        ...formData.day[0],
        crew: allCrew,
      }],
    };
    console.log("Form Data Submitted:", finalData);
    try {
      if (isEditing) {
        await updateData(finalData);
        setTableModal(false);
        showToast("Project updated successfully", 'success');
      } else {
        await addNewData(finalData);
        showToast("Project created successfully", 'success');
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Operation failed", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isEditing && formData._id) {
      setIsLoadingDelete(true);
      try {
        await deleteData(formData._id);
        showToast("Project deleted successfully", 'success');
        setShowModal(false);
        setTableModal(false);
      } catch (error) {
        console.error("Error deleting project:", 'error', error);
        showToast("Deletion failed");
      } finally {
        setIsLoadingDelete(false);
      }
    }
  };

  return (
    showModal && (
      <div>
        <main className="fixed overflow-y-auto z-40 top-0 left-0 text-light h-screen">
          <section className="relative overflow-auto w-screen h-full no-scrollbar bg-dark">
            <section className="hidden fixed -right-40 -bottom-56 select-none md:flex gap-1 z-0">
              <img
                src="/camera.webp"
                className="object-contain size-[70rem] scale-x-[-1] -rotate-45"
                alt=""
              />
            </section>
            <div className="flex justify-between items-center p-2 mb-5">
              <button
                onClick={() => setShowModal(false)}
                className="z-10 font-body text-xs flex items-center gap-2 tracking-widest p-2 w-20 font-semibold transition ease-in-out hover:translate-x-1 active:scale-90 duration-300"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
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
              <p className="font-body tracking-widest font-bold text-2xl ">
                {isEditing ? "EDIT TASK" : "CREATE NEW TASK"}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-1 p-2 w-full "
            >
              <section className="flex select-none border glass rounded-2xl p-3 flex-col w-full md:w-1/2 z-10">
                <div className="flex flex-col gap-1 w-full">
                  {/* Title */}
                  <label className="font-body font-semibold tracking-widest flex flex-col">
                    Title
                    <input
                      required
                      placeholder="Title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={inputHandle}
                      className="glass border border-gray-400 font-light rounded p-2 font-body tracking-widest outline-none"
                    />
                  </label>
                  <div className="flex flex-col md:flex-row gap-1 justify-between">
                    {/* Client */}
                    <label className="font-body font-semibold tracking-widest flex flex-col">
                      Client
                      <input
                        required
                        placeholder="Client"
                        type="text"
                        name="client"
                        value={formData.client}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                    {/* PIC */}
                    <label className="font-body font-semibold tracking-widest flex flex-col">
                      Client PIC
                      <input
                        required
                        placeholder="Client PIC"
                        type="text"
                        name="pic"
                        value={formData.pic}
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                    {/* Deadline */}
                    <label className="font-body font-semibold tracking-widest flex flex-col">
                      Event Date:
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        required
                        onChange={inputHandle}
                        className="glass border border-gray-400 font-light rounded p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                      />
                    </label>
                  </div>

                  <section className="flex gap-1 w-full">
                    <div className="flex flex-col gap-1">
                      {/* Type */}
                      <div className="glass border border-gray-400 font-light rounded p-2 ">
                        <p className="font-body tracking-widest font-medium">
                          Project Type
                        </p>
                        <div className="">
                          {tags.projectType.map((option) => (
                            <label
                              htmlFor={`hr-${option.value}`}
                              key={option.value}
                              className={`flex flex-row w-32 items-center gap-1 font-body tracking-widest cursor-pointer `}
                            >
                              <input
                                id={`hr-${option.value}`}
                                type="checkbox"
                                name="type"
                                value={option.value}
                                checked={formData.type.includes(option.value)}
                                onChange={(e) => {
                                  const { checked, value } = e.target;
                                  setFormData(prev => ({
                                    ...prev,
                                    type: checked
                                      ? [...prev.type, value]
                                      : prev.type.filter(item => item !== value)
                                  }));
                                }}
                                className="peer hidden"
                              />
                              <div
                                htmlFor={`hr-${option.value}`}
                                className="size-5 flex rounded bg-dark peer-checked:bg-light"
                              >
                                <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="size-5 stroke-dark peer-checked:stroke-dark"
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
                        <p className="font-body hidden md:block tracking-widest font-medium">
                          Categories :
                        </p>
                        <div className="flex flex-col justify-between">
                          {tags.projectCategories.map((option) => (
                            <label
                              htmlFor={`hr-${option.value}`}
                              key={option.value}
                              className={`flex flex-row w-1/2 items-center gap-2 font-body tracking-widest cursor-pointer `}
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
                                  const { checked, value } = e.target;
                                  setFormData(prev => ({
                                    ...prev,
                                    categories: checked
                                      ? [...new Set([...prev.categories, value])]
                                      : prev.categories.filter(item => item !== value)
                                  }));
                                }}
                                className="peer hidden"
                              />
                              <div
                                htmlFor={`hr-${option.value}`}
                                className="size-5 flex rounded bg-dark peer-checked:bg-light"
                              >
                                <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="size-5 stroke-dark peer-checked:stroke-dark"
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
                    </div>
                    {/* Crew */}
                    <div className="glass border border-gray-400 font-light rounded p-2 ">
                      <p className="font-body tracking-widest font-medium">Crew</p>
                      <div className="flex flex-wrap overflow-x-hidden">
                        {crewList.map((option, index) => (
                          <label
                            key={index}
                            className={`flex flex-row items-center w-1/2 gap-2 font-body tracking-widest cursor-pointer `}
                          >
                            <input
                              type="checkbox"
                              name="crew"
                              value={option.name}
                              checked={(formData.day[0]?.crew || []).some(
                                (member) => member.name === option.name
                              )}
                              onChange={inputHandle}
                              className="peer hidden"
                            />
                            <div className="size-5 flex rounded bg-dark peer-checked:bg-light">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                className="size-5 stroke-dark peer-checked:stroke-dark"
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
                      </div>
                      {/* Add Member */}
                      <section className="flex flex-wrap items-center justify-evenly">
                        {additionalCrewMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-1 w-1/4"
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
                              className="border-b border-light outline-none p-1 w-full text-xs text-light"
                            />
                            <button
                              type="button"
                              className="text-sm"
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
                          className="mt-2 text-xs"
                          onClick={addAdditionalCrewField}
                        >
                          Add crew +
                        </button>
                      </section>
                    </div>
                  </section>
                  {/* Notes */}
                  <textarea
                    placeholder="Notes"
                    name="note"
                    value={formData.note}
                    onChange={inputHandle}
                    className="glass border border-gray-400 font-light rounded p-2 h-40 font-body w-full tracking-widest outline-none bg-dark text-light"
                  />
                  {/* Buttons */}
                  <div className="flex justify-between gap-1">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className=" flex border-dashed border border-gray-400 items-center justify-center gap-1 font-body tracking-widest rounded py-2 w-56 font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95"
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
                      className="border bg-light text-dark flex justify-center gap-1 items-center font-body tracking-widest rounded  py-2 w-56 font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95"
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
                            stroke="#222222"
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
              {/* Crew Jobdesk Assignment */}
              <section className="w-full md:w-1/2 z-10"
                style={{
                  display: (formData.day[0]?.crew || []).length === 0 ? "none" : undefined
                }}
              >
                <main className="flex items-start justify-start gap-1 flex-wrap min-h-10 select-none p-3 w-full">
                  {(formData.day[0]?.crew || []).map((member, idx) => (
                    <div
                      key={member.name + (member.id || "")}
                      className="min-h-16 flex items-start w-1/4 mb-2 px-3 rounded-2xl z-10 glass border border-gray-400"
                    >
                      <div className="flex w-full flex-col gap-2">
                        <div className="w-full flex items-center justify-between mt-2 mx-1">
                          <p className="font-body text-light ">{member.name}</p>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded "
                            onClick={() => {
                              setFormData(prev => {
                                const updatedCrew = prev.day[0].crew.map((m, i) => {
                                  if (i !== idx) return m;
                                  return { ...m, roles: [...(m.roles || []), ""] };
                                });
                                return {
                                  ...prev,
                                  day: [{ ...prev.day[0], crew: updatedCrew }]
                                };
                              });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#f8f8f8" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </button>
                        </div>
                        {(member.roles || [""]).map((role, roleIdx) => (
                          <div key={roleIdx} className="flex items-center text-xs gap-2 mb-1">
                            <select
                              value={role || ""}
                              onChange={e => {
                                setFormData(prev => {
                                  const updatedCrew = prev.day[0].crew.map((m, i) => {
                                    if (i !== idx) return m;
                                    const updatedRoles = [...(m.roles || [])];
                                    updatedRoles[roleIdx] = e.target.value;
                                    return { ...m, roles: updatedRoles };
                                  });
                                  return {
                                    ...prev,
                                    day: [{ ...prev.day[0], crew: updatedCrew }]
                                  };
                                });
                              }}
                              className="font-body outline-none p-1"
                            >
                              <option value="" className="text-dark bg-light">Select Jobdesk</option>
                              {roleProduction.map(roleOption => (
                                <option key={roleOption.id} value={roleOption.name} className="text-dark bg-light">
                                  {roleOption.name}
                                </option>
                              ))}
                            </select>
                            {member.roles && member.roles.length > 1 && (
                              <button
                                type="button"
                                className="text-xs px-2 py-1 rounded"
                                onClick={() => {
                                  setFormData(prev => {
                                    const updatedCrew = prev.day[0].crew.map((m, i) => {
                                      if (i !== idx) return m;
                                      const updatedRoles = (m.roles || []).filter((_, rIdx) => rIdx !== roleIdx);
                                      return { ...m, roles: updatedRoles };
                                    });
                                    return {
                                      ...prev,
                                      day: [{ ...prev.day[0], crew: updatedCrew }]
                                    };
                                  });
                                }}
                              >
                                -
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </main>
              </section>
            </form>
          </section>
        </main>
      </div>
    )
  );
};

export default CreateModal;
