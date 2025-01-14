import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import '../assets/css/seniorForm.css';
import ResumeTemplate from './ResumeTemplate';

const SeniorJobApplicationForm = () => {
  const [formData, setFormData] = useState({
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
  });

  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const educationOptions = [
    { value: '무학', label: '무학', icon: '📚' },
    { value: '초졸', label: '초등학교 졸업', icon: '🎓' },
    { value: '중졸', label: '중학교 졸업', icon: '🎓' },
    { value: '고졸', label: '고등학교 졸업', icon: '🎓' },
    { value: '전문대졸', label: '전문대학 졸업', icon: '🎓' },
    { value: '대졸이상', label: '대학교 졸업 이상', icon: '🎓' }
  ];

  const householdOptions = [
    { value: '독신', label: '혼자 살고 있어요', icon: '🏠' },
    { value: '가족동거(노부모,손자녀,장애인)', label: '벌이가 없는 가족과 함께', icon: '👨‍👩‍👧‍👦' },
    { value: '노인부부', label: '배우자와 함께 살고 있어요', icon: '👫' },
    { value: '가족동거(경제능력가족)', label: '돈을 벌어오는 가족과 함께', icon: '💼' },
    { value: '기타', label: '기타', icon: '📝' }
  ];

  const familyMemberOptions = [
    { value: 'spouse', label: '배우자', icon: '👫' },
    { value: 'children', label: '자녀', icon: '👨‍👩‍👧‍👦', needCount: true },
    { value: 'grandchildren', label: '손자손녀', icon: '👶', needCount: true }
  ];

  const economicStatusOptions = [
    { value: '매우좋음', label: '매우 좋아요', icon: '🌟' },
    { value: '좋음', label: '좋은 편이에요', icon: '😊' },
    { value: '보통', label: '보통이에요', icon: '😐' },
    { value: '나쁨', label: '어려운 편이에요', icon: '😕' },
    { value: '매우나쁨', label: '매우 어려워요', icon: '😢' }
  ];

  const healthStatusOptions = [
    { value: '매우건강', label: '매우 건강해요', icon: '💪' },
    { value: '건강', label: '건강한 편이에요', icon: '🏃' },
    { value: '보통', label: '보통이에요', icon: '🚶' },
    { value: '나쁨', label: '안 좋은 편이에요', icon: '🤒' },
    { value: '매우나쁨', label: '매우 안 좋아요', icon: '🏥' }
  ];

  const housingTypeOptions = [
    { value: '자가', label: '자가', icon: '🏠' },
    { value: '전세', label: '전세', icon: '🏢' },
    { value: '월세', label: '월세', icon: '🏡' },
    { value: '기타', label: '기타', icon: '🏘️' }
  ];

  const calculateAge = (residentNumber) => {
    const currentYear = new Date().getFullYear();
    const birthYearPrefix = residentNumber[0] <= '2' ? '20' : '19';
    const birthYear = parseInt(birthYearPrefix + residentNumber.slice(0, 2), 10);
    return currentYear - birthYear;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 중첩된 객체 구조 처리 (예: desiredPrograms.first)
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
      // 기존 로직
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

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      alert('필수 항목을 입력해주세요.');
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
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
  };

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        setFormData(prev => ({
          ...prev,
          postcode: data.zonecode,
          address: data.address,
          detailAddress: '',
        }));
      }
    }).open();
  };

  const handleFamilyRelationChange = (relation, field, value) => {
    setFormData(prev => ({
      ...prev,
      familyRelations: {
        ...prev.familyRelations,
        [relation]: {
          ...prev.familyRelations[relation],
          [field]: value
        }
      }
    }));
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
      // 독신이나 기타 선택 시 가족 구성원 초기화
      ...(['독신', '기타'].includes(value) ? {
        spouse: false,
        children: false,
        grandchildren: false,
        childrenCount: 0,
        grandchildrenCount: 0
      } : {})
    }));
  };

  const handleEconomicSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      economicStatus: value
    }));
  };

  const handleHealthSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      healthStatus: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPdfModal(true);
  };

  const validateAllFields = () => {
    if (!formData.name || !formData.residentNumber1 || !formData.residentNumber2) {
      return false;
    }

    if (!formData.education || !formData.householdType) {
      return false;
    }

    if (!formData.basicLivingRecipient || !formData.economicStatus) {
      return false;
    }

    return true;
  };

  const handleMotiveSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      applicationMotives: prev.applicationMotives.includes(value)
        ? prev.applicationMotives.filter(v => v !== value)
        : [...prev.applicationMotives, value]
    }));
  };

  const handleBasicLivingSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      basicLivingRecipient: value
    }));
  };

  const handleFamilyMemberSelect = (memberType) => {
    setFormData(prev => ({
      ...prev,
      [memberType]: !prev[memberType],
      [`${memberType}Count`]: prev[memberType] ? 0 : (memberType === 'spouse' ? 1 : prev[`${memberType}Count`] || 0),
      // 기타 선택 해제 시 설명 초기화
      ...(memberType === 'other' && prev.other ? { otherDescription: '' } : {})
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

  const handleOtherDescription = (e) => {
    setFormData(prev => ({
      ...prev,
      otherDescription: e.target.value
    }));
  };

  const handleBasicPensionSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      basicPensionStatus: {
        ...prev.basicPensionStatus,
        receiving: value,
        // 수급 여부가 false로 변경되면 금액 초기화
        amount: value ? prev.basicPensionStatus.amount : ''
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

  const handleWorkExperienceSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        isNew: value,
        // 처음이라고 선택하면 연도 배열 초기화
        years: value ? prev.workExperience.years : []
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

  const handleVolunteerSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      volunteerWork: {
        ...prev.volunteerWork,
        participated: value
      }
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

  const PdfPreviewModal = () => {
    return (
      <div className="hmk-modal-overlay">
        <div className="hmk-modal-content">
          <div className="hmk-modal-header">
            <h2>신청서 미리보기</h2>
            <button 
              className="hmk-modal-close"
              onClick={() => setShowPdfModal(false)}
            >
              ×
            </button>
          </div>
          <div className="hmk-modal-body">
            <ResumeTemplate formData={formData} />
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="hmk-form-section">
            <h2 className="hmk-section-title">기본 정보를 알려주세요</h2>
            
            <div className="hmk-photo-upload-card">
              {photoPreview ? (
                <img src={photoPreview} alt="미리보기" className="hmk-photo-preview" />
              ) : (
                <div className="hmk-camera-icon">
                  <span className="hmk-icon">📸</span>
                  <p>여기를 눌러서 사진을 등록해주세요</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={handlePhotoCapture}
                className="hmk-hidden-input"
              />
            </div>

            <div className="hmk-input-group">
              <label className="hmk-label">성함을 알려주세요</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 홍길동"
                className="hmk-large-input"
              />
            </div>

            <div className="hmk-input-group">
              <label className="hmk-label">주민등록번호를 입력해주세요</label>
              <div className="hmk-resident-number">
                <input
                  type="text"
                  name="residentNumber1"
                  maxLength="6"
                  value={formData.residentNumber1}
                  onChange={handleChange}
                  placeholder="앞 6자리"
                  className="hmk-large-input"
                />
                <span className="hmk-separator">-</span>
                <input
                  type="password"
                  name="residentNumber2"
                  maxLength="7"
                  value={formData.residentNumber2}
                  onChange={handleChange}
                  placeholder="뒤 7자리"
                  className="hmk-large-input"
                />
              </div>
            </div>

            <div className="hmk-input-group">
              <label className="hmk-label">휴대폰 번호를 입력해주세요</label>
              <input
                type="tel"
                name="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleChange}
                placeholder="예: 010-1234-5678"
                className="hmk-large-input"
              />
            </div>

            <div className="hmk-input-group">
              <label className="hmk-label">주소를 입력해주세요</label>
              <div className="hmk-address-group">
                <div className="hmk-postcode-row">
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    className="hmk-large-input hmk-postcode"
                    placeholder="우편번호"
                    readOnly
                  />
                  <button 
                    type="button" 
                    className="hmk-button hmk-address-search-btn"
                    onClick={handlePostcodeSearch}
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  className="hmk-large-input"
                  placeholder="기본주소"
                  readOnly
                />
                <input
                  type="text"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleChange}
                  className="hmk-large-input"
                  placeholder="상세주소를 입력해주세요"
                />
              </div>
            </div>
          </div>
        );

      case 2:
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
                      {option.needDescription && formData[option.value] && (
                        <input
                          type="text"
                          className="hmk-large-input hmk-other-input"
                          placeholder="관계를 입력해주세요"
                          value={formData.otherDescription || ''}
                          onChange={handleOtherDescription}
                        />
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

      case 3:
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
                  onClick={() => handleBasicLivingSelect(option.value)}
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
                  onClick={() => handleEconomicSelect(option.value)}
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
                  onClick={() => handleBasicPensionSelect(option.value)}
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
                  onClick={() => handleLongTermCareSelect(option.value)}
                >
                  <span className="hmk-card-icon">{option.icon}</span>
                  <span className="hmk-card-label">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
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
                  onClick={() => handleWorkExperienceSelect(option.value)}
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
                  {['2023', '2022', '2021'].map(year => (
                    <label key={year} className="hmk-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.workExperience.years.includes(year)}
                        onChange={() => handleYearSelect(year)}
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
                  onClick={() => handleVolunteerSelect(option.value)}
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
                  onClick={() => handleHealthInsuranceSelect(option.value)}
                >
                  <span className="hmk-card-icon">{option.icon}</span>
                  <span className="hmk-card-label">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
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
                <option value="공공시설봉사">공공시설 봉사</option>
                <option value="노노케어">노노케어</option>
                <option value="취약계층지원">취약계층 지원</option>
                <option value="공공전문직">공공전문직</option>
                <option value="경비">경비</option>
                <option value="보육교사도우미">보육교사 도우미</option>
              </select>

              <label className="hmk-label">2순위 (선택)</label>
              <select
                name="desiredPrograms.second"
                value={formData.desiredPrograms.second}
                onChange={handleChange}
                className="hmk-large-input"
              >
                <option value="">선택해주세요</option>
                <option value="공공시설봉사">공공시설 봉사</option>
                <option value="노노케어">노노케어</option>
                <option value="취약계층지원">취약계층 지원</option>
                <option value="공공전문직">공공전문직</option>
                <option value="경비">경비</option>
                <option value="보육교사도우미">보육교사 도우미</option>
              </select>

              <label className="hmk-label">3순위 (선택)</label>
              <select
                name="desiredPrograms.third"
                value={formData.desiredPrograms.third}
                onChange={handleChange}
                className="hmk-large-input"
              >
                <option value="">선택해주세요</option>
                <option value="공공시설봉사">공공시설 봉사</option>
                <option value="노노케어">노노케어</option>
                <option value="취약계층지원">취약계층 지원</option>
                <option value="공공전문직">공공전문직</option>
                <option value="경비">경비</option>
                <option value="보육교사도우미">보육교사 도우미</option>
              </select>
            </div>

            <h2 className="hmk-section-title">신청 동기를 선택해주세요 (여러 개 선택 가능)</h2>
            <div className="hmk-card-grid">
              {[
                { value: '경제적도움', label: '경제적인 도움이 필요해요', icon: '💰' },
                { value: '자기발전', label: '새로운 것을 배우고 싶어요', icon: '📚' },
                { value: '사회참여', label: '사회활동에 참여하고 싶어요', icon: '🤝' },
                { value: '시간활용', label: '시간을 의미있게 보내고 싶어요', icon: '⏰' },
                { value: '건강증진', label: '건강을 위해서예요', icon: '💪' },
                { value: '기타', label: '다른 이유가 있어요', icon: '✨' }
              ].map(option => (
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

      case 6:
        return (
          <div className="hmk-form-section">
            <h2 className="hmk-section-title">입력하신 내용을 확인해주세요</h2>
            <div className="hmk-summary-content">
              <p>성함: {formData.name}</p>
              <p>주민등록번호: {formData.residentNumber1}-{formData.residentNumber2} (만 {calculateAge(formData.residentNumber1)} 세)</p>
              <p>휴대폰: {formData.mobilePhone}</p>
              <p>주소: {formData.address} {formData.detailAddress}</p>
              <p>학력: {formData.education}</p>
              <p>세대구성: {formData.householdType}</p>
              <p>주거형태: {formData.housingType}</p>
              <p>건강상태: {formData.healthStatus}</p>
              <p>희망직종 1순위: {formData.desiredPrograms.first}</p>
              <p>신청동기: {formData.applicationMotives.join(', ')}</p>
              <p>일자리 사업 참여경력: {formData.workExperience.isNew ? '참여한 적 있음' : '금년도 신규참여'}</p>
              {formData.workExperience.isNew && (
                <p>참여 연도: {formData.workExperience.years.join(', ')}</p>
              )}
              <p>동거가족: {formData.spouse || formData.children || formData.grandchildren ? '있음' : '없음'}</p>
            </div>
          </div>
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
            onClick={handleSubmit}
          >
            작성 완료
            <span className="hmk-button-icon">✅</span>
          </button>
        )}
      </div>
      {showPdfModal && <PdfPreviewModal />}
    </div>
  );
};

export default SeniorJobApplicationForm;