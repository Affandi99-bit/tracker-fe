import React, { useState, useEffect } from 'react';
import { useRoleProduction } from "../constant/constant"
const KanbanModal = ({ draft, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState(draft.title || '');
    const [pic, setPic] = useState(draft.pic || '');
    const [note, setNote] = useState(draft.note || '');
    // Change links to array of objects
    const [links, setLinks] = useState(
        Array.isArray(draft.link)
            ? draft.link.map(l =>
                typeof l === "string"
                    ? { title: l, link: l }
                    : { title: l.title || l.link, link: l.link }
            )
            : []
    );
    const [todos, setTodos] = useState(Array.isArray(draft.todo) ? draft.todo : []);
    const [newLink, setNewLink] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newTodo, setNewTodo] = useState('');
    const roleProduction = useRoleProduction();

    const handleSave = () => {
        const updated = {
            ...draft,
            title,
            pic,
            note,
            link: links,
            todo: todos.map(t => ({
                title: t.text,
                done: !!t.checked
            })),
        };
        onSave(updated);
        onClose()
    };

    const removeLink = (idx) => setLinks(links.filter((_, i) => i !== idx));
    // Push as object
    const addLink = () => {
        if (newLink.trim()) {
            setLinks([...links, { title: newLinkTitle.trim() || newLink.trim(), link: newLink.trim() }]);
            setNewLink('');
            setNewLinkTitle('');
        }
    };

    const removeTodo = (idx) => setTodos(todos.filter((_, i) => i !== idx));
    const toggleTodo = (idx) => {
        const updated = [...todos];
        updated[idx].checked = !updated[idx].checked;
        setTodos(updated);
    };
    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos([...todos, { text: newTodo.trim(), checked: false }]);
            setNewTodo('');
        }
    };

    useEffect(() => {
        setTodos(
            Array.isArray(draft.todo)
                ? draft.todo.map(t => ({
                    text: t.title || "",
                    checked: !!t.done
                }))
                : []
        );
    }, [draft.todo]);

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
                                    {/* <input type="text" className='glass outline-none p-2 text-xs rounded-xl' placeholder='PIC' value={pic} onChange={e => setPic(e.target.value)} /> */}
                                    <select
                                        value={pic}
                                        onChange={e => setPic(e.target.value)}
                                        className='w-1/2 glass outline-none py-2 px-3 text-xs rounded-xl appearance-none' // <-- add appearance-none
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

                                {/* Links */}
                                <div className="flex flex-col gap-1 w-full mt-2">
                                    {links.map((linkValue, linkIdx) => (
                                        <div key={linkIdx} className="flex items-center justify-between w-full">
                                            <a href={linkValue.link} target='_blank' rel="noreferrer" className="truncate text-xs px-2 py-1 text-blue-500">
                                                {linkValue.title || linkValue.link}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 inline-block ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                </svg>
                                            </a>
                                            <button type="button" onClick={() => removeLink(linkIdx)} className="text-xs px-1 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="text"
                                            className='rounded-xl border border-light/50 text-xs px-2 outline-none'
                                            placeholder="Link URL"
                                            value={newLink}
                                            onChange={e => setNewLink(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className='rounded-xl border border-light/50 text-xs px-2 outline-none'
                                            placeholder="Link Title (optional)"
                                            value={newLinkTitle}
                                            onChange={e => setNewLinkTitle(e.target.value)}
                                        />
                                        <button type="button" onClick={addLink} className='transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer' title="Add link">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Note */}
                                <textarea className='glass rounded-xl outline-none p-1 w-full min-h-20 text-xs' placeholder='Note' value={note} onChange={e => setNote(e.target.value)} />
                            </section>
                        </section>

                        {/* Right Column: Todos */}
                        <section className='w-1/2 h-full p-3 relative border-l border-zinc-500'>
                            <div>Add To-Do</div>
                            <div className="flex flex-col gap-1 w-full mt-2">
                                {todos.map((todo, idx) => (
                                    <div key={idx} className="flex items-center justify-between w-full">
                                        <div className="text-xs px-2 py-1 text-light">
                                            <label className={`flex flex-row items-center gap-1 tracking-widest cursor-pointer`}>
                                                <input
                                                    type="checkbox"
                                                    checked={todo.checked}
                                                    onChange={() => toggleTodo(idx)}
                                                    className="peer hidden"
                                                />
                                                <div className="size-3 flex rounded border border-light bg-dark peer-checked:bg-light transition cursor-pointer">
                                                    <svg fill="none" viewBox="0 0 24 24" className="size-3 stroke-dark peer-checked:stroke-dark" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={todo.text}
                                                    onChange={e => {
                                                        const updated = [...todos];
                                                        updated[idx].text = e.target.value;
                                                        setTodos(updated);
                                                    }}
                                                    className="bg-transparent border-b border-light/20 px-1 min-w-32 text-xs outline-none"
                                                    placeholder="To-Do"
                                                />
                                            </label>
                                        </div>
                                        <button type="button" onClick={() => removeTodo(idx)} className="text-xs px-1 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer" title="Delete To-Do">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="text" className='rounded-xl border border-light/50 text-xs px-2 outline-none' placeholder="Add new To-Do" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
                                    <button type="button" onClick={addTodo} className='transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer' title="Add To-Do">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className='absolute bottom-0 left-1 px-2 flex items-center justify-between w-full mt-2'>
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