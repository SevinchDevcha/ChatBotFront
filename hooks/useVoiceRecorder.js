import { useState, useRef, useCallback, useEffect } from 'react';
import { voiceApi } from '../services/api';

/**
 * useVoiceRecorder hook
 * Brauzer MediaRecorder API orqali ovoz yozib oladi,
 * so'ngra Whisper STT ga yuboradi
 */
export function useVoiceRecorder({ onTranscribed, onTranscribingChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);

  useEffect(() => {
    onTranscribingChange?.(isTranscribing);
  }, [isTranscribing, onTranscribingChange]);

  const startRecording = useCallback(async () => {
    setError(null);
    setRecordingSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        clearInterval(timerRef.current);
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
          setRecordingSeconds(0);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setError('Mikrofonga ruxsat berilmadi');
    }
  }, [onTranscribed, onTranscribingChange]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, isTranscribing, error, recordingSeconds, startRecording, stopRecording };
}
