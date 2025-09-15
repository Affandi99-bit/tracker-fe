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
  dayHeader: {
    padding: 5,
    marginBottom: 8,
    border: '1px solid #222',
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
    marginBottom: 5,
  },
  expenseTitle: {
    color: '#222',
    fontSize: 6,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  noteBox: {
    padding: 5,
    border: '1px solid #ddd',
    marginBottom: 5,
  },
  dayTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 3,
    paddingTop: 3,
  },
  projectSummary: {
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
  backupItem: {
    marginBottom: 3,
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
    marginBottom: 15,
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
    gap: 8, // Increased gap for better spacing
    marginBottom: 15,
    justifyContent: 'flex-start',
    width: '100%',
  },

  imageContainer: {
    width: 120, // Increased from 80
    height: 120, // Increased from 80
    border: '1px solid #ccc',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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

  const getDayLabel = (day) => {
    if (day.isPreProd) return "Pre-Production";
    if (day.isPostProd) return "Post-Production";
    return `Day ${day.dayNumber || '-'}`;
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

  const firstCrewDay = days.find(d => !d.isPreProd && !d.isPostProd && Array.isArray(d.crew) && d.crew.length > 0) ||
    days.find(d => Array.isArray(d.crew) && d.crew.length > 0);

  const projectTotal = days.reduce((acc, day) => acc + calculateDayTotal(day), 0);

  // Check if there are any images in the project
  const hasAnyImages = days.some(day => Array.isArray(day.images) && day.images.length > 0);

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
                  {Array.isArray(pro.day) && pro.day[0] && Array.isArray(pro.day[0].crew)
                    ? pro.day[0].crew
                      .filter(member =>
                        Array.isArray(member.roles) &&
                        member.roles.some(role => role.toLowerCase() === "project manager")
                      )
                      .map(member => member.name)
                      .join(", ") || "-"
                    : "-"}
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

        {/* Crew Information */}
        {firstCrewDay?.crew && firstCrewDay.crew.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crew Assignment</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Roles</Text>
              </View>
              {firstCrewDay.crew.map((member, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{member.name || "-"}</Text>
                  <Text style={styles.tableCell}>{member.roles?.join(", ") || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Daily Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Expenses Breakdown</Text>
          {days.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                {getDayLabel(day)}{day.date ? ` - ${formatDate(day.date)}` : ""}
              </Text>
              {/* Rent Expenses */}
              {day.expense.rent && day.expense.rent.length > 0 && (
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
              {day.expense.operational && day.expense.operational.length > 0 && (
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
              {day.expense.orderlist && day.expense.orderlist.length > 0 && (
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
              {day.backup && day.backup.length > 0 && (
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
              {day.note && (
                <View style={styles.expenseSection}>
                  <Text style={styles.expenseTitle}>Day Note</Text>
                  <View style={styles.noteBox}>
                    <Text>{day.note}</Text>
                  </View>
                </View>
              )}

              {/* Day Total */}
              {calculateDayTotal(day) > 0 && (
                <Text style={styles.dayTotal}>
                  {getDayLabel(day)} Total: {formatCurrency(calculateDayTotal(day))}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Project Summary */}
        {projectTotal > 0 && (
          <View style={styles.projectSummary}>
            <Text style={styles.summaryTitle}>Project Summary</Text>
            <View style={styles.summaryRow}>
              <Text>Total Project Expenses:</Text>
              <Text style={{ fontWeight: 'bold' }}>{formatCurrency(projectTotal)}</Text>
            </View>
          </View>
        )}

        {/* Images Documentation */}
        {hasAnyImages && (
          <View style={styles.imagesSection}>
            <Text style={styles.imagesSectionTitle}>Project Documentation Images</Text>

            {days.map((day, dayIndex) => {
              if (!Array.isArray(day.images) || day.images.length === 0) return null;

              return (
                <View key={dayIndex} style={styles.dayImagesContainer}>
                  <Text style={styles.dayImagesTitle}>
                    {getDayLabel(day)}{day.date ? ` - ${formatDate(day.date)}` : ""}
                  </Text>

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
                    {day.images.length} image{day.images.length !== 1 ? 's' : ''} from {getDayLabel(day)}
                  </Text>
                </View>
              );
            })}
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
          <Text>This is an official project report document</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument; 