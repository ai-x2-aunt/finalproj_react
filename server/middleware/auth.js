const devAuthMiddleware = (req, res, next) => {
    // 개발 환경에서만 사용
    if (process.env.NODE_ENV === 'development') {
        req.user = { id: 1 }; // 테스트용 사용자 ID
    }
    next();
};

module.exports = devAuthMiddleware; 