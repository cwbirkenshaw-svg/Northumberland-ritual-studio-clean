import { PLATFORM } from "@/config/editionConfig";
import { generateRitualSpeech } from "./geminiService";
import { VoiceName, Office } from "@/types";

export type AudioMode = 'GEMINI' | 'BROWSER' | 'DISABLED';

export interface AudioStatus {
  mode: AudioMode;
  message: string;
}

/**
 * AudioController manages the dual-mode TTS system.
 * It attempts Gemini TTS first and falls back to Browser SpeechSynthesis on failure.
 */
export class AudioController {
  private currentMode: AudioMode = 'GEMINI';
  private onStatusChange?: (status: AudioStatus) => void;
  private activeGeminiSource: AudioBufferSourceNode | null = null;

  constructor(onStatusChange?: (status: AudioStatus) => void) {
    this.onStatusChange = onStatusChange;
  }

  private log(msg: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AudioController] ${msg}`);
    }
  }

  private setStatus(mode: AudioMode, message: string) {
    this.currentMode = mode;
    this.onStatusChange?.({ mode, message });
    this.log(`Status Update: ${mode} - ${message}`);
  }

  /**
   * Plays a single line of ritual text.
   * Attempts Gemini first, then falls back to Browser TTS.
   */
  async playLine(
    text: string,
    audioCtx: AudioContext,
    voice: VoiceName,
    office?: Office
  ): Promise<void> {
    // Ensure we start fresh
    this.stop();
    
    try {
      this.log(`Gemini Request Start: "${text.substring(0, 40)}..."`);
      const result = await generateRitualSpeech(text, audioCtx, voice, office);
      
      if (result) {
        this.log(`Gemini Success (Source: ${result.source})`);
        this.setStatus('GEMINI', 'Voice: Gemini');
        
        return new Promise((resolve) => {
          const source = audioCtx.createBufferSource();
          source.buffer = result.buffer;
          source.connect(audioCtx.destination);
          this.activeGeminiSource = source;
          
          source.onended = () => {
            this.activeGeminiSource = null;
            resolve();
          };
          source.start(0);
        });
      } else {
        this.log("Gemini returned null result (possibly sanitized to empty)");
      }
    } catch (err: any) {
      const errMsg = err?.message || JSON.stringify(err);
      this.log(`Gemini Fail: ${errMsg}`);
    }

    // Fallback to Browser TTS
    this.log("Fallback Activation: Browser TTS");
    this.setStatus('BROWSER', 'Voice: Browser (fallback)');
    return this.speakWithBrowser(text);
  }

  /**
   * Ensures voices are loaded before attempting to speak.
   */
  private ensureVoicesLoaded(): Promise<void> {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        this.log("Voices load timeout fallback triggered.");
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve();
      }, 1500);

      const handler = () => {
        clearTimeout(timeout);
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve();
      };

      window.speechSynthesis.addEventListener('voiceschanged', handler);
    });
  }

  /**
   * Internal helper for Browser SpeechSynthesis
   */
  private async speakWithBrowser(text: string): Promise<void> {
    // 1) Cancel any pending speech to clear the buffer
    window.speechSynthesis.cancel();

    // 2) Ensure voices are loaded
    await this.ensureVoicesLoaded();

    // 3) Pre-roll delay to allow the engine to initialize
    await new Promise(resolve => setTimeout(resolve, 200));

    return new Promise((resolve) => {
      // 4) Sanitize the text
      let sanitizedText = text
        .replace(/\[.*?\]/g, 'Brother')
        .replace(/\(.*?\)/g, '')
        .replace(/\b([BJTMS])---/g, '$1') // Handle masked passwords for TTS
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[—–]/g, '-')
        .replace(/\s+/g, ' ')
        .trim();

      // Remove leading invisible characters
      sanitizedText = sanitizedText.replace(/^[\x00-\x1F\x7F-\x9F]+/, '');

      // Prefix if it starts with punctuation to prevent clipping
      if (/^[^a-zA-Z0-9]/.test(sanitizedText)) {
        sanitizedText = "Now, " + sanitizedText;
      }

      if (!sanitizedText) {
        this.log("Browser TTS: Text empty after sanitization, skipping.");
        resolve();
        return;
      }

      // 6) Debug log
      const voiceName = window.speechSynthesis.getVoices()[0]?.name || 'Default';
      this.log(`TTS Start: "${sanitizedText.substring(0, 20)}" | Voice: ${voiceName}`);

      const utterance = new SpeechSynthesisUtterance(sanitizedText);
      utterance.rate = 0.95; // Slightly slower for ritual clarity
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        this.log("Browser TTS: Finished speaking.");
        resolve();
      };
      
      utterance.onerror = (e) => {
        this.log(`Browser TTS Error: ${e.error}`);
        this.setStatus('DISABLED', 'Voice: Disabled');
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stops all active speech (Gemini and Browser)
   */
  stop() {
    if (this.activeGeminiSource) {
      try {
        this.activeGeminiSource.stop();
        this.log("Gemini playback stopped.");
      } catch (e) {
        // Source might have already stopped
      }
      this.activeGeminiSource = null;
    }
    
    // Always cancel to clear any pending queue instantly
    window.speechSynthesis.cancel();
    this.log("Browser TTS stopped.");
  }

  /**
   * Runs a self-test of the audio system
   */
  async testVoice(audioCtx: AudioContext): Promise<string> {
    const testText = `${PLATFORM.name} voice test. This is a test line.`;
    this.log("Running Voice Test...");
    await this.playLine(testText, audioCtx, 'Zephyr');
    return this.currentMode === 'GEMINI' ? 'Gemini' : 'Browser (fallback)';
  }
}
