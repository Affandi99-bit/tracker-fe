import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../components/micro-components/ToastContext';
import { ErrorBoundary } from "../components";
import { useHasPermission } from '../hook';

const OvertimeComponent = ({ pro: initialPro, updateData }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const canAccessOvertime = useHasPermission("overtime");
    const [pro, setPro] = useState(initialPro || {});
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState([]);
    const [freelancers, setFreelancers] = useState([]);

    // Check privilege - if user doesn't have access, show message and close
    useEffect(() => {
        if (!canAccessOvertime) {
            showToast("You don't have permission to access this feature", "error");
            navigate(-1);
        }
    }, [canAccessOvertime, showToast, navigate]);

    if (!canAccessOvertime) {
        return null;
    }

    // Initialize days and freelancers from project data
    useEffect(() => {
        if (initialPro && days.length === 0) {
            setPro({ ...initialPro, start: initialPro.createdAt || initialPro.start });

            let projectDays = initialPro.day?.map((day, index) => {
                return {
                    ...day,
                    id: day.id || `day-${index}-${Date.now()}-${Math.random()}`,
                    expense: {
                        rent: day.expense?.rent || [],
                        operational: day.expense?.operational || [],
                        orderlist: day.expense?.orderlist || [],
                    },
                    images: Array.isArray(day.images) ? day.images : [],
                    backup: day.backup || [],
                    crew: (day.crew || []).map(c => ({
                        name: c.name || '',
                        roles: Array.isArray(c.roles) ? c.roles : (c.roles ? [c.roles] : []),
                        overtime: Array.isArray(c.overtime)
                            ? c.overtime
                            : (c.overtime && typeof c.overtime === 'object')
                                ? [{ job: c.overtime.job || '', date: c.overtime.date || '', hour: c.overtime.hour || 0, note: c.overtime.note || '' }]
                                : []
                    })),
                    note: day.note || '',
                    totalExpenses: day.totalExpenses || 0,
                    template: day.template !== undefined ? day.template : true,
                    date: day.date || '',
                    dayNumber: day.dayNumber || (index + 1),
                };
            }) || [];

            setDays(projectDays);

            // Initialize freelancers
            const initialFreelancers = Array.isArray(initialPro.freelancers)
                ? initialPro.freelancers.map((f, idx) => ({
                    name: f.name || '',
                    price: f.price || 0,
                    type: f.type || 'freelancer',
                    id: `freelancer-${idx}-${Date.now()}`
                }))
                : [];
            setFreelancers(initialFreelancers);
        }
    }, [initialPro, days.length]);

    // Save overtime data
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            // Clean freelancers data - remove id field and ensure proper types
            const cleanedFreelancers = freelancers.map(f => ({
                name: f.name || '',
                price: parseFloat(f.price) || 0,
                type: f.type || 'freelancer'
            }));

            const updatedPro = {
                ...pro,
                start: pro.start,
                total: days.reduce((acc, day) => acc + (day.totalExpenses || 0), 0),
                freelancers: cleanedFreelancers,
                day: days.map((day) => ({
                    expense: {
                        rent: day.expense?.rent || [],
                        operational: day.expense?.operational || [],
                        orderlist: day.expense?.orderlist || [],
                    },
                    backup: day.backup || [],
                    crew: day.crew || [],
                    images: Array.isArray(day.images) ? day.images : [],
                    note: day.note || '',
                    date: day.date || '',
                    template: day.template === undefined ? true : day.template,
                    dayNumber: day.dayNumber,
                    isPreProd: day.isPreProd,
                    isPostProd: day.isPostProd,
                    totalExpenses: day.totalExpenses || 0,
                })),
            };

            await updateData(updatedPro);
            showToast("Overtime data saved successfully", 'success');
            setPro(updatedPro);

            // Recreate days from saved payload
            const rebuiltDays = (updatedPro.day || []).map((d, idx) => {
                const existingDay = days[idx];
                return {
                    ...d,
                    id: existingDay?.id || `day-${idx}-${Date.now()}-${Math.random()}`,
                    expense: {
                        rent: d.expense?.rent || [],
                        operational: d.expense?.operational || [],
                        orderlist: d.expense?.orderlist || [],
                    },
                    images: Array.isArray(d.images) ? d.images : [],
                    backup: d.backup || [],
                    crew: (d.crew || []).map(c => ({
                        name: c.name || '',
                        roles: Array.isArray(c.roles) ? c.roles : (c.roles ? [c.roles] : []),
                        overtime: Array.isArray(c.overtime)
                            ? c.overtime
                            : (c.overtime && typeof c.overtime === 'object')
                                ? [{ job: c.overtime.job || '', date: c.overtime.date || '', hour: c.overtime.hour || 0, note: c.overtime.note || '' }]
                                : []
                    })),
                    note: d.note || '',
                    date: d.date || '',
                    template: d.template === undefined ? true : d.template,
                };
            });
            setDays(rebuiltDays);
        } catch (error) {
            console.error('Save error:', error);
            showToast("Something went wrong! Failed to save overtime data", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="fixed top-0 left-0 z-40 bg-dark text-light w-full h-screen flex flex-col items-start">
            {/* Navbar */}
            <nav className="flex justify-between px-10 font-body text-sm tracking-wider items-center w-full h-10 border-b border-light">
                <button
                    type="button"
                    className="flex gap-1 items-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="#e8e8e8" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                    </svg>
                    Back
                </button>
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold text-light">Overtime Management</h1>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center bg-light text-dark w-20 h-8 justify-center text-sm"
                    >
                        {loading ? (
                            <span className="animate-spin">
                                <svg width="100%" height="100%" viewBox="0 0 24 24" className="size-4 animate-spin" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        ) : "Save"}
                    </button>
                </div>
            </nav>

            <main className="w-full overflow-y-auto no-scrollbar p-4">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full">
                    {/* Overtime feature */}
                    <section className="glass p-4 m-1 w-full h-full rounded-xl font-body text-sm tracking-wider border border-light/50">
                        <p className="pb-4 text-xl font-semibold text-light tracking-wider">Overtime</p>

                        {/* Overtime Table */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-light/50">
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Name</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Date</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Overtime (hours)</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Note</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        // Collect all unique crew members across all days (exclude freelancers)
                                        const freelancerNamesSet = new Set(
                                            (Array.isArray(freelancers) ? freelancers : [])
                                                .map(f => String(f.name).trim().toLowerCase())
                                                .filter(Boolean)
                                        );
                                        const crewMap = new Map();

                                        days.forEach((day, dayIndex) => {
                                            if (!day.crew || day.crew.length === 0) return;

                                            day.crew.forEach((crewMember, crewIdx) => {
                                                if (!crewMember.name) return;

                                                // Skip freelancers
                                                const memberNameKey = String(crewMember.name).trim().toLowerCase();
                                                if (freelancerNamesSet.has(memberNameKey)) return;

                                                const crewKey = `${crewMember.name}`;
                                                if (!crewMap.has(crewKey)) {
                                                    crewMap.set(crewKey, {
                                                        name: crewMember.name,
                                                        roles: new Set(),
                                                        overtime: [],
                                                        dayTemplate: day.template,
                                                        dayIndex: dayIndex, // Store first occurrence for adding entries
                                                        crewIdx: crewIdx // Store crew index for adding entries
                                                    });
                                                }

                                                // Merge roles from all days for this crew member
                                                const existingCrew = crewMap.get(crewKey);
                                                const memberRoles = Array.isArray(crewMember.roles) ? crewMember.roles : [];
                                                memberRoles.forEach(role => {
                                                    if (role && role.trim()) {
                                                        existingCrew.roles.add(role.trim());
                                                    }
                                                });

                                                // Merge overtime entries from this day with metadata
                                                // Include all entries (including empty ones) so users can add new entries
                                                // Auto-populate job with first role if not set
                                                const firstRole = Array.isArray(crewMember.roles) && crewMember.roles.length > 0
                                                    ? crewMember.roles[0]
                                                    : '';
                                                const overtimeEntries = Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0
                                                    ? crewMember.overtime
                                                        .map((entry, otIdx) => ({
                                                            ...entry,
                                                            job: entry.job || firstRole, // Auto-set job to first role if not set
                                                            _dayIndex: dayIndex,
                                                            _crewIndex: crewIdx,
                                                            _otIndex: otIdx
                                                        }))
                                                    : [];

                                                existingCrew.overtime.push(...overtimeEntries);
                                            });
                                        });

                                        // Convert role Sets to Arrays for easier use
                                        crewMap.forEach((crewMember) => {
                                            crewMember.roles = Array.from(crewMember.roles).sort((a, b) => a.localeCompare(b));
                                        });

                                        // Render rows for each unique crew member
                                        // Show all crew members, even if they have no overtime entries yet
                                        return Array.from(crewMap.values()).flatMap((crewMember, crewIdx) => {
                                            const overtimeEntries = crewMember.overtime;

                                            // If no overtime entries, show one empty row to allow adding
                                            if (overtimeEntries.length === 0) {
                                                return (
                                                    <tr key={`${crewMember.name}-${crewIdx}-empty`} className="border-b border-light/20 hover:bg-light/5 transition-colors">
                                                        <td className="py-2 px-3 text-light/80 text-xs">
                                                            {crewMember.name || 'Unnamed'}
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="date"
                                                                value=""
                                                                onChange={(e) => {
                                                                    setDays(prevDays => {
                                                                        return prevDays.map((day, dayIdx) => {
                                                                            if (dayIdx === crewMember.dayIndex) {
                                                                                const updatedCrew = [...(day.crew || [])];
                                                                                const member = updatedCrew[crewMember.crewIdx];
                                                                                if (member) {
                                                                                    const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                        ? member.roles[0]
                                                                                        : '';
                                                                                    const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                    if (currentOvertime.length === 0) {
                                                                                        currentOvertime.push({
                                                                                            job: firstRole,
                                                                                            date: e.target.value,
                                                                                            hour: '',
                                                                                            note: ''
                                                                                        });
                                                                                    } else {
                                                                                        currentOvertime[0].date = e.target.value;
                                                                                        if (!currentOvertime[0].job) {
                                                                                            currentOvertime[0].job = firstRole;
                                                                                        }
                                                                                    }
                                                                                    updatedCrew[crewMember.crewIdx] = { ...member, overtime: currentOvertime };
                                                                                    return { ...day, crew: updatedCrew };
                                                                                }
                                                                            }
                                                                            return day;
                                                                        });
                                                                    });
                                                                }}
                                                                className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs text-light bg-transparent"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="text"
                                                                inputMode="decimal"
                                                                placeholder="0"
                                                                value=""
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDays(prevDays => {
                                                                        return prevDays.map((day, dayIdx) => {
                                                                            if (dayIdx === crewMember.dayIndex) {
                                                                                const updatedCrew = [...(day.crew || [])];
                                                                                const member = updatedCrew[crewMember.crewIdx];
                                                                                if (member) {
                                                                                    const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                        ? member.roles[0]
                                                                                        : '';
                                                                                    const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                    if (currentOvertime.length === 0) {
                                                                                        currentOvertime.push({
                                                                                            job: firstRole,
                                                                                            date: day.date || '',
                                                                                            hour: value,
                                                                                            note: ''
                                                                                        });
                                                                                    } else {
                                                                                        currentOvertime[0].hour = value;
                                                                                        if (!currentOvertime[0].job) {
                                                                                            currentOvertime[0].job = firstRole;
                                                                                        }
                                                                                    }
                                                                                    updatedCrew[crewMember.crewIdx] = { ...member, overtime: currentOvertime };
                                                                                    return { ...day, crew: updatedCrew };
                                                                                }
                                                                            }
                                                                            return day;
                                                                        });
                                                                    });
                                                                }}
                                                                className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs w-20 text-light"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Note"
                                                                value=""
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDays(prevDays => {
                                                                        return prevDays.map((day, dayIdx) => {
                                                                            if (dayIdx === crewMember.dayIndex) {
                                                                                const updatedCrew = [...(day.crew || [])];
                                                                                const member = updatedCrew[crewMember.crewIdx];
                                                                                if (member) {
                                                                                    const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                        ? member.roles[0]
                                                                                        : '';
                                                                                    const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                    if (currentOvertime.length === 0) {
                                                                                        currentOvertime.push({
                                                                                            job: firstRole,
                                                                                            date: day.date || '',
                                                                                            hour: '',
                                                                                            note: value
                                                                                        });
                                                                                    } else {
                                                                                        currentOvertime[0].note = value;
                                                                                        if (!currentOvertime[0].job) {
                                                                                            currentOvertime[0].job = firstRole;
                                                                                        }
                                                                                    }
                                                                                    updatedCrew[crewMember.crewIdx] = { ...member, overtime: currentOvertime };
                                                                                    return { ...day, crew: updatedCrew };
                                                                                }
                                                                            }
                                                                            return day;
                                                                        });
                                                                    });
                                                                }}
                                                                className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs text-light bg-transparent w-32"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setDays(prevDays => {
                                                                            return prevDays.map((day, dayIdx) => {
                                                                                if (dayIdx === crewMember.dayIndex) {
                                                                                    const updatedCrew = [...(day.crew || [])];
                                                                                    const member = updatedCrew[crewMember.crewIdx];
                                                                                    if (member) {
                                                                                        const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                            ? member.roles[0]
                                                                                            : '';
                                                                                        const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                        currentOvertime.push({ job: firstRole, date: day.date || '', hour: '', note: '' });
                                                                                        updatedCrew[crewMember.crewIdx] = { ...member, overtime: currentOvertime };
                                                                                        return { ...day, crew: updatedCrew };
                                                                                    }
                                                                                }
                                                                                return day;
                                                                            });
                                                                        });
                                                                    }}
                                                                    className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-light cursor-pointer"
                                                                    title="Add overtime entry"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return overtimeEntries.map((overtimeEntry, overtimeIdx) => (
                                                <tr key={`${crewMember.name}-${crewIdx}-${overtimeIdx}`} className="border-b border-light/20 hover:bg-light/5 transition-colors">
                                                    <td className="py-2 px-3 text-light/80 text-xs">
                                                        {overtimeIdx === 0 ? (crewMember.name || 'Unnamed') : ''}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="date"
                                                            value={overtimeEntry.date || ''}
                                                            onChange={(e) => {
                                                                // Update specific overtime entry using tracked indices
                                                                const dayIdx = overtimeEntry._dayIndex;
                                                                const crewIdx = overtimeEntry._crewIndex;
                                                                const otIdx = overtimeEntry._otIndex;
                                                                setDays(prevDays =>
                                                                    prevDays.map((day, idx) => {
                                                                        if (idx === dayIdx) {
                                                                            return {
                                                                                ...day,
                                                                                crew: (day.crew || []).map((member, mIdx) => {
                                                                                    if (mIdx === crewIdx) {
                                                                                        const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                            ? member.roles[0]
                                                                                            : '';
                                                                                        const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                        // Update the specific overtime entry, auto-set job to first role if not set
                                                                                        currentOvertime[otIdx] = {
                                                                                            job: currentOvertime[otIdx]?.job || firstRole,
                                                                                            date: e.target.value,
                                                                                            hour: currentOvertime[otIdx]?.hour || '',
                                                                                            note: currentOvertime[otIdx]?.note || ''
                                                                                        };
                                                                                        return { ...member, overtime: currentOvertime };
                                                                                    }
                                                                                    return member;
                                                                                })
                                                                            };
                                                                        }
                                                                        return day;
                                                                    })
                                                                );
                                                            }}
                                                            className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs text-light bg-transparent"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            placeholder="0"
                                                            value={overtimeEntry.hour || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Update specific overtime entry using tracked indices
                                                                const dayIdx = overtimeEntry._dayIndex;
                                                                const crewIdx = overtimeEntry._crewIndex;
                                                                const otIdx = overtimeEntry._otIndex;
                                                                setDays(prevDays =>
                                                                    prevDays.map((day, idx) => {
                                                                        if (idx === dayIdx) {
                                                                            return {
                                                                                ...day,
                                                                                crew: (day.crew || []).map((member, mIdx) => {
                                                                                    if (mIdx === crewIdx) {
                                                                                        const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                            ? member.roles[0]
                                                                                            : '';
                                                                                        const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                        // Update the specific overtime entry, auto-set job to first role if not set
                                                                                        currentOvertime[otIdx] = {
                                                                                            job: currentOvertime[otIdx]?.job || firstRole,
                                                                                            date: currentOvertime[otIdx]?.date || '',
                                                                                            hour: value,
                                                                                            note: currentOvertime[otIdx]?.note || ''
                                                                                        };
                                                                                        return { ...member, overtime: currentOvertime };
                                                                                    }
                                                                                    return member;
                                                                                })
                                                                            };
                                                                        }
                                                                        return day;
                                                                    })
                                                                );
                                                            }}
                                                            className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs w-20 text-light"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Note"
                                                            value={overtimeEntry.note || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Update specific overtime entry using tracked indices
                                                                const dayIdx = overtimeEntry._dayIndex;
                                                                const crewIdx = overtimeEntry._crewIndex;
                                                                const otIdx = overtimeEntry._otIndex;
                                                                setDays(prevDays =>
                                                                    prevDays.map((day, idx) => {
                                                                        if (idx === dayIdx) {
                                                                            return {
                                                                                ...day,
                                                                                crew: (day.crew || []).map((member, mIdx) => {
                                                                                    if (mIdx === crewIdx) {
                                                                                        const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                            ? member.roles[0]
                                                                                            : '';
                                                                                        const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                        // Update the specific overtime entry, auto-set job to first role if not set
                                                                                        currentOvertime[otIdx] = {
                                                                                            job: currentOvertime[otIdx]?.job || firstRole,
                                                                                            date: currentOvertime[otIdx]?.date || '',
                                                                                            hour: currentOvertime[otIdx]?.hour || '',
                                                                                            note: value
                                                                                        };
                                                                                        return { ...member, overtime: currentOvertime };
                                                                                    }
                                                                                    return member;
                                                                                })
                                                                            };
                                                                        }
                                                                        return day;
                                                                    })
                                                                );
                                                            }}
                                                            className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs text-light bg-transparent w-32"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="flex items-center gap-1">
                                                            {/* Add button - show on all entries to allow adding more */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    // Use tracked indices to add a new entry to the same crew member
                                                                    const dayIdx = overtimeEntry._dayIndex;
                                                                    const crewIdx = overtimeEntry._crewIndex;

                                                                    if (dayIdx === undefined || crewIdx === undefined) {
                                                                        console.error('Missing tracked indices for adding overtime entry');
                                                                        showToast("Error: Unable to add overtime entry. Please refresh the page.", "error");
                                                                        return;
                                                                    }

                                                                    setDays(prevDays => {
                                                                        const newDays = prevDays.map((day, idx) => {
                                                                            if (idx === dayIdx) {
                                                                                const updatedCrew = [...(day.crew || [])];
                                                                                if (updatedCrew[crewIdx]) {
                                                                                    const member = { ...updatedCrew[crewIdx] }; // Create a copy
                                                                                    const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                                        ? member.roles[0]
                                                                                        : '';
                                                                                    const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                    // Add a new empty overtime entry with first role as job
                                                                                    currentOvertime.push({ job: firstRole, date: day.date || '', hour: '', note: '' });
                                                                                    updatedCrew[crewIdx] = { ...member, overtime: currentOvertime };
                                                                                    return { ...day, crew: updatedCrew };
                                                                                }
                                                                            }
                                                                            return day;
                                                                        });
                                                                        return newDays;
                                                                    });
                                                                    showToast("Overtime entry added", "success");
                                                                }}
                                                                className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-light cursor-pointer"
                                                                title="Add overtime entry"
                                                            >
                                                                +
                                                            </button>
                                                            {/* Delete button - show when there are multiple entries or when hour > 0 */}
                                                            {(overtimeEntries.length > 1 || (parseFloat(overtimeEntry.hour || '0') > 0) || overtimeEntry.job) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        // Delete specific overtime entry using tracked indices
                                                                        const dayIdx = overtimeEntry._dayIndex;
                                                                        const crewIdx = overtimeEntry._crewIndex;
                                                                        const otIdx = overtimeEntry._otIndex;
                                                                        setDays(prevDays =>
                                                                            prevDays.map((day, idx) => {
                                                                                if (idx === dayIdx) {
                                                                                    return {
                                                                                        ...day,
                                                                                        crew: (day.crew || []).map((member, mIdx) => {
                                                                                            if (mIdx === crewIdx) {
                                                                                                const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                                                currentOvertime.splice(otIdx, 1);
                                                                                                return { ...member, overtime: currentOvertime };
                                                                                            }
                                                                                            return member;
                                                                                        })
                                                                                    };
                                                                                }
                                                                                return day;
                                                                            })
                                                                        );
                                                                    }}
                                                                    className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                                                                    title="Delete overtime entry"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ));
                                        });
                                    })()}
                                </tbody>
                            </table>

                            {/* Empty state - only show if there are no crew members at all */}
                            {(() => {
                                const hasAnyCrew = days.some(day => day.crew && day.crew.length > 0);
                                if (!hasAnyCrew) {
                                    return (
                                        <div className="text-center py-8 text-light/60">
                                            <p className="text-sm">No crew members assigned yet</p>
                                            <p className="text-xs mt-2 text-light/40">Add crew members in the Report page first</p>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        {/* Add Overtime Entry Section */}
                        {(() => {
                            // Get all crew members who don't have any overtime entries yet (exclude freelancers)
                            const freelancerNamesSet = new Set(
                                (Array.isArray(freelancers) ? freelancers : [])
                                    .map(f => String(f.name).trim().toLowerCase())
                                    .filter(Boolean)
                            );
                            const crewMap = new Map();
                            days.forEach((day, dayIndex) => {
                                if (!day.crew || day.crew.length === 0) return;
                                day.crew.forEach((crewMember, crewIdx) => {
                                    if (!crewMember.name) return;

                                    // Skip freelancers
                                    const memberNameKey = String(crewMember.name).trim().toLowerCase();
                                    if (freelancerNamesSet.has(memberNameKey)) return;

                                    const crewKey = `${crewMember.name}`;
                                    if (!crewMap.has(crewKey)) {
                                        crewMap.set(crewKey, {
                                            name: crewMember.name,
                                            dayIndex,
                                            crewIdx,
                                            hasOvertime: false
                                        });
                                    }
                                    // Check if this crew member has any overtime entries on this day
                                    const hasOvertime = Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0 &&
                                        crewMember.overtime.some(ot => ot.job || ot.date || ot.hour || ot.note);
                                    if (hasOvertime) {
                                        crewMap.get(crewKey).hasOvertime = true;
                                    }
                                });
                            });

                            const crewWithoutOvertime = Array.from(crewMap.values())
                                .filter(crew => !crew.hasOvertime)
                                .sort((a, b) => a.name.localeCompare(b.name));

                            if (crewWithoutOvertime.length === 0) return null;

                            return (
                                <div className="mt-4 pt-4 border-t border-light/20">
                                    <p className="text-sm text-light/80 mb-2">Add Overtime Entry:</p>
                                    <div className="flex items-center gap-2">
                                        <select
                                            id="add-overtime-crew-select"
                                            className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs bg-transparent text-light"
                                            defaultValue=""
                                        >
                                            <option value="" className="bg-dark text-light">Select Crew Member</option>
                                            {crewWithoutOvertime.map((crew, idx) => (
                                                <option key={idx} value={crew.name} className="bg-dark text-light">
                                                    {crew.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const select = document.getElementById('add-overtime-crew-select');
                                                const selectedName = select?.value;
                                                if (!selectedName) {
                                                    showToast("Please select a crew member", "error");
                                                    return;
                                                }

                                                const selectedCrew = crewWithoutOvertime.find(c => c.name === selectedName);
                                                if (!selectedCrew) return;

                                                setDays(prevDays => {
                                                    return prevDays.map((day, dayIdx) => {
                                                        if (dayIdx === selectedCrew.dayIndex) {
                                                            const updatedCrew = [...(day.crew || [])];
                                                            const memberIndex = updatedCrew.findIndex(m => m?.name === selectedCrew.name);
                                                            if (memberIndex !== -1) {
                                                                const member = updatedCrew[memberIndex];
                                                                const firstRole = Array.isArray(member.roles) && member.roles.length > 0
                                                                    ? member.roles[0]
                                                                    : '';
                                                                const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                                currentOvertime.push({ job: firstRole, date: day.date || '', hour: '', note: '' });
                                                                updatedCrew[memberIndex] = { ...member, overtime: currentOvertime };
                                                                return { ...day, crew: updatedCrew };
                                                            }
                                                        }
                                                        return day;
                                                    });
                                                });

                                                // Reset select
                                                if (select) select.value = '';
                                                showToast("Overtime entry added", "success");
                                            }}
                                            className="text-xs px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-light cursor-pointer"
                                        >
                                            Add Entry
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </section>
                </form>
            </main>
        </main>
    );
};

const Overtime = ({ pro: initialPro, updateData }) => {
    return (
        <ErrorBoundary>
            <OvertimeComponent
                pro={initialPro}
                updateData={updateData}
            />
        </ErrorBoundary>
    );
};

export default Overtime;
