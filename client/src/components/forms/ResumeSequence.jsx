import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faArrowLeft, faCheck, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/resumeSequence.css';
import { voiceService } from '../../api/voiceService';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';
import axios from 'axios';

// 미리 녹음된 안내 음성 파일 import
const audioGuides = {
    1: '/static/audio/guides/name_question.mp3',    // "이름이 어떻게 되세요?"
    2: '/static/audio/guides/age_question.mp3',     // "나이가 어떻게 되세요?"
    3: '/static/audio/guides/phone_question.mp3',   // "전화번호가 어떻게 되세요?"
    4: '/static/audio/guides/address_question.mp3'  // "어디 사세요?"
};

const ResumeSequence = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(() => {
        // 로컬 스토리지에서 기존 데이터 불러오기
        const savedData = localStorage.getItem('resumeFormData');
        return savedData ? JSON.parse(savedData) : {
            name: '',
            age: '',
            phone: '',
            address: '',
        };
    });
    const [isListening, setIsListening] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);
    const inputRef = useRef(null);
    const sectionsRef = useRef([]);
    const { isRecording, error, startRecording, checkSilence } = useVoiceRecording();
    const [audioBlob, setAudioBlob] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // 폼 데이터가 변경될 때마다 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('resumeFormData', JSON.stringify(formData));
    }, [formData]);

    // 모든 단계가 완료되었는지 확인
    const isAllCompleted = completedSteps.length === 4;

    // 폼 제출 처리
    const handleSubmit = async () => {
        try {
            // 서버로 데이터 전송
            const response = await axios.post('http://localhost:8000/api/voice/resume', formData);
            if (response.data.success) {
                // 성공 시 로컬 스토리지 클리어
                localStorage.removeItem('resumeFormData');
                // 다음 페이지로 이동
                navigate('/success');
            }
        } catch (error) {
            console.error('폼 제출 중 오류:', error);
        }
    };

    // TTS 함수 수정
    const speak = async (step) => {
        try {
            const audioUrl = `http://localhost:8000${audioGuides[step]}`;
            const audio = new Audio(audioUrl);
            
            return new Promise((resolve) => {
                audio.onended = () => resolve();
                audio.onerror = () => {
                    console.error('오디오 재생 중 오류');
                    resolve();
                };
                audio.play();
            });
        } catch (error) {
            console.error('음성 안내 재생 중 오류:', error);
        }
    };

    // STT 기능 - 답변 받기
    const startListening = async (field) => {
        if (isProcessing) return;
        
        try {
            setIsProcessing(true);
            setIsListening(true);

            // 모든 필드에 대해 동일한 녹음 로직 사용
            const recordingTime = field === 'phone' ? 15000 : 8000;  // 전화번호는 15초, 나머지는 8초
            const silenceThreshold = field === 'phone' ? 8000 : 5000;  // 전화번호는 8초, 나머지는 5초 침묵

            return new Promise(async (resolve, reject) => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const mediaRecorder = new MediaRecorder(stream);
                    const audioChunks = [];

                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = async () => {
                        try {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                            let text = await voiceService.speechToText(audioBlob);
                            
                            if (field === 'phone') {
                                // 전화번호의 경우에만 숫자 변환 수행
                                const numbers_only = text.replace(/[^0-9]/g, '');
                                if (numbers_only.length >= 10) {
                                    text = `${numbers_only.slice(0,3)}-${numbers_only.slice(3,7)}-${numbers_only.slice(7)}`;
                                } else {
                                    text = numbers_only;
                                }
                            } else if (field === 'address') {
                                // 주소 입력의 경우 주소 매칭
                                const matchResult = await voiceService.matchAddress(text);
                                if (matchResult.matched_address) {
                                    const addr = matchResult.matched_address;
                                    text = `${addr.city} ${addr.district} ${addr.town} ${addr.road_name} ${addr.building_main_num}${addr.building_sub_num ? '-'+addr.building_sub_num : ''}`;
                                }
                            }
                            // 이름과 나이는 변환 없이 그대로 사용

                            setFormData(prev => ({...prev, [field]: text}));
                            resolve(text);
                        } catch (error) {
                            console.error('음성 인식 오류:', error);
                            reject(error);
                        } finally {
                            setIsListening(false);
                            setIsProcessing(false);
                        }
                    };

                    mediaRecorder.start();

                    // 녹음 중지 타이머
                    setTimeout(() => {
                        if (mediaRecorder.state === 'recording') {
                            mediaRecorder.stop();
                        }
                    }, recordingTime);

                    // 침묵 감지 로직
                    let lastAudioTime = Date.now();
                    const silenceCheck = setInterval(() => {
                        if (audioChunks.length > 0 && Date.now() - lastAudioTime > silenceThreshold) {
                            clearInterval(silenceCheck);
                            if (mediaRecorder.state === 'recording') {
                                mediaRecorder.stop();
                            }
                        }
                        if (audioChunks.length > 0) {
                            lastAudioTime = Date.now();
                        }
                    }, 1000);
                } catch (error) {
                    reject(error);
                }
            });

        } catch (error) {
            console.error('음성 입력 오류:', error);
            setIsListening(false);
            setIsProcessing(false);
            throw error;
        }
    };

    // handleConfirm 함수 수정
    const handleConfirm = async (step) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step]);
            setCurrentStep(step + 1);
            
            // 다음 섹션으로 스크롤 - sectionsRef 활용
            setTimeout(() => {
                if (sectionsRef.current[step + 1]) {
                    sectionsRef.current[step + 1].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);

            // 다음 단계의 음성 안내 재생
            if (step + 1 <= 4) {  // 마지막 단계 체크
                await speak(step + 1);
            }
        }
    };

    // 질문 텍스트 가져오기
    const getQuestionForStep = (step) => {
        switch (step) {
            case 1:
                return "이름이 어떻게 되세요?";
            case 2:
                return "나이가 어떻게 되세요?";
            case 3:
                return "전화번호가 어떻게 되세요?";
            case 4:
                return "어디 사세요?";
            default:
                return "";
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
        const sectionRef = useRef(null);
        const [isListening, setIsListening] = useState(false);

        useEffect(() => {
            sectionsRef.current[step] = sectionRef.current;
        }, [step]);

        const handleVoiceInput = async () => {
            if (isProcessing) return;
            
            try {
                setIsListening(true);
                
                // 주소 필드인 경우
                if (field === 'address') {
                    await startListening('address');
                } else {
                    await startListening(field);
                }
                
            } catch (error) {
                console.error('음성 입력 오류:', error);
            } finally {
                setIsListening(false);
            }
        };

        return (
            <div 
                ref={sectionRef}
                className={`hmk-sequence-section ${isCompleted ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}
            >
                <div className="hmk-sequence-content">
                    <h2 className="hmk-sequence-question">
                        {question}
                    </h2>
                    {field === 'age' ? (
                        <div className="hmk-input-container">
                            <AgeButtonGroup 
                                value={value}
                                onChange={onChange}
                                disabled={false}
                            />
                        </div>
                    ) : (
                        <div className="hmk-input-container">
                            <input
                                type={field === 'phone' ? 'tel' : 'text'}
                                className={`hmk-sequence-input ${isCompleted ? 'completed' : ''}`}
                                value={value}
                                onChange={(e) => onChange(field, e.target.value)}
                                disabled={false}
                                placeholder={field === 'phone' ? '전화번호를 말씀해주세요' : 
                                           field === 'address' ? '주소를 말씀해주세요' : '말씀해주세요'}
                            />
                            <button 
                                className={`hmk-voice-button ${isListening ? 'listening' : ''}`}
                                onClick={handleVoiceInput}
                                disabled={isProcessing}
                            >
                                <FontAwesomeIcon icon={faMicrophone} />
                            </button>
                        </div>
                    )}
                    <div className="hmk-confirm-button-container">
                        <button 
                            className={`hmk-confirm-button ${!value ? 'disabled' : ''}`}
                            onClick={() => onConfirm(step)}
                            disabled={!value}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // 컴포넌트 마운트 시 첫 번째 안내 음성 재생
    useEffect(() => {
        localStorage.removeItem('resumeFormData');
        speak(1);  // 첫 번째 질문 재생
        return () => {
            localStorage.removeItem('resumeFormData');
        };
    }, []);

    const handleVoiceInput = async () => {
        try {
            setIsProcessing(true);
            
            // 1. 음성 녹음 시작
            await startRecording();
            
            // 2. 5초 동안 침묵 감지 시작
            checkSilence(async (audioBlob) => {
                if (!audioBlob) return;
                
                try {
                    // 3. STT 변환
                    const sttText = await voiceService.speechToText(audioBlob);
                    console.log("STT 결과:", sttText);
                    
                    // 4. 주소 매칭
                    const matchResult = await voiceService.matchAddress(sttText);
                    console.log("매칭 결과:", matchResult);
                    
                    // 5. 주소 설정
                    if (matchResult.matched_address) {
                        const addr = matchResult.matched_address;
                        const fullAddress = `${addr.city} ${addr.district} ${addr.town} ${addr.road_name} ${addr.building_main_num}${addr.building_sub_num ? '-'+addr.building_sub_num : ''}`;
                        setFormData(prev => ({...prev, address: fullAddress}));
                    }
                } catch (error) {
                    console.error('주소 처리 중 오류:', error);
                } finally {
                    setIsProcessing(false);
                }
            }, 5000); // 5초 침묵 감지
            
        } catch (error) {
            console.error('음성 입력 중 오류:', error);
            setIsProcessing(false);
        }
    };

    return (
        <div 
            className="hmk-sequence-container"
            onSubmit={e => e.preventDefault()}
        >
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

            {/* 모든 단계가 완료되면 제출 버튼 표시 */}
            {isAllCompleted && (
                <div className="hmk-sequence-footer">
                    <button 
                        className="hmk-submit-button"
                        onClick={handleSubmit}
                    >
                        제출하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeSequence; 