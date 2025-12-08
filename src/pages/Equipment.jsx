import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../components/micro-components/ToastContext';
import { ErrorBoundary, PDFEquipment } from "../components";
import { equipImport, useHasPermission } from '../hook';
import { pdf } from '@react-pdf/renderer';

const EquipmentComponent = ({ pro: initialPro, updateData }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const canAccessEquipment = useHasPermission("equipment");
    const equipmentList = equipImport();
    const [pro, setPro] = useState(initialPro || {});
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState(initialPro?.equipment || []);

    // Check privilege - if user doesn't have access, show message and close
    useEffect(() => {
        if (!canAccessEquipment) {
            showToast("You don't have permission to access this feature", "error");
            navigate(-1);
        }
    }, [canAccessEquipment, showToast, navigate]);

    if (!canAccessEquipment) {
        return null;
    }

    // Initialize equipment data from project
    useEffect(() => {
        if (initialPro) {
            setSelectedEquipment(initialPro.equipment || []);
            setPro(initialPro);
        }
    }, [initialPro]);

    // Filter equipment based on search
    const filteredEquipment = useMemo(() => {
        if (!searchQuery.trim()) return equipmentList;
        const query = searchQuery.toLowerCase();
        return equipmentList.filter(item =>
            item.name?.toLowerCase().includes(query) ||
            item.kelengkapan?.toLowerCase().includes(query) ||
            item.kondisi?.toLowerCase().includes(query)
        );
    }, [equipmentList, searchQuery]);

    // Check if equipment is selected
    const isSelected = (equipId) => {
        return selectedEquipment.some(item => item.id === equipId);
    };

    // Get selected item details
    const getSelectedItem = (equipId) => {
        return selectedEquipment.find(item => item.id === equipId);
    };

    // Toggle equipment selection
    const handleToggleEquipment = (equip) => {
        if (isSelected(equip.id)) {
            setSelectedEquipment(prev => prev.filter(item => item.id !== equip.id));
        } else {
            setSelectedEquipment(prev => [...prev, {
                id: equip.id,
                name: equip.name,
                qty: 1,
                note: ""
            }]);
        }
    };

    // Update quantity for selected equipment
    const handleUpdateQty = (equipId, qty) => {
        setSelectedEquipment(prev => prev.map(item =>
            item.id === equipId ? { ...item, qty: Math.max(1, parseInt(qty) || 1) } : item
        ));
    };

    // Update note for selected equipment
    const handleUpdateNote = (equipId, note) => {
        setSelectedEquipment(prev => prev.map(item =>
            item.id === equipId ? { ...item, note } : item
        ));
    };

    // Remove equipment from selection
    const handleRemoveEquipment = (equipId) => {
        setSelectedEquipment(prev => prev.filter(item => item.id !== equipId));
    };

    const handleSave = async () => {
        if (!updateData) {
            showToast("Save function not available", "error");
            return;
        }

        setLoading(true);
        try {
            const updatedPro = {
                ...pro,
                equipment: selectedEquipment,
            };
            await updateData(updatedPro);
            setPro(updatedPro);
            showToast("Equipment saved successfully", "success");
        } catch (error) {
            console.error("Error saving equipment:", error);
            showToast("Failed to save equipment", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            const blob = await pdf(
                <PDFEquipment
                    pro={pro}
                    equipment={selectedEquipment}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Equipment List - ${pro?.title || "Project"}.pdf`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast("Equipment PDF exported successfully", "success");
        } catch (error) {
            console.error("PDF export error:", error);
            showToast("Failed to export PDF", "error");
        }
    };

    // Get condition badge color
    const getConditionColor = (kondisi) => {
        const condition = kondisi?.toLowerCase();
        if (condition?.includes("baik") || condition?.includes("good")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (condition?.includes("cukup") || condition?.includes("fair")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        if (condition?.includes("rusak") || condition?.includes("bad")) return "bg-red-500/20 text-red-400 border-red-500/30";
        return "bg-light/10 text-light/70 border-light/20";
    };

    return (
        <main className="fixed font-body top-0 left-0 z-40 bg-dark text-light w-full h-screen flex flex-col items-start">
            {/* Navbar */}
            <nav className="flex justify-between px-10 font-body text-sm tracking-wider items-center w-full h-12 border-b border-light">
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
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center bg-light text-dark px-4 h-8 justify-center disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={handleExportPDF}
                        disabled={selectedEquipment.length === 0}
                        className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center border-light/50 text-light px-4 h-8 justify-center disabled:opacity-50"
                    >
                        Export PDF
                    </button>
                </div>
            </nav>

            <main className="w-full overflow-y-auto no-scrollbar p-4 flex gap-4">
                {/* Equipment List */}
                <section className="flex-1 glass p-6 rounded-xl border border-light/50">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-light tracking-wider">Equipment List</h1>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search equipment..."
                                className="bg-transparent border border-light/30 rounded-lg px-4 py-2 text-light text-sm w-64 pl-10"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-light/50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    </div>

                    {equipmentList.length === 0 ? (
                        <div className="text-center py-12 text-light/60">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-16 mx-auto mb-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <p className="text-lg">Loading equipment...</p>
                        </div>
                    ) : filteredEquipment.length === 0 ? (
                        <div className="text-center py-12 text-light/60">
                            <p>No equipment found matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
                            {filteredEquipment.map((equip) => (
                                <div
                                    key={equip.id}
                                    onClick={() => handleToggleEquipment(equip)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isSelected(equip.id)
                                        ? "border-emerald-500 bg-emerald-500/10"
                                        : "border-light/20 hover:border-light/40"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-light text-sm mb-1">{equip.name}</h3>
                                            {equip.kelengkapan && (
                                                <p className="text-xs text-light/60 mb-2">{equip.kelengkapan}</p>
                                            )}
                                            <div className="flex gap-2 flex-wrap">
                                                {equip.kondisi && (
                                                    <span className={`text-xs px-2 py-0.5 rounded border ${getConditionColor(equip.kondisi)}`}>
                                                        {equip.kondisi}
                                                    </span>
                                                )}
                                                {equip.note && (
                                                    <span className="text-xs text-light/50 italic">
                                                        {equip.note}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected(equip.id)
                                            ? "border-emerald-500 bg-emerald-500"
                                            : "border-light/30"
                                            }`}>
                                            {isSelected(equip.id) && (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-3 text-dark">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Selected Equipment */}
                <section className="w-96 glass p-6 rounded-xl border border-light/50">
                    {/* Project Info */}
                    <div className="mb-6 pb-4 border-b border-light/20">
                        <h3 className="text-sm font-semibold text-light mb-2">Project</h3>
                        <p className="text-light/80 text-sm">{pro?.title || "-"}</p>
                        <p className="text-light/50 text-xs">{pro?.client || "-"}</p>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-light tracking-wider">Selected</h2>
                        <span className="text-sm text-light/60">{selectedEquipment.length} items</span>
                    </div>
                    {selectedEquipment.length === 0 ? (
                        <div className="text-center py-12 text-light/60">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-12 mx-auto mb-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <p className="text-sm">No equipment selected</p>
                            <p className="text-xs mt-1 text-light/40">Click on equipment to add</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
                            {selectedEquipment.map((item) => (
                                <div key={item.id} className="p-3 rounded-lg border border-light/20 bg-light/5">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h4 className="font-medium text-light text-sm flex-1">{item.name}</h4>
                                        <button
                                            onClick={() => handleRemoveEquipment(item.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <label className="text-xs text-light/60">Qty:</label>
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => handleUpdateQty(item.id, e.target.value)}
                                            min="1"
                                            className="w-16 bg-transparent border border-light/30 rounded px-2 py-1 text-light text-xs"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={item.note || ""}
                                            onChange={(e) => handleUpdateNote(item.id, e.target.value)}
                                            placeholder="Add note..."
                                            className="w-full bg-transparent border border-light/20 rounded px-2 py-1 text-light text-xs placeholder:text-light/30"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                </section>
            </main>
        </main>
    );
};

const Equipment = ({ pro, updateData }) => {
    return (
        <ErrorBoundary>
            <EquipmentComponent pro={pro} updateData={updateData} />
        </ErrorBoundary>
    );
};

export default Equipment;
