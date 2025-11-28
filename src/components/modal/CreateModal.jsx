import React, { useState, useEffect, useMemo } from "react";
import { tags } from "../../constant/constant";
import { useToast } from '../micro-components/ToastContext';
import { useRoleProduction, useRoleMotion, useRoleDesign, useRoleDocs, crewImport } from '../../hook'

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
  const roleMotion = useRoleMotion();
  const roleDesign = useRoleDesign();
  const roleDocs = useRoleDocs();
  const crewListData = crewImport();

  // Transform crew data from {id, name} to {name} format
  const crewList = useMemo(() => {
    return crewListData.map(c => ({ name: c.name }));
  }, [crewListData]);

  const initialFormData = {
    title: "",
    pm: "",
    deadline: new Date().toISOString().split("T")[0],
    client: "",
    pic: "",
    final_file: "",
    final_report_file: "",
    note: "",
    categories: [],
    type: [],
    freelancers: [],
    day: [
      {
        crew: [],
        expense: {
          rent: [],
          operational: [],
          orderlist: [],
        },
        note: "",
        totalExpenses: 0,
        images: []
      },
    ],
    status: false,
  };

  // Initialize form data - aggregate crew from all days into day[0] for editing
  const [formData, setFormData] = useState(() => {
    if (isEditing && initialData) {
      // Aggregate crew members from ALL days and merge their roles
      // This ensures CreateModal shows all jobdesk a person handles across all days
      const crewMap = new Map();

      (initialData.day || []).forEach(day => {
        (day.crew || []).forEach(member => {
          if (!member || !member.name) return;

          const memberName = member.name;
          if (!crewMap.has(memberName)) {
            crewMap.set(memberName, {
              name: memberName,
              roles: new Set(),
              overtime: []
            });
          }

          const crewEntry = crewMap.get(memberName);
          // Merge roles from all days
          if (Array.isArray(member.roles)) {
            member.roles.filter(Boolean).forEach(role => crewEntry.roles.add(role));
          } else if (member.roles) {
            crewEntry.roles.add(member.roles);
          }

          // Merge overtime (keep all entries)
          if (Array.isArray(member.overtime) && member.overtime.length > 0) {
            crewEntry.overtime.push(...member.overtime);
          } else if (member.overtime && typeof member.overtime === 'object') {
            crewEntry.overtime.push(member.overtime);
          }
        });
      });

      // Convert Set to Array and ensure at least one empty role slot
      const aggregatedCrew = Array.from(crewMap.values()).map(member => ({
        name: member.name,
        roles: member.roles.size > 0 ? Array.from(member.roles) : [""],
        overtime: member.overtime
      }));

      // Add freelancers to crew list with customKey
      const freelancers = Array.isArray(initialData.freelancers) ? initialData.freelancers : [];
      const freelancerCrew = freelancers.map((freelancer, idx) => ({
        name: freelancer.name || '',
        roles: [''],
        overtime: [],
        customKey: `custom-freelancer-${idx}-${Date.now()}`
      }));

      // Combine regular crew and freelancers
      const allCrewForDay0 = [...aggregatedCrew, ...freelancerCrew];

      // Format all days - use aggregated crew for day[0], preserve others
      const formattedDays = initialData.day?.length
        ? initialData.day.map((d, index) => ({
          ...d,
          crew: index === 0
            ? allCrewForDay0
            : (d.crew || []).map(m => ({
              name: m.name || '',
              roles: Array.isArray(m.roles) ? m.roles.filter(Boolean) : (m.roles ? [m.roles] : []),
              overtime: Array.isArray(m.overtime) ? m.overtime : []
            })),
          expense: {
            rent: d.expense?.rent || [],
            operational: d.expense?.operational || [],
            orderlist: d.expense?.orderlist || [],
          },
          images: Array.isArray(d.images) ? d.images : [],
        }))
        : [{
          crew: allCrewForDay0,
          expense: { rent: [], operational: [], orderlist: [] },
          note: "",
          totalExpenses: 0,
          images: []
        }];

      return {
        ...initialData,
        deadline: initialData?.deadline?.split("T")[0] || "",
        status: initialData.status || false,
        day: formattedDays,
      };
    }
    return initialFormData;
  });

  // Track whether we've initialized additional crew for this modal session
  const [hasInitializedAdditional, setHasInitializedAdditional] = useState(false);

  // Reset additional crew tracking when modal closes
  useEffect(() => {
    if (!showModal) {
      setHasInitializedAdditional(false);
      setAdditionalCrewMembers([]);
    }
  }, [showModal]);

  // Sync formData when initialData changes (for edit mode) – run only when modal opens / project changes
  useEffect(() => {
    if (isEditing && initialData && showModal) {
      // Aggregate crew from all days
      const crewMap = new Map();

      (initialData.day || []).forEach(day => {
        (day.crew || []).forEach(member => {
          if (!member || !member.name) return;

          const memberName = member.name;
          if (!crewMap.has(memberName)) {
            crewMap.set(memberName, {
              name: memberName,
              roles: new Set(),
              overtime: []
            });
          }

          const crewEntry = crewMap.get(memberName);
          if (Array.isArray(member.roles)) {
            member.roles.filter(Boolean).forEach(role => crewEntry.roles.add(role));
          } else if (member.roles) {
            crewEntry.roles.add(member.roles);
          }

          if (Array.isArray(member.overtime) && member.overtime.length > 0) {
            crewEntry.overtime.push(...member.overtime);
          } else if (member.overtime && typeof member.overtime === 'object') {
            crewEntry.overtime.push(member.overtime);
          }
        });
      });

      const aggregatedCrew = Array.from(crewMap.values()).map(member => ({
        name: member.name,
        roles: member.roles.size > 0 ? Array.from(member.roles) : [""],
        overtime: member.overtime
      }));

      // Add freelancers to crew list with customKey
      const freelancers = Array.isArray(initialData.freelancers) ? initialData.freelancers : [];
      const freelancerCrew = freelancers.map((freelancer, idx) => ({
        name: freelancer.name || '',
        roles: [''],
        overtime: [],
        customKey: `custom-freelancer-${idx}-${Date.now()}`
      }));

      // Combine regular crew and freelancers
      const allCrewForDay0 = [...aggregatedCrew, ...freelancerCrew];

      const formattedDays = initialData.day?.length
        ? initialData.day.map((d, index) => ({
          ...d,
          crew: index === 0
            ? allCrewForDay0
            : (d.crew || []).map(m => ({
              name: m.name || '',
              roles: Array.isArray(m.roles) ? m.roles.filter(Boolean) : (m.roles ? [m.roles] : []),
              overtime: Array.isArray(m.overtime) ? m.overtime : []
            })),
          expense: {
            rent: d.expense?.rent || [],
            operational: d.expense?.operational || [],
            orderlist: d.expense?.orderlist || [],
          },
          images: Array.isArray(d.images) ? d.images : [],
        }))
        : [{
          crew: allCrewForDay0,
          expense: { rent: [], operational: [], orderlist: [] },
          note: "",
          totalExpenses: 0,
          images: []
        }];

      setFormData({
        ...initialData,
        deadline: initialData?.deadline?.split("T")[0] || "",
        status: initialData.status || false,
        day: formattedDays,
        freelancers: initialData.freelancers || [], // Preserve existing freelancers
      });
      // Additional crew will be initialized in a separate effect once crewList is available
    } else if (!isEditing && showModal) {
      // Fresh create mode when modal opens
      setFormData(initialFormData);
    }
  }, [isEditing, initialData, showModal]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  // additionalCrewMembers: [{ id, value, customKey }]
  const [additionalCrewMembers, setAdditionalCrewMembers] = useState([]);

  // Get all unique crew members from day[0] for checkbox display
  const allCrewInProject = useMemo(() => {
    const crewSet = new Set();
    (formData.day?.[0]?.crew || []).forEach(member => {
      if (member && member.name) {
        crewSet.add(member.name);
      }
    });
    return Array.from(crewSet);
  }, [formData.day?.[0]?.crew]);

  // Determine which role list to use based on first checked category
  const selectedRoleList = useMemo(() => {
    const firstCategory = formData.categories?.[0];

    if (!firstCategory) {
      return roleProduction; // Default to Production if no category selected
    }

    switch (firstCategory) {
      case "Produksi":
        return roleProduction;
      case "Dokumentasi":
        return roleDocs;
      case "Motion":
        return roleMotion;
      case "Design":
        return roleDesign;
      default:
        return roleProduction; // Default fallback
    }
  }, [formData.categories, roleProduction, roleMotion, roleDesign, roleDocs]);

  // Initialize additional crew members from existing data (only custom names not in CrewImport list)
  useEffect(() => {
    if (!showModal || !isEditing || !initialData || hasInitializedAdditional) return;
    if (!Array.isArray(formData.day) || !formData.day[0]) return;
    if (!Array.isArray(crewList) || crewList.length === 0) return; // wait until crew list is loaded

    const crew0 = Array.isArray(formData.day[0].crew) ? formData.day[0].crew : [];

    // Mark custom crew (not in CrewImport list) with a stable customKey for this session
    const updatedCrew0 = crew0.map((member, idx) => {
      if (!member || !member.name) return member;
      const isListed = crewList.some(c =>
        String(c.name || "").trim().toLowerCase() === String(member.name || "").trim().toLowerCase()
      );
      if (isListed) return member;
      if (member.customKey) return member;
      return {
        ...member,
        customKey: `custom-${Date.now()}-${idx}`,
      };
    });

    // Build additional inputs from custom crew only
    const customEntries = updatedCrew0
      .filter(m => m && m.name && m.customKey)
      .map((m) => ({ name: m.name, customKey: m.customKey }));

    if (customEntries.length > 0) {
      setAdditionalCrewMembers(
        customEntries.map((entry, index) => ({
          id: Date.now() + index,
          value: entry.name,
          customKey: entry.customKey,
        }))
      );
    }

    // Persist customKey back into formData.day[0].crew
    setFormData(prev => {
      if (!prev.day?.[0]) return prev;
      return {
        ...prev,
        day: prev.day.map((d, idx) =>
          idx === 0 ? { ...d, crew: updatedCrew0 } : d
        ),
      };
    });

    setHasInitializedAdditional(true);
  }, [showModal, isEditing, initialData, formData.day, crewList, hasInitializedAdditional]);

  // Handle checkbox changes for categories, type, and crew
  const handleCheckboxChange = (type, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [type]: checked
        ? [...new Set([...prev[type], value])]
        : prev[type].filter((item) => item !== value),
    }));
  };

  // Handle input changes
  const inputHandle = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      if (name === "crew") {
        const currentCrew = formData.day[0]?.crew || [];
        const updatedCrew = checked
          ? [...currentCrew, { name: value, roles: [""], overtime: [] }]
          : currentCrew.filter((member) => member.name !== value);
        setFormData((prev) => ({
          ...prev,
          day: (prev.day || []).map((d, idx) => idx === 0 ? { ...d, crew: updatedCrew } : d),
        }));
      } else {
        handleCheckboxChange(name, value, checked);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Additional crew member management
  const addAdditionalCrewField = () => {
    const id = Date.now();
    const customKey = `custom-${id}-${Math.random()}`;

    // Add UI entry
    setAdditionalCrewMembers((prev) => [
      ...prev,
      { id, value: "", customKey }
    ]);

    // Add corresponding crew entry in day[0]
    setFormData(prev => {
      // Ensure day[0] exists
      if (!prev.day?.[0]) {
        return {
          ...prev,
          day: [{
            crew: [{ name: "", roles: [""], overtime: [], customKey }],
            expense: { rent: [], operational: [], orderlist: [] },
            note: "",
            totalExpenses: 0,
            images: []
          }]
        };
      }

      const nextDay = [...prev.day];
      const day0 = { ...nextDay[0] };
      const crew0 = Array.isArray(day0.crew) ? [...day0.crew] : [];
      crew0.push({ name: "", roles: [""], overtime: [], customKey });
      day0.crew = crew0;
      nextDay[0] = day0;

      return { ...prev, day: nextDay };
    });
  };

  const handleAdditionalCrewChange = (id, value) => {
    setAdditionalCrewMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, value } : m))
    );

    // Also update the corresponding crew name in formData using customKey
    setFormData(prev => {
      if (!prev.day?.[0]) return prev;
      const entry = additionalCrewMembers.find(m => m.id === id);
      const customKey = entry?.customKey;
      if (!customKey) return prev;

      const nextDay = [...prev.day];
      const day0 = { ...nextDay[0] };
      const crew0 = Array.isArray(day0.crew) ? [...day0.crew] : [];
      const updatedCrew0 = crew0.map(member =>
        member && member.customKey === customKey
          ? { ...member, name: value }
          : member
      );
      day0.crew = updatedCrew0;
      nextDay[0] = day0;
      return { ...prev, day: nextDay };
    });
  };

  const removeAdditionalCrewField = (id) => {
    setAdditionalCrewMembers((prev) => {
      const removed = prev.find(m => m.id === id);
      const customKey = removed?.customKey;

      if (customKey) {
        // Remove corresponding crew entry by customKey
        setFormData(prevForm => {
          if (!prevForm.day?.[0]) return prevForm;
          const nextDay = [...prevForm.day];
          const day0 = { ...nextDay[0] };
          const crew0 = Array.isArray(day0.crew) ? [...day0.crew] : [];
          day0.crew = crew0.filter(member => member.customKey !== customKey);
          nextDay[0] = day0;
          return { ...prevForm, day: nextDay };
        });
      }

      return prev.filter((m) => m.id !== id);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Separate regular crew and freelancers (additional crew members)
    const allCrew = formData.day?.[0]?.crew || [];
    const regularCrew = [];
    const extractedFreelancers = [];

    // Get existing freelancers to preserve their prices and types
    const existingFreelancers = Array.isArray(formData.freelancers) ? formData.freelancers : [];
    const existingFreelancersMap = new Map();
    existingFreelancers.forEach(f => {
      if (f.name) {
        existingFreelancersMap.set(String(f.name).trim().toLowerCase(), f);
      }
    });

    allCrew.forEach((member) => {
      if (!member || !member.name) return;

      // Check if this member is in the crew list (regular crew) or additional (freelancer)
      const isListed = crewList.some(c =>
        String(c.name || "").trim().toLowerCase() === String(member.name || "").trim().toLowerCase()
      );

      if (isListed || !member.customKey) {
        // Regular crew member
        regularCrew.push({
          name: member?.name || '',
          roles: Array.isArray(member?.roles) ? member.roles.filter(Boolean) : (member?.roles ? [member.roles] : []),
          overtime: Array.isArray(member?.overtime) ? member.overtime : []
        });
      } else {
        // Freelancer (additional crew member)
        const memberNameKey = String(member.name).trim().toLowerCase();
        const existingFreelancer = existingFreelancersMap.get(memberNameKey);

        // Preserve existing price and type if freelancer already exists, otherwise use defaults
        extractedFreelancers.push({
          name: member?.name || '',
          price: existingFreelancer?.price || 0,
          type: existingFreelancer?.type || 'freelancer'
        });

        // Remove from map to avoid duplicates
        existingFreelancersMap.delete(memberNameKey);
      }
    });

    // Add remaining existing freelancers that weren't in crew (preserve freelancers added directly in Report.jsx)
    const remainingFreelancers = Array.from(existingFreelancersMap.values());
    const mergedFreelancers = [...extractedFreelancers, ...remainingFreelancers];

    // Add freelancers to regular crew so they appear in day.crew
    // Add freelancers to crew if they're not already there
    const freelancersAsCrew = mergedFreelancers
      .filter(f => f.name && !regularCrew.some(c =>
        String(c.name).trim().toLowerCase() === String(f.name).trim().toLowerCase()
      ))
      .map(f => ({
        name: f.name || '',
        roles: [''],
        overtime: []
      }));

    // Combine regular crew and freelancers
    const cleanedCrew = [...regularCrew, ...freelancersAsCrew];

    const finalData = {
      ...formData,
      status: false,
      freelancers: mergedFreelancers, // Merge extracted and existing freelancers
      day: (formData.day || []).map((d, idx) => ({
        ...d,
        expense: {
          rent: d.expense?.rent || [],
          operational: d.expense?.operational || [],
          orderlist: d.expense?.orderlist || [],
        },
        crew: idx === 0
          ? cleanedCrew
          : (Array.isArray(d.crew) && d.crew.length > 0
            ? d.crew.map((m) => ({
              name: m?.name || '',
              roles: Array.isArray(m?.roles) ? m.roles.filter(Boolean) : (m?.roles ? [m.roles] : []),
              overtime: Array.isArray(m?.overtime) ? m.overtime : []
            }))
            : []),
        images: Array.isArray(d.images) ? d.images : [],
        totalExpenses: d.totalExpenses || 0,
      })),
    };

    try {
      if (isEditing) {
        await updateData(finalData);
        setTableModal(false);
        showToast("Project updated successfully", "success");
      } else {
        await addNewData(finalData);
        showToast("Project created successfully", "success");
      }
      setShowModal(false);
    } catch (err) {
      console.error("Form submission error:", err);
      showToast("Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (isEditing && formData._id) {
      setIsLoadingDelete(true);
      try {
        await deleteData(formData._id);
        showToast("Project deleted successfully", "success");
        setShowModal(false);
        setTableModal(false);
      } catch (err) {
        console.error("Deletion failed:", err);
        showToast("Deletion failed", "error");
      } finally {
        setIsLoadingDelete(false);
      }
    }
  };

  return (
    showModal ? (
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
                  <div className="flex flex-col md:flex-row gap-1 items-center">
                    {/* Client */}
                    <label className="font-body font-semibold tracking-widest flex flex-col w-1/3">
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
                    <label className="font-body font-semibold tracking-widest flex flex-col w-1/3">
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
                    <label className="font-body font-semibold tracking-widest flex flex-col w-1/3">
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
                              checked={allCrewInProject.some(name =>
                                String(name || '').trim().toLowerCase() === String(option.name || '').trim().toLowerCase()
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
                      key={idx}
                      className="min-h-16 flex items-start min-w-48 mb-2 px-3 rounded-2xl z-10 glass border border-gray-400"
                    >
                      <div className="flex w-full flex-col gap-2">
                        <div className="w-full flex items-center justify-between mt-2 mx-1">
                          <button
                            type="button"
                            className="text-xs px-1 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer" title="Delete crew job"
                            onClick={() => {
                              setFormData(prev => {
                                if (!prev.day?.[0]?.crew) return prev;
                                const updatedCrew = prev.day[0].crew.filter((_, i) => i !== idx);
                                return {
                                  ...prev,
                                  day: (prev.day || []).map((d, di) => di === 0 ? { ...d, crew: updatedCrew } : d)
                                };
                              });
                              // Also remove from additional crew if it's a custom member
                              if (member.name && !crewList.some(c => c.name === member.name)) {
                                setAdditionalCrewMembers(prev =>
                                  prev.filter(m => m.value !== member.name)
                                );
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#f8f8f8" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </button>
                          <p className="font-body text-light ">{member.name}</p>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded "
                            onClick={() => {
                              setFormData(prev => {
                                if (!prev.day?.[0]?.crew) return prev;
                                const updatedCrew = prev.day[0].crew.map((m, i) => {
                                  if (i !== idx) return m;
                                  return { ...m, roles: [...(m.roles || []), ""] };
                                });
                                return {
                                  ...prev,
                                  day: (prev.day || []).map((d, di) => di === 0 ? { ...d, crew: updatedCrew } : d)
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
                                const selectedRole = e.target.value;
                                // Enforce single Project Manager across the whole project
                                if ((selectedRole || '').toLowerCase() === 'project manager') {
                                  const hasPmElsewhere = (formData.day[0]?.crew || []).some((m, mIdx) => {
                                    if (!m) return false;
                                    const sameMember = mIdx === idx;
                                    const roles = Array.isArray(m.roles) ? m.roles : [];
                                    return roles.some(r => (r || '').toLowerCase() === 'project manager') && !sameMember;
                                  });
                                  if (hasPmElsewhere) {
                                    showToast('Project Manager already selected', 'error');
                                    return;
                                  }
                                }
                                setFormData(prev => {
                                  if (!prev.day?.[0]?.crew) return prev;
                                  const updatedCrew = prev.day[0].crew.map((m, i) => {
                                    if (i !== idx) return m;
                                    const updatedRoles = [...(m.roles || [])];
                                    updatedRoles[roleIdx] = selectedRole;
                                    return { ...m, roles: updatedRoles };
                                  });
                                  return {
                                    ...prev,
                                    day: (prev.day || []).map((d, di) => di === 0 ? { ...d, crew: updatedCrew } : d)
                                  };
                                });
                              }}
                              className="font-body outline-none p-1"
                            >
                              <option value="" className="text-dark bg-light">Select Jobdesk</option>
                              {[...selectedRoleList]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(roleOption => (
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
                                    if (!prev.day?.[0]?.crew) return prev;
                                    const updatedCrew = prev.day[0].crew.map((m, i) => {
                                      if (i !== idx) return m;
                                      const updatedRoles = (m.roles || []).filter((_, rIdx) => rIdx !== roleIdx);
                                      return { ...m, roles: updatedRoles };
                                    });
                                    return {
                                      ...prev,
                                      day: (prev.day || []).map((d, di) => di === 0 ? { ...d, crew: updatedCrew } : d)
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
    ) : null
  );
};

export default CreateModal;
