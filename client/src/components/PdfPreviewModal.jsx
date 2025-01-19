import React from 'react';

const PdfPreviewModal = ({ onClose, formData }) => {
  const calculateAge = (residentNumber) => {
    const currentYear = new Date().getFullYear();
    const birthYearPrefix = residentNumber[0] <= '2' ? '20' : '19';
    const birthYear = parseInt(birthYearPrefix + residentNumber.slice(0, 2), 10);
    return currentYear - birthYear;
  };

  const handleFinalSubmit = () => {
    // 여기에 최종 제출 로직 구현
    alert('신청서가 제출되었습니다.');
    onClose();
  };

  return (
    <div className="hmk-modal-overlay">
      <div className="hmk-modal-content">
        <div className="hmk-modal-header">
          <h2>신청서 미리보기</h2>
          <button 
            className="hmk-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="hmk-modal-body">
          <div className="hmk-summary-content">
            <div className="hmk-summary-group">
              <h3>기본 정보</h3>
              <p>성함: {formData.name}</p>
              <p>주민등록번호: {formData.residentNumber1}-{formData.residentNumber2}</p>
              <p>만 나이: {calculateAge(formData.residentNumber1)}세</p>
              <p>휴대폰: {formData.mobilePhone}</p>
              <p>주소: {formData.address} {formData.detailAddress}</p>
            </div>

            <div className="hmk-summary-group">
              <h3>학력 및 가구 정보</h3>
              <p>학력: {formData.education}</p>
              <p>세대구성: {formData.householdType}</p>
              <p>주거형태: {formData.housingType}</p>
              {formData.spouse && <p>배우자: 있음</p>}
              {formData.children && <p>자녀: {formData.childrenCount}명</p>}
              {formData.grandchildren && <p>손자녀: {formData.grandchildrenCount}명</p>}
            </div>

            <div className="hmk-summary-group">
              <h3>경제 상태</h3>
              <p>기초생활수급: {formData.basicLivingRecipient}</p>
              <p>경제상태: {formData.economicStatus}</p>
              <p>기초노령연금: {formData.basicPensionStatus.receiving ? 
                `수급중 (${formData.basicPensionStatus.amount}만원)` : '미수급'}</p>
              <p>장기요양등급: {formData.longTermCare.status ? '있음' : '없음'}</p>
            </div>

            <div className="hmk-summary-group">
              <h3>희망 직종</h3>
              <p>1순위: {formData.desiredPrograms.first}</p>
              {formData.desiredPrograms.second && <p>2순위: {formData.desiredPrograms.second}</p>}
              {formData.desiredPrograms.third && <p>3순위: {formData.desiredPrograms.third}</p>}
            </div>
          </div>
          
          <div className="hmk-modal-footer">
            <button 
              className="hmk-button hmk-submit-button"
              onClick={handleFinalSubmit}
            >
              제출하기
              <span className="hmk-button-icon">✅</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal; 