import React from 'react';
import { educationOptions, householdOptions, familyMemberOptions, housingTypeOptions } from '../../constants/formOptions';

const EducationAndHouseholdForm = ({ 
  formData, 
  handleEducationSelect,
  handleHouseholdSelect,
  handleFamilyMemberSelect,
  handleFamilyMemberCount,
  handleHousingTypeSelect
}) => {
  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">학력을 선택해주세요</h2>
      <div className="hmk-card-grid">
        {educationOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.education === option.value ? 'selected' : ''}`}
            onClick={() => handleEducationSelect(option.value)}
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
            onClick={() => handleHouseholdSelect(option.value)}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      {formData.householdType && !['독신', '기타'].includes(formData.householdType) && (
        <div className="hmk-family-members-section">
          <h2 className="hmk-section-title">가족 구성원을 알려주세요</h2>
          <div className="hmk-card-grid">
            {familyMemberOptions.map(option => (
              <div key={option.value} className="hmk-family-member-card">
                <div
                  className={`hmk-selection-card ${formData[option.value] ? 'selected' : ''}`}
                  onClick={() => handleFamilyMemberSelect(option.value)}
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
            onClick={() => handleHousingTypeSelect(option.value)}
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