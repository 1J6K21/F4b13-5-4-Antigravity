import request from "supertest";
import app, { computeLevenshtein, calculateToneAccuracy, scrubPII } from "../server/server";

describe("HanziFlow Core Unit Tests - Scientist OS Validation", () => {
  
  // 1. Test Levenshtein Distance & Tone Accuracy Logic
  describe("Levenshtein Distance & Tone Accuracy Scoring", () => {
    
    it("should compute accurate Levenshtein distance between two strings", () => {
      expect(computeLevenshtein("xuéxí", "xuéxí")).toBe(0);
      expect(computeLevenshtein("xuéxí", "xuexi")).toBe(2); // e vs é, i vs í
      expect(computeLevenshtein("nǐhǎo", "nihao")).toBe(2); // i vs ǐ, a vs ǎ
      expect(computeLevenshtein("apple", "aple")).toBe(1); // 1 insertion/deletion
    });

    it("should calculate correct percentage tone accuracy scores", () => {
      // Perfect match = 100%
      expect(calculateToneAccuracy("xuéxí", "xuéxí")).toBe(100.0);

      // Minor variation (1 character diff in 5 chars) => 1 - 1/5 = 80%
      expect(calculateToneAccuracy("xuexí", "xuéxí")).toBe(80.0);

      // Major variation (all chars diff) => should be 0.0%
      expect(calculateToneAccuracy("abc", "xyz")).toBe(0.0);

      // Empty values
      expect(calculateToneAccuracy("", "")).toBe(100.0);
    });
  });

  // 2. Test PII Scrubbing
  describe("PII Scrubbing and De-identification Filter", () => {
    it("should redact emails properly", () => {
      const input = "Contact john.doe@example.com for study materials.";
      const expected = "Contact [REDACTED_EMAIL] for study materials.";
      expect(scrubPII(input)).toBe(expected);
    });

    it("should redact phone numbers in various formats", () => {
      const phone1 = "Call 555-123-4567 to study.";
      const phone2 = "Call (555) 123-4567 to study.";
      const phone3 = "Call +1-555-123-4567 to study.";
      
      expect(scrubPII(phone1)).toContain("[REDACTED_PHONE]");
      expect(scrubPII(phone2)).toContain("[REDACTED_PHONE]");
      expect(scrubPII(phone3)).toContain("[REDACTED_PHONE]");
    });

    it("should redact common names and identifier formats", () => {
      const nameText = "My friend John Doe will study with me.";
      const introText = "My name is Jane Doe.";
      
      expect(scrubPII(nameText)).toContain("[REDACTED_NAME]");
      expect(scrubPII(introText)).toContain("[REDACTED_NAME]");
    });
  });
});

describe("HanziFlow API Integration Tests (Supertest)", () => {

  // 1. Test CSV Import API
  describe("POST /api/vocab/import", () => {
    it("should successfully import valid CSV lines and skip header", async () => {
      const csvData = "character,pinyin,english\n学习,xuéxí,to study\n你好,nǐhǎo,hello";
      
      const response = await request(app)
        .post("/api/vocab/import")
        .send({ csvText: csvData });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.importedCount).toBe(2);
      expect(response.body.items[0].character).toBe("学习");
      expect(response.body.items[1].character).toBe("你好");
      expect(response.body.statistics.validRecords).toBe(2);
    });

    it("should fail when csvText is missing or empty", async () => {
      const response = await request(app)
        .post("/api/vocab/import")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("csvText field must be a valid non-empty string");
    });
  });

  // 2. Test Audio Playback Speed Restrictions API
  describe("GET /api/audio/speech", () => {
    it("should allow standard speed (1.0x)", async () => {
      const response = await request(app)
        .get("/api/audio/speech")
        .query({ text: "学习", speed: "1.0" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.speed).toBe(1.0);
    });

    it("should allow speed at boundary limit (0.5x)", async () => {
      const response = await request(app)
        .get("/api/audio/speech")
        .query({ text: "学习", speed: "0.5" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.speed).toBe(0.5);
    });

    it("should allow speed at boundary limit (2.0x)", async () => {
      const response = await request(app)
        .get("/api/audio/speech")
        .query({ text: "学习", speed: "2.0" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.speed).toBe(2.0);
    });

    it("should reject speed below boundary limit (< 0.5x)", async () => {
      const response = await request(app)
        .get("/api/audio/speech")
        .query({ text: "学习", speed: "0.4" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("speed parameter is out of bounds");
    });

    it("should reject speed above boundary limit (> 2.0x)", async () => {
      const response = await request(app)
        .get("/api/audio/speech")
        .query({ text: "学习", speed: "2.1" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("speed parameter is out of bounds");
    });

    it("should fail when text query parameter is missing", async () => {
      const response = await request(app)
        .get("/api/audio/speech")
        .query({ speed: "1.0" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("text query parameter is required");
    });
  });

  // 3. Test Journal Recall Feedback API
  describe("POST /api/journal/review", () => {
    it("should scrub PII and evaluate correct recall of vocabulary", async () => {
      const journalContent = "Yesterday John Doe studied Chinese. 我学习 (xuéxí) 中文. Email him at john@example.com.";
      const targetVocab = [
        { character: "学习", pinyin: "xuéxí" },
        { character: "你好", pinyin: "nǐhǎo" }
      ];

      const response = await request(app)
        .post("/api/journal/review")
        .send({ content: journalContent, targetVocab });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Check PII scrubbing
      expect(response.body.scrubbedContent).not.toContain("John Doe");
      expect(response.body.scrubbedContent).not.toContain("john@example.com");
      expect(response.body.scrubbedContent).toContain("[REDACTED_NAME]");
      expect(response.body.scrubbedContent).toContain("[REDACTED_EMAIL]");

      // Check recall accuracy
      // 学习 was recalled perfectly -> toneScore 100%
      // 你好 was not found -> toneScore 0%
      const evaluation = response.body.evaluation;
      const xuexiEval = evaluation.find((e: any) => e.character === "学习");
      const nihaoEval = evaluation.find((e: any) => e.character === "你好");

      expect(xuexiEval).toBeDefined();
      expect(xuexiEval.isCorrect).toBe(true);
      expect(xuexiEval.toneScore).toBe(100.0);

      expect(nihaoEval).toBeDefined();
      expect(nihaoEval.isCorrect).toBe(false);
      expect(nihaoEval.toneScore).toBe(0.0);

      // Recall rate should be 50.0% (1 of 2 correct)
      expect(response.body.metrics.recallRate).toBe(50.0);
    });
  });
});
