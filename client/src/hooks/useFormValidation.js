import { useCallback } from 'react';

export const useFormValidation = () => {
  const validateCurrentStep = useCallback((step, formData) => {
    switch(step) {
      case 1:
        return formData.name && 
               formData.residentNumber1 && 
               formData.residentNumber2 && 
               formData.mobilePhone;
      case 2:
        return formData.education && formData.householdType;
      case 3:
        return formData.basicLivingRecipient && formData.economicStatus;
      case 4:
        return formData.workExperience.isNew !== undefined;
      case 5:
        return formData.desiredPrograms.first;
      default:
        return true;
    }
  }, []);

  const validateAllFields = useCallback((formData) => {
    return !!(
      formData.name &&
      formData.residentNumber1 &&
      formData.residentNumber2 &&
      formData.education &&
      formData.householdType &&
      formData.basicLivingRecipient &&
      formData.economicStatus &&
      formData.desiredPrograms.first
    );
  }, []);

  return {
    validateCurrentStep,
    validateAllFields
  };
}; 