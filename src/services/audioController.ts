class AudioController {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPaused = false;

  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }
    return window.speechSynthesis.getVoices();
  }

  speak(
    text: string,
    options?: {
      voiceName?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
      onError?: (event: SpeechSynthesisErrorEvent) => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!text?.trim()) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.getVoices();

    if (options?.voiceName) {
      const selectedVoice = voices.find((v) => v.name === options.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;
    utterance.volume = options?.volume ?? 1;

    utterance.onend = () => {
      this.utterance = null;
      this.isPaused = false;
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      this.utterance = null;
      this.isPaused = false;
      options?.onError?.(event);
    };

    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  pause() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    this.utterance = null;
    this.isPaused = false;
  }

  isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }

  getPaused(): boolean {
    return this.isPaused;
  }
}

export const audioController = new AudioController();
export default audioController;
