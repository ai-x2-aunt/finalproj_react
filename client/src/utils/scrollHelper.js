export const scrollToNextSection = (currentElement) => {
  if (!currentElement) return;
  
  let nextSection;
  
  if (currentElement instanceof Element) {
    // DOM 요소가 직접 전달된 경우
    nextSection = currentElement;
  } else {
    // 카드 클릭 이벤트의 경우
    const section = currentElement.closest('.hmk-section-title, .hmk-card-grid');
    if (!section) return;
    nextSection = section.nextElementSibling;
  }

  if (nextSection) {
    setTimeout(() => {
      const offset = window.innerHeight * 0.2; // 20% of viewport height
      const elementPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }, 300);
  }
};

export const scrollToNextButton = () => {
  setTimeout(() => {
    const nextButton = document.querySelector('.hmk-next-button');
    if (nextButton) {
      const rect = nextButton.getBoundingClientRect();
      const absoluteY = window.pageYOffset + rect.top;
      const offset = window.innerHeight * 0.2; // 20% of viewport height
      
      window.scrollTo({
        top: absoluteY - offset,
        behavior: 'smooth'
      });
    }
  }, 300);
};

export const checkAllSelectionsComplete = (formData, step) => {
  if (!formData) return false;
  
  switch(step) {
    case 2: // EducationAndHouseholdForm
      return formData.education && formData.householdType && formData.housingType;
    case 3: // EconomicStatusForm
      return formData.basicLivingRecipient && 
             formData.economicStatus && 
             formData.basicPensionStatus.receiving !== undefined &&
             formData.longTermCare.status !== undefined;
    case 4: // WorkExperienceForm
      return formData.workExperience.isNew !== undefined && 
             formData.volunteerWork.participated !== undefined &&
             formData.volunteerWork.healthInsurance !== undefined;
    case 5: // HealthAndProgramForm
      return formData.healthStatus && 
             formData.desiredPrograms.first &&
             formData.applicationMotives.length > 0;
    default:
      return false;
  }
}; 