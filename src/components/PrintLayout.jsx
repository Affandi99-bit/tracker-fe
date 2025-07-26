// components/PrintLayout.jsx
import React from "react";

const PrintLayout = ({ pro, days }) => {
    const totalExpenses = days.reduce((acc, d) => acc + (d.totalExpenses || 0), 0);
    const formatCurrency = (num) =>
        `Rp. ${parseFloat(num || 0).toLocaleString("id-ID")}`;

    return (
        <div style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            fontFamily: "Arial, sans-serif",
            fontSize: "10pt",
            color: "#000",
            boxSizing: "border-box",
            backgroundColor: "#fff"
        }}>
            {/* Report Title */}
            <div style={{ margin: "8mm 0 4mm" }}>
                <strong style={{ fontSize: "12pt" }}>Project Report Summary</strong>
            </div>

            {/* Header Information */}
            <table style={{ width: "100%", marginBottom: "6mm" }}>
                <tbody>
                    <tr>
                        <td><strong>Project Title:</strong></td>
                        <td>{pro?.title || "-"}</td>
                        <td><strong>Client:</strong></td>
                        <td>{pro?.client || "-"}</td>
                    </tr>
                    <tr>
                        <td><strong>Start Date:</strong></td>
                        <td>{pro?.start || "-"}</td>
                        <td><strong>Deadline:</strong></td>
                        <td>{pro?.deadline || "-"}</td>
                    </tr>
                    <tr>
                        <td><strong>PIC Client:</strong></td>
                        <td>{pro?.pic || "-"}</td>
                        <td><strong>Total Expenses:</strong></td>
                        <td>{formatCurrency(totalExpenses)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Crew Section */}
            <div style={{ margin: "10mm 0 4mm" }}>
                <strong>Crew</strong>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8mm" }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: "1px solid #000", textAlign: "left" }}>Name</th>
                        <th style={{ borderBottom: "1px solid #000", textAlign: "left" }}>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {days[0]?.crew?.map((c, i) => (
                        <tr key={i}>
                            <td>{c.name}</td>
                            <td>{c.roles?.join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Expenses per Day */}
            <div style={{ margin: "10mm 0 4mm" }}>
                <strong>Detailed Expenses</strong>
            </div>
            {days.map((day, i) => (
                <div key={i} style={{ marginBottom: "8mm", pageBreakInside: "avoid" }}>
                    <div style={{ margin: "5mm 0 3mm" }}>
                        <strong>Day {i + 1}{day.date ? ` - ${day.date}` : ""} {pro?.title ? `for ${pro.title}` : ""}</strong>
                    </div>

                    {/* Rent */}
                    {day.expense.rent.length > 0 && (
                        <>
                            <div style={{ margin: "4mm 0 2mm" }}><strong>Rent Expenses</strong></div>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2mm" }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.expense.rent.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.qty}</td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{formatCurrency(item.qty * item.price)}</td>
                                            <td>{item.note || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Operational */}
                    {day.expense.operational.length > 0 && (
                        <>
                            <div style={{ margin: "4mm 0 2mm" }}><strong>Operational Expenses</strong></div>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2mm" }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <th>Category</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.expense.operational.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.qty}</td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{formatCurrency(item.qty * item.price)}</td>
                                            <td>{item.category || "-"}</td>
                                            <td>{item.note || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Order List */}
                    {day.expense.orderlist.length > 0 && (
                        <>
                            <div style={{ margin: "4mm 0 2mm" }}><strong>Order List Expenses</strong></div>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2mm" }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.expense.orderlist.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.note || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Backup */}
                    {day.backup?.length > 0 && (
                        <>
                            <div style={{ margin: "4mm 0 2mm" }}><strong>Backup</strong></div>
                            <ul style={{ paddingLeft: "1.2em", marginTop: "0" }}>
                                {day.backup.map((b, idx) => (
                                    <li key={idx}>
                                        {b.source} → {b.target}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {/* Day Note */}
                    {day.note && (
                        <>
                            <div style={{ margin: "4mm 0 2mm" }}><strong>Note for Day {i + 1}</strong></div>
                            <p style={{ whiteSpace: "pre-wrap", marginBottom: "2mm" }}>{day.note}</p>
                        </>
                    )}

                    <p><strong>Total for Day {i + 1}:</strong> {formatCurrency(day.totalExpenses)}</p>
                </div>
            ))}

            {/* Final Project Note */}
            {pro.note && (
                <>
                    <div style={{ margin: "10mm 0 2mm" }}><strong>Project Note</strong></div>
                    <p style={{ whiteSpace: "pre-wrap" }}>{pro.note}</p>
                </>
            )}
        </div>
    );
};

export default PrintLayout;
