const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const devAuthMiddleware = require('../middleware/auth');
const db = require('../models');

// API 키 암호화를 위한 설정
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

// API 키 암호화 함수
const encryptApiKey = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
};

// API 키 복호화 함수
const decryptApiKey = (encrypted, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

router.use(devAuthMiddleware);

// API 키 저장
router.post('/:provider', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const { provider } = req.params;
        const userId = req.user.id;

        const encrypted = encryptApiKey(apiKey);

        const [apiKeyRecord, created] = await db.ApiKey.findOrCreate({
            where: { userId, provider },
            defaults: {
                encryptedKey: encrypted.encryptedData,
                iv: encrypted.iv
            }
        });

        if (!created) {
            await apiKeyRecord.update({
                encryptedKey: encrypted.encryptedData,
                iv: encrypted.iv
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('API 키 저장 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
});

// API 키 조회
router.get('/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        const userId = req.user.id;

        const apiKeyRecord = await db.ApiKey.findOne({
            where: { userId, provider }
        });

        if (!apiKeyRecord) {
            return res.json({ exists: false });
        }

        res.json({ exists: true });
    } catch (error) {
        console.error('API 키 조회 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
});

// API 키 삭제
router.delete('/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        const userId = req.user.id;

        await db.ApiKey.destroy({
            where: { userId, provider }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('API 키 삭제 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router; 