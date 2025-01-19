import { useState } from 'react';

export const useFormData = () => {
  const initialFormData = {
    // 기본 정보
    name: '',
    title: '',
    residentNumber1: '',
    residentNumber2: '',
    address: '',
    homePhone: '',
    mobilePhone: '',
    familyPhone: '',
    postcode: '',
    detailAddress: '',
    photo: null,
    
    // 최종학력
    education: '',
    
    // 세대구성 형태
    householdType: '',
    
    // 동거가족
    familyMembers: '',
    spouse: '',
    children: '',
    grandchildren: '',
    
    // 일자리사업 참여경력
    workExperience: {
      isNew: false,
      years: []
    },
    
    // 기초생활수급권자
    basicLivingRecipient: '',
    
    // 경제상태
    economicStatus: '',
    
    // 주거형태
    housingType: '',
    
    // 건강상태
    healthStatus: '',
    
    // 참여희망사업
    desiredPrograms: {
      first: '',
      second: '',
      third: ''
    },
    
    // 신청동기
    applicationMotives: [],
    
    // 자원봉사 참여
    volunteerWork: {
      participated: false,
      healthInsurance: ''
    },
    
    // 기초노령연금
    basicPensionStatus: {
      receiving: false,
      amount: ''
    },
    
    // 장기요양
    longTermCare: {
      status: false
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setFormData(prev => ({
          ...prev,
          postcode: data.zonecode,
          address: data.address,
          detailAddress: '',
        }));
      }
    }).open();
  };

  const handleEducationSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      education: value
    }));
  };

  const handleHouseholdSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      householdType: value,
      ...((['독신', '기타'].includes(value)) ? {
        spouse: false,
        children: false,
        grandchildren: false,
        childrenCount: 0,
        grandchildrenCount: 0
      } : {})
    }));
  };

  const handleFamilyMemberSelect = (memberType) => {
    setFormData(prev => ({
      ...prev,
      [memberType]: !prev[memberType],
      [`${memberType}Count`]: prev[memberType] ? 0 : (memberType === 'spouse' ? 1 : prev[`${memberType}Count`] || 0)
    }));
  };

  const handleFamilyMemberCount = (memberType, action) => {
    setFormData(prev => ({
      ...prev,
      [`${memberType}Count`]: Math.max(
        0,
        prev[`${memberType}Count`] + (action === 'increase' ? 1 : -1)
      )
    }));
  };

  const handleMotiveSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      applicationMotives: prev.applicationMotives.includes(value)
        ? prev.applicationMotives.filter(v => v !== value)
        : [...prev.applicationMotives, value]
    }));
  };

  const handleHealthSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      healthStatus: value
    }));
  };

  const handleEconomicSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      economicStatus: value
    }));
  };

  const handleBasicLivingSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      basicLivingRecipient: value
    }));
  };

  const handleBasicPensionSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      basicPensionStatus: {
        ...prev.basicPensionStatus,
        receiving: value
      }
    }));
  };

  const handleLongTermCareSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      longTermCare: {
        ...prev.longTermCare,
        status: value
      }
    }));
  };

  const handleHousingTypeSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      housingType: value
    }));
  };

  const handleHealthInsuranceSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      volunteerWork: {
        ...prev.volunteerWork,
        healthInsurance: String(value)
      }
    }));
  };

  const handleWorkExperienceSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        isNew: value,
        years: value ? prev.workExperience.years : []
      }
    }));
  };

  const handleVolunteerSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      volunteerWork: {
        ...prev.volunteerWork,
        participated: value
      }
    }));
  };

  const handleYearSelect = (year) => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        years: prev.workExperience.years.includes(year)
          ? prev.workExperience.years.filter(y => y !== year)
          : [...prev.workExperience.years, year]
      }
    }));
  };

  return {
    formData,
    photoPreview,
    handleChange,
    handlePhotoCapture,
    handlePostcodeSearch,
    handleEducationSelect,
    handleHouseholdSelect,
    handleFamilyMemberSelect,
    handleFamilyMemberCount,
    handleMotiveSelect,
    handleHealthSelect,
    handleEconomicSelect,
    handleBasicLivingSelect,
    handleBasicPensionSelect,
    handleLongTermCareSelect,
    handleHousingTypeSelect,
    handleHealthInsuranceSelect,
    handleWorkExperienceSelect,
    handleVolunteerSelect,
    handleYearSelect,
  };
}; 