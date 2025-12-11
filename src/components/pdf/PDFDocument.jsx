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
    padding: 8,
    color: '#222',
    fontSize: 7,
    fontFamily: 'Helvetica',
  },
  headerwrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
    width: '100%',
    borderBottom: '1px solid #222',
    marginBottom: 12,
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
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    textAlign: 'left',
  },
  subtitle: {
    color: '#222',
    fontSize: 8,
    marginBottom: 2,
    textAlign: 'left',
  },
  companyInfo: {
    fontSize: 6,
    textAlign: 'left',
    color: '#666',
  },
  infocontainer: {
    width: '100%',
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  infotitle: {
    width: '40%',
    fontSize: 7,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold',
  },
  infodata: {
    width: '60%',
    fontSize: 6,
    textAlign: 'left',
    color: '#666',
  },
  section: {
    marginBottom: 12,
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    color: '#222',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 6,
    paddingBottom: 2,
    pageBreakAfter: 'avoid',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 8,
    pageBreakInside: 'avoid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: .3,
    borderBottomColor: '#222',
    minHeight: 20,
    alignItems: 'center',
    pageBreakInside: 'avoid',
  },
  tableHeader: {
    backgroundColor: '#222',
    color: '#fff',
    fontWeight: 'bold',
    pageBreakAfter: 'avoid',
    pageBreakInside: 'avoid',
  },
  tableCell: {
    padding: 3,
    flex: 1,
    fontSize: 6,
  },
  tableCellHeader: {
    padding: 3,
    flex: 1,
    color: '#fff',
    fontSize: 6,
  },
  dayHeader: {
    padding: 6,
    marginBottom: 10,
    border: '1px solid #222',
    pageBreakInside: 'avoid',
  },
  dayTitle: {
    color: '#222',
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 3,
    pageBreakAfter: 'avoid',
  },
  dayDate: {
    fontSize: 6,
    color: '#666',
  },
  expenseSection: {
    marginBottom: 8,
    pageBreakInside: 'avoid',
  },
  expenseTitle: {
    color: '#222',
    fontSize: 6,
    fontWeight: 'bold',
    marginBottom: 4,
    pageBreakAfter: 'avoid',
  },
  noteBox: {
    padding: 5,
    border: '1px solid #ddd',
    marginBottom: 6,
    pageBreakInside: 'avoid',
    fontSize: 6,
  },
  dayTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 5,
    paddingTop: 4,
    fontSize: 7,
  },
  projectSummary: {
    border: '1px solid #222',
    padding: 8,
    marginTop: 10,
    marginBottom: 12,
    pageBreakInside: 'avoid',
  },
  summaryTitle: {
    color: '#222',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 6,
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: '1px solid #222',
    textAlign: 'center',
    color: '#222',
    fontSize: 6,
  },
  backupItem: {
    marginBottom: 3,
    color: '#222',
    fontSize: 6,
  },
  imagesSection: {
    marginTop: 10,
    pageBreakBefore: 'always',
  },
  imagesSectionTitle: {
    color: '#222',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    borderBottom: '1px solid #222',
    paddingBottom: 2,
  },
  dayImagesContainer: {
    marginBottom: 12,
    pageBreakInside: 'avoid',
  },
  dayImagesTitle: {
    color: '#222',
    fontSize: 5,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottom: '1px solid #222',
    paddingBottom: 2,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'flex-start',
    width: '100%',
  },

  imageContainer: {
    width: 100,
    height: 100,
    border: '1px solid #ccc',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginRight: 6,
  },

  imageCaption: {
    fontSize: 5,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

const PDFDocument = ({ pro, days, freelancers = [] }) => {
  // Validate and sanitize input data to prevent array length errors
  const safeDays = Array.isArray(days)
    ? days.filter(day => day != null).slice(0, 50) // Limit to 50 days max
    : [];
  const safeFreelancers = Array.isArray(freelancers)
    ? freelancers.filter(f => f != null).slice(0, 100) // Limit to 100 freelancers max
    : [];
  const safePro = pro || {};

  // Helper functions
  const formatCurrency = (num) => {
    if (!num || isNaN(num)) return "Rp. 0";
    const parsed = parseFloat(num);
    if (isNaN(parsed) || !isFinite(parsed)) return "Rp. 0";
    return `Rp. ${parsed.toLocaleString("id-ID")}`;
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
    if (!Number.isInteger(index) || !Number.isInteger(total) || total <= 0 || index < 0) {
      return "Day";
    }
    if (index === 0) return "Pre-Production";
    if (index === total - 1) return "Post-Production";
    return `Day ${index}`;
  };

  const calculateDayTotal = (day) => {
    if (!day || !day.expense) return 0;
    try {
      const rentTotal = (Array.isArray(day.expense.rent) ? day.expense.rent.slice(0, 1000) : []).reduce((acc, item) => {
        if (!item) return acc;
        const price = parseFloat(item?.price || 0);
        const qty = parseInt(item?.qty || 0, 10);
        const itemTotal = (isNaN(price) || !isFinite(price) ? 0 : price) * (isNaN(qty) || !isFinite(qty) ? 0 : qty);
        return acc + (isNaN(itemTotal) || !isFinite(itemTotal) ? 0 : itemTotal);
      }, 0);
      const operationalTotal = (Array.isArray(day.expense.operational) ? day.expense.operational.slice(0, 1000) : []).reduce((acc, item) => {
        if (!item) return acc;
        const price = parseFloat(item?.price || 0);
        const qty = parseInt(item?.qty || 0, 10);
        const itemTotal = (isNaN(price) || !isFinite(price) ? 0 : price) * (isNaN(qty) || !isFinite(qty) ? 0 : qty);
        return acc + (isNaN(itemTotal) || !isFinite(itemTotal) ? 0 : itemTotal);
      }, 0);
      const total = rentTotal + operationalTotal;
      return isNaN(total) || !isFinite(total) ? 0 : total;
    } catch (error) {
      return 0;
    }
  };

  // Aggregate all crew from all days
  const allCrew = safeDays
    .flatMap(d => (Array.isArray(d?.crew) ? d.crew.filter(m => m != null) : []))
    .slice(0, 500); // Limit total crew entries to prevent memory issues
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

  const projectTotal = safeDays.reduce((acc, day) => {
    const total = calculateDayTotal(day);
    return acc + (isNaN(total) || !isFinite(total) ? 0 : total);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerwrap}>
          <View style={{
            width: 32,
            height: 32,
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
            <Text style={styles.subtitle}>{safePro?.title || "Untitled Project"}</Text>
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
            gap: 12,
            width: '100%'
          }}>
            <View style={{ flex: 1 }}>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Project Title</Text>
                <Text style={styles.infodata}>{safePro?.title || "-"}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Client</Text>
                <Text style={styles.infodata}>{safePro?.client || "-"}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>PIC Client</Text>
                <Text style={styles.infodata}>{safePro?.pic || "-"}</Text>
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
                <Text style={styles.infodata}>{formatDate(safePro?.start)}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Event Deadline</Text>
                <Text style={styles.infodata}>{formatDate(safePro?.deadline)}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Project Categories</Text>
                <Text style={styles.infodata}>{Array.isArray(safePro?.categories) ? safePro.categories.join(", ") : "-"}</Text>
              </View>
              <View style={styles.infocontainer}>
                <Text style={styles.infotitle}>Project Types</Text>
                <Text style={styles.infodata}>{Array.isArray(safePro?.type) ? safePro.type.join(", ") : "-"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Crew Information (grouped by name with comma-separated roles) */}
        {mergedCrew.length > 0 && (
          <View style={[styles.section, { pageBreakInside: 'avoid' }]}>
            <Text style={[styles.sectionTitle, { pageBreakAfter: 'avoid' }]}>Overall Crew Assignment</Text>
            <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
              <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Roles</Text>
              </View>
              {mergedCrew.map((member, index) => (
                <View key={index} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
                  <Text style={styles.tableCell}>{member.name || "-"}</Text>
                  <Text style={styles.tableCell}>{member.roles?.join(", ") || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Freelancers Section */}
        {safeFreelancers.length > 0 && (() => {
          const totalFreelancerPrice = safeFreelancers.reduce((sum, f) => {
            const price = parseFloat(f?.price);
            return sum + (isNaN(price) || !isFinite(price) ? 0 : price);
          }, 0);
          return (
            <View style={[styles.section, { pageBreakInside: 'avoid' }]}>
              <Text style={[styles.sectionTitle, { pageBreakAfter: 'avoid' }]}>Freelancers</Text>
              <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
                <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                  <Text style={styles.tableCellHeader}>Name</Text>
                  <Text style={styles.tableCellHeader}>Type</Text>
                  <Text style={styles.tableCellHeader}>Price</Text>
                </View>
                {safeFreelancers.map((freelancer, index) => (
                  <View key={index} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
                    <Text style={styles.tableCell}>{freelancer.name || "-"}</Text>
                    <Text style={styles.tableCell}>{freelancer.type || "-"}</Text>
                    <Text style={styles.tableCell}>{formatCurrency(freelancer.price || 0)}</Text>
                  </View>
                ))}
                <View style={[styles.tableRow, { backgroundColor: '#f0f0f0', pageBreakInside: 'avoid' }]}>
                  <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Total</Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatCurrency(totalFreelancerPrice)}</Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* Overtime Section */}
        {(() => {
          // Collect all overtime entries from all days
          const overtimeEntries = [];
          safeDays.forEach((day, dayIndex) => {
            if (!day || !day.crew || !Array.isArray(day.crew)) return;
            day.crew.forEach((crewMember, crewIdx) => {
              if (!crewMember || !crewMember.name) return;
              if (Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0) {
                // Get first role for auto-populating job if not set
                const firstRole = Array.isArray(crewMember.roles) && crewMember.roles.length > 0
                  ? crewMember.roles[0]
                  : '';
                crewMember.overtime.slice(0, 50).forEach((ot, otIdx) => { // Limit overtime entries per crew member
                  if (!ot) return;
                  // Only include entries that have at least one field filled
                  if (ot.job || ot.date || ot.hour || ot.note) {
                    overtimeEntries.push({
                      name: String(crewMember.name || ''),
                      job: String(ot.job || firstRole || ''), // Auto-populate with first role if not set
                      date: ot.date || '',
                      hour: ot.hour || '',
                      note: String(ot.note || ''),
                      key: `${dayIndex}-${crewIdx}-${otIdx}`
                    });
                  }
                });
              }
            });
          });

          // Limit total overtime entries to prevent memory issues
          const limitedEntries = overtimeEntries.slice(0, 500);

          if (limitedEntries.length === 0) return null;

          return (
            <View style={[styles.section, { pageBreakInside: 'avoid' }]}>
              <Text style={[styles.sectionTitle, { pageBreakAfter: 'avoid' }]}>Overtime Hours</Text>
              <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
                <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                  <Text style={styles.tableCellHeader}>Name</Text>
                  {/* <Text style={styles.tableCellHeader}>Jobdesk</Text> */}
                  <Text style={styles.tableCellHeader}>Date</Text>
                  <Text style={styles.tableCellHeader}>Overtime (Hours)</Text>
                  <Text style={styles.tableCellHeader}>Note</Text>
                </View>
                {limitedEntries.map((entry) => (
                  <View key={entry.key} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
                    <Text style={styles.tableCell}>{entry.name || '-'}</Text>
                    {/* <Text style={styles.tableCell}>{entry.job || '-'}</Text> */}
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
          <View style={[styles.section, styles.projectSummary]}>
            <Text style={styles.sectionTitle}>Project Summary</Text>

            {/* Daily Expenses Summary */}
            {safeDays.some(day => calculateDayTotal(day) > 0) && (
              <View style={{ marginBottom: 15, pageBreakInside: 'avoid' }}>
                {safeDays.map((day, dayIndex) => {
                  const dayTotal = calculateDayTotal(day);
                  if (dayTotal <= 0) return null;
                  return (
                    <View key={dayIndex} style={styles.infocontainer}>
                      <Text style={styles.infotitle}>{getDayLabel(day, dayIndex, safeDays.length)}</Text>
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
          {safeDays.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                {getDayLabel(day, dayIndex, safeDays.length)}{day?.date ? ` - ${formatDate(day.date)}` : ""}
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
                  <View style={[styles.expenseSection, { pageBreakInside: 'avoid' }]}>
                    <Text style={[styles.expenseTitle, { pageBreakAfter: 'avoid' }]}>Overall Crew Assignment</Text>
                    <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
                      <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                        <Text style={styles.tableCellHeader}>Name</Text>
                        <Text style={styles.tableCellHeader}>Roles</Text>
                      </View>
                      {mergedCrew.map((member, index) => (
                        <View key={index} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
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
                <View style={[styles.expenseSection, { pageBreakInside: 'avoid' }]}>
                  <Text style={[styles.expenseTitle, { pageBreakAfter: 'avoid' }]}>Rent Expenses</Text>
                  <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
                    <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                      <Text style={styles.tableCellHeader}>Item</Text>
                      <Text style={styles.tableCellHeader}>Qty</Text>
                      <Text style={styles.tableCellHeader}>Price</Text>
                      <Text style={styles.tableCellHeader}>Total</Text>
                      <Text style={styles.tableCellHeader}>Note</Text>
                    </View>
                    {day.expense.rent.map((item, idx) => (
                      <View key={idx} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
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
                <View style={[styles.expenseSection, { pageBreakInside: 'avoid' }]}>
                  <Text style={[styles.expenseTitle, { pageBreakAfter: 'avoid' }]}>Operational Expenses</Text>
                  <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
                    <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                      <Text style={styles.tableCellHeader}>Item</Text>
                      <Text style={styles.tableCellHeader}>Qty</Text>
                      <Text style={styles.tableCellHeader}>Price</Text>
                      <Text style={styles.tableCellHeader}>Total</Text>
                      <Text style={styles.tableCellHeader}>Category</Text>
                      <Text style={styles.tableCellHeader}>Note</Text>
                    </View>
                    {day.expense.operational.map((item, idx) => (
                      <View key={idx} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
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
                <View style={[styles.expenseSection, { pageBreakInside: 'avoid' }]}>
                  <Text style={[styles.expenseTitle, { pageBreakAfter: 'avoid' }]}>Shoplist</Text>
                  <View style={[styles.table, { pageBreakInside: 'avoid' }]}>
                    <View style={[styles.tableRow, styles.tableHeader, { pageBreakAfter: 'avoid' }]}>
                      <Text style={styles.tableCellHeader}>Item</Text>
                      <Text style={styles.tableCellHeader}>Qty</Text>
                      <Text style={styles.tableCellHeader}>Crew</Text>
                      <Text style={styles.tableCellHeader}>Role</Text>
                      <Text style={styles.tableCellHeader}>Note</Text>
                    </View>
                    {day.expense.orderlist.map((item, idx) => (
                      <View key={idx} style={[styles.tableRow, { pageBreakInside: 'avoid' }]}>
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
              {Array.isArray(day?.images) && day.images.length > 0 && (() => {
                // Filter and validate images - limit to prevent memory issues
                const validImages = day.images
                  .filter((img, idx) => {
                    if (!img) return false;
                    const imgStr = String(img);
                    // Only include valid image sources
                    return imgStr.trim().length > 0 &&
                      (imgStr.startsWith('http') ||
                        imgStr.startsWith('data:image') ||
                        imgStr.startsWith('/'));
                  })
                  .slice(0, 20); // Limit to 20 images per day to prevent memory issues

                if (validImages.length === 0) return null;

                return (
                  <View style={styles.expenseSection}>
                    <Text style={styles.expenseTitle}>Documentation Images</Text>
                    <View style={styles.imagesGrid}>
                      {validImages.map((imageSrc, imgIndex) => {
                        try {
                          return (
                            <View key={imgIndex} style={styles.imageContainer}>
                              <Image
                                src={String(imageSrc)}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                cache={false}
                              />
                            </View>
                          );
                        } catch (error) {
                          // Skip invalid images silently
                          return null;
                        }
                      })}
                    </View>
                    <Text style={styles.imageCaption}>
                      {validImages.length} image{validImages.length !== 1 ? 's' : ''} from {getDayLabel(day, dayIndex, safeDays.length)}
                      {day.images.length > validImages.length && ` (${day.images.length - validImages.length} invalid images skipped)`}
                    </Text>
                  </View>
                );
              })()}

              {/* Day Total */}
              {calculateDayTotal(day) > 0 && (
                <Text style={styles.dayTotal}>
                  {getDayLabel(day, dayIndex, safeDays.length)} Total: {formatCurrency(calculateDayTotal(day))}
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