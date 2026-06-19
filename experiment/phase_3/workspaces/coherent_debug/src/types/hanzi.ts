export interface VocabCharacterMapping {
  id?: string;
  vocab_item_id?: string;
  sequence_order: number;
  character: string;
  pinyin: string;
  tone: number; // 1 to 5
}

export interface VocabularyItem {
  id: string;
  list_id: string;
  hanzi: string;
  pinyin: string;
  english: string; // also mapped from 'definition'
  created_at?: string;
  updated_at?: string;
  character_mappings?: VocabCharacterMapping[];
}

export interface VocabularyList {
  id: string;
  user_id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  words?: VocabularyItem[];
}

export type LearningState = 'NEW' | 'RECOGNIZED' | 'ACTIVE_PRODUCTION' | 'MASTERED';

export interface UserVocabularyProgress {
  id: string;
  user_id: string;
  vocab_item_id: string;
  learning_state: LearningState;
  srs_interval_days: number;
  ease_factor: number;
  next_review_at: string;
  streak_count: number;
  last_reviewed_at?: string;
}

export type UsageStatus = 'CORRECT' | 'INCORRECT_GRAMMAR' | 'IMPROVED_PHRASING';

export interface JournalVocabEvaluation {
  vocab_item_id: string;
  character: string;
  status: UsageStatus;
}

export interface JournalFeedback {
  id?: string;
  journal_entry_id?: string;
  corrected_content: string;
  grammar_notes: string;
  vocab_evaluation?: JournalVocabEvaluation[];
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  target_vocab_list_id?: string;
  vocab_matched_count?: number;
  feedback?: JournalFeedback;
}
