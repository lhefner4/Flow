import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const COMPANY = {
  name: "Hefner Machine & Tool, Inc.",
  industry: "Full-Service Job Shop / Precision CNC Manufacturing",
  sectors: "Aerospace, Defense, Medical, and Industrial Production",
  materials: "Aluminum, Stainless Steel, Titanium, Nickel Alloys, and Specialty Metals",
  quality: "Strict adherence to exacting standards; Quality procedures strictly enforced (QMS)",
  contact: "office@hefnermachine.com",
  location: "3003 Unionville Pike, Hatfield, PA 19440",
  schedule: "Full-Time, Monday–Friday, 7:00 AM – 4:30 PM",
  benefits: "Medical, Dental, Vision, 401(k), PTO & Holidays",
  overtime: "Occasional overtime may be required to maintain strict delivery records.",
};
const FOOTER = `Hefner Machine & Tool, Inc. is an Equal Opportunity Employer. All production is subject to strict quality enforcement and safety regulations at our Hatfield facility. ${COMPANY.overtime}`;

const FIELDS = [
  { key:"title",          label:"Job Title",              icon:"💼", ph:"e.g. CNC Machinist, Quality Inspector…",      autoHint:"Suggest the most fitting precision machining job title based on any context collected so far, or suggest a common Hefner Machine & Tool role." },
  { key:"pay",            label:"Pay / Compensation",     icon:"💰", ph:"e.g. $28/hr, $55,000/yr, $24–$30/hr…",        autoHint:"Suggest a competitive and realistic pay rate for this role at a precision CNC machine shop in Hatfield, PA." },
  { key:"shift",          label:"Shift / Schedule",       icon:"🕐", ph:"e.g. Days M–F, 7am–4:30pm…",                  autoHint:"Use Hefner Machine & Tool's standard schedule: Full-Time, Monday–Friday, 7:00 AM – 4:30 PM." },
  { key:"responsibility", label:"Primary Responsibility", icon:"🎯", ph:"e.g. Operate CNC mills, oversee QC…",          autoHint:"Suggest the single most logical primary responsibility for this role at a high-precision CNC manufacturing facility." },
  { key:"extras",         label:"Operational Details",    icon:"📝", ph:"Equipment, culture, physical demands, apply…", autoHint:"Fill in relevant operational details following this priority order: (1) essential physical demands first — standing duration, lifting requirements; (2) high-frequency technical tasks and equipment operated daily; (3) quality standards enforced; (4) materials handled; (5) application instructions directing candidates to office@hefnermachine.com. Use Hefner Machine & Tool defaults for any gaps." },
];

const WELCOME_TITLE = "Welcome to **Hefner Executive Job Architect v6.5**.\n\nThis tool will guide you through building a formal Job Application Detail Form for **Hefner Machine & Tool, Inc.** Answer naturally — type anything and the appropriate field will be identified automatically. Use **Auto-Fill** on any field to apply the most contextually appropriate default.\n\n**To begin: What is the job title for this position?**";
const THREAD_INTROS = {
  pay:            "**Pay / Compensation**\n\nPlease provide the compensation for this position — an hourly rate, annual salary, or range is accepted.",
  shift:          "**Shift / Schedule**\n\nPlease describe the working hours or shift schedule for this role.",
  responsibility: "**Primary Responsibility**\n\nWhat is the single most important function this position will own?",
  extras:         "**Operational Details**\n\nAny additional details may be provided here — equipment, physical demands, culture notes, or application instructions.",
};

const buildSystem = (mode, jobData, fieldKey) => {
  const collected = Object.entries(jobData).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(" | ") || "none yet";
  const fieldLabel = FIELDS.find(f=>f.key===fieldKey)?.label || fieldKey;
  return `You are the Hefner Executive Job Architect v6.5, serving ${COMPANY.name} — ${COMPANY.industry}, ${COMPANY.location}.
Defaults — Schedule: ${COMPANY.schedule} | Benefits: ${COMPANY.benefits} | Contact: ${COMPANY.contact} | Materials: ${COMPANY.materials} | Sectors: ${COMPANY.sectors} | Quality: ${COMPANY.quality} | Core Value: Precise & Accurate CNC Machining.
All collected data: ${collected}
TONE: Formal executive voice. Passive voice for all policy language. Never use casual language, slang, or colloquialisms. Never say AI/Prompt/Model/Token — use Draft/Update/Finalize/Import. FACT-LOCK: never alter any number, rate, or named value provided by the user.
${mode==="COLLECT"?`
COLLECTION MODE — ACTIVE FIELD: "${fieldLabel}"
You are focused exclusively on collecting the value for the "${fieldLabel}" field in this conversation thread.
- Understand plain natural language. Never ask the user to rephrase or label their answer.
- Acknowledge what was provided, confirm it is recorded (e.g. "Recorded: [value]."), and if this field is now satisfied, briefly confirm it is complete.
- Keep responses to 2–3 lines maximum. Do not reference other fields unless directly relevant.
- NEVER generate a full draft. NEVER instruct the user to interact with UI controls.
- If AUTO-FILL is triggered: generate the most logical value for "${fieldLabel}" using all context available. Begin the response with "Locked in: [value]." then confirm the field is complete.

TRIAD SUGGESTION SYSTEM — MANDATORY:
After every response in COLLECTION MODE, you MUST append exactly three Executive Suggestions specific to precision CNC manufacturing. These suggestions must directly refine the "${fieldLabel}" field with high-precision, industry-specific detail (e.g., specific tolerances like ±0.0005", software like Mastercam/Siemens NX/Vericut, measuring instruments like Renishaw probes or CMM, material grades, certifications like AS9100D/ISO 9001, or relevant industry processes). Format them on a new line after your main response using EXACTLY this structure — no deviations:

SUGGESTIONS: ["suggestion one text", "suggestion two text", "suggestion three text"]

Rules for suggestions:
- Each suggestion must be a short, standalone phrase (4–12 words) that, if clicked, would logically extend or refine the current field value.
- Suggestions must be grounded in precision CNC manufacturing context relevant to ${COMPANY.sectors}.
- Suggestions must be distinct from each other — no overlapping scope.
- Never suggest navigating to another field or referencing UI actions.
- The SUGGESTIONS line must always be the final line of your response.
`:mode==="DRAFT"?`
DRAFT MODE — produce the complete formal Job Application Detail Form:

### 1. ABOUT HEFNER MACHINE & TOOL
Open with this exact sentence, filling in the job title and compensation naturally: "${COMPANY.name} is seeking a [Job Title] to join our precision manufacturing team, offering [Compensation]." Then continue with the following fixed anchor text verbatim: "${COMPANY.name} maintains a primary commitment to Precise & Accurate CNC Machining, delivering high-precision production components to an expansive customer base across the Aerospace, Defense, and Medical sectors. Our facility is engineered for versatility, managing a wide range of specialty materials and overseeing complex outsourced requirements—including precision plating and finishing—to ensure a full-service manufacturing solution. This core standard serves as the baseline for all production operations at our Hatfield facility."
Also include Schedule, Location, and Benefits as a brief inline summary line after the paragraph (e.g., "Schedule: ... | Location: ... | Benefits: ...").

### 2. COMPANY OVERVIEW
Two formal sentences: (1) description of ${COMPANY.name} and its manufacturing capabilities centered on Precise & Accurate CNC Machining; (2) scope of this role and its importance to production quality.

### 3. CORE COMPETENCIES
Bulleted list — formal language. IMPORTANCE-FIRST ORDER: (1) "Preferred:" items must appear first — preferred qualifications, advanced technical skills, and years of experience at the top; (2) required technical skills and machinery proficiency; (3) quality and compliance standards; (4) soft skills and work ethic last. Label preferred items "Preferred:".

### 4. OPERATIONAL DETAILS
Role requirements in this order: (1) essential physical demands first — standing duration and lifting requirements; (2) high-frequency technical tasks performed daily; (3) day-to-day responsibilities and equipment operated; (4) application instructions directing candidates to ${COMPANY.contact}; (5) relevant environment notes. Insert [Add detail here] for any gaps.

### 5. COMPANY STANDARDS
${FOOTER}

Incorporate all collected data. Remaining gaps are filled with ${COMPANY.name} defaults. FACT-LOCK all numeric values.
`:mode==="EDIT"?`
EDIT MODE:
- Target a section → 3 formal labeled variations: Option A — Executive | Option B — Direct | Option C — Operational. Close with: "Which option is preferred, or should elements be combined?"
- Broad instruction → apply across ALL sections, present full updated draft, confirm: "Please advise if further refinement is needed."
- Feedback expressed → request specific reason in one sentence, apply that standard to all sections going forward.
- FACT-LOCK. Return only the modified section unless a global change is made.
`:`
HELP MODE — Technical Support for the Hefner Executive Job Architect v6.5.
ROLE: Diagnose issues and provide corrective guidance. Formal, prescriptive, brief.
OUTPUT FORMAT — follow exactly:
  ISSUE IDENTIFIED: [One sentence naming the specific problem.]
  STEP 1: [First corrective action.]
  STEP 2: [Second corrective action or confirmation.]
LOGIC: Analyze the provided job data, active field, and conversation context before responding. Identify empty fields, misused fields, or behavioral issues by name. If the issue cannot be determined from context: "Insufficient context is available to diagnose this issue. Please describe the specific action being attempted."
`}`;
};

const mkThreads = () => ({
  title:[{role:"assistant",content:WELCOME_TITLE}],
  pay:[],shift:[],responsibility:[],extras:[],help:[]
});

export default function App() {
  const [threads,     setThreads]     = useState(mkThreads());
  const [jobData,     setJobData]     = useState({title:"",pay:"",shift:"",responsibility:"",extras:""});
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [file,        setFile]        = useState(null);
  const [fileName,    setFileName]    = useState("");
  const [mode,        setMode]        = useState("COLLECT");
  const [draftReady,  setDraftReady]  = useState(false);
  const [activeField, setActiveField] = useState("title");
  const [autoFill,    setAutoFill]    = useState(null);
  const [approved,    setApproved]    = useState({title:false,pay:false,shift:false,responsibility:false,extras:false});
  const [showPreview, setShowPreview] = useState(true);
  const [showHelp,    setShowHelp]    = useState(false);
  const [helpInput,   setHelpInput]   = useState("");
  const [helpLoading, setHelpLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const bottomRef  = useRef(null);
  const fileRef    = useRef(null);
  const taRef      = useRef(null);
  const jobDataRef = useRef(jobData);
  useEffect(()=>{ jobDataRef.current = jobData; },[jobData]);
  useEffect(()=>{ setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80); },[threads, activeField]);

  const toBase64 = f => new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(f); });

  const sanitise = useCallback(history => {
    const clean = history
      .map(m=>({role:m.role, content:Array.isArray(m.content)?m.content:(m.content||"").trim()}))
      .filter(m=>m.content&&m.content.length);
    let s=0; while(s<clean.length&&clean[s].role==="assistant") s++;
    const trimmed = clean.slice(s);
    const merged=[]; for(const m of trimmed){ const p=merged[merged.length-1]; if(p&&p.role===m.role){ if(typeof p.content==="string"&&typeof m.content==="string") p.content+="\n"+m.content; } else merged.push({...m}); }
    const alt=[]; let last=null; for(const m of merged){ if(m.role!==last){alt.push(m);last=m.role;} }
    while(alt.length&&alt[0].role!=="user") alt.shift();
    return alt;
  },[]);

  const callAPI = async (threadHistory, apiMode, fieldKey, fileObj, snapshot) => {
    let apiMsgs = sanitise(threadHistory);
    if(!apiMsgs.length) throw new Error("No valid messages to send.");
    if(fileObj){
      const b64=await toBase64(fileObj);
      const last=apiMsgs[apiMsgs.length-1];
      apiMsgs[apiMsgs.length-1]={role:"user",content:[{type:"text",text:typeof last.content==="string"?last.content:"Import this file."},{type:"document",source:{type:"base64",media_type:fileObj.type||"application/pdf",data:b64}}]};
    }
    const res=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1024,system:buildSystem(apiMode,snapshot||jobDataRef.current,fieldKey),messages:apiMsgs}),
    });
    if(!res.ok){ let msg=`HTTP ${res.status}`; try{const e=await res.json();msg=e?.error?.message||msg;}catch{} throw new Error(msg); }
    const data=await res.json();
    if(data.error) throw new Error(data.error.message||"API error");
    return (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n")||"No response received.";
  };

  const switchField = (fieldKey) => {
    if(loading) return;
    setActiveField(fieldKey);
    setInput(""); setSuggestions([]);
    if(fieldKey!=="title" && threads[fieldKey].length===0 && THREAD_INTROS[fieldKey]){
      setThreads(prev=>({...prev,[fieldKey]:[{role:"assistant",content:THREAD_INTROS[fieldKey]}]}));
    }
    taRef.current?.focus();
  };

  const pushToThread = (fieldKey, msg) =>
    setThreads(prev=>({...prev,[fieldKey]:[...prev[fieldKey],msg]}));

  const send = async (overrideText, overrideMode, snapshot) => {
    const text=(overrideText??input).trim();
    const activeMode=overrideMode??mode;
    const field=activeField;
    if(!text&&!file) return;
    if(loading) return;

    const userMsg={role:"user",content:text||(file?`[Uploading: ${fileName}]`:"")};
    const currentThread=[...threads[field],userMsg];
    pushToThread(field,userMsg);
    setInput(""); setLoading(true);
    if(activeMode==="COLLECT") setSuggestions([]);

    const attachedFile=file; if(file){setFile(null);setFileName("");}

    if(activeMode==="COLLECT"&&text&&!snapshot){
      setJobData(prev=>{ const u={...prev}; if(field&&!u[field]) u[field]=text; return u; });
    }

    try {
      const rawReply=await callAPI(currentThread,activeMode,field,attachedFile,snapshot);

      let reply=rawReply;
      if(activeMode==="COLLECT"){
        const sugMatch=rawReply.match(/\nSUGGESTIONS:\s*(\[.*?\])\s*$/s);
        if(sugMatch){
          try {
            const parsed=JSON.parse(sugMatch[1]);
            if(Array.isArray(parsed)&&parsed.length) setSuggestions(parsed.slice(0,3));
          } catch {}
          reply=rawReply.slice(0,sugMatch.index).trim();
        }
      }

      pushToThread(field,{role:"assistant",content:reply});
      if(activeMode==="DRAFT") setDraftReady(true);
      if(activeMode==="COLLECT"){
        setJobData(prev=>{
          const u={...prev};
          if(autoFill&&!u[autoFill]){
            const match=reply.match(/[Ll]ocked\s+in[:\s]+([^.\n!?]+)/);
            u[autoFill]=match?match[1].trim().replace(/^["']|["']$/g,""):"[Auto-filled — see chat]";
          }
          return u;
        });
      }
    } catch(err){
      console.error("API Error:",err);
      pushToThread(field,{role:"assistant",content:`⚠️ ${err.message} — please try again.`});
    }
    setLoading(false); setAutoFill(null); taRef.current?.focus();
  };

  const handleAutoFill = (fieldKey) => {
    if(loading) return;
    setAutoFill(fieldKey);
    switchField(fieldKey);
    const f=FIELDS.find(f=>f.key===fieldKey);
    const snap={...jobDataRef.current};
    setTimeout(()=>{
      send(`AUTO-FILL for "${f.label}": ${f.autoHint}. Begin your response with "Locked in: [value]." then confirm the field is complete.`,"COLLECT",snap);
    },50);
  };

  const handleGenerate = () => {
    if(loading) return;
    const snap={...jobDataRef.current};
    setMode("DRAFT"); setDraftReady(false);
    setActiveField("title");
    setTimeout(()=>send("Generate the complete finalized Job Application Detail Form now using all collected details.","DRAFT",snap),50);
  };

  const handleHelpQuery = async () => {
    const text=helpInput.trim();
    if(!text||helpLoading) return;
    const userMsg={role:"user",content:text};
    const nextThread=[...threads.help,userMsg];
    pushToThread("help",userMsg);
    setHelpInput(""); setHelpLoading(true);
    try {
      const snap={...jobDataRef.current};
      const ctx=`\nCURRENT JOB DATA: ${JSON.stringify(snap)}\nACTIVE FIELD: ${activeField}\nMODE: ${mode}\nTOTAL THREAD MESSAGES: ${Object.values(threads).flat().length}`;
      const apiMsgs=sanitise(nextThread);
      if(!apiMsgs.length) throw new Error("No messages.");
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:512,system:buildSystem("HELP",snap,activeField)+ctx,messages:apiMsgs}),
      });
      if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e?.error?.message||`HTTP ${res.status}`); }
      const data=await res.json();
      const reply=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n")||"No response received.";
      pushToThread("help",{role:"assistant",content:reply});
    } catch(err){
      pushToThread("help",{role:"assistant",content:`⚠️ ${err.message}`});
    }
    setHelpLoading(false);
  };

  const handleStartOver = () => {
    if(loading) return;
    setThreads(mkThreads());
    setJobData({title:"",pay:"",shift:"",responsibility:"",extras:""});
    setApproved({title:false,pay:false,shift:false,responsibility:false,extras:false});
    setMode("COLLECT"); setDraftReady(false); setActiveField("title");
    setInput(""); setFile(null); setFileName(""); setAutoFill(null);
    setShowHelp(false); setSuggestions([]);
  };

  const toggleApprove = (fieldKey) => {
    if(loading) return;
    setApproved(prev=>{
      const next={...prev,[fieldKey]:!prev[fieldKey]};
      if(Object.values(next).every(Boolean)) setTimeout(()=>handleGenerate(),150);
      return next;
    });
  };

  const handleKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };

  const handleSuggestionClick = (suggText) => {
    if(loading) return;
    const field=activeField;
    const currentVal=jobDataRef.current[field]||"";
    const combined=currentVal?`${currentVal}; ${suggText}`:suggText;
    setJobData(prev=>({...prev,[field]:combined}));
    setSuggestions([]);
    send(suggText,"COLLECT",{...jobDataRef.current,[field]:combined});
  };

  const completedCount = FIELDS.slice(0,4).filter(f=>jobData[f.key]).length;
  const approvedCount  = Object.values(approved).filter(Boolean).length;
  const allDone        = completedCount===4;
  const allApproved    = approvedCount===5;

  const liveDraft = useMemo(()=>{
    const {title,pay,shift,responsibility,extras}=jobData;
    const opener = title||pay
      ? `${COMPANY.name} is seeking a ${title||"*(Job Title Pending)*"} to join our precision manufacturing team${pay?`, offering ${pay}`:""}.`
      : `*(Job Title and Compensation pending — these will be woven into the opening sentence once provided.)*`;
    return `### 1. ABOUT HEFNER MACHINE & TOOL
${opener}

${COMPANY.name} maintains a primary commitment to Precise & Accurate CNC Machining, delivering high-precision production components to an expansive customer base across the Aerospace, Defense, and Medical sectors. Our facility is engineered for versatility, managing a wide range of specialty materials and overseeing complex outsourced requirements—including precision plating and finishing—to ensure a full-service manufacturing solution. This core standard serves as the baseline for all production operations at our Hatfield facility.

**Schedule:** ${shift||COMPANY.schedule} | **Location:** ${COMPANY.location} | **Benefits:** ${COMPANY.benefits}

### 2. COMPANY OVERVIEW
${responsibility?`${COMPANY.name} is a ${COMPANY.industry} serving ${COMPANY.sectors}. This position is responsible for ${responsibility}, in direct support of the company's core commitment to Precise & Accurate CNC Machining.`:"*Primary responsibility is required to generate the Company Overview.*"}

### 3. CORE COMPETENCIES
${responsibility?`- Preferred: Advanced experience in ${responsibility}\n- Preferred: Proficiency with ${COMPANY.materials}\n- ${COMPANY.quality}\n- Capacity to maintain exacting tolerances in a high-volume production environment`:"- *(Awaiting role details)*"}

### 4. OPERATIONAL DETAILS
${extras||"*(Operational details will be reflected here once provided.)*"}

### 5. COMPANY STANDARDS
${FOOTER}`;
  },[jobData]);

  // ─────────────────────────────────────────────────────────────────────────────
  // FIX: fmt() now accepts an `isUserBubble` flag so inline styles adapt to
  // the dark green background. On user bubbles everything must render white/light.
  // ─────────────────────────────────────────────────────────────────────────────
  const fmt = (text, isUserBubble = false) => {
    // Color tokens that respect bubble context
    const bodyColor    = isUserBubble ? "#FFFFFF"           : "#1F2937";
    const headingColor = isUserBubble ? "#FFFFFF"           : "#003d23";
    const mutedColor   = isUserBubble ? "rgba(255,255,255,0.75)" : "#4B5563";
    const strongColor  = isUserBubble ? "#FFFFFF"           : "#111827";
    // code: on dark green bg use a semi-transparent white pill; on gray bg use a deeper green pill
    const codeColor    = isUserBubble ? "#FFFFFF"           : "#003d23";
    const codeBg       = isUserBubble ? "rgba(255,255,255,0.18)" : "#DFE3EA";
    const hrColor      = isUserBubble ? "rgba(255,255,255,0.25)" : "#C8CDD6";
    const liColor      = isUserBubble ? "#FFFFFF"           : "#1F2937";

    const lines=text.split("\n"); const out=[]; let tRows=[],inT=false;
    const flushT=k=>{
      if(!tRows.length)return;
      out.push(
        <table key={`t${k}`} style={{width:"100%",borderCollapse:"collapse",margin:"8px 0",fontSize:"0.82rem"}}>
          <tbody>
            {tRows.map((row,ri)=>(
              <tr key={ri} style={{borderBottom:`1px solid ${hrColor}`}}>
                {row.map((cell,ci)=>(
                  <td key={ci} style={{
                    padding:"5px 8px",
                    color: ci===0 ? headingColor : bodyColor,
                    fontWeight:ci===0?600:400,
                    verticalAlign:"top"
                  }}>{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      tRows=[];inT=false;
    };

    // Inline renderer — also receives bubble context
    const inl = txt => txt.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p,i)=>{
      if(p.startsWith("**")&&p.endsWith("**"))
        return <strong key={i} style={{color:strongColor,fontWeight:700}}>{p.slice(2,-2)}</strong>;
      if(p.startsWith("`")&&p.endsWith("`"))
        return <code key={i} style={{background:codeBg,padding:"1px 5px",borderRadius:3,fontSize:"0.83em",color:codeColor}}>{p.slice(1,-1)}</code>;
      return p;
    });

    lines.forEach((line,i)=>{
      if(line.startsWith("|")){
        if(/^[\s|:-]+$/.test(line))return;
        inT=true;
        tRows.push(line.split("|").slice(1,-1));
        return;
      }
      if(inT)flushT(i);
      if(line.startsWith("### ")){
        out.push(<h3 key={i} style={{margin:"12px 0 3px",fontSize:"0.85rem",color:headingColor,fontWeight:700}}>{inl(line.slice(4))}</h3>);
        return;
      }
      if(line.startsWith("## ")){
        out.push(<h2 key={i} style={{margin:"12px 0 4px",fontSize:"0.92rem",color:headingColor,fontWeight:700}}>{inl(line.slice(3))}</h2>);
        return;
      }
      if(line.startsWith("# ")){
        out.push(<h1 key={i} style={{margin:"13px 0 5px",fontSize:"0.98rem",color:headingColor,fontWeight:800}}>{inl(line.slice(2))}</h1>);
        return;
      }
      if(line.startsWith("- ")||line.startsWith("* ")){
        out.push(<li key={i} style={{marginLeft:16,marginBottom:2,lineHeight:1.6,color:liColor}}>{inl(line.slice(2))}</li>);
        return;
      }
      if(/^\d+\.\s/.test(line)){
        out.push(<li key={i} style={{marginLeft:16,marginBottom:2,color:liColor}}>{inl(line.replace(/^\d+\.\s/,""))}</li>);
        return;
      }
      if(line.trim()==="---"){
        out.push(<hr key={i} style={{border:"none",borderTop:`1px solid ${hrColor}`,margin:"8px 0"}}/>);
        return;
      }
      if(line.trim()===""){
        out.push(<div key={i} style={{height:4}}/>);
        return;
      }
      out.push(<p key={i} style={{margin:"2px 0",lineHeight:1.65,color:bodyColor}}>{inl(line)}</p>);
    });
    if(inT)flushT("end");
    return out;
  };

  const badge={
    COLLECT:{bg:"#004d2c",border:"#006637",color:"#FFFFFF",label:"Collecting"},
    DRAFT:  {bg:"#1d4ed8",border:"#1e40af",color:"#FFFFFF",label:"Draft Ready"},
    EDIT:   {bg:"#92400e",border:"#78350f",color:"#FFFFFF",label:"Editing"},
  }[mode];

  const btnBase={border:"none",borderRadius:3,cursor:"pointer",fontWeight:600,fontSize:"0.75rem",padding:"7px 0",transition:"all 0.15s"};
  const activeThread = threads[activeField] || [];
  const lastDraftMsg = [...threads.title].reverse().find(m=>m.role==="assistant"&&(m.content.includes("ABOUT HEFNER MACHINE") || m.content.includes("JOB OVERVIEW")));

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#D1D5DB",color:"#111827",fontFamily:"'Open Sans','Roboto','Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap');`}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{background:"#004d2c",borderBottom:"2px solid #003820",padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,background:"#FFFFFF",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🛠️</div>
          <div>
            <div style={{fontWeight:700,fontSize:"0.88rem",color:"#FFFFFF",lineHeight:1.2}}>Hefner Executive Job Architect</div>
            {/* FIX: was rgba(255,255,255,0.55) — too faint. Raised to 0.80 for legibility. */}
            <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.80)",marginTop:1}}>v6.5 · Hatfield, PA · Precision CNC Manufacturing</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setShowPreview(p=>!p)} style={{background:"#003820",border:"1px solid #006637",borderRadius:4,color:showPreview?"#FFFFFF":"rgba(255,255,255,0.65)",fontSize:"0.65rem",padding:"4px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:11}}>👁</span>{showPreview?"Hide Preview":"Show Preview"}
          </button>
          {/* FIX: was rgba(255,255,255,0.6) — too faint on dark green. Raised to solid white. */}
          {mode==="COLLECT"&&<div style={{fontSize:"0.69rem",color:"#FFFFFF",fontWeight:600,background:"rgba(255,255,255,0.12)",padding:"2px 7px",borderRadius:10}}>{completedCount}/4</div>}
          <div style={{background:badge.bg,border:`1px solid ${badge.border}`,borderRadius:20,padding:"3px 10px",fontSize:"0.67rem",color:badge.color,fontWeight:600}}>{badge.label}</div>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      {mode==="COLLECT"&&(
        <div style={{height:3,background:"#B0B5BF",flexShrink:0}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#004d2c,#006637)",width:`${(completedCount/4)*100}%`,transition:"width 0.4s ease"}}/>
        </div>
      )}

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <div style={{width:168,flexShrink:0,background:"#C3C7CF",borderRight:"1px solid #ADB2BC",padding:"10px 8px",display:"flex",flexDirection:"column",gap:5,overflowY:"auto"}}>
          <div style={{fontSize:"0.63rem",color:"#4B5563",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,paddingLeft:3,fontWeight:700}}>Fields</div>
          {FIELDS.map(f=>{
            const done=!!jobData[f.key], active=activeField===f.key, filling=autoFill===f.key&&loading, isApproved=approved[f.key];
            const threadLen=threads[f.key].length;
            return (
              <div key={f.key} style={{borderRadius:4,border:`1px solid ${isApproved?"#16a34a":active?"#004d2c":done?"#166534":"#9CA3AF"}`,background:isApproved?"#f0fdf4":active?"#EBF5EE":"#ECEEF2",overflow:"hidden",transition:"all 0.15s"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                  <button onClick={()=>switchField(f.key)} style={{display:"flex",alignItems:"center",gap:6,flex:1,background:"transparent",border:"none",padding:"7px 7px",cursor:loading?"default":"pointer",textAlign:"left",minWidth:0}}>
                    <span style={{fontSize:11,flexShrink:0}}>{isApproved?"✅":done?"🟢":active?"▶":f.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"0.69rem",color:isApproved?"#15803d":active?"#004d2c":done?"#15803d":"#4B5563",fontWeight:active||done||isApproved?700:500,lineHeight:1.3}}>
                        {f.label}
                        {/* FIX: thread count badge — was #15803d on #dcfce7, fine; kept as-is */}
                        {threadLen>1&&<span style={{marginLeft:5,fontSize:"0.58rem",color:"#15803d",background:"#dcfce7",borderRadius:8,padding:"1px 5px"}}>{threadLen-1}</span>}
                      </div>
                      {/* FIX: field value preview — was #15803d on #EBF5EE (active). Darkened to #14532d for more contrast. */}
                      {done&&jobData[f.key]&&<div style={{fontSize:"0.6rem",color:active?"#14532d":"#15803d",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600}}>{jobData[f.key]}</div>}
                    </div>
                  </button>
                  <button onClick={()=>toggleApprove(f.key)} disabled={loading} title={isApproved?"Remove approval":"Approve this field"}
                    style={{flexShrink:0,marginRight:6,width:18,height:18,borderRadius:"50%",border:`1.5px solid ${isApproved?"#16a34a":"#9CA3AF"}`,background:isApproved?"#16a34a":"transparent",color:isApproved?"#FFFFFF":"#9CA3AF",cursor:loading?"not-allowed":"pointer",fontSize:"0.58rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",lineHeight:1,padding:0}}
                    onMouseEnter={e=>{if(!loading&&!isApproved){e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.color="#16a34a";}}}
                    onMouseLeave={e=>{if(!isApproved){e.currentTarget.style.borderColor="#9CA3AF";e.currentTarget.style.color="#9CA3AF";}}}
                  >✓</button>
                </div>
                <button onClick={()=>handleAutoFill(f.key)} disabled={loading}
                  style={{width:"100%",background:filling?"#dcfce7":done?"#f0fdf4":"#DDE0E6",border:"none",borderTop:"1px solid #ADB2BC",color:filling?"#14532d":done?"#14532d":"#374151",cursor:loading?"not-allowed":"pointer",padding:"4px 0",fontSize:"0.63rem",fontWeight:700,transition:"all 0.15s"}}
                  onMouseEnter={e=>{if(!loading){e.currentTarget.style.background="#dcfce7";e.currentTarget.style.color="#14532d";}}}
                  onMouseLeave={e=>{e.currentTarget.style.background=filling?"#dcfce7":done?"#f0fdf4":"#DDE0E6";e.currentTarget.style.color=filling?"#14532d":done?"#14532d":"#374151";}}
                >{filling?"⟳ Filling…":"⚡ Auto-Fill"}</button>
              </div>
            );
          })}

          {/* FIX: approval count — was #6B7280 when not all approved, too light. Use #4B5563. */}
          <div style={{padding:"6px 4px 2px",fontSize:"0.62rem",color:allApproved?"#14532d":"#4B5563",textAlign:"center",fontWeight:allApproved?700:500}}>{allApproved?"All approved — generating…":`${approvedCount}/5 approved`}</div>

          <div style={{marginTop:4}}>
            <button onClick={handleGenerate} disabled={loading||(!allDone&&!allApproved)}
              style={{...btnBase,width:"100%",background:!loading&&(allApproved||allDone)?"#004d2c":"#C4C8CE",color:!loading&&(allApproved||allDone)?"#FFFFFF":"#6B7280",cursor:!loading&&(allApproved||allDone)?"pointer":"not-allowed",boxShadow:!loading&&(allApproved||allDone)?"0 2px 10px rgba(0,77,44,0.18)":"none",padding:"9px 6px",fontSize:"0.72rem",lineHeight:1.35,textAlign:"center",border:"none"}}>
              {loading&&mode==="DRAFT"?"⟳ Building…":allApproved?"✅ All Approved":allDone?"✅ Generate Draft":`⬜ ${completedCount}/4 Done`}
            </button>
          </div>

          {draftReady&&!loading&&(
            <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:2}}>
              <button onClick={()=>setMode("EDIT")}                            style={{...btnBase,background:"#ECEEF2",border:"1px solid #d97706",color:"#78350f",cursor:"pointer"}}>✏️ Edit Section</button>
              <button onClick={handleGenerate}                                  style={{...btnBase,background:"#ECEEF2",border:"1px solid #166534",color:"#14532d",cursor:"pointer"}}>🔄 Regenerate</button>
              <button onClick={()=>{setMode("COLLECT");setDraftReady(false);}} style={{...btnBase,background:"#ECEEF2",border:"1px solid #6b9fd4",color:"#1e40af",cursor:"pointer"}}>➕ Add Info</button>
            </div>
          )}

          <div style={{marginTop:"auto",paddingTop:8,borderTop:"1px solid #ADB2BC"}}>
            <button onClick={handleStartOver} disabled={loading} style={{...btnBase,width:"100%",background:"transparent",border:"1px solid #8C9099",color:"#374151",cursor:loading?"not-allowed":"pointer",fontSize:"0.65rem",padding:"5px 0"}}
              onMouseEnter={e=>{if(!loading){e.currentTarget.style.color="#111827";e.currentTarget.style.borderColor="#6B7280";}}}
              onMouseLeave={e=>{e.currentTarget.style.color="#374151";e.currentTarget.style.borderColor="#8C9099";}}
            >↺ Start Over</button>
          </div>
        </div>

        {/* ── Main area ──────────────────────────────────────────────────────── */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* Chat panel */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:280,borderRight:showPreview?"1px solid #ADB2BC":"none",position:"relative"}}>

            {/* Thread label */}
            <div style={{padding:"6px 13px",background:"#C8CBD3",borderBottom:"1px solid #ADB2BC",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:11}}>{FIELDS.find(f=>f.key===activeField)?.icon||"💬"}</span>
                <span style={{fontSize:"0.68rem",color:"#004d2c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{FIELDS.find(f=>f.key===activeField)?.label||"Draft"} Thread</span>
              </div>
              {/* FIX: message count — was #D1D5DB (nearly invisible on light bg). Changed to #9CA3AF. */}
              <span style={{fontSize:"0.6rem",color:"#6B7280"}}>{activeThread.length} msg{activeThread.length!==1?"s":""}</span>
            </div>

            {/* Messages */}
            <div style={{flex:1,overflowY:"auto",padding:"14px 13px",display:"flex",flexDirection:"column",gap:9,background:"#D1D5DB"}}>
              {activeThread.map((m,i)=>{
                const isUser = m.role==="user";
                return (
                  <div key={i} style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start"}}>
                    <div style={{
                      maxWidth:"88%",minWidth:0,
                      // user bubble = dark green; assistant bubble = soft warm gray (not stark white)
                      background:isUser?"#004d2c":"#ECEEF2",
                      color:isUser?"#FFFFFF":"#1F2937",
                      border:!isUser?"1px solid #BEC3CB":"none",
                      borderRadius:isUser?"14px 14px 4px 14px":"14px 14px 14px 4px",
                      padding:"9px 12px",fontSize:"0.84rem",wordBreak:"break-word"
                    }}>
                      {/* FIX: pass isUser so fmt() renders white text/elements on dark green */}
                      {fmt(m.content, isUser)}
                    </div>
                  </div>
                );
              })}
              {loading&&(
                <div style={{display:"flex",justifyContent:"flex-start"}}>
                  <div style={{background:"#ECEEF2",border:"1px solid #BEC3CB",borderRadius:"14px 14px 14px 4px",padding:"9px 14px",color:"#4B5563",fontSize:"0.82rem"}}>
                    {mode==="DRAFT"?"Building your draft…":autoFill?"Auto-filling…":"Thinking…"}
                  </div>
                </div>
              )}
              {!loading&&activeThread.length>0&&activeThread[activeThread.length-1].role==="assistant"&&(()=>{
                const order=["title","pay","shift","responsibility","extras"];
                const nextEmpty=order.find(k=>!jobData[k]);
                const chips=[];
                if(nextEmpty&&nextEmpty!==activeField){
                  const nf=FIELDS.find(f=>f.key===nextEmpty);
                  chips.push({key:"next",label:`▶ Next: ${nf.label}`,action:()=>switchField(nextEmpty)});
                }
                if(!jobData[activeField]){
                  chips.push({key:"autofill",label:"⚡ Auto-Fill This Field",action:()=>handleAutoFill(activeField)});
                }
                if(jobData[activeField]&&!approved[activeField]){
                  chips.push({key:"approve",label:"✓ Approve This Field",action:()=>toggleApprove(activeField)});
                }
                if(allDone&&!draftReady){
                  chips.push({key:"generate",label:"📄 Generate Draft",action:handleGenerate});
                }
                const hasSuggestions=mode==="COLLECT"&&suggestions.length>0;
                if(!chips.length&&!hasSuggestions) return null;
                return (
                  <div style={{display:"flex",flexDirection:"column",gap:6,padding:"4px 2px 6px"}}>
                    {chips.length>0&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {chips.map(c=>(
                          <button key={c.key} onClick={c.action} disabled={loading}
                            style={{background:"#ECEEF2",border:"1px solid #ADB2BC",borderRadius:20,color:"#374151",cursor:"pointer",fontSize:"0.7rem",fontWeight:600,padding:"5px 12px",transition:"all 0.15s",lineHeight:1.3,whiteSpace:"nowrap"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor="#004d2c";e.currentTarget.style.color="#004d2c";e.currentTarget.style.background="#EBF5EE";}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor="#ADB2BC";e.currentTarget.style.color="#374151";e.currentTarget.style.background="#ECEEF2";}}>
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {hasSuggestions&&(
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginTop:chips.length?2:0}}>
                          <div style={{flex:1,height:"1px",background:"#9CA3AF"}}/>
                          <span style={{fontSize:"0.58rem",color:"#374151",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",flexShrink:0}}>Executive Suggestions</span>
                          <div style={{flex:1,height:"1px",background:"#9CA3AF"}}/>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {suggestions.map((sug,idx)=>(
                            <button key={idx} onClick={()=>handleSuggestionClick(sug)} disabled={loading}
                              style={{background:"#004d2c",border:"1px solid #003820",borderRadius:20,color:"#FFFFFF",cursor:"pointer",fontSize:"0.68rem",fontWeight:600,padding:"4px 11px",transition:"all 0.15s",lineHeight:1.35,whiteSpace:"nowrap",opacity:1}}
                              onMouseEnter={e=>{e.currentTarget.style.background="#006637";e.currentTarget.style.borderColor="#004d2c";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="#004d2c";e.currentTarget.style.borderColor="#003820";}}>
                              + {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div ref={bottomRef}/>
            </div>

            {/* Help button */}
            <button onClick={()=>setShowHelp(p=>!p)} title="Help & Diagnostics"
              style={{position:"absolute",bottom:68,right:14,zIndex:20,width:30,height:30,borderRadius:"50%",background:showHelp?"#004d2c":"#ECEEF2",border:`1px solid ${showHelp?"#004d2c":"#ADB2BC"}`,color:showHelp?"#FFFFFF":"#374151",cursor:"pointer",fontWeight:700,fontSize:"0.78rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",boxShadow:showHelp?"0 0 0 3px rgba(0,77,44,0.15)":"0 1px 3px rgba(0,0,0,0.12)"}}>?</button>

            {/* Help overlay */}
            {showHelp&&(
              <div style={{position:"absolute",bottom:62,right:12,zIndex:30,width:310,background:"#ECEEF2",border:"1px solid #ADB2BC",borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",display:"flex",flexDirection:"column",overflow:"hidden",maxHeight:400}}>
                <div style={{padding:"9px 13px",background:"#C8CBD3",borderBottom:"1px solid #ADB2BC",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                  <div>
                    <div style={{fontSize:"0.75rem",color:"#003d23",fontWeight:700}}>Help & Diagnostics</div>
                    <div style={{fontSize:"0.61rem",color:"#374151",marginTop:1}}>Describe an issue or ask how a feature works</div>
                  </div>
                  <button onClick={()=>setShowHelp(false)} style={{background:"none",border:"none",color:"#4B5563",cursor:"pointer",fontSize:15,lineHeight:1,padding:"0 2px"}}>✕</button>
                </div>
                <div style={{flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:8,minHeight:100,background:"#D1D5DB"}}>
                  {threads.help.length===0&&(
                    <div style={{fontSize:"0.72rem",color:"#374151",lineHeight:1.7}}>
                      Examples:<br/>
                      · "Auto-Fill is not saving my field"<br/>
                      · "How does section approval work?"<br/>
                      · "My pay range is not being accepted"
                    </div>
                  )}
                  {threads.help.map((m,i)=>{
                    const isUser=m.role==="user";
                    return (
                      <div key={i} style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start"}}>
                        <div style={{
                          maxWidth:"92%",
                          background:isUser?"#004d2c":"#ECEEF2",
                          color:isUser?"#FFFFFF":"#1F2937",
                          border:!isUser?"1px solid #BEC3CB":"none",
                          borderRadius:isUser?"10px 10px 3px 10px":"10px 10px 10px 3px",
                          padding:"7px 10px",fontSize:"0.75rem",lineHeight:1.6,whiteSpace:"pre-wrap"
                        }}>
                          {m.content}
                        </div>
                      </div>
                    );
                  })}
                  {helpLoading&&<div style={{fontSize:"0.72rem",color:"#4B5563",paddingLeft:2}}>Diagnosing…</div>}
                </div>
                <div style={{padding:"8px 10px",borderTop:"1px solid #ADB2BC",display:"flex",gap:6,flexShrink:0,background:"#C8CBD3"}}>
                  <textarea value={helpInput} onChange={e=>setHelpInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleHelpQuery();}}} disabled={helpLoading} placeholder="Describe your issue…" rows={1}
                    style={{flex:1,background:"#ECEEF2",border:"1px solid #ADB2BC",borderRadius:4,color:"#111827",padding:"6px 9px",fontSize:"0.75rem",resize:"none",outline:"none",lineHeight:1.5,fontFamily:"inherit"}}/>
                  <button onClick={handleHelpQuery} disabled={helpLoading||!helpInput.trim()}
                    style={{background:!helpLoading&&helpInput.trim()?"#004d2c":"#9CA3AF",border:"none",borderRadius:4,color:!helpLoading&&helpInput.trim()?"#FFFFFF":"#ECEEF2",cursor:!helpLoading&&helpInput.trim()?"pointer":"not-allowed",padding:"6px 11px",fontWeight:700,fontSize:"0.75rem",flexShrink:0,transition:"background 0.15s"}}>Send</button>
                </div>
              </div>
            )}

            {/* File badge */}
            {fileName&&(
              <div style={{margin:"0 12px 4px",background:"#ECEEF2",border:"1px solid #ADB2BC",borderRadius:4,padding:"4px 10px",fontSize:"0.74rem",color:"#003d23",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,fontWeight:600}}>
                <span>📎 {fileName}</span>
                <button onClick={()=>{setFile(null);setFileName("");}} style={{background:"none",border:"none",color:"#4B5563",cursor:"pointer",fontSize:13,lineHeight:1}}>✕</button>
              </div>
            )}

            {/* Input bar */}
            <div style={{padding:"7px 12px 11px",background:"#C8CBD3",borderTop:"1px solid #ADB2BC",display:"flex",gap:6,alignItems:"flex-end",flexShrink:0}}>
              <button onClick={()=>fileRef.current?.click()} disabled={loading} style={{background:"#ECEEF2",border:"1px solid #ADB2BC",borderRadius:4,color:loading?"#ADB2BC":"#374151",cursor:loading?"not-allowed":"pointer",padding:"7px 9px",fontSize:13,flexShrink:0}}>📎</button>
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){setFile(f);setFileName(f.name);}}}/>
              <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} disabled={loading}
                placeholder={loading?"Waiting for response…":mode==="COLLECT"?(FIELDS.find(f=>f.key===activeField)?.ph||"Type anything…"):mode==="EDIT"?"e.g. 'Change the Summary' or 'More formal'…":"Ask for edits or additions…"}
                rows={1} style={{flex:1,background:loading?"#DDE0E6":"#ECEEF2",border:"1px solid #ADB2BC",borderRadius:4,color:loading?"#6B7280":"#111827",padding:"7px 11px",fontSize:"0.84rem",resize:"none",outline:"none",lineHeight:1.55,fontFamily:"inherit",minWidth:0}}/>
              <button onClick={()=>send()} disabled={loading||(!input.trim()&&!file)}
                style={{background:!loading&&(input.trim()||file)?"#004d2c":"#C4C8CE",border:"none",borderRadius:4,color:!loading&&(input.trim()||file)?"#FFFFFF":"#6B7280",cursor:!loading&&(input.trim()||file)?"pointer":"not-allowed",padding:"7px 13px",fontWeight:700,fontSize:"0.83rem",flexShrink:0,transition:"background 0.15s"}}>Send</button>
            </div>
          </div>

          {/* ── Live Preview ───────────────────────────────────────────────────── */}
          {showPreview&&(
            <div style={{flex:1,background:"#D1D5DB",display:"flex",flexDirection:"column",overflow:"hidden",minWidth:260}}>
              <div style={{padding:"8px 14px",background:"#C8CBD3",borderBottom:"1px solid #ADB2BC",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <span style={{fontSize:"0.63rem",color:"#1F2937",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Live Draft Preview</span>
                <span style={{fontSize:"0.6rem",color:"#4B5563",fontWeight:500}}>Updates as fields are filled</span>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 14px",background:"#D1D5DB"}}>
                <div style={{background:"#FFFFFF",padding:"20px 18px",borderRadius:6,border:"1px solid #ADB2BC",fontSize:"0.82rem",boxShadow:"0 2px 8px rgba(0,0,0,0.10)"}}>
                  {/* Approval progress widget */}
                  <div style={{marginBottom:14,padding:"8px 10px",background:"#ECEEF2",borderRadius:4,border:"1px solid #BEC3CB"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:"0.62rem",color:"#374151",fontWeight:600}}>Section approvals</span>
                      <span style={{fontSize:"0.62rem",color:allApproved?"#14532d":"#374151",fontWeight:700}}>{approvedCount}/5</span>
                    </div>
                    <div style={{height:3,background:"#BEC3CB",borderRadius:2}}>
                      <div style={{height:"100%",background:"linear-gradient(90deg,#16a34a,#4ade80)",width:`${(approvedCount/5)*100}%`,borderRadius:2,transition:"width 0.3s ease"}}/>
                    </div>
                    <div style={{display:"flex",gap:4,marginTop:7,flexWrap:"wrap"}}>
                      {FIELDS.map(f=>(
                        <span key={f.key} style={{
                          fontSize:"0.58rem",padding:"2px 6px",borderRadius:10,
                          background:approved[f.key]?"#15803d":"#D1D5DB",
                          color:approved[f.key]?"#FFFFFF":"#374151",
                          border:`1px solid ${approved[f.key]?"#166534":"#ADB2BC"}`,
                          transition:"all 0.2s",
                          fontWeight:approved[f.key]?700:500
                        }}>
                          {approved[f.key]?"✓ ":""}{f.label.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Preview document renders on white — always pass isUserBubble=false */}
                  {fmt(lastDraftMsg?.content||liveDraft, false)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
