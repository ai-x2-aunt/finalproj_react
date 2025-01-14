import React from 'react';
import { healthStatusOptions, desiredProgramOptions, applicationMotiveOptions } from '../../constants/formOptions';

const HealthAndProgramForm = ({ 
  formData, 
  handleHealthSelect,
  handleChange,
  handleMotiveSelect
}) => {
  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">현재 건강 상태는 어떠신가요?</h2>
      <div className="hmk-card-grid">
        {healthStatusOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.healthStatus === option.value ? 'selected' : ''}`}
            onClick={() => handleHealthSelect(option.value)}
          >
            <span className="hmk-card-icon">{option.icon}</span>
            <span className="hmk-card-label">{option.label}</span>
          </div>
        ))}
      </div>

      <h2 className="hmk-section-title">참여하고 싶은 일자리를 선택해주세요</h2>
      <div className="hmk-input-group">
        <label className="hmk-label">1순위</label>
        <select
          name="desiredPrograms.first"
          value={formData.desiredPrograms.first}
          onChange={handleChange}
          className="hmk-large-input"
        >
          <option value="">선택해주세요</option>
          {desiredProgramOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="hmk-label">2순위 (선택)</label>
        <select
          name="desiredPrograms.second"
          value={formData.desiredPrograms.second}
          onChange={handleChange}
          className="hmk-large-input"
        >
          <option value="">선택해주세요</option>
          {desiredProgramOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="hmk-label">3순위 (선택)</label>
        <select
          name="desiredPrograms.third"
          value={formData.desiredPrograms.third}
          onChange={handleChange}
          className="hmk-large-input"
        >
          <option value="">선택해주세요</option>
          {desiredProgramOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <h2 className="hmk-section-title">신청 동기를 선택해주세요 (여러 개 선택 가능)</h2>
      <div className="hmk-card-grid">
        {applicationMotiveOptions.map(option => (
          <div
            key={option.value}
            className={`hmk-selection-card ${formData.applicationMotives.includes(option.value) ? 'selected' : ''}`}
            onClick={() => handleMotiveSelect(option.value)}
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