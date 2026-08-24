/* =========================================================
   STUDY DESK — app.js
   Vanilla JS, hash-routed, localStorage-persisted.
   No frameworks / no backend — safe for GitHub Pages.
   ========================================================= */

(function(){
  "use strict";

  const STORAGE_KEY = "studyDeskData.v1";

  const DAY_LABELS = ["월","화","수","목","금","토","일"];

  /* ---------------------------------------------------------
     State
  --------------------------------------------------------- */
  function defaultState(){
    return {
      subjects: [],      // {id, name, goalHours}
      todos: [],         // {id, text, done}
      notes: [],         // {id, title, subjectId, content, updatedAt}
      schedule: [],       // {id, title, subjectId, date} date = 'YYYY-MM-DD'
      sessions: [],       // {id, subjectId, start, end, durationSec} start/end = epoch ms
      settings: { name: "", dailyGoalHours: 5, dailyGoalMin: 0, backgroundAnimation: true },
      activeFocus: null,  // {subjectId, startTs, accumulatedSec, status}
      activeNoteId: null
    };
  }

  let state = load();

  function load(){
    try{
      const base = defaultState();
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return base;
      const parsed = JSON.parse(raw);
      const merged = Object.assign(base, parsed);
      merged.settings = Object.assign({}, base.settings, parsed.settings || {});
      return merged;
    }catch(e){
      console.error("Failed to load Study Desk data:", e);
      return defaultState();
    }
  }

  function save(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }catch(e){
      console.error("Failed to save Study Desk data:", e);
    }
  }

  function uid(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  /* ---------------------------------------------------------
     Time / date helpers
  --------------------------------------------------------- */
  function fmtHM(totalSec){
    const h = Math.floor(totalSec/3600);
    const m = Math.floor((totalSec%3600)/60);
    return `${h}시간 ${m}분`;
  }
  function fmtHHMMSS(totalSec){
    totalSec = Math.max(0, Math.floor(totalSec));
    const h = Math.floor(totalSec/3600);
    const m = Math.floor((totalSec%3600)/60);
    const s = totalSec%60;
    return [h,m,s].map((v,i)=> i===0 ? String(v).padStart(2,"0") : String(v).padStart(2,"0")).join(":");
  }
  function todayKey(d){
    d = d || new Date();
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }
  function startOfWeek(d){
    // Monday as start of week
    const day = (d.getDay()+6)%7; // 0=Mon
    const s = new Date(d);
    s.setHours(0,0,0,0);
    s.setDate(d.getDate()-day);
    return s;
  }
  function dDayLabel(dateStr){
    const target = new Date(dateStr+"T00:00:00");
    const now = new Date(); now.setHours(0,0,0,0);
    const diff = Math.round((target-now)/86400000);
    if(diff===0) return "D-DAY";
    if(diff>0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  }
  function dDayStamp(dateStr){
    const label = dDayLabel(dateStr);
    const urgent = label==="D-DAY" || (label.startsWith("D-") && Number(label.slice(2))<=3);
    return `<span class="dday-stamp${urgent?' urgent':''}">${label}</span>`;
  }

  /* ---------------------------------------------------------
     Subject helpers
  --------------------------------------------------------- */
  function subjectById(id){
    return state.subjects.find(s=>s.id===id);
  }
  function subjectName(id){
    const s = subjectById(id);
    return s ? s.name : "미지정";
  }
  function subjectSecondsTotal(id){
    return state.sessions.filter(s=>s.subjectId===id).reduce((a,s)=>a+s.durationSec,0);
  }

  /* ---------------------------------------------------------
     Routing
  --------------------------------------------------------- */
  const ROUTES = ["dashboard","focus","todo","subjects","notes","schedule","stats","settings"];

  function currentRoute(){
    const h = (location.hash||"").replace("#","");
    return ROUTES.includes(h) ? h : "dashboard";
  }

  function goToStudyRail(url){
    url = url || "study-rail.html";
    const overlay = document.getElementById("routeTransition");
    if(!overlay){ window.location.href = url; return; }
    overlay.classList.add("show");
    // 기차가 화면을 가로지르는 연출이 끝난 뒤 이동
    setTimeout(function(){ window.location.href = url; }, 1550);
  }

  function openSubjectPicker(){
    if(state.subjects.length===0){
      showToast("먼저 과목을 추가해주세요");
      location.hash = "#subjects";
      return;
    }
    const modal = document.getElementById("subjectPickModal");
    const list = document.getElementById("spmList");
    list.innerHTML = "";
    state.subjects.forEach(function(s){
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "spm-item";
      btn.innerHTML =
        `<span class="spm-item-name">${escapeHtml(s.name)}</span>` +
        `<span class="spm-item-goal mono">${fmtHM(subjectSecondsTotal(s.id))} / ${fmtHM(s.goalHours*3600)}</span>`;
      btn.addEventListener("click", function(){
        closeSubjectPicker();
        const url = "study-rail.html?subjectId=" + encodeURIComponent(s.id) + "&subjectName=" + encodeURIComponent(s.name);
        goToStudyRail(url);
      });
      list.appendChild(btn);
    });
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeSubjectPicker(){
    const modal = document.getElementById("subjectPickModal");
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function showRoute(){
    const route = currentRoute();
    if(route === "focus"){
      // "집중" 탭은 과목을 먼저 고른 뒤 STUDY RAIL(study-rail.html)로 이동합니다.
      location.hash = "#dashboard";
      openSubjectPicker();
      return;
    }
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    document.querySelectorAll(".nav a").forEach(a=>a.classList.remove("active"));

    if(route === "notes" && state.activeNoteId){
      document.getElementById("view-note-editor").classList.add("active");
    }else{
      const el = document.getElementById("view-"+route);
      if(el) el.classList.add("active");
    }
    const navLink = document.querySelector(`.nav a[data-route="${route}"]`);
    if(navLink) navLink.classList.add("active");

    renderAll();
  }

  window.addEventListener("hashchange", showRoute);

  /* ---------------------------------------------------------
     Render: shared subject <select> options
  --------------------------------------------------------- */
  function fillSubjectSelect(sel, {allowNone=true, noneLabel="과목 미지정"}={}){
    const prev = sel.value;
    sel.innerHTML = "";
    if(allowNone){
      const opt = document.createElement("option");
      opt.value = ""; opt.textContent = noneLabel;
      sel.appendChild(opt);
    }
    state.subjects.forEach(s=>{
      const opt = document.createElement("option");
      opt.value = s.id; opt.textContent = s.name;
      sel.appendChild(opt);
    });
    if([...sel.options].some(o=>o.value===prev)) sel.value = prev;
  }

  function emptyRow(tbody, colspan, text){
    tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-row">${text}</td></tr>`;
  }

  /* ---------------------------------------------------------
     Render: Dashboard
  --------------------------------------------------------- */
  let lastDashGoalPct = null;
  function renderDashboard(){
    const now = new Date();
    document.getElementById("dashDate").textContent =
      new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(now);

    // today's focused seconds
    const tKey = todayKey(now);
    const todaySec = state.sessions.filter(s=>todayKey(new Date(s.start))===tKey)
      .reduce((a,s)=>a+s.durationSec,0) + currentRunningSecForToday();
    document.getElementById("dashTodayTime").textContent = fmtHM(todaySec);
    document.getElementById("dashSessionHint").textContent =
      todaySec>0 ? `오늘 ${state.sessions.filter(s=>todayKey(new Date(s.start))===tKey).length}개의 집중 세션을 기록했습니다.` : "아직 집중 세션이 없습니다.";

    // goal progress
    const goalSec = (state.settings.dailyGoalHours||0)*3600 + (state.settings.dailyGoalMin||0)*60;
    const pct = goalSec>0 ? Math.min(100, Math.round(todaySec/goalSec*100)) : 0;
    document.getElementById("dashGoalFill").style.width = pct+"%";
    const pctEl = document.getElementById("dashGoalPct");
    const marker = document.getElementById("dashGoalMarker");
    if(marker) marker.style.left = pct+"%";
    if(lastDashGoalPct !== null && pct > lastDashGoalPct){
      pctEl.classList.remove("bump");
      void pctEl.offsetWidth; // restart animation
      pctEl.classList.add("bump");
    }
    if(lastDashGoalPct !== null && lastDashGoalPct < 100 && pct === 100){
      if(marker){
        marker.classList.remove("arrived");
        void marker.offsetWidth;
        marker.classList.add("arrived");
      }
      showToast("오늘 목표를 달성했습니다 🏴\u200d☠️");
    }
    lastDashGoalPct = pct;
    pctEl.textContent = pct+"%";
    const remain = Math.max(0, goalSec-todaySec);
    document.getElementById("dashGoalHint").textContent =
      remain>0 ? `오늘 목표까지 ${fmtHM(remain)} 남았습니다.` : "오늘 목표를 달성했습니다.";

    // todos (show up to 6)
    const list = document.getElementById("dashTodoList");
    list.innerHTML = "";
    const todos = state.todos.slice(0,6);
    if(todos.length===0){
      list.innerHTML = `<li class="empty-row">등록된 할 일이 없습니다. <a class="text-link" href="#todo">할 일 추가하기 →</a></li>`;
    }else{
      todos.forEach(t=>{
        const li = document.createElement("li");
        li.className = [t.done ? "done" : "", t.id===stampedTodoId ? "just-done" : ""].filter(Boolean).join(" ");
        li.innerHTML = `<input type="checkbox" ${t.done?"checked":""} data-id="${t.id}" class="dash-todo-check"><span class="todo-text">${escapeHtml(t.text)}</span>`;
        list.appendChild(li);
      });
    }
    list.querySelectorAll(".dash-todo-check").forEach(cb=>{
      cb.addEventListener("change", e=>{
        toggleTodo(e.target.getAttribute("data-id"));
      });
    });

    // upcoming schedule (top 4)
    const schedTbody = document.querySelector("#dashScheduleTable tbody");
    const upcoming = [...state.schedule].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
    if(upcoming.length===0){
      emptyRow(schedTbody, 4, "등록된 일정이 없습니다.");
    }else{
      schedTbody.innerHTML = upcoming.map(s=>`
        <tr>
          <td>${escapeHtml(s.title)}</td>
          <td>${escapeHtml(subjectName(s.subjectId))}</td>
          <td class="mono">${s.date}</td>
          <td>${dDayStamp(s.date)}</td>
        </tr>`).join("");
    }
  }

  function currentRunningSecForToday(){
    if(!state.activeFocus) return 0;
    const af = state.activeFocus;
    const elapsedNow = af.status==="running" ? (Date.now()-af.startTs)/1000 : 0;
    return af.accumulatedSec + elapsedNow;
  }

  /* ---------------------------------------------------------
     Render: Focus
  --------------------------------------------------------- */
  function renderFocus(){
    const sel = document.getElementById("focusSubjectSelect");
    fillSubjectSelect(sel, {allowNone:false});
    const startBtn = document.getElementById("focusStartBtn");

    if(state.subjects.length===0){
      sel.innerHTML = `<option value="">먼저 과목을 추가하세요</option>`;
      startBtn.disabled = true;
    }else{
      startBtn.disabled = false;
    }

    const af = state.activeFocus;
    const pauseBtn = document.getElementById("focusPauseBtn");
    const resumeBtn = document.getElementById("focusResumeBtn");
    const stopBtn = document.getElementById("focusStopBtn");
    const caption = document.getElementById("focusCaption");
    const elapsedHint = document.getElementById("focusElapsedHint");

    if(af){
      sel.value = af.subjectId;
      sel.disabled = true;
      startBtn.hidden = true;
      stopBtn.hidden = false;
      if(af.status==="running"){
        pauseBtn.hidden = false; resumeBtn.hidden = true;
        caption.textContent = `${subjectName(af.subjectId)} 집중 중`;
      }else{
        pauseBtn.hidden = true; resumeBtn.hidden = false;
        caption.textContent = `${subjectName(af.subjectId)} · 일시정지됨`;
      }
      elapsedHint.textContent = "";
    }else{
      sel.disabled = false;
      startBtn.hidden = false;
      pauseBtn.hidden = true; resumeBtn.hidden = true; stopBtn.hidden = true;
      caption.textContent = "시작 전";
      document.getElementById("focusTimer").textContent = "00:00:00";
      const todaySessions = state.sessions.filter(s=>todayKey(new Date(s.start))===todayKey());
      elapsedHint.textContent = todaySessions.length
        ? `오늘 누적 집중시간 ${fmtHM(todaySessions.reduce((a,s)=>a+s.durationSec,0))}`
        : "";
    }
    tickFocusDisplay();
  }

  function tickFocusDisplay(){
    const af = state.activeFocus;
    const timerEl = document.getElementById("focusTimer");
    const pill = document.getElementById("focusPill");
    const pillTime = document.getElementById("focusPillTime");
    const dial = document.getElementById("focusDial");
    if(af){
      const sec = currentRunningSecForToday_activeOnly();
      timerEl.textContent = fmtHHMMSS(sec);
      pill.hidden = false;
      pillTime.textContent = fmtHHMMSS(sec);
      if(dial){
        const pct = (sec % 3600) / 3600 * 100;
        dial.style.setProperty("--dial-pct", pct.toFixed(2));
        dial.classList.toggle("running", af.status==="running");
        dial.classList.toggle("paused", af.status==="paused");
      }
    }else{
      pill.hidden = true;
      if(dial){
        dial.style.setProperty("--dial-pct", 0);
        dial.classList.remove("running","paused");
      }
    }
  }
  function currentRunningSecForToday_activeOnly(){
    const af = state.activeFocus;
    if(!af) return 0;
    const elapsedNow = af.status==="running" ? (Date.now()-af.startTs)/1000 : 0;
    return af.accumulatedSec + elapsedNow;
  }

  function startFocus(){
    const sel = document.getElementById("focusSubjectSelect");
    if(!sel.value) return;
    state.activeFocus = { subjectId: sel.value, startTs: Date.now(), accumulatedSec:0, status:"running" };
    save(); renderAll();
  }
  function pauseFocus(){
    const af = state.activeFocus; if(!af || af.status!=="running") return;
    af.accumulatedSec += (Date.now()-af.startTs)/1000;
    af.status = "paused"; af.startTs = null;
    save(); renderAll();
  }
  function resumeFocus(){
    const af = state.activeFocus; if(!af || af.status!=="paused") return;
    af.startTs = Date.now(); af.status = "running";
    save(); renderAll();
  }
  function stopFocus(){
    const af = state.activeFocus; if(!af) return;
    const extra = af.status==="running" ? (Date.now()-af.startTs)/1000 : 0;
    const durationSec = Math.round(af.accumulatedSec + extra);
    const end = Date.now();
    const start = end - durationSec*1000;
    if(durationSec >= 5){
      state.sessions.push({ id: uid(), subjectId: af.subjectId, start, end, durationSec });
    }
    state.activeFocus = null;
    save(); renderAll();
    if(durationSec >= 5) showToast(`${fmtHM(durationSec)} 집중 기록이 저장되었습니다`);
  }

  /* ---------------------------------------------------------
     Render: Todo
  --------------------------------------------------------- */
  let stampedTodoId = null;
  function toggleTodo(id){
    const t = state.todos.find(x=>x.id===id);
    if(t){
      t.done = !t.done;
      stampedTodoId = t.done ? t.id : null;
      save(); renderAll();
      if(t.done) showToast("완료했습니다 🎉");
      clearTimeout(toggleTodo._clear);
      toggleTodo._clear = setTimeout(()=>{ stampedTodoId = null; }, 500);
    }
  }
  function deleteTodo(id){
    state.todos = state.todos.filter(x=>x.id!==id);
    save(); renderAll();
  }
  function addTodo(text){
    text = text.trim();
    if(!text) return;
    state.todos.unshift({ id: uid(), text, done:false });
    save(); renderAll();
    showToast("할 일이 추가되었습니다");
  }

  function renderTodo(){
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    if(state.todos.length===0){
      list.innerHTML = `<li class="empty-row">할 일이 없습니다. 위에서 추가해보세요.</li>`;
    }else{
      state.todos.forEach((t,i)=>{
        const li = document.createElement("li");
        li.className = [t.done ? "done" : "", t.id===stampedTodoId ? "just-done" : ""].filter(Boolean).join(" ");
        li.style.animationDelay = Math.min(i*0.03, 0.3)+"s";
        li.innerHTML = `
          <input type="checkbox" ${t.done?"checked":""} class="todo-check" data-id="${t.id}">
          <span class="todo-text">${escapeHtml(t.text)}</span>
          <span class="todo-del" data-id="${t.id}">삭제</span>`;
        list.appendChild(li);
      });
    }
    list.querySelectorAll(".todo-check").forEach(cb=>cb.addEventListener("change", e=>toggleTodo(e.target.getAttribute("data-id"))));
    list.querySelectorAll(".todo-del").forEach(el=>el.addEventListener("click", e=>deleteTodo(e.target.getAttribute("data-id"))));
  }

  /* ---------------------------------------------------------
     Render: Subjects
  --------------------------------------------------------- */
  function addSubject(name, goalHours){
    name = name.trim();
    if(!name) return;
    state.subjects.push({ id: uid(), name, goalHours: Math.max(1/60, Number(goalHours)||10) });
    save(); renderAll();
    showToast(`'${name}' 과목이 추가되었습니다`);
  }
  function deleteSubject(id){
    if(!confirm("이 과목을 삭제할까요? 관련 집중 기록은 유지되지만 과목 없음으로 표시됩니다.")) return;
    state.subjects = state.subjects.filter(s=>s.id!==id);
    save(); renderAll();
    showToast("과목이 삭제되었습니다");
  }

  function renderSubjects(){
    const tbody = document.querySelector("#subjectsTable tbody");
    if(state.subjects.length===0){
      emptyRow(tbody, 5, "등록된 과목이 없습니다. 위에서 추가해보세요.");
      return;
    }
    tbody.innerHTML = state.subjects.map((s,i)=>{
      const sec = subjectSecondsTotal(s.id);
      const goalSec = s.goalHours*3600;
      const pct = Math.min(100, Math.round(sec/goalSec*100));
      return `
        <tr style="animation-delay:${Math.min(i*0.03,0.3)}s">
          <td>${escapeHtml(s.name)}</td>
          <td class="mono">${fmtHM(sec)}</td>
          <td class="mono">${fmtHM(s.goalHours*3600)}</td>
          <td>
            <div class="mini-progress">
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
              <span class="mono" style="font-size:12px;">${pct}%</span>
            </div>
          </td>
          <td><span class="row-del" data-id="${s.id}">삭제</span></td>
        </tr>`;
    }).join("");
    tbody.querySelectorAll(".row-del").forEach(el=>el.addEventListener("click", e=>deleteSubject(e.target.getAttribute("data-id"))));
  }

  /* ---------------------------------------------------------
     Render: Notes
  --------------------------------------------------------- */
  function openNote(id){
    state.activeNoteId = id;
    save();
    location.hash = "#notes";
    showRoute();
  }
  function newNote(){
    const note = { id: uid(), title:"", subjectId:"", content:"", updatedAt: Date.now() };
    state.notes.unshift(note);
    state.activeNoteId = note.id;
    save();
    location.hash = "#notes";
    showRoute();
    setTimeout(()=>document.getElementById("noteTitleInput").focus(), 30);
  }
  function deleteNote(id){
    if(!confirm("이 노트를 삭제할까요?")) return;
    state.notes = state.notes.filter(n=>n.id!==id);
    if(state.activeNoteId===id) state.activeNoteId = null;
    save(); showRoute();
    showToast("노트가 삭제되었습니다");
  }

  let noteSaveTimer = null;
  function saveActiveNoteField(field, value){
    const note = state.notes.find(n=>n.id===state.activeNoteId);
    if(!note) return;
    note[field] = value;
    note.updatedAt = Date.now();
    clearTimeout(noteSaveTimer);
    const savedHint = document.getElementById("noteSavedHint");
    savedHint.textContent = "저장 중...";
    noteSaveTimer = setTimeout(()=>{
      save();
      savedHint.textContent = "자동 저장됨";
      renderNotesTableOnly();
    }, 400);
  }

  function renderNotesTableOnly(){
    const tbody = document.querySelector("#notesTable tbody");
    const q = (document.getElementById("notesSearch").value||"").toLowerCase();
    const filtered = state.notes.filter(n=> (n.title||"제목 없음").toLowerCase().includes(q));
    document.getElementById("notesEmptyHint").hidden = state.notes.length>0;
    if(filtered.length===0){
      emptyRow(tbody, 4, state.notes.length===0 ? "작성된 노트가 없습니다." : "검색 결과가 없습니다.");
      return;
    }
    tbody.innerHTML = filtered
      .sort((a,b)=>b.updatedAt-a.updatedAt)
      .map((n,i)=>`
        <tr class="note-row" data-id="${n.id}" style="animation-delay:${Math.min(i*0.03,0.3)}s">
          <td>${escapeHtml(n.title || "제목 없음")}</td>
          <td>${escapeHtml(subjectName(n.subjectId))}</td>
          <td class="mono">${new Intl.DateTimeFormat("ko-KR",{month:"2-digit",day:"2-digit"}).format(new Date(n.updatedAt))}</td>
          <td><span class="row-del" data-id="${n.id}">삭제</span></td>
        </tr>`).join("");
    tbody.querySelectorAll(".note-row td:not(:last-child)").forEach(td=>{
      td.style.cursor = "pointer";
      td.addEventListener("click", e=>openNote(e.currentTarget.parentElement.getAttribute("data-id")));
    });
    tbody.querySelectorAll(".row-del").forEach(el=>el.addEventListener("click", e=>{
      e.stopPropagation();
      deleteNote(e.target.getAttribute("data-id"));
    }));
  }

  function renderNotes(){
    renderNotesTableOnly();

    if(state.activeNoteId){
      const note = state.notes.find(n=>n.id===state.activeNoteId);
      if(!note){ state.activeNoteId = null; return; }
      document.getElementById("noteTitleInput").value = note.title;
      document.getElementById("noteContentInput").value = note.content;
      fillSubjectSelect(document.getElementById("noteSubjectSelect"), {allowNone:true, noneLabel:"과목 없음"});
      document.getElementById("noteSubjectSelect").value = note.subjectId || "";
      document.getElementById("noteSavedHint").textContent = "자동 저장됨";
    }
  }

  /* ---------------------------------------------------------
     Render: Schedule
  --------------------------------------------------------- */
  function addSchedule(title, subjectId, date){
    title = title.trim();
    if(!title || !date) return;
    state.schedule.push({ id: uid(), title, subjectId, date });
    save(); renderAll();
    showToast("일정이 추가되었습니다");
  }
  function deleteSchedule(id){
    state.schedule = state.schedule.filter(s=>s.id!==id);
    save(); renderAll();
    showToast("일정이 삭제되었습니다");
  }

  function renderSchedule(){
    fillSubjectSelect(document.getElementById("scheduleSubjectSelect"), {allowNone:true, noneLabel:"과목 없음"});
    const tbody = document.querySelector("#scheduleTable tbody");
    document.getElementById("scheduleEmptyHint").hidden = state.schedule.length>0;
    if(state.schedule.length===0){
      emptyRow(tbody, 5, "등록된 일정이 없습니다.");
      return;
    }
    const sorted = [...state.schedule].sort((a,b)=>a.date.localeCompare(b.date));
    tbody.innerHTML = sorted.map((s,i)=>`
      <tr style="animation-delay:${Math.min(i*0.03,0.3)}s">
        <td>${escapeHtml(s.title)}</td>
        <td>${escapeHtml(subjectName(s.subjectId))}</td>
        <td class="mono">${s.date}</td>
        <td>${dDayStamp(s.date)}</td>
        <td><span class="row-del" data-id="${s.id}">삭제</span></td>
      </tr>`).join("");
    tbody.querySelectorAll(".row-del").forEach(el=>el.addEventListener("click", e=>deleteSchedule(e.target.getAttribute("data-id"))));
  }

  /* ---------------------------------------------------------
     Render: Stats
  --------------------------------------------------------- */
  function renderStats(){
    const now = new Date();
    const weekStart = startOfWeek(now);
    const perDaySec = [0,0,0,0,0,0,0];
    for(let i=0;i<7;i++){
      const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
      const key = todayKey(d);
      perDaySec[i] = state.sessions.filter(s=>todayKey(new Date(s.start))===key).reduce((a,s)=>a+s.durationSec,0);
      if(key===todayKey(now)) perDaySec[i] += currentRunningSecForToday_activeOnly();
    }
    const max = Math.max(1, ...perDaySec);
    const chart = document.getElementById("statsChart");
    const todayIdx = (now.getDay()+6)%7;
    chart.innerHTML = perDaySec.map((sec,i)=>{
      const h = Math.round(sec/max*140)+2;
      return `
        <div class="chart-col">
          <div class="chart-val">${sec>0 ? fmtHM(sec) : ""}</div>
          <div class="chart-bar ${i===todayIdx?'today':''}" style="height:${h}px"></div>
          <div class="chart-day">${DAY_LABELS[i]}</div>
        </div>`;
    }).join("");

    const weekTotal = perDaySec.reduce((a,b)=>a+b,0);
    document.getElementById("statsTotal").textContent = fmtHM(weekTotal);
    document.getElementById("statsAvg").textContent = fmtHM(Math.round(weekTotal/7));

    let topSubject = "-";
    if(state.subjects.length){
      const totals = state.subjects.map(s=>({s, sec: subjectSecondsTotal(s.id)})).sort((a,b)=>b.sec-a.sec);
      if(totals[0].sec>0) topSubject = totals[0].s.name;
    }
    document.getElementById("statsTopSubject").textContent = topSubject;

    const subjTbody = document.querySelector("#statsSubjectTable tbody");
    if(state.subjects.length===0){
      emptyRow(subjTbody, 4, "등록된 과목이 없습니다.");
    }else{
      subjTbody.innerHTML = state.subjects.map(s=>{
        const sec = subjectSecondsTotal(s.id);
        const goalSec = s.goalHours*3600;
        const pct = Math.min(100, Math.round(sec/goalSec*100));
        return `
          <tr>
            <td>${escapeHtml(s.name)}</td>
            <td class="mono">${fmtHM(sec)}</td>
            <td class="mono">${fmtHM(s.goalHours*3600)}</td>
            <td>
              <div class="mini-progress">
                <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
                <span class="mono" style="font-size:12px;">${pct}%</span>
              </div>
            </td>
          </tr>`;
      }).join("");
    }

    // 열차(STUDY RAIL) 기록 — study-rail.html이 localStorage에 남긴 기록을 직접 읽어와 보여준다
    const railTbody = document.querySelector("#railHistoryTable tbody");
    const railEmptyHint = document.getElementById("railHistoryEmptyHint");
    const railRecs = loadRailHistory();
    if(railRecs.length===0){
      railTbody.innerHTML = "";
      railEmptyHint.hidden = false;
    }else{
      railEmptyHint.hidden = true;
      railTbody.innerHTML = railRecs.map(r=>{
        const d = new Date(r.finishedAt);
        const dateStr = `${d.getMonth()+1}월 ${d.getDate()}일`;
        const distStr = (r.distanceKm||0) >= 1 ? `${(r.distanceKm).toFixed(1)}km` : `${Math.round((r.distanceKm||0)*1000)}m`;
        return `
          <tr>
            <td>${escapeHtml(r.originName||"")} → ${escapeHtml(r.destName||"")}</td>
            <td>${escapeHtml(r.subjectName || subjectName(r.subjectId) || "미지정")}</td>
            <td class="mono">${dateStr}</td>
            <td class="mono">${fmtHM(r.durationSec||0)}</td>
            <td class="mono">${distStr}</td>
          </tr>`;
      }).join("");
    }
  }

  function loadRailHistory(){
    const prefix = "studyRail.rail-history:";
    const recs = [];
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k && k.indexOf(prefix)===0){
        try{
          const rec = JSON.parse(localStorage.getItem(k));
          if(rec) recs.push(rec);
        }catch(e){ /* skip corrupted entry */ }
      }
    }
    recs.sort((a,b)=>(b.finishedAt||0)-(a.finishedAt||0));
    return recs;
  }

  /* ---------------------------------------------------------
     Render: Settings
  --------------------------------------------------------- */
  function renderSettings(){
    document.getElementById("settingsName").value = state.settings.name || "";
    document.getElementById("settingsGoal").value = state.settings.dailyGoalHours || 0;
    document.getElementById("settingsGoalMin").value = state.settings.dailyGoalMin || 0;
    document.getElementById("settingsAnim").checked = state.settings.backgroundAnimation !== false;
    renderRailSoundSettings();
  }

  /* ---------------------------------------------------------
     기차(STUDY EXPRESS) 사운드 설정
     — study-rail.html이 저장/조회하는 것과 같은 localStorage 키
       ("studyRail.rail-prefs")를 그대로 읽고 써서, 열차 화면에
       있던 소리 토글들을 이 설정 탭 한 곳으로 모은다.
  --------------------------------------------------------- */
  const RAIL_PREFS_KEY = "studyRail.rail-prefs";
  function loadRailPrefs(){
    try{
      const raw = localStorage.getItem(RAIL_PREFS_KEY);
      return raw ? JSON.parse(raw) : {};
    }catch(e){ return {}; }
  }
  function saveRailPrefs(patch){
    try{
      const next = Object.assign({}, loadRailPrefs(), patch);
      localStorage.setItem(RAIL_PREFS_KEY, JSON.stringify(next));
    }catch(e){ /* 저장 실패 시 조용히 무시 */ }
  }
  function renderRailSoundSettings(){
    const p = loadRailPrefs();
    // 저장된 값이 없으면(첫 방문 등) 기본값은 "모두 켜짐" — study-rail.html과
    // 동일한 기본 정책: 명시적으로 false를 저장한 적이 있을 때만 꺼진 것으로 본다.
    document.getElementById("settingsTrainSound").checked = p.trainSoundOn !== false;
    document.getElementById("settingsStopSound").checked = p.soundOn !== false;
    document.getElementById("settingsVoice").checked = p.voiceOn !== false;
    const vol = (typeof p.soundVolume === "number") ? Math.round(Math.max(0,Math.min(1,p.soundVolume))*100) : 80;
    document.getElementById("settingsVolume").value = vol;
    document.getElementById("settingsVolumeVal").textContent = vol + "%";
  }
  function applyMotionPref(){
    document.body.classList.toggle("motion-off", state.settings.backgroundAnimation === false);
  }
  function toggleBackgroundAnimation(e){
    state.settings.backgroundAnimation = e.target.checked;
    save();
    applyMotionPref();
  }
  function saveSettings(){
    state.settings.name = document.getElementById("settingsName").value.trim();
    let goalH = Math.max(0, Math.min(24, Math.floor(Number(document.getElementById("settingsGoal").value)||0)));
    let goalM = Math.max(0, Math.min(59, Math.floor(Number(document.getElementById("settingsGoalMin").value)||0)));
    if(goalH<=0 && goalM<=0){ goalH = 5; goalM = 0; } // 목표시간이 0이 되지 않도록 기본값으로 보정
    state.settings.dailyGoalHours = goalH;
    state.settings.dailyGoalMin = goalM;
    save();
    const hint = document.getElementById("settingsSavedHint");
    hint.textContent = "저장되었습니다.";
    setTimeout(()=>hint.textContent="", 2000);
    renderAll();
  }
  function resetAllData(){
    if(!confirm("정말 모든 데이터를 초기화할까요? 되돌릴 수 없습니다.")) return;
    if(!confirm("마지막 확인입니다. 전체 데이터를 삭제할까요?")) return;
    state = defaultState();
    save();
    clearRailData(); // STUDY DESK 자체 데이터뿐 아니라, study-rail.html이 따로 저장해둔 열차 기록/세션도 함께 지운다
    applyMotionPref();
    location.hash = "#dashboard";
    renderAll();
    showToast("모든 데이터가 초기화되었습니다");
  }
  /* study-rail.html은 'studyRail.' 접두사로 자기만의 localStorage 키(열차 기록 rail-history:*,
     진행 중 세션 rail-session, 환경설정 rail-prefs)를 따로 저장하기 때문에,
     STUDY DESK의 state를 초기화하는 것만으로는 지워지지 않는다. 여기서 함께 지운다. */
  function clearRailData(){
    try{
      const toRemove = [];
      for(let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i);
        if(k && k.indexOf("studyRail.")===0) toRemove.push(k);
      }
      toRemove.forEach(k=>localStorage.removeItem(k));
      localStorage.removeItem(RAIL_QUEUE_KEY);
    }catch(e){}
  }

  /* ---------------------------------------------------------
     Toast notifications — small dispatched field notices
  --------------------------------------------------------- */
  function showToast(msg){
    const wrap = document.getElementById("toastWrap");
    if(!wrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    wrap.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("show")));
    setTimeout(()=>{
      el.classList.remove("show");
      el.addEventListener("transitionend", ()=>el.remove(), {once:true});
      setTimeout(()=>el.remove(), 500); // fallback if transitionend doesn't fire
    }, 2400);
    // keep at most 3 stacked
    while(wrap.children.length > 3) wrap.removeChild(wrap.firstChild);
  }

  /* ---------------------------------------------------------
     Utility
  --------------------------------------------------------- */
  function escapeHtml(str){
    return String(str ?? "").replace(/[&<>"']/g, c=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  /* ---------------------------------------------------------
     Top bar
  --------------------------------------------------------- */
  function renderTopbar(){
    document.getElementById("topbarDate").textContent =
      new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"long",day:"numeric"}).format(new Date());
  }

  /* ---------------------------------------------------------
     Render orchestration
  --------------------------------------------------------- */
  function renderAll(){
    renderTopbar();
    const route = currentRoute();
    renderDashboard();
    if(route==="focus") renderFocus(); else tickFocusDisplay();
    if(route==="todo") renderTodo();
    if(route==="subjects") renderSubjects();
    if(route==="notes") renderNotes();
    if(route==="schedule") renderSchedule();
    if(route==="stats") renderStats();
    if(route==="settings") renderSettings();
  }

  /* ---------------------------------------------------------
     Event wiring
  --------------------------------------------------------- */
  document.getElementById("todoForm").addEventListener("submit", e=>{
    e.preventDefault();
    const input = document.getElementById("todoInput");
    addTodo(input.value);
    input.value = "";
  });

  document.getElementById("subjectForm").addEventListener("submit", e=>{
    e.preventDefault();
    const nameInput = document.getElementById("subjectNameInput");
    const goalHInput = document.getElementById("subjectGoalHInput");
    const goalMInput = document.getElementById("subjectGoalMInput");
    const h = Number(goalHInput.value)||0;
    const m = Number(goalMInput.value)||0;
    addSubject(nameInput.value, h + m/60);
    nameInput.value = ""; goalHInput.value = "10"; goalMInput.value = "0";
  });

  document.getElementById("scheduleForm").addEventListener("submit", e=>{
    e.preventDefault();
    const t = document.getElementById("scheduleTitleInput");
    const s = document.getElementById("scheduleSubjectSelect");
    const d = document.getElementById("scheduleDateInput");
    addSchedule(t.value, s.value, d.value);
    t.value=""; d.value="";
  });

  document.getElementById("focusStartBtn").addEventListener("click", startFocus);
  document.getElementById("focusPauseBtn").addEventListener("click", pauseFocus);
  document.getElementById("focusResumeBtn").addEventListener("click", resumeFocus);
  document.getElementById("focusStopBtn").addEventListener("click", stopFocus);

  document.getElementById("newNoteBtn").addEventListener("click", newNote);
  document.getElementById("notesSearch").addEventListener("input", renderNotesTableOnly);
  document.getElementById("deleteNoteBtn").addEventListener("click", ()=>deleteNote(state.activeNoteId));
  document.getElementById("noteTitleInput").addEventListener("input", e=>saveActiveNoteField("title", e.target.value));
  document.getElementById("noteContentInput").addEventListener("input", e=>saveActiveNoteField("content", e.target.value));
  document.getElementById("noteSubjectSelect").addEventListener("change", e=>saveActiveNoteField("subjectId", e.target.value));

  document.getElementById("settingsAnim").addEventListener("change", toggleBackgroundAnimation);
  document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);
  document.getElementById("settingsTrainSound").addEventListener("change", e=>{ saveRailPrefs({trainSoundOn: e.target.checked}); });
  document.getElementById("settingsStopSound").addEventListener("change", e=>{ saveRailPrefs({soundOn: e.target.checked}); });
  document.getElementById("settingsVoice").addEventListener("change", e=>{ saveRailPrefs({voiceOn: e.target.checked}); });
  document.getElementById("settingsVolume").addEventListener("input", e=>{
    const v = Math.max(0, Math.min(100, Number(e.target.value)||0));
    document.getElementById("settingsVolumeVal").textContent = v + "%";
    saveRailPrefs({soundVolume: v/100});
  });
  document.getElementById("resetDataBtn").addEventListener("click", resetAllData);

  // back to list from note editor clears activeNoteId
  document.querySelector("#view-note-editor .back-link").addEventListener("click", ()=>{
    state.activeNoteId = null; save(); showRoute();
  });

  document.getElementById("spmCancel").addEventListener("click", closeSubjectPicker);
  document.getElementById("subjectPickModal").addEventListener("click", function(e){
    if(e.target === e.currentTarget) closeSubjectPicker();
  });

  /* ---------------------------------------------------------
     열차(STUDY RAIL) 기록 반영
     study-rail.html은 세션이 끝날 때마다 localStorage의
     "studyDesk.pendingSessions" 큐에 기록을 쌓아둔다.
     STUDY DESK가 켜질 때마다 그 큐를 비우면서 대시보드/통계에
     쓰이는 state.sessions 로 합쳐 넣는다.
  --------------------------------------------------------- */
  const RAIL_QUEUE_KEY = "studyDesk.pendingSessions";
  function drainPendingRailSessions(){
    let arr;
    try{
      const raw = localStorage.getItem(RAIL_QUEUE_KEY);
      if(!raw) return;
      arr = JSON.parse(raw);
    }catch(e){
      localStorage.removeItem(RAIL_QUEUE_KEY);
      return;
    }
    if(!Array.isArray(arr) || arr.length===0){
      localStorage.removeItem(RAIL_QUEUE_KEY);
      return;
    }
    let added = 0, addedSec = 0;
    arr.forEach(function(rec){
      if(!rec || typeof rec.durationSec !== "number" || rec.durationSec < 5) return;
      state.sessions.push({
        id: rec.id || uid(),
        subjectId: rec.subjectId || "",
        start: rec.start,
        end: rec.end,
        durationSec: Math.round(rec.durationSec),
        source: "rail"
      });
      added++; addedSec += rec.durationSec;
    });
    localStorage.removeItem(RAIL_QUEUE_KEY);
    if(added>0){
      save();
      showToast(`열차 기록 ${added}건이 반영되었습니다 (${fmtHM(addedSec)})`);
    }
  }

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  if(!location.hash) location.hash = "#dashboard";
  drainPendingRailSessions();
  applyMotionPref();
  showRoute();
  setInterval(()=>{
    tickFocusDisplay();
    if(currentRoute()==="dashboard") renderDashboard();
    if(currentRoute()==="stats") renderStats();
  }, 1000);

  // 뒤로가기(bfcache 복원)로 study-rail.html에서 돌아왔을 때도 큐를 비운다
  window.addEventListener("pageshow", function(e){
    if(e.persisted){
      drainPendingRailSessions();
      showRoute();
    }
  });
  // 다른 탭/창에서 study-rail.html이 기록을 쌓았을 수도 있으니 탭 복귀 시에도 확인
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible") drainPendingRailSessions();
  });

})();
