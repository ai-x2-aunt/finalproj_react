import React from 'react';

const PdfPreviewModal = ({ onClose, formData }) => {
  return (
    <div className="hmk-modal-overlay">
      <div className="hmk-modal-content">
        <div className="hmk-modal-header">
          <h2>신청서 미리보기</h2>
          <button 
            className="hmk-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="hmk-modal-body">
          {/* PDF 미리보기 내용 */}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal; 