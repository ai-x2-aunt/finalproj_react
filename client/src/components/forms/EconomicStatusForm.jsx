import React from 'react';
import { economicStatusOptions } from '../../constants/formOptions';
import { scrollToNextSection, scrollToNextButton, checkAllSelectionsComplete } from '../../utils/scrollHelper';

const EconomicStatusForm = ({ 
  formData, 
  handleBasicLivingSelect,
  handleEconomicSelect,
  handleBasicPensionSelect,
  handleChange,
  handleLongTermCareSelect
}) => {
  const handleCardClick = (value, handler, event, fieldPath) => {
    handler(value);
    
    setTimeout(() => {
      const updatedFormData = { ...formData };
      
      if (fieldPath.includes('.')) {
        const [parent, child] = fieldPath.split('.');
        updatedFormData[parent] = {
          ...updatedFormData[parent],
          [child]: value
        };
      } else {
        updatedFormData[fieldPath] = value;
      }
      
      if (checkAllSelectionsComplete(updatedFormData, 3)) {
        scrollToNextButton();
      } else {
        scrollToNextSection(event.currentTarget);
      }
    }, 100);
  };

  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">기초생활수급권자 해당 여부</h2>
      <div className="hmk-card-grid">
        {[
          { value: '해당', label: '해당됩니다', icon: '✔️' },
          { value: '비해당', label: '해당되지 않습니다', icon: '❌' }
        ].map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.basicLivingRecipient === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleBasicLivingSelect, e, 'basicLivingRecipient')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      <h2 className="hmk-section-title">경제적 상황은 어떠신가요?</h2>
      <div className="hmk-card-grid">
        {economicStatusOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.economicStatus === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleEconomicSelect, e, 'economicStatus')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      <h2 className="hmk-section-title">기초노령연금을 받고 계신가요?</h2>
      <div className="hmk-card-grid">
        {[
          { value: true, label: '받고 있어요', icon: '💰' },
          { value: false, label: '받고 있지 않아요', icon: '❌' }
        ].map(option => (
          <div
            key={String(option.value)}
            className={`hmk-selection-card ${formData.basicPensionStatus.receiving === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleBasicPensionSelect, e, 'basicPensionStatus.receiving')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>
      
      {formData.basicPensionStatus.receiving && (
        <div className="hmk-input-group">
          <label className="hmk-label">받으시는 금액을 알려주세요 (만원)</label>
          <input
            type="number"
            name="basicPensionStatus.amount"
            value={formData.basicPensionStatus.amount}
            onChange={handleChange}
            className="hmk-large-input"
            placeholder="예: 30"
          />
        </div>
      )}

      <h2 className="hmk-section-title">장기요양 등급판정을 받으셨나요?</h2>
      <div className="hmk-card-grid">
        {[
          { value: true, label: '받았어요', icon: '📋' },
          { value: false, label: '받지 않았어요', icon: '❌' }
        ].map(option => (
          <div
            key={String(option.value)}
            className={`hmk-selection-card ${formData.longTermCare.status === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleLongTermCareSelect, e, 'longTermCare.status')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EconomicStatusForm; 