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
});

const PDFBonus = ({ pro, crewBonuses, bonusCalculation, grossProfit, netProfit, totalExpenses, projectTier, crucialNotes = [] }) => {
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
            <Text style={styles.title}>BONUS CALCULATION</Text>
            <Text style={styles.subtitle}>{pro?.title || "Untitled Project"}</Text>
            <Text style={styles.companyInfo}>
              CV. Kreasi Rumah Hitam | Jl. Suropati Gang 9 Desa Pesanggrahan, Kota Batu | Telp. +62 811-3577-793 | Email: blackstudio.id@gmail.com
            </Text>
          </View>
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
                <Text style={styles.infotitle}>PIC Client</Text>
                <Text style={styles.infodata}>{pro?.pic || "-"}</Text>
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
                <Text style={styles.infotitle}>Freelance Cost</Text>
                <Text style={styles.infodata}>{formatCurrency(pro?.freelance || 0)}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Tier</Text>
                <Text style={styles.infodata}>{projectTier ? projectTier.name : "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bonus Calculation Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Bonus Calculation Summary</Text>
          <View style={styles.summaryRow}>
            <Text>Gross Profit:</Text>
            <Text style={styles.greenText}>{formatCurrency(grossProfit)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Bonus Percentage:</Text>
            <Text>{bonusCalculation?.finalPercentage?.toFixed(2) || 0}%</Text>
          </View>
          {bonusCalculation?.adjusted && (
            <View style={styles.summaryRow}>
              <Text style={styles.amberText}>* Percentage adjusted to meet Weight 8 minimum</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text>Bonus Pool:</Text>
            <Text style={styles.blueText}>{formatCurrency(bonusCalculation?.bonusPool || 0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Bonus:</Text>
            <Text style={styles.blueText}>{formatCurrency(crewBonuses?.totalBonus || 0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Uang Lembur:</Text>
            <Text style={styles.blueText}>{formatCurrency(crewBonuses?.totalOvertime || 0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Net Profit:</Text>
            <Text style={styles.greenText}>{formatCurrency(netProfit)}</Text>
          </View>
        </View>

        {/* Crucial Notes */}
        {crucialNotes && crucialNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Important Notes</Text>
            {crucialNotes.map((note, index) => (
              <View
                key={index}
                style={{
                  padding: 8,
                  marginBottom: 5,
                  borderLeft: '3px solid',
                  borderLeftColor:
                    note.type === 'critical'
                      ? '#ef4444'
                      : note.type === 'warning'
                        ? '#f59e0b'
                        : '#3b82f6',
                  backgroundColor:
                    note.type === 'critical'
                      ? '#fee2e2'
                      : note.type === 'warning'
                        ? '#fef3c7'
                        : '#dbeafe',
                }}
              >
                <Text
                  style={{
                    fontSize: 7,
                    color:
                      note.type === 'critical'
                        ? '#991b1b'
                        : note.type === 'warning'
                          ? '#92400e'
                          : '#1e40af',
                  }}
                >
                  {note.message}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Crew Bonus Details */}
        {crewBonuses?.crewBonuses && crewBonuses.crewBonuses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crew Bonus Details</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Roles</Text>
                <Text style={styles.tableCellHeader}>Base Bonus</Text>
                <Text style={styles.tableCellHeader}>Overtime</Text>
                <Text style={styles.tableCellHeader}>Total</Text>
              </View>
              {crewBonuses.crewBonuses.map((crew, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{crew.name || "-"}</Text>
                  <Text style={styles.tableCell}>{crew.roles?.join(", ") || "-"}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(crew.totalBonus || 0)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(crew.totalOvertime || 0)}</Text>
                  <Text style={[styles.tableCell, styles.highlight]}>
                    {formatCurrency((crew.totalBonus || 0) + (crew.totalOvertime || 0))}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Role Bonuses */}
        {crewBonuses?.crewBonuses && crewBonuses.crewBonuses.some(cb => cb.roleBonuses && cb.roleBonuses.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Role Bonus Breakdown</Text>
            {crewBonuses.crewBonuses.map((crew, crewIndex) => {
              if (!crew.roleBonuses || crew.roleBonuses.length === 0) return null;

              return (
                <View key={crewIndex} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>
                    {crew.name}
                  </Text>
                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={styles.tableCellHeader}>Role</Text>
                      <Text style={styles.tableCellHeader}>Bonus</Text>
                    </View>
                    {crew.roleBonuses.map((rb, rbIndex) => (
                      <View key={rbIndex} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{rb.role}</Text>
                        <Text style={styles.tableCell}>{formatCurrency(rb.bonus)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Overtime Details */}
        {crewBonuses?.crewBonuses && crewBonuses.crewBonuses.some(cb => cb.overtimeDetails && cb.overtimeDetails.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overtime Details</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Job</Text>
                <Text style={styles.tableCellHeader}>Hours</Text>
                <Text style={styles.tableCellHeader}>Base Bonus</Text>
                <Text style={styles.tableCellHeader}>Overtime Bonus</Text>
              </View>
              {crewBonuses.crewBonuses.flatMap((crew, crewIndex) =>
                (crew.overtimeDetails || []).map((ot, otIndex) => (
                  <View key={`${crewIndex}-${otIndex}`} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{crew.name}</Text>
                    <Text style={styles.tableCell}>{ot.job}</Text>
                    <Text style={styles.tableCell}>{ot.hours}h</Text>
                    <Text style={styles.tableCell}>{formatCurrency(ot.baseBonus)}</Text>
                    <Text style={styles.tableCell}>{formatCurrency(ot.overtimeBonus)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Report generated on {new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
          <Text>This is an official bonus calculation document</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFBonus;
