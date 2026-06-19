# HanziFlow - Database Schema Design

This document details the database schema for the HanziFlow application. To ensure strong type safety, relational integrity, and scalability, the schema uses standard SQL DDL constraints (based on PostgreSQL).

## 1. Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--oQ USER_SPEEDS : configures
    USERS ||--o{ VOCAB_ITEMS : owns
    USERS ||--o{ JOURNAL_ENTRIES : writes
    VOCAB_ITEMS ||--o{ PROGRESS_TRACKING : tracks
    VOCAB_ITEMS }|--o{ JOURNAL_VOCAB_MAP : used_in
    JOURNAL_ENTRIES ||--o{ JOURNAL_VOCAB_MAP : contains
```

## 2. Table Schemas

### A. `users`
Represents the registered user in the application.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### B. `vocab_items`
Stores individual Chinese vocabulary items imported by the user or supplied by default.

```sql
CREATE TABLE vocab_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character VARCHAR(50) NOT NULL,
    pinyin VARCHAR(100) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Ensure a user cannot duplicate the same character-pinyin mapping
    CONSTRAINT unique_user_vocab_item UNIQUE(user_id, character, pinyin),
    CONSTRAINT character_not_empty CHECK (length(trim(character)) > 0),
    CONSTRAINT pinyin_not_empty CHECK (length(trim(pinyin)) > 0)
);

CREATE INDEX idx_vocab_items_user ON vocab_items(user_id);
```

### C. `journal_entries`
Stores user-written Chinese journal entries, with strict PII scrubbing.

```sql
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- PII scrubbed text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

CREATE INDEX idx_journal_entries_user ON journal_entries(user_id);
```

### D. `journal_vocab_map`
A junction table mapping which vocabulary words were practiced in which journal entry.

```sql
CREATE TABLE journal_vocab_map (
    journal_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    vocab_id UUID NOT NULL REFERENCES vocab_items(id) ON DELETE CASCADE,
    recall_rating VARCHAR(10) NOT NULL CHECK (recall_rating IN ('easy', 'medium', 'hard')),
    PRIMARY KEY (journal_id, vocab_id)
);
```

### E. `progress_tracking`
Tracks the user's active recall progress on individual vocabulary items using spaced repetition state.

```sql
CREATE TABLE progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vocab_id UUID NOT NULL REFERENCES vocab_items(id) ON DELETE CASCADE UNIQUE,
    streak INTEGER DEFAULT 0 NOT NULL CHECK (streak >= 0),
    ease_factor NUMERIC(3,2) DEFAULT 2.50 NOT NULL CHECK (ease_factor >= 1.30),
    interval_days INTEGER DEFAULT 0 NOT NULL CHECK (interval_days >= 0),
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_progress_tracking_review ON progress_tracking(next_review_at);
```

### F. `user_speeds`
Maintains user-customized speech playback speed configurations, validating strict limits.

```sql
CREATE TABLE user_speeds (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    playback_speed NUMERIC(3,2) DEFAULT 1.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Playback speed must be bounded between 0.5x and 2.0x
    CONSTRAINT chk_playback_speed_range CHECK (playback_speed >= 0.50 AND playback_speed <= 2.00)
);
```

## 3. Data Integrity & Validation Heuristics

1. **Foreign Key Integrity:** Cascading deletes are enforced to ensure that deleting a user or a journal entry automatically cleans up associated configurations and mappings.
2. **Strict Range Checks:** Checks on `user_speeds.playback_speed` restrict speed parameters to safe boundaries natively at the database layer.
3. **Immutability of Key Data:** Relational tables enforce compound unique indices (e.g. `unique_user_vocab_item`) to prevent duplicate vocab entries.
4. **Sanitized Output Auditing:** The `journal_entries` table stores only PII-scrubbed content. Validation rules reject SQL injection and path traversal attempts by scrubbing and scanning inputs at the application layers.
