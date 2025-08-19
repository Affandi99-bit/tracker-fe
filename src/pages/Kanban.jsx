import React, { useEffect, useState, useRef } from 'react';
import { vidProd, design, motion, dokumentasi } from '../constant/constant';
import { useToast } from '../components/ToastContext';
import { KanbanModal } from '../components';

const GOOGLE_API_KEY = "AIzaSyDc6sqyAKybW9hTzMylP3QHtSc78xUbRXI";
const typeOptions = [
    { label: "Produksi", value: "Produksi", constant: vidProd },
    { label: "Design", value: "Design", constant: design },
    { label: "Motion", value: "Motion", constant: motion },
    { label: "Dokumentasi", value: "Dokumentasi", constant: dokumentasi },
];

const ResetModal = ({ onCancel, onReset }) => (
    <div className='fixed top-0 left-0 z-50 glass w-full h-full flex items-center justify-center'>
        <section className='bg-dark border border-light/50 rounded-lg p-5 text-light flex flex-col justify-center items-center w-xl h-48'>
            <p className='text-center font-body'>
                Are you sure you want to reset this kanban? This action cannot be undone.
            </p>
            <div className='flex items-center justify-end gap-5 w-full mt-5'>
                <button
                    className='w-20 h-10 border border-light text-light rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className='w-20 h-10 bg-light text-dark rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                    onClick={onReset}
                >
                    Reset
                </button>
            </div>
        </section>
    </div>
);
const DriveFolderPreview = ({ url }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const extractFolderId = (url) => {
            const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
            return match ? match[1] : null;
        };

        const fetchFiles = async (folderId) => {
            setLoading(true);
            const query = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${GOOGLE_API_KEY}`;
            const res = await fetch(query);
            const data = await res.json();
            setFiles(data.files || []);
            setLoading(false);
        };

        const folderId = extractFolderId(url);
        if (folderId) {
            fetchFiles(folderId);
        }
    }, [url]);

    if (files.length === 0 && !loading) return null;

    return (
        <div className="mt-1 rounded-xl bg-[#1c1c1c] p-2 text-xs font-body text-light ">
            <p className="font-semibold mb-1">Isi Folder:</p>
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin size-5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="#222222" strokeWidth="4" fill="none" />
                    </svg>
                </span>
            ) : (
                <ul className="list-disc list-inside">
                    {files.map((file) => (
                        <li key={file.id}>
                            {file.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
function useDebouncedSave(updateData, delay = 500) {
    const timeout = useRef(null);
    return (updatedProject) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            updateData(updatedProject).then(() => {
            }).catch(err => {
                console.error('Debounced save failed:', err);
            });
        }, delay);
    };
}

const Kanban = ({ updateData, setKanban, project, onProjectUpdate }) => {
    if (!project || !project._id || !project.categories || !project.categories.length) {
        console.error('Invalid project data:', project);
        return <div>Invalid project data</div>;
    }

    const selectedKanban = (() => {
        return Array.isArray(project.kanban)
            ? project.kanban.find(k => k.type === project.categories[0])
            : null;
    })();

    function getCurrentConstant() {
        const opt = typeOptions.find(o => o.value === project.categories[0]);
        return opt ? opt.constant : vidProd;
    }
    const getStepData = (stepName) => {
        if (selectedKanban && selectedKanban.steps) {
            const step = selectedKanban.steps.find(s => s.name === stepName);
            return step ? step.items : [];
        }
        return getCurrentConstant()[stepName] || [];
    }
    const [showResetModal, setShowResetModal] = useState(false);
    const [praprodData, setPraprodData] = useState(getStepData("praprod"));
    const [prodData, setProdData] = useState(getStepData("prod"));
    const [postprodData, setPostprodData] = useState(getStepData("postprod"));
    const [manafileData, setManafileData] = useState(getStepData("manafile"));
    const [draft, setDraft] = useState(null);
    const [showKanbanModal, setKanbanModal] = useState(false);
    const [modalStepIndex, setModalStepIndex] = useState(null);
    const [modalItemIndex, setModalItemIndex] = useState(null);

    const { showToast } = useToast();
    const debouncedSave = useDebouncedSave(updateData);

    useEffect(() => {
        const constant = getCurrentConstant();

        // Initialize with empty arrays first
        setPraprodData([]);
        setProdData([]);
        setPostprodData([]);
        setManafileData([]);

        // Check if project has existing kanban data
        const selected = Array.isArray(project.kanban)
            ? project.kanban.find(k => k.type === project.categories[0])
            : null;

        const getData = (stepName) => {
            if (selected && selected.steps) {
                const step = selected.steps.find(s => s.name === stepName);
                return step ? step.items : [];
            }
            // If no existing data, get from constants and structure properly
            const constantItems = constant[stepName] || [];
            return constantItems.map(item => ({
                ...item,
                done: false,
                link: [],
                note: ''
            }));
        };

        // Set the data
        const praprodItems = getData("praprod");
        const prodItems = getData("prod");
        const postprodItems = getData("postprod");
        const manafileItems = getData("manafile");

        setPraprodData(praprodItems);
        setProdData(prodItems);
        setPostprodData(postprodItems);
        setManafileData(manafileItems);

        // If no existing kanban data, create initial structure
        if (!selected && project.categories && project.categories.length > 0) {
            const initialKanban = [{
                type: project.categories[0],
                steps: [
                    { name: "praprod", items: praprodItems },
                    { name: "prod", items: prodItems },
                    { name: "postprod", items: postprodItems },
                    { name: "manafile", items: manafileItems }
                ]
            }];

            // Update project with initial kanban structure
            const updatedProject = {
                ...project,
                _id: project._id,
                kanban: initialKanban
            };

            // Save to database
            updateData(updatedProject).then(() => {
                // Update the project state
                Object.assign(project, updatedProject);

                // Notify parent component of the update
                if (onProjectUpdate) {
                    onProjectUpdate(updatedProject);
                }
            }).catch(err => {
                console.error('Error initializing kanban:', err);
                showToast("Error initializing kanban", "error");
            });
        }
    }, [project.kanban, project.categories]);


    const isProduksi = project.categories[0] === "Produksi" || project.categories[0] === "Dokumentasi";
    const stepList = isProduksi
        ? [
            { name: "praprod", label: "Pra Produksi", data: praprodData, setData: setPraprodData },
            { name: "prod", label: "Produksi", data: prodData, setData: setProdData },
            { name: "postprod", label: "Post Produksi", data: postprodData, setData: setPostprodData },
            { name: "manafile", label: "File Management", data: manafileData, setData: setManafileData }
        ]
        : [
            { name: "praprod", label: "Pra Produksi", data: praprodData, setData: setPraprodData },
            { name: "prod", label: "Design", data: prodData, setData: setProdData },
            { name: "postprod", label: "Motion", data: postprodData, setData: setPostprodData },
            { name: "manafile", label: "File Management", data: manafileData, setData: setManafileData }
        ];

    const openKanbanModal = (stepIdx, itemIdx = null) => {
        setModalStepIndex(stepIdx);
        setModalItemIndex(itemIdx);
        if (itemIdx !== null) {
            setDraft(stepList[stepIdx].data[itemIdx]);
        } else {
            setDraft({
                title: '',
                pic: '',
                note: '',
                link: [],
                done: false
            });
        }
        setKanbanModal(true);
    };

    const handleModalSave = async (updatedItem) => {
        try {
            if (modalStepIndex === null) {
                console.error('No step index selected');
                return;
            }

            // Validate and clean the updated item
            const cleanedItem = {
                ...updatedItem,
                link: Array.isArray(updatedItem.link) ? updatedItem.link.filter(l => (l.title && l.title.trim()) || (l.link && l.link.trim())) : []
            };

            // Get current step
            const step = stepList[modalStepIndex];
            let updatedData = [...step.data];

            // Update or add new item
            if (modalItemIndex !== null) {
                updatedData[modalItemIndex] = cleanedItem;
            } else {
                updatedData.push(cleanedItem);
            }

            // Update local state
            step.setData(updatedData);

            // Create updated kanban structure with current state
            const updatedKanban = [{
                type: project.categories[0],
                steps: [
                    {
                        name: "praprod",
                        items: modalStepIndex === 0 ? updatedData : praprodData
                    },
                    {
                        name: "prod",
                        items: modalStepIndex === 1 ? updatedData : prodData
                    },
                    {
                        name: "postprod",
                        items: modalStepIndex === 2 ? updatedData : postprodData
                    },
                    {
                        name: "manafile",
                        items: modalStepIndex === 3 ? updatedData : manafileData
                    }
                ]
            }];

            const updatedProject = {
                ...project,
                _id: project._id,
                kanban: updatedKanban
            };
            Object.assign(project, updatedProject);

            if (onProjectUpdate) {
                onProjectUpdate(updatedProject);
            }

            setKanbanModal(false);
            showToast("Kanban item saved successfully", "success");
        } catch (err) {
            console.error('Error saving kanban item:', err);
            showToast("Error saving kanban item", "error");
        }
    }

    const handleResetKanban = async () => {
        setShowResetModal(false);
        try {
            const updatedKanban = (project.kanban || []).filter(k => k.type !== project.categories[0]);
            const updatedProject = {
                ...project,
                _id: project._id,
                kanban: updatedKanban,
            };

            await updateData(updatedProject);

            // Update local state to reflect the reset
            setPraprodData([]);
            setProdData([]);
            setPostprodData([]);
            setManafileData([]);

            // Update the project state
            Object.assign(project, updatedProject);

            // Notify parent component of the update
            if (onProjectUpdate) {
                onProjectUpdate(updatedProject);
            }

            showToast("Kanban reset successfully", "success");
        } catch (err) {
            console.error('Error resetting kanban:', err);
            showToast("Error resetting kanban", "error");
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

    const renderSection = (title, data, setData, stepIdx) => {
        const checkedCount = data.filter(item => item?.done ?? false).length;
        return (
            <section key={title} className='z-10 p-2 flex flex-col items-center justify-center text-start'>
                <p className='p-2 font-bold tracking-widest text-lg'>{title}</p>
                {/* Persentase */}
                <main className='flex items-center gap-1'>
                    <div className="w-48 m-3 rounded-full h-1.5 bg-gray-700/25">
                        <div
                            className="bg-[#f8f8f8] h-1.5 rounded-full transition-all duration-300"
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

                                    // Create updated kanban structure
                                    const updatedKanban = [{
                                        type: project.categories[0],
                                        steps: stepList.map(step => ({
                                            name: step.name,
                                            items: step.name === stepList[stepIdx].name ? updated : step.data,
                                        })),
                                    }];

                                    const updatedProject = {
                                        ...project,
                                        _id: project._id,
                                        kanban: updatedKanban,
                                    };

                                    // Update the project state immediately
                                    Object.assign(project, updatedProject);

                                    // Notify parent component of the update
                                    if (onProjectUpdate) {
                                        onProjectUpdate(updatedProject);
                                    }

                                    // Save to database
                                    debouncedSave(updatedProject);
                                }}
                                className={`bg-[#262626] relative overflow-hidden flex flex-col justify-between items-start p-4 w-72 rounded-xl mb-2.5 hover:opacity-65 cursor-pointer transition duration-200 ${isChecked ? 'ring ring-[#f8f8f88e]' : ''}`}
                            >
                                <button
                                    className='absolute top-2 right-2 z-10 opacity-45 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                                    onClick={e => {
                                        e.stopPropagation();
                                        openKanbanModal(stepIdx, index);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f8f8f8" className="size-3">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                    </svg>
                                </button>
                                {/* Title & PIC */}
                                <div className='flex flex-col gap-1 mt-3 pb-5 border-b border-b-light/10 w-full'>
                                    <p className='text-md font-semibold tracking-wider'>{item.title}</p>
                                    <div className='flex w-full items-center justify-between'>
                                        {(() => {
                                            const firstRole = item.pic?.split('/')[0]?.trim();
                                            if (firstRole === "Crew" && project.day && project.day[0] && Array.isArray(project.day[0].crew)) {
                                                return (
                                                    <div className="flex flex-col gap-1">
                                                        <p className='text-xs font-medium'>Crew Produksi</p>
                                                        {project.day[0].crew.map((c, idx) => (
                                                            <p key={idx} className='text-xs text-gray-400'>{c.name}  ·  {c.roles.join(', ')}</p>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            const crew = getCrewByRole(firstRole);
                                            if (crew) {
                                                return <p className='text-xs text-gray-400'>{crew.name} as {firstRole}</p>;
                                            }
                                            return <p className='text-xs text-gray-400'>{firstRole}</p>;
                                        })()}
                                    </div>
                                </div>

                                {/* Links Section */}
                                <ul className='my-2 w-full'>
                                    {Array.isArray(item.link) && item.link.length > 0 && (
                                        <p className='text-xs font-semibold tracking-widest mb-2'>Links</p>
                                    )}
                                    {Array.isArray(item.link) && item.link.length > 0 ? (
                                        item.link.map((l, i) => (
                                            <React.Fragment key={i}>
                                                <li className='flex items-center gap-3 mb-2'>
                                                    {l.title && l.link && l.title !== l.link && (
                                                        <span className="text-xs text-gray-400 px-2 truncate">
                                                            {l.link}
                                                        </span>
                                                    )}
                                                    <a
                                                        href={l.link}
                                                        target='_blank'
                                                        rel="noreferrer"
                                                        className="text-xs px-2 py-1 text-blue-500 hover:underline truncate"
                                                    >
                                                        {l.title || l.link}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 inline-block ml-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                        </svg>
                                                    </a>
                                                </li>
                                                {typeof l.link === "string" && l.link.includes("drive.google.com/drive/folders/") && (
                                                    <DriveFolderPreview url={l.link} />
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : null}
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
                        className='w-full min-w-48 h-10 border border-light/50 rounded-xl mt-2 flex items-center justify-center transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
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

    return (
        <div role='main' className='bg-[#181818] font-body text-light w-full h-screen overflow-y-auto fixed top-0 left-0 z-40'>
            <section className='flex items-start justify-between gap-5 p-5'>
                <button
                    id='back'
                    onClick={() => {
                        // Create updated kanban structure with current state
                        const updatedKanban = [{
                            type: project.categories[0],
                            steps: stepList.map(step => ({
                                name: step.name,
                                items: step.data,
                            })),
                        }];

                        const updatedProject = {
                            ...project,
                            _id: project._id,
                            kanban: updatedKanban
                        };

                        // Save to database before closing
                        updateData(updatedProject).then(() => {
                            // Update the project state to reflect changes
                            Object.assign(project, updatedProject);

                            // Notify parent component of the update
                            if (onProjectUpdate) {
                                onProjectUpdate(updatedProject);
                            }

                            setKanban(false);
                        }).catch(err => {
                            console.error('Error saving before closing:', err);
                            showToast("Error saving changes", "error");
                        });
                    }}
                    className='w-32 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center items-center gap-2 text-xs'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back
                </button>
                {/* Category Tag */}
                <div className='flex flex-col gap-1 justify-end items-end mx-1'>
                    <p className='text-sm font-semibold tracking-wider'>
                        {(project.categories[0] === "Produksi" || project.categories[0] === "Dokumentasi")
                            ? "Blackstudio"
                            : "Blackmotion"}
                    </p>
                    <p className='text-xs'>{project.categories[0]}</p>
                </div>
            </section>
            <div className='flex items-start justify-evenly gap-5 pl-5 w-full'>
                {stepList.map((step, idx) =>
                    <React.Fragment key={step.name}>
                        {renderSection(step.label, step.data, step.setData, idx)}
                    </React.Fragment>
                )}
            </div>
            {showKanbanModal && (
                <KanbanModal
                    draft={draft}
                    onClose={() => setKanbanModal(false)}
                    onSave={handleModalSave}
                    onDelete={() => {
                        if (modalStepIndex !== null && modalItemIndex !== null) {
                            // Get current step
                            const step = stepList[modalStepIndex];
                            const updatedData = step.data.filter((_, idx) => idx !== modalItemIndex);

                            // Update local state
                            step.setData(updatedData);

                            // Create updated kanban structure with current state
                            const updatedKanban = [{
                                type: project.categories[0],
                                steps: [
                                    { name: "praprod", items: modalStepIndex === 0 ? updatedData : praprodData },
                                    { name: "prod", items: modalStepIndex === 1 ? updatedData : prodData },
                                    { name: "postprod", items: modalStepIndex === 2 ? updatedData : postprodData },
                                    { name: "manafile", items: modalStepIndex === 3 ? updatedData : manafileData }
                                ]
                            }];

                            // Create the final project update
                            const updatedProject = {
                                ...project,
                                _id: project._id,
                                kanban: updatedKanban
                            };

                            // Send update to database
                            updateData(updatedProject).then(() => {
                                // Update the project state to reflect changes
                                Object.assign(project, updatedProject);

                                // Notify parent component of the update
                                if (onProjectUpdate) {
                                    onProjectUpdate(updatedProject);
                                }

                                showToast("Kanban item deleted successfully", "success");
                            }).catch(err => {
                                console.error('Error updating:', err);
                                showToast("Error updating kanban", "error");
                            });

                            setKanbanModal(false);
                        }
                    }}
                />
            )}
            {showResetModal && (
                <ResetModal
                    onCancel={() => setShowResetModal(false)}
                    onReset={handleResetKanban}
                />
            )}
            <div className='fixed z-20 bottom-5 right-5 flex items-center gap-2'>
                <button
                    type="button"
                    onClick={() => { setShowResetModal(true) }}
                    className="border bg-dark border-light rounded-full p-1 m-2 cursor-pointer font-body tracking-widest font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95 "
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f8f8f8" className="size-5 hover:animate-spin">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>
        </div>
    )
};

export default Kanban;
