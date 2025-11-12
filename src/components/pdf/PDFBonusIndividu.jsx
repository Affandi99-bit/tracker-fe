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

// Create styles (using PDFDocument as reference)
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 10,
        color: '#222',
        fontSize: 8,
        fontFamily: 'Helvetica',
    },
    headerwrap: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 15,
        width: '100%',
        borderBottom: '1px solid #222',
        marginBottom: 20,
        paddingBottom: 8,
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'start',
        justifyContent: 'start',
    },
    title: {
        color: '#222',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'left',
    },
    subtitle: {
        color: '#222',
        fontSize: 10,
        marginBottom: 3,
        textAlign: 'left',
    },
    companyInfo: {
        fontSize: 7,
        textAlign: 'left',
        color: '#666',
    },
    infocontainer: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: '',
    },
    infotitle: {
        width: '50%',
        marginBottom: 3,
        fontSize: 8,
        textAlign: 'left',
        color: '#000',
    },
    infodata: {
        width: '50%',
        fontSize: 7,
        textAlign: 'left',
        color: '#666',
    },
    section: {
        marginBottom: 13,
    },
    sectionTitle: {
        color: '#222',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 6,
        paddingBottom: 2,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#222',
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: .3,
        borderBottomColor: '#222',
        minHeight: 25,
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#222',
        color: '#fff',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 3,
        flex: 1,
    },
    tableCellHeader: {
        padding: 3,
        flex: 1,
        color: '#fff',
    },
    summaryBox: {
        border: '1px solid #222',
        padding: 8,
        marginTop: 10,
    },
    summaryTitle: {
        color: '#222',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    footer: {
        marginTop: 15,
        paddingTop: 8,
        borderTop: '1px solid #222',
        textAlign: 'center',
        color: '#222',
        fontSize: 7,
    },
    highlight: {
        fontWeight: 'bold',
        color: '#222',
    },
    greenText: {
        color: '#22c55e',
        fontWeight: 'bold',
    },
    blueText: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    amberText: {
        color: '#f59e0b',
        fontWeight: 'bold',
    },
    nameHighlight: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },
});

const PDFBonusIndividu = ({
    pro,
    crewMember,
    crewBonus,
    bonusCalculation,
    grossProfit,
    totalExpenses,
    projectTier
}) => {
    // Helper functions
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

    if (!crewMember || !crewBonus) {
        return null;
    }

    const totalBonus = (crewBonus.totalBonus || 0) + (crewBonus.totalOvertime || 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerwrap}>
                    <View style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image
                            src={'/logo.png'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.title}>INDIVIDUAL BONUS STATEMENT</Text>
                        <Text style={styles.subtitle}>{pro?.title || "Untitled Project"}</Text>
                        <Text style={styles.companyInfo}>
                            CV. Kreasi Rumah Hitam | Jl. Suropati Gang 9 Desa Pesanggrahan, Kota Batu | Telp. +62 811-3577-793 | Email: blackstudio.id@gmail.com
                        </Text>
                    </View>
                </View>

                {/* Crew Member Name - Highlighted */}
                <View style={styles.section}>
                    <Text style={styles.nameHighlight}>{crewMember.name || "Unknown"}</Text>
                </View>

                {/* Project Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Information</Text>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 20,
                        width: '100%'
                    }}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.infocontainer}>
                                <Text style={styles.infotitle}>Project Title</Text>
                                <Text style={styles.infodata}>{pro?.title || "-"}</Text>
                            </View>
                            <View style={styles.infocontainer}>
                                <Text style={styles.infotitle}>Client</Text>
                                <Text style={styles.infodata}>{pro?.client || "-"}</Text>
                            </View>
                            <View style={styles.infocontainer}>
                                <Text style={styles.infotitle}>Project Categories</Text>
                                <Text style={styles.infodata}>{pro?.categories?.join(", ") || "-"}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={styles.infocontainer}>
                                <Text style={styles.infotitle}>Project Budget</Text>
                                <Text style={styles.infodata}>{formatCurrency(pro?.budget || 0)}</Text>
                            </View>
                            <View style={styles.infocontainer}>
                                <Text style={styles.infotitle}>Total Expenses</Text>
                                <Text style={styles.infodata}>{formatCurrency(totalExpenses)}</Text>
                            </View>
                            <View style={styles.infocontainer}>
                                <Text style={styles.infotitle}>Tier</Text>
                                <Text style={styles.infodata}>{projectTier ? projectTier.name : "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Crew Member Roles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Assigned Roles</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCellHeader}>Role</Text>
                        </View>
                        {crewMember.roles && crewMember.roles.length > 0 ? (
                            crewMember.roles.map((role, index) => {
                                return (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{role || "-"}</Text>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>No roles assigned</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Role Bonus Breakdown */}
                {crewBonus.roleBonuses && crewBonus.roleBonuses.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Role Bonus Breakdown</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCellHeader}>Role</Text>
                                <Text style={styles.tableCellHeader}>Bonus Amount</Text>
                            </View>
                            {crewBonus.roleBonuses.map((rb, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{rb.role}</Text>
                                    <Text style={styles.tableCell}>{formatCurrency(rb.bonus)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Overtime Details */}
                {crewBonus.overtimeDetails && crewBonus.overtimeDetails.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Overtime Details</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCellHeader}>Job</Text>
                                <Text style={styles.tableCellHeader}>Hours</Text>
                                <Text style={styles.tableCellHeader}>Base Bonus</Text>
                                <Text style={styles.tableCellHeader}>Overtime Bonus</Text>
                            </View>
                            {crewBonus.overtimeDetails.map((ot, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{ot.job}</Text>
                                    <Text style={styles.tableCell}>{ot.hours}h</Text>
                                    <Text style={styles.tableCell}>{formatCurrency(ot.baseBonus)}</Text>
                                    <Text style={styles.tableCell}>{formatCurrency(ot.overtimeBonus)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Bonus Summary */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Bonus Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text>Base Bonus (from roles):</Text>
                        <Text style={styles.blueText}>{formatCurrency(crewBonus.totalBonus || 0)}</Text>
                    </View>
                    {crewBonus.totalOvertime > 0 && (
                        <View style={styles.summaryRow}>
                            <Text>Overtime Bonus (Uang Lembur):</Text>
                            <Text style={styles.blueText}>{formatCurrency(crewBonus.totalOvertime || 0)}</Text>
                        </View>
                    )}
                    <View style={[styles.summaryRow, { marginTop: 5, paddingTop: 5, borderTop: '1px solid #222' }]}>
                        <Text style={styles.highlight}>Total Bonus:</Text>
                        <Text style={[styles.greenText, styles.highlight]}>{formatCurrency(totalBonus)}</Text>
                    </View>
                </View>

                {/* Project Calculation Context */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Calculation Context</Text>
                    <View style={styles.infocontainer}>
                        <Text style={styles.infotitle}>Gross Profit:</Text>
                        <Text style={styles.infodata}>{formatCurrency(grossProfit)}</Text>
                    </View>
                    <View style={styles.infocontainer}>
                        <Text style={styles.infotitle}>Bonus Percentage:</Text>
                        <Text style={styles.infodata}>{bonusCalculation?.finalPercentage?.toFixed(2) || 0}%</Text>
                    </View>
                    <View style={styles.infocontainer}>
                        <Text style={styles.infotitle}>Bonus Pool:</Text>
                        <Text style={styles.infodata}>{formatCurrency(bonusCalculation?.bonusPool || 0)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Statement generated on {new Date().toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </Text>
                    <Text>This is an official individual bonus statement document</Text>
                </View>
            </Page>
        </Document>
    );
};

export default PDFBonusIndividu;
