import React from 'react';
import { educationOptions, householdOptions, familyMemberOptions, housingTypeOptions } from '../../constants/formOptions';
import { scrollToNextButton } from '../../utils/scrollHelper';

const EducationAndHouseholdForm = ({ 
  formData, 
  handleEducationSelect,
  handleHouseholdSelect,
  handleFamilyMemberSelect,
  handleFamilyMemberCount,
  handleHousingTypeSelect
}) => {
  const handleCardClick = (value, handler, event, fieldPath) => {
    handler(value);
    
    setTimeout(() => {
      const updatedFormData = { ...formData };
      updatedFormData[fieldPath] = value;
      
      if (updatedFormData.education && 
          updatedFormData.householdType && 
          updatedFormData.housingType) {
        scrollToNextButton();
      } else {
        // ��든 섹션 제목을 찾습니다
        const sections = document.querySelectorAll('.hmk-section-title');
        if (!sections.length) return;

        // 현재 클릭된 카드의 위치를 기준으로 가장 가까운 이전 섹션 제목을 찾습니다
        let currentElement = event.currentTarget;
        let currentTitle = null;

        while (currentElement && !currentTitle) {
          currentElement = currentElement.previousElementSibling;
          if (currentElement && currentElement.classList.contains('hmk-section-title')) {
            currentTitle = currentElement;
          }
        }

        if (!currentTitle) return;

        // 현재 섹션의 인덱스를 찾고 다음 섹션으로 스크롤
        const sectionsArray = Array.from(sections);
        const currentIndex = sectionsArray.indexOf(currentTitle);
        
        if (currentIndex !== -1 && currentIndex < sectionsArray.length - 1) {
          const nextSection = sectionsArray[currentIndex + 1];
          const offset = window.innerHeight * 0.2;
          const elementPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
          
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };

  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">학력을 선택해주세요</h2>
      <div className="hmk-card-grid">
        {educationOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.education === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleEducationSelect, e, 'education')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      <h2 className="hmk-section-title">현재 누구와 함께 살고 계신가요?</h2>
      <div className="hmk-card-grid">
        {householdOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.householdType === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleHouseholdSelect, e, 'householdType')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      {formData.householdType && !['노인 독신', '기타'].includes(formData.householdType) && (
        <div className="hmk-family-members-section">
          <h2 className="hmk-section-title">가족 구성원을 알려주세요</h2>
          <div className="hmk-card-grid">
            {familyMemberOptions.map(option => (
              <div key={option.value} className="hmk-family-member-card">
                <div
                  className={`hmk-selection-card ${formData[option.value] ? 'selected' : ''}`}
                  onClick={(e) => handleCardClick(option.value, handleFamilyMemberSelect, e, option.value)}
                >
                  <span className="hmk-card-icon">{option.icon}</span>
                  <span className="hmk-card-label">{option.label}</span>
                </div>
                {option.needCount && formData[option.value] && (
                  <div className="hmk-count-control">
                    <button
                      className="hmk-count-button"
                      onClick={() => handleFamilyMemberCount(option.value, 'decrease')}
                    >
                      -
                    </button>
                    <span className="hmk-count-display">
                      {formData[`${option.value}Count`] || 0}명
                    </span>
                    <button
                      className="hmk-count-button"
                      onClick={() => handleFamilyMemberCount(option.value, 'increase')}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="hmk-section-title">주거 형태를 선택해주세요</h2>
      <div className="hmk-card-grid">
        {housingTypeOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.housingType === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleHousingTypeSelect, e, 'housingType')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationAndHouseholdForm; 