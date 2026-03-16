import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName, Office } from "../types";
import { OFFICE_VOICE_MAP } from "../constants";

// Singleton AI instance with lazy, robust initialization
let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (aiInstance) return aiInstance;
  
  let apiKey = '';
  // Check for GEMINI_API_KEY (platform standard) or API_KEY (user-defined)
  if (typeof process !== 'undefined' && process.env) {
    apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  }
  
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

// --- PERSISTENT STORAGE (INDEXEDDB) ---
const DB_NAME = 'RitualAudioDB';
const STORE_NAME = 'audio_cache';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getStoredAudio = async (key: string): Promise<ArrayBuffer | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

const saveAudioToStore = async (key: string, data: ArrayBuffer) => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data, key);
  } catch (e) {
    console.error("Storage Error", e);
  }
};

// --- AUDIO UTILS ---
const decodeBase64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeRawPcmToAudioBuffer = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return audioBuffer;
};

export const generateRitualSpeech = async (
  text: string, 
  audioCtx: AudioContext,
  preferredVoice: VoiceName = 'Zephyr',
  office?: Office
): Promise<{ buffer: AudioBuffer; source: 'API' | 'CACHE' } | null> => {
  const voiceToUse = office ? (OFFICE_VOICE_MAP[office] as VoiceName || preferredVoice) : preferredVoice;
  const cacheKey = `${voiceToUse}-${text}`;
  
  // 1. Check Persistent Storage
  const archivedData = await getStoredAudio(cacheKey);
  if (archivedData) {
    const uint8 = new Uint8Array(archivedData);
    const buffer = await decodeRawPcmToAudioBuffer(uint8, audioCtx, 24000, 1);
    return { buffer, source: 'CACHE' };
  }

  try {
    const ai = getAI();
    // Sanitize text: remove placeholders like [Name], stage directions, and normalize punctuation
    const sanitizedText = text
      .replace(/\[.*?\]/g, 'Brother') // Replace [Name] with 'Brother'
      .replace(/\(.*?\)/g, '')        // Remove stage directions in parentheses
      .replace(/\b([BJTMS])---/g, '$1') // Handle masked passwords for TTS
      .replace(/[‘’]/g, "'")          // Normalize smart quotes
      .replace(/[“”]/g, '"')
      .replace(/[—–]/g, '-')          // Normalize dashes
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .trim();

    if (!sanitizedText) return null;

    const prompt = `Speak this ritual line: ${sanitizedText}`;
    
    // Retry logic for transient 500 errors
    let response;
    let attempts = 0;
    const maxAttempts = 4; // Increased retries

    while (attempts < maxAttempts) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceToUse },
              },
            },
          },
        });
        break; // Success
      } catch (err: any) {
        attempts++;
        const errStr = err?.message || JSON.stringify(err);
        console.warn(`TTS Attempt ${attempts} failed for text "${sanitizedText.substring(0, 20)}...":`, errStr);
        
        if (attempts >= maxAttempts) throw err;
        // Exponential backoff
        await new Promise(r => setTimeout(r, 1000 * attempts));
      }
    }

    if (!response) return null;
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const pcmData = decodeBase64ToUint8Array(base64Audio);
    
    // 2. Save to Persistent Storage asynchronously
    saveAudioToStore(cacheKey, pcmData.buffer);

    const buffer = await decodeRawPcmToAudioBuffer(pcmData, audioCtx, 24000, 1);
    return { buffer, source: 'API' };
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    
    const errorDetail = error?.message || JSON.stringify(error);
    console.error("Masonic Audio Engine Error Detail:", errorDetail);
    
    if (errorDetail.includes('500') || errorDetail.includes('INTERNAL')) {
      throw new Error("SERVER_ERROR");
    }
    
    return null;
  }
};