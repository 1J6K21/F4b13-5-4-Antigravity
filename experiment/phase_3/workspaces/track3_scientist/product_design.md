# HanziFlow - Scientific Product Design

## 1. Executive Summary & Value Proposition
HanziFlow is a scientifically optimized Chinese vocabulary studying and journaling application. It aims to maximize long-term retention and eliminate tone-confusion/cognitive friction. By integrating active Pinyin recall, customized audio speed adjustments, and daily journaling, learners bridge the gap between passive recognition and active production.

## 2. Pedagogical & Cognitive Assumptions
Our approach is grounded in three core cognitive science frameworks:
1. **Dual-Coding Theory (Paivio)**: Combining visual characters (Hanzi) with phonetic representations (Pinyin) and semantic meanings (English) creates multiple cognitive pathways, facilitating faster recall.
2. **Active Recall & Testing Effect**: Requiring learners to actively generate the Pinyin (including tone marks) rather than just recognizing the characters strengthens neural pathways.
3. **Cognitive Load & Auditory Processing**: Playback speed of SpeechSynthesis is constrained between `0.5x` and `2.0x`. 
   - *Lower bound (0.5x)*: Prevents phoneme distortion and vowel elongation that corrupts tone perception.
   - *Upper bound (2.0x)*: Avoids exceeding the average human auditory working memory processing rate for unfamiliar languages.

## 3. Target Users
- **Beginner to Intermediate Chinese Learners**: Students struggling to bridge characters with Pinyin pronunciation, often facing the "tone barrier."
- **Self-Directed Polyglots**: Efficiency-oriented language learners who already maintain custom vocabulary CSVs or Anki decks.
- **Journalers**: Learners seeking to practice output (writing sentences) but lacking a structured way to verify recall of key vocabulary in context.

## 4. Onboarding & User Retention Loops
- **Zero-Friction Initial State**: Users start with a high-value default vocabulary pack (standard HSK words) pre-loaded in the browser cache, letting them try the Pinyin Recall Card and Audio Player immediately.
- **Dual Visual Reinforcement (Pinyin + Hanzi)**: To prevent cognitive friction and tone-confusion, characters are always displayed alongside Pinyin (with toggle options for hiding/showing Pinyin during recall tests).
- **Daily Journaling Streak**: Interactive calendar streaks and prompt recommendations that encourage the user to write at least one sentence per day using newly imported vocabulary.

## 5. MVP Feature Selection
1. **Pinyin Recall Card**: Flashcards displaying characters, pinyin, and English. The user is prompted to recall the correct Pinyin (including tones) and can toggle visibility or test themselves.
2. **CSV Vocabulary Import**: A simple, robust parser allowing users to bulk-import characters, Pinyin, and English translations.
3. **Audio Player with Speed Slider**: Uses the browser's native `SpeechSynthesis` (or a server-side audio endpoint) to read Hanzi and Pinyin aloud, with an intuitive custom speed slider (constrained to a safe range of `0.5x` to `2.0x`).
4. **Vocab Journal & Recall Feedback**: A rich text or plain text journal entry area where users write daily thoughts or sentences using target vocabulary. The system detects which vocabulary words were intended, evaluates recall, and logs progress.

## 6. Tone Accuracy Scoring Logic
We employ a Normalized Levenshtein Distance metric customized for tonal comparison.
- Let $T_{user}$ be the user's input pinyin string and $T_{actual}$ be the target pinyin string.
- Tones are extracted as numerical markers (1-4, or 5 for neutral) or parsed via unicode tone marks.
- Accuracy is calculated as:
  $$\text{Score} = \max\left(0, 1 - \frac{\text{Levenshtein}(T_{user}, T_{actual})}{\max(|T_{user}|, |T_{actual}|)}\right) \times 100\%$$
- We provide granular feedback highlighting:
  1. *Phoneme matches* (consonants/vowels correct but tone wrong).
  2. *Tone matches* (correct tone but wrong phoneme).
  3. *Exact matches*.

## 7. Statistical Metrics
We track the following quantitative performance metrics:
- **Recall Rate ($R$)**: Percentage of vocabulary successfully recalled during testing.
- **Journal Integration Density ($D$)**: Number of active vocabulary words used per 100 words in journal entries.
- **Average Speech Speed Selectivity ($S$)**: Cumulative distribution of user-selected playback speeds, indicating comfort levels.
- **Daily Active Streaks ($L$)**: Consecutive days of study or journaling to monitor behavioral habit loop formation.
