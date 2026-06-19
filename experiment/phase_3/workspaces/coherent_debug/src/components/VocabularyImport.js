"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabularyImport = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const VocabularyImport = ({ onImportSuccess, isPremium = false, token }) => {
    const [title, setTitle] = (0, react_1.useState)('');
    const [isPublic, setIsPublic] = (0, react_1.useState)(false);
    const [file, setFile] = (0, react_1.useState)(null);
    const [previewRows, setPreviewRows] = (0, react_1.useState)([]);
    const [validationErrors, setValidationErrors] = (0, react_1.useState)([]);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errorMsg, setErrorMsg] = (0, react_1.useState)(null);
    const [successMsg, setSuccessMsg] = (0, react_1.useState)(null);
    const fileInputRef = (0, react_1.useRef)(null);
    // Simple robust RFC 4180 compliant CSV parser
    const parseCSVText = (text) => {
        const lines = [];
        let row = [];
        let currentVal = '';
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];
            if (inQuotes) {
                if (char === '"') {
                    if (nextChar === '"') {
                        currentVal += '"';
                        i++;
                    }
                    else {
                        inQuotes = false;
                    }
                }
                else {
                    currentVal += char;
                }
            }
            else {
                if (char === '"') {
                    inQuotes = true;
                }
                else if (char === ',') {
                    row.push(currentVal);
                    currentVal = '';
                }
                else if (char === '\n' || char === '\r') {
                    if (char === '\r' && nextChar === '\n') {
                        i++;
                    }
                    row.push(currentVal);
                    lines.push(row);
                    row = [];
                    currentVal = '';
                }
                else {
                    currentVal += char;
                }
            }
        }
        if (row.length > 0 || currentVal !== '') {
            row.push(currentVal);
            lines.push(row);
        }
        return lines.map(r => r.map(cell => cell.trim()));
    };
    const handleFileChange = (selectedFile) => {
        setErrorMsg(null);
        setSuccessMsg(null);
        setValidationErrors([]);
        setPreviewRows([]);
        if (selectedFile.size > 2 * 1024 * 1024) {
            setErrorMsg('The uploaded CSV file exceeds the maximum allowed size of 2MB.');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        // Parse locally for interactive preview and validations
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (!text)
                return;
            const rawRows = parseCSVText(text).filter(r => r.length > 0 && r.some(cell => cell !== ''));
            if (rawRows.length < 2) {
                setValidationErrors(['CSV must contain a header row and at least one data row.']);
                return;
            }
            const headers = rawRows[0].map(h => h.toLowerCase());
            const charIndex = headers.indexOf('character');
            const pinyinIndex = headers.indexOf('pinyin');
            const defIndex = headers.indexOf('definition');
            if (charIndex === -1 || pinyinIndex === -1 || defIndex === -1) {
                setValidationErrors([
                    `Invalid headers: Found [${rawRows[0].join(', ')}]. Expected columns: "character", "pinyin", and "definition".`
                ]);
                return;
            }
            const parsed = [];
            const errors = [];
            for (let i = 1; i < rawRows.length; i++) {
                const rowData = rawRows[i];
                // Pad row if it has fewer elements than headers
                const character = rowData[charIndex] || '';
                const pinyin = rowData[pinyinIndex] || '';
                const definition = rowData[defIndex] || '';
                const rowErrors = [];
                // Validate character (Chinese character range \u4e00-\u9fa5)
                const chinRegex = /^[\u4e00-\u9fa5]+$/;
                if (!character) {
                    rowErrors.push('Missing character');
                }
                else if (!chinRegex.test(character)) {
                    rowErrors.push('Character column must contain ONLY Chinese characters (\\u4e00-\\u9fa5)');
                }
                else if (character.length > 20) {
                    rowErrors.push('Character length must not exceed 20');
                }
                // Validate pinyin
                if (!pinyin) {
                    rowErrors.push('Missing pinyin');
                }
                // Validate definition
                if (!definition) {
                    rowErrors.push('Missing definition');
                }
                else if (definition.length > 500) {
                    rowErrors.push('Definition length must not exceed 500 characters');
                }
                const rowErrStr = rowErrors.join(', ');
                if (rowErrStr) {
                    errors.push(`Row ${i + 1}: ${rowErrStr}`);
                }
                parsed.push({
                    character,
                    pinyin,
                    definition,
                    error: rowErrStr || undefined
                });
            }
            setPreviewRows(parsed);
            setValidationErrors(errors);
            // Auto-populate list title from filename if not set
            if (!title) {
                const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
                setTitle(nameWithoutExt.replace(/[-_]/g, ' '));
            }
        };
        reader.readAsText(selectedFile);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMsg('Please select a CSV file to upload.');
            return;
        }
        if (!title.trim()) {
            setErrorMsg('Please specify a title for this vocabulary list.');
            return;
        }
        if (validationErrors.length > 0) {
            setErrorMsg('Please resolve CSV validation errors before uploading.');
            return;
        }
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('is_public', String(isPublic));
        formData.append('file', file);
        try {
            const response = await fetch('/api/v1/vocabulary-lists/import', {
                method: 'POST',
                headers: {
                    'Authorization': isPremium ? 'Bearer premium-token' : 'Bearer free-token'
                },
                body: formData,
            });
            const resData = await response.json();
            if (!response.ok) {
                if (resData.error && resData.error.message) {
                    let detailedErr = resData.error.message;
                    if (resData.error.details && Array.isArray(resData.error.details)) {
                        detailedErr += '\n' + resData.error.details.map((d) => `Row ${d.row}: ${d.issue}`).join('\n');
                    }
                    throw new Error(detailedErr);
                }
                else {
                    throw new Error(resData.message || 'Import failed with status code ' + response.status);
                }
            }
            setSuccessMsg(`Successfully imported vocabulary list! "${resData.data.title}" loaded with ${resData.data.imported_count} words.`);
            setFile(null);
            setPreviewRows([]);
            setTitle('');
            setIsPublic(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (onImportSuccess && resData.data.list_id) {
                onImportSuccess(resData.data.list_id, resData.data.title, resData.data.imported_count);
            }
        }
        catch (err) {
            setErrorMsg(err.message || 'An error occurred during list importation.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100 max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold mb-2 flex items-center gap-2 text-indigo-400", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "CSV Vocabulary Import"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-slate-400 text-sm mb-6", children: ["Upload a custom deck. The CSV must have headers: ", (0, jsx_runtime_1.jsx)("code", { className: "text-slate-200 bg-slate-800 px-1 py-0.5 rounded", children: "character" }), ", ", (0, jsx_runtime_1.jsx)("code", { className: "text-slate-200 bg-slate-800 px-1 py-0.5 rounded", children: "pinyin" }), ", and ", (0, jsx_runtime_1.jsx)("code", { className: "text-slate-200 bg-slate-800 px-1 py-0.5 rounded", children: "definition" }), "."] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleUploadSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1", children: "Vocabulary Deck Title" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "e.g. HSK 3 - Fruits", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end h-full pb-2", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-3 cursor-pointer select-none", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isPublic, onChange: (e) => setIsPublic(e.target.checked), className: "w-4 h-4 text-indigo-600 border-slate-700 bg-slate-800 rounded focus:ring-indigo-500 focus:ring-offset-slate-900" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-slate-300", children: "Share Publicly (Available to other users)" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: () => fileInputRef.current?.click(), className: `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : file
                                ? 'border-emerald-600 bg-emerald-950/10'
                                : 'border-slate-700 hover:border-indigo-400 bg-slate-800/40'}`, children: [(0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: (e) => e.target.files && handleFileChange(e.target.files[0]), accept: ".csv", className: "hidden" }), (0, jsx_runtime_1.jsx)("svg", { className: "w-10 h-10 mx-auto mb-2 text-slate-400", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium block mb-1", children: file ? file.name : 'Drag & drop your CSV file here, or click to browse' }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-slate-500", children: file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 2MB' })] }), errorMsg && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-rose-900/40 border border-rose-800 text-rose-200 px-4 py-3 rounded text-sm whitespace-pre-line", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Import Error:" }), " ", errorMsg] })), successMsg && ((0, jsx_runtime_1.jsx)("div", { className: "bg-emerald-950/40 border border-emerald-800 text-emerald-300 px-4 py-3 rounded text-sm", children: successMsg })), validationErrors.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-amber-950/40 border border-amber-800 text-amber-200 px-4 py-3 rounded text-xs space-y-1 max-h-36 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-sm mb-1 text-amber-400", children: "CSV Form Validation Warnings:" }), validationErrors.map((err, idx) => ((0, jsx_runtime_1.jsxs)("div", { children: ["\u2022 ", err] }, idx)))] })), previewRows.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 border border-slate-800 rounded bg-slate-950 p-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2", children: ["CSV Upload Preview (", previewRows.length, " words found)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "overflow-x-auto max-h-48 overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left text-xs border-collapse", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-slate-800 text-slate-400 font-medium", children: [(0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Character" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Pinyin" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Definition" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3 text-right", children: "Status" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-slate-900", children: previewRows.slice(0, 10).map((row, index) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-slate-900/50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-2 px-3 font-medium text-slate-100", children: row.character }), (0, jsx_runtime_1.jsx)("td", { className: "py-2 px-3 text-slate-300", children: row.pinyin }), (0, jsx_runtime_1.jsx)("td", { className: "py-2 px-3 text-slate-400 truncate max-w-xs", children: row.definition }), (0, jsx_runtime_1.jsx)("td", { className: "py-2 px-3 text-right", children: row.error ? ((0, jsx_runtime_1.jsx)("span", { className: "text-rose-400 font-medium", title: row.error, children: "\u274C Invalid" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-emerald-400 font-medium", children: "\u2713 Valid" })) })] }, index))) })] }), previewRows.length > 10 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-slate-500 text-[10px] text-center pt-2 italic", children: ["Showing first 10 of ", previewRows.length, " rows..."] }))] })] })), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || !file || validationErrors.length > 0, className: `px-5 py-2.5 rounded font-semibold text-sm shadow transition-all ${isLoading || !file || validationErrors.length > 0
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`, children: isLoading ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin h-4 w-4 text-white", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing Import..."] })) : ('Confirm & Import List') }) })] })] }));
};
exports.VocabularyImport = VocabularyImport;
