import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Bonus = ({ pro: initialPro, days: initialDays = [], updateData }) => {
    const [pro, setPro] = useState(initialPro || {});
    const [days, setDays] = useState(initialDays || []);
    const navigate = useNavigate();
    useEffect(() => {
        if (JSON.stringify(pro) !== JSON.stringify(initialPro)) {
            setPro(initialPro || {});
        }
    }, [initialPro]);

    useEffect(() => {
        if (JSON.stringify(days) !== JSON.stringify(initialDays)) {
            setDays(initialDays || []);
        }
    }, [initialDays]);

    // Group crew across all days
    const allCrew = (Array.isArray(days) ? days : [])
        .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
    const groupedByName = allCrew.reduce((acc, member) => {
        if (!member?.name) return acc;
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
        .filter(c => c.roles.some(r => (r || '').toLowerCase() === 'project manager'))
        .map(c => c.name);

    return (
        <main className='relative flex items-start justify-center gap-1 min-h-screen p-5 bg-dark text-light font-body overflow-y-scroll'>
            <nav className='absolute left-3 top-3'>
                <button type="button"
                    className="flex gap-1 items-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                    onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="#e8e8e8" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                    </svg>
                    Back
                </button>
            </nav>
            {/* Left */}
            <div className='flex flex-col h-full w-2/3 mt-5'>
                {/* Project Overview */}
                <main className="space-y-4 w-full">
                    {/* Project details */}
                    <section className='py-3 w-full glass rounded-xl border border-light/50 p-3'>
                        <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Project Overview</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">Title:</span>
                                <span className="text-light text-xs tracking-wider">{pro?.title || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">Client:</span>
                                <span className="text-light text-xs tracking-wider">{pro?.client || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">PIC Client:</span>
                                <span className="text-light text-xs tracking-wider">{pro?.pic || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">Categories:</span>
                                <span className="text-light text-xs tracking-wider">
                                    {pro?.categories?.join(", ") || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/90 text-sm">Project Manager:</span>
                                <span className="text-light text-xs tracking-wider">
                                    {pmNames.length ? pmNames.join(", ") : "No Project Manager"}
                                </span>
                            </div>
                        </div>
                    </section>
                    {/* Budget Section */}
                    <section className='glass rounded-xl border border-light/50 p-3'>
                        <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Budget Information</h3>
                        <div className="flex items-center gap-1">
                            <label className="font-body text-sm gap-1 tracking-widest flex flex-col w-1/3">
                                Project Budget
                                <input
                                    placeholder="Project Budget"
                                    type="text"
                                    name="budget"
                                    className="glass border text-xs border-light/50 font-light rounded-xl p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                                />
                            </label>
                            <label className="font-body text-sm gap-1 tracking-widest flex flex-col w-1/3">
                                Project Expenses
                                <input
                                    placeholder="Project Expenses"
                                    type="text"
                                    name="expenses"
                                    className="glass border text-xs border-light/50 font-light rounded-xl p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                                />
                            </label>
                            <label className="font-body text-sm gap-1 tracking-widest flex flex-col w-1/3">
                                Freelance
                                <input
                                    placeholder="Freelance"
                                    type="text"
                                    name="freelance"
                                    className="glass border text-xs border-light/50 font-light rounded-xl p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                                />
                            </label>
                        </div>
                    </section>
                    {/* Crew table */}
                    <section className="w-full h-full font-body text-sm tracking-wider glass rounded-xl border border-light/50 p-3">
                        <p className="pb-4 text-xl font-semibold text-light tracking-wider">Crew Details</p>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-light/50">
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Name</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Jobdesk</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Job Overtime</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Total Bonus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {days.flatMap((day, dIndex) =>
                                        (day.crew || []).map((member, cIndex) => (
                                            <tr key={`${dIndex}-${cIndex}`} className="border-b border-light/10">
                                                <td className="py-2 px-3">{member.name}</td>
                                                <td className="py-2 px-3">{member.roles?.join(", ") || "-"}</td>
                                                <td className="py-2 px-3">
                                                    {(member.overtime || [])
                                                        .map(ot => `${ot.job} (${ot.hour}h)`)
                                                        .join(", ") || "-"}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div>

                                                    </div>
                                                </td>
                                            </tr>
                                            ))
                                            )} */}
                                    <tr className="border-b border-light/10">
                                        <td className="py-2 px-3">Test</td>
                                        <td className="py-2 px-3">Editor,Nganu</td>
                                        <td className="py-2 px-3">
                                            Editor(2,5h), Nganu(1h)
                                        </td>
                                        <td className="py-2 px-3 space-y-2">
                                            <div className='min-h-20 flex flex-col glass rounded-xl p-1 border border-light/50'>
                                                <div className='flex items-center justify-between'>
                                                    <p>Imam Affandi </p>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-blue-500 text-xs">Rp 500.000</p>
                                                        <button className="p-1 glass rounded-full flex items-center justify-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                        </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className='text-xs text-light/50'>
                                                    Project Manager (+1h) = Rp 375.000 + Rp 7.813
                                                </p>
                                                <p className='text-xs text-light/50'>
                                                    Producer (+2h) = Rp 312.500 + Rp 13.021
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-light/10">
                                        <td className="py-2 px-3">Test</td>
                                        <td className="py-2 px-3">Editor,Nganu</td>
                                        <td className="py-2 px-3">
                                            Editor(2,5h), Nganu(1h)
                                        </td>
                                        <td className="py-2 px-3 space-y-2">
                                            <div className='min-h-20 flex flex-col glass rounded-xl p-1 border border-light/50'>
                                                <div className='flex items-center justify-between'>
                                                    <p>Imam Affandi </p>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-blue-500 text-xs">Rp 500.000</p>
                                                        <button className="p-1 glass rounded-full flex items-center justify-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                        </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className='text-xs text-light/50'>
                                                    Project Manager (+1h) = Rp 375.000 + Rp 7.813
                                                </p>
                                                <p className='text-xs text-light/50'>
                                                    Producer (+2h) = Rp 312.500 + Rp 13.021
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-light/10">
                                        <td className="py-2 px-3">Test</td>
                                        <td className="py-2 px-3">Editor,Nganu</td>
                                        <td className="py-2 px-3">
                                            Editor(2,5h), Nganu(1h)
                                        </td>
                                        <td className="py-2 px-3 space-y-2">
                                            <div className='min-h-20 flex flex-col glass rounded-xl p-1 border border-light/50'>
                                                <div className='flex items-center justify-between'>
                                                    <p>Imam Affandi </p>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-blue-500 text-xs">Rp 500.000</p>
                                                        <button className="p-1 glass rounded-full flex items-center justify-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                        </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className='text-xs text-light/50'>
                                                    Project Manager (+1h) = Rp 375.000 + Rp 7.813
                                                </p>
                                                <p className='text-xs text-light/50'>
                                                    Producer (+2h) = Rp 312.500 + Rp 13.021
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Empty state */}
                            {/* {days.every(day => !day.crew?.length) && (
                                <div className="text-center py-8 text-light/60">
                                    <p className="text-sm">No crew members assigned yet</p>
                                </div>
                            )} */}
                        </div>
                    </section>
                </main>
            </div>
            {/* Right */}
            <div className="flex flex-col h-full w-1/3 mt-5">
                {/* Bonus Overview */}
                <section className="glass w-full rounded-xl border border-light/50 p-3">
                    <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Bonus Calculation</h3>
                    <div className="space-y-2 border-b border-light/50 p-2">
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Title:</span>
                            <span className="text-light text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Budget:</span>
                            <span className="text-light text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Expenses:</span>
                            <span className="text-light text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Freelance:</span>
                            <span className="text-light text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                    </div>
                    <div className="space-y-2 border-b border-light/50 p-2">
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Gross Profit:</span>
                            <span className="text-green-500 text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Tier:</span>
                            <p className="text-light text-xs tracking-wider"><span className='rounded-xl p-1 border border-light/50'>Tier 02</span>10%</p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <span className="text-light/80 text-sm">Note:</span>
                            <p className="text-light text-xs tracking-wider">Warning</p>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Floor Minimum:</span>
                            <span className="text-amber-500 text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Total Bonus:</span>
                            <span className="text-blue-500 text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Uang Lembur:</span>
                            <span className="text-blue-500 text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Net Profit:</span>
                            <span className="text-green-500 text-xs tracking-wider">{pro?.title || "-"}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-end pt-3 w-full">
                        <button
                            className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center text-dark bg-light w-20 h-10 justify-center">
                            Export
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
};

export default Bonus;
