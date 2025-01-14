import React, { useState } from 'react';
import BasicInfoForm from './forms/BasicInfoForm';
import EducationAndHouseholdForm from './forms/EducationAndHouseholdForm';
import EconomicStatusForm from './forms/EconomicStatusForm';
import WorkExperienceForm from './forms/WorkExperienceForm';
import HealthAndProgramForm from './forms/HealthAndProgramForm';
import SummaryForm from './forms/SummaryForm';
import { useFormData } from '../hooks/useFormData';
import { useFormValidation } from '../hooks/useFormValidation';
import '../assets/css/seniorForm.css';
import PdfPreviewModal from './PdfPreviewModal';

const SeniorJobApplicationForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [showPdfModal, setShowPdfModal] = useState(false);

  const { 
    formData, 
    photoPreview,
    handleChange,
    handlePhotoCapture,
    handlePostcodeSearch,
    handleEducationSelect,
    handleHouseholdSelect,
    handleFamilyMemberSelect,
    handleFamilyMemberCount,
    handleBasicLivingSelect,
    handleEconomicSelect,
    handleBasicPensionSelect,
    handleLongTermCareSelect,
    handleWorkExperienceSelect,
    handleYearSelect,
    handleVolunteerSelect,
    handleHealthInsuranceSelect,
    handleHealthSelect,
    handleMotiveSelect,
    handleHousingTypeSelect
  } = useFormData();

  const { validateCurrentStep, validateAllFields } = useFormValidation();

  const nextStep = () => {
    if (validateCurrentStep(step, formData)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      alert('필수 항목을 입력해주세요.');
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateAllFields(formData)) {
      setShowPdfModal(true);
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <BasicInfoForm 
            formData={formData}
            handleChange={handleChange}
            handlePhotoCapture={handlePhotoCapture}
            handlePostcodeSearch={handlePostcodeSearch}
            photoPreview={photoPreview}
          />
        );
      case 2:
        return (
          <EducationAndHouseholdForm 
            formData={formData}
            handleEducationSelect={handleEducationSelect}
            handleHouseholdSelect={handleHouseholdSelect}
            handleFamilyMemberSelect={handleFamilyMemberSelect}
            handleFamilyMemberCount={handleFamilyMemberCount}
            handleHousingTypeSelect={handleHousingTypeSelect}
          />
        );
      case 3:
        return (
          <EconomicStatusForm 
            formData={formData}
            handleBasicLivingSelect={handleBasicLivingSelect}
            handleEconomicSelect={handleEconomicSelect}
            handleBasicPensionSelect={handleBasicPensionSelect}
            handleChange={handleChange}
            handleLongTermCareSelect={handleLongTermCareSelect}
          />
        );
      case 4:
        return (
          <WorkExperienceForm 
            formData={formData}
            handleWorkExperienceSelect={handleWorkExperienceSelect}
            handleYearSelect={handleYearSelect}
            handleVolunteerSelect={handleVolunteerSelect}
            handleHealthInsuranceSelect={handleHealthInsuranceSelect}
          />
        );
      case 5:
        return (
          <HealthAndProgramForm 
            formData={formData}
            handleHealthSelect={handleHealthSelect}
            handleChange={handleChange}
            handleMotiveSelect={handleMotiveSelect}
          />
        );
      case 6:
        return (
          <SummaryForm 
            formData={formData}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="hmk-form-container">
      <div className="hmk-progress-container">
        <div className="hmk-progress-text">
          <span>작성 진행률</span>
          <span>{step} / {totalSteps}</span>
        </div>
        <div className="hmk-progress-bar">
          <div 
            className="hmk-progress-fill"
            style={{width: `${(step / totalSteps) * 100}%`}}
          />
        </div>
      </div>
      
      {renderStep()}
      
      <div className="hmk-navigation-buttons">
        {step > 1 && (
          <button 
            className="hmk-button hmk-prev-button"
            onClick={prevStep}
          >
            <span className="hmk-button-icon">👈</span>
            이전으로
          </button>
        )}
        
        {step < totalSteps ? (
          <button 
            className="hmk-button hmk-next-button"
            onClick={nextStep}
          >
            다음으로
            <span className="hmk-button-icon">👉</span>
          </button>
        ) : (
          <button 
            className="hmk-button hmk-submit-button"
            onClick={() => setShowPdfModal(true)}
          >
            신청서 미리보기
            <span className="hmk-button-icon">📄</span>
          </button>
        )}
      </div>
      
      {showPdfModal && (
        <PdfPreviewModal 
          onClose={() => setShowPdfModal(false)}
          formData={formData}
        />
      )}
    </div>
  );
};

export default SeniorJobApplicationForm;