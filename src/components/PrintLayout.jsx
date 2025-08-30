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

    // Check if there are any images in the project
    const hasAnyImages = days.some(day => Array.isArray(day.images) && day.images.length > 0);

    return (
        <div style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "10mm",
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
                    alignItems: "end",
                    justifyContent: "start",
                    borderBottom: "1px solid #000",
                    paddingBottom: "4mm",
                    marginBottom: "4mm",
                    gap: "10mm", // space between image and text
                }}
            >
                {/* Left Image */}
                <img
                    src="/logoalt.webp"
                    alt="Logo"
                    style={{
                        width: "20mm",
                        height: "auto",
                        objectFit: "contain",
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
                        BERITA ACARA</h1>
                    <p style={{ fontSize: "12pt", margin: "0", color: "#000", paddingBottom: "2mm" }}>
                        {pro?.title || "Untitled Project"}
                    </p>
                    <p style={{ fontSize: "7pt", margin: "0", color: "#000" }}>CV. Kreasi Rumah Hitam | Jl. Suropati Gang 9 Desa Pesanggrahan, Kota Batu | Telp. +62 811-3577-793 | Email: blackstudio.id@gmail.com</p>
                </div>
            </div>

            {/* Project Information */}
            <div style={{ marginBottom: "4mm" }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "7pt"
                }}>
                <tbody>
                    <tr>
                            <td style={{
                                width: "25%",
                                padding: "2mm",
                                fontWeight: "bold",
                            }}>
                                Project Title
                            </td>
                            <td style={{ padding: "2mm", borderBottom: ".5px solid #000" }}>
                                {pro?.title || "-"}
                            </td>
                            <td style={{
                                width: "25%",
                                padding: "2mm",
                                fontWeight: "bold",
                            }}>
                                Client
                            </td>
                            <td style={{ padding: "2mm", borderBottom: ".5px solid #000" }}>
                                {pro?.client || "-"}
                            </td>
                    </tr>
                    <tr>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                            }}>
                                PIC Client
                            </td>
                            <td style={{ padding: "2mm", borderBottom: ".5px solid #000" }}>
                                {pro?.pic || "-"}
                            </td>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                            }}>
                                Event Date
                            </td>
                            <td style={{ padding: "2mm", borderBottom: ".5px solid #000" }}>
                                {formatDate(pro?.deadline)}
                            </td>
                    </tr>
                    <tr>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                            }}>
                                Project Categories
                            </td>
                            <td style={{ padding: "2mm", borderBottom: ".5px solid #000" }}>
                                {pro?.categories?.join(", ") || "-"}
                            </td>
                            <td style={{
                                padding: "2mm",
                                fontWeight: "bold",
                            }}>
                                Project Types
                            </td>
                            <td style={{ padding: "2mm", borderBottom: ".5px solid #000" }}>
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
                        fontSize: "10pt",
                        margin: "0 0 4mm 0",
                        color: "#000",
                        borderBottom: ".5px solid #000",
                        paddingBottom: "1mm"
                    }}>
                        Crew Assignment
                    </h2>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: ".5px solid #000"
                    }}>
                <thead>
                            <tr style={{ backgroundColor: "#000", fontSize: "9pt" }}>
                                <th style={{
                                    border: "1px solid #000",
                                    padding: "1mm",
                                    textAlign: "left",
                                    fontWeight: "bold",
                                    color: "#fff"
                                }}>
                                    Name
                                </th>
                                <th style={{
                                    border: "1px solid #000",
                                    padding: "1mm",
                                    textAlign: "left",
                                    fontWeight: "bold",
                                    color: "#fff"
                                }}>
                                    Roles
                                </th>
                    </tr>
                </thead>
                <tbody>
                            {firstCrewDay.crew.map((member, index) => (
                                <tr key={index}>
                                    <td style={{
                                        border: "1px solid rgba(0, 0, 0, 0.5)",
                                        padding: "2mm",
                                        fontWeight: "500",
                                        fontSize: "7pt"
                                    }}>
                                        {member.name}
                                    </td>
                                    <td style={{
                                        border: "1px solid rgba(0, 0, 0, 0.5)",
                                        padding: "2mm",
                                        fontSize: "7pt"
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
            <div style={{ marginBottom: "4mm" }}>
                <h2 style={{
                    fontSize: "10pt",
                    margin: "0 0 2mm 0",
                    color: "#000",
                    borderBottom: "1px solid #000",
                    paddingBottom: "2mm"
                }}>
                    Daily Expenses Breakdown
                </h2>

                {days.map((day, dayIndex) => (
                    <div key={dayIndex} style={{
                        marginBottom: "3mm",
                        pageBreakInside: "avoid",
                        border: "1px solid #000",
                        padding: "2mm",
                        backgroundColor: "#fff"
                    }}>
                        <h3 style={{
                            fontSize: "9pt",
                            margin: "0 0 1.5mm 0",
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
                                    fontSize: "9pt",
                                    margin: "0 0 1mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Rent Expenses
                                </h4>
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "7pt"
                                }}>
                                <thead>
                                        <tr style={{ backgroundColor: "#000" }}>
                                            <th style={{
                                                border: ".5px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Item</th>
                                            <th style={{
                                                border: ".5px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Qty</th>
                                            <th style={{
                                                border: ".5px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Price</th>
                                            <th style={{
                                                border: ".5px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Total</th>
                                            <th style={{
                                                border: ".5px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
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
                                                    fontSize: "7pt",
                                                    padding: "1.5mm"
                                                }}>
                                                    {item.name || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    fontSize: "7pt",
                                                    padding: "1.5mm",
                                                    textAlign: "left"
                                                }}>
                                                    {item.qty || "0"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    fontSize: "7pt",
                                                    padding: "1.5mm",
                                                    textAlign: "left"
                                                }}>
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    fontSize: "7pt",
                                                    padding: "1.5mm",
                                                    textAlign: "left",
                                                    fontWeight: "bold"
                                                }}>
                                                    {formatCurrency((item.qty || 0) * (item.price || 0))}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    fontSize: "7pt",
                                                    padding: "1.5mm"
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
                            <div style={{ marginBottom: "2mm" }}>
                                <h4 style={{
                                    fontSize: "9pt",
                                    margin: "0 0 1mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Operational Expenses
                                </h4>
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "7pt"
                                }}>
                                <thead>
                                        <tr style={{ backgroundColor: "#000" }}>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "1.5mm",
                                                color: "#fff",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Item</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "1.5mm",
                                                color: "#fff",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Qty</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "1.5mm",
                                                color: "#fff",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Price</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "1.5mm",
                                                color: "#fff",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Total</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "1.5mm",
                                                color: "#fff",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Category</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                padding: "1.5mm",
                                                color: "#fff",
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
                                                    padding: "1.5mm"
                                                }}>
                                                    {item.name || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm",
                                                    textAlign: "left"
                                                }}>
                                                    {item.qty || "0"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm",
                                                    textAlign: "left"
                                                }}>
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm",
                                                    textAlign: "left",
                                                    fontWeight: "bold"
                                                }}>
                                                    {formatCurrency((item.qty || 0) * (item.price || 0))}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm"
                                                }}>
                                                    {item.category || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm"
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
                            <div style={{ marginBottom: "2mm" }}>
                                <h4 style={{
                                    fontSize: "9pt",
                                    margin: "0 0 1mm 0",
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
                                        <tr style={{ backgroundColor: "#000" }}>
                                            <th style={{
                                                border: "1px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Item</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
                                                textAlign: "left",
                                                fontWeight: "bold"
                                            }}>Qty</th>
                                            <th style={{
                                                border: "1px solid #000",
                                                color: "#fff",
                                                padding: "1.5mm",
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
                                                    padding: "1.5mm"
                                                }}>
                                                    {item.name || "-"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm",
                                                    textAlign: "left"
                                                }}>
                                                    {item.qty || "0"}
                                                </td>
                                                <td style={{
                                                    border: "1px solid #000",
                                                    padding: "1.5mm"
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
                            <div style={{ marginBottom: "2mm" }}>
                                <h4 style={{
                                    fontSize: "9pt",
                                    margin: "0 0 1mm 0",
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
                                        <li key={idx} style={{ marginBottom: "1mm", fontSize: "7pt" }}>
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
                                    fontSize: "9pt",
                                    margin: "0 0 2mm 0",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}>
                                    Day Note
                                </h4>
                                <p style={{
                                    margin: "0",
                                    padding: "1mm",
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
                            padding: "1.5mm",
                            backgroundColor: "#fff",
                        }}>
                            <strong style={{ fontSize: "9pt", color: "#000" }}>
                                {getDayLabel(day)} Total: {formatCurrency(calculateDayTotal(day))}
                            </strong>
                        </div>
                </div>
            ))}
            </div>

            {/* Project Summary */}
            <div style={{
                marginTop: "4mm",
                padding: "2mm",
                backgroundColor: "#fff",
                border: "1px solid #000"
            }}>
                <h2 style={{
                    fontSize: "10pt",
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
                                padding: "1mm",
                                fontWeight: "bold",
                                fontSize: "9pt"
                            }}>
                                Total Project Expenses:
                            </td>
                            <td style={{
                                padding: "1.5mm",
                                textAlign: "right",
                                fontSize: "10pt",
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
                    marginTop: "3mm",
                    padding: "2mm",
                    backgroundColor: "#fff",
                    border: "1px solid #000"
                }}>
                    <h3 style={{
                        fontSize: "9pt",
                        margin: "0 0 1.5mm 0",
                        color: "#000",
                        borderBottom: "1px solid #000",
                        paddingBottom: "1mm"
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

            {/* Images Section - All images organized by day */}
            {hasAnyImages && (
                <div style={{
                    marginTop: "6mm",
                    pageBreakBefore: "always"
                }}>
                    <h2 style={{
                        fontSize: "12pt",
                        margin: "0 0 4mm 0",
                        color: "#000",
                        textAlign: "center",
                        borderBottom: "2px solid #000",
                        paddingBottom: "2mm"
                    }}>
                        Project Documentation Images
                    </h2>
                    
                    {days.map((day, dayIndex) => {
                        if (!Array.isArray(day.images) || day.images.length === 0) return null;
                        
                        return (
                            <div key={dayIndex} style={{
                                marginBottom: "6mm",
                                pageBreakInside: "avoid"
                            }}>
                                <h3 style={{
                                    fontSize: "10pt",
                                    margin: "0 0 3mm 0",
                                    color: "#000",
                                    borderBottom: "1px solid #000",
                                    paddingBottom: "1mm",
                                    fontWeight: "bold"
                                }}>
                                    {getDayLabel(day)}{day.date ? ` - ${formatDate(day.date)}` : ""}
                                </h3>
                                
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: "2mm",
                                    marginBottom: "2mm"
                                }}>
                                    {day.images.map((src, imgIdx) => (
                                        <div key={imgIdx} style={{
                                            width: "100%",
                                            minHeight: "40mm",
                                            border: "1px solid #ccc",
                                            borderRadius: "2mm",
                                            overflow: "hidden",
                                            backgroundColor: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <img
                                                src={src}
                                                alt={`${getDayLabel(day)} - Image ${imgIdx + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    maxWidth: "100%",
                                                    maxHeight: "100%"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                <p style={{
                                    fontSize: "8pt",
                                    color: "#666",
                                    textAlign: "center",
                                    margin: "1mm 0",
                                    fontStyle: "italic"
                                }}>
                                    {day.images.length} image{day.images.length !== 1 ? 's' : ''} from {getDayLabel(day)}
                                </p>
                            </div>
                        );
                    })}
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
