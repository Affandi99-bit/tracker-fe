import React, { useEffect, useState } from 'react';
import { praprod, prod, postprod, manafile } from '../constant/constant';

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
        <div className='fixed glass-dark text-light z-50 bottom-0 left-0 rounded-lg shadow-lg p-4 flex flex-col justify-start items-start gap-2'>
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
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className='bg-green-500 text-white font-body tracking-widest font-semibold rounded-lg p-2 transition ease-in-out hover:scale-105 duration-300 active:scale-95'
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className='bg-gray-400 text-white font-body tracking-widest font-semibold rounded-lg p-2 transition ease-in-out hover:scale-105 duration-300 active:scale-95'
                    >
                        Cancel
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
            <section className='z-10 p-2 w-1/4 flex flex-col items-center justify-center text-start'>
                <p className='p-2 font-bold tracking-widest text-lg'>{title}</p>
                {/* Persentase */}
                <main className='flex items-center gap-1'>
                    <div className="w-48 m-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                        <div
                            className="bg-[#132a4b] h-2.5 rounded-full transition-all duration-300"
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
                                className={`bg-white relative overflow-hidden flex flex-col justify-between items-start p-4 size-56 rounded shadow mb-2 hover:opacity-65 cursor-pointer transition-colors duration-200 ${isChecked ? 'ring-2 ring-[#1e3e3b]' : ''}`}
                            >
                                <button
                                    className='absolute top-1 right-1 z-10 opacity-45 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(index);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                                <span className='absolute -top-1 blur-xs -right-1 z-10 opacity-45'>
                                    {isChecked && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1e3e3b" className="size-20">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    )}
                                </span>
                                <div className='flex flex-col gap-1 mt-2 border-b border-b-dark w-full'>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={e => {
                                            const updated = [...data];
                                            updated[index].title = e.target.value;
                                            setData(updated);
                                        }}
                                        className="font-semibold text-sm tracking-wider  outline-none"
                                        placeholder="Title"
                                    />
                                    <input
                                        type="text"
                                        value={item.pic}
                                        onChange={e => {
                                            const updated = [...data];
                                            updated[index].pic = e.target.value;
                                            setData(updated);
                                        }}
                                        className="text-gray-400 text-xs py-1 border-b border-gray-200 outline-none"
                                        placeholder="PIC"
                                    />
                                    {/* <div className='flex w-full items-center justify-between'>
                                        <p>Name</p>
                                        <select name="" id="">
                                            <option value="ame.role"></option>
                                        </select>
                                    </div> */}
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
                                            className='rounded-xl border border-dark/20 text-xs px-2 outline-none'
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
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div
                        className='w-full min-w-48 h-10 border border-dark/50 rounded-lg mt-2 flex items-center justify-center transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'
                        onClick={() => {
                            // Pass the correct section key
                            if (title === 'Pra Produksi') setAddBoxSection('praprod');
                            else if (title === 'Produksi') setAddBoxSection('prod');
                            else if (title === 'Post Produksi') setAddBoxSection('postprod');
                            else if (title === 'File Management') setAddBoxSection('manafile');
                            setShowAddBox(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.5} stroke="#222222" className="size-6">
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
                link: Array.isArray(item.link) ? item.link : [item.link || ''],
            })),
            prod: prodData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link) ? item.link : [item.link || ''],
            })),
            postprod: postprodData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link) ? item.link : [item.link || ''],
            })),
            manafile: manafileData.map(item => ({
                title: item.title || '',
                pic: item.pic || '',
                status: item.status || '',
                link: Array.isArray(item.link) ? item.link : [item.link || ''],
            })),
        };
        const updatedProject = {
            ...project,
            kanban
        };
        console.log("Updating project:", updatedProject);
        try {
            await updateData(updatedProject);
            // showToast("Kanban updated!");
        } catch (err) {
            // showToast("Failed to update Kanban!");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className='bg-light font-body text-dark w-full h-screen overflow-y-auto fixed top-0 left-0 z-50'>
            <img src="/logo.webp" alt="" className='z-0 opacity-10 fixed invert -rotate-12 right-0 top-0 size-[50rem] pointer-events-none object-contain' />
            <section className='flex items-center justify-between'>
                <div className='w-40'>
                    <button onClick={() => { setKanban(false) }} className='transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center items-center gap-2 p-3 m-2 glass rounded-2xl'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Go Back
                    </button>
                </div>
                <div className="w-full flex flex-col gap-1 justify-end items-end mx-5">
                    <div className="w-full m-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                        <div
                            className="bg-[#1e3e3b] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                    <p className="text-gray-500 text-xs">{Math.round(overallProgress)}%</p>
                </div>
            </section>
            <div className='flex items-start justify-center gap-5 w-full'>
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
                className='fixed z-20 bottom-5 right-5 cursor-pointer bg-dark text-light font-body tracking-widest font-semibold rounded-lg p-2 transition ease-in-out hover:scale-105 duration-300 active:scale-95 disabled:opacity-50'
            >
                {isSaving ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin size-5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none" />
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
                className="glass text-dark border border-dark rounded-lg p-2 m-2 fixed z-20 bottom-5 left-5 cursor-pointer font-body tracking-widest font-semibold transition ease-in-out hover:scale-105 duration-300 active:scale-95 disabled:opacity-50"
            >
                Reset Value
            </button>
        </main>
    );
};

export default Kanban;
