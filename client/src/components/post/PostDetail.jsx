import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../assets/json/jobs_with_details.json';
import KakaoMap from './KakaoMap';
import '../../assets/css/PostDetail.css';
import scrapIcon from '../../assets/images/material-symbols_bookmark-outline.png';
import scrapIconFill from '../../assets/images/material-symbols_bookmark-outline-checked.png';

const PostDetail = () => {
    const { domain, id } = useParams();
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const jobPosting = (domain === 'job' || domain === 'work24') 
        ? data.채용공고목록.find((job) => job.채용공고ID === id) 
        : null;

    if ((domain === 'job' || domain === 'work24') && jobPosting) {
        const details = jobPosting?.상세정보?.세부요건 || [];
        const basicInfo = details[0] || {};
        const jobTypeInfo = details[1] || {};
        const workConditionInfo = details[2] || {};
        const applicationInfo = details[3] || {};
        // const qualificationInfo = details[4] || {};
        const contactInfo = details[5] || {};
        const registrationInfo = details[6] || {};

        const calculateDday = (deadlineStr) => {
            if (!deadlineStr || deadlineStr.includes('채용시까지')) {
                return '채용시까지';
            }
            const dateStr = deadlineStr.split('\n')[0];
            const [, month, day] = dateStr.split('.');
            return `~${parseInt(month)}월${parseInt(day)}일`;
        };

        return (
            <div className="container">
                <header className="header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        목록보기
                    </button>
                    <h1 className="title">공고 정보</h1>
                    <button className="share-button">공유</button>
                </header>

                <div className="content">
                    <div className="registration-date">
                        등록일시: {registrationInfo?.['채용공고 등록일시']?.[0] || ''}
                    </div>

                    <div className="company-name">{jobPosting?.회사명}</div>
                    <h2 className="job-title">{jobPosting?.채용제목}</h2>

                    <div className="tab-container">
                        <button className="tab">
                            {calculateDday(applicationInfo?.접수마감일?.[0])}
                        </button>
                        <button className="tab">
                            {basicInfo?.학력?.[0]?.includes('무관') ? '학력무관' : '학력필요'}
                        </button>
                        <button className="tab">
                            {basicInfo?.경력조건?.[0]?.includes('무관') ? '경력무관' : '경력필요'}
                        </button>
                    </div>

                    <section className="section">
                        <h3 className="section-title">모집요강</h3>
                        <div className="info-table">
                            <div className="info-row">
                                <span className="label">모집직종</span>
                                <span className="value">{jobTypeInfo?.모집직종?.[0] || ''}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">근무시간</span>
                                <span className="value">
                                    {workConditionInfo?.근무시간?.[0]?.split('\n')[0] || ''}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">경력조건</span>
                                <span className="value">
                                    {basicInfo?.경력조건?.[0]?.split('\n')[0] || ''}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">학력</span>
                                <span className="value">{basicInfo?.학력?.[0] || ''}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">고용형태</span>
                                <span className="value">{basicInfo?.고용형태?.[0] || ''}</span>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h3 className="section-title">근무조건</h3>
                        <div className="info-table">
                            <div className="info-row">
                                <span className="label">임금조건</span>
                                <span className="value">
                                    {workConditionInfo?.임금조건?.[0]?.split('\n')[0] || ''}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">근무예정지</span>
                                <span className="value">
                                    {basicInfo?.근무예정지?.[0]}
                                    {basicInfo?.근무예정지?.[0] && (
                                        <div style={{ width: '100%' }}>
                                            <KakaoMap address={basicInfo.근무예정지[0]} />
                                        </div>
                                    )}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">근무형태</span>
                                <span className="value">{workConditionInfo?.근무형태?.[0] || ''}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">사회보험</span>
                                <span className="value">
                                    {workConditionInfo?.사회보험?.[0]?.split('\n').map((insurance, index, arr) => (
                                        <span key={index}>
                                            {insurance}
                                            {index < arr.length - 1 && ', '}
                                        </span>
                                    )) || ''}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">퇴직급여</span>
                                <span className="value">{workConditionInfo?.퇴직급여?.[0] || ''}</span>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h3 className="section-title">직무내용</h3>
                        <ul className="detail-list">
                            {jobPosting?.상세정보?.직무내용
                                ?.split('\n')
                                .filter(line => line.trim() && !line.includes('직무내용'))
                                .map((line, index) => (
                                    <li key={index} className="detail-item">{line}</li>
                                ))}
                        </ul>
                    </section>

                    <section className="section">
                        <h3 className="section-title">지원방법</h3>
                        <div className="info-table">
                            <div className="info-row">
                                <span className="label">전형방법</span>
                                <span className="value">{applicationInfo?.전형방법?.[0] || ''}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">접수방법</span>
                                <span className="value">{applicationInfo?.접수방법?.[0] || ''}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">제출서류</span>
                                <span className="value">
                                    {applicationInfo?.['제출서류 준비물']?.[0] || ''}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">채용공고</span>
                                <span className="value">
                                    <a 
                                        href={jobPosting?.채용공고URL} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="url-link"
                                    >
                                        채용공고 바로가기
                                    </a>
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">마감일</span>
                                <span className="value">
                                    {applicationInfo?.접수마감일?.[0]?.split('\n')[0] || ''}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="contact-info">
                        <h3 className="section-title contact">채용담당자 정보</h3>
                        <div className="info-table">
                            <div className="info-row">
                                <span className="label">담당자</span>
                                <span className="value">
                                    {(() => {
                                        const deptManager = contactInfo?.['부서/담당자']?.[0];
                                        const manager = contactInfo?.담당자?.[0];
                                        
                                        if (deptManager) {
                                            const lines = deptManager.split('\n').filter(line => line.trim());
                                            return lines[lines.length - 1] || '';
                                        } else if (manager) {
                                            return manager;
                                        }
                                        return '';
                                    })()}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">전화번호</span>
                                <span className="value">{contactInfo?.전화번호?.[0] || ''}</span>
                            </div>
                            {contactInfo?.휴대폰번호?.[0] && 
                             contactInfo?.휴대폰번호?.[0] !== '-' && 
                             !contactInfo?.휴대폰번호?.[0].includes('로그인') && (
                                <div className="info-row">
                                    <span className="label">휴대폰번호</span>
                                    <span className="value">{contactInfo.휴대폰번호[0]}</span>
                                </div>
                            )}
                            {contactInfo?.팩스번호?.[0] && contactInfo?.팩스번호?.[0] !== '' && (
                                <div className="info-row">
                                    <span className="label">팩스번호</span>
                                    <span className="value">{contactInfo.팩스번호[0]}</span>
                                </div>
                            )}
                            {contactInfo?.이메일?.[0] && 
                             !contactInfo?.이메일?.[0].includes('로그인') && 
                             !contactInfo?.이메일?.[0].includes('E-MAIL :') && (
                                <div className="info-row">
                                    <span className="label">이메일</span>
                                    <span className="value">{contactInfo.이메일[0]}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="button-container">
                        <button
                            className="apply-button"
                            onClick={() =>
                                jobPosting?.채용공고URL &&
                                window.open(jobPosting.채용공고URL, '_blank')
                            }
                        >
                            지원하기
                        </button>
                        <button 
                            className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                        >
                            <img src={isBookmarked ? scrapIconFill : scrapIcon} alt="스크랩" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <div>잘못된 접근입니다.</div>;
};

export default PostDetail;
