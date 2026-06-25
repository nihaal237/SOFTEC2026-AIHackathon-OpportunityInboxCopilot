// Emails.jsx

import React, { useState } from "react";

// ─── Inject Styles ────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("oic-styles")) return;
  const style = document.createElement("style");
  style.id = "oic-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #080a0d;
      --surface:  #0e1117;
      --card:     #141920;
      --card2:    #1a2130;
      --border:   #1e2530;
      --border-hi:#2a3444;
      --accent:   #00d4aa;
      --accent-d: #00a885;
      --blue:     #3b82f6;
      --danger:   #f43f5e;
      --warn:     #f59e0b;
      --text:     #e2e8f0;
      --text-2:   #94a3b8;
      --text-3:   #4a5568;
      --green:    #10b981;
    }

    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
    html { scrollbar-width: thin; scrollbar-color: var(--border-hi) transparent; }

    /* ── Topbar ── */
    .topbar {
      height: 56px; display: flex; align-items: center;
      padding: 0 28px; gap: 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 200;
    }
    .logo {
      font-family: 'Space Mono', monospace;
      font-size: 13px; font-weight: 700;
      color: var(--accent); letter-spacing: .08em; text-transform: uppercase;
    }
    .logo em { color: var(--text-2); font-style: normal; font-weight: 400; }
    .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

    /* ── Stepper ── */
    .stepper { display: flex; align-items: center; gap: 4px; }
    .step-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-3); font-family: 'Space Mono', monospace; }
    .step-dot {
      width: 24px; height: 24px; border-radius: 50%;
      border: 1.5px solid var(--border-hi);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: var(--text-3);
      transition: all .2s;
    }
    .step-item.active .step-dot { border-color: var(--accent); color: var(--accent); background: rgba(0,212,170,.1); }
    .step-item.active { color: var(--accent); }
    .step-item.done .step-dot { background: var(--accent); border-color: var(--accent); color: #000; }
    .step-item.done { color: var(--text-2); }
    .step-line { width: 32px; height: 1px; background: var(--border-hi); }

    /* ── Buttons ── */
    .btn {
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
      border: none; cursor: pointer; border-radius: 7px;
      transition: all .15s; display: inline-flex; align-items: center; gap: 7px;
      white-space: nowrap;
    }
    .btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border-hi); padding: 7px 14px; }
    .btn-ghost:hover { color: var(--text); border-color: var(--text-2); }
    .btn-primary { background: var(--accent); color: #000; padding: 9px 22px; font-weight: 700; }
    .btn-primary:hover { background: var(--accent-d); }
    .btn-primary:disabled { background: #0d2e28; color: var(--text-3); cursor: not-allowed; }
    .btn-outline { background: transparent; color: var(--accent); border: 1px solid rgba(0,212,170,.4); padding: 7px 16px; }
    .btn-outline:hover { background: rgba(0,212,170,.07); border-color: var(--accent); }
    .btn-danger { background: transparent; color: var(--danger); border: 1px solid rgba(244,63,94,.35); padding: 7px 16px; }
    .btn-danger:hover { background: rgba(244,63,94,.07); }
    .btn-secondary { background: transparent; color: var(--blue); border: 1px solid rgba(59,130,246,.4); padding: 7px 16px; }
    .btn-secondary:hover { background: rgba(59,130,246,.07); border-color: var(--blue); }

    /* ── Tags ── */
    .tag { display: inline-flex; align-items: center; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; font-family: 'Space Mono', monospace; letter-spacing: .03em; }
    .tag-green { background: rgba(0,212,170,.1); color: var(--accent); }
    .tag-blue  { background: rgba(59,130,246,.12); color: #60a5fa; }
    .tag-red   { background: rgba(244,63,94,.1); color: var(--danger); }
    .tag-warn  { background: rgba(245,158,11,.1); color: var(--warn); }
    .tag-gray  { background: rgba(255,255,255,.05); color: var(--text-2); }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 500; backdrop-filter: blur(4px);
    }
    .modal-box {
      background: var(--card); border: 1px solid var(--border-hi);
      border-radius: 14px; padding: 32px; width: 420px; max-width: 90vw;
    }
    .modal-box h2 {
      font-family: 'Space Mono', monospace; font-size: 15px; font-weight: 700;
      color: var(--text); margin-bottom: 6px;
    }
    .modal-box p { font-size: 13px; color: var(--text-2); margin-bottom: 24px; line-height: 1.7; }
    .modal-field { margin-bottom: 16px; }
    .modal-label {
      display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .1em;
      color: var(--text-3); margin-bottom: 6px; font-family: 'Space Mono', monospace;
    }
    .modal-input {
      width: 100%; background: var(--surface); border: 1px solid var(--border-hi);
      border-radius: 7px; padding: 10px 14px; color: var(--text); font-size: 13px;
      font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s;
    }
    .modal-input:focus { border-color: var(--accent); }
    .modal-error { font-size: 12px; color: var(--danger); margin-bottom: 16px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }

    /* ── Loading overlay ── */
    .loading-overlay {
      position: fixed; inset: 0; background: rgba(8,10,13,.85);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 600; gap: 16px;
    }
    .spinner {
      width: 40px; height: 40px; border-radius: 50%;
      border: 3px solid var(--border-hi);
      border-top-color: var(--accent);
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { font-size: 14px; color: var(--text-2); font-family: 'Space Mono', monospace; }

    /* ══════════════════════════════ STEP 1 ══════════════════════════════ */
    .s1-wrap { max-width: 900px; margin: 0 auto; padding: 56px 24px; }
    .s1-hero { margin-bottom: 48px; }
    .s1-hero h1 {
      font-family: 'Space Mono', monospace;
      font-size: 32px; font-weight: 700; line-height: 1.25;
      color: var(--text); margin-bottom: 10px;
    }
    .s1-hero h1 span { color: var(--accent); }
    .s1-hero p { color: var(--text-2); font-size: 14px; line-height: 1.8; max-width: 480px; }

    .profile-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 12px; padding: 28px;
    }
    .pc-name { font-size: 17px; font-weight: 700; color: var(--text); }
    .pc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .pc-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .pc-field { background: var(--surface); border: 1px solid var(--border); border-radius: 7px; padding: 10px 14px; }
    .pc-label { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--text-3); margin-bottom: 4px; font-family: 'Space Mono', monospace; }
    .pc-input {
      width: 100%; background: transparent; border: none; outline: none;
      color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif;
    }
    .pc-input::placeholder { color: var(--text-3); }
    .pc-textarea {
      width: 100%; background: transparent; border: none; outline: none;
      color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif;
      resize: none; line-height: 1.6;
    }
    .pc-textarea::placeholder { color: var(--text-3); }
    .pc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .pc-section { margin-bottom: 20px; }
    .pc-section-label {
      font-size: 10px; text-transform: uppercase; letter-spacing: .1em;
      color: var(--text-3); margin-bottom: 10px; font-family: 'Space Mono', monospace;
      padding-bottom: 8px; border-bottom: 1px solid var(--border);
    }

    /* ══════════════════════════════ STEP 2 ══════════════════════════════ */
    .s2-layout { display: flex; height: calc(100vh - 56px); }
    .s2-sidebar {
      width: 370px; flex-shrink: 0;
      background: var(--surface); border-right: 1px solid var(--border);
      display: flex; flex-direction: column; overflow: hidden;
    }
    .sb-header { padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .sb-header h2 { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; text-transform: uppercase; letter-spacing: .06em; font-family: 'Space Mono', monospace; }
    .sb-header p { font-size: 12px; color: var(--text-2); }

    .email-scroll { flex: 1; overflow-y: auto; padding: 8px; }
    .email-scroll::-webkit-scrollbar { width: 3px; }
    .email-scroll::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }

    .email-row {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px; border-radius: 8px; cursor: pointer; margin-bottom: 4px;
      border: 1px solid transparent; transition: all .12s;
    }
    .email-row:hover { background: var(--card); border-color: var(--border); }
    .email-row.is-active { background: var(--card); border-color: var(--border-hi); }
    .email-row.is-selected { border-color: var(--accent); background: rgba(0,212,170,.04); }
    .email-row.is-spam { opacity: .45; }

    .e-check {
      width: 17px; height: 17px; border-radius: 4px; flex-shrink: 0;
      border: 1.5px solid var(--border-hi); margin-top: 2px;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s; cursor: pointer;
    }
    .e-check.on { background: var(--accent); border-color: var(--accent); }
    .e-check svg { width: 10px; height: 10px; }
    .e-title { font-size: 12px; font-weight: 500; color: var(--text); line-height: 1.5; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 270px; }
    .e-sub { display: flex; gap: 6px; align-items: center; }

    .sb-footer { padding: 14px 16px; border-top: 1px solid var(--border); }
    .count-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .count-txt { font-size: 11px; color: var(--text-2); font-family: 'Space Mono', monospace; }
    .count-txt span { color: var(--accent); font-weight: 700; }
    .progress-track { height: 3px; background: var(--border); border-radius: 2px; margin-bottom: 12px; }
    .progress-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width .3s; }

    .preview-pane { flex: 1; overflow-y: auto; padding: 36px 40px; }
    .preview-pane::-webkit-scrollbar { width: 3px; }
    .preview-pane::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }
    .preview-empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: var(--text-3); }
    .preview-empty svg { opacity: .15; }
    .preview-empty p { font-size: 13px; }

    .prev-title { font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 12px; line-height: 1.4; }
    .prev-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
    .prev-body { font-size: 13px; color: var(--text-2); line-height: 1.95; white-space: pre-wrap; background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 20px 24px; }

    /* ══════════════════════════════ STEP 3 ══════════════════════════════ */
    .s3-layout { display: flex; height: calc(100vh - 56px); }
    .s3-sidebar {
      width: 380px; flex-shrink: 0;
      background: var(--surface); border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
    }
    .rank-scroll { flex: 1; overflow-y: auto; padding: 10px; }
    .rank-scroll::-webkit-scrollbar { width: 3px; }
    .rank-scroll::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }

    .rank-row {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 12px; border-radius: 9px; cursor: pointer; margin-bottom: 6px;
      border: 1px solid var(--border); background: var(--card); transition: all .13s;
    }
    .rank-row:hover { border-color: var(--border-hi); }
    .rank-row.active { border-color: var(--accent); background: rgba(0,212,170,.04); }
    .rank-num { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; color: var(--text-3); min-width: 26px; padding-top: 1px; }
    .rank-num.gold { color: #f59e0b; }
    .rank-num.silver { color: #94a3b8; }
    .rank-num.bronze { color: #b45309; }
    .rank-title { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 6px; line-height: 1.4; }
    .rank-meta { display: flex; gap: 6px; flex-wrap: wrap; }
    .score-row { display: flex; align-items: center; gap: 8px; margin-top: 7px; }
    .score-track { flex: 1; height: 3px; background: var(--border); border-radius: 2px; }
    .score-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--blue)); }
    .score-num { font-size: 10px; color: var(--text-2); font-family: 'Space Mono', monospace; min-width: 28px; text-align: right; }

    .detail-pane { flex: 1; overflow-y: auto; padding: 40px 48px; }
    .detail-pane::-webkit-scrollbar { width: 3px; }
    .detail-pane::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }
    .detail-empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: var(--text-3); }

    .detail-title { font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 16px; line-height: 1.3; }
    .detail-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
    .det-section { margin-bottom: 32px; }
    .det-section h3 {
      font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .12em; color: var(--text-3);
      margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
    }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-cell { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; }
    .info-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--text-3); margin-bottom: 5px; font-family: 'Space Mono', monospace; }
    .info-val { font-size: 13px; color: var(--text); font-weight: 500; line-height: 1.5; }
    .info-val a { color: var(--blue); text-decoration: none; }
    .info-val a:hover { text-decoration: underline; }

    .reason-list, .check-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .reason-item { display: flex; gap: 12px; align-items: flex-start; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 13px; color: var(--text-2); line-height: 1.7; }
    .r-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 6px; }
    .warn-item { display: flex; gap: 12px; align-items: flex-start; background: rgba(244,63,94,.06); border: 1px solid rgba(244,63,94,.2); border-radius: 8px; padding: 13px 16px; font-size: 13px; color: var(--danger); line-height: 1.7; }
    .check-item { display: flex; gap: 12px; align-items: flex-start; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 13px; color: var(--text-2); line-height: 1.7; }
    .c-icon { color: var(--accent); flex-shrink: 0; font-size: 15px; margin-top: 1px; }

    /* ── Cover Letter ── */
    .cover-letter-section {
      margin-top: 32px; border-top: 1px solid var(--border); padding-top: 28px;
    }
    .cover-letter-section h3 {
      font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .12em; color: var(--text-3);
      margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
    }
    .cover-letter-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .cover-letter-body {
      background: var(--card); border: 1px solid var(--border); border-radius: 10px;
      padding: 24px 28px; font-size: 13px; color: var(--text-2);
      line-height: 2; white-space: pre-wrap; font-family: 'DM Sans', sans-serif;
    }
    .cover-letter-generating {
      background: var(--card); border: 1px solid var(--border); border-radius: 10px;
      padding: 28px; display: flex; align-items: center; gap: 14px;
    }
    .mini-spinner {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-hi); border-top-color: var(--accent);
      animation: spin .7s linear infinite; flex-shrink: 0;
    }
    .copy-toast {
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
      background: var(--accent); color: #000; font-size: 12px; font-weight: 700;
      padding: 8px 20px; border-radius: 20px; font-family: 'Space Mono', monospace;
      z-index: 700; animation: fadeInUp .2s ease;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(8px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ── Resume Upload ── */
    .resume-upload-zone {
      border: 1.5px dashed var(--border-hi); border-radius: 10px;
      padding: 20px 24px; display: flex; align-items: center; gap: 16px;
      background: var(--surface); transition: border-color .2s, background .2s;
      cursor: pointer; position: relative; margin-bottom: 8px;
    }
    .resume-upload-zone:hover { border-color: var(--accent); background: rgba(0,212,170,.03); }
    .resume-upload-zone.parsing { border-color: var(--accent); background: rgba(0,212,170,.05); }
    .resume-upload-zone input[type="file"] {
      position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
    }
    .ruz-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: rgba(0,212,170,.1); display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; font-size: 17px;
    }
    .ruz-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
    .ruz-sub { font-size: 11px; color: var(--text-3); }
    .ruz-badge {
      margin-left: auto; font-size: 10px; font-weight: 700;
      background: linear-gradient(135deg, var(--accent), var(--blue));
      color: #000; padding: 3px 10px; border-radius: 20px;
      font-family: 'Space Mono', monospace; letter-spacing: .04em; flex-shrink: 0;
    }
    .resume-filled-bar {
      display: flex; align-items: center; gap: 10px;
      background: rgba(0,212,170,.07); border: 1px solid rgba(0,212,170,.25);
      border-radius: 8px; padding: 10px 14px; margin-bottom: 20px;
      font-size: 12px; color: var(--accent);
    }
    .resume-filled-bar span { color: var(--text-2); }
    .or-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 20px 0; color: var(--text-3); font-size: 11px;
      font-family: 'Space Mono', monospace; letter-spacing: .08em;
    }
    .or-divider::before, .or-divider::after {
      content: ''; flex: 1; height: 1px; background: var(--border);
    }
  `;
  document.head.appendChild(style);
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Tick = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const MailIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

// ─── Priority helpers ─────────────────────────────────────────────────────────
const priorityTagClass = (p = "") => {
  const l = p.toLowerCase();
  if (l.includes("now")) return "tag-red";
  if (l.includes("soon")) return "tag-warn";
  return "tag-gray";
};

const rankClass = (i) => i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";

// ─── Stepper ──────────────────────────────────────────────────────────────────
const Stepper = ({ step }) => (
  <div className="stepper">
    {["Setup", "Review", "Ranked"].map((label, i) => {
      const n = i + 1;
      const state = step > n ? "done" : step === n ? "active" : "";
      return (
        <React.Fragment key={n}>
          {i > 0 && <div className="step-line" />}
          <div className={`step-item ${state}`}>
            <div className="step-dot">{step > n ? "✓" : n}</div>
            {label}
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ step, onBack }) => (
  <div className="topbar">
    <div className="logo">Inbox<em> copilot</em></div>
    <Stepper step={step} />
    <div className="topbar-right">
      {step > 1 && (
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
      )}
    </div>
  </div>
);

// ─── Gmail Modal ──────────────────────────────────────────────────────────────
const GmailModal = ({ onClose, onSuccess }) => {
  const [creds, setCreds] = useState({ email: "", app_password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!creds.email || !creds.app_password) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const testRes = await fetch("http://127.0.0.1:8000/emails/gmail-imap/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
      }).then(r => r.json());

      if (!testRes.success) {
        setError(testRes.error || "Connection failed. Check credentials.");
        setLoading(false);
        return;
      }

      const emailRes = await fetch("http://127.0.0.1:8000/emails/gmail-imap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...creds, max_emails: 15 })
      }).then(r => r.json());

      if (!emailRes.success) {
        setError(emailRes.error || "Failed to fetch emails.");
        setLoading(false);
        return;
      }

      onSuccess(emailRes.emails);
    } catch (err) {
      setError("Cannot reach the backend server. Is it running?");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2>Connect Gmail</h2>
        <p>
          Use an <strong style={{ color: "var(--accent)" }}>App Password</strong>, not your regular Gmail password.
          Go to Google Account → Security → 2-Step Verification → App passwords.
        </p>

        <div className="modal-field">
          <label className="modal-label">Gmail Address</label>
          <input
            className="modal-input"
            type="email"
            placeholder="you@gmail.com"
            value={creds.email}
            onChange={e => setCreds({ ...creds, email: e.target.value })}
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">App Password</label>
          <input
            className="modal-input"
            type="password"
            placeholder="xxxx xxxx xxxx xxxx"
            value={creds.app_password}
            onChange={e => setCreds({ ...creds, app_password: e.target.value })}
          />
        </div>

        {error && <div className="modal-error">⚠ {error}</div>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConnect} disabled={loading}>
            {loading ? "Connecting…" : "Connect & Fetch →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Loading Overlay ──────────────────────────────────────────────────────────
const LoadingOverlay = ({ message }) => (
  <div className="loading-overlay">
    <div className="spinner" />
    <div className="loading-text">{message}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
const Emails = () => {
  injectStyles();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const [emails, setEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [previewEmail, setPreviewEmail] = useState(null);

  const [rankedData, setRankedData] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const [showGmailModal, setShowGmailModal] = useState(false);
  const [resumeParsing, setResumeParsing] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");

  // ── Cover letter state ─────────────────────────────────────────────────────
  const [coverLetter, setCoverLetter] = useState("");
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  // ── Expanded preferences (Steps 7 & 8) ────────────────────────────────────
  const [preferences, setPreferences] = useState({
    name: "",
    degree: "",
    university: "",
    projects: "",
    cgpa: "",
    skills: "",
    preferred_types: [],
    location_preference: "",
    financial_need: false
  });

  const opportunityTypes = [
    "Internship", "Scholarship", "Competition", "Fellowship",
    "Exchange Program", "Research Assistant", "Volunteer",
    "Ambassador Program", "Programming Contest", "Admission"
  ];

  const toggleType = (type) => {
    const sel = preferences.preferred_types;
    setPreferences({
      ...preferences,
      preferred_types: sel.includes(type) ? sel.filter(x => x !== type) : [...sel, type]
    });
  };

  const toggleEmail = (id, isOpportunity) => {
    if (!isOpportunity) return;
    if (selectedEmails.includes(id)) {
      setSelectedEmails(selectedEmails.filter(i => i !== id));
    } else if (selectedEmails.length < 15) {
      setSelectedEmails([...selectedEmails, id]);
    }
  };

  // ── Resume upload & auto-fill ──────────────────────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeParsing(true);
    setResumeFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/parse-resume", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.error || "Failed to parse resume.");
        setResumeParsing(false);
        return;
      }

      setPreferences(prev => ({
        ...prev,
        name:       data.profile.name       || "",
        degree:     data.profile.degree     || "",
        university: data.profile.university || "",
        cgpa:       data.profile.cgpa       || "",
        skills: Array.isArray(data.profile.skills)
          ? data.profile.skills.join(", ")
          : (data.profile.skills || ""),
        projects: Array.isArray(data.profile.projects)
          ? data.profile.projects.join(", ")
          : (data.profile.projects || "")
      }));
    } catch (err) {
      console.log(err);
      alert("Failed to parse resume. Is the backend running?");
    }

    setResumeParsing(false);
  };

  const handleGmailSuccess = (fetchedEmails) => {
    setEmails(fetchedEmails);
    setShowGmailModal(false);
    setStep(2);
  };

  const handleRank = async () => {
    setLoading(true);
    setLoadingMsg("Ranking opportunities…");

    const payload = {
      student: {
        name: preferences.name,
        degree: preferences.degree,
        university: preferences.university,
        projects: preferences.projects,
        cgpa: parseFloat(preferences.cgpa) || 0,
        skills: preferences.skills.split(",").map(s => s.trim()).filter(Boolean),
        preferred_types: preferences.preferred_types,
        location_preference: preferences.location_preference,
        financial_need: preferences.financial_need
      },
      selected_emails: emails.filter(e => selectedEmails.includes(e.id))
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        setRankedData(res);
        setStep(3);
      } else {
        alert("Ranking failed: " + res.error);
      }
    } catch (err) {
      alert("Cannot reach backend. Is it running?");
    }

    setLoading(false);
  };

  // ── Cover letter: generate (Steps 11–13) ──────────────────────────────────
  const generateLetter = async (opportunity) => {
    setCoverLetter("");
    setLoadingLetter(true);

    console.log(opportunity);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: preferences,
          opportunity
        })
      });

      const data = await res.json();
      setCoverLetter(data.cover_letter);
    } catch (err) {
      alert("Cannot reach backend. Is it running?");
    }

    setLoadingLetter(false);
  };

  // ── Cover letter: copy ─────────────────────────────────────────────────────
  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    });
  };

  // ── Cover letter: download as .txt ────────────────────────────────────────
  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${(selectedResult?.title || "opportunity")
      .replace(/\s+/g, "-")
      .toLowerCase()
      .slice(0, 40)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── STEP 1 ─────────────────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Topbar step={1} />
      {showGmailModal && (
        <GmailModal
          onClose={() => setShowGmailModal(false)}
          onSuccess={handleGmailSuccess}
        />
      )}
      {loading && <LoadingOverlay message={loadingMsg} />}

      <div className="s1-wrap">
        <div className="s1-hero">
          <h1>Opportunity<br /><span>Inbox Copilot</span></h1>
          <p>Connect your Gmail and set your preferences. The AI will scan your inbox, identify opportunities, and rank them for you.</p>
        </div>

        <div className="profile-card">
          <div className="pc-name" style={{ marginBottom: 20 }}>👤 Student Profile</div>

          {/* ── Resume Upload (AI Auto Fill) ── */}
          <div className={`resume-upload-zone ${resumeParsing ? "parsing" : ""}`}>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeUpload}
              disabled={resumeParsing}
            />
            <div className="ruz-icon">
              {resumeParsing ? <div className="mini-spinner" /> : "📄"}
            </div>
            <div>
              <div className="ruz-label">
                {resumeParsing ? "Parsing resume…" : "Upload Resume"}
              </div>
              <div className="ruz-sub">
                {resumeParsing
                  ? "AI is extracting your profile fields"
                  : "PDF or DOCX · fields auto-fill instantly"}
              </div>
            </div>
            {!resumeParsing && <div className="ruz-badge">✦ AI Auto Fill</div>}
          </div>

          {/* Confirmation bar once a resume has been parsed */}
          {resumeFileName && !resumeParsing && (
            <div className="resume-filled-bar">
              ✓ Filled from <span>{resumeFileName}</span> — review &amp; edit below
            </div>
          )}

          <div className="or-divider">OR FILL MANUALLY</div>

          {/* ── Personal Info ── */}
          <div className="pc-section">
            <div className="pc-section-label">Personal Info</div>
            <div className="pc-grid" style={{ marginBottom: 12 }}>
              <div className="pc-field">
                <div className="pc-label">Full Name</div>
                <input
                  className="pc-input"
                  placeholder="e.g. Ali Raza"
                  value={preferences.name}
                  onChange={e => setPreferences({ ...preferences, name: e.target.value })}
                />
              </div>
              <div className="pc-field">
                <div className="pc-label">Degree</div>
                <input
                  className="pc-input"
                  placeholder="e.g. BS Computer Science"
                  value={preferences.degree}
                  onChange={e => setPreferences({ ...preferences, degree: e.target.value })}
                />
              </div>
            </div>
            <div className="pc-field">
              <div className="pc-label">University</div>
              <input
                className="pc-input"
                placeholder="e.g. LUMS, NUST, IBA"
                value={preferences.university}
                onChange={e => setPreferences({ ...preferences, university: e.target.value })}
              />
            </div>
          </div>

          {/* ── Academic Info ── */}
          <div className="pc-section">
            <div className="pc-section-label">Academics & Skills</div>
            <div className="pc-grid" style={{ marginBottom: 12 }}>
              <div className="pc-field">
                <div className="pc-label">CGPA</div>
                <input
                  className="pc-input"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="3.50"
                  value={preferences.cgpa}
                  onChange={e => setPreferences({ ...preferences, cgpa: e.target.value })}
                />
              </div>
              <div className="pc-field">
                <div className="pc-label">Location Preference</div>
                <input
                  className="pc-input"
                  placeholder="e.g. Pakistan, Remote"
                  value={preferences.location_preference}
                  onChange={e => setPreferences({ ...preferences, location_preference: e.target.value })}
                />
              </div>
            </div>
            <div className="pc-field" style={{ marginBottom: 12 }}>
              <div className="pc-label">Skills (comma separated)</div>
              <input
                className="pc-input"
                placeholder="React, Python, Machine Learning"
                value={preferences.skills}
                onChange={e => setPreferences({ ...preferences, skills: e.target.value })}
              />
            </div>
            <div className="pc-field">
              <div className="pc-label">Projects / Experience</div>
              <textarea
                className="pc-textarea"
                rows={3}
                placeholder="Briefly describe your key projects or work experience — this helps personalise your cover letter."
                value={preferences.projects}
                onChange={e => setPreferences({ ...preferences, projects: e.target.value })}
              />
            </div>
          </div>

          {/* ── Opportunity Preferences ── */}
          <div className="pc-section">
            <div className="pc-section-label">Opportunity Preferences</div>
            <div style={{ marginBottom: 12 }}>
              <div className="pc-label" style={{ marginBottom: 10 }}>Preferred Types</div>
              <div className="pc-tags">
                {opportunityTypes.map(type => (
                  <span
                    key={type}
                    className={`tag ${preferences.preferred_types.includes(type) ? "tag-green" : "tag-gray"}`}
                    style={{ cursor: "pointer", padding: "5px 12px", fontSize: 11 }}
                    onClick={() => toggleType(type)}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={preferences.financial_need}
                onChange={e => setPreferences({ ...preferences, financial_need: e.target.checked })}
                style={{ accentColor: "var(--accent)", width: 15, height: 15 }}
              />
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>I have financial need (boosts scholarship ranking)</span>
            </label>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: 8 }}
            onClick={() => setShowGmailModal(true)}
          >
            Connect Gmail & Fetch Emails →
          </button>
        </div>
      </div>
    </div>
  );

  // ── STEP 2 ─────────────────────────────────────────────────────────────────
  if (step === 2) {
    const opps = emails.filter(e => e.isOpportunity);
    const pct = Math.min((selectedEmails.length / 15) * 100, 100);

    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Topbar step={2} onBack={() => setStep(1)} />
        {loading && <LoadingOverlay message={loadingMsg} />}

        <div className="s2-layout">
          <div className="s2-sidebar">
            <div className="sb-header">
              <h2>Inbox</h2>
              <p>{emails.length} emails · {opps.length} opportunities detected</p>
            </div>

            <div className="email-scroll">
              {emails.map(email => {
                const isSel = selectedEmails.includes(email.id);
                const isAct = previewEmail?.id === email.id;

                return (
                  <div
                    key={email.id}
                    className={`email-row ${isAct ? "is-active" : ""} ${isSel ? "is-selected" : ""} ${!email.isOpportunity ? "is-spam" : ""}`}
                    onClick={() => setPreviewEmail(email)}
                  >
                    <div
                      className={`e-check ${isSel ? "on" : ""}`}
                      onClick={ev => {
                        ev.stopPropagation();
                        toggleEmail(email.id, email.isOpportunity);
                      }}
                    >
                      {isSel && <Tick />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="e-title">{email.subject || email.title || "Untitled"}</div>
                      <div className="e-sub">
                        {email.isOpportunity
                          ? <span className="tag tag-green">{email.type || "Opportunity"}</span>
                          : <span className="tag tag-red">Not Opportunity</span>
                        }
                        {email.deadline && (
                          <span className="tag tag-gray" style={{ fontSize: 9 }}>📅 {email.deadline}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sb-footer">
              <div className="count-bar">
                <span className="count-txt">Selected: <span>{selectedEmails.length}</span>/15</span>
                <span className="count-txt" style={{ fontSize: 10 }}>{opps.length} opportunities</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={selectedEmails.length < 1}
                onClick={handleRank}
              >
                Rank Selected ({selectedEmails.length}) →
              </button>
            </div>
          </div>

          {/* Preview pane */}
          <div className="preview-pane">
            {!previewEmail ? (
              <div className="preview-empty">
                <MailIcon />
                <p>Select an email to preview</p>
              </div>
            ) : (
              <>
                <div className="prev-title">{previewEmail.subject || previewEmail.title}</div>
                <div className="prev-tags">
                  {previewEmail.isOpportunity
                    ? <span className="tag tag-green">{previewEmail.type || "Opportunity"}</span>
                    : <span className="tag tag-red">Not an Opportunity</span>
                  }
                  {previewEmail.organization && (
                    <span className="tag tag-blue">{previewEmail.organization}</span>
                  )}
                  {previewEmail.deadline && (
                    <span className="tag tag-warn">📅 {previewEmail.deadline}</span>
                  )}
                  {previewEmail.location && (
                    <span className="tag tag-gray">📍 {previewEmail.location}</span>
                  )}
                </div>

                {previewEmail.eligibility?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-3)", marginBottom: 8, fontFamily: "Space Mono, monospace" }}>Eligibility</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {previewEmail.eligibility.map((e, i) => (
                        <span key={i} className="tag tag-gray">{e}</span>
                      ))}
                    </div>
                  </div>
                )}

                {previewEmail.application_link && (
                  <div style={{ marginBottom: 16 }}>
                    <a
                      href={previewEmail.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ textDecoration: "none" }}
                    >
                      Apply Now ↗
                    </a>
                  </div>
                )}

                <div className="prev-body">{previewEmail.body || "No content"}</div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3 ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Topbar step={3} onBack={() => setStep(2)} />

      {/* Copy toast */}
      {copyToast && <div className="copy-toast">✓ Copied to clipboard</div>}

      <div className="s3-layout">
        <div className="s3-sidebar">
          <div className="sb-header">
            <h2>Ranked Opportunities</h2>
            <p>{rankedData?.all_ranked?.length || 0} results · sorted by match score</p>
          </div>

          <div className="rank-scroll">
            {rankedData?.all_ranked?.map((item, i) => (
              <div
                key={i}
                className={`rank-row ${selectedResult === item ? "active" : ""}`}
                onClick={() => {
                  setSelectedResult(item);
                  setCoverLetter("");   // reset letter when switching opportunity
                }}
              >
                <div className={`rank-num ${rankClass(i)}`}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="rank-title">{item.title}</div>
                  <div className="rank-meta">
                    <span className={`tag ${priorityTagClass(item.priority)}`}>{item.priority}</span>
                    {item.deadline && (
                      <span className="tag tag-gray" style={{ fontSize: 9 }}>📅 {item.deadline}</span>
                    )}
                  </div>
                  <div className="score-row">
                    <div className="score-track">
                      <div className="score-fill" style={{ width: `${Math.min(Math.max(item.score, 0), 100)}%` }} />
                    </div>
                    <span className="score-num">{item.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div className="detail-pane">
          {!selectedResult ? (
            <div className="detail-empty">
              <MailIcon />
              <p>Select a ranked opportunity to see details</p>
            </div>
          ) : (
            <>
              <div className="detail-title">{selectedResult.title}</div>
              <div className="detail-meta">
                <span className={`tag ${priorityTagClass(selectedResult.priority)}`}>{selectedResult.priority}</span>
                <span className="tag tag-green">Score: {selectedResult.score}</span>
                {selectedResult.type && <span className="tag tag-blue">{selectedResult.type}</span>}
                {selectedResult.urgency && selectedResult.urgency !== "unknown" && (
                  <span className={`tag ${selectedResult.urgency === "high" ? "tag-red" : selectedResult.urgency === "medium" ? "tag-warn" : "tag-gray"}`}>
                    {selectedResult.urgency} urgency
                  </span>
                )}
              </div>

              {/* ── Action buttons (Steps 9 & 14) ── */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
                {selectedResult.application_link && (
                  <a
                    href={selectedResult.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: "none" }}
                  >
                    Apply Now ↗
                  </a>
                )}
                <button
                  className="btn btn-outline"
                  disabled={loadingLetter}
                  onClick={() => {
                    const originalEmail = emails.find(
                      e => e.title === selectedResult.title
                    );
                    generateLetter(originalEmail || selectedResult);
                  }}
                >
                  {loadingLetter ? "Generating…" : "✦ Generate Cover Letter"}
                </button>
              </div>

              {selectedResult.reasons?.length > 0 && (
                <div className="det-section">
                  <h3>Why this matches you</h3>
                  <ul className="reason-list">
                    {selectedResult.reasons.map((r, i) => (
                      <li key={i} className="reason-item">
                        <div className="r-dot" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedResult.warnings?.length > 0 && (
                <div className="det-section">
                  <h3>Warnings</h3>
                  <ul className="reason-list">
                    {selectedResult.warnings.map((w, i) => (
                      <li key={i} className="warn-item">⚠ {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedResult.checklist?.length > 0 && (
                <div className="det-section">
                  <h3>Action Checklist</h3>
                  <ul className="check-list">
                    {selectedResult.checklist.map((c, i) => (
                      <li key={i} className="check-item">
                        <span className="c-icon">☐</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Cover Letter section (Steps 15 & 16) ── */}
              {(loadingLetter || coverLetter) && (
                <div className="cover-letter-section">
                  <h3>Generated Cover Letter</h3>

                  {loadingLetter ? (
                    <div className="cover-letter-generating">
                      <div className="mini-spinner" />
                      <span style={{ fontSize: 13, color: "var(--text-2)" }}>Writing your cover letter…</span>
                    </div>
                  ) : (
                    <>
                      {/* ── Step 16: Copy / Download / Regenerate ── */}
                      <div className="cover-letter-actions">
                        <button className="btn btn-ghost" onClick={handleCopy}>
                          ⎘ Copy
                        </button>
                        <button className="btn btn-secondary" onClick={handleDownload}>
                          ↓ Download .txt
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            const originalEmail = emails.find(
                              e => e.title === selectedResult.title
                            );
                            generateLetter(originalEmail || selectedResult);
                          }}
                        >
                          ↺ Regenerate
                        </button>
                      </div>
                      <div className="cover-letter-body">{coverLetter}</div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emails;