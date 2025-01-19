import React, { useState } from 'react';
import { formatPhoneNumber } from '../../utils/formatHelper';
import { scrollToNextSection, scrollToNextButton } from '../../utils/scrollHelper';

const BasicInfoForm = ({ formData, handleChange, handlePhotoCapture, photoPreview, handlePostcodeSearch }) => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleInputChange = (e) => {
    handleChange(e);
    
    setTimeout(() => {
      const updatedFormData = {
        ...formData,
        [e.target.name]: e.target.value
      };
      
      if (updatedFormData.name && 
          updatedFormData.residentNumber1 && 
          updatedFormData.residentNumber2 && 
          updatedFormData.mobilePhone) {
        scrollToNextButton();
      } else {
        const currentGroup = e.target.closest('.hmk-input-group');
        if (currentGroup && currentGroup.nextElementSibling) {
          scrollToNextSection(currentGroup);
        }
      }
    }, 100);
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    handleInputChange({
      target: {
        name: 'mobilePhone',
        value: formattedNumber
      }
    });
  };

  const handleCameraCapture = async () => {
    try {
      // 카메라 스트림 가져오기
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',  // 전면 카메라 사용
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      // 비디오 요소 생성 및 스트림 연결
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;

      // 모달 생성
      const modal = document.createElement('div');
      modal.className = 'hmk-camera-modal';
      modal.innerHTML = `
        <div class="hmk-camera-container">
          <video autoplay playsinline></video>
          <div class="hmk-camera-controls">
            <button class="hmk-capture-btn">사진 촬영</button>
            <button class="hmk-cancel-btn">취소</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      const videoElement = modal.querySelector('video');
      videoElement.srcObject = stream;

      // 사진 촬영 버튼 이벤트
      const captureBtn = modal.querySelector('.hmk-capture-btn');
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        // 이미지를 File 객체로 변환
        canvas.toBlob((blob) => {
          const file = new File([blob], "camera_photo.jpg", { type: "image/jpeg" });
          handlePhotoCapture({ target: { files: [file] } });
          
          // 스트림 정지 및 모달 제거
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(modal);
        }, 'image/jpeg');
      };

      // 취소 버튼 이벤트
      const cancelBtn = modal.querySelector('.hmk-cancel-btn');
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

    } catch (err) {
      console.error('카메라 접근 에러:', err);
      alert('카메라에 접근할 수 없습니다. 파일 업로드를 이용해주세요.');
    }
  };

  return (
    <div className="hmk-form-section">
      <h2 className="hmk-section-title">기본 정보를 알려주세요</h2>
      
      <div 
        className="hmk-photo-upload-card"
        onClick={() => setShowPhotoModal(true)}
      >
        {photoPreview ? (
          <img src={photoPreview} alt="미미미리보기" className="hmk-photo-preview" />
        ) : (
          <div className="hmk-camera-icon">
            <span className="hmk-icon">📸</span>
            <p>여기를 눌러서 사진을 등록해주세요</p>
          </div>
        )}
      </div>

      {showPhotoModal && (
        <div className="hmk-photo-modal">
          <div className="hmk-photo-modal-content">
            <h3>사진 등록 방법을 선택해주세요</h3>
            <div className="hmk-photo-modal-buttons">
              <button 
                className="hmk-photo-modal-btn"
                onClick={() => {
                  handleCameraCapture();
                  setShowPhotoModal(false);
                }}
              >
                <span className="hmk-modal-icon">📸</span>
                카메라로 촬영하기
              </button>
              <label className="hmk-photo-modal-btn">
                <span className="hmk-modal-icon">🖼️</span>
                갤러리에서 선택하기
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handlePhotoCapture(e);
                    setShowPhotoModal(false);
                  }}
                  className="hmk-hidden-input"
                />
              </label>
            </div>
            <button 
              className="hmk-photo-modal-close"
              onClick={() => setShowPhotoModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="hmk-input-group">
        <label className="hmk-label">성함을 알려주세요</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
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
            onChange={handleInputChange}
            placeholder="앞 6자리"
            className="hmk-large-input"
          />
          <span className="hmk-separator">-</span>
          <input
            type="password"
            name="residentNumber2"
            maxLength="7"
            value={formData.residentNumber2}
            onChange={handleInputChange}
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
          onChange={handlePhoneChange}
          placeholder="예: 01012345678"
          className="hmk-large-input"
          maxLength="13"
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
            onChange={handleInputChange}
            className="hmk-large-input"
            placeholder="상세주소를 입력해주세요"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;