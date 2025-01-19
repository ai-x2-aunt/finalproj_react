import React from 'react';
import seniorImage from '../../assets/images/c2d34df85d952c96c293f9898da44605.png';
import '../../assets/css/welcome.css';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="hmk-form-section">
            <div className="hmk-welcome-header">
                <h1 className="hmk-welcome-title">
                    <span>시니어JobGo</span>
                </h1>
            </div>

            <div className="hmk-welcome-content">
                <p className="hmk-welcome-text">
                    활기찬 인생 2막,<br />
                    지금 시작하세요.
                </p>

                <p className="hmk-welcome-subtext">
                    새로운 시작에는 나이 제한이 없습니다.<br />
                    당신의 경험이 우리 사회의 보물입니다.

                </p>

                <div className="hmk-welcome-image">
                    <img
                        src={seniorImage}
                        alt="시니어 채팅 이미지"
                    />
                </div>
            </div>

            <div className="hmk-welcome-footer">
                <button 
                    className="hmk-register-button"
                    onClick={() => navigate('/register')}
                >
                    회원가입
                </button>
                <span 
                    className="hmk-guest-link"
                    onClick={() => navigate('/resume/start')}
                >
                    비회원으로 시작하기
                </span>
                <div className="hmk-login-section">
                    <span>이미 가입하셨나요?</span>
                    <span className="hmk-login-link">로그인하기</span>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
