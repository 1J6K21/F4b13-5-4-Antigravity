"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalFeedback = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const JournalFeedback = ({ activeVocabItems, activeListId, isPremium = false, onSaveSuccess, onPlayAudio }) => {
    const [content, setContent] = (0, react_1.useState)('');
    const [matchedWords, setMatchedWords] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errorMsg, setErrorMsg] = (0, react_1.useState)(null);
    // Results states
    const [feedbackResult, setFeedbackResult] = (0, react_1.useState)(null);
    const charLimit = isPremium ? 2000 : 150;
    // Track matched vocabulary in real-time as user types
    (0, react_1.useEffect)(() => {
        if (!content.trim() || activeVocabItems.length === 0) {
            setMatchedWords([]);
            return;
        }
        const matched = activeVocabItems.filter(item => content.includes(item.hanzi));
        setMatchedWords(matched);
    }, [content, activeVocabItems]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim())
            return;
        if (!activeListId) {
            setErrorMsg('Please select a target vocabulary deck to match against.');
            return;
        }
        if (content.length > charLimit) {
            setErrorMsg(`Content exceeds character limit of ${charLimit} for your account tier.`);
            return;
        }
        setIsLoading(true);
        setErrorMsg(null);
        setFeedbackResult(null);
        try {
            const response = await fetch('/api/v1/journals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': isPremium ? 'Bearer premium-token' : 'Bearer free-token'
                },
                body: JSON.stringify({
                    content: content.trim(),
                    target_vocab_list_id: activeListId
                })
            });
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.error?.message || resData.message || 'Submission failed.');
            }
            setFeedbackResult(resData.data);
            if (onSaveSuccess) {
                onSaveSuccess(resData.data);
            }
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to submit journal. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleReset = () => {
        setContent('');
        setFeedbackResult(null);
        setErrorMsg(null);
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'CORRECT':
                return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900", children: "\u25CF Correct Usage" }));
            case 'INCORRECT_GRAMMAR':
                return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/40 text-rose-400 border border-rose-900", children: "\u25CF Grammar Error" }));
            case 'IMPROVED_PHRASING':
                return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/40 text-sky-400 border border-sky-900", children: "\u25CF Improved Phrasing" }));
            default:
                return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700", children: "\u25CF Unknown" }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100 max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold text-indigo-400 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), "Interactive Study Journal"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 text-xs mt-1", children: "Write Chinese compositions incorporating your target vocabulary and receive instant AI feedback." })] }), feedbackResult && ((0, jsx_runtime_1.jsx)("button", { onClick: handleReset, className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 active:scale-95 transition-all", children: "Write New Entry" }))] }), !feedbackResult ? (
            /* WRITING WORKSPACE */
            (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-end", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400", children: "Write in Chinese" }), (0, jsx_runtime_1.jsxs)("span", { className: `text-xs ${content.length > charLimit ? 'text-rose-400 font-bold' : 'text-slate-500'}`, children: [content.length, " / ", charLimit, " characters"] })] }), (0, jsx_runtime_1.jsx)("textarea", { value: content, onChange: (e) => setContent(e.target.value), placeholder: "Type your Chinese journal entry here. Incorporate words from the deck...", rows: 8, disabled: !activeListId, className: `w-full bg-slate-800 border rounded-lg p-4 text-base leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!activeListId ? 'border-slate-800 bg-slate-900/50 cursor-not-allowed opacity-50' : 'border-slate-700'}` }), !activeListId && ((0, jsx_runtime_1.jsxs)("div", { className: "text-amber-400/80 text-xs flex items-center gap-1.5 bg-amber-950/20 border border-amber-900/50 p-2.5 rounded", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", strokeWidth: "2.2", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), "Please choose a vocabulary deck from the sidebar before you begin writing."] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-950 border border-slate-800 rounded-lg p-4 h-fit max-h-[300px] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Target Words Checklist" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-indigo-400", children: [matchedWords.length, " / ", activeVocabItems.length, " used"] })] }), activeVocabItems.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-slate-600 text-xs py-4 text-center", children: "No words in this deck yet." })) : ((0, jsx_runtime_1.jsx)("ul", { className: "space-y-2", children: activeVocabItems.map((item) => {
                                            const isMatched = content.includes(item.hanzi);
                                            return ((0, jsx_runtime_1.jsxs)("li", { className: `flex items-center justify-between text-xs p-2 rounded transition-all ${isMatched
                                                    ? 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 font-medium'
                                                    : 'bg-slate-900 border border-slate-800 text-slate-400'}`, children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `text-base font-semibold ${isMatched ? 'text-emerald-400' : 'text-slate-300'}`, children: item.hanzi }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] text-slate-500 font-mono", children: ["[", item.pinyin, "]"] })] }), isMatched ? ((0, jsx_runtime_1.jsx)("span", { className: "text-emerald-400 font-bold flex items-center gap-0.5", children: "\u2713 Found" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-slate-600", children: "\u2715 Missing" }))] }, item.id));
                                        }) }))] })] }), errorMsg && ((0, jsx_runtime_1.jsx)("div", { className: "bg-rose-950/40 border border-rose-800 text-rose-300 px-4 py-3 rounded text-sm", children: errorMsg })), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-2 border-t border-slate-800", children: (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || !content.trim() || !activeListId, className: `px-6 py-2.5 rounded font-bold text-sm shadow-md transition-all ${isLoading || !content.trim() || !activeListId
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`, children: isLoading ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin h-4 w-4 text-white", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Analyzing Writing..."] })) : ('Submit Journal for AI Feedback') }) })] })) : (
            /* AI CORRECTION & REVIEW PANEL */
            (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1", children: "Your Submission" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-slate-950 border border-slate-900 rounded-lg p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap", children: content })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-1.5", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xs font-semibold uppercase tracking-wider text-indigo-400", children: "Corrected Phrasing" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => onPlayAudio?.(feedbackResult.feedback.corrected_content), className: "flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold bg-indigo-950/20 border border-indigo-900/40 px-2.5 py-1 rounded", title: "Speak corrected entry", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", strokeWidth: "2.5", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" }) }), "Listen to Correction"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-indigo-950/10 border border-indigo-900/30 rounded-lg p-4 text-slate-100 text-base leading-relaxed whitespace-pre-wrap font-serif", children: feedbackResult.feedback.corrected_content })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5", children: "Grammar & Tone Explanations" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap", children: feedbackResult.feedback.grammar_notes })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2", children: "Target Vocabulary Usage Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 max-h-40 overflow-y-auto pr-1", children: [feedbackResult.vocab_evaluation.map((evalItem) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-950 border border-slate-900 rounded p-2.5 flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-sm text-slate-200", children: evalItem.character }), getStatusBadge(evalItem.status)] }, evalItem.vocab_item_id))), feedbackResult.vocab_evaluation.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-slate-600 text-xs text-center py-2", children: "No target vocabulary evaluated in feedback." }))] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-indigo-950/10 border border-indigo-900/20 rounded-lg p-4 text-center text-xs text-indigo-400/80 flex justify-center items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 shrink-0 text-indigo-400", fill: "none", stroke: "currentColor", strokeWidth: "2.2", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }), "This journal has been successfully scrubbed of any PII, encrypted using AES-256-GCM, and stored safely in our database."] })] }))] }));
};
exports.JournalFeedback = JournalFeedback;
