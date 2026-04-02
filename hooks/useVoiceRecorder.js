import { useState, useRef, useCallback } from 'react';
import { voiceApi } from '../services/api';

/**
 * useVoiceRecorder hook
 * Brauzer MediaRecorder API orqali ovoz yozib oladi,
 * so'ngra Whisper STT ga yuboradi
 */
export function useVoiceRecorder({ onTranscribed }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Streamni to'xtatamiz
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const { text } = await voiceApi.transcribe(blob);
          onTranscribed(text);
        } catch (err) {
          setError('Ovozni matnga o\'tkarishda xatolik');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      setError('Mikrofonga ruxsat berilmadi');
    }
  }, [onTranscribed]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, isTranscribing, error, startRecording, stopRecording };
}
