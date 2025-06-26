import React, { useState } from 'react';

const getSectionProgress = (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.status === 'checked').length / tasks.length) * 100);
};

const getOverallProgress = (kanban) => {
    if (!kanban) return 0;
    const sections = ['praprod', 'prod', 'postprod', 'manafile'];
    let total = 0;
    let count = 0;
    sections.forEach(section => {
        if (Array.isArray(kanban[section])) {
            total += getSectionProgress(kanban[section]);
            count++;
        }
    });
    return count ? Math.round(total / count) : 0;
};

const Readonly = ({ data }) => {
    const [openPraprod, setOpenPraprod] = useState(true);
    const [openProd, setOpenProd] = useState(false);
    const [openPostprod, setOpenPostprod] = useState(false);
    const [openManafile, setOpenManafile] = useState(false);

    return (
        <main className='overflow-y-scroll z-50 h-screen w-full p-5 bg-dark fixed top-0 left-0'>
            {data.map((pro, i) => {
                const kanban = pro.kanban || {};
                const praprodProgress = getSectionProgress(kanban.praprod);
                const prodProgress = getSectionProgress(kanban.prod);
                const postprodProgress = getSectionProgress(kanban.postprod);
                const manafileProgress = getSectionProgress(kanban.manafile);
                const overallProgress = getOverallProgress(kanban);

                return (
                    <main className='font-body text-light flex flex-col lg:flex-row w-full justify-start lg:items-start relative' key={i}>
                        <section className="flex flex-col p-2 w-1/2">
                            <h1 className="tracking-widest text-xl font-bold">
                                {pro.title}
                            </h1>
                            <div className="flex items-center justify-start">
                                {[...pro.status, ...pro.categories, ...pro.type].map(
                                    (chip, i) => (
                                        <p key={i} className="text-xs tracking-widest">
                                            {chip}&nbsp;&nbsp;
                                        </p>
                                    )
                                )}
                            </div>
                            <p className="tracking-widest">
                                {pro.client}  <span className=''>- {pro.pic}</span>
                            </p>
                            <p className="tracking-widest">
                                Due Date :
                                <span className="font-semibold">
                                    &nbsp;{new Date(pro.deadline).toLocaleDateString("en-GB")}
                                </span>{" "}
                            </p>
                            <p className="tracking-widest">
                                Project Manager :
                                <span className="font-semibold">&nbsp;{pro.pm}</span>
                            </p>
                            <div className='flex items-center justify-start gap-2'>
                                <p className="tracking-widest">Final File:</p>
                                <a
                                    href={pro.final_file}
                                    target="_blank"
                                    className="cursor pointer truncate w-96 text-blue-500"
                                >
                                    {pro.final_file}
                                </a>
                            </div>
                            <div className='flex items-center justify-start gap-2'>
                                <p className="tracking-widest">Report File:</p>
                                <a
                                    href={pro.final_report_file}
                                    target="_blank"
                                    className="cursor pointer truncate w-96 text-blue-500"
                                >
                                    {pro.final_report_file}
                                </a>
                            </div>
                            <p className="tracking-widest">Crew :</p>
                            <div className="flex flex-col flex-wrap h-40 overflow-y-auto">
                                {
                                    pro.day[0].crew?.map((member, i) => (
                                        <p
                                            key={i}
                                            className="pl-5 font-semibold text-sm flex justify-start items-center tracking-widest"
                                        >
                                            {member.roles} - {member.name}
                                        </p>
                                    )) || <p className="pl-5">No crew members listed</p>
                                }
                            </div>
                            <p className="tracking-widest">Note :</p>
                            <textarea
                                readOnly
                                className="no-scrollbar outline-none tracking-widest h-32 w-96 pl-5"
                                value={pro.note}
                            />

                            <p className="fixed opacity-65 tracking-widest bottom-1 left-1">
                                Created at{" "}
                                {new Date(pro.createdAt).toLocaleDateString("en-GB")}
                            </p>
                        </section>
                        <section className="flex flex-col p-2 w-1/2">
                            <nav>
                                <p className='font-semibold tracking-wider'>Overall Progress:</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                                    <div
                                        className="bg-light  h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${overallProgress}%` }}
                                    ></div>
                                </div>
                                <p className='text-gray-400 text-xs text-end'>{overallProgress}%</p>
                            </nav>
                            {/* Pra Produksi Dropdown */}
                            <section>
                                <div className='flex items-center justify-between mb-2 cursor-pointer'
                                    onClick={() => setOpenPraprod((prev) => !prev)}
                                >
                                    <p className='font-semibold tracking-wider'>Pra Produksi</p>
                                    <main className='flex items-center gap-5'>
                                        <div className="w-28 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                                            <div
                                                className="bg-light h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${praprodProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className='text-gray-400 text-xs text-end'>{praprodProgress}%</p>
                                        <p className='text-gray-400 text-end'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={`size-6 transition-transform duration-200 ${openPraprod ? 'rotate-180' : ''}`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </p>
                                    </main>
                                </div>
                                {openPraprod && kanban.praprod?.map((task, index) => (
                                    <div key={index} className="p-2 mb-2 bg-[#303030] rounded-lg">
                                        <h3 className="font-semibold text-sm tracking-wider">{task.title}</h3>
                                        <p className="text-gray-300 text-xs">PIC: {task.pic}</p>
                                        <p className="text-gray-300 text-xs">Status: <span className={`font-normal ${task.status ? 'text-green-500 ' : 'text-amber-500'}`}>{task.status ? 'Done' : 'Ongoing'}</span> </p>
                                        {task.link && task.link.length > 0 && (
                                            <div className="mt-1">
                                                {task.link.map((link, linkIndex) => (
                                                    link && (
                                                        <a
                                                            key={linkIndex}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 block text-xs"
                                                        >
                                                            {link}
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                            {/* Produksi Dropdown */}
                            <section>
                                <div className='flex items-center justify-between mb-2 cursor-pointer'
                                    onClick={() => setOpenProd((prev) => !prev)}
                                >
                                    <p className='font-semibold tracking-wider'>Produksi</p>
                                    <main className='flex items-center gap-5'>
                                        <div className="w-28 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                                            <div
                                                className="bg-light h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${prodProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className='text-gray-400 text-end'>{prodProgress}%</p>
                                        <p className='text-gray-400 text-end'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={`size-6 transition-transform duration-200 ${openProd ? 'rotate-180' : ''}`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </p>
                                    </main>
                                </div>
                                {openProd && kanban.prod?.map((task, index) => (
                                    <div key={index} className="p-2 mb-2 bg-[#303030] rounded-lg">
                                        <h3 className="font-semibold text-sm tracking-wider">{task.title}</h3>
                                        <p className="text-gray-300 text-xs">PIC: {task.pic}</p>
                                        <p className="text-gray-300 text-xs">Status: <span className={`${task.status ? 'text-green-500 ' : 'text-amber-500'}`}>{task.status ? 'Done' : 'Ongoing'}</span> </p>
                                        {task.link && task.link.length > 0 && (
                                            <div className="mt-1">
                                                {task.link.map((link, linkIndex) => (
                                                    link && (
                                                        <a
                                                            key={linkIndex}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 block text-xs"
                                                        >
                                                            {link}
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                            {/* Post Produksi Dropdown */}
                            <section>
                                <div className='flex items-center justify-between mb-2 cursor-pointer'
                                    onClick={() => setOpenPostprod((prev) => !prev)}
                                >
                                    <p className='font-semibold tracking-wider'>Post Produksi</p>
                                    <main className='flex items-center gap-5'>
                                        <div className="w-28 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                                            <div
                                                className="bg-light h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${postprodProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className='text-gray-400 text-end'>{postprodProgress}%</p>
                                        <p className='text-gray-400 text-end'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={`size-6 transition-transform duration-200 ${openPostprod ? 'rotate-180' : ''}`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </p>
                                    </main>
                                </div>
                                {openPostprod && kanban.postprod?.map((task, index) => (
                                    <div key={index} className="p-2 mb-2 bg-[#303030] rounded-lg">
                                        <h3 className="font-semibold text-sm tracking-wider">{task.title}</h3>
                                        <p className="text-gray-300 text-xs">PIC: {task.pic}</p>
                                        <p className="text-gray-300 text-xs">Status: <span className={`${task.status ? 'text-green-500 ' : 'text-amber-500'}`}>{task.status ? 'Done' : 'Ongoing'}</span> </p>
                                        {task.link && task.link.length > 0 && (
                                            <div className="mt-1">
                                                {task.link.map((link, linkIndex) => (
                                                    link && (
                                                        <a
                                                            key={linkIndex}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 block text-xs"
                                                        >
                                                            {link}
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                            {/* Manajemen File Dropdown */}
                            <section>
                                <div className='flex items-center justify-between mb-2 cursor-pointer'
                                    onClick={() => setOpenManafile((prev) => !prev)}
                                >
                                    <p className='font-semibold tracking-wider'>Manajemen File</p>
                                    <main className='flex items-center gap-5'>
                                        <div className="w-28 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700/25">
                                            <div
                                                className="bg-light h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${manafileProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className='text-gray-400 text-end'>{manafileProgress}%</p>
                                        <p className='text-gray-400 text-end'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={`size-6 transition-transform duration-200 ${openManafile ? 'rotate-180' : ''}`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </p>
                                    </main>
                                </div>
                                {openManafile && kanban.manafile?.map((task, index) => (
                                    <div key={index} className="p-2 mb-2 bg-[#303030] rounded-lg">
                                        <h3 className="font-semibold text-sm tracking-wider">{task.title}</h3>
                                        <p className="text-gray-300 text-xs">PIC: {task.pic}</p>
                                        <p className="text-gray-300 text-xs">Status: <span className={`${task.status ? 'text-green-500 ' : 'text-amber-500'}`}>{task.status ? 'Done' : 'Ongoing'}</span> </p>
                                        {task.link && task.link.length > 0 && (
                                            <div className="mt-1">
                                                {task.link.map((link, linkIndex) => (
                                                    link && (
                                                        <a
                                                            key={linkIndex}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 block text-xs"
                                                        >
                                                            {link}
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        </section>
                    </main>
                )
            })}
        </main>
    );
};

export default Readonly;