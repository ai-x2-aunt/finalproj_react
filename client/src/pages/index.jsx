// Main.js

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'; // Axios 임포트
import { v4 as uuidv4 } from 'uuid'; // UUID 임포트
import '../assets/css/main.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatbotIcon from '../assets/images/chatbot-icon.png';

const Main = () => {
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ age: '', location: '', jobType: '' });

  const chatContainerRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '안녕하세요. 시니어잡고입니다.\n본 챗봇은 상담원과의 실시간 채팅 서비스는 운영되지 않습니다'
    },
    {
      type: 'bot',
      text: '안녕하세요. 시니어잡고입니다.\n어떤 도움이 필요하신가요?',
      options: [
        { id: 1, text: '채용 정보' },
        { id: 2, text: '훈련 정보' },
        { id: 3, text: '이력서 관리' }
      ]
    }
  ]);

  const [sessionId, setSessionId] = useState('');

  // 컴포넌트가 마운트될 때 세션 ID 설정
  useEffect(() => {
    let storedSessionId = localStorage.getItem('session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    if(text.length <= 200 && !text.includes('\n')) {
      setInputText(text);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newText = inputText + pastedText;

    if(newText.length <= 200) {
      setInputText(newText);
    } else {
      setInputText(newText.slice(0, 200));
    }
  }

  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmedText = inputText.trim();
    if(trimmedText === '') return;

    // 사용자의 메시지를 채팅에 추가
    setMessages(prevMessages => [
      ...prevMessages,
      {
        type: 'user',
        text: trimmedText,
      },
    ]);
    setInputText('');

    console.log(`Sending message to session ${sessionId}: ${trimmedText}`);

    try {
      // 메시지를 백엔드 API로 전송
      const response = await axios.post('http://localhost:8000/chat/', {
        user_message: trimmedText,
        user_profile: userInfo, // 현재 사용자 정보 전송
        session_id: sessionId // 세션 ID 포함
      });

      console.log('Received response:', response.data);

      const { responses, user_profile } = response.data;

      // 백엔드에서 업데이트된 userInfo 반영
      setUserInfo(user_profile);

      // 챗봇 응답을 채팅에 추가
      responses.forEach(botResponse => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            type: 'bot',
            text: botResponse,
          },
        ]);
        console.log(`Received bot response: ${botResponse}`);
      });

      // 백엔드 응답에 따라 사용자 정보 입력 폼 표시
      if (responses.some(response => response.includes("프로필 정보"))) {
        setShowUserInfoForm(true);
      }

    } catch (error) {
      console.error("메시지 전송 오류:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          type: 'bot',
          text: "죄송합니다. 메시지를 처리하는 중에 오류가 발생했습니다.",
        },
      ]);
    }
  }

  const handleOptionClick = (optionId) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'user',
        text: `옵션 ${optionId}번을 선택했습니다.`,
      },
    ]);
    if(optionId === 1) {
      setShowUserInfoForm(true);
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();

    const userInfoText = `입력하신 정보:\n나이: ${userInfo.age}\n희망근무지역: ${userInfo.location}\n희망직무: ${userInfo.jobType}\n\n이 정보를 바탕으로 채용 정보를 검색하겠습니다.`;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        type: 'bot',
        text: userInfoText
      }
    ]);

    setShowUserInfoForm(false);

    // 사용자 정보를 기반으로 일자리 검색 트리거
    try {
      const searchQuery = `${userInfo.jobType} ${userInfo.location}`;
      const response = await axios.post('http://localhost:8000/chat/', {
        user_message: searchQuery,
        user_profile: userInfo,
        session_id: sessionId
      });

      const { responses, user_profile } = response.data;

      setUserInfo(user_profile);

      responses.forEach(botResponse => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            type: 'bot',
            text: botResponse,
          },
        ]);
      });

    } catch (error) {
      console.error("일자리 검색 중 오류:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          type: 'bot',
          text: "죄송합니다. 일자리 검색 중 오류가 발생했습니다.",
        },
      ]);
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  // 메시지가 업데이트될 때마다 최신 메시지로 스크롤 이동
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if(chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
      <div className="main-container">
        <Header />
        <div className="chat-container">
          <div className="chat-header">
            <div className="chatbot-info">
              <img src={ChatbotIcon} alt="챗봇 아이콘" />
              <span>시니어잡봇과 채팅하기</span>
            </div>
            <button className="my-page">마이페이지</button>
          </div>

          <div className="chat-messages" ref={chatContainerRef}>
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  {message.type === 'bot' ? (
                      <div className="bot-message">
                        <img src={ChatbotIcon} alt="챗봇 아이콘" className="bot-icon" />
                        <div className="message-content">
                          {message.text.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < message.text.split('\n').length - 1 && <br />}
                              </React.Fragment>
                          ))}
                        </div>
                      </div>
                  ) : (
                      <div className="user-message">
                        <div className="message-content user">
                          {message.text.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                              </React.Fragment>
                          ))}
                        </div>
                      </div>
                  )}

                  {message.options && (
                      <div className="options-container">
                        {message.options.map((option) => (
                            <button
                                key={option.id}
                                className="option-button"
                                onClick={() => handleOptionClick(option.id)}
                            >
                              <span className="option-number">{option.id}</span>
                              <span className="option-text">{option.text}</span>
                            </button>
                        ))}
                      </div>
                  )}
                </div>
            ))}

            {showUserInfoForm && (
                <div className="message bot">
                  <div className="bot-message">
                    <img src={ChatbotIcon} alt="챗봇 아이콘" className="bot-icon" />
                    <div className="message-content">
                      <form onSubmit={handleUserInfoSubmit} className="user-info-form">
                        <input
                            type="number"
                            name="age"
                            value={userInfo.age}
                            onChange={handleUserInfoChange}
                            placeholder="나이"
                            required
                        />
                        <input
                            type="text"
                            name="location"
                            value={userInfo.location} // value 바인딩 수정
                            onChange={handleUserInfoChange} // onChange 핸들러 추가
                            placeholder="희망근무지역"
                            required
                        />
                        <input
                            type="text"
                            name="jobType"
                            value={userInfo.jobType}
                            onChange={handleUserInfoChange}
                            placeholder="희망직무"
                            required
                        />
                        <button type="submit">입력</button>
                      </form>
                    </div>
                  </div>
                </div>
            )}
          </div>

          <div className="chat-input">
          <textarea
              placeholder="메세지를 입력해주세요"
              className="message-input"
              value={inputText}
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
              onPaste={handlePaste}
              rows="1"
          />
            <button type="button" className="send-button" onClick={handleSubmit}>전송</button>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default Main;
