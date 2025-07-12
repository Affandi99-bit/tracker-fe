import React, { useEffect, useState } from 'react';
import { vidProd, design, motion, dokumentasi } from '../constant/constant';
import { useToast } from '../components/ToastContext';
import { KanbanModal } from '../components';

// Use capitalized values to match your constants and database
const typeOptions = [
    { label: "Produksi", value: "Produksi", constant: vidProd },
    { label: "Design", value: "Design", constant: design },
    { label: "Motion", value: "Motion", constant: motion },
    { label: "Dokumentasi", value: "Dokumentasi", constant: dokumentasi },
];

const Kanban = ({ updateData, setKanban, project }) => {
    // Get selected category (string)
    const selectedCategory = Array.isArray(project?.categories)
        ? project.categories[0]
        : project?.categories || "Produksi";

    // Find the typeOption that matches the selected category
    const selectedTypeOption = typeOptions.find(opt => opt.value === selectedCategory) || typeOptions[0];

    // Use only the selected type's constant
    const getCurrentConstant = () => selectedTypeOption.constant;

    // Helper to get kanban step data from project
    const getStepData = (stepName) => {
        if (project?.kanban?.steps && project?.kanban?.type === selectedCategory) {
            const step = project.kanban.steps.find(s => s.name === stepName);
            return step ? step.items : [];
        }
        // fallback to constant
        return getCurrentConstant()[stepName] || [];
    };

    const [praprodData, setPraprodData] = useState(getStepData("praprod"));
    const [prodData, setProdData] = useState(getStepData("prod"));
    const [postprodData, setPostprodData] = useState(getStepData("postprod"));
    const [manafileData, setManafileData] = useState(getStepData("manafile"));
    const [draft, setDraft] = useState(null);
    const [showKanbanModal, setKanbanModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modalStepIndex, setModalStepIndex] = useState(null);
    const [modalItemIndex, setModalItemIndex] = useState(null);

    const { showToast } = useToast();

    useEffect(() => {
        setPraprodData(getStepData("praprod"));
        setProdData(getStepData("prod"));
        setPostprodData(getStepData("postprod"));
        setManafileData(getStepData("manafile"));
        // eslint-disable-next-line
    }, [project.kanban, selectedCategory]);

    // Progress calculation for selected category only
    const praprodProgress = praprodData.length ? (praprodData.filter(i => i.done === true).length / praprodData.length) * 100 : 0;
    const prodProgress = prodData.length ? (prodData.filter(i => i.done === true).length / prodData.length) * 100 : 0;
    const postprodProgress = postprodData.length ? (postprodData.filter(i => i.done === true).length / postprodData.length) * 100 : 0;
    const manafileProgress = manafileData.length ? (manafileData.filter(i => i.done === true).length / manafileData.length) * 100 : 0;
    const overallProgress = (praprodProgress + prodProgress + postprodProgress + manafileProgress) / 4;

    // Only show progress for the selected type (sum all steps for that type)
    const stepProgresses = [
        praprodData,
        prodData,
        postprodData,
        manafileData
    ].map(data => data.length ? (data.filter(i => i.done === true).length / data.length) * 100 : 0);

    // Show the average progress for the selected type only (not all types)
    const selectedTypeProgress = stepProgresses.reduce((a, b) => a + b, 0) / stepProgresses.length;

    const openKanbanModal = (stepIdx, itemIdx = null) => {
        setModalStepIndex(stepIdx);
        setModalItemIndex(itemIdx);
        if (itemIdx !== null) {
            setDraft(stepList[stepIdx].data[itemIdx]);
        } else {
            setDraft({ title: '', pic: '', note: '', link: [], todo: [], done: '' });
        }
        setKanbanModal(true);
    };

    const handleModalSave = (updatedItem) => {
        if (modalStepIndex === null) return;
        const step = stepList[modalStepIndex];
        let updatedData = [...step.data];
        if (modalItemIndex !== null) {
            updatedData[modalItemIndex] = updatedItem;
        } else {
            updatedData.push(updatedItem);
        }
        step.setData(updatedData);
        setKanbanModal(false);
    };

    const renderSection = (title, data, setData, stepIdx) => {
        const checkedCount = data.filter(item => item.done === true).length;

        return (
            <section key={title} className='z-10 p-2 flex flex-col items-center justify-center text-start'>
                <p className='p-2 font-bold tracking-widest text-lg'>{title}</p>
                {/* Persentase */}
                <main className='flex items-center gap-1'>
                    <div className="w-48 m-2  rounded-full h-2.5 bg-gray-700/25">
                        <div
                            className="bg-[#f8f8f8] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(checkedCount / data.length) * 100}%` }}
                        />
                    </div>
                    <p className='text-gray-400 text-xs'>{Math.round((checkedCount / data.length) * 100)}%</p>
                </main>
                <div>
                    {data.map((item, index) => {
                        const isChecked = item.done === true;
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    const updated = [...data];
                                    updated[index].done = !isChecked;
                                    setData(updated);
                                }}
                                className={`bg-[#262626] relative overflow-hidden flex flex-col justify-between items-start p-4 w-72 rounded mb-2 hover:opacity-65 cursor-pointer transition duration-200 ${isChecked ? 'ring-2 ring-[#F8F8F8]' : ''}`}
                            >
                                <button
                                    className='absolute top-1 right-1 z-10 opacity-45 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                                    onClick={e => {
                                        e.stopPropagation();
                                        openKanbanModal(stepIdx, index);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                    </svg>
                                </button>
                                <span className='absolute -bottom-1 -right-1 z-10 opacity-10'>
                                    {isChecked && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f8f8f8" className="size-20">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                        </svg>
                                    )}
                                </span>
                                {/* Title & PIC */}
                                <div className='flex flex-col gap-1 my-3 border-b border-b-light/10 w-full'>
                                    <p className='text-md '>{item.title}</p>
                                    <div className='flex w-full items-center justify-between'>
                                        {(() => {
                                            const firstRole = item.pic?.split('/')[0]?.trim();
                                            const crew = getCrewByRole(firstRole);
                                            if (crew) {
                                                return <p className='text-xs text-gray-400'>{crew.name} as {firstRole}</p>;
                                            }
                                            return <p className='text-xs text-gray-400'>{firstRole}</p>;
                                        })()}
                                    </div>
                                </div>
                                <ul className='my-2'>
                                    {/* Show todo as a list of checkboxes/text */}
                                    {Array.isArray(item.todo) && item.todo.length > 0 ? (
                                        item.todo.map((todo, i) => (
                                            <li key={i} className="flex items-center gap-1 text-xs">
                                                <label
                                                    key={index}
                                                    className={`flex flex-row items-center gap-2 font-body tracking-widest cursor-pointer `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="todo"
                                                        checked={!!todo.done}
                                                        onChange={e => {
                                                            // Prevent parent click
                                                            e.stopPropagation();
                                                            const updated = [...data];
                                                            updated[index].todo = updated[index].todo.map((t, idx) =>
                                                                idx === i ? { ...t, done: !t.done } : t
                                                            );
                                                            setData(updated);
                                                        }}
                                                        className="peer hidden"
                                                    />
                                                    <div className="size-3 flex rounded bg-dark peer-checked:bg-light">
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            className="size-3 stroke-dark peer-checked:stroke-dark"
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
                                                    {!todo.done ? (
                                                        <span>{todo.title}</span>
                                                    ) : (
                                                        <span className="line-through text-gray-400">{todo.title}</span>
                                                        // Or to hide: null
                                                    )}
                                                </label>

                                            </li>
                                        ))
                                    ) : null}
                                </ul>
                                <ul className='my-2 w-full'>
                                    {/* Show links as clickable anchors */}
                                    {Array.isArray(item.link) && item.link.length > 0 ? (
                                        item.link.map((l, i) => (
                                            <li key={i} className='flex items-start justify-start'>
                                                <a href={l} target='_blank' rel="noreferrer" className="truncate text-xs px-2 py-1 text-blue-500">
                                                    {l}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 inline-block ml-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        null
                                    )}
                                </ul>
                                {item.note && item.note.trim() !== '' && (
                                    <>
                                        <p className='text-xs font-semibold tracking-widest mb-2'>Note</p>
                                        <textarea
                                            className="w-full bg-transparent text-xs border-none resize-none outline-none cursor-default"
                                            value={item.note}
                                            readOnly
                                        />
                                    </>
                                )}
                            </div>
                        )
                    })}
                    {/* Add Box Button */}
                    <div
                        className='w-full min-w-48 h-10 border border-light/50 rounded-lg mt-2 flex items-center justify-center transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                        onClick={() => openKanbanModal(stepIdx)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.5} stroke="#f8f8f8" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>
            </section>
        );
    }
    // Save handler
    const handleSave = async () => {
        setIsSaving(true);

        // Build steps array for kanban
        const steps = stepList.map(step => ({
            name: step.name,
            items: (step.data || []).map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                done: item.done === true,
                link: Array.isArray(item.link)
                    ? item.link.filter(l => l && l.trim() !== '')
                    : item.link && item.link.trim() !== '' ? [item.link] : [],
                note: item.note || '',
                todo: Array.isArray(item.todo)
                    ? item.todo.map(t => ({
                        title: t.title || '',
                        done: !!t.done
                    }))
                    : [],
            }))
        }));

        const kanban = {
            type: selectedCategory,
            steps
        };

        const allDone = stepList.every(
            step => step.data.length > 0 && step.data.every(item => item.done === true)
        );

        let updatedDone = project.done;
        if (allDone) {
            updatedDone = true;
        }

        const updatedProject = {
            ...project,
            kanban,
            done: updatedDone,
            archived: allDone ? true : project.archived
        };

        try {
            await updateData(updatedProject);
            showToast("Kanban Updated", 'success');
        } catch (err) {
            showToast("Kanban Failed to Update", 'error', err);
        } finally {
            setIsSaving(false);
        }
    };

    function getCrewByRole(role) {
        if (!project.day || !project.day[0] || !project.day[0].crew) return null;
        const crewList = project.day[0].crew;
        return crewList.find(c =>
            (Array.isArray(c.roles) && c.roles.some(r => r.toLowerCase() === role.toLowerCase())) ||
            (c.name && c.name.toLowerCase() === role.toLowerCase())
        );
    }

    const getStepLabel = (stepName) => {
        if (selectedCategory === "Design") {
            if (stepName === "prod" || stepName === "postprod") return "Design";
        }
        if (selectedCategory === "Motion") {
            if (stepName === "prod" || stepName === "postprod") return "Motion";
        }
        // Default labels
        switch (stepName) {
            case "praprod": return "Pra Produksi";
            case "prod": return "Produksi";
            case "postprod": return "Post Produksi";
            case "manafile": return "File Management";
            default: return stepName;
        }
    };

    const stepList = [
        { name: "praprod", label: getStepLabel("praprod"), data: praprodData, setData: setPraprodData },
        { name: "prod", label: getStepLabel("prod"), data: prodData, setData: setProdData },
        { name: "postprod", label: getStepLabel("postprod"), data: postprodData, setData: setPostprodData },
        { name: "manafile", label: getStepLabel("manafile"), data: manafileData, setData: setManafileData }
    ];

    return (
        <div role='main' className='bg-dark font-body text-light w-full h-screen overflow-y-auto fixed top-0 left-0 z-40'>
            <img src="/logo.webp" alt="" className='z-0 opacity-5 fixed -rotate-12 right-0 top-0 size-[50rem] pointer-events-none object-contain' />
            <section className='flex items-start justify-between gap-5 p-5'>
                <button id='back' onClick={() => { setKanban(false) }} className='w-32 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center items-center gap-2 text-xs'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Go Back
                </button>
                {/* Overall Progress Bar */}
                <div className="w-full flex flex-col gap-1 justify-end items-end mx-5">
                    <div className="w-full m-1 rounded-full h-2.5 bg-gray-700/25">
                        <div
                            className="bg-[#F8F8F8] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                    <p className="text-gray-400 text-xs">Progress: {Math.round(overallProgress)}%</p>
                </div>
                {/* Show selected category */}
                <div className='text-xs font-semibold text-light tracking-wider'>
                    <span className='font-normal'>Category:</span> {selectedTypeOption.label}
                </div>
            </section>
            <div className='flex items-start justify-evenly gap-5 pl-5 w-full'>
                {stepList.map((step, idx) =>
                    renderSection(step.label, step.data, step.setData, idx)
                )}
            </div>
            {showKanbanModal && (
                <KanbanModal
                    draft={draft}
                    onClose={() => setKanbanModal(false)}
                    onSave={handleModalSave}
                    onDelete={() => {
                        if (modalStepIndex !== null && modalItemIndex !== null) {
                            const step = stepList[modalStepIndex];
                            const updatedData = step.data.filter((_, idx) => idx !== modalItemIndex);
                            step.setData(updatedData);
                            setKanbanModal(false);
                        }
                    }}
                />
            )}
            <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className='fixed z-20 bottom-5 right-5 cursor-pointer bg-light text-dark font-body tracking-widest font-semibold rounded-lg p-2 transition ease-in-out hover:scale-105 duration-300 active:scale-95 disabled:opacity-50'
            >
                {isSaving ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin size-5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="#222222" strokeWidth="4" fill="none" />
                        </svg>
                        Saving...
                    </span>
                ) : "Save"}
            </button>
            <button
                type="button"
                onClick={() => {
                    const constant = getCurrentConstant();
                    setPraprodData(constant.praprod);
                    setProdData(constant.prod);
                    setPostprodData(constant.postprod);
                    setManafileData(constant.manafile);
                }}
                className="glass text-light border border-light rounded-lg p-2 m-2 fixed z-20 bottom-20 right-5 cursor-pointer font-body tracking-widest font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95 "
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff" className="size-6 hover:animate-spin">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div>
    );
};

export default Kanban;
