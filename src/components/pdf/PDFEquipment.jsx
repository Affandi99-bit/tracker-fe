import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfB.ttf', fontWeight: 'bold' },
    ]
});

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        color: '#222',
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    headerwrap: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        borderBottom: '2px solid #222',
        marginBottom: 10
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'start',
        justifyContent: 'start',
        flex: 1,
    },
    title: {
        color: '#222',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'left',
    },
    subtitle: {
        color: '#222',
        fontSize: 10,
        marginBottom: 2,
        textAlign: 'left',
    },
    companyInfo: {
        fontSize: 6,
        textAlign: 'left',
        color: '#666',
    },
    projectInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'flex-end',
        gap: 5,
    },
    infoRow: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    infoLabel: {
        fontSize: 9,
        color: '#666',
        minWidth: 80,
    },
    infoValue: {
        fontSize: 9,
        color: '#222',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#222',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottom: '1px solid #ddd',
        paddingBottom: 5,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#222',
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        minHeight: 30,
        alignItems: 'center',
    },
    tableRowLast: {
        borderBottomWidth: 0,
    },
    tableHeader: {
        backgroundColor: '#222',
        color: '#fff',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 8,
        fontSize: 9,
    },
    tableCellHeader: {
        padding: 8,
        fontSize: 9,
        color: '#fff',
        fontWeight: 'bold',
    },
    noCell: {
        width: 40,
        textAlign: 'center',
    },
    nameCell: {
        flex: 3,
    },
    qtyCell: {
        width: 60,
        textAlign: 'center',
    },
    noteCell: {
        flex: 2,
    },
    summarySection: {
        marginTop: 20,
        padding: 15,
        border: '1px solid #222',
        backgroundColor: '#f9f9f9',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        fontSize: 10,
    },
    summaryTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTop: '2px solid #222',
        fontSize: 14,
        fontWeight: 'bold',
    },
    notes: {
        marginTop: 30,
        padding: 15,
        border: '1px solid #ddd',
        fontSize: 9,
        color: '#666',
    },
    footer: {
        marginTop: 40,
        paddingTop: 15,
        borderTop: '1px solid #222',
        textAlign: 'center',
        color: '#222',
        fontSize: 8,
    },
    signatureSection: {
        marginTop: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '45%',
        textAlign: 'center',
    },
    signatureLine: {
        borderTop: '1px solid #222',
        marginTop: 60,
        paddingTop: 5,
    },
    signatureLabel: {
        fontSize: 9,
        color: '#666',
        marginBottom: 5,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        fontSize: 9,
    },
    checkbox: {
        width: 12,
        height: 12,
        border: '1px solid #222',
        marginRight: 8,
    },
});

const PDFEquipment = ({ pro, equipment = [], notes = '' }) => {
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

    // Calculate total items
    const totalItems = equipment.reduce((acc, item) => acc + (parseInt(item.qty) || 1), 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerwrap}>
                    <View style={styles.header}>
                        <View style={{ width: 50, height: 50, marginBottom: 10 }}>
                            <Image
                                src={'/logo.png'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </View>
                        <View style={styles.section}>

                            <Text style={styles.title}>EQUIPMENT LIST</Text>
                            <Text style={styles.subtitle}>{pro?.title || "Untitled Project"}</Text>
                            <Text style={styles.companyInfo}>
                                CV. Kreasi Rumah Hitam | Jl. Suropati Gang 9 Desa Pesanggrahan, Kota Batu | Telp. +62 811-3577-793 | Email: blackstudio.id@gmail.com
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Project Information */}
                <View style={styles.section}>
                    <View style={styles.projectInfo}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Client:</Text>
                            <Text style={styles.infoValue}>{pro?.client || "-"}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>PIC:</Text>
                            <Text style={styles.infoValue}>{pro?.pic || "-"}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Start Date:</Text>
                            <Text style={styles.infoValue}>{formatDate(pro?.start)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Deadline:</Text>
                            <Text style={styles.infoValue}>{formatDate(pro?.deadline)}</Text>
                        </View>
                    </View>
                    <Text style={styles.sectionTitle}>Project Information</Text>
                    <View style={{ fontSize: 9, lineHeight: 1.8 }}>
                        <Text>Project Title: {pro?.title || "-"}</Text>
                        <Text>Categories: {pro?.categories?.join(", ") || "-"}</Text>
                        <Text>Types: {pro?.type?.join(", ") || "-"}</Text>
                    </View>
                </View>

                {/* Equipment Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Equipment Checklist</Text>
                    {equipment.length > 0 ? (
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableCellHeader, styles.noCell]}>No.</Text>
                                <Text style={[styles.tableCellHeader, styles.nameCell]}>Equipment Name</Text>
                                <Text style={[styles.tableCellHeader, styles.qtyCell]}>Qty</Text>
                                <Text style={[styles.tableCellHeader, styles.noteCell]}>Note</Text>
                                <Text style={[styles.tableCellHeader, styles.qtyCell]}>Check</Text>
                            </View>
                            {equipment.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.tableRow,
                                        index === equipment.length - 1 ? styles.tableRowLast : {}
                                    ]}
                                >
                                    <Text style={[styles.tableCell, styles.noCell]}>{index + 1}</Text>
                                    <Text style={[styles.tableCell, styles.nameCell]}>{item.name || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.qtyCell]}>{item.qty || 1}</Text>
                                    <Text style={[styles.tableCell, styles.noteCell]}>{item.note || "-"}</Text>
                                    <View style={[styles.tableCell, styles.qtyCell, { alignItems: 'center' }]}>
                                        <View style={styles.checkbox} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 9, color: '#666', fontStyle: 'italic' }}>
                            No equipment selected for this project.
                        </Text>
                    )}
                </View>

                {/* Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text>Total Equipment Types:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{equipment.length} items</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>Total Quantity:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{totalItems} pcs</Text>
                    </View>
                </View>

                {/* Notes */}
                {notes && (
                    <View style={styles.notes}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notes:</Text>
                        <Text>{notes}</Text>
                    </View>
                )}

                {/* Signature Section */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>Prepared By</Text>
                        <View style={styles.signatureLine}>
                            <Text style={{ fontSize: 9 }}>Checker Keluar</Text>
                        </View>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>Received By</Text>
                        <View style={styles.signatureLine}>
                            <Text style={{ fontSize: 9 }}>Checker Kembali</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Please check all equipment before and after use.
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                        Equipment list generated on {new Date().toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default PDFEquipment;

