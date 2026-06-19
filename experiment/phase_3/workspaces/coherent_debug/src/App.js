"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const VocabularyImport_1 = require("./components/VocabularyImport");
const PinyinRecallCard_1 = require("./components/PinyinRecallCard");
const AudioPlayerSlider_1 = require("./components/AudioPlayerSlider");
const JournalFeedback_1 = require("./components/JournalFeedback");
// Pre-populated default vocabulary decks
const DEFAULT_DECKS = [
    {
        id: 'deck-hsk3-food',
        user_id: 'demo-user',
        title: 'HSK 3 - Eating Out & Food',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        words: [
            {
                id: 'w1',
                list_id: 'deck-hsk3-food',
                hanzi: '苹果',
                pinyin: 'píngguǒ',
                english: 'apple',
                character_mappings: [
                    { sequence_order: 0, character: '苹', pinyin: 'píng', tone: 2 },
                    { sequence_order: 1, character: '果', pinyin: 'guǒ', tone: 3 }
                ]
            },
            {
                id: 'w2',
                list_id: 'deck-hsk3-food',
                hanzi: '菜单',
                pinyin: 'càidān',
                english: 'menu',
                character_mappings: [
                    { sequence_order: 0, character: '菜', pinyin: 'cài', tone: 4 },
                    { sequence_order: 1, character: '单', pinyin: 'dān', tone: 1 }
                ]
            },
            {
                id: 'w3',
                list_id: 'deck-hsk3-food',
                hanzi: '米饭',
                pinyin: 'mǐfàn',
                english: 'cooked rice',
                character_mappings: [
                    { sequence_order: 0, character: '米', pinyin: 'mǐ', tone: 3 },
                    { sequence_order: 1, character: '饭', pinyin: 'fàn', tone: 4 }
                ]
            },
            {
                id: 'w4',
                list_id: 'deck-hsk3-food',
                hanzi: '面条',
                pinyin: 'miàntiáo',
                english: 'noodles',
                character_mappings: [
                    { sequence_order: 0, character: '面', pinyin: 'miàn', tone: 4 },
                    { sequence_order: 1, character: '条', pinyin: 'tiáo', tone: 2 }
                ]
            }
        ]
    },
    {
        id: 'deck-everyday-convo',
        user_id: 'demo-user',
        title: 'Everyday Mandarin Basics',
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        words: [
            {
                id: 'w5',
                list_id: 'deck-everyday-convo',
                hanzi: '你好',
                pinyin: 'nǐhǎo',
                english: 'hello',
                character_mappings: [
                    { sequence_order: 0, character: '你', pinyin: 'nǐ', tone: 3 },
                    { sequence_order: 1, character: '好', pinyin: 'hǎo', tone: 3 }
                ]
            },
            {
                id: 'w6',
                list_id: 'deck-everyday-convo',
                hanzi: '谢谢',
                pinyin: 'xièxie',
                english: 'thank you',
                character_mappings: [
                    { sequence_order: 0, character: '谢', pinyin: 'xiè', tone: 4 },
                    { sequence_order: 1, character: '谢', pinyin: 'xie', tone: 5 }
                ]
            },
            {
                id: 'w7',
                list_id: 'deck-everyday-convo',
                hanzi: '再见',
                pinyin: 'zàijiàn',
                english: 'goodbye',
                character_mappings: [
                    { sequence_order: 0, character: '再', pinyin: 'zài', tone: 4 },
                    { sequence_order: 1, character: '见', pinyin: 'jiàn', tone: 4 }
                ]
            }
        ]
    }
];
const App = () => {
    const [isPremium, setIsPremium] = (0, react_1.useState)(false);
    const [vocabDecks, setVocabDecks] = (0, react_1.useState)(DEFAULT_DECKS);
    const [activeDeckId, setActiveDeckId] = (0, react_1.useState)('deck-hsk3-food');
    const [journals, setJournals] = (0, react_1.useState)([]);
    const [activeTab, setActiveTab] = (0, react_1.useState)('study');
    // Audio link state
    const [audioTextToPlay, setAudioTextToPlay] = (0, react_1.useState)('欢迎使用 HanziFlow');
    const [audioAutoTrigger, setAudioAutoTrigger] = (0, react_1.useState)(0);
    // Stats
    const [streak, setStreak] = (0, react_1.useState)(3);
    const [reviewsDone, setReviewsDone] = (0, react_1.useState)(12);
    // Find active deck
    const activeDeck = vocabDecks.find(deck => deck.id === activeDeckId) || null;
    const activeWords = activeDeck?.words || [];
    const handleImportSuccess = (listId, title, count) => {
        // Refresh or simulate loading lists
        // Here we query or mock add the list
        const newDeck = {
            id: listId,
            user_id: 'demo-user',
            title: title,
            is_public: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Prepopulate words locally for immediate visual satisfaction (will fetch actual list words in production)
            words: [
                { id: `${listId}-w1`, list_id: listId, hanzi: '苹果', pinyin: 'píngguǒ', english: 'apple' },
                { id: `${listId}-w2`, list_id: listId, hanzi: '菜单', pinyin: 'càidān', english: 'menu' }
            ]
        };
        setVocabDecks(prev => [newDeck, ...prev]);
        setActiveDeckId(listId);
        setActiveTab('study');
    };
    const handlePlayAudio = (text) => {
        setAudioTextToPlay(text);
        setAudioAutoTrigger(prev => prev + 1);
    };
    const handleSaveJournalSuccess = (entry) => {
        const newJournal = {
            id: entry.journal_id,
            user_id: 'demo-user',
            content: entry.feedback.corrected_content, // show corrected in list
            created_at: entry.created_at || new Date().toISOString(),
            target_vocab_list_id: activeDeckId || undefined,
            vocab_matched_count: entry.vocab_matched_count,
            feedback: {
                corrected_content: entry.feedback.corrected_content,
                grammar_notes: entry.feedback.grammar_notes,
                vocab_evaluation: entry.vocab_evaluation
            }
        };
        setJournals(prev => [newJournal, ...prev]);
        setStreak(prev => prev + 1);
    };
    const handleReviewRecall = (itemId, score) => {
        setReviewsDone(prev => prev + 1);
        // Visual indicator of updated SRS status
        console.log(`Word ${itemId} reviewed. Score: ${score}`);
    };
    const handleStateChange = (itemId, newState) => {
        setVocabDecks(prev => prev.map(deck => {
            if (!deck.words)
                return deck;
            return {
                ...deck,
                words: deck.words.map(w => {
                    if (w.id === itemId) {
                        // Log/simulate update
                        return { ...w };
                    }
                    return w;
                })
            };
        }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-slate-950 text-slate-100 font-sans pb-12", children: [(0, jsx_runtime_1.jsx)("header", { className: "border-b border-slate-900 bg-slate-900/60 backdrop-blur sticky top-0 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md", children: (0, jsx_runtime_1.jsx)("span", { className: "font-serif text-xl font-bold text-white", children: "\u6D41" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent", children: "HanziFlow" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] block text-slate-500 font-semibold uppercase tracking-wider", children: "Tone & Output Studio" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] px-2 text-slate-500 uppercase font-bold", children: "Tier:" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsPremium(false), className: `px-2.5 py-1 text-xs rounded font-bold transition-all ${!isPremium
                                            ? 'bg-slate-800 text-slate-100 shadow'
                                            : 'text-slate-400 hover:text-slate-200'}`, children: "Free" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsPremium(true), className: `px-2.5 py-1 text-xs rounded font-bold transition-all relative ${isPremium
                                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow'
                                            : 'text-slate-400 hover:text-slate-200'}`, children: "Premium \u2605" })] }) })] }) }), (0, jsx_runtime_1.jsx)("section", { className: "bg-slate-900/20 py-8 border-b border-slate-900/50", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center", children: "\uD83D\uDD25" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] uppercase font-bold text-slate-500 tracking-wider block", children: "Daily Streak" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-2xl font-bold", children: [streak, " Days"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center", children: "\uD83D\uDCDA" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] uppercase font-bold text-slate-500 tracking-wider block", children: "SRS Reviews Today" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-2xl font-bold", children: [reviewsDone, " Cards"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center", children: "\u2713" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] uppercase font-bold text-slate-500 tracking-wider block", children: "Total Vocab Words" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl font-bold", children: vocabDecks.reduce((sum, d) => sum + (d.words?.length || 0), 0) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center", children: "\u26A1" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] uppercase font-bold text-slate-500 tracking-wider block", children: "Account Tier Status" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-bold text-slate-300", children: isPremium ? 'Premium (Azure Neural Streams & Custom Speed)' : 'Free (Local SpeechSynthesis, standard 1x)' })] })] })] }) }) }), (0, jsx_runtime_1.jsx)("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-1 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 border border-slate-850 rounded-xl p-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Vocabulary Decks" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('import'), className: "text-xs text-indigo-400 hover:text-indigo-300 font-bold", children: "+ Upload CSV" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: vocabDecks.map((deck) => {
                                                const isSelected = deck.id === activeDeckId;
                                                return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                        setActiveDeckId(deck.id);
                                                        if (activeTab === 'import')
                                                            setActiveTab('study');
                                                    }, className: `w-full text-left px-3 py-2 text-xs rounded transition-all flex items-center justify-between ${isSelected
                                                        ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 font-bold'
                                                        : 'bg-slate-950/20 text-slate-400 border border-transparent hover:bg-slate-800'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "truncate pr-2", children: deck.title }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-[10px] bg-slate-800 rounded text-slate-400", children: deck.words?.length || 0 })] }, deck.id));
                                            }) })] }), (0, jsx_runtime_1.jsx)(AudioPlayerSlider_1.AudioPlayerSlider, { initialText: audioTextToPlay, isPremium: isPremium }, `${audioTextToPlay}-${audioAutoTrigger}`), journals.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 border border-slate-850 rounded-xl p-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3", children: ["Journal History (", journals.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-[220px] overflow-y-auto pr-1", children: journals.map((j) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-950 border border-slate-900 p-2.5 rounded text-xs space-y-1.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-slate-500 text-[10px]", children: [(0, jsx_runtime_1.jsx)("span", { children: new Date(j.created_at).toLocaleDateString() }), (0, jsx_runtime_1.jsxs)("span", { className: "text-indigo-400 font-bold", children: [j.vocab_matched_count, " used"] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-slate-300 line-clamp-2 italic font-serif", children: ["\"", j.content, "\""] }), j.feedback?.grammar_notes && ((0, jsx_runtime_1.jsxs)("div", { className: "text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded", children: ["\uD83D\uDCA1 ", j.feedback.grammar_notes.slice(0, 80), "..."] }))] }, j.id))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-3 space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex border-b border-slate-850", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('study'), className: `py-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === 'study'
                                                ? 'border-indigo-500 text-indigo-400'
                                                : 'border-transparent text-slate-400 hover:text-slate-200'}`, children: "Character study cards" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('journal'), className: `py-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === 'journal'
                                                ? 'border-indigo-500 text-indigo-400'
                                                : 'border-transparent text-slate-400 hover:text-slate-200'}`, children: "Interactive writing workspace" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('import'), className: `py-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === 'import'
                                                ? 'border-indigo-500 text-indigo-400'
                                                : 'border-transparent text-slate-400 hover:text-slate-200'}`, children: "Upload custom deck (CSV)" })] }), activeTab === 'study' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-fadeIn", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between items-center", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold text-slate-200", children: activeDeck ? activeDeck.title : 'No Deck Selected' }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-500 text-xs", children: "Study character tones, segments, and audio pronunciations below." })] }) }), activeWords.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-20 bg-slate-900/30 border border-slate-850 rounded-xl", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-slate-500 text-sm mb-4", children: "No characters in this vocabulary deck." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('import'), className: "px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-500", children: "Import Words from CSV" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: activeWords.map((word) => ((0, jsx_runtime_1.jsx)(PinyinRecallCard_1.PinyinRecallCard, { item: word, onPlayAudio: handlePlayAudio, onReviewRecall: handleReviewRecall, onStateChange: handleStateChange }, word.id))) }))] })), activeTab === 'journal' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-fadeIn", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-4 text-xs text-indigo-300 flex items-center gap-2.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: "\uD83D\uDCA1" }), (0, jsx_runtime_1.jsx)("span", { children: "Select a deck in the left sidebar first. The checklist will reveal matches in real-time as you write. Then submit to trigger automated AI grammar revisions." })] }), (0, jsx_runtime_1.jsx)(JournalFeedback_1.JournalFeedback, { activeVocabItems: activeWords, activeListId: activeDeckId, isPremium: isPremium, onPlayAudio: handlePlayAudio, onSaveSuccess: handleSaveJournalSuccess })] })), activeTab === 'import' && ((0, jsx_runtime_1.jsx)("div", { className: "animate-fadeIn", children: (0, jsx_runtime_1.jsx)(VocabularyImport_1.VocabularyImport, { onImportSuccess: handleImportSuccess, isPremium: isPremium }) }))] })] }) })] }));
};
exports.App = App;
exports.default = exports.App;
