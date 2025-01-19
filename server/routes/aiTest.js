const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const devAuthMiddleware = require('../middleware/auth');
const db = require('../models');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.use(devAuthMiddleware);

// 암호화 설정
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;

// API 키 복호화 함수
const decryptApiKey = (encrypted, iv) => {
    try {
        const decipher = crypto.createDecipheriv(
            algorithm, 
            Buffer.from(secretKey), 
            Buffer.from(iv, 'hex')
        );
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('API 키 복호화 실패');
    }
};

// Chat 테스트
router.post('/test', async (req, res) => {
    try {
        const { prompt, responseFormat, functions, settings } = req.body;
        const { provider } = req.query;

        console.log('Test request received:', { provider, prompt });

        // API 키 가져오기
        const apiKeyRecord = await db.ApiKey.findOne({
            where: { 
                userId: req.user.id,
                provider 
            }
        });

        if (!apiKeyRecord) {
            return res.status(400).json({ 
                error: 'API 키가 설정되어 있지 않습니다.' 
            });
        }

        let response;
        const decryptedApiKey = decryptApiKey(apiKeyRecord.encryptedKey, apiKeyRecord.iv);

        if (provider === 'openai') {
            console.log('Calling OpenAI API...');
            
            try {
                const openai = new OpenAI({
                    apiKey: decryptedApiKey
                });

                let completionOptions;
                if (settings.model === 'o1-mini') {
                    completionOptions = {
                        model: 'o1-mini',
                        messages: [{ role: "user", content: prompt }],
                        temperature: 1,  // o1-mini는 temperature 1만 지원
                        max_completion_tokens: settings.maxTokens || 2000
                    };
                } else if (settings.model === 'gpt-4o-mini') {
                    completionOptions = {
                        model: 'gpt-4o-mini',
                        messages: [{ role: "user", content: prompt }],
                        temperature: settings.temperature || 0.7,
                        max_completion_tokens: settings.maxTokens || 2000,
                        top_p: settings.topP || 1,
                        frequency_penalty: settings.frequencyPenalty || 0,
                        presence_penalty: settings.presencePenalty || 0
                    };
                } else {
                    // 기본값으로 gpt-4o-mini 사용
                    completionOptions = {
                        model: 'gpt-4o-mini',
                        messages: [{ role: "user", content: prompt }],
                        temperature: settings.temperature || 0.7,
                        max_completion_tokens: settings.maxTokens || 2000,
                        top_p: settings.topP || 1,
                        frequency_penalty: settings.frequencyPenalty || 0,
                        presence_penalty: settings.presencePenalty || 0
                    };
                }

                console.log('OpenAI API options:', completionOptions);
                const completion = await openai.chat.completions.create(completionOptions);
                response = completion.choices[0].message.content;
            } catch (error) {
                console.error('OpenAI API Error:', error);
                throw new Error(error.message || 'OpenAI API 호출 중 오류가 발생했습니다.');
            }
        } else if (provider === 'google') {
            console.log('Calling Google AI API...');
            const genAI = new GoogleGenerativeAI(decryptedApiKey);
            const model = genAI.getGenerativeModel({ 
                model: settings.model || 'gemini-pro'
            });

            const result = await model.generateContent(prompt);
            response = result.response.text();
        } else {
            throw new Error('지원하지 않는 AI 제공자입니다.');
        }

        console.log('AI Response received:', response);

        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            response: response,
            type: "chat",
            status: "success"
        });
    } catch (error) {
        console.error('Chat test error:', error);
        res.status(500).json({ 
            error: '서버 오류', 
            details: error.message 
        });
    }
});

// TTS 테스트
router.post('/tts', async (req, res) => {
    try {
        const { text, settings } = req.body;
        const { provider } = req.query;

        console.log('TTS test request received:', { provider, text });

        // API 키 가져오기
        const apiKeyRecord = await db.ApiKey.findOne({
            where: { 
                userId: req.user.id,
                provider 
            }
        });

        if (!apiKeyRecord) {
            return res.status(400).json({ 
                error: 'API 키가 설정되어 있지 않습니다.' 
            });
        }

        const decryptedApiKey = decryptApiKey(apiKeyRecord.encryptedKey, apiKeyRecord.iv);
        let audioContent;

        if (provider === 'openai') {
            console.log('Calling OpenAI TTS API...');
            const openai = new OpenAI({
                apiKey: decryptedApiKey
            });

            const mp3 = await openai.audio.speech.create({
                model: settings.model || "tts-1",
                voice: settings.voice || "alloy",
                input: text,
                speed: settings.speed || 1.0
            });

            audioContent = Buffer.from(await mp3.arrayBuffer());
        } else if (provider === 'google') {
            console.log('Calling Google TTS API...');
            // Google Cloud TTS API 구현
            // 현재는 더미 응답
            audioContent = Buffer.from('dummy audio content');
        } else {
            throw new Error('지원하지 않는 AI 제공자입니다.');
        }

        console.log('TTS Response received');
        
        // 오디오 파일 전송
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioContent);
    } catch (error) {
        console.error('TTS test error:', error);
        res.status(500).json({ 
            error: '서버 오류', 
            details: error.message 
        });
    }
});

// STT 테스트
router.post('/stt', async (req, res) => {
    try {
        const audioFile = req.files?.audio;
        if (!audioFile) {
            return res.status(400).json({ error: '오디오 파일이 없습니다.' });
        }

        const { provider } = req.query;
        const settings = JSON.parse(req.body.settings);

        console.log('STT test request received:', { provider });

        // API 키 가져오기
        const apiKeyRecord = await db.ApiKey.findOne({
            where: { 
                userId: req.user.id,
                provider 
            }
        });

        if (!apiKeyRecord) {
            return res.status(400).json({ 
                error: 'API 키가 설정되어 있지 않습니다.' 
            });
        }

        const decryptedApiKey = decryptApiKey(apiKeyRecord.encryptedKey, apiKeyRecord.iv);
        let transcription;

        if (provider === 'openai') {
            console.log('Calling OpenAI STT API...');
            const openai = new OpenAI({
                apiKey: decryptedApiKey
            });

            const transcript = await openai.audio.transcriptions.create({
                file: audioFile.data,
                model: settings.model || "whisper-1"
            });

            transcription = transcript.text;
        } else if (provider === 'google') {
            console.log('Calling Google STT API...');
            // Google Cloud STT API 구현
            // 현재는 더미 응답
            transcription = "음성 인식 테스트 결과입니다.";
        } else {
            throw new Error('지원하지 않는 AI 제공자입니다.');
        }

        console.log('STT Response received:', transcription);

        res.json({ 
            success: true, 
            text: transcription 
        });
    } catch (error) {
        console.error('STT test error:', error);
        res.status(500).json({ 
            error: '서버 오류', 
            details: error.message 
        });
    }
});

module.exports = router; 