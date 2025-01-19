export const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 11자리를 초과하는 숫자는 제거
  const trimmed = numbers.slice(0, 11);
  
  // xxx-xxxx-xxxx 형식으로 변환
  if (trimmed.length >= 10) {
    return trimmed.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (trimmed.length >= 7) {
    return trimmed.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
  } else if (trimmed.length >= 4) {
    return trimmed.replace(/(\d{3})(\d{0,4})/, '$1-$2');
  }
  
  return trimmed;
}; 