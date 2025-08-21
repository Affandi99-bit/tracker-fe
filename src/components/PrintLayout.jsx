// components/PrintLayout.jsx
import React from "react";

const PrintLayout = ({ pro, days }) => {
    const totalExpenses = days.reduce((acc, d) => acc + (d.totalExpenses || 0), 0);
    const formatCurrency = (num) => {
        if (!num || isNaN(num)) return "Rp. 0";
        return `Rp. ${parseFloat(num).toLocaleString("id-ID")}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    const calculateDayTotal = (day) => {
        const rentTotal = day.expense.rent.reduce((acc, item) =>
            acc + (parseFloat(item.price || 0) * parseInt(item.qty || 0)), 0
        );
        const operationalTotal = day.expense.operational.reduce((acc, item) =>
            acc + (parseFloat(item.price || 0) * parseInt(item.qty || 0)), 0
        );
        return rentTotal + operationalTotal;
    };

    const getDayLabel = (day) => {
        if (day.isPreProd) return "Pre-Production";
        if (day.isPostProd) return "Post-Production";
        return `Day ${day.dayNumber || '-'}`;
    };

    // Find the first day that actually has crew (pre/post may not have crew)
    const firstCrewDay = Array.isArray(days)
        ? (days.find(d => !d.isPreProd && !d.isPostProd && Array.isArray(d.crew) && d.crew.length > 0)
            || days.find(d => Array.isArray(d.crew) && d.crew.length > 0))
        : null;

    return (
        <div style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            fontFamily: "Arial, sans-serif",
            fontSize: "10pt",
            color: "#000",
            boxSizing: "border-box",
            backgroundColor: "#fff",
            lineHeight: "1.4"
        }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    borderBottom: "2px solid #000",
                    paddingBottom: "5mm",
                    marginBottom: "8mm",
                    gap: "10mm", // space between image and text
                }}
            >
                {/* Left Image */}
                <img
                    src="/logoalt.webp"
                    alt="Logo"
                    style={{
                        width: "40mm",
                        height: "auto",
                        objectFit: "contain",
                        filter: "invert(1)",
                    }}
                />

                {/* Text Content */}
                <div>
                    <h1
                        style={{
                            fontSize: "18pt",
                            margin: "0 0 2mm 0",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        PROJECT REPORT
                    </h1>
                    <p style={{ fontSize: "12pt", margin: "0", color: "#000" }}>
                        {pro?.title || "Untitled Project"}
                    </p>
                </div>
            </div>

            {/* Project Information */}
            <div style={{ marginBottom: "8mm" }}>
                <h2 style={{
                    fontSize: "14pt",
                    margin: "0 0 4mm 0",
                    color: "#000",
                    borderBottom: "1px solid #000",
                    paddingBottom: "2mm"
                }}>
                    Project Details
                </h2>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "10pt"
                }}>
                    <tbody>
                        <tr>
                            <td style={{
                                width: "25%",
                                padding: "2mm",
                                fontWeight: "bold",
                                backgroundColor: "#fff"
                            }}>
                                Project Title
                            </td>
                            <td style={{ padding: "2mm", borderBottom: "1px solid #000" }}>
                                {pro?.title || "-"}
                            </td>
                            <td style={{
                                width: "25%",
                                padding: "2mm",
                                fontWeight: "bold",
                                backgroundColor: "#fff"
                            }}>
                                Client
                            </td>
                            <td style={{ padding: "2mm", borderBottom: "1px solid #000" }}>
                                {pro?.client || "-"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                                backgroundColor: "#fff"
                            }}>
                                PIC Client
                            </td>
                            <td style={{ padding: "2mm", borderBottom: "1px solid #000" }}>
                                {pro?.pic || "-"}
                            </td>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                                backgroundColor: "#fff"
                            }}>
                                Event Date
                            </td>
                            <td style={{ padding: "2mm", borderBottom: "1px solid #000" }}>
                                {formatDate(pro?.deadline)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                                backgroundColor: "#fff"
                            }}>
                                Project Categories
                            </td>
                            <td style={{ padding: "2mm", borderBottom: "1px solid #000" }}>
                                {pro?.categories?.join(", ") || "-"}
                            </td>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                                backgroundColor: "#fff"
                            }}>
                                Project Types
                            </td>
                            <td style={{ padding: "2mm", borderBottom: "1px solid #000" }}>
                                {pro?.type?.join(", ") || "-"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Crew Information */}
            {firstCrewDay?.crew && firstCrewDay.crew.length > 0 && (
                <div style={{ marginBottom: "8mm" }}>
                    <h2 style={{
                        fontSize: "14pt",
                        margin: "0 0 4mm 0",
                        color: "#000",
                        borderBottom: "1px solid #000",
                        paddingBottom: "2mm"
                    }}>
                        Crew Assignment
                    </h2>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #000"
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fff" }}>
                                <th style={{
                                    border: "1px solid #000",
                                    padding: "3mm",
                                    textAlign: "left",
                                    fontWeight: "bold"
                                }}>
                                    Name
                                </th>
                                <th style={{
                                    border: "1px solid #000",
                                    padding: "3mm",
                                    textAlign: "left",
                                    fontWeight: "bold"
                                }}>
                                    Roles
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {firstCrewDay.crew.map((member, index) => (
                                <tr key={index}>
                                    <td style={{
                                        border: "1px solid #000",
                                        padding: "3mm",
                                        fontWeight: "500"
                                    }}>
                                        {member.name}
                                    </td>
                                    <td style={{
                                        border: "1px solid #000",
                                        padding: "3mm"
                                    }}>
                                        {member.roles?.join(", ") || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Daily Expenses */}
            <div style={{ marginBottom: "8mm" }}>
                <h2 style={{
                    fontSize: "14pt",
                    margin: "0 0 4mm 0",
                    color: "#000",
                    borderBottom: "1px solid #000",
                    paddingBottom: "2mm"
                }}>
                    Daily Expenses Breakdown
                </h2>

                {days.map((day, dayIndex) => (
                    <div key={dayIndex} style={{
                        marginBottom: "6mm",
                        pageBreakInside: "avoid",
                        border: "1px solid #000",
                        // borderRadius: "3mm",
                        padding: "4mm",
                        backgroundColor: "#fff"
                    }}>
                        <h3 style={{
                            fontSize: "12pt",
                            margin: "0 0 3mm 0",
                            color: "#000",
                            borderBottom: "1px solid #000",
                            paddingBottom: "2mm"
                        }}>
                            {getDayLabel(day)}{day.date ? ` - ${formatDate(day.date)}` : ""}
                        </h3>

                        {/* Rent Expenses */}
                        {day.expense.rent && day.expense.rent.length > 0 && (
                            <div style={{ marginBottom: "4mm" }}>
                                <h4 style={{
                                    fontSize: "11pt",
                                    margin: "0 0 2mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Rent Expenses
                                </h4>
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "9pt"
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#fff" }}>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Item</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "center",
                                                fontWeight: "bold"
                                            }}>Qty</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "right",
                                                fontWeight: "bold"
                                            }}>Price</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "right",
                                                fontWeight: "bold"
                                            }}>Total</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.expense.rent.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.name || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "center"
                                                }}>
                                                    {item.qty || "0"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "right"
                                                }}>
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "right",
                                                    fontWeight: "bold"
                                                }}>
                                                    {formatCurrency((item.qty || 0) * (item.price || 0))}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.note || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Operational Expenses */}
                        {day.expense.operational && day.expense.operational.length > 0 && (
                            <div style={{ marginBottom: "4mm" }}>
                                <h4 style={{
                                    fontSize: "11pt",
                                    margin: "0 0 2mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Operational Expenses
                                </h4>
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "9pt"
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#fff" }}>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Item</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "center",
                                                fontWeight: "bold"
                                            }}>Qty</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "right",
                                                fontWeight: "bold"
                                            }}>Price</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "right",
                                                fontWeight: "bold"
                                            }}>Total</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Category</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.expense.operational.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.name || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "center"
                                                }}>
                                                    {item.qty || "0"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "right"
                                                }}>
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "right",
                                                    fontWeight: "bold"
                                                }}>
                                                    {formatCurrency((item.qty || 0) * (item.price || 0))}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.category || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.note || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Order List */}
                        {day.expense.orderlist && day.expense.orderlist.length > 0 && (
                            <div style={{ marginBottom: "4mm" }}>
                                <h4 style={{
                                    fontSize: "11pt",
                                    margin: "0 0 2mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Order List
                                </h4>
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "9pt"
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#fff" }}>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Item</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "center",
                                                fontWeight: "bold"
                                            }}>Qty</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "2mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.expense.orderlist.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.name || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm",
                                                    textAlign: "center"
                                                }}>
                                                    {item.qty || "0"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "2mm"
                                                }}>
                                                    {item.note || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Backup Information */}
                        {day.backup && day.backup.length > 0 && (
                            <div style={{ marginBottom: "4mm" }}>
                                <h4 style={{
                                    fontSize: "11pt",
                                    margin: "0 0 2mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Backup Operations
                                </h4>
                                <ul style={{
                                    margin: "0",
                                    paddingLeft: "6mm",
                                    listStyleType: "disc"
                                }}>
                                    {day.backup.map((backup, idx) => (
                                        <li key={idx} style={{ marginBottom: "1mm" }}>
                                            <strong>{backup.source || "Unknown"}</strong> → {backup.target || "Unknown"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Day Note */}
                        {day.note && (
                            <div style={{ marginBottom: "4mm" }}>
                                <h4 style={{
                                    fontSize: "11pt",
                                    margin: "0 0 2mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Day Note
                                </h4>
                                <p style={{
                                    margin: "0",
                                    padding: "2mm",
                                    backgroundColor: "#f8f8f8",
                                    borderRadius: "2mm",
                                    border: "1px solid #ddd"
                                }}>
                                    {day.note}
                                </p>
                            </div>
                        )}

                        {/* Day Total */}
                        <div style={{
                            textAlign: "right",
                            padding: "3mm",
                            backgroundColor: "#fff",
                            // borderRadius: "2mm",
                            border: "1px solid #000"
                        }}>
                            <strong style={{ fontSize: "11pt", color: "#000" }}>
                                {getDayLabel(day)} Total: {formatCurrency(calculateDayTotal(day))}
                            </strong>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Summary */}
            <div style={{
                marginTop: "8mm",
                padding: "4mm",
                backgroundColor: "#fff",
                // borderRadius: "3mm",
                border: "2px solid #000"
            }}>
                <h2 style={{
                    fontSize: "14pt",
                    margin: "0 0 3mm 0",
                    color: "#000",
                    textAlign: "center"
                }}>
                    Project Summary
                </h2>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}>
                    <tbody>
                        <tr>
                            <td style={{
                                padding: "3mm",
                                fontWeight: "bold",
                                fontSize: "11pt"
                            }}>
                                Total Project Expenses:
                            </td>
                            <td style={{
                                padding: "3mm",
                                textAlign: "right",
                                fontSize: "14pt",
                                fontWeight: "bold",
                                color: "#000"
                            }}>
                                {formatCurrency(totalExpenses)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Project Note */}
            {pro.note && (
                <div style={{
                    marginTop: "6mm",
                    padding: "4mm",
                    backgroundColor: "#fff",
                    // borderRadius: "3mm",
                    border: "1px solid #000"
                }}>
                    <h3 style={{
                        fontSize: "12pt",
                        margin: "0 0 3mm 0",
                        color: "#000",
                        borderBottom: "1px solid #000",
                        paddingBottom: "2mm"
                    }}>
                        Project Notes
                    </h3>
                    <p style={{
                        margin: "0",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.5"
                    }}>
                        {pro.note}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div style={{
                marginTop: "10mm",
                textAlign: "center",
                fontSize: "9pt",
                color: "#000",
                borderTop: "1px solid #000",
                paddingTop: "3mm"
            }}>
                <p style={{ margin: "1mm 0" }}>
                    Report generated on {new Date().toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </p>
                <p style={{ margin: "1mm 0" }}>
                    This is an official project report document
                </p>
            </div>
        </div>
    );
};

export default PrintLayout;
