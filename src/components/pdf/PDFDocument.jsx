import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer';

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
    marginBottom: 25,
    paddingBottom: 12,
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
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infotitle: {
    width: '40%',
    fontSize: 8,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold',
  },
  infodata: {
    width: '60%',
    fontSize: 7,
    textAlign: 'left',
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#222',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 4,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: .3,
    borderBottomColor: '#222',
    minHeight: 28,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#222',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 4,
    flex: 1,
  },
  tableCellHeader: {
    padding: 4,
    flex: 1,
    color: '#fff',
  },
  dayHeader: {
    padding: 8,
    marginBottom: 15,
    border: '1px solid #222',
    pageBreakInside: 'avoid',
  },
  dayTitle: {
    color: '#222',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dayDate: {
    fontSize: 7,
    color: '#666',
  },
  expenseSection: {
    marginBottom: 12,
  },
  expenseTitle: {
    color: '#222',
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  noteBox: {
    padding: 8,
    border: '1px solid #ddd',
    marginBottom: 8,
  },
  dayTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 8,
    paddingTop: 6,
    fontSize: 9,
  },
  projectSummary: {
    border: '1px solid #222',
    padding: 12,
    marginTop: 15,
    marginBottom: 20,
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
    marginTop: 25,
    paddingTop: 12,
    borderTop: '1px solid #222',
    textAlign: 'center',
    color: '#222',
    fontSize: 7,
  },
  backupItem: {
    marginBottom: 5,
    color: '#222',
    fontSize: 7,
  },
  imagesSection: {
    marginTop: 13,
    pageBreakBefore: 'always',
  },
  imagesSectionTitle: {
    color: '#222',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    borderBottom: '1px solid #222',
    paddingBottom: 3,
  },
  dayImagesContainer: {
    marginBottom: 20,
    pageBreakInside: 'avoid',
  },
  dayImagesTitle: {
    color: '#222',
    fontSize: 5,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1px solid #222',
    paddingBottom: 3,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
    justifyContent: 'flex-start',
    width: '100%',
  },

  imageContainer: {
    width: 120,
    height: 120,
    border: '1px solid #ccc',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  imageCaption: {
    fontSize: 6, // Slightly increased from 5
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

const PDFDocument = ({ pro, days }) => {
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

  // (Removed normalized overtime formatting; display raw strings instead)

  const getDayLabel = (day, index, total) => {
    if (index === 0) return "Pre-Production";
    if (index === total - 1) return "Post-Production";
    return `Day ${index}`;
  };

  const calculateDayTotal = (day) => {
    if (!day || !day.expense) return 0;
    const rentTotal = (Array.isArray(day.expense.rent) ? day.expense.rent : []).reduce((acc, item) =>
      acc + (parseFloat(item?.price || 0) * parseInt(item?.qty || 0)), 0
    );
    const operationalTotal = (Array.isArray(day.expense.operational) ? day.expense.operational : []).reduce((acc, item) =>
      acc + (parseFloat(item?.price || 0) * parseInt(item?.qty || 0)), 0
    );
    return rentTotal + operationalTotal;
  };

  // Aggregate all crew from all days
  const allCrew = (Array.isArray(days) ? days : [])
    .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
  const groupedByName = allCrew.reduce((acc, member) => {
    if (!member || !member.name) return acc;
    const key = member.name;
    const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
    if (!acc[key]) acc[key] = new Set();
    roles.forEach(r => acc[key].add(r));
    return acc;
  }, {});
  const mergedCrew = Object.entries(groupedByName)
    .map(([name, roleSet]) => ({ name, roles: Array.from(roleSet) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const projectTotal = (Array.isArray(days) ? days : []).reduce((acc, day) => acc + calculateDayTotal(day), 0);

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
            <Text style={styles.title}>BERITA ACARA</Text>
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
                <Text style={styles.infotitle}>Project Manager</Text>
                <Text style={styles.infodata}>
                  {mergedCrew
                    .filter(member => (member.roles || []).some(role => (role || '').toLowerCase() === 'project manager'))
                    .map(member => member.name)
                    .join(', ') || '-'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Event Start</Text>
                <Text style={styles.infodata}>{formatDate(pro?.start)}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Event Deadline</Text>
                <Text style={styles.infodata}>{formatDate(pro?.deadline)}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Project Categories</Text>
                <Text style={styles.infodata}>{pro?.categories?.join(", ") || "-"}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Project Types</Text>
                <Text style={styles.infodata}>{pro?.type?.join(", ") || "-"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Crew Information (grouped by name with comma-separated roles) */}
        {mergedCrew.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Crew Assignment</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Roles</Text>
              </View>
              {mergedCrew.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{member.name || "-"}</Text>
                  <Text style={styles.tableCell}>{member.roles?.join(", ") || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}


        {/* Overtime Section */}
        {(() => {
          // Collect all overtime entries from all days
          const overtimeEntries = [];
          (Array.isArray(days) ? days : []).forEach((day, dayIndex) => {
            if (!day.crew || !Array.isArray(day.crew)) return;
            day.crew.forEach((crewMember, crewIdx) => {
              if (!crewMember.name) return;
              if (Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0) {
                crewMember.overtime.forEach((ot, otIdx) => {
                  // Only include entries that have at least one field filled
                  if (ot.job || ot.date || ot.hour || ot.note) {
                    overtimeEntries.push({
                      name: crewMember.name,
                      job: ot.job || '',
                      date: ot.date || '',
                      hour: ot.hour || '',
                      note: ot.note || '',
                      key: `${dayIndex}-${crewIdx}-${otIdx}`
                    });
                  }
                });
              }
            });
          });

          if (overtimeEntries.length === 0) return null;

          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overtime Hours</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCellHeader}>Name</Text>
                  <Text style={styles.tableCellHeader}>Jobdesk</Text>
                  <Text style={styles.tableCellHeader}>Date</Text>
                  <Text style={styles.tableCellHeader}>Overtime (Hours)</Text>
                  <Text style={styles.tableCellHeader}>Note</Text>
                </View>
                {overtimeEntries.map((entry) => (
                  <View key={entry.key} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{entry.name || '-'}</Text>
                    <Text style={styles.tableCell}>{entry.job || '-'}</Text>
                    <Text style={styles.tableCell}>{entry.date ? formatDate(entry.date) : '-'}</Text>
                    <Text style={styles.tableCell}>{(entry.hour === undefined || entry.hour === null || entry.hour === '') ? '-' : String(entry.hour)}</Text>
                    <Text style={styles.tableCell}>{entry.note || '-'}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })()}

        {/* Project Summary */}
        {(projectTotal > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Summary</Text>

            {/* Daily Expenses Summary */}
            {(Array.isArray(days) ? days : []).some(day => calculateDayTotal(day) > 0) && (
              <View style={{ marginBottom: 15 }}>
                {(Array.isArray(days) ? days : []).map((day, dayIndex) => {
                  const dayTotal = calculateDayTotal(day);
                  if (dayTotal <= 0) return null;
                  return (
                    <View key={dayIndex} style={styles.infocontainer}>
                      <Text style={styles.infotitle}>{getDayLabel(day, dayIndex, days.length)}</Text>
                      <Text style={[styles.summaryRow, { opacity: .8 }]}>{formatCurrency(dayTotal)}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Total Project Expenses */}
            {projectTotal > 0 && (
              <View style={styles.infocontainer}>
                <Text style={styles.summaryTitle}>Total Project Expenses</Text>
                <Text style={[styles.summaryRow, { fontWeight: 'bold' }]}>{formatCurrency(projectTotal)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Daily Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          {(Array.isArray(days) ? days : []).map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                {getDayLabel(day, dayIndex, days.length)}{day.date ? ` - ${formatDate(day.date)}` : ""}
              </Text>
              {/* Per-day Crew Assignment before expenses */}
              {Array.isArray(day.crew) && day.crew.length > 0 && (() => {
                const grouped = day.crew.reduce((acc, member) => {
                  if (!member || !member.name) return acc;
                  const key = member.name;
                  const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
                  if (!acc[key]) acc[key] = new Set();
                  roles.forEach(r => acc[key].add(r));
                  return acc;
                }, {});
                const mergedCrew = Object.entries(grouped).map(([name, roles]) => ({ name, roles: Array.from(roles) }));
                return (
                  <View style={styles.expenseSection}>
                    <Text style={styles.expenseTitle}>Overall Crew Assignment</Text>
                    <View style={styles.table}>
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCellHeader}>Name</Text>
                        <Text style={styles.tableCellHeader}>Roles</Text>
                      </View>
                      {mergedCrew.map((member, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCell}>{member.name || '-'}</Text>
                          <Text style={styles.tableCell}>{member.roles?.join(', ') || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })()}
              {/* Rent Expenses */}
              {day?.expense?.rent && Array.isArray(day.expense.rent) && day.expense.rent.length > 0 && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Rent Expenses</Text>
                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={styles.tableCellHeader}>Item</Text>
                      <Text style={styles.tableCellHeader}>Qty</Text>
                      <Text style={styles.tableCellHeader}>Price</Text>
                      <Text style={styles.tableCellHeader}>Total</Text>
                      <Text style={styles.tableCellHeader}>Note</Text>
                    </View>
                    {day.expense.rent.map((item, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.name || "-"}</Text>
                        <Text style={styles.tableCell}>{item.qty || "0"}</Text>
                        <Text style={styles.tableCell}>{formatCurrency(item.price)}</Text>
                        <Text style={styles.tableCell}>{formatCurrency((item.qty || 0) * (item.price || 0))}</Text>
                        <Text style={styles.tableCell}>{item.note || "-"}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Operational Expenses */}
              {day?.expense?.operational && Array.isArray(day.expense.operational) && day.expense.operational.length > 0 && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Operational Expenses</Text>
                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={styles.tableCellHeader}>Item</Text>
                      <Text style={styles.tableCellHeader}>Qty</Text>
                      <Text style={styles.tableCellHeader}>Price</Text>
                      <Text style={styles.tableCellHeader}>Total</Text>
                      <Text style={styles.tableCellHeader}>Category</Text>
                      <Text style={styles.tableCellHeader}>Note</Text>
                    </View>
                    {day.expense.operational.map((item, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.name || "-"}</Text>
                        <Text style={styles.tableCell}>{item.qty || "0"}</Text>
                        <Text style={styles.tableCell}>{formatCurrency(item.price)}</Text>
                        <Text style={styles.tableCell}>{formatCurrency((item.qty || 0) * (item.price || 0))}</Text>
                        <Text style={styles.tableCell}>{item.category || "-"}</Text>
                        <Text style={styles.tableCell}>{item.note || "-"}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Shoplist */}
              {day?.expense?.orderlist && Array.isArray(day.expense.orderlist) && day.expense.orderlist.length > 0 && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Shoplist</Text>
                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={styles.tableCellHeader}>Item</Text>
                      <Text style={styles.tableCellHeader}>Qty</Text>
                      <Text style={styles.tableCellHeader}>Crew</Text>
                      <Text style={styles.tableCellHeader}>Role</Text>
                      <Text style={styles.tableCellHeader}>Note</Text>
                    </View>
                    {day.expense.orderlist.map((item, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.name || "-"}</Text>
                        <Text style={styles.tableCell}>{item.qty || "0"}</Text>
                        <Text style={styles.tableCell}>{
                          typeof item.crew === 'string' ? (item.crew || '-') : (item.crew?.name || '-')
                        }</Text>
                        <Text style={styles.tableCell}>{
                          typeof item.crew === 'string' ? '-' : (item.crew?.role || '-')
                        }</Text>
                        <Text style={styles.tableCell}>{item.note || "-"}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Backup Information */}
              {day?.backup && Array.isArray(day.backup) && day.backup.length > 0 && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Backup Operations</Text>
                  {day.backup.map((backup, idx) => (
                    <Text key={idx} style={styles.backupItem}>
                      • {backup.source || "Unknown"} → {backup.target || "Unknown"}
                    </Text>
                  ))}
                </View>
              )}

              {/* Day Note */}
              {day?.note && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Day Note</Text>
                  <View style={styles.noteBox}>
                    <Text>{day.note}</Text>
                  </View>
                </View>
              )}

              {/* Images Documentation - Per Day */}
              {Array.isArray(day?.images) && day.images.length > 0 && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Documentation Images</Text>
                  <View style={styles.imagesGrid}>
                    {day.images.map((imageSrc, imgIndex) => (
                      <View key={imgIndex} style={styles.imageContainer}>
                        <Image
                          src={imageSrc}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          cache={false}
                        />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.imageCaption}>
                    {day.images.length} image{day.images.length !== 1 ? 's' : ''} from {getDayLabel(day, dayIndex, days.length)}
                  </Text>
                </View>
              )}

              {/* Day Total */}
              {calculateDayTotal(day) > 0 && (
                <Text style={styles.dayTotal}>
                  {getDayLabel(day, dayIndex, days.length)} Total: {formatCurrency(calculateDayTotal(day))}
                </Text>
              )}
            </View>
          ))}
        </View>



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
          <Text>This is an official project report document</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument; 