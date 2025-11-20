import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useToast } from '../components/micro-components/ToastContext';
import { ErrorBoundary, PDFQuotation } from "../components";
import { pdf } from '@react-pdf/renderer';
import { useHasPermission, useProductionPrice, useDesignPrice, useMotionPrice, useDocumentationPrice } from '../hook';

const QuotationComponent = ({ pro: initialPro, updateData }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const canAccessFinance = useHasPermission("finance");
    const productionPrice = useProductionPrice();
    const designPrice = useDesignPrice();
    const motionPrice = useMotionPrice();
    const documentationPrice = useDocumentationPrice();
    const [pro, setPro] = useState(initialPro || {});
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState([]);
    const [quotationNumber, setQuotationNumber] = useState(initialPro?.quotation?.quotationNumber || "");
    const [quotationDate, setQuotationDate] = useState(initialPro?.quotation?.quotationDate || new Date().toISOString().split('T')[0]);
    const [validUntil, setValidUntil] = useState(initialPro?.quotation?.validUntil || "");
    const [taxRate, setTaxRate] = useState(initialPro?.quotation?.taxRate || 11); // Default 11% VAT
    const [notes, setNotes] = useState(initialPro?.quotation?.notes || "");
    const [items, setItems] = useState(initialPro?.quotation?.items || []);

    // Check privilege - if user doesn't have access, show message and close
    useEffect(() => {
        if (!canAccessFinance) {
            showToast("You don't have permission to access this feature", "error");
            navigate(-1);
        }
    }, [canAccessFinance, showToast, navigate]);

    if (!canAccessFinance) {
        return null;
    }

    // Initialize days and quotation data from project
    useEffect(() => {
        if (initialPro) {
            if (initialPro.day) {
                const projectDays = initialPro.day.map((day, index) => ({
                    ...day,
                    id: day.id || `day-${index}-${Date.now()}-${Math.random()}`,
                    expense: {
                        rent: day.expense?.rent || [],
                        operational: day.expense?.operational || [],
                        orderlist: day.expense?.orderlist || [],
                    },
                }));
                setDays(projectDays);
            }

            // Initialize quotation data
            if (initialPro.quotation) {
                setQuotationNumber(initialPro.quotation.quotationNumber || "");
                setQuotationDate(initialPro.quotation.quotationDate || new Date().toISOString().split('T')[0]);
                setValidUntil(initialPro.quotation.validUntil || "");
                setTaxRate(initialPro.quotation.taxRate || 11);
                setNotes(initialPro.quotation.notes || "");
                // Format items to ensure correct data types match model schema
                const formattedItems = (initialPro.quotation.items || []).map(item => ({
                    description: String(item.description || ""),
                    unit: String(item.unit || "pcs"),
                    qty: Number(item.qty) || 0,
                    price: Number(item.price) || 0,
                }));
                setItems(formattedItems);
            }

            setPro(initialPro);
        }
    }, [initialPro]);

    // Calculate total expenses
    const calculateTotalExpenses = (day) => {
        if (!day) return 0;
        const parseNumber = (value) => isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        const rentTotal = day.expense.rent.reduce(
            (total, expense) => total + parseNumber(expense.price) * (parseInt(expense.qty) || 0), 0
        );
        const operationalTotal = day.expense.operational.reduce(
            (total, expense) => total + parseNumber(expense.price) * (parseInt(expense.qty) || 0), 0
        );
        return rentTotal + operationalTotal;
    };

    const totalExpenses = useMemo(() => {
        return days.reduce((acc, day) => acc + calculateTotalExpenses(day), 0);
    }, [days]);

    // Check if any price list is loading
    const isPriceListLoading = useMemo(() => {
        const firstCategory = pro?.categories?.[0];
        switch (firstCategory) {
            case "Produksi":
                return productionPrice.loading;
            case "Design":
                return designPrice.loading;
            case "Motion":
                return motionPrice.loading;
            case "Dokumentasi":
                return documentationPrice.loading;
            default:
                return productionPrice.loading || designPrice.loading || motionPrice.loading || documentationPrice.loading;
        }
    }, [pro?.categories, productionPrice.loading, designPrice.loading, motionPrice.loading, documentationPrice.loading]);

    // Get price list based on first checked category
    const selectedPriceList = useMemo(() => {
        const firstCategory = pro?.categories?.[0];

        // Map category to price list data
        switch (firstCategory) {
            case "Produksi":
                return productionPrice.data || [];
            case "Design":
                return designPrice.data || [];
            case "Motion":
                return motionPrice.data || [];
            case "Dokumentasi":
                return documentationPrice.data || [];
            default:
                // If no category or unknown category, show all price lists combined
                return [
                    ...(productionPrice.data || []),
                    ...(designPrice.data || []),
                    ...(motionPrice.data || []),
                    ...(documentationPrice.data || [])
                ];
        }
    }, [pro?.categories, productionPrice.data, designPrice.data, motionPrice.data, documentationPrice.data]);

    // Get all available services from all price lists (for fallback matching)
    const allServices = useMemo(() => {
        const services = new Map(); // Use Map to preserve original service name
        productionPrice.data.forEach(x => {
            if (x.service) services.set(x.service.trim(), x.service);
        });
        designPrice.data.forEach(x => {
            if (x.service) services.set(x.service.trim(), x.service);
        });
        motionPrice.data.forEach(x => {
            if (x.service) services.set(x.service.trim(), x.service);
        });
        documentationPrice.data.forEach(x => {
            if (x.service) services.set(x.service.trim(), x.service);
        });
        // Also include any descriptions from existing items that might not be in the price lists yet
        items.forEach(item => {
            if (item.description && item.description.trim()) {
                const trimmed = item.description.trim();
                if (!services.has(trimmed)) {
                    services.set(trimmed, item.description);
                }
            }
        });
        return Array.from(services.values());
    }, [productionPrice.data, designPrice.data, motionPrice.data, documentationPrice.data, items]);

    // Calculate totals from items
    const itemsSubtotal = useMemo(() => {
        return items.reduce((acc, item) => {
            const price = selectedPriceList.find((x) => x.service === item.description)?.price || 0;
            return acc + (parseFloat(price) * parseInt(item.qty || 0));
        }, 0);
    }, [items, selectedPriceList]);

    const subtotal = itemsSubtotal || totalExpenses;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const formatCurrency = (num) => {
        if (!num || isNaN(num)) return "Rp. 0";
        return `Rp. ${parseFloat(num).toLocaleString("id-ID")}`;
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d)) return "";
        return d.toISOString().slice(0, 10);
    };

    const handleAddItem = () => {
        setItems([...items, { description: "", qty: 1, price: 0, unit: "pcs" }]);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setItems(updatedItems);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!updateData) {
            showToast("Save function not available", "error");
            return;
        }

        setLoading(true);
        try {
            // Format items to match model schema: description (String), unit (String), qty (Number), price (Number)
            const formattedItems = items.map(item => ({
                description: String(item.description || ""),
                unit: String(item.unit || "pcs"),
                qty: Number(item.qty) || 0,
                price: Number(item.price) || 0,
            }));

            const updatedPro = {
                ...pro,
                quotation: {
                    quotationNumber,
                    quotationDate,
                    validUntil,
                    taxRate,
                    notes,
                    items: formattedItems,
                    subtotal,
                    taxAmount,
                    total,
                },
            };
            await updateData(updatedPro);
            setPro(updatedPro);
            showToast("Quotation saved successfully", "success");
        } catch (error) {
            console.error("Error saving quotation:", error);
            showToast("Failed to save quotation", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            const blob = await pdf(
                <PDFQuotation
                    pro={pro}
                    days={days}
                    quotationNumber={quotationNumber}
                    quotationDate={quotationDate}
                    validUntil={validUntil}
                    items={items}
                    selectedPriceList={selectedPriceList}
                    subtotal={subtotal}
                    taxRate={taxRate}
                    taxAmount={taxAmount}
                    total={total}
                    notes={notes}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Quotation ${quotationNumber || pro?.title || "Project"}.pdf`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast("Quotation PDF exported successfully", "success");
        } catch (error) {
            console.error("PDF export error:", error);
            showToast("Failed to export PDF", "error");
        }
    };


    return (
        <main className="fixed font-body top-0 left-0 z-40 bg-dark text-light w-full h-screen flex flex-col items-start">
            {/* Navbar */}
            <nav className="flex justify-between px-10 font-body text-sm tracking-wider items-center w-full h-20 border-b border-light">
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
                        className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center border-light/50 text-light px-4 h-8 justify-center"
                    >
                        Export PDF
                    </button>
                </div>
            </nav>

            <main className="w-full overflow-y-auto no-scrollbar p-4">
                <div className="max-w-6xl mx-auto space-y-4">
                    {/* Quotation Header */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <h1 className="text-3xl font-bold text-light mb-6 tracking-wider">QUOTATION</h1>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-light mb-3">Quote To:</h3>
                                <div className="space-y-1 text-light/80">
                                    <p className="font-semibold text-light">{pro?.client || "-"}</p>
                                    <p>PIC: {pro?.pic || "-"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-light/80">Quotation Number:</span>
                                        <input
                                            type="text"
                                            value={quotationNumber}
                                            onChange={(e) => setQuotationNumber(e.target.value)}
                                            placeholder="QUO-XXXX"
                                            className="bg-transparent border border-light/30 rounded px-2 py-1 text-light text-sm w-40 text-right"
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-light/80">Quotation Date:</span>
                                        <input
                                            type="date"
                                            value={quotationDate}
                                            onChange={(e) => setQuotationDate(e.target.value)}
                                            className="bg-transparent border border-light/30 rounded px-2 py-1 text-light text-sm w-40"
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-light/80">Valid Until:</span>
                                        <input
                                            type="date"
                                            value={validUntil}
                                            onChange={(e) => setValidUntil(e.target.value)}
                                            className="bg-transparent border border-light/30 rounded px-2 py-1 text-light text-sm w-40"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-light/30 pt-4">
                            <h3 className="text-lg font-semibold text-light mb-2">Project Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-light/80">Project Title:</span>
                                    <span className="text-light ml-2 font-semibold">{pro?.title || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-light/80">Categories:</span>
                                    <span className="text-light ml-2 font-semibold">{pro?.categories?.join(", ") || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-light/80">Start Date:</span>
                                    <span className="text-light ml-2 font-semibold">{formatDate(pro?.start) || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-light/80">Deadline:</span>
                                    <span className="text-light ml-2 font-semibold">{formatDate(pro?.deadline) || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quotation Items */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-light tracking-wider">Quotation Items</h2>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                + Add Item
                            </button>
                        </div>
                        {items.length > 0 ? (
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 border border-light/20 rounded-lg p-3">
                                        <select
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                            className="flex-1  bg-dark text-light border border-light/30 rounded px-3 py-2 text-sm"
                                        >
                                            <option value="" className="bg-dark text-light">Select Service...</option>
                                            {selectedPriceList.map((x) => (
                                                <option key={x.id} value={x.service} className="bg-dark text-light">
                                                    {x.service}
                                                </option>
                                            ))}
                                            {/* Fallback option for saved items that might not be in the price list */}
                                            {item.description && item.description.trim() && !selectedPriceList.some(x => x.service === item.description) && (
                                                <option value={item.description} className="bg-dark text-light">
                                                    {item.description} {item.price ? `| Rp. ${parseFloat(item.price).toLocaleString("id-ID")}` : ""}
                                                </option>
                                            )}
                                        </select>
                                        <input
                                            type="text"
                                            className="outline-none"
                                            readOnly
                                            value={isPriceListLoading ? "Loading..." : `Rp. ${parseFloat(selectedPriceList.find((x) => x.service === item.description)?.price || 0).toLocaleString("id-ID")}`}
                                        />
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(index, "qty", parseInt(e.target.value) || 0)}
                                            placeholder="Qty"
                                            min="1"
                                            className="w-24 bg-transparent border border-light/30 rounded px-2 py-2 text-light text-sm"
                                        />
                                        <select
                                            value={item.unit || "pcs"}
                                            className="w-20 bg-transparent border border-light/30 rounded px-2 py-2 text-light text-sm"
                                            onChange={(e) => handleItemChange(index, "unit", e.target.value)} name="" id="">
                                            <option className="bg-dark text-light" value={'pcs'}>pcs</option>
                                            <option className="bg-dark text-light" value={'day'}>day</option>
                                            <option className="bg-dark text-light" value={'qty'}>qty</option>
                                            <option className="bg-dark text-light" value={'rate'}>rate</option>
                                        </select>
                                        <div className="w-32 text-right text-light font-semibold">
                                            {isPriceListLoading ? (
                                                <span className="flex items-center justify-end gap-1 text-light/60">
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </span>
                                            ) : (
                                                formatCurrency((item.qty || 0) * (selectedPriceList.find((x) => x.service === item.description)?.price || 0))
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-light/60">
                                <p className="mb-4">No items added yet. Click "Add Item" to create a quotation.</p>
                                <p className="text-sm">Or use the expense summary below as reference.</p>
                            </div>
                        )}
                    </section>

                    {/* Expense Summary (Reference) */}
                    {totalExpenses > 0 && (
                        <section className="glass p-6 rounded-xl border border-light/50">
                            <h2 className="text-xl font-semibold text-light mb-4 tracking-wider">Expense Summary (Reference)</h2>

                            <div className="space-y-4">
                                {days.map((day, dayIndex) => {
                                    const dayTotal = calculateTotalExpenses(day);
                                    if (dayTotal === 0) return null;

                                    return (
                                        <div key={day.id || dayIndex} className="border border-light/20 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-semibold text-light">
                                                    {dayIndex === 0
                                                        ? 'Pre-Production'
                                                        : dayIndex === days.length - 1
                                                            ? 'Post-Production'
                                                            : `Day ${dayIndex}`}
                                                    {day.date ? ` - ${formatDate(day.date)}` : ""}
                                                </h3>
                                                <span className="text-light font-semibold">{formatCurrency(dayTotal)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Quotation Totals */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <div className="flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between text-light/80">
                                    <span>Subtotal:</span>
                                    <span>
                                        {isPriceListLoading ? (
                                            <span className="flex items-center gap-1 text-light/60">
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                        ) : (
                                            formatCurrency(subtotal)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-light/80">Tax (VAT):</span>
                                        <input
                                            type="number"
                                            value={taxRate}
                                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            className="bg-transparent border border-light/30 rounded px-2 py-1 text-light text-sm w-20"
                                        />
                                        <span className="text-light/80">%</span>
                                    </div>
                                    <span>
                                        {isPriceListLoading ? (
                                            <span className="flex items-center gap-1 text-light/60">
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                        ) : (
                                            formatCurrency(taxAmount)
                                        )}
                                    </span>
                                </div>
                                <div className="border-t border-light/30 pt-3 flex justify-between text-xl font-bold text-light">
                                    <span>Total:</span>
                                    <span>
                                        {isPriceListLoading ? (
                                            <span className="flex items-center gap-1 text-light/60">
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                        ) : (
                                            formatCurrency(total)
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notes */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <h3 className="text-lg font-semibold text-light mb-3">Terms & Conditions</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Terms and conditions, payment terms, validity period, etc..."
                            className="w-full bg-transparent border border-light/30 rounded-lg p-3 text-light min-h-24 resize-y"
                        />
                    </section>
                </div>
            </main>
        </main>
    );
};

const Quotation = ({ pro, updateData }) => {
    return (
        <ErrorBoundary>
            <QuotationComponent pro={pro} updateData={updateData} />
        </ErrorBoundary>
    );
};

export default Quotation;
