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

const stepNameMap = {
    praprod: "Pra Production",
    prod: "Production",
    postprod: "Post Production",
    manafile: "File Management"
};

const Readonly = ({ data }) => {
    const [openStepIdx, setOpenStepIdx] = useState(null);

    function getCrewByRole(role) {
        if (!data.day || !data.day[0] || !data.day[0].crew) return null;
        const crewList = data.day[0].crew;
        return crewList.find(c =>
            c.roles.some(r => r.toLowerCase() === role.toLowerCase())
        );
    }

    return (
        <main className='overflow-y-scroll z-50 h-screen w-full p-5 bg-dark fixed top-0 left-0'>
            {data.map((pro, i) => {
                return (
                    <main className='font-body text-light flex flex-col lg:flex-row w-full justify-start lg:items-start relative' key={i}>
                        <section className="flex flex-col gap-3 p-6 w-full lg:w-1/2 text-sm glass rounded-xl shadow-md">
                            <header className='glass p-4 rounded-lg'>
                                <h1 className="text-2xl font-black tracking-wider uppercase">{pro.title}</h1>
                                <p className="text-gray-400 tracker-wider italic text-sm">
                                    {[...(pro.categories || []), ...(pro.type || [])].join(" · ")}
                                </p>
                            </header>
                            <section className="space-y-1 glass p-2 rounded-lg">
                                <p className='w-full flex items-center justify-between border-b border-zinc-400 py-2 tracking-wider'><span className="text-gray-400 tracker-wider">Client:</span> {pro.client} — {pro.pic}</p>
                                <p className='w-full flex items-center justify-between border-b border-zinc-400 py-2 tracking-wider'><span className="text-gray-400 tracker-wider">Due Date:</span> <span className="font-medium">{new Date(pro.deadline).toLocaleDateString("en-GB")}</span></p>
                                <p className='w-full flex items-center justify-between py-2 tracking-wider'><span className="text-gray-400 tracker-wider">Project Manager:</span> <span className="font-medium">
                                    {(pro.day[0]?.crew || [])
                                        .filter(member => member.roles?.some(role => role.toLowerCase() === "project manager"))
                                        .map(member => member.name)
                                        .join(", ") || "—"}
                                </span></p>
                            </section>

                            <div className='glass p-2 rounded-lg space-y-1 flex items-center justify-between'>
                                <p className="text-gray-400 tracker-wider">Crew:</p>
                                <ul className="w-2/3 pl-4 space-y-1 max-h-32 overflow-y-auto text-sm">
                                    {(pro.day[0]?.crew || []).map((member, i) => (
                                        <li key={i} className="text-white tracking-wider flex items-center">
                                            <span className="font-normal w-1/2">{member.name}</span>
                                            <span className="font-medium w-1/2">:&nbsp;{member.roles.join(", ")}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='glass p-2 rounded-lg space-y-1'>
                                <p className="text-gray-400 tracker-wider">Note:</p>
                                <textarea readOnly className="bg-[#2a2a2a] w-full cursor-default outline-none rounded-md p-2 min-h-32 overflow-y-auto text-white tracking-wider" value={pro.note || "No notes available!"} />
                            </div>
                            <footer className="text-xs text-gray-500 tracking-wider">
                                Created at {new Date(pro.createdAt).toLocaleDateString("en-GB")}
                            </footer>
                        </section>

                        {/* Progress Section */}
                        <section className="flex flex-col p-2 w-full lg:w-1/2">
                            <nav>
                                <p className='font-semibold tracking-wider'>Overall Progress:</p>
                                <div className="w-full rounded-full h-2.5 bg-gray-700/25">
                                    <div
                                        className="bg-light  h-2.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${pro.kanban?.steps
                                                ? Math.round(
                                                    pro.kanban.steps.reduce(
                                                        (acc, step) =>
                                                            acc +
                                                            (step.items.length
                                                                ? step.items.filter(i => i.done).length / step.items.length
                                                                : 0),
                                                        0
                                                    ) / pro.kanban.steps.length * 100
                                                )
                                                : 0
                                                }%`
                                        }}
                                    >
                                    </div>
                                </div>
                                <p className='text-gray-400 text-xs text-end'>
                                    {pro.kanban?.steps
                                        ? Math.round(
                                            pro.kanban.steps.reduce(
                                                (acc, step) =>
                                                    acc +
                                                    (step.items.length
                                                        ? step.items.filter(i => i.done).length / step.items.length
                                                        : 0),
                                                0
                                            ) / pro.kanban.steps.length * 100
                                        )
                                        : 0
                                    }%
                                </p>
                            </nav>
                            {/* Kanban Steps */}
                            {pro.kanban?.steps?.map((step, stepIdx) => (
                                <section key={stepIdx}>
                                    <div
                                        className='flex items-center justify-between mb-2 cursor-pointer'
                                        onClick={() => setOpenStepIdx(openStepIdx === stepIdx ? null : stepIdx)}
                                    >
                                        <p className='font-semibold tracking-wider'>
                                            {stepNameMap[step.name] || step.name}
                                        </p>
                                        <main className='flex items-center gap-5'>
                                            <div className="w-28 rounded-full h-2.5 bg-gray-700/25">
                                                <div
                                                    className="bg-light h-2.5 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${step.items.length
                                                            ? (step.items.filter(i => i.done).length / step.items.length) * 100
                                                            : 0
                                                            }%`
                                                    }}
                                                ></div>
                                            </div>
                                            <p className='text-gray-400 text-xs text-end'>
                                                {step.items.length
                                                    ? Math.round((step.items.filter(i => i.done).length / step.items.length) * 100)
                                                    : 0
                                                }%
                                            </p>
                                            <span>
                                                {openStepIdx === stepIdx ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                }
                                            </span>
                                        </main>
                                    </div>
                                    {openStepIdx === stepIdx && step.items.map((task, index) => (
                                        <main key={index} className="p-2 mb-2 bg-[#303030] rounded-lg">
                                            <h3 className="font-semibold text-sm tracking-wider mb-2">{task.title}</h3>
                                            <section className='flex items-start justify-between'>
                                                <div className='w-1/2'>
                                                    <p className="text-gray-300 text-xs">
                                                        PIC: {(() => {
                                                            const firstRole = task.pic?.split('/')[0]?.trim();
                                                            const crew = (pro.day[0]?.crew || []).find(
                                                                c => Array.isArray(c.roles) && c.roles.some(r => r.toLowerCase() === firstRole?.toLowerCase())
                                                            );
                                                            if (crew) {
                                                                return <span className='text-xs text-gray-400'>{crew.name} as {firstRole}</span>;
                                                            }
                                                            return <span className='text-xs text-gray-400'>{firstRole}</span>;
                                                        })()}
                                                    </p>
                                                    <p className="text-gray-300 text-xs">
                                                        Status: <span className={`font-normal ${task.done ? 'text-green-500 ' : 'text-amber-500'}`}>{task.done ? 'Done' : 'Ongoing'}</span>
                                                    </p>
                                                    {task.link && task.link.length > 0 && (
                                                        <div className="mt-1">
                                                            <p className='mb-2 text-gray-300 text-xs'>Links:</p>
                                                            {task.link.map((link, linkIndex) => (
                                                                link && (
                                                                    <a
                                                                        key={linkIndex}
                                                                        href={link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 hover:text-blue-700 hover:underline block text-xs mb-1"
                                                                    >
                                                                        {link}
                                                                    </a>
                                                                )
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='w-1/2 '>
                                                    <p className='text-gray-300 text-xs'>Note:</p>
                                                    <textarea className="bg-[#2a2a2a] rounded-md p-2 min-h-20 text-xs w-full outline-none cursor-default no-scrollbar overflow-y-auto text-white" readOnly value={task.note || "No notes available!"} />
                                                </div>
                                            </section>
                                        </main>
                                    ))}
                                </section>
                            ))}
                        </section>
                    </main>
                );
            })}
        </main>
    );
};

export default Readonly;