// components/PdfGenerator.tsx

'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, Image } from '@react-pdf/renderer';
import { Category, Dhikr } from '@/types';

// تسجيل الخطوط
Font.register({
  family: 'Arabic',
  src: '/fonts/Al-Jazeera-Light.ttf'
});

// إنشاء الأنماط
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  content: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Arabic',
    color: '#000000',
  },
  dhikrContainer: {
    marginBottom: 10,
    padding: 5,
  },
  dhikrText: {
    fontSize: 14,
    marginBottom: 3,
    textAlign: 'right',
    fontFamily: 'Arabic',
    color: '#000000',
  },
  translationText: {
    fontSize: 10,
    textAlign: 'left',
    fontFamily: 'Arabic',
    color: '#000000',
  },
});

interface DhikrPageProps {
  items: Dhikr[];
  showTitle: boolean;
  category: Category;
}

const DhikrPage: React.FC<DhikrPageProps> = ({ items, showTitle, category }) => (
  <Page size="A5" style={styles.page}>
    <Image
      style={styles.backgroundImage}
      src="/images/background.jpg"
    />
    <View style={styles.content}>
      {showTitle && <Text style={styles.title}>{category.name}</Text>}
      {items.map((dhikr) => (
        <View key={dhikr.id} style={styles.dhikrContainer} wrap={false}>
          <Text style={styles.dhikrText}>{dhikr.text}</Text>
          {dhikr.translation && (
            <Text style={styles.translationText}>{dhikr.translation}</Text>
          )}
        </View>
      ))}
    </View>
  </Page>
);

interface PdfDocumentProps {
  category: Category;
  dhikrs: Dhikr[];
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ category, dhikrs }) => {
  const itemsPerPage = 4;
  const pages = [];
  for (let i = 0; i < dhikrs.length; i += itemsPerPage) {
    pages.push(dhikrs.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {pages.map((pageItems, index) => (
        <DhikrPage 
          key={index} 
          items={pageItems} 
          showTitle={index === 0} 
          category={category}
        />
      ))}
    </Document>
  );
};

interface PdfGeneratorProps {
  category: Category;
  dhikrs: Dhikr[];
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ category, dhikrs }) => {
  return (
    <div className="mb-4">
      <PDFDownloadLink
        document={<PdfDocument category={category} dhikrs={dhikrs} />}
        fileName={`${category.name}.pdf`}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'جاري تحضير الملف...' : 'تحميل PDF'
        }
      </PDFDownloadLink>
    </div>
  );
};

export default PdfGenerator;