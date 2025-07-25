import React from "react";

const currency = (val = 0) =>
    "Rp. " + parseInt(val).toLocaleString("id-ID");

const PrintLayout = ({ pro, days }) => {
    const total = days.reduce((acc, d) => acc + (d.totalExpenses || 0), 0);

    return (
        <div
            id="pdf-content"
            style={{
                padding: "2rem",
                fontFamily: "SF UI Display",
                color: "#000",
                backgroundColor: "#fff",
                width: "100%",
                fontSize: "12px",
            }}
        >
            <main className="w-full">
                <div className="flex items-center justify-start gap-3 w-full">
                    <img src="/logo.webp" alt="Company Logo" className="invert object-contain size-20" />
                    <h1 className="font-bold text-center text-5xl">BERITA ACARA PRODUKSI</h1>
                </div>
                {/* Header */}
                <div className="flex flex-col items-start justify-start">
                    <h2 >{pro?.title}</h2>
                    <p >Client: {pro.client}</p>
                    <p >PIC: {pro.pic}</p>
                </div>
            </main>

            <hr />

            {/* Project Info */}
            <p><strong>Start:</strong> {pro.start}</p>
            <p><strong>Deadline:</strong> {pro.deadline}</p>
            {pro.note && <p><strong>Note:</strong> {pro.note}</p>}

            <hr style={{ margin: "1rem 0" }} />

            {/* Days */}
            {days.map((day, index) => (
                <div key={day.id} style={{ marginBottom: "2rem", pageBreakInside: "avoid" }}>
                    <h3>Day {index + 1} — {day.date || "No Date"}</h3>
                    <p><strong>Template:</strong> {day.template ? "Production" : "Design"}</p>
                    <p><strong>Note:</strong> {day.note || "–"}</p>

                    {/* Crew */}
                    {day.crew?.length > 0 && (
                        <>
                            <h4>Crew</h4>
                            <table width="50%" border="1" cellPadding={4} style={{ borderCollapse: "collapse", marginBottom: "1rem" }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Roles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.crew.map((c, i) => (
                                        <tr key={i}>
                                            <td>{c.name}</td>
                                            <td>{c.roles?.join(", ")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Expenses */}
                    <h4>Expenses</h4>
                    {["rent", "operational", "orderlist"].map((type) =>
                        day.expense?.[type]?.length > 0 ? (
                            <div key={type} style={{ marginBottom: "1rem" }}>
                                <strong>{type.toUpperCase()}</strong>
                                <table width="100%" border="1" cellPadding={4} style={{ borderCollapse: "collapse", marginTop: "0.5rem" }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Note</th>
                                            {type === "operational" && <th>Category</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.expense[type].map((exp, i) => (
                                            <tr key={i}>
                                                <td>{exp.name}</td>
                                                <td>{exp.qty}</td>
                                                <td>{currency(exp.price)}</td>
                                                <td>{exp.note}</td>
                                                {type === "operational" && <td>{exp.category}</td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null
                    )}

                    {/* Backup */}
                    {day.backup?.length > 0 && (
                        <>
                            <h4>Backup</h4>
                            <table width="100%" border="1" cellPadding={4} style={{ borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>Target</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.backup.map((b, i) => (
                                        <tr key={i}>
                                            <td>{b.source}</td>
                                            <td>{b.target}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    <p><strong>Subtotal:</strong> {currency(day.totalExpenses)}</p>
                </div>
            ))}

            <hr />

            {/* Total */}
            <h3>Total Project Expenses: {currency(total || pro.total)}</h3>

            <br /><br /><br />

            {/* Signatures */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                    <p>Project Manager</p>
                    <br /><br />
                    <p style={{ borderTop: "1px solid #000", width: "200px", margin: "0 auto" }}>
                        {
                            days[0]?.crew?.find(c =>
                                Array.isArray(c.roles) &&
                                c.roles.some(r => r.toLowerCase() === "project manager")
                            )?.name || "___________________"
                        }
                    </p>
                </div>
                <div style={{ textAlign: "center" }}>
                    <p>PIC Client</p>
                    <br /><br />
                    <p style={{ borderTop: "1px solid #000", width: "200px", margin: "0 auto" }}>
                        {pro.pic || "___________________"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrintLayout;
