import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useToast } from '../components/micro-components/ToastContext';
import { ErrorBoundary, PDFInvoice } from "../components";
import { pdf } from '@react-pdf/renderer';
import { useHasPermission } from '../hook';

const InvoiceComponent = ({ pro: initialPro, updateData }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const canAccessFinance = useHasPermission("finance");
    const [pro, setPro] = useState(initialPro || {});
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState([]);
    const [invoiceNumber, setInvoiceNumber] = useState(initialPro?.invoice?.invoiceNumber || "");
    const [invoiceDate, setInvoiceDate] = useState(initialPro?.invoice?.invoiceDate || new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(initialPro?.invoice?.dueDate || "");
    const [taxRate, setTaxRate] = useState(initialPro?.invoice?.taxRate || 11); // Default 11% VAT
    const [notes, setNotes] = useState(initialPro?.invoice?.notes || "");

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

    // Initialize days and invoice data from project
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

            // Initialize invoice data
            if (initialPro.invoice) {
                setInvoiceNumber(initialPro.invoice.invoiceNumber || "");
                setInvoiceDate(initialPro.invoice.invoiceDate || new Date().toISOString().split('T')[0]);
                setDueDate(initialPro.invoice.dueDate || "");
                setTaxRate(initialPro.invoice.taxRate || 11);
                setNotes(initialPro.invoice.notes || "");
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

    const subtotal = totalExpenses;
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

    const handleSave = async () => {
        if (!updateData) {
            showToast("Save function not available", "error");
            return;
        }

        setLoading(true);
        try {
            const updatedPro = {
                ...pro,
                invoice: {
                    invoiceNumber,
                    invoiceDate,
                    dueDate,
                    taxRate,
                    notes,
                    subtotal,
                    taxAmount,
                    total,
                },
            };
            await updateData(updatedPro);
            setPro(updatedPro);
            showToast("Invoice saved successfully", "success");
        } catch (error) {
            console.error("Error saving invoice:", error);
            showToast("Failed to save invoice", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            const blob = await pdf(
                <PDFInvoice
                    pro={pro}
                    days={days}
                    invoiceNumber={invoiceNumber}
                    invoiceDate={invoiceDate}
                    dueDate={dueDate}
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
            link.download = `Invoice ${invoiceNumber || pro?.title || "Project"}.pdf`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast("Invoice PDF exported successfully", "success");
        } catch (error) {
            console.error("PDF export error:", error);
            showToast("Failed to export PDF", "error");
        }
    };

    return (
        <main className="fixed top-0 left-0 z-40 bg-dark text-light w-full h-screen flex flex-col items-start">
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
                    {/* Invoice Header */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <h1 className="text-3xl font-bold text-light mb-6 tracking-wider">INVOICE</h1>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-light mb-3">Bill To:</h3>
                                <div className="space-y-1 text-light/80">
                                    <p className="font-semibold text-light">{pro?.client || "-"}</p>
                                    <p>PIC: {pro?.pic || "-"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-light/80">Invoice Number:</span>
                                        <input
                                            type="text"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            placeholder="INV-XXXX"
                                            className="bg-transparent border border-light/30 rounded px-2 py-1 text-light text-sm w-40 text-right"
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-light/80">Invoice Date:</span>
                                        <input
                                            type="date"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                            className="bg-transparent border border-light/30 rounded px-2 py-1 text-light text-sm w-40"
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-light/80">Due Date:</span>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
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

                    {/* Expense Summary */}
                    <section className=" p-6 ">
                        {days.map((day, dayIndex) => {
                            const dayTotal = calculateTotalExpenses(day);
                            if (dayTotal === 0) return null;
                            return (
                                <div key={day.id || dayIndex} className="border border-light/20 rounded-lg p-4">
                                    <h2 className="text-xl font-semibold text-light mb-4 tracking-wider">Expense Summary</h2>
                                    <div className="space-y-4">
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

                                        {/* Rent Expenses */}
                                        {day.expense.rent && day.expense.rent.length > 0 && (
                                            <div className="ml-4 mb-2">
                                                <p className="text-xs text-light/60 mb-1">Rent Expenses:</p>
                                                {day.expense.rent.map((item, idx) => (
                                                    <div key={idx} className="text-xs text-light/80 ml-2">
                                                        • {item.name} - Qty: {item.qty} × {formatCurrency(item.price)} = {formatCurrency((item.qty || 0) * (item.price || 0))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Operational Expenses */}
                                        {day.expense.operational && day.expense.operational.length > 0 && (
                                            <div className="ml-4">
                                                <p className="text-xs text-light/60 mb-1">Operational Expenses:</p>
                                                {day.expense.operational.map((item, idx) => (
                                                    <div key={idx} className="text-xs text-light/80 ml-2">
                                                        • {item.name} - Qty: {item.qty} × {formatCurrency(item.price)} = {formatCurrency((item.qty || 0) * (item.price || 0))}
                                                        {item.category && ` (${item.category})`}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {/* Invoice Totals */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <div className="flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between text-light/80">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(subtotal)}</span>
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
                                    <span>{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="border-t border-light/30 pt-3 flex justify-between text-xl font-bold text-light">
                                    <span>Total:</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notes */}
                    <section className="glass p-6 rounded-xl border border-light/50">
                        <h3 className="text-lg font-semibold text-light mb-3">Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional notes or terms..."
                            className="w-full bg-transparent border border-light/30 rounded-lg p-3 text-light min-h-24 resize-y"
                        />
                    </section>
                </div>
            </main>
        </main>
    );
};

const Invoice = ({ pro, updateData }) => {
    return (
        <ErrorBoundary>
            <InvoiceComponent pro={pro} updateData={updateData} />
        </ErrorBoundary>
    );
};

export default Invoice;
