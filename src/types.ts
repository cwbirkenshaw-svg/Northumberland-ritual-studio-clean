
export enum Office {
  WM = 'Worshipful Master',
  IPM = 'Past Master',
  SW = 'Senior Warden',
  JW = 'Junior Warden',
  SD = 'Senior Deacon',
  JD = 'Junior Deacon',
  IG = 'Inner Guard',
  TIG = 'Temporary Inner Guard',
  TYLER = 'Tyler',
  CHAPLAIN = 'Chaplain',
  DC = 'Director of Ceremonies',
  CANDIDATE = 'Candidate'
}

export enum Degree {
  FIRST = '1st Degree',
  SECOND = '2nd Degree',
  THIRD = '3rd Degree',
  GENERAL = 'General/Installation'
}

export enum Working {
  NORTHUMBERLAND = 'Northumberland Working',
  EMULATION = 'Emulation Working',
  CUSTOM_RITUAL = 'Custom Ritual',
  YOUR_OWN_RITUAL = 'Your Own Ritual'
}

export enum RevealLevel {
  FULL = 'Full Text',
  FIRST_LETTERS = 'First Letters',
  BLIND = 'Blind (Audio Only)'
}

export enum AccessLevel {
  GUEST = 'GUEST',
  EA = 'EA',
  FC = 'FC',
  MM = 'MM',
  OFFICER = 'OFFICER'
}

export enum PromptFadeMode {
  OFF = 'off',
  LAST_WORD = 'lastWord',
  HALF_LINE = 'halfLine',
  FIRST_LETTERS = 'firstLetters',
  HIDE_LINE = 'hideLine'
}

export enum BgColor {
  CREAM = 'bg-[#FDF5E6]',
  MINT = 'bg-[#F0FFF0]',
  SKY = 'bg-[#e0f2fe]',
  PEACH = 'bg-[#FFE5D0]',
  WHITE = 'bg-white',
  DARK = 'bg-north-dark text-white'
}

export type VoiceName = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

export interface VoiceOption {
  id: VoiceName;
  label: string;
  description: string;
}

export type PackType = "CORE" | "CUSTOM";
export type OwnerScope = "USER" | "LODGE";

export interface RitualStep {
  seq: number;
  officer: string;
  officerKey?: string;
  workingKey?: string;
  workingTitle?: string;
  type: "speech" | "stage" | "dialogue";
  text: string;
}

export interface RitualPackSection {
  id: string;
  title: string;
  degree: Degree;
  steps: RitualStep[];
}

export interface RitualRole {
  id: string;
  name: string;
}

export interface RitualPack {
  pack_id: string;
  pack_type: PackType;
  pack_name: string;
  tradition_label: string;
  owner_scope: OwnerScope;
  lodge_name?: string;
  lodge_number?: string;
  province?: string;
  created_by: string;
  created_at_iso: string;
  version: string;
  disclaimer: string;
  schema_version: "1.0.0";
  working?: Working;
  roles: RitualRole[];
  sections: RitualPackSection[];
}

export interface RitualSection {
  id: string;
  degree: Degree;
  working: Working;
  title: string;
  office: Office;
  officerKey?: string;
  workingKey?: string;
  content: string[];
  steps?: RitualStep[];
  isCustom?: boolean; // Track if user created it
  locked?: boolean;
  pack_id?: string;
}

export interface AppSettings {
  bgColor: BgColor;
  playbackSpeed: number;
  revealLevel: RevealLevel;
  voiceName: VoiceName;
  voiceStyle: 'commanding' | 'steady' | 'eloquent';
  paperTint: 'white' | 'cream' | 'mint' | 'blue' | 'peach';
  readingSupport: boolean;
  textScale: number;
  reduceMotion: boolean;
  assistMode: boolean;
  focusMode: boolean;
  lineFocus: boolean;
  highlightCurrentBlock: boolean;
  promptFadeMode: PromptFadeMode;
}
