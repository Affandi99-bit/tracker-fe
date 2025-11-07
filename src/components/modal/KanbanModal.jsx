import React, { useState, useEffect } from 'react';
import { useRoleProduction } from "../../hook"
const KanbanModal = ({ draft, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState(draft.title || '');
    const [pic, setPic] = useState(draft.pic || '');
    const [note, setNote] = useState(draft.note || '');
    const [done, setDone] = useState(!!draft.done);

    // Links → always array of { title, link }
    const [links, setLinks] = useState(
        Array.isArray(draft.link)
            ? draft.link.map(l =>
                typeof l === "string"
                    ? { title: l, link: l }
                    : { title: l.title || l.link, link: l.link }
            )
            : []
    );

    const [newLink, setNewLink] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');

    const roleProduction = useRoleProduction();

    const handleSave = () => {
        const updated = {
            ...draft,
            title,
            pic,
            note,
            done,
            link: links,
        };
        onSave(updated);
        onClose();
    };

    const removeLink = (idx) => setLinks(links.filter((_, i) => i !== idx));
    const addLink = () => {
        if (newLink.trim() || newLinkTitle.trim()) {
            const linkTitle = newLinkTitle.trim() || newLink.trim();
            const linkUrl = newLink.trim() || newLinkTitle.trim();

            setLinks([
                ...links,
                {
                    title: linkTitle,
                    link: linkUrl
                }
            ]);
            setNewLink('');
            setNewLinkTitle('');
        }
    };
    return (
        <main
            onClick={onClose}
            className="backdrop z-50 backdrop-blur fixed top-0 left-0 flex items-center justify-center w-full h-screen"
        >
            <div onClick={(e) => e.stopPropagation()} className="">
                <section className="relative overflow-hidden w-[50rem] h-[25rem] bg-dark text-light font-body border border-light rounded-2xl">
                    <main className='relative flex items-start justify-between h-full p-4'>
                        <button onClick={onClose} className='absolute top-1 left-1 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>

                        {/* Left Column */}
                        <section className='w-1/2 h-full p-3 '>
                            <section className='flex flex-col items-start justify-start gap-2 h-full'>
                                <div className='flex items-center justify-between gap-2 w-full'>
                                    <input type="text" className='w-1/2 glass outline-none p-2 text-xs rounded-xl' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
                                    <select
                                        value={pic}
                                        onChange={e => setPic(e.target.value)}
                                        className='w-1/2 glass outline-none py-2 px-3 text-xs rounded-xl appearance-none'
                                        name="jobdesk select"
                                        id="jobselect"
                                    >
                                        <option value="" className="text-dark bg-light">Select PIC</option>
                                        {[...roleProduction]
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map(roleOption => (
                                                <option key={roleOption.id} value={roleOption.name} className="text-dark bg-light">
                                                    {roleOption.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                {/* Done Checkbox */}
                                <label className={`flex flex-row items-center gap-1 tracking-widest cursor-pointer`}>
                                    <input
                                        type="checkbox"
                                        checked={done}
                                        onChange={e => setDone(e.target.checked)}
                                        className="peer hidden"
                                    />
                                    <div className="size-3 flex rounded border border-light bg-dark peer-checked:bg-light transition cursor-pointer">
                                        <svg fill="none" viewBox="0 0 24 24" className="size-3 stroke-dark peer-checked:stroke-dark" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className='text-xs'>Set as Done</p>
                                </label>
                                {/* Add New Link Inputs */}
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="text"
                                        className='rounded-xl border border-light/50 text-xs px-2 outline-none flex-1'
                                        placeholder="Link Title"
                                        value={newLinkTitle}
                                        onChange={e => setNewLinkTitle(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className='rounded-xl border border-light/50 text-xs px-2 outline-none flex-1'
                                        placeholder="Link URL"
                                        value={newLink}
                                        onChange={e => setNewLink(e.target.value)}
                                    />
                                    <button type="button" onClick={addLink} className='transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer' title="Add link">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Note */}
                                <textarea className='glass rounded-xl outline-none p-1 w-full min-h-20 text-xs' placeholder='Note' value={note} onChange={e => setNote(e.target.value)} />
                            </section>
                        </section>

                        {/* Right Column: Links and Action Buttons */}
                        <section className='w-1/2 h-full p-3 relative border-l border-zinc-500 flex flex-col justify-between'>
                            <div className='flex flex-col gap-4 h-full'>
                                {/* Links Section */}
                                <div className="flex flex-col gap-1 w-full">
                                    <p className='text-xs font-semibold tracking-widest'>Current Links: {links.length}</p>
                                    {links.map((linkValue, linkIdx) => (
                                        <div key={linkIdx} className="flex items-center gap-1 w-full">
                                            <div className="w-full flex items-center gap-1">
                                                {linkValue.title && linkValue.link && linkValue.title !== linkValue.link && (
                                                    <span className="text-xs text-gray-400 px-2">
                                                        {linkValue.link}
                                                    </span>
                                                )}
                                                <a href={linkValue.link} target='_blank' rel="noreferrer" className="w-2/3 text-xs px-2 py-1 text-blue-500 hover:underline truncate">
                                                    {linkValue.title || linkValue.link}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 inline-block ml-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </a>
                                            </div>
                                            <button type="button" onClick={() => removeLink(linkIdx)} className="text-xs px-1 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {links.length === 0 && (
                                        <p className='text-xs text-gray-500 text-center'>No links added yet</p>
                                    )}


                                </div>
                            </div>

                            <div className='flex items-center justify-between w-full mt-2'>
                                <button
                                    onClick={() => {
                                        if (typeof onDelete === 'function') onDelete();
                                        onClose();
                                    }}
                                    className=' border border-gray-400 p-1 w-16 h-7 flex items-center justify-center text-xs cursor-pointer rounded-xl transition ease-in-out hover:scale-105 duration-300 active:scale-95'
                                >
                                    Delete
                                </button>
                                <button onClick={() => { handleSave() }} className='bg-light text-dark p-1 w-16 h-7 flex items-center justify-center text-xs cursor-pointer rounded-xl transition ease-in-out hover:scale-105 duration-300 active:scale-95'>Save</button>
                            </div>
                        </section>
                    </main>
                </section>
            </div>
        </main>
    );
};

export default KanbanModal;