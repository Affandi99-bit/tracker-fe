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
    marginBottom: 30,
    paddingBottom: 15,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'flex-start',
    justifyContent: 'start',
    flex: 1,
  },
  title: {
    color: '#222',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  companyInfo: {
    fontSize: 9,
    textAlign: 'left',
    color: '#666',
    marginTop: 5,
  },
  quotationInfo: {
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
  quoteTo: {
    marginBottom: 20,
  },
  quoteToTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  quoteToContent: {
    fontSize: 10,
    color: '#222',
    lineHeight: 1.6,
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
  descriptionCell: {
    flex: 3,
  },
  unitCell: {
    flex: 1,
    textAlign: 'center',
  },
  qtyCell: {
    flex: 1,
    textAlign: 'center',
  },
  priceCell: {
    flex: 1.5,
    textAlign: 'right',
  },
  totalCell: {
    flex: 1.5,
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'flex-end',
  },
  summaryBox: {
    width: 250,
    border: '1px solid #222',
    padding: 15,
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
});

const PDFQuotation = ({ pro, days, quotationNumber, quotationDate, validUntil, items, subtotal, taxRate, taxAmount, total, notes }) => {
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

  // Use items if provided, otherwise generate from days
  const quotationItems = items && items.length > 0
    ? items.map(item => ({
      description: item.description || "",
      unit: item.unit || "pcs",
      qty: parseInt(item.qty || 0),
      price: parseFloat(item.price || 0),
      total: (parseInt(item.qty || 0) * parseFloat(item.price || 0))
    }))
    : [];

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
            <Text style={styles.title}>QUOTATION</Text>
            <Text style={styles.companyInfo}>
              CV. Kreasi Rumah Hitam
            </Text>
            <Text style={styles.companyInfo}>
              Jl. Suropati Gang 9 Desa Pesanggrahan, Kota Batu
            </Text>
            <Text style={styles.companyInfo}>
              Telp. +62 811-3577-793 | Email: blackstudio.id@gmail.com
            </Text>
          </View>
          <View style={styles.quotationInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Quotation #:</Text>
              <Text style={styles.infoValue}>{quotationNumber || "QUO-XXXX"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{formatDate(quotationDate)}</Text>
            </View>
            {validUntil && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valid Until:</Text>
                <Text style={styles.infoValue}>{formatDate(validUntil)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quote To */}
        <View style={styles.quoteTo}>
          <Text style={styles.quoteToTitle}>Quote To:</Text>
          <View style={styles.quoteToContent}>
            <Text>{pro?.client || "-"}</Text>
            {pro?.pic && <Text>PIC: {pro?.pic}</Text>}
          </View>
        </View>

        {/* Project Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <View style={{ fontSize: 9, lineHeight: 1.8 }}>
            <Text>Project Title: {pro?.title || "-"}</Text>
            <Text>Categories: {pro?.categories?.join(", ") || "-"}</Text>
            <Text>Start Date: {formatDate(pro?.start)}</Text>
            <Text>Deadline: {formatDate(pro?.deadline)}</Text>
          </View>
        </View>

        {/* Items Table */}
        {quotationItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCellHeader, styles.descriptionCell]}>Description</Text>
                <Text style={[styles.tableCellHeader, styles.unitCell]}>Unit</Text>
                <Text style={[styles.tableCellHeader, styles.qtyCell]}>Qty</Text>
                <Text style={[styles.tableCellHeader, styles.priceCell]}>Unit Price</Text>
                <Text style={[styles.tableCellHeader, styles.totalCell]}>Total</Text>
              </View>
              {quotationItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.descriptionCell]}>{item.description}</Text>
                  <Text style={[styles.tableCell, styles.unitCell]}>{item.unit}</Text>
                  <Text style={[styles.tableCell, styles.qtyCell]}>{item.qty}</Text>
                  <Text style={[styles.tableCell, styles.priceCell]}>{formatCurrency(item.price)}</Text>
                  <Text style={[styles.tableCell, styles.totalCell]}>{formatCurrency(item.total)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text>Subtotal:</Text>
              <Text>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax (VAT {taxRate}%):</Text>
              <Text>{formatCurrency(taxAmount)}</Text>
            </View>
            <View style={styles.summaryTotal}>
              <Text>Total:</Text>
              <Text>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        {notes && (
          <View style={styles.notes}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Terms & Conditions:</Text>
            <Text>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            We look forward to working with you!
          </Text>
          <Text style={{ marginTop: 5 }}>
            Quotation generated on {new Date().toLocaleDateString("id-ID", {
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

export default PDFQuotation;
