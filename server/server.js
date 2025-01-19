require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const apiKeysRouter = require('./routes/apiKeys');
const aiTestRouter = require('./routes/aiTest');

const app = express();

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000',  // 클라이언트 주소
    credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 설정
app.use('/api/apiKeys', apiKeysRouter);
app.use('/api/chat', aiTestRouter);

const PORT = process.env.PORT || 4000;

// 데이터베이스 동기화 후 서버 시작
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to sync database:', err);
}); 