import React from 'react';
import '../../assets/css/postCard.css';
import bookmark from '../../assets/images/material-symbols_bookmark-outline.png';
import data from '../../assets/json/jobs_with_details.json';

const PostCard = ({ post }) => {
    // post 객체가 없는 경우 빈 컴포넌트 반환
    if (!post) return null;

    // 세부요건에서 필요한 정보 추출
    const details = post.상세정보.세부요건;

    // 각 항목을 찾을 때, 배열의 첫 번째 요소를 가져오는 대신, 배열의 첫 번째 요소의 첫 번째 값을 가져오도록 수정
    const 학력 = details.find(item => item.학력)?.학력?.[0] || "정보없음";
    const 경력조건 = details.find(item => item.경력조건)?.경력조건?.[0] || "정보없음";
    const 고용형태 = details.find(item => item.고용형태)?.고용형태?.[0] || "정보없음";
    const 모집직종 = details.find(item => item.모집직종)?.모집직종?.[0] || "정보없음";
    const 모집인원 = details.find(item => item.모집인원)?.모집인원?.[0]?.split('\n')[0] || "정보없음";
    const 근무시간 = details.find(item => item.근무시간)?.근무시간?.[0]?.split('\n')[0] || "정보없음";

    // 마감일 정보 추출 및 가공
    const 접수마감일 = details.find(item => item.접수마감일)?.접수마감일?.[0] || "";
    const 마감일 = 접수마감일.split('\n')[0] || "채용시";

    // 직종 정보 가공
    const 직종키워드 = details.find(item => item.직종키워드)?.직종키워드?.[0] || "기타";

    return (
        <div className="post-card">
            <div className="post-card-header">
                <div className="post-card-header-info">
                    <div className="post-card-header-info-type">
                        <p>{직종키워드}</p>
                    </div>
                    <div className="post-card-header-info-dday">
                        <p>~{마감일}</p>
                    </div>
                </div>
                <div className="post-card-header-company">
                    <p>{post.회사명}</p>
                </div>
                <div className="post-card-header-title">
                    <h1>{post.채용제목}</h1>
                </div>
            </div>
            <div className="post-card-body">
                <div className="post-card-body-table">
                    <div className="post-card-body-table-top">
                        <div className="table-row">
                            <span className="label">모집직종</span>
                            <span className="value">{모집직종}</span>
                        </div>
                        <div className="table-row">
                            <span className="label">모집인원</span>
                            <span className="value">{모집인원}</span>
                        </div>
                        <div className="table-row">
                            <span className="label">근무시간</span>
                            <span className="value">{근무시간}</span>
                        </div>
                        <div className="table-row">
                            <span className="label">경력조건</span>
                            <span className="value">{경력조건}</span>
                        </div>
                        <div className="table-row">
                            <span className="label">학력</span>
                            <span className="value">{학력}</span>
                        </div>
                        <div className="table-row">
                            <span className="label">고용형태</span>
                            <span className="value">{고용형태}</span>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="post-card-body-table-bottom">
                        <div className="table-row">
                            <span className="label">임금조건</span>
                            <span className="value">{post.급여조건}</span>
                        </div>
                        <div className="table-row">
                            <span className="label">근무예정지</span>
                            <span className="value">{post.근무지역}</span>
                        </div>
                    </div>
                    <hr className="divider" />
                </div>
            </div>
            <div className="post-card-footer">
                <button className="post-card-footer-detail" onClick={() => window.location.href = `/post/detail/work24/${post.채용공고ID}`}>상세보기</button>
                <button className="post-card-footer-bookmark">
                    <img src={bookmark} alt="스크랩" />
                </button>
            </div>
        </div>
    );
};

const PostList = () => {
    // jobs_with_details.json에서 채용공고 목록 가져오기
    const jobPostings = data.채용공고목록;

    return (
        <div className="post-section">
            {jobPostings.map((post, index) => (
                <PostCard key={post.공고번호} post={post} />
            ))}
        </div>
    );
};

export default PostList;
