import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Code2, Copy, Check, FileSpreadsheet, ArrowRight, Upload } from 'lucide-react';

const APPS_SCRIPT_CODE = `function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    new Date(),
    d.name || "",
    d.email || "",
    d.phone || "",
    d.source || "",
    d.need || "",
    d.message || ""
  ]);
  return ContentService.createTextOutput("ok");
}`;

export const ConnectLandingTab: React.FC = () => {
  const { importLeadsFromText } = useBusiness();
  const [copiedCode, setCopiedCode] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleImport = () => {
    if (!pasteContent.trim()) return;
    const count = importLeadsFromText(pasteContent);
    if (count > 0) {
      setImportResult(`✓ Successfully imported ${count} new leads! Switch to CRM tab to inspect them.`);
      setPasteContent('');
    } else {
      setImportResult('No new leads found or all rows were duplicates.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4-Step Architecture Guide */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-[var(--ink)]">
            Landing Page → Google Sheet → CRM Integration Workflow
          </h3>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-[var(--mu)] list-decimal pl-5 leading-relaxed">
          <li>
            Open Google Sheets. Go to <b>Extensions → Apps Script</b>. Paste the script below into the editor.
          </li>
          <li>
            Click <b>Deploy → New deployment → Web app</b>. Set <i>"Execute as" = Me</i> and <i>"Who has access" = Anyone</i>. Copy the published Web App URL.
          </li>
          <li>
            Paste the Web App URL into your landing page webhook config or form post endpoint. Every visitor submission is saved to the Sheet in real time, tagged with UTM source.
          </li>
          <li>
            Copy rows from Google Sheets (or any Excel file) and paste them into the batch importer below. Duplicate rows are skipped automatically.
          </li>
        </ol>

        {/* Code box */}
        <div className="mt-5 relative">
          <div className="flex items-center justify-between bg-[#0b1533] text-blue-200 text-xs px-4 py-2 rounded-t-xl border border-b-0 border-[#1f2f5c]">
            <span className="font-mono text-[11px]">Google Apps Script (Code.gs)</span>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-b-xl bg-[#070c1c] text-emerald-300 font-mono text-xs overflow-x-auto border border-[#1f2f5c] leading-relaxed">
            {APPS_SCRIPT_CODE}
          </pre>
        </div>
      </div>

      {/* Direct Webhook Endpoint Specs */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-2xl shadow-sm text-xs">
        <h4 className="font-bold text-sm text-[var(--ink)] mb-2 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-500" />
          <span>Server Webhook Endpoint</span>
        </h4>
        <p className="text-[var(--mu)] mb-3">
          You can also post directly to our integrated Express server endpoint from Webflow, WordPress, Shopify, Zapier, or custom HTML:
        </p>
        <div className="p-3 bg-[var(--soft)] border border-[var(--bd)] rounded-xl font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-bold text-blue-600">POST /api/webhook</span>
          <span className="text-[var(--mu)]">Payload: &#123; name, email, phone, source, need, message &#125;</span>
        </div>
      </div>

      {/* Batch Import Box */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-6 rounded-2xl shadow-sm">
        <h3 className="font-extrabold text-sm text-[var(--ink)] mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Batch Import Leads from Spreadsheet</span>
        </h3>
        <p className="text-xs text-[var(--mu)] mb-4">
          Expected column order: <b>Time, Name, Email, Phone, Source, Need, Message</b>. Tab or comma-separated rows are automatically parsed.
        </p>

        <textarea
          rows={5}
          value={pasteContent}
          onChange={(e) => setPasteContent(e.target.value)}
          placeholder="Paste rows directly from Google Sheets here..."
          className="w-full text-xs font-mono p-3.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500 resize-y"
        />

        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={handleImport}
            disabled={!pasteContent.trim()}
            className="bg-[#2b59ff] hover:bg-[#1a3fd1] disabled:opacity-40 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <span>Import Leads into CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {importResult && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {importResult}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
