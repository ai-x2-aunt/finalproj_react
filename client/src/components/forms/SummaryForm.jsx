import React from 'react';

const SummaryForm = ({ formData, handleSubmit }) => {
  const calculateAge = (residentNumber) => {
    const currentYear = new Date().getFullYear();
    const birthYearPrefix = residentNumber[0] <= '2' ? '20' : '19';
    const birthYear = parseInt(birthYearPrefix + residentNumber.slice(0, 2), 10);
    return currentYear - birthYear;
  };

  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">입력하신 내용을 확인해주세요</h2>
      <div className="hmk-summary-content">
        <div className="hmk-summary-group">
          <h3>기본 정보</h3>
          <p>성함: {formData.name}</p>
          <p>주민등록번호: {formData.residentNumber1}-{formData.residentNumber2} (만 {calculateAge(formData.residentNumber1)} 세)</p>
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
          <p>기초노령연금: {formData.basicPensionStatus.receiving ? `수급중 (${formData.basicPensionStatus.amount}만원)` : '미수급'}</p>
          <p>장기요양등급: {formData.longTermCare.status ? '있음' : '없음'}</p>
        </div>

        <div className="hmk-summary-group">
          <h3>경력 사항</h3>
          <p>일자리 사업 참여: {formData.workExperience.isNew ? '참여 경험 있음' : '신규 참여'}</p>
          {formData.workExperience.isNew && formData.workExperience.years.length > 0 && (
            <p>참여 연도: {formData.workExperience.years.join(', ')}년</p>
          )}
          <p>자원봉사 경험: {formData.volunteerWork.participated ? '있음' : '없음'}</p>
          <p>건강보험 직장가입: {formData.volunteerWork.healthInsurance === 'true' ? '예' : '아니오'}</p>
        </div>

        <div className="hmk-summary-group">
          <h3>건강 및 희망사항</h3>
          <p>건강상태: {formData.healthStatus}</p>
          <p>희망직종:</p>
          <ul>
            <li>1순위: {formData.desiredPrograms.first}</li>
            {formData.desiredPrograms.second && <li>2순위: {formData.desiredPrograms.second}</li>}
            {formData.desiredPrograms.third && <li>3순위: {formData.desiredPrograms.third}</li>}
          </ul>
          <p>신청동기: {formData.applicationMotives.join(', ')}</p>
        </div>
      </div>

      <div className="hmk-submit-section">
        <button 
          className="hmk-button hmk-submit-button"
          onClick={handleSubmit}
        >
          신청서 제출하기
          <span className="hmk-button-icon">✅</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryForm; 