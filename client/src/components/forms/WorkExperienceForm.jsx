import React from 'react';
import { scrollToNextSection, scrollToNextButton, checkAllSelectionsComplete } from '../../utils/scrollHelper';

const WorkExperienceForm = ({ 
  formData, 
  handleWorkExperienceSelect,
  handleYearSelect,
  handleVolunteerSelect,
  handleHealthInsuranceSelect
}) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const handleCardClick = (value, handler, event, fieldPath) => {
    handler(value);
    
    setTimeout(() => {
      const updatedFormData = { ...formData };
      updatedFormData[fieldPath] = value;
      
      if (checkAllSelectionsComplete(updatedFormData, 4)) {
        scrollToNextButton();
      } else {
        scrollToNextSection(event.currentTarget);
      }
    }, 100);
  };

  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">일자리 사업 참여 경력이 있으신가요?</h2>
      <div className="hmk-card-grid">
        {[
          { value: true, label: '참여한 적이 있어요', icon: '📋' },
          { value: false, label: '처음이에요', icon: '🆕' }
        ].map(option => (
          <div
            key={String(option.value)}
            className={`hmk-selection-card ${formData.workExperience.isNew === option.value ? 'selected' : ''}`}
            onClick={(event) => handleCardClick(option.value, handleWorkExperienceSelect, event, 'workExperience.isNew')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      {formData.workExperience.isNew && (
        <div className="hmk-input-group">
          <label className="hmk-label">참여하신 연도를 선택해주세요</label>
          <div className="hmk-year-checkboxes">
            {years.map(year => (
              <label key={year} className="hmk-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.workExperience.years.includes(year.toString())}
                  onChange={(event) => handleCardClick(year.toString(), handleYearSelect, event, 'workExperience.years')}
                  className="hmk-checkbox"
                />
                {year}년
              </label>
            ))}
          </div>
        </div>
      )}

      <h2 className="hmk-section-title">자원봉사 활동에 참여하신 적이 있나요?</h2>
      <div className="hmk-card-grid">
        {[
          { value: true, label: '참여한 적이 있어요', icon: '🤝' },
          { value: false, label: '참여한 적이 없어요', icon: '❌' }
        ].map(option => (
          <div
            key={String(option.value)}
            className={`hmk-selection-card ${formData.volunteerWork.participated === option.value ? 'selected' : ''}`}
            onClick={(event) => handleCardClick(option.value, handleVolunteerSelect, event, 'volunteerWork.participated')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      <h2 className="hmk-section-title">건강보험 직장가입자이신가요?</h2>
      <div className="hmk-card-grid">
        {[
          { value: true, label: '직장가입자예요', icon: '🏥' },
          { value: false, label: '직장가입자가 아니에요', icon: '📝' }
        ].map(option => (
          <div
            key={String(option.value)}
            className={`hmk-selection-card ${formData.volunteerWork.healthInsurance === String(option.value) ? 'selected' : ''}`}
            onClick={(event) => handleCardClick(option.value, handleHealthInsuranceSelect, event, 'volunteerWork.healthInsurance')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceForm; 