# HanziFlow - Product Design Document

## 1. Executive Summary & Value Proposition
HanziFlow is a scientifically optimized Chinese vocabulary studying and journaling application designed to maximize student retention and eliminate tone-confusion/cognitive friction. By integrating active Pinyin recall, customized audio speed adjustments, and daily journaling, learners bridge the gap between passive recognition and active production.

## 2. Target Users
- **Beginner to Intermediate Chinese Learners**: Students struggling to bridge characters with Pinyin pronunciation, often facing the "tone barrier."
- **Self-Directed Polyglots**: Efficiency-oriented language learners who already maintain custom vocabulary CSVs or Anki decks.
- **Journalers**: Learners seeking to practice output (writing sentences) but lacking a structured way to verify recall of key vocabulary in context.

## 3. Onboarding & User Retention Loops
To minimize drop-off and maximize GTM validation:
- **Zero-Friction Initial State**: Users start with a high-value default vocabulary pack (e.g., standard HSK words) pre-loaded in the browser cache, letting them try the Pinyin Recall Card and Audio Player immediately.
- **Dual Visual Reinforcement (Pinyin + Hanzi)**: To prevent cognitive friction and tone-confusion, characters are always displayed alongside Pinyin (with toggle options for hiding/showing Pinyin during recall tests).
- **Daily Journaling Streak**: Interactive calendar streaks and prompt recommendations that encourage the user to write at least one sentence per day using newly imported vocabulary.

## 4. MVP Feature Selection (Speed-to-Market Focus)
1. **Pinyin Recall Card**: Flashcards displaying characters, pinyin, and English. The user is prompted to recall the correct Pinyin (including tones) and can toggle visibility or test themselves.
2. **CSV Vocabulary Import**: A simple, robust parser allowing users to bulk-import characters, Pinyin, and English translations.
3. **Audio Player with Speed Slider**: Uses the browser's native `SpeechSynthesis` (or a server-side audio endpoint) to read Hanzi and Pinyin aloud, with an intuitive custom speed slider (constrained to a safe range of `0.5x` to `2.0x` to avoid audio distortion).
4. **Vocab Journal & Recall Feedback**: A rich text or plain text journal entry area where users write daily thoughts or sentences using target vocabulary. The system detects which vocabulary words were intended, evaluates recall, and logs progress.

## 5. Monetization Pathways
- **Free Tier (Frictionless Acquisition)**:
  - Up to 50 active vocabulary cards.
  - Standard text-to-speech audio with basic speed settings.
  - Standard vocabulary CSV import.
- **Premium Tier ($9.99/month - High LTV Upgrade)**:
  - Unlimited vocabulary cards and CSV imports.
  - Advanced audio settings (precise custom speed slider and voice model selections).
  - AI-powered Journal Feedback: Contextual grammatical corrections and recall validation.
  - Progress insights and calendar history.
