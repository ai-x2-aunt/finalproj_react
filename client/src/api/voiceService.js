import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const voiceService = {
    // TTS 요청
    textToSpeech: async (text) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/voice/tts`, { text });
            return response.data;
        } catch (error) {
            console.error('TTS Error:', error);
            throw error;
        }
    },

    // STT 요청
    speechToText: async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob);

            const response = await axios.post(`${API_BASE_URL}/api/voice/stt`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data.text;
        } catch (error) {
            console.error('STT Error:', error);
            throw error;
        }
    }
}; 