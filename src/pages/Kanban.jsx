import React, { useEffect, useState } from 'react';
import { praprod, prod, postprod, manafile } from '../constant/constant';
import { useToast } from '../components/ToastContext';

const AddBox = ({ onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [pic, setPic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !pic.trim()) return;
        onSave({ title, pic });
        setTitle('');
        setPic('');
        onClose();
    };

    return (
        <div className='fixed glass text-light z-50 bottom-20 right-2 rounded-lg -lg p-4 flex flex-col justify-start items-start gap-2'>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
                <label className="font-body font-semibold tracking-widest flex flex-col items-start justify-start">
                    Title
                    <input
                        required
                        placeholder="Title"
                        type="text"
                        name="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className=" border border-gray-400 font-light rounded p-2 font-body tracking-widest outline-none"
                    />
                </label>
                <label className="font-body font-semibold tracking-widest flex flex-col items-start justify-start">
                    PIC
                    <input
                        required
                        placeholder="PIC"
                        type="text"
                        name="pic"
                        value={pic}
                        onChange={e => setPic(e.target.value)}
                        className=" border border-gray-400 font-light rounded p-2 font-body tracking-widest outline-none"
                    />
                </label>
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className='border-gray-400 border border-dashed text-white font-body tracking-widest font-semibold rounded-lg p-2 transition ease-in-out hover:scale-105 duration-300 active:scale-95'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='bg-light text-dark font-body tracking-widest font-semibold rounded-lg p-2 transition ease-in-out hover:scale-105 duration-300 active:scale-95'
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}

const Kanban = ({ updateData, setKanban, project }) => {
    const [praprodData, setPraprodData] = useState(project?.kanban?.praprod || praprod);
    const [prodData, setProdData] = useState(project?.kanban?.prod || prod);
    const [postprodData, setPostprodData] = useState(project?.kanban?.postprod || postprod);
    const [manafileData, setManafileData] = useState(project?.kanban?.manafile || manafile);

    const [showAddBox, setShowAddBox] = useState(false);
    const [addBoxSection, setAddBoxSection] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        setPraprodData(project?.kanban?.praprod || praprod);
        setProdData(project?.kanban?.prod || prod);
        setPostprodData(project?.kanban?.postprod || postprod);
        setManafileData(project?.kanban?.manafile || manafile);
    }, [project]);

    const praprodProgress = praprodData.length ? (praprodData.filter(i => i.status === 'checked').length / praprodData.length) * 100 : 0;
    const prodProgress = prodData.length ? (prodData.filter(i => i.status === 'checked').length / prodData.length) * 100 : 0;
    const postprodProgress = postprodData.length ? (postprodData.filter(i => i.status === 'checked').length / postprodData.length) * 100 : 0;
    const manafileProgress = manafileData.length ? (manafileData.filter(i => i.status === 'checked').length / manafileData.length) * 100 : 0;
    const overallProgress = (praprodProgress + prodProgress + postprodProgress + manafileProgress) / 4;

    const renderSection = (title, data, setData) => {
        const handleDelete = (index) => {
            setData(data.filter((_, i) => i !== index));
        };

        const checkedCount = data.filter(item => item.status === 'checked').length;

        return (
            <section className='z-10 p-2 flex flex-col items-center justify-center text-start'>
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
                        const isChecked = item.status === 'checked';
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    const updated = [...data];
                                    updated[index].status = isChecked ? '' : 'checked';
                                    setData(updated);
                                }}
                                className={`bg-[#262626] relative overflow-hidden flex flex-col justify-between items-start p-4 w-56 rounded  mb-2 hover:opacity-65 cursor-pointer transition-colors duration-200 ${isChecked ? 'ring-2 ring-[#F8F8F8]' : ''}`}
                            >
                                <button
                                    className='absolute top-1 right-1 z-10 opacity-45 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(index);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#F8F8F8" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                                <span className='absolute -bottom-1 -left-1 z-10 opacity-10'>
                                    {isChecked && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#F8F8F8" className="size-20">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
                                {/* Links Section */}
                                <div className="flex flex-col gap-1 w-full mt-2">
                                    {(Array.isArray(item.link) && item.link.length > 0) && item.link.map((linkValue, linkIdx) => (
                                        <div key={linkIdx} className="flex items-center justify-between w-full ">
                                            <a href={linkValue} target='_blank' className="truncate text-xs px-2 py-1 text-blue-500">{linkValue}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 inline-block ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                </svg>
                                            </a>
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    const updated = [...data];
                                                    const links = Array.isArray(updated[index].link) ? [...updated[index].link] : [];
                                                    links.splice(linkIdx, 1);
                                                    updated[index].link = links;
                                                    setData(updated);
                                                }}
                                                className="text-red-500 text-xs px-1"
                                                title="Delete link"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="text"
                                            value={item.newLink || ''}
                                            onChange={e => {
                                                const updated = [...data];
                                                updated[index].newLink = e.target.value;
                                                setData(updated);
                                            }}
                                            className='rounded-xl border border-light/50 text-xs px-2 outline-none'
                                            placeholder="Add new link"
                                            onClick={e => e.stopPropagation()}
                                        />
                                        <button
                                            type="button"
                                            onClick={e => {
                                                e.stopPropagation();
                                                const updated = [...data];
                                                const links = Array.isArray(updated[index].link) ? [...updated[index].link] : [];
                                                if (updated[index].newLink && updated[index].newLink.trim() !== '') {
                                                    links.push(updated[index].newLink.trim());
                                                    updated[index].link = links;
                                                    updated[index].newLink = '';
                                                    setData(updated);
                                                }
                                            }}
                                            className='outline-none transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                                            title="Add link"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {/* Note section */}
                                <div className="flex items-end gap-2 mt-1">
                                    <textarea
                                        value={item.note || ''}
                                        onChange={e => {
                                            const updated = [...data];
                                            updated[index].note = e.target.value;
                                            setData(updated);
                                        }}
                                        className='rounded-xl border border-light/50 min-h-20 no-scrollbar text-xs p-2 outline-none'
                                        placeholder="Add note"
                                        onClick={e => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    {/* Add Box Button */}
                    <div
                        className='w-full min-w-48 h-10 border border-light/50 rounded-lg mt-2 flex items-center justify-center transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                        onClick={() => {
                            if (title === 'Pra Produksi') setAddBoxSection('praprod');
                            else if (title === 'Produksi') setAddBoxSection('prod');
                            else if (title === 'Post Produksi') setAddBoxSection('postprod');
                            else if (title === 'File Management') setAddBoxSection('manafile');
                            setShowAddBox(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.5} stroke="#f8f8f8" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>
            </section>
        );
    }
    const handleAddBox = (section, item) => {
        const newItem = { ...item, status: '', link: [] };
        if (section === 'praprod') setPraprodData(prev => [...prev, newItem]);
        if (section === 'prod') setProdData(prev => [...prev, newItem]);
        if (section === 'postprod') setPostprodData(prev => [...prev, newItem]);
        if (section === 'manafile') setManafileData(prev => [...prev, newItem]);
    };

    // Save handler
    const handleSave = async () => {
        setIsSaving(true);
        const kanban = {
            praprod: praprodData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link)
                    ? item.link.filter(l => l && l.trim() !== '')
                    : item.link && item.link.trim() !== '' ? [item.link] : [],
                note: item.note || '',
            })),
            prod: prodData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link)
                    ? item.link.filter(l => l && l.trim() !== '')
                    : item.link && item.link.trim() !== '' ? [item.link] : [],
                note: item.note || '',
            })),
            postprod: postprodData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link)
                    ? item.link.filter(l => l && l.trim() !== '')
                    : item.link && item.link.trim() !== '' ? [item.link] : [],
                note: item.note || '',
            })),
            manafile: manafileData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link)
                    ? item.link.filter(l => l && l.trim() !== '')
                    : item.link && item.link.trim() !== '' ? [item.link] : [],
                note: item.note || '',
            })),
        };

        const sections = [praprodData, prodData, postprodData, manafileData];
        const allDone = sections.every(
            section => section.length > 0 && section.every(item => item.status === 'checked')
        );

        let updatedStatus = project.status || "";
        if (allDone) {
            updatedStatus = "Done";
        }

        const updatedProject = {
            ...project,
            kanban,
            status: updatedStatus,
            archived: allDone ? true : project.archived
        };

        console.log("Updating project:", updatedProject);
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
            c.roles.some(r => r.toLowerCase() === role.toLowerCase())
        );
    }

    return (
        <div role='main' className='bg-dark font-body text-light w-full h-screen overflow-y-auto fixed top-0 left-0 z-50'>
            <img src="/logo.webp" alt="" className='z-0 opacity-5 fixed -rotate-12 right-0 top-0 size-[50rem] pointer-events-none object-contain' />
            <section className='flex items-start justify-between gap-5 p-5'>
                <button id='back' onClick={() => { setKanban(false) }} className='w-32 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center items-center gap-2 text-xs'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Go Back
                </button>
                <div className="w-full flex flex-col gap-1 justify-end items-end mx-5">
                    <div className="w-full m-1 rounded-full h-2.5 bg-gray-700/25">
                        <div
                            className="bg-[#F8F8F8] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                    <p className="text-gray-500 text-xs">{Math.round(overallProgress)}%</p>
                </div>
            </section>
            <div className='flex items-start justify-center gap-5 pl-5 w-full'>
                {renderSection('Pra Produksi', praprodData, setPraprodData)}
                {renderSection('Produksi', prodData, setProdData)}
                {renderSection('Post Produksi', postprodData, setPostprodData)}
                {renderSection('File Management', manafileData, setManafileData)}
            </div>
            {showAddBox && (
                <AddBox
                    onSave={item => handleAddBox(addBoxSection, item)}
                    onClose={() => setShowAddBox(false)}
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
                    setPraprodData(praprod);
                    setProdData(prod);
                    setPostprodData(postprod);
                    setManafileData(manafile);
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
