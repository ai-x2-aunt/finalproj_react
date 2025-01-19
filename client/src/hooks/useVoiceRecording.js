import { useState, useCallback } from 'react';
import { voiceService } from '../api/voiceService';

export const useVoiceRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);

    const startRecording = useCallback(async () => {
        try {
            setIsRecording(true);
            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                try {
                    const text = await voiceService.speechToText(audioBlob);
                    return text;
                } catch (err) {
                    setError('음성 인식에 실패했습니다.');
                    console.error(err);
                } finally {
                    setIsRecording(false);
                }
            };

            mediaRecorder.start();
            return mediaRecorder;
        } catch (err) {
            setError('마이크 접근에 실패했습니다.');
            setIsRecording(false);
            console.error(err);
        }
    }, []);

    return { isRecording, error, startRecording };
}; 