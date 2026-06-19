"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayerSlider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AudioPlayerSlider = ({ initialText = '欢迎使用 HanziFlow 学习中文！', isPremium = false, onPlayStart }) => {
    const [text, setText] = (0, react_1.useState)(initialText);
    const [speed, setSpeed] = (0, react_1.useState)(1.0);
    const [accent, setAccent] = (0, react_1.useState)('CN');
    const [engine, setEngine] = (0, react_1.useState)('browser');
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [voices, setVoices] = (0, react_1.useState)([]);
    const [selectedVoiceName, setSelectedVoiceName] = (0, react_1.useState)('');
    const [errorMsg, setErrorMsg] = (0, react_1.useState)(null);
    const audioRef = (0, react_1.useRef)(null);
    // Initialize SpeechSynthesis voices
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const updateVoices = () => {
                const list = window.speechSynthesis.getVoices();
                const zhVoices = list.filter(v => v.lang.toLowerCase().includes('zh') || v.lang.toLowerCase().includes('cmn'));
                setVoices(zhVoices);
                if (zhVoices.length > 0 && !selectedVoiceName) {
                    // Select default CN voice
                    const defCn = zhVoices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith('zh-cn')) || zhVoices[0];
                    setSelectedVoiceName(defCn.name);
                }
            };
            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, [selectedVoiceName]);
    const handleStop = () => {
        if (engine === 'browser') {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
        else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
        setIsPlaying(false);
    };
    const handlePlay = async () => {
        if (!text.trim())
            return;
        setErrorMsg(null);
        handleStop(); // Stop current playback
        onPlayStart?.(text);
        if (engine === 'browser') {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
                setErrorMsg('Web Speech API is not supported in this browser.');
                return;
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = speed;
            // Match voice based on accent selection or manually selected voice
            const targetLangMatch = accent === 'TW' ? 'zh-tw' : 'zh-cn';
            const systemVoices = window.speechSynthesis.getVoices();
            let voice = systemVoices.find(v => v.name === selectedVoiceName);
            if (!voice) {
                voice = systemVoices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLangMatch))
                    || systemVoices.find(v => v.lang.toLowerCase().includes('zh'))
                    || systemVoices[0];
            }
            if (voice) {
                utterance.voice = voice;
            }
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (e) => {
                console.error('SpeechSynthesisUtterance error:', e);
                setErrorMsg('Browser speech synthesis encountered an error.');
                setIsPlaying(false);
            };
            window.speechSynthesis.speak(utterance);
        }
        else {
            // Premium Engine: Fetch from Node Express server stream
            setIsPlaying(true);
            try {
                const queryParams = new URLSearchParams({
                    character: text,
                    speed: speed.toFixed(2),
                    accent: accent
                });
                const url = `/api/v1/audio/retrieve?${queryParams.toString()}`;
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.onplay = () => setIsPlaying(true);
                audio.onended = () => setIsPlaying(false);
                audio.onerror = () => {
                    setErrorMsg('Failed to play neural audio from server. Falling back to browser audio...');
                    setIsPlaying(false);
                    // Auto fallback to browser
                    setEngine('browser');
                };
                await audio.play();
            }
            catch (err) {
                setErrorMsg('Premium voice backend service is unavailable.');
                setIsPlaying(false);
            }
        }
    };
    // Speed presets
    const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-slate-100 max-w-lg mx-auto", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" }), "Web Speech & Neural Audio Controller"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1", children: "Text to Pronounce" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("textarea", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Enter Chinese characters...", rows: 2, className: "w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 pr-10 resize-none" }), text && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setText(''), className: "absolute right-2 top-2 text-slate-500 hover:text-slate-300", title: "Clear text", children: "\u2715" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1", children: "Audio Engine" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex bg-slate-800 rounded p-0.5 border border-slate-700", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEngine('browser'), className: `flex-1 text-center py-1 text-xs rounded font-medium transition-all ${engine === 'browser' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`, children: "Browser TTS" }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => {
                                                    if (isPremium) {
                                                        setEngine('premium');
                                                    }
                                                    else {
                                                        setErrorMsg('Custom neural voice streams require a Premium subscription.');
                                                    }
                                                }, className: `flex-1 text-center py-1 text-xs rounded font-medium transition-all relative ${engine === 'premium'
                                                    ? 'bg-indigo-600 text-slate-100 shadow'
                                                    : 'text-slate-400 hover:text-slate-200'}`, children: ["Neural TTS", !isPremium && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -top-1.5 -right-1 bg-yellow-500 text-slate-950 font-extrabold text-[8px] px-1 rounded-full scale-90", children: "PRO" }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1", children: "Regional Accent" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex bg-slate-800 rounded p-0.5 border border-slate-700", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setAccent('CN'), className: `flex-1 text-center py-1 text-xs rounded font-medium transition-all ${accent === 'CN' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`, children: "Beijing (CN)" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setAccent('TW'), className: `flex-1 text-center py-1 text-xs rounded font-medium transition-all ${accent === 'TW' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`, children: "Taiwan (TW)" })] })] })] }), engine === 'browser' && voices.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1", children: "Select Browser Voice" }), (0, jsx_runtime_1.jsx)("select", { value: selectedVoiceName, onChange: (e) => setSelectedVoiceName(e.target.value), className: "w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500", children: voices.map((voice) => ((0, jsx_runtime_1.jsxs)("option", { value: voice.name, children: [voice.name, " (", voice.lang, ")"] }, voice.name))) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400", children: "Playback Speed" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-mono font-bold text-indigo-400", children: [speed.toFixed(2), "x"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4", children: (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0.25", max: "2.0", step: "0.05", value: speed, onChange: (e) => {
                                        const val = parseFloat(e.target.value);
                                        if (val !== 1.0 && !isPremium) {
                                            setErrorMsg('Custom speeds (excluding 1.0x) require Premium Tier subscription.');
                                            setSpeed(1.0);
                                            return;
                                        }
                                        setSpeed(val);
                                    }, className: "flex-grow accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-between mt-2", children: speeds.map((s) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                        if (s !== 1.0 && !isPremium) {
                                            setErrorMsg('Custom speeds require Premium Tier subscription.');
                                            setSpeed(1.0);
                                            return;
                                        }
                                        setSpeed(s);
                                    }, className: `px-1.5 py-0.5 text-[10px] rounded transition-colors ${speed === s
                                        ? 'bg-indigo-600 text-white font-bold'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`, children: s.toFixed(2) }, s))) })] }), errorMsg && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-950/30 border border-rose-900 text-rose-300 px-3 py-2 rounded text-xs flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { children: errorMsg }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setErrorMsg(null), className: "text-rose-400 hover:text-rose-200 font-bold ml-2", children: "\u2715" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 items-center pt-2 border-t border-slate-800 justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handlePlay, className: `flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs shadow-md transition-all active:scale-95 ${isPlaying
                                            ? 'bg-indigo-700 text-indigo-100 hover:bg-indigo-600'
                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`, children: isPlaying ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3.5 h-3.5 animate-pulse", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }) }), "Replay"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3.5 h-3.5", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M8 5v14l11-7z" }) }), "Speak Text"] })) }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleStop, disabled: !isPlaying, className: `flex items-center gap-1.5 px-3 py-2 rounded font-bold text-xs border border-slate-700 transition-all ${isPlaying
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
                                            : 'bg-slate-900 text-slate-600 cursor-not-allowed border-slate-800'}`, children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M6 6h12v12H6z" }) }), "Stop"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-slate-500 font-medium", children: isPlaying && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Playing..."] })) })] })] })] }));
};
exports.AudioPlayerSlider = AudioPlayerSlider;
