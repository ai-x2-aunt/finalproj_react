import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: '20mm',
    fontFamily: 'NanumGothic',
    fontSize: 12,
  },
  header: {
    marginBottom: '10mm',
  },
  formNumber: {
    fontSize: 10,
    textAlign: 'right',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: '10mm',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    border: '1pt solid black',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
    minHeight: '10mm',
  },
  labelCell: {
    width: '20%',
    padding: '2mm',
    borderRight: '1pt solid black',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueCell: {
    flex: 1,
    padding: '2mm',
    borderRight: '1pt solid black',
  }
}); 