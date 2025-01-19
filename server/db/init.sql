-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS senior_jobgo_db;
USE senior_jobgo_db;

-- 사용자 생성 및 권한 부여
CREATE USER IF NOT EXISTS 'senior_jobgo_user'@'localhost' IDENTIFIED BY '비밀번호입력';
GRANT ALL PRIVILEGES ON senior_jobgo_db.* TO 'senior_jobgo_user'@'localhost';
FLUSH PRIVILEGES;

-- ApiKeys 테이블 생성
CREATE TABLE IF NOT EXISTS ApiKeys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    encryptedKey TEXT NOT NULL,
    iv VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_provider (userId, provider)
); 