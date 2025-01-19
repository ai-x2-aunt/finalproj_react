import React from 'react';
import { healthStatusOptions, desiredProgramOptions, applicationMotiveOptions } from '../../constants/formOptions';
import { scrollToNextSection, scrollToNextButton, checkAllSelectionsComplete } from '../../utils/scrollHelper';

const HealthAndProgramForm = ({ 
  formData, 
  handleHealthSelect,
  handleChange,
  handleMotiveSelect
}) => {
  const handleCardClick = (value, handler, event, fieldPath) => {
    handler(value);
    
    setTimeout(() => {
      const updatedFormData = { ...formData };
      updatedFormData[fieldPath] = value;
      
      if (checkAllSelectionsComplete(updatedFormData, 5)) {
        scrollToNextButton();
      } else {
        scrollToNextSection(event.currentTarget);
      }
    }, 100);
  };

  const handleProgramSelect = (value, event) => {
    const currentPrograms = Object.values(formData.desiredPrograms).filter(Boolean);
    
    // 이미 선택된 항목 클릭 시 해당 항목 제거
    if (Object.values(formData.desiredPrograms).includes(value)) {
      const updatedPrograms = {
        first: '',
        second: '',
        third: ''
      };
      
      const existingPrograms = Object.values(formData.desiredPrograms)
        .filter(program => program && program !== value);
      
      existingPrograms.forEach((program, index) => {
        updatedPrograms[Object.keys(updatedPrograms)[index]] = program;
      });
      
      handleChange({
        target: {
          name: 'desiredPrograms',
          value: updatedPrograms
        }
      });
    } else {
      // 새로운 항목 선택 시
      if (currentPrograms.length < 3) {
        const position = ['first', 'second', 'third'][currentPrograms.length];
        handleChange({
          target: {
            name: `desiredPrograms.${position}`,
            value
          }
        });
      }
    }

    // 프로그램 선택 후 스크롤
    setTimeout(() => {
      if (currentPrograms.length >= 2) { // 3개 선택 완료 시
        scrollToNextSection(event.currentTarget);
      }
    }, 100);
  };

  const getProgramRank = (value) => {
    const programs = formData.desiredPrograms;
    if (programs.first === value) return 1;
    if (programs.second === value) return 2;
    if (programs.third === value) return 3;
    return null;
  };

  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">현재 건강 상태는 어떠신가요?</h2>
      <div className="hmk-card-grid">
        {healthStatusOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.healthStatus === option.value ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleHealthSelect, e, 'healthStatus')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      <h2 className="hmk-section-title">참여하고 싶은 일자리를 선택해주세요 (최대 3개)</h2>
      <div className="hmk-card-grid">
        {desiredProgramOptions.map(option => {
          const rank = getProgramRank(option.value);
          return (
            <div
              key={option.value}
              className={`hmk-selection-card ${rank ? 'selected' : ''}`}
              onClick={(e) => handleProgramSelect(option.value, e)}
            >
              <span className="hmk-card-icon">{option.icon}</span>
              <span className="hmk-card-label">{option.label}</span>
              {rank && <span className="hmk-rank-badge">{rank}순위</span>}
            </div>
          );
        })}
      </div>

      <h2 className="hmk-section-title">신청 동기를 선택해주세요 (여러 개 선택 가능)</h2>
      <div className="hmk-card-grid">
        {applicationMotiveOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.applicationMotives.includes(option.value) ? 'selected' : ''}`}
            onClick={(e) => handleCardClick(option.value, handleMotiveSelect, e, 'applicationMotives')}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthAndProgramForm; 