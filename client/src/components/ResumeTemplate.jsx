import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, Font, Image } from '@react-pdf/renderer';
import { styles } from '../styles/resumeStyles';

Font.register({
  family: 'NanumGothic',
  src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal'
});

const ResumeDocument = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.formNumber}>접수번호:_____________</Text>
      </View>
      
      <Text style={styles.title}>노인일자리 신청서</Text>
      
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>성명</Text>
          </View>
          <View style={styles.valueCell}>
            <Text>{formData.name}</Text>
          </View>
          <View style={styles.labelCell}>
            <Text>연락처</Text>
          </View>
          <View style={styles.valueCell}>
            <Text>{formData.mobilePhone}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>주민등록번호</Text>
          </View>
          <View style={[styles.valueCell, { flex: 3 }]}>
            <Text>{formData.residentNumber1}-{formData.residentNumber2}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>주소</Text>
          </View>
          <View style={[styles.valueCell, { flex: 3 }]}>
            <Text>{formData.address} {formData.detailAddress}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>최종학력</Text>
          </View>
          <View style={[styles.valueCell, { flex: 3 }]}>
            <Text>{formData.education}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>세대구성</Text>
          </View>
          <View style={[styles.valueCell, { flex: 3 }]}>
            <Text>{formData.householdType}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>희망직종</Text>
          </View>
          <View style={[styles.valueCell, { flex: 3 }]}>
            <Text>1순위: {formData.desiredPrograms.first}</Text>
            {formData.desiredPrograms.second && (
              <Text>2순위: {formData.desiredPrograms.second}</Text>
            )}
            {formData.desiredPrograms.third && (
              <Text>3순위: {formData.desiredPrograms.third}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text>신청동기</Text>
          </View>
          <View style={[styles.valueCell, { flex: 3 }]}>
            <Text>{formData.applicationMotives.join(', ')}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const ResumeTemplate = ({ formData }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="pdf-container">
      <PDFViewer style={{ width: '100%', height: 'calc(90vh - 120px)' }}>
        <ResumeDocument formData={formData} />
      </PDFViewer>
      
      <PDFDownloadLink 
        document={<ResumeDocument formData={formData} />}
        fileName={`${formData.name}_노인일자리신청서.pdf`}
        className="hmk-button hmk-download-button"
      >
        {({ blob, url, loading, error }) =>
          loading ? '문서 생성중...' : 'PDF 다운로드'
        }
      </PDFDownloadLink>
    </div>
  );
};

export default ResumeTemplate; 