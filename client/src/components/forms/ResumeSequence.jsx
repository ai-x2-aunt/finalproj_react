import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faArrowLeft, faCheck, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/resumeSequence.css';
import { voiceService } from '../../api/voiceService';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';

const ResumeSequence = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        address: '',
    });
    const [isListening, setIsListening] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);
    const inputRef = useRef(null);
    const sectionsRef = useRef([]);
    const { isRecording, error, startRecording } = useVoiceRecording();

    // TTS 기능
    const speak = async (text) => {
        try {
            const audioUrl = await voiceService.textToSpeech(text);
            const audio = new Audio(audioUrl);
            await audio.play();
        } catch (error) {
            console.error('TTS 실행 중 오류 발생:', error);
        }
    };

    // STT 기능
    const startListening = async (field) => {
        try {
            const mediaRecorder = await startRecording();
            
            // 3초 후 자동 종료
            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 3000);

            mediaRecorder.onstop = async () => {
                const text = await voiceService.speechToText(audioBlob);
                if (text) {
                    setFormData(prev => ({
                        ...prev,
                        [field]: text
                    }));
                }
            };
        } catch (error) {
            console.error('음성 인식 중 오류 발생:', error);
        }
    };

    const handleConfirm = (step) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step]);
            setCurrentStep(step + 1);
            
            // 약간의 지연 후 스크롤 실행
            setTimeout(() => {
                const nextSection = sectionsRef.current[step];
                if (nextSection) {
                    nextSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);

            // 다음 질문 읽어주기
            const nextQuestion = getQuestionForStep(step + 1);
            if (nextQuestion) {
                setTimeout(() => {
                    speak(nextQuestion);
                }, 500);
            }
        }
    };

    const getQuestionForStep = (step) => {
        switch(step) {
            case 1: return '이름이 어떻게 되세요?';
            case 2: return '나이가 어떻게 되세요?';
            case 3: return '전화번호가 어떻게 되세요?';
            case 4: return '어디 사세요?';
            default: return '';
        }
    };

    // 나이 선택을 위한 버튼 그룹 컴포넌트
    const AgeButtonGroup = ({ value, onChange, disabled }) => (
        <div className="hmk-age-buttons">
            {['50대', '60대', '70대', '80대', '90대 이상'].map((age) => (
                <button
                    key={age}
                    type="button"
                    className={`hmk-age-button ${value === age ? 'selected' : ''}`}
                    onClick={() => onChange('age', age)}
                    disabled={disabled}
                >
                    {age}
                </button>
            ))}
        </div>
    );

    // 각 섹션 컴포넌트
    const Section = ({ step, question, field, value, onChange, onConfirm, isCompleted }) => {
        const [isEditing, setIsEditing] = useState(false);

        const handleEdit = (e) => {
            // input 필드나 버튼을 클릭했을 때는 이벤트 처리하지 않음
            if (e.target.tagName.toLowerCase() === 'input' || 
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('button')) {
                return;
            }
            if (isCompleted && !isEditing) {
                setIsEditing(true);
            }
        };

        const handleInputClick = (e) => {
            e.stopPropagation();
            if (isCompleted && !isEditing) {
                setIsEditing(true);
            }
        };

        const handleUpdate = (e) => {
            e.stopPropagation();
            setIsEditing(false);
            onConfirm(step);
        };

        const handleInputChange = (e) => {
            e.stopPropagation();
            onChange(field, e.target.value);
        };

        return (
            <div 
                ref={el => sectionsRef.current[step-1] = el}
                className={`hmk-sequence-section ${isCompleted ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}
                onClick={handleEdit}
            >
                <div className="hmk-sequence-content">
                    <h2 className="hmk-sequence-question">
                        {question}
                    </h2>

                    {step === 2 ? (
                        <div className="hmk-input-container">
                            <AgeButtonGroup 
                                value={value}
                                onChange={onChange}
                                disabled={isCompleted && !isEditing}
                            />
                            {(!isCompleted || isEditing) && (
                                <button 
                                    className="hmk-confirm-button"
                                    onClick={isEditing ? handleUpdate : () => onConfirm(step)}
                                    disabled={!value}
                                >
                                    <FontAwesomeIcon icon={isEditing ? faCheck : faArrowDown} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="hmk-input-container" onClick={e => e.stopPropagation()}>
                            <input
                                type={field === 'phone' ? 'tel' : 'text'}
                                className="hmk-sequence-input"
                                placeholder={
                                    field === 'phone' ? '010-0000-0000' :
                                    field === 'address' ? '시/군/구까지 입력해주세요' :
                                    '입력해주세요'
                                }
                                value={value}
                                onChange={handleInputChange}
                                onClick={handleInputClick}
                                disabled={isCompleted && !isEditing}
                            />
                            {(!isCompleted || isEditing) && (
                                <>
                                    <button 
                                        className={`hmk-voice-button ${isRecording ? 'recording' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startListening(field);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMicrophone} />
                                    </button>
                                    <button 
                                        className="hmk-confirm-button"
                                        onClick={handleUpdate}
                                        disabled={!value.trim()}
                                    >
                                        <FontAwesomeIcon icon={isEditing ? faCheck : faArrowDown} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="hmk-sequence-container">
            <div className="hmk-sequence-header">
                <button 
                    className="hmk-back-button"
                    onClick={() => navigate(-1)}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="hmk-progress-bar">
                    <div className="hmk-progress-track">
                        <div 
                            className="hmk-progress-fill"
                            style={{ width: `${(completedSteps.length / 10) * 100}%` }}
                        ></div>
                    </div>
                    <span className="hmk-progress-step">{completedSteps.length}/10</span>
                </div>
            </div>

            <div className="hmk-sections-container">
                <Section 
                    step={1}
                    question="이름이 어떻게 되세요?"
                    field="name"
                    value={formData.name}
                    onChange={(field, value) => setFormData(prev => ({...prev, [field]: value}))}
                    onConfirm={handleConfirm}
                    isCompleted={completedSteps.includes(1)}
                />
                {completedSteps.includes(1) && (
                    <Section 
                        step={2}
                        question="나이가 어떻게 되세요?"
                        field="age"
                        value={formData.age}
                        onChange={(field, value) => setFormData(prev => ({...prev, [field]: value}))}
                        onConfirm={handleConfirm}
                        isCompleted={completedSteps.includes(2)}
                    />
                )}
                {completedSteps.includes(2) && (
                    <Section 
                        step={3}
                        question="전화번호가 어떻게 되세요?"
                        field="phone"
                        value={formData.phone}
                        onChange={(field, value) => setFormData(prev => ({...prev, [field]: value}))}
                        onConfirm={handleConfirm}
                        isCompleted={completedSteps.includes(3)}
                    />
                )}
                {completedSteps.includes(3) && (
                    <Section 
                        step={4}
                        question="어디 사세요?"
                        field="address"
                        value={formData.address}
                        onChange={(field, value) => setFormData(prev => ({...prev, [field]: value}))}
                        onConfirm={handleConfirm}
                        isCompleted={completedSteps.includes(4)}
                    />
                )}
            </div>
        </div>
    );
};

export default ResumeSequence; 