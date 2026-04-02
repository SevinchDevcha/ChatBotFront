import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

/**
 * VoiceButton — ovoz yozib olish tugmasi
 * onTranscribed: (text: string) => void  callback
 * onTranscribingChange: (isTranscribing: boolean) => void  callback
 */
const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function VoiceButton({ onTranscribed, onTranscribingChange, disabled }) {
  const { isRecording, isTranscribing, error, recordingSeconds, startRecording, stopRecording } =
    useVoiceRecorder({ onTranscribed, onTranscribingChange });

  if (isTranscribing) {
    return (
      <button className="voice-btn transcribing" disabled title="Matnga o'tkazilmoqda...">
        <span className="voice-spinner" />
        <span className="voice-label">Matnga o'tkazilmoqda...</span>
      </button>
    );
  }

  if (isRecording) {
    return (
      <button
        className="voice-btn recording"
        onMouseUp={stopRecording}
        onTouchEnd={stopRecording}
        title="Qo'yib yuboring — yuborish"
      >
        <StopIcon className="voice-icon" />
        <span className="voice-timer">{formatTime(recordingSeconds)}</span>
      </button>
    );
  }

  return (
    <button
      className="voice-btn"
      onMouseDown={startRecording}
      onTouchStart={startRecording}
      disabled={disabled}
      title="Bosib turing — gapiring"
    >
      <MicrophoneIcon className="voice-icon" />
    </button>
  );
}
