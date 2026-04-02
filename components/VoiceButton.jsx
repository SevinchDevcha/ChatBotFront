import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

/**
 * VoiceButton — ovoz yozib olish tugmasi
 * onTranscribed: (text: string) => void  callback
 */
export default function VoiceButton({ onTranscribed, disabled }) {
  const { isRecording, isTranscribing, error, startRecording, stopRecording } =
    useVoiceRecorder({ onTranscribed });

  if (isTranscribing) {
    return (
      <button className="voice-btn transcribing" disabled title="Ovoz matnga o'tkazilmoqda...">
        <span className="voice-spinner" />
      </button>
    );
  }

  return (
    <button
      className={`voice-btn ${isRecording ? 'recording' : ''}`}
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      disabled={disabled}
      title={isRecording ? 'Qo\'yib yuboring — yuborish' : 'Bosib turing — gapiring'}
    >
      {isRecording ? (
        <StopIcon className="voice-icon" />
      ) : (
        <MicrophoneIcon className="voice-icon" />
      )}
    </button>
  );
}
