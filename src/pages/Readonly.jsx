import React, { useState, useEffect } from 'react';


const Readonly = ({ data }) => {
    const [openStepIdx, setOpenStepIdx] = useState(null);
    const stepNameMap = {
        praprod: "Pra Production",
        prod: "Production",
        postprod: "Post Production",
        manafile: "File Management"
    };
    useEffect(() => {
        if (data?.title) {
            document.title = data.title;
            console.log("Set document title to:", data.title);
        }
    }, [data.title]);
    return (
        <main className='overflow-y-scroll z-50 h-screen w-full p-5 bg-dark fixed top-0 left-0'>
            {data.map((pro, i) => {
                console.log("pro.kanban:", pro.kanban);
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
                                    {(() => {
                                        // Aggregate crew from all days to find Project Managers
                                        const allCrew = (Array.isArray(pro.day) ? pro.day : [])
                                            .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
                                        const groupedByName = allCrew.reduce((acc, member) => {
                                            if (!member || !member.name) return acc;
                                            const key = member.name;
                                            const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
                                            if (!acc[key]) acc[key] = new Set();
                                            roles.forEach(r => acc[key].add(r));
                                            return acc;
                                        }, {});
                                        const pmNames = Object.entries(groupedByName)
                                            .filter(([, roleSet]) => Array.from(roleSet).some(r => (r || '').toLowerCase() === 'project manager'))
                                            .map(([name]) => name);
                                        return pmNames.length ? pmNames.join(", ") : "—";
                                    })()}
                                </span></p>
                            </section>

                            <div className='glass p-2 rounded-lg space-y-1'>
                                <p className="text-gray-400 tracker-wider">Crew:</p>
                                <div className="space-y-2">
                                    {(() => {
                                        const allCrew = (Array.isArray(pro.day) ? pro.day : [])
                                            .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
                                        // Group crew by name and merge roles across all days
                                        const groupedByName = allCrew.reduce((acc, member) => {
                                            if (!member || !member.name) return acc;
                                            const key = member.name;
                                            const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
                                            if (!acc[key]) acc[key] = new Set();
                                            roles.forEach(r => acc[key].add(r));
                                            return acc;
                                        }, {});
                                        const crewListDisplay = Object.entries(groupedByName)
                                            .map(([name, roleSet]) => ({ name, roles: Array.from(roleSet) }))
                                            .sort((a, b) => a.name.localeCompare(b.name));
                                        const pmNames = crewListDisplay
                                            .filter(c => (c.roles || []).some(r => (r || '').toLowerCase() === 'project manager'))
                                            .map(c => c.name);
                                        return (
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-light/90 font-medium">Project Manager:</span>
                                                    <span className="text-light font-semibold">
                                                        {pmNames.length ? pmNames.join(", ") : "No Project Manager"}
                                                    </span>
                                                </div>
                                                <div className="">
                                                    <span className="text-light/90 font-medium">Crew:</span>
                                                    <span className="text-light/60 font-semibold">
                                                        {crewListDisplay.length ? (
                                                            crewListDisplay.map((item, index) => (
                                                                <div className="flex items-center justify-between w-full" key={index}>
                                                                    <p className="w-1/2 font-thin">{item.name}</p>
                                                                    <p className="w-1/2 font-medium text-end">{item.roles.join(", ")}</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-light/60">No crew assigned</p>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
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
                                        className="bg-light h-2.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(() => {
                                                const kanbanData = Array.isArray(pro.kanban)
                                                    ? pro.kanban.find(k => k.type === pro.categories?.[0])
                                                    : null;

                                                if (!kanbanData || !Array.isArray(kanbanData.steps) || kanbanData.steps.length === 0) {
                                                    return 0;
                                                }

                                                const totalProgress = kanbanData.steps.reduce(
                                                    (acc, step) =>
                                                        acc +
                                                        (Array.isArray(step.items) && step.items.length
                                                            ? step.items.filter(i => i.done).length / step.items.length
                                                            : 0),
                                                    0
                                                );

                                                return Math.round(totalProgress / kanbanData.steps.length * 100);
                                            })()}%`
                                        }}
                                    ></div>
                                </div>
                                <p className='text-gray-400 text-xs text-end'>
                                    {(() => {
                                        const kanbanData = Array.isArray(pro.kanban)
                                            ? pro.kanban.find(k => k.type === pro.categories?.[0])
                                            : null;

                                        if (!kanbanData || !Array.isArray(kanbanData.steps) || kanbanData.steps.length === 0) {
                                            return 0;
                                        }

                                        const totalProgress = kanbanData.steps.reduce(
                                            (acc, step) =>
                                                acc +
                                                (Array.isArray(step.items) && step.items.length
                                                    ? step.items.filter(i => i.done).length / step.items.length
                                                    : 0),
                                            0
                                        );

                                        return Math.round(totalProgress / kanbanData.steps.length * 100);
                                    })()}%
                                </p>
                            </nav>
                            {/* Kanban Steps */}
                            {(() => {
                                // Find the kanban data for the current project category
                                const kanbanData = Array.isArray(pro.kanban)
                                    ? pro.kanban.find(k => k.type === pro.categories?.[0])
                                    : null;

                                if (!kanbanData || !Array.isArray(kanbanData.steps) || kanbanData.steps.length === 0) {
                                    return <div className="text-gray-400 text-xs mt-4">No progress data available.</div>;
                                }

                                return kanbanData.steps.map((step, stepIdx) => (
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
                                                            width: `${Array.isArray(step.items) && step.items.length
                                                                ? (step.items.filter(i => i.done).length / step.items.length) * 100
                                                                : 0
                                                                }%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className='text-gray-400 text-xs text-end'>
                                                    {Array.isArray(step.items) && step.items.length
                                                        ? Math.round((step.items.filter(i => i.done).length / step.items.length) * 100)
                                                        : 0
                                                    }%
                                                </p>
                                                <span>
                                                    {openStepIdx === stepIdx ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </main>
                                        </div>
                                        {openStepIdx === stepIdx && Array.isArray(step.items) && step.items.map((task, index) => {
                                            // Ensure task is a valid object with required properties
                                            if (!task || typeof task !== 'object') {
                                                return null;
                                            }

                                            return (
                                                <main key={index} className="p-2 mb-2 bg-[#303030] rounded-lg">
                                                    <h3 className="font-semibold text-sm tracking-wider mb-2">{task.title || 'Untitled Task'}</h3>
                                                    <section className='flex items-start justify-between'>
                                                        <div className='w-1/2'>
                                                            <p className="text-gray-300 text-xs">
                                                                PIC: {(() => {
                                                                    const firstRole = task.pic?.split('/')[0]?.trim();
                                                                    // Search all days for crew with matching role
                                                                    const allCrew = (Array.isArray(pro.day) ? pro.day : [])
                                                                        .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
                                                                    // Group by name and aggregate roles
                                                                    const groupedByName = allCrew.reduce((acc, member) => {
                                                                        if (!member || !member.name) return acc;
                                                                        const key = member.name;
                                                                        const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
                                                                        if (!acc[key]) acc[key] = { name: key, roles: new Set() };
                                                                        roles.forEach(r => acc[key].roles.add(r));
                                                                        return acc;
                                                                    }, {});
                                                                    // Find crew member with matching role
                                                                    const crew = Object.values(groupedByName).find(
                                                                        c => Array.from(c.roles).some(r => r.toLowerCase() === firstRole?.toLowerCase())
                                                                    );
                                                                    if (crew) {
                                                                        return <span className='text-xs text-gray-400'>{crew.name} as {firstRole}</span>;
                                                                    }
                                                                    return <span className='text-xs text-gray-400'>{firstRole || 'No PIC assigned'}</span>;
                                                                })()}
                                                            </p>
                                                            <p className="text-gray-300 text-xs">
                                                                Status: <span className={`font-normal ${task.done ? 'text-green-500 ' : 'text-amber-500'}`}>{task.done ? 'Done' : 'Ongoing'}</span>
                                                            </p>
                                                            {task.link && Array.isArray(task.link) && task.link.length > 0 && (
                                                                <div className="mt-1">
                                                                    <p className='mb-2 text-gray-300 text-xs'>Links:</p>
                                                                    {task.link.map((link, linkIndex) => (
                                                                        link && typeof link === 'string' && (
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
                                            );
                                        })}
                                    </section>
                                ));
                            })()}
                        </section>
                    </main>
                );
            })}
        </main>
    );
};

export default Readonly;