import React from 'react';

const BasicInfoForm = ({ formData, handleChange, handlePhotoCapture, photoPreview, handlePostcodeSearch }) => {
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
};

export default BasicInfoForm; 