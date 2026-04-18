// Emails.jsx

import React, { useEffect, useState } from "react";

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

    /* ── Tags ── */
    .tag { display: inline-flex; align-items: center; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; font-family: 'Space Mono', monospace; letter-spacing: .03em; }
    .tag-green { background: rgba(0,212,170,.1); color: var(--accent); }
    .tag-blue  { background: rgba(59,130,246,.12); color: #60a5fa; }
    .tag-red   { background: rgba(244,63,94,.1); color: var(--danger); }
    .tag-warn  { background: rgba(245,158,11,.1); color: var(--warn); }
    .tag-gray  { background: rgba(255,255,255,.05); color: var(--text-2); }

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
    .s1-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 14px; }

    .profile-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 12px; padding: 22px; cursor: pointer;
      transition: border-color .15s, transform .15s;
    }
    .profile-card:hover { border-color: var(--accent); transform: translateY(-1px); }
    .pc-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px; }
    .pc-name { font-size: 17px; font-weight: 700; color: var(--text); }
    .pc-degree { font-size: 12px; color: var(--accent); margin-bottom: 14px; font-weight: 500; }
    .pc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
    .pc-field { background: var(--surface); border: 1px solid var(--border); border-radius: 7px; padding: 8px 12px; }
    .pc-label { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--text-3); margin-bottom: 2px; font-family: 'Space Mono', monospace; }
    .pc-val { font-size: 12px; color: var(--text); font-weight: 500; }
    .pc-tags { display: flex; flex-wrap: wrap; gap: 6px; }

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

    .upload-zone {
      margin: 14px 16px;
      border: 1.5px dashed var(--border-hi); border-radius: 10px;
      padding: 16px; text-align: center; transition: border-color .15s;
      background: rgba(0,0,0,.2);
    }
    .upload-zone:hover { border-color: var(--accent); }
    .upload-zone p { font-size: 12px; color: var(--text-2); margin-bottom: 10px; }
    .upload-zone input[type="file"] { display: none; }
    .file-label {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 500; color: var(--accent);
      cursor: pointer; border: 1px solid rgba(0,212,170,.3);
      padding: 6px 14px; border-radius: 6px; transition: background .15s;
    }
    .file-label:hover { background: rgba(0,212,170,.08); }
    .file-name { font-size: 11px; color: var(--text-2); margin-top: 8px; font-family: 'Space Mono', monospace; }

    .email-scroll { flex: 1; overflow-y: auto; padding: 8px; }
    .email-scroll::-webkit-scrollbar { width: 3px; }
    .email-scroll::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }

    .email-row {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 12px; border-radius: 8px; cursor: pointer; margin-bottom: 4px;
      border: 1px solid transparent; transition: all .12s;
    }
    .email-row:hover { background: var(--card); border-color: var(--border); }
    .email-row.is-active { background: var(--card); border-color: var(--border-hi); }
    .email-row.is-selected { border-color: var(--accent); background: rgba(0,212,170,.04); }
    .email-row.is-spam { opacity: .5; }

    .e-check {
      width: 17px; height: 17px; border-radius: 4px; flex-shrink: 0;
      border: 1.5px solid var(--border-hi); margin-top: 1px;
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

    /* Preview pane */
    .preview-pane { flex: 1; overflow-y: auto; padding: 36px 40px; }
    .preview-pane::-webkit-scrollbar { width: 3px; }
    .preview-pane::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }
    .preview-empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: var(--text-3); }
    .preview-empty svg { opacity: .15; }
    .preview-empty p { font-size: 13px; }

    .spam-bar { background: rgba(244,63,94,.07); border: 1px solid rgba(244,63,94,.2); border-radius: 8px; padding: 11px 16px; font-size: 13px; color: var(--danger); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .prev-title { font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 12px; line-height: 1.4; }
    .prev-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
    .prev-body { font-size: 13px; color: #94a3b8; line-height: 1.95; white-space: pre-wrap; background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 20px 24px; }
    .prev-actions { margin-top: 20px; display: flex; gap: 10px; }

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

    /* Detail pane */
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
    .check-item { display: flex; gap: 12px; align-items: flex-start; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 13px; color: var(--text-2); line-height: 1.7; }
    .c-icon { color: var(--accent); flex-shrink: 0; font-size: 15px; margin-top: 1px; }
  `;
  document.head.appendChild(style);
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Tick = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);
const Back = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const MailIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

// ─── Priority helpers ─────────────────────────────────────────────────────────
const priorityTag = (p = "") => {
  const l = p.toLowerCase();
  if (l.includes("high") || l.includes("critical")) return "tag-red";
  if (l.includes("medium")) return "tag-warn";
  return "tag-gray";
};
const rankClass = (i) => i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";

// ═══════════════════════════════════════════════════════════════════════════════
const Emails = () => {
  injectStyles();

  const [step, setStep]                   = useState(1);
  const [profiles, setProfiles]           = useState([]);
  const [emails, setEmails]               = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedEmails, setSelectedEmails]   = useState([]);
  const [previewEmail, setPreviewEmail]   = useState(null);
  const [rankedData, setRankedData]       = useState(null);
  const [selectedResult, setSelectedResult]   = useState(null);
  const [selectedFile, setSelectedFile]   = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/students")
      .then(r => r.json()).then(setProfiles).catch(console.log);
  }, []);

  const loadEmails = async (profile) => {
    try {
      const data = await fetch("http://127.0.0.1:8000/emails").then(r => r.json());
      setSelectedProfile(profile); setEmails(data);
      setSelectedEmails([]); setPreviewEmail(null); setStep(2);
    } catch (e) { console.log(e); }
  };

  const toggleEmail = (id, isOpportunity) => {
    if (!isOpportunity) return;
    if (selectedEmails.includes(id)) {
      setSelectedEmails(selectedEmails.filter(i => i !== id));
    } else {
      if (selectedEmails.length < 15) setSelectedEmails([...selectedEmails, id]);
      else alert("Maximum 15 emails allowed");
    }
  };

  const handleFileChange = (e) => { const f = e.target.files[0]; if (f) setSelectedFile(f); };

  const handlePdfUpload = async () => {
    if (!selectedFile) { alert("Please select a PDF first"); return; }
    const fd = new FormData(); fd.append("file", selectedFile);
    try {
      const data = await fetch("http://127.0.0.1:8000/upload-pdf", { method: "POST", body: fd }).then(r => r.json());
      if (data.success) {
        alert("PDF uploaded and parsed successfully");
        setSelectedFile(null);
        if (selectedProfile) loadEmails(selectedProfile);
      } else { alert(data.message); }
    } catch { alert("Upload failed"); }
  };

  const handleRank = async () => {
    if (!selectedProfile) { alert("Please select a student first"); return; }
    if (selectedEmails.length < 5) { alert("Please select at least 5 emails"); return; }
    try {
      const data = await fetch("http://127.0.0.1:8000/rank", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: selectedProfile.id, selected_email_ids: selectedEmails })
      }).then(r => r.json());
      setRankedData(data); setSelectedResult(null); setStep(3);
    } catch (e) { console.log(e); }
  };

  // ── Stepper ──────────────────────────────────────────────────────────────────
  const Stepper = () => (
    <div className="stepper">
      {[["1","Profiles"],["2","Emails"],["3","Rankings"]].map(([n, label], i) => {
        const num = +n;
        const cls = step > num ? "done" : step === num ? "active" : "";
        return (
          <React.Fragment key={n}>
            {i > 0 && <div className="step-line" />}
            <div className={`step-item ${cls}`}>
              <div className="step-dot">{step > num ? "✓" : n}</div>
              <span>{label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  const Topbar = ({ children }) => (
    <div className="topbar">
      <div className="logo">Inbox<em>Copilot</em></div>
      {children}
      <div className="topbar-right"><Stepper /></div>
    </div>
  );

  // ══════════════════════════════ STEP 1 ══════════════════════════════
  if (step === 1) return (
    <div>
      <Topbar />
      <div className="s1-wrap">
        <div className="s1-hero">
          <h1>Opportunity<br /><span>Inbox Copilot</span></h1>
          <p>Select a student profile to scan and rank opportunity emails with AI-powered precision.</p>
        </div>
        <div className="s1-grid">
          {profiles.map(p => (
            <div key={p.id} className="profile-card" onClick={() => loadEmails(p)}>
              <div className="pc-head">
                <div className="pc-name">{p.name}</div>
                <span className="tag tag-gray" style={{fontFamily:"Space Mono",fontSize:9}}>ID {p.id}</span>
              </div>
              <div className="pc-degree">{p.degree} · Sem {p.semester}</div>
              <div className="pc-grid">
                <div className="pc-field">
                  <div className="pc-label">CGPA</div>
                  <div className="pc-val">{p.cgpa}</div>
                </div>
                <div className="pc-field">
                  <div className="pc-label">Location</div>
                  <div className="pc-val">{p.location_preference || "—"}</div>
                </div>
                <div className="pc-field">
                  <div className="pc-label">Experience</div>
                  <div className="pc-val">{p.experience_level || "—"}</div>
                </div>
                <div className="pc-field">
                  <div className="pc-label">Financial Need</div>
                  <div className="pc-val">{p.financial_need ? "Yes" : "No"}</div>
                </div>
              </div>
              <div className="pc-tags">
                {p.preferred_types?.map(t => <span key={t} className="tag tag-blue">{t}</span>)}
                {p.skills?.slice(0,4).map(s => <span key={s} className="tag tag-gray">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════ STEP 2 ══════════════════════════════
  if (step === 2) {
    const opps = emails.filter(e => e.isOpportunity);
    const pct = Math.min((selectedEmails.length / 15) * 100, 100);
    return (
      <div>
        <Topbar>
          <button className="btn btn-ghost" style={{marginLeft:12}} onClick={() => setStep(1)}>
            <Back /> Back
          </button>
          <span style={{fontSize:12,color:"var(--text-2)"}}>
            Profile: <strong style={{color:"var(--text)"}}>{selectedProfile?.name}</strong>
          </span>
        </Topbar>

        <div className="s2-layout">
          {/* ── Sidebar ── */}
          <div className="s2-sidebar">
            <div className="sb-header">
              <h2>Inbox</h2>
              <p>{emails.length} emails &nbsp;·&nbsp; {opps.length} opportunities</p>
            </div>

            {/* PDF Upload */}
            <div className="upload-zone">
              <p>Upload a PDF email to parse</p>
              <label className="file-label" htmlFor="pdf-input">
                <UploadIcon /> Choose PDF
              </label>
              <input id="pdf-input" type="file" accept=".pdf" onChange={handleFileChange} />
              {selectedFile && (
                <>
                  <div className="file-name">📄 {selectedFile.name}</div>
                  <button className="btn btn-primary" style={{marginTop:10,fontSize:12,padding:"7px 16px"}} onClick={handlePdfUpload}>
                    Upload &amp; Parse
                  </button>
                </>
              )}
            </div>

            {/* Email list */}
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
                      onClick={ev => { ev.stopPropagation(); toggleEmail(email.id, email.isOpportunity); }}
                    >
                      {isSel && <Tick />}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="e-title">{email.subject || email.title || "Untitled"}</div>
                      <div className="e-sub">
                        {email.isOpportunity
                          ? <span className="tag tag-green">{email.type || "Opportunity"}</span>
                          : <span className="tag tag-red">Not an opportunity</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="sb-footer">
              <div className="count-bar">
                <span className="count-txt">Selected: <span>{selectedEmails.length}</span> / 15</span>
                <span className="count-txt" style={{fontSize:10}}>Min 5 required</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{width:`${pct}%`}} />
              </div>
              <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}
                onClick={handleRank} disabled={selectedEmails.length < 5}>
                Rank Opportunities →
              </button>
            </div>
          </div>

          {/* ── Preview ── */}
          <div className="preview-pane">
            {!previewEmail ? (
              <div className="preview-empty">
                <MailIcon />
                <p>Select an email to preview</p>
              </div>
            ) : (
              <>
                {!previewEmail.isOpportunity && (
                  <div className="spam-bar">⚠ Not identified as an opportunity — cannot be selected for ranking.</div>
                )}
                <div className="prev-title">{previewEmail.subject || previewEmail.title}</div>
                <div className="prev-tags">
                  {previewEmail.isOpportunity && <span className="tag tag-green">{previewEmail.type || "Opportunity"}</span>}
                  {previewEmail.organization && <span className="tag tag-gray">{previewEmail.organization}</span>}
                  {previewEmail.deadline && <span className="tag tag-warn">⏰ {previewEmail.deadline}</span>}
                </div>
                <div className="prev-body">{previewEmail.body || "No body content."}</div>
                {previewEmail.isOpportunity && (
                  <div className="prev-actions">
                    <button
                      className={selectedEmails.includes(previewEmail.id) ? "btn btn-danger" : "btn btn-outline"}
                      onClick={() => toggleEmail(previewEmail.id, true)}
                    >
                      {selectedEmails.includes(previewEmail.id) ? "✕ Remove from ranking" : "+ Add to ranking"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════ STEP 3 ══════════════════════════════
  return (
    <div>
      <Topbar>
        <button className="btn btn-ghost" style={{marginLeft:12}} onClick={() => setStep(2)}>
          <Back /> Back
        </button>
        <span style={{fontSize:12,color:"var(--text-2)"}}>
          Ranked for: <strong style={{color:"var(--text)"}}>{selectedProfile?.name}</strong>
        </span>
      </Topbar>

      <div className="s3-layout">
        {/* ── Ranked sidebar ── */}
        <div className="s3-sidebar">
          <div className="sb-header">
            <h2>Priority Rankings</h2>
            <p>{rankedData?.all_ranked?.length || 0} opportunities ranked</p>
          </div>
          <div className="rank-scroll">
            {rankedData?.all_ranked?.map((item, i) => {
              const score = typeof item.score === "number" ? item.score : 0;
              return (
                <div key={i}
                  className={`rank-row ${selectedResult === item ? "active" : ""}`}
                  onClick={() => setSelectedResult(item)}
                >
                  <div className={`rank-num ${rankClass(i)}`}>#{i + 1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="rank-title">{item.title}</div>
                    <div className="rank-meta">
                      <span className={`tag ${priorityTag(item.priority)}`}>{item.priority || "Low"}</span>
                      {item.deadline && <span className="tag tag-gray">📅 {item.deadline}</span>}
                    </div>
                    <div className="score-row">
                      <div className="score-track">
                        <div className="score-fill" style={{width:`${Math.min(score,100)}%`}} />
                      </div>
                      <span className="score-num">{score}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail pane ── */}
        <div className="detail-pane">
          {!selectedResult ? (
            <div className="detail-empty">
              <MailIcon />
              <p>Select a ranked opportunity to view details</p>
            </div>
          ) : (
            <>
              <div className="detail-title">{selectedResult.title}</div>
              <div className="detail-meta">
                <span className={`tag ${priorityTag(selectedResult.priority)}`}>{selectedResult.priority || "Low"} Priority</span>
                {selectedResult.score !== undefined && <span className="tag tag-green">Score: {selectedResult.score}</span>}
                {selectedResult.deadline && <span className="tag tag-warn">⏰ {selectedResult.deadline}</span>}
              </div>

              <div className="det-section">
                <h3>Details</h3>
                <div className="info-grid">
                  <div className="info-cell">
                    <div className="info-lbl">Deadline</div>
                    <div className="info-val">{selectedResult.deadline || "—"}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-lbl">Application Link</div>
                    <div className="info-val">
                      {selectedResult.application_link
                        ? <a href={selectedResult.application_link} target="_blank" rel="noreferrer">{selectedResult.application_link}</a>
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {selectedResult.reasons?.length > 0 && (
                <div className="det-section">
                  <h3>Why This Ranks Here</h3>
                  <ul className="reason-list">
                    {selectedResult.reasons.map((r, i) => (
                      <li key={i} className="reason-item"><div className="r-dot" />{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedResult.checklist?.length > 0 && (
                <div className="det-section">
                  <h3>Action Checklist</h3>
                  <ul className="check-list">
                    {selectedResult.checklist.map((c, i) => (
                      <li key={i} className="check-item"><span className="c-icon">☐</span>{c}</li>
                    ))}
                  </ul>
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