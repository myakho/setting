  /* =========================================================
     기본값 & 상태
  ========================================================= */
  const orbWrap = document.getElementById('orb-wrap');
  const caption = document.getElementById('caption');
  const captionRow = document.getElementById('caption-row');
  const transcriptToggle = document.getElementById('transcript-toggle');
  const transcriptList = document.getElementById('transcript-list');
  const transcriptDrawer = document.getElementById('transcript-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const plusBtn = document.getElementById('plus-btn');
  const micBtn = document.getElementById('mic-btn');
  const stopBtn = document.getElementById('stop-btn');
  const textInput = document.getElementById('text-input');

  const attachBtn = document.getElementById('attach-btn');
  const attachInput = document.getElementById('attach-input');
  const attachChip = document.getElementById('attach-chip');
  const attachChipName = document.getElementById('attach-chip-name');
  const attachChipStatus = document.getElementById('attach-chip-status');
  const attachChipRemove = document.getElementById('attach-chip-remove');

  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsSidebar = document.getElementById('settings-sidebar');
  const closeSettingsFooterBtn = document.getElementById('close-settings-footer');
  const resetSettingsBtn = document.getElementById('reset-settings');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const micSelect = document.getElementById('mic-select');
  const micRefreshBtn = document.getElementById('mic-refresh');
  const micSelectSub = document.getElementById('mic-select-sub');
  const micTestToggle = document.getElementById('mic-test-toggle');
  const micTestHint = document.getElementById('mic-test-hint');
  const micMeterFill = document.getElementById('mic-meter-fill');
  const ollamaUrlInput = document.getElementById('ollama-url');
  const ollamaModelConvoInput = document.getElementById('ollama-model-convo');
  const ollamaModelResearchInput = document.getElementById('ollama-model-research');
  const ollamaModelVisionInput = document.getElementById('ollama-model-vision');
  const ollamaModelsList = document.getElementById('ollama-models-list');
  const ollamaConvoQuickPicks = document.getElementById('ollama-convo-quick-picks');
  const ollamaResearchQuickPicks = document.getElementById('ollama-research-quick-picks');
  const ollamaVisionQuickPicks = document.getElementById('ollama-vision-quick-picks');
  const cloudBaseUrlInput = document.getElementById('cloud-base-url');
  const cloudApiKeyInput = document.getElementById('cloud-api-key');
  const cloudModelConvoInput = document.getElementById('cloud-model-convo');
  const cloudModelResearchInput = document.getElementById('cloud-model-research');
  const cloudModelVisionInput = document.getElementById('cloud-model-vision');
  const cloudConvoQuickPicks = document.getElementById('cloud-convo-quick-picks');
  const cloudResearchQuickPicks = document.getElementById('cloud-research-quick-picks');
  const cloudVisionQuickPicks = document.getElementById('cloud-vision-quick-picks');
  const providerTabRow = document.getElementById('provider-tab-row');
  const providerTabOllama = document.getElementById('provider-tab-ollama');
  const providerTabCloud = document.getElementById('provider-tab-cloud');
  const aiProviderOllamaFields = document.getElementById('ai-provider-ollama-fields');
  const aiProviderCloudFields = document.getElementById('ai-provider-cloud-fields');

  function wireModelQuickPicks(input, picks){
    if (!picks || !input) return;
    function sync(){
      const val = input.value.trim();
      picks.querySelectorAll('.model-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.model === val);
      });
    }
    picks.addEventListener('click', (e) => {
      const chip = e.target.closest('.model-chip');
      if (!chip) return;
      input.value = chip.dataset.model;
      sync();
      input.dispatchEvent(new Event('input'));
    });
    input.addEventListener('input', sync);
    return sync;
  }
  const syncConvoChipActive = wireModelQuickPicks(ollamaModelConvoInput, ollamaConvoQuickPicks);
  const syncResearchChipActive = wireModelQuickPicks(ollamaModelResearchInput, ollamaResearchQuickPicks);
  const syncVisionChipActive = wireModelQuickPicks(ollamaModelVisionInput, ollamaVisionQuickPicks);
  const ollamaRefreshBtn = document.getElementById('ollama-refresh');
  const ollamaTestBtn = document.getElementById('ollama-test-btn');
  const ollamaStatusHint = document.getElementById('ollama-status-hint');
  const corsOsTabs = document.getElementById('cors-os-tabs');
  const corsCmdText = document.getElementById('cors-cmd-text');
  const corsCopyBtn = document.getElementById('cors-copy-btn');
  const corsCopyHint = document.getElementById('cors-copy-hint');
  const corsDownloadBtn = document.getElementById('cors-download-btn');
  const corsDownloadLabel = document.getElementById('cors-download-label');
  const syncCloudConvoChipActive = wireModelQuickPicks(cloudModelConvoInput, cloudConvoQuickPicks);
  const syncCloudResearchChipActive = wireModelQuickPicks(cloudModelResearchInput, cloudResearchQuickPicks);
  const syncCloudVisionChipActive = wireModelQuickPicks(cloudModelVisionInput, cloudVisionQuickPicks);
  const cloudRefreshBtn = document.getElementById('cloud-refresh');
  const cloudTestBtn = document.getElementById('cloud-test-btn');
  const cloudStatusHint = document.getElementById('cloud-status-hint');
  const cloudModelsList = document.getElementById('cloud-models-list');

  /* 로컬(Ollama) / 클라우드 API 탭 전환 */
  function switchAiProviderTab(provider){
    const isCloud = provider === 'cloud';
    providerTabOllama.classList.toggle('active', !isCloud);
    providerTabCloud.classList.toggle('active', isCloud);
    aiProviderOllamaFields.style.display = isCloud ? 'none' : '';
    aiProviderCloudFields.style.display = isCloud ? '' : 'none';
  }
  providerTabRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.provider-tab');
    if (!btn) return;
    switchAiProviderTab(btn.dataset.provider);
  });
  const prefAiNameInput = document.getElementById('pref-ai-name');
  const prefUserNameInput = document.getElementById('pref-user-name');
  const prefPersonalityInput = document.getElementById('pref-personality');
  const prefNotesInput = document.getElementById('pref-notes');

  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarClose = document.getElementById('sidebar-close');
  const newChatBtn = document.getElementById('new-chat-btn');
  const historyList = document.getElementById('history-list');
  const clockDateEl = document.getElementById('clock-date');
  const clockTimeEl = document.getElementById('clock-time');
  const sidebarSettingsBtn = document.getElementById('sidebar-settings-btn');
  const brandNameEl = document.getElementById('brand-name');
  const hudNameEl = document.getElementById('hud-name');
  const hudStateEl = document.getElementById('hud-state');

  /* =========================================================
     AI 개인 맞춤 (이름 · 호칭 · 말투 · 메모) — 브라우저에만 저장
  ========================================================= */
  const DEFAULT_AI_NAME = 'Sodam';
  const PERSONALITY_LINES = {
    friendly: '친근하고 다정한 존댓말로 답해.',
    formal: '예의를 갖춘 격식 있는 존댓말로 또박또박 답해.',
    casual: '편하고 스스럼없는 반말로 답해.',
    jarvis: '아이언맨의 자비스처럼 차분하고 위트있게, 능력 있는 집사 같은 톤의 존댓말로 답해. 필요하면 담백한 유머를 살짝 곁들여.'
  };

  function loadPrefs(){
    try{ return JSON.parse(localStorage.getItem('sodam_prefs') || '{}'); }
    catch(e){ return {}; }
  }
  function savePrefs(p){ localStorage.setItem('sodam_prefs', JSON.stringify(p)); }
  function getAiName(){ return (loadPrefs().aiName || '').trim() || DEFAULT_AI_NAME; }
  function getUserName(){ return (loadPrefs().userName || '').trim(); }

  function buildSystemPrompt(){
    const prefs = loadPrefs();
    const aiName = getAiName();
    const userName = getUserName();
    const personalityLine = PERSONALITY_LINES[prefs.personality] || PERSONALITY_LINES.friendly;
    let prompt =
      `너는 "${aiName}"라는 이름의 한국어 음성 비서야. ${personalityLine} ` +
      "대답은 음성으로 읽어줄 거니까 이모지나 마크다운 없이, 자연스러운 구어체로 2~3문장 이내로 짧게 답해줘. " +
      "유튜버, 인플루언서, 최근 사건, 실시간 정보처럼 네가 확실히 모르거나 최신일 수 있는 " +
      "질문에는 반드시 웹 검색 도구를 먼저 사용한 뒤 답해. 검색해도 못 찾으면 모른다고 솔직히 말해줘.";
    if (userName) prompt += ` 사용자를 "${userName}"라고 불러줘.`;
    if ((prefs.notes || '').trim()) prompt += ` 사용자에 대한 참고 정보: ${prefs.notes.trim()}`;
    return prompt;
  }

  function applyPersonalizationToUI(){
    const aiName = getAiName();
    const userName = getUserName();
    if (brandNameEl) brandNameEl.textContent = aiName;
    if (hudNameEl) hudNameEl.textContent = `${aiName.toUpperCase()} AI`;
    const idleGreeting = userName
      ? `${userName}님, 탭해서 대화를 시작하세요 · 이후엔 자유롭게 말하면 돼요`
      : '탭해서 대화를 시작하세요 · 이후엔 자유롭게 말하면 돼요';
    IDLE_CAPTION = idleGreeting;
    if (document.body.dataset.orb === 'idle' && !sessionStarted){
      caption.textContent = idleGreeting;
    }
  }

  let IDLE_CAPTION = '탭해서 대화를 시작하세요 · 이후엔 자유롭게 말하면 돼요';

  let history = []; // {role:'user'|'assistant', content:string}
  let captionTimer = null;

  let conversations = loadConversations(); // 저장된 전체 대화 목록
  let currentConversationId = null;        // 지금 이어가고 있는 대화의 id

  function loadConversations(){
    try{ return JSON.parse(localStorage.getItem('sodam_conversations') || '[]'); }
    catch(e){ return []; }
  }
  function saveConversations(){
    try{
      localStorage.setItem('sodam_conversations', JSON.stringify(conversations));
    }catch(e){
      // 생성된 이미지(base64)가 쌓이면 localStorage 용량(보통 5~10MB)을 넘길 수 있음.
      // 이 경우 오래된 대화의 이미지부터 지워서 텍스트 기록은 최대한 보존함.
      console.warn('[저장 실패 — 용량 초과로 추정, 오래된 이미지부터 정리]', e.message || e);
      const sorted = [...conversations].sort((a, b) => a.updatedAt - b.updatedAt);
      let trimmed = false;
      for (const conv of sorted){
        for (const m of conv.messages){
          if (m.image){ m.image = null; trimmed = true; }
        }
        if (trimmed){
          try{ localStorage.setItem('sodam_conversations', JSON.stringify(conversations)); return; }
          catch(e2){ continue; } // 그래도 안 되면 다음 대화도 계속 정리
        }
      }
    }
  }

  class SkipProvider extends Error {}

  function getOllamaUrl(){
    return localStorage.getItem('voiceai_ollama_url') || 'http://localhost:11434';
  }
  function getOllamaConvoModel(){
    return localStorage.getItem('voiceai_ollama_model_convo') || '';
  }
  function getOllamaResearchModel(){
    return localStorage.getItem('voiceai_ollama_model_research') || '';
  }
  function getOllamaVisionModel(){
    return localStorage.getItem('voiceai_ollama_model_vision') || '';
  }

  function getAiProvider(){
    return localStorage.getItem('voiceai_ai_provider') || 'ollama';
  }
  function getCloudBaseUrl(){
    return (localStorage.getItem('voiceai_cloud_base_url') || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
  }
  function getCloudApiKey(){
    return localStorage.getItem('voiceai_cloud_api_key') || '';
  }
  function getCloudConvoModel(){
    return localStorage.getItem('voiceai_cloud_model_convo') || '';
  }
  function getCloudResearchModel(){
    return localStorage.getItem('voiceai_cloud_model_research') || '';
  }
  function getCloudVisionModel(){
    return localStorage.getItem('voiceai_cloud_model_vision') || '';
  }

  const HUD_STATE_LABELS = { idle:'STANDBY', listening:'LISTENING', thinking:'PROCESSING', speaking:'RESPONDING' };

  /* ---------- pipeline step indicator ---------- */
  const pipelineRow = document.getElementById('pipeline-row');
  const pipeSteps = {
    vision: pipelineRow.querySelector('[data-step="vision"]'),
    convo: pipelineRow.querySelector('[data-step="convo"]'),
    research: pipelineRow.querySelector('[data-step="research"]'),
    ondevice: pipelineRow.querySelector('[data-step="ondevice"]')
  };
  function resetPipeline(){
    pipelineRow.classList.add('show');
    Object.values(pipeSteps).forEach(el => el.classList.remove('active','ok','fail','skip'));
  }
  function setPipelineStep(key, status){
    // status: 'active' | 'ok' | 'fail' | 'skip'
    const el = pipeSteps[key];
    if (!el) return;
    el.classList.remove('active','ok','fail','skip');
    el.classList.add(status);
  }
  function hidePipelineSoon(){
    setTimeout(() => { pipelineRow.classList.remove('show'); }, 1400);
  }
  function setOrbState(state){
    document.body.dataset.orb = state;
    stopBtn.classList.toggle('idle-disabled', state === 'idle' || state === 'listening');
    if (hudStateEl) hudStateEl.textContent = HUD_STATE_LABELS[state] || state.toUpperCase();
  }
  function setCaption(text, sticky){
    caption.style.opacity = '0';
    clearTimeout(captionTimer);
    setTimeout(() => {
      caption.textContent = text;
      caption.style.opacity = '1';
    }, 120);
    if (!sticky){
      captionTimer = setTimeout(() => {
        if (document.body.dataset.orb === 'idle'){
          caption.style.opacity = '0';
          setTimeout(() => {
            caption.textContent = IDLE_CAPTION;
            caption.style.opacity = '1';
          }, 200);
        }
      }, 4000);
    }
  }

  // 답변 안의 ``` 코드 블록을 찾아서 [{lang, code}] 형태로 반환
  function extractCodeBlocks(text){
    const blocks = [];
    const re = /```(\w+)?[ \t]*([^\n`]*)\n([\s\S]*?)```/g;
    let m;
    while ((m = re.exec(text))){
      const code = m[3].replace(/\n$/, '');
      if (!code.trim()) continue;
      const path = (m[2] || '').trim().replace(/^:/, '').trim();
      blocks.push({ lang: (m[1] || '').toLowerCase(), code, path: path || null });
    }
    return blocks;
  }

  const CODE_EXT_MAP = {
    javascript:'js', js:'js', typescript:'ts', ts:'ts', jsx:'jsx', tsx:'tsx',
    python:'py', py:'py', java:'java', c:'c', cpp:'cpp', 'c++':'cpp', csharp:'cs', 'c#':'cs',
    html:'html', css:'css', json:'json', sql:'sql', bash:'sh', sh:'sh', shell:'sh',
    go:'go', rust:'rs', kotlin:'kt', swift:'swift', php:'php', ruby:'rb', yaml:'yml', yml:'yml',
    markdown:'md', md:'md'
  };
  function codeBlockFilename(lang, idx, path){
    if (path) return path.replace(/^\.?\//, '');
    const ext = CODE_EXT_MAP[lang] || 'txt';
    return `code-${idx}.${ext}`;
  }
  function downloadCodeBlock(code, filename){
    const blob = new Blob([code], { type:'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  async function downloadCodeBlocksAsZip(files){
    await ensureJSZip();
    const zip = new window.JSZip();
    files.forEach(({ filename, code }) => zip.file(filename, code));
    const blob = await zip.generateAsync({ type:'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getAiName()}_결과_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /* =========================================================
     실행 로그 — 이번 요청에서 실제로 호출한 단계(모델/검색)를
     기록해서, AI 답변 아래에 접이식으로 보여줌
  ========================================================= */
  let currentExecLog = [];
  function resetExecLog(){ currentExecLog = []; }
  function logExec(ok, title, command, output){
    currentExecLog.push({ ok, title, command, output: String(output ?? '') });
  }

  function escapeHtml(s){
    return String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const EXEC_ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg>';
  const EXEC_ICON_FAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  function buildExecLogEl(steps){
    if (!steps || !steps.length) return null;
    const okCount = steps.filter(s => s.ok).length;
    const failCount = steps.length - okCount;
    const wrap = document.createElement('div');
    wrap.className = 'exec-log';
    const summary = document.createElement('div');
    summary.className = 'exec-log-summary';
    summary.textContent = failCount
      ? `단계 ${steps.length}개 중 ${failCount}개 실패`
      : `단계 ${steps.length}개 완료`;
    wrap.appendChild(summary);
    const list = document.createElement('div');
    list.className = 'exec-log-list';
    steps.forEach(step => {
      const el = document.createElement('div');
      el.className = 'exec-step' + (step.ok ? '' : ' fail');
      el.innerHTML = `
        <div class="exec-connector"></div>
        <button class="exec-head" type="button">
          <span class="exec-icon">${step.ok ? EXEC_ICON_OK : EXEC_ICON_FAIL}</span>
          <span class="exec-title">${escapeHtml(step.title)}</span>
          <svg class="exec-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="exec-body">
          <div class="exec-card">
            <div class="exec-card-section">
              <div class="exec-label">요청</div>
              <div class="exec-code">${escapeHtml(step.command)}</div>
            </div>
            <div class="exec-card-section">
              <div class="exec-label">${step.ok ? '결과' : '에러'}</div>
              <div class="exec-output">${escapeHtml(step.output) || '(내용 없음)'}</div>
            </div>
          </div>
        </div>
      `;
      el.querySelector('.exec-head').addEventListener('click', () => el.classList.toggle('open'));
      list.appendChild(el);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function renderMessageDOM(sender, text, cls, tierInfo, execLog, image){
    const hint = transcriptList.querySelector('.empty-hint');
    if (hint) hint.remove();
    const wrap = document.createElement('div');
    wrap.className = `msg ${cls}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (image){
      const imgWrap = document.createElement('div');
      imgWrap.className = 'gen-image-wrap';
      const img = document.createElement('img');
      img.src = image;
      img.alt = text || '생성된 이미지';
      imgWrap.appendChild(img);
      const actions = document.createElement('div');
      actions.className = 'gen-image-actions';
      const dlBtn = document.createElement('button');
      dlBtn.type = 'button';
      dlBtn.className = 'gen-image-download';
      dlBtn.textContent = '⬇ 이미지 저장';
      dlBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = image;
        a.download = `${getAiName()}_이미지_${Date.now()}.png`;
        a.click();
      });
      actions.appendChild(dlBtn);
      imgWrap.appendChild(actions);
      if (text){
        const caption = document.createElement('div');
        caption.textContent = text;
        imgWrap.appendChild(caption);
      }
      bubble.appendChild(imgWrap);
    } else {
      bubble.textContent = text;
    }
    wrap.appendChild(bubble);
    if (tierInfo){
      const tag = document.createElement('span');
      tag.className = `tier-tag ${tierInfo.tier}`;
      tag.textContent = tierInfo.label;
      wrap.appendChild(tag);
    }
    const execLogEl = buildExecLogEl(execLog);
    if (execLogEl) wrap.appendChild(execLogEl);
    if (cls === 'ai'){
      const actions = document.createElement('div');
      actions.className = 'msg-actions';

      // 긴 코드 블록(4줄 이상)에는 다운로드 버튼을 추가 — 말풍선 자체는 그대로 텍스트로 유지
      const codeBlocks = extractCodeBlocks(text).filter(b => b.code.split('\n').length >= 4);
      const namedFiles = [];
      codeBlocks.forEach((block, i) => {
        const filename = codeBlockFilename(block.lang, i + 1, block.path);
        namedFiles.push({ filename, code: block.code });
        const codeBtn = document.createElement('button');
        codeBtn.className = 'msg-action-btn';
        codeBtn.type = 'button';
        codeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> ${filename}`;
        codeBtn.addEventListener('click', () => downloadCodeBlock(block.code, filename));
        actions.appendChild(codeBtn);
      });

      // 파일이 2개 이상이면(예: zip 첨부를 풀어서 처리한 결과) 한 번에 zip으로도 받을 수 있게 함
      if (namedFiles.length >= 2){
        const zipBtn = document.createElement('button');
        zipBtn.className = 'msg-action-btn';
        zipBtn.type = 'button';
        zipBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg> zip으로 저장';
        zipBtn.addEventListener('click', async () => {
          zipBtn.classList.add('busy');
          try{ await downloadCodeBlocksAsZip(namedFiles); }
          catch(e){ console.error(e); alert('zip 생성에 실패했어요.'); }
          finally{ zipBtn.classList.remove('busy'); }
        });
        actions.appendChild(zipBtn);
      }

      const pdfBtn = document.createElement('button');
      pdfBtn.className = 'msg-action-btn';
      pdfBtn.type = 'button';
      pdfBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> PDF';
      pdfBtn.addEventListener('click', () => exportAnswerToPDF(text, pdfBtn));

      const pptBtn = document.createElement('button');
      pptBtn.className = 'msg-action-btn';
      pptBtn.type = 'button';
      pptBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> PPT';
      pptBtn.addEventListener('click', () => exportAnswerToPPT(text, pptBtn));

      actions.appendChild(pdfBtn);
      actions.appendChild(pptBtn);
      wrap.appendChild(actions);
    }
    transcriptList.appendChild(wrap);
    transcriptList.scrollTop = transcriptList.scrollHeight;
  }

  function ensureConversation(firstUserText){
    if (currentConversationId) return;
    const id = 'c_' + Date.now();
    const title = firstUserText.length > 24 ? firstUserText.slice(0, 24) + '…' : firstUserText;
    conversations.unshift({ id, title, messages: [], updatedAt: Date.now() });
    currentConversationId = id;
    saveConversations();
    renderHistoryList();
  }

  function persistMessage(sender, text, cls, tierInfo, execLog, image){
    const conv = conversations.find(c => c.id === currentConversationId);
    if (!conv) return;
    conv.messages.push({ sender, text, cls, tier: tierInfo?.tier || null, label: tierInfo?.label || null, execLog: execLog || null, image: image || null });
    conv.updatedAt = Date.now();
    saveConversations();
    renderHistoryList();
  }

  function appendMessage(sender, text, cls, tierInfo, execLog, image){
    renderMessageDOM(sender, text, cls, tierInfo, execLog, image);
    persistMessage(sender, text, cls, tierInfo, execLog, image);
  }

  function formatConvTime(ts){
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone:'Asia/Seoul', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:true
    }).format(new Date(ts));
  }

  function renderHistoryList(){
    historyList.innerHTML = '';
    if (!conversations.length){
      historyList.innerHTML = '<div class="history-empty">아직 대화가 없어요.</div>';
      return;
    }
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    sorted.forEach(conv => {
      const item = document.createElement('div');
      item.className = 'history-item' + (conv.id === currentConversationId ? ' active' : '');

      const main = document.createElement('div');
      main.className = 'h-main';
      const title = document.createElement('div');
      title.className = 'h-title';
      title.textContent = conv.title || '새 대화';
      const time = document.createElement('div');
      time.className = 'h-time';
      time.textContent = formatConvTime(conv.updatedAt);
      main.appendChild(title);
      main.appendChild(time);
      main.addEventListener('click', () => loadConversation(conv.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'h-delete';
      delBtn.type = 'button';
      delBtn.setAttribute('aria-label', '대화 삭제');
      delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conv.id);
      });

      item.appendChild(main);
      item.appendChild(delBtn);
      historyList.appendChild(item);
    });
  }

  function deleteConversation(id){
    conversations = conversations.filter(c => c.id !== id);
    saveConversations();
    if (currentConversationId === id){
      currentConversationId = null;
      history = [];
      transcriptList.innerHTML = '<div class="empty-hint">아직 대화가 없어요.</div>';
    }
    renderHistoryList();
  }

  function loadConversation(id){
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    currentConversationId = id;
    history = [];
    transcriptList.innerHTML = '';
    if (!conv.messages.length){
      transcriptList.innerHTML = '<div class="empty-hint">아직 대화가 없어요.</div>';
    }
    conv.messages.forEach(m => {
      renderMessageDOM(m.sender, m.text, m.cls, m.tier ? { tier:m.tier, label:m.label } : null, m.execLog || null, m.image || null);
      if (m.cls === 'user') history.push({ role:'user', content:m.text });
      else if (m.cls === 'ai') history.push({ role:'assistant', content:m.text });
    });
    renderHistoryList();
    closeSidebar();
    openDrawer();
  }

  function startNewChat(){
    currentConversationId = null;
    history = [];
    transcriptList.innerHTML = '<div class="empty-hint">아직 대화가 없어요.</div>';
    renderHistoryList();
    closeSidebar();
    hideAttachChip();
    textInput.placeholder = '유형';
  }

  /* =========================================================
     정보 검색이 필요한 질문인지 판별 — 최신 정보·사실 확인성 질문이면
     자료 검색용 모델(qwen)에게 DuckDuckGo 검색 결과를 붙여서 넘김.
     그 외(잡담·감정·일상 대화)는 대화용 모델(exaone)로 바로 처리.
  ========================================================= */
  const RESEARCH_KEYWORDS = [
    '누구', '누가', '언제', '어디', '몇 년', '몇 명', '얼마', '최신', '최근', '뉴스', '오늘',
    '현재', '지금', '날씨', '환율', '주가', '순위', '결과', '일정', '발매', '출시', '가격',
    '검색', '찾아줘', '찾아봐', '알려줘', '정보', '무슨 일', '사건', '통계', '누구야',
    'news', 'today', 'latest', 'price', 'weather', 'release date', 'search'
  ];
  function isResearchQuery(prompt){
    const p = String(prompt || '').toLowerCase();
    return RESEARCH_KEYWORDS.some(k => p.includes(k));
  }

  /* =========================================================
     Ollama 비전(사진 설명) 호출
     - 네이티브 /api/chat 엔드포인트에 messages[].images 필드로
       base64 이미지를 함께 보냄 (llava, minicpm-v 등 멀티모달 모델용)
     - dataUrl(예: "data:image/png;base64,AAAA...")에서 콤마 뒤의
       순수 base64 부분만 잘라서 보냄
  ========================================================= */
  async function ollamaVisionDescribe(model, prompt, dataUrl){
    const base64 = String(dataUrl || '').split(',')[1] || '';
    if (!base64) throw new Error('이미지 데이터를 읽지 못했어요');
    const base = getOllamaUrl().replace(/\/$/, '');
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role:'user', content: prompt, images: [base64] }
        ],
        stream: false,
        options: { num_predict: 500, temperature: 0.4 }
      })
    });
    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const data = await res.json();
    const text = data.message?.content?.trim();
    if (!text) throw new Error('Ollama: 빈 응답 (비전용 모델이 맞는지 확인해주세요 — llava, minicpm-v 등)');
    return text;
  }

  /* =========================================================
     클라우드 API 비전(사진 설명) 호출
     - OpenAI 호환 /chat/completions에 content 배열로 텍스트+이미지를 함께 보냄
       (image_url.url에 data URL을 그대로 넣을 수 있음)
  ========================================================= */
  async function cloudVisionDescribe(model, prompt, dataUrl){
    const base = getCloudBaseUrl();
    const key = getCloudApiKey();
    if (!key) throw new Error('클라우드 API 키가 설정되지 않았어요');
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role:'user', content: [
            { type:'text', text: prompt },
            { type:'image_url', image_url:{ url: dataUrl } }
          ]}
        ],
        max_tokens: 500,
        temperature: 0.4
      })
    });
    if (!res.ok){
      const errBody = await res.text().catch(() => '');
      throw new Error(`클라우드 API HTTP ${res.status}${errBody ? ' — ' + errBody.slice(0, 200) : ''}`);
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('클라우드 API: 빈 응답 (비전 지원 모델이 맞는지 확인해주세요)');
    return text;
  }

  async function callVision(prompt, dataUrl){
    const isCloud = getAiProvider() === 'cloud';
    const model = isCloud ? getCloudVisionModel() : getOllamaVisionModel();
    if (!model){
      setPipelineStep('vision','skip');
      throw new Error(isCloud
        ? '비전용 모델이 설정되지 않았어요. 설정 > AI 연결 > 클라우드 API에서 비전 모델을 등록해주세요.'
        : '비전용 모델이 설정되지 않았어요. 설정 > AI 연결에서 llava 또는 minicpm-v를 등록해주세요.');
    }
    setPipelineStep('vision','active');
    setCaption('사진을 살펴보는 중…', true);
    const cmd = isCloud
      ? `POST ${getCloudBaseUrl()}/chat/completions\nmodel: ${model} (vision)`
      : `POST ${getOllamaUrl().replace(/\/$/, '')}/api/chat\nmodel: ${model} (vision)`;
    try{
      const text = isCloud
        ? await cloudVisionDescribe(model, prompt, dataUrl)
        : await ollamaVisionDescribe(model, prompt, dataUrl);
      setPipelineStep('vision','ok');
      setPipelineStep('convo','skip');
      setPipelineStep('research','skip');
      setPipelineStep('ondevice','skip');
      logExec(true, '비전 모델 호출', cmd, text.slice(0, 300));
      return { text, tier:'vision', label: isCloud ? '클라우드 · 사진 설명' : '로컬 · 사진 설명' };
    }catch(err){
      setPipelineStep('vision','fail');
      logExec(false, '비전 모델 호출', cmd, err.message || String(err));
      throw err;
    }
  }

  /* =========================================================
     검색 결과 개수 결정 — 질문이 넓은 범위(목록/추천/비교 등)를
     묻고 있으면 더 많이(최대 20개), 단순한 사실 하나만 물으면
     적게(5개) 가져와서 상황에 맞게 조절함.
  ========================================================= */
  const BROAD_SEARCH_KEYWORDS = [
    '추천', '목록', '리스트', '순위', '비교', '종류', '여러', '다양한', '전체',
    '후보', '옵션', '베스트', 'best', 'top', 'list', 'compare', 'recommend', 'vs'
  ];
  function decideSearchCount(prompt){
    const p = String(prompt || '').toLowerCase();
    if (BROAD_SEARCH_KEYWORDS.some(k => p.includes(k))) return 20; // 폭넓게 훑어야 하는 질문
    if (p.length <= 12) return 5;                                  // 짧고 단순한 사실 확인
    return 10;                                                     // 그 사이는 적당히
  }

  /* =========================================================
     DuckDuckGo 웹 검색 — 메인 프로세스(main.js)가 대신 요청해서
     같은 출처(127.0.0.1:47654)로 결과를 돌려줌 (CORS 회피)
  ========================================================= */
  async function searchWeb(query, count){
    const n = Math.min(20, Math.max(5, count || 5));
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&n=${n}`);
    if (!res.ok) throw new Error(`검색 HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(`검색 실패: ${data.error}`);
    return data.results || [];
  }
  function formatSearchResults(results){
    if (!results.length) return '(검색 결과 없음)';
    return results
      .map((r, i) => `${i + 1}. ${r.title}\n${r.snippet}\n출처: ${r.link}`)
      .join('\n\n');
  }

  /* =========================================================
     실시간 날씨 — DuckDuckGo 텍스트 검색은 페이지 스니펫만 주는데,
     요즘 날씨 사이트는 실제 기온·강수확률 숫자를 자바스크립트로
     그려서 스니펫 안에는 그 숫자가 안 잡혀요. 그래서 날씨 질문은
     Open-Meteo(무료·API 키 불필요·CORS 허용)에서 좌표 기반 실황
     숫자를 직접 받아와 모델에게 "사실"로 넘겨줌.
  ========================================================= */
  const WEATHER_KEYWORDS = ['날씨', 'weather', '기온', '강수', '미세먼지'];
  function isWeatherQuery(prompt){
    const p = String(prompt || '').toLowerCase();
    return WEATHER_KEYWORDS.some(k => p.includes(k.toLowerCase()));
  }

  // 프롬프트에서 지명만 뽑아내기 — 행정구역 접미사로 끝나는 한글 덩어리를 지명 후보로 봄
  // (예: "광주광역시 광산구 우산동 날씨 어때?" → "광주광역시 광산구 우산동")
  function extractLocationName(prompt){
    const text = String(prompt || '');
    const re = /[가-힣]+(?:특별자치시|특별자치도|특별시|광역시|자치시|자치군|시|군|구|읍|면|동|리)/g;
    const hits = text.match(re);
    return hits && hits.length ? hits.join(' ') : null;
  }

  const WMO_DESC = {
    0:'맑음', 1:'대체로 맑음', 2:'구름 조금', 3:'흐림',
    45:'안개', 48:'짙은 안개(서리)',
    51:'약한 이슬비', 53:'이슬비', 55:'강한 이슬비',
    56:'약한 어는 이슬비', 57:'강한 어는 이슬비',
    61:'약한 비', 63:'비', 65:'강한 비',
    66:'약한 어는 비', 67:'강한 어는 비',
    71:'약한 눈', 73:'눈', 75:'강한 눈', 77:'싸락눈',
    80:'약한 소나기', 81:'소나기', 82:'강한 소나기',
    85:'약한 눈 소나기', 86:'강한 눈 소나기',
    95:'뇌우', 96:'우박 동반 뇌우', 99:'강한 우박 동반 뇌우'
  };

  async function geocodeLocation(name){
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=ko&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`위치 조회 HTTP ${res.status}`);
    const data = await res.json();
    const hit = data.results?.[0];
    if (!hit) throw new Error(`'${name}' 위치를 찾지 못했어요`);
    return hit; // { latitude, longitude, name, admin1, admin2, ... }
  }

  async function fetchWeatherData(prompt){
    const locationName = extractLocationName(prompt) || prompt;
    const place = await geocodeLocation(locationName);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
      `&hourly=temperature_2m,precipitation_probability&forecast_days=1&timezone=Asia%2FSeoul`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`날씨 조회 HTTP ${res.status}`);
    const data = await res.json();
    const c = data.current;
    if (!c) throw new Error('날씨 응답에 실황 데이터가 없어요');
    const placeLabel = [place.admin1, place.admin2, place.name].filter(Boolean).join(' ');
    const desc = WMO_DESC[c.weather_code] ?? `날씨코드 ${c.weather_code}`;
    // 앞으로 6시간 이내 최고 강수확률
    let maxPop = null;
    if (data.hourly?.time && data.hourly?.precipitation_probability){
      const now = Date.now();
      const idxs = data.hourly.time
        .map((t, i) => ({ t: new Date(t).getTime(), i }))
        .filter(x => x.t >= now)
        .slice(0, 6)
        .map(x => x.i);
      if (idxs.length) maxPop = Math.max(...idxs.map(i => data.hourly.precipitation_probability[i] ?? 0));
    }
    return {
      text:
`${placeLabel} 실시간 날씨 (Open-Meteo 기준)
- 날씨: ${desc}
- 기온: ${c.temperature_2m}°C (체감 ${c.apparent_temperature}°C)
- 습도: ${c.relative_humidity_2m}%
- 강수량: ${c.precipitation}mm
- 풍속: ${c.wind_speed_10m}m/s${maxPop !== null ? `\n- 앞으로 6시간 내 최고 강수확률: ${maxPop}%` : ''}`,
      link: `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
      title: `${placeLabel} 날씨`
    };
  }

  /* =========================================================
     Ollama 공통 호출 함수
  ========================================================= */
  async function ollamaChat(model, systemContent, hist, prompt){
    const base = getOllamaUrl().replace(/\/$/, '');
    // OpenAI 호환(/v1/chat/completions) 대신 Ollama 네이티브 /api/chat을 씀 —
    // qwen3.5 같은 "씽킹" 모델은 /v1/chat/completions에서 최종 답변을
    // content가 아니라 별도 reasoning 필드로만 보내서 content가 항상
    // 빈 문자열로 옴. 네이티브 엔드포인트는 think:false로 추론 단계를
    // 끄고 최종 답변만 content에 바로 담아달라고 요청할 수 있음.
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role:'system', content: systemContent },
          ...hist,
          { role:'user', content: prompt }
        ],
        stream: false,
        think: false,
        options: { num_predict: 800, temperature: 0.7 }
      })
    });
    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const data = await res.json();
    let text = data.message?.content?.trim();
    // think:false를 무시하는 모델/버전 대비 — content 안에 <think> 태그가
    // 섞여 오는 경우를 방어적으로 한 번 더 제거
    if (text) text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!text) throw new Error('Ollama: 빈 응답 (think:false를 지원하지 않는 모델일 수 있음 — 모델을 최신 버전으로 갱신해보세요)');
    return text;
  }

  /* =========================================================
     클라우드 API 공통 호출 함수 (OpenAI 호환 /chat/completions)
     - Groq, OpenAI, OpenRouter 등 동일한 형식을 쓰는 서비스라면
       Base URL만 바꿔서 그대로 재사용 가능
  ========================================================= */
  async function cloudChat(model, systemContent, hist, prompt){
    const base = getCloudBaseUrl();
    const key = getCloudApiKey();
    if (!key) throw new Error('클라우드 API 키가 설정되지 않았어요');
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role:'system', content: systemContent },
          ...hist,
          { role:'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });
    if (!res.ok){
      const errBody = await res.text().catch(() => '');
      throw new Error(`클라우드 API HTTP ${res.status}${errBody ? ' — ' + errBody.slice(0, 200) : ''}`);
    }
    const data = await res.json();
    let text = data.choices?.[0]?.message?.content?.trim();
    // 일부 "씽킹" 모델이 <think> 태그를 content 안에 섞어 보내는 경우 방어적으로 제거
    if (text) text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!text) throw new Error('클라우드 API: 빈 응답');
    return text;
  }

  /* =========================================================
     공급자 1: 대화용 모델 (로컬 Ollama 또는 클라우드 API)
  ========================================================= */
  async function callConvo(prompt, hist){
    const isCloud = getAiProvider() === 'cloud';
    const model = isCloud ? getCloudConvoModel() : getOllamaConvoModel();
    if (!model){ setPipelineStep('convo','skip'); throw new SkipProvider(); }
    setPipelineStep('convo','active');
    setCaption('대화 모델에게 물어보는 중…', true);
    const cmd = isCloud
      ? `POST ${getCloudBaseUrl()}/chat/completions\nmodel: ${model}`
      : `POST ${getOllamaUrl().replace(/\/$/, '')}/api/chat\nmodel: ${model} · think:false`;
    try{
      const text = isCloud
        ? await cloudChat(model, buildSystemPrompt(), hist, prompt)
        : await ollamaChat(model, buildSystemPrompt(), hist, prompt);
      setPipelineStep('convo','ok');
      setPipelineStep('research','skip');
      setPipelineStep('ondevice','skip');
      logExec(true, '대화 모델 호출', cmd, text.slice(0, 300));
      return { text, tier:'convo', label: isCloud ? '클라우드 · 대화' : '로컬 · 대화' };
    }catch(err){
      setPipelineStep('convo','fail');
      logExec(false, '대화 모델 호출', cmd, err.message || String(err));
      throw err;
    }
  }

  /* =========================================================
     공급자 2: 자료 검색용 모델 (로컬 Ollama 또는 클라우드 API) + DuckDuckGo
  ========================================================= */
  async function callResearch(prompt, hist){
    const isCloud = getAiProvider() === 'cloud';
    const model = isCloud ? getCloudResearchModel() : getOllamaResearchModel();
    if (!model){ setPipelineStep('research','skip'); throw new SkipProvider(); }
    setPipelineStep('research','active');
    let resultsText = '(검색 실패 — 알고 있는 지식으로만 답함)';
    const weatherQuery = isWeatherQuery(prompt);

    // 날씨 질문이면 먼저 실시간 날씨 API로 정확한 숫자를 받아봄
    if (weatherQuery){
      setCaption('실시간 날씨 확인하는 중…', true);
      const weatherCmd = `GET open-meteo.com (지역: ${extractLocationName(prompt) || prompt})`;
      try{
        const weather = await fetchWeatherData(prompt);
        resultsText = weather.text;
        logExec(true, '실시간 날씨 조회', weatherCmd, weather.text);
        addResourcesFromSearchResults([{ title: weather.title, snippet: weather.text, link: weather.link }], prompt);
      }catch(err){
        console.warn('[날씨 조회 실패]', err);
        logExec(false, '실시간 날씨 조회', weatherCmd, err.message || String(err));
        // 실패하면 아래에서 기존 DuckDuckGo 텍스트 검색으로 폴백
      }
    }

    // 날씨 질문이 아니었거나, 날씨 API 조회가 실패했으면 기존 방식대로 DuckDuckGo 검색
    if (!weatherQuery || resultsText.startsWith('(검색 실패')){
      setCaption('웹에서 자료를 찾는 중…', true);
      const searchCount = decideSearchCount(prompt);
      const searchCmd = `GET /api/search?q=${encodeURIComponent(prompt)}&n=${searchCount}`;
      try{
        const results = await searchWeb(prompt, searchCount);
        resultsText = formatSearchResults(results);
        logExec(true, 'DuckDuckGo 검색', searchCmd, `결과 ${results.length}건\n\n${resultsText.slice(0, 300)}`);
        addResourcesFromSearchResults(results, prompt);
      }catch(err){
        console.warn('[DuckDuckGo 검색 실패]', err);
        logExec(false, 'DuckDuckGo 검색', searchCmd, err.message || String(err));
      }
    }

    setCaption('검색 결과로 답변 정리 중…', true);
    const systemContent = buildSystemPrompt() + (weatherQuery && !resultsText.startsWith('(검색 실패')
      ? `\n\n아래는 방금 실시간 날씨 API에서 받아온 정확한 수치야. 이 숫자를 근거로 자연스럽게 답해줘. "확인해보세요" 같은 회피성 답변은 하지 말고, 아래 수치로 확실하게 알려줘.\n\n[날씨 데이터]\n${resultsText}`
      : `\n\n아래는 방금 웹에서 검색한 결과야. 이 내용을 참고해서 답하고, 검색 결과에 없는 내용은 모른다고 솔직히 말해줘.\n\n[검색 결과]\n${resultsText}`);
    const chatCmd = isCloud
      ? `POST ${getCloudBaseUrl()}/chat/completions\nmodel: ${model}`
      : `POST ${getOllamaUrl().replace(/\/$/, '')}/api/chat\nmodel: ${model} · think:false`;
    try{
      const text = isCloud
        ? await cloudChat(model, systemContent, hist, prompt)
        : await ollamaChat(model, systemContent, hist, prompt);
      setPipelineStep('research','ok');
      setPipelineStep('ondevice','skip');
      logExec(true, '자료 검색 모델 호출', chatCmd, text.slice(0, 300));
      return { text, tier:'research', label: weatherQuery ? (isCloud ? '클라우드 · 실시간 날씨' : '로컬 · 실시간 날씨') : (isCloud ? '클라우드 · 자료 검색' : '로컬 · 자료 검색') };
    }catch(err){
      setPipelineStep('research','fail');
      logExec(false, '자료 검색 모델 호출', chatCmd, err.message || String(err));
      throw err;
    }
  }

  /* =========================================================
     공급자 3 (최종 폴백): 온디바이스 (transformers.js, 키 불필요)
  ========================================================= */
  let onDevicePipeline = null;
  async function callOnDevice(prompt, hist){
    setPipelineStep('ondevice','active');
    setCaption('온디바이스 모델 준비 중… (최초 1회만 다운로드)', true);
    setOrbState('thinking');
    if (!onDevicePipeline){
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/+esm');
      onDevicePipeline = await pipeline(
        'text-generation',
        'onnx-community/Qwen2.5-0.5B-Instruct',
        { dtype: 'q4' }
      );
    }
    setCaption('온디바이스 모델 생성 중…', true);
    const messages = [
      { role:'system', content: buildSystemPrompt() },
      ...hist,
      { role:'user', content: prompt }
    ];
    const modelOutput = await onDevicePipeline(messages, { max_new_tokens: 180 });
    const generated = modelOutput?.[0]?.generated_text;
    const text = Array.isArray(generated) ? generated.at(-1)?.content : generated;
    const cmd = '온디바이스 추론 (onnx-community/Qwen2.5-0.5B-Instruct, q4)';
    if (!text){
      setPipelineStep('ondevice','fail');
      logExec(false, '온디바이스 모델 추론', cmd, '빈 응답');
      throw new Error('온디바이스: 빈 응답');
    }
    setPipelineStep('ondevice','ok');
    logExec(true, '온디바이스 모델 추론', cmd, text.trim().slice(0, 300));
    return { text: text.trim(), tier:'ondevice', label:'온디바이스' };
  }

  /* =========================================================
     오케스트레이터 — 질문 종류에 따라 대화용/검색용 모델 중 하나를
     먼저 시도하고, 실패하면 온디바이스로 최종 폴백
  ========================================================= */
  async function getAIResponse(prompt, hist){
    resetPipeline();
    const failNotes = []; // 앞 단계들이 왜 넘어갔는지 기록해서 최종 답변 라벨에 남김 (조용히 폴백되지 않도록)
    setPipelineStep('vision','skip'); // 사진 첨부 없는 일반 텍스트 질문은 비전 단계를 타지 않음

    const needsResearch = isResearchQuery(prompt);
    const primary = needsResearch
      ? { fn: callResearch, name: '자료 검색' }
      : { fn: callConvo, name: '대화' };
    // 선택되지 않은 로컬 단계는 처음부터 건너뜀 표시
    setPipelineStep(needsResearch ? 'convo' : 'research', 'skip');

    const providers = [primary, { fn: callOnDevice, name: '온디바이스' }];
    for (const { fn, name } of providers){
      try{
        const result = await fn(prompt, hist);
        if (failNotes.length && result.tier === 'ondevice'){
          result.label = `${result.label} · ${failNotes.join(', ')}`;
        }
        hidePipelineSoon();
        return result;
      }
      catch(err){
        if (err instanceof SkipProvider) continue;
        console.error(`[${name} 실패]`, err);
        failNotes.push(`${name} 실패(${describeProviderError(err)})`);
      }
    }
    hidePipelineSoon();
    throw new Error('모든 공급자 실패');
  }

  // 공급자 호출이 실패한 실제 이유를 사람이 읽을 수 있는 짧은 문구로 변환
  function describeProviderError(err){
    const msg = String(err?.message || err);
    if (msg.includes('Failed to fetch') || err instanceof TypeError){
      return '네트워크/CORS 차단';
    }
    const httpMatch = msg.match(/HTTP (\d+)/);
    if (httpMatch){
      const code = httpMatch[1];
      if (code === '401') return '키 인증 실패(401)';
      if (code === '404') return '모델 없음(404)';
      if (code === '429') return '요청 한도 초과(429)';
      if (code === '400') return '잘못된 요청(400)';
      return `HTTP ${code}`;
    }
    return msg.slice(0, 40);
  }

  /* =========================================================
     외부 라이브러리 지연 로드 (전부 무료 CDN, API 키 불필요)
  ========================================================= */
  function loadScriptOnce(url){
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)){ resolve(); return; }
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('라이브러리를 불러오지 못했어요: ' + url));
      document.head.appendChild(s);
    });
  }
  async function ensurePdfJs(){
    if (window.pdfjsLib) return;
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  async function ensureMammoth(){
    if (window.mammoth) return;
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
  }
  async function ensureJsPDF(){
    if (window.jspdf) return;
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  async function ensureHtml2Canvas(){
    if (window.html2canvas) return;
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  }
  async function ensurePptxGen(){
    if (window.PptxGenJS) return;
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.js');
  }
  async function ensureJSZip(){
    if (window.JSZip) return;
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  }

  /* =========================================================
     파일 첨부 → 텍스트 추출 (PDF / DOCX / TXT / MD / CSV / JSON / ZIP)
  ========================================================= */
  const MAX_ATTACH_CHARS = 8000;
  let pendingAttachment = null; // { name, text, isZip } 또는 { name, isImage:true, dataUrl }

  // 이미지 첨부(비전) 판별 — 확장자 또는 MIME 타입으로 확인
  const IMAGE_EXTS = new Set(['png','jpg','jpeg','webp','gif']);
  function isImageFile(file){
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    return IMAGE_EXTS.has(ext) || file.type.startsWith('image/');
  }
  function readFileAsDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('이미지를 읽지 못했어요'));
      reader.readAsDataURL(file);
    });
  }

  // zip 첨부는 실험적 기능이라 딥시크(deepseek) 계열 모델을 대화용 또는
  // 자료 검색용으로 설정했을 때만 켬 — 사용자 요청에 따른 제한
  function isDeepseekModelSelected(){
    const convo = (getAiProvider() === 'cloud' ? getCloudConvoModel() : getOllamaConvoModel()).toLowerCase();
    const research = (getAiProvider() === 'cloud' ? getCloudResearchModel() : getOllamaResearchModel()).toLowerCase();
    return convo.includes('deepseek') || research.includes('deepseek');
  }

  // zip 안에서 텍스트로 읽어올 만한 확장자 (문서 + 대부분의 코드/설정 파일)
  const ZIP_TEXT_EXTS = new Set([
    'txt','md','csv','json','js','mjs','cjs','ts','tsx','jsx','py','java','c','h','cpp','hpp',
    'cs','go','rs','kt','swift','php','rb','html','htm','css','scss','sass','less','yml','yaml',
    'xml','sh','bash','sql','vue','svelte','ini','env','toml','gradle','dockerfile','makefile'
  ]);
  const ZIP_MAX_TOTAL_CHARS = 20000; // zip 전체에서 뽑아올 텍스트 총량 상한
  const ZIP_MAX_FILE_CHARS = 3000;   // 파일 하나당 상한 (긴 파일은 잘라서 알려줌)
  const ZIP_MAX_FILES = 40;          // 너무 많은 파일이 있으면 앞에서부터만 읽음

  async function extractZipText(file){
    await ensureJSZip();
    const buf = await file.arrayBuffer();
    const zip = await window.JSZip.loadAsync(buf);
    const entries = Object.values(zip.files)
      .filter(e => !e.dir)
      .sort((a, b) => a.name.localeCompare(b.name));

    const allNames = entries.map(e => e.name);
    let used = 0;
    let readCount = 0;
    const parts = [];
    for (const entry of entries){
      if (readCount >= ZIP_MAX_FILES || used >= ZIP_MAX_TOTAL_CHARS) break;
      const ext = (entry.name.split('.').pop() || '').toLowerCase();
      const base = entry.name.split('/').pop().toLowerCase();
      if (!ZIP_TEXT_EXTS.has(ext) && !ZIP_TEXT_EXTS.has(base)) continue; // 이미지·바이너리 등은 건너뜀
      let content;
      try{ content = await entry.async('string'); }
      catch(e){ continue; }
      readCount++;
      const remaining = ZIP_MAX_TOTAL_CHARS - used;
      const cap = Math.min(ZIP_MAX_FILE_CHARS, remaining);
      const truncated = content.length > cap;
      const slice = content.slice(0, cap);
      used += slice.length;
      parts.push(`--- ${entry.name} ---\n${slice}${truncated ? '\n[...이 파일은 길어서 일부만 표시됨...]' : ''}`);
    }

    const listing = `[zip 안 파일 목록 (${allNames.length}개)]\n` + allNames.slice(0, 100).join('\n') +
      (allNames.length > 100 ? `\n...외 ${allNames.length - 100}개` : '');
    const skippedNote = readCount < entries.filter(e => {
      const ext = (e.name.split('.').pop() || '').toLowerCase();
      const base = e.name.split('/').pop().toLowerCase();
      return ZIP_TEXT_EXTS.has(ext) || ZIP_TEXT_EXTS.has(base);
    }).length
      ? '\n\n(일부 파일은 용량 제한으로 읽지 못했어요.)'
      : '';

    return `${listing}\n\n${parts.join('\n\n')}${skippedNote}`.trim();
  }

  async function extractFileText(file){
    const name = file.name.toLowerCase();
    if (name.endsWith('.zip')){
      return extractZipText(file);
    }
    if (name.endsWith('.pdf')){
      await ensurePdfJs();
      const buf = await file.arrayBuffer();
      const doc = await window.pdfjsLib.getDocument({ data: buf }).promise;
      let text = '';
      const maxPages = Math.min(doc.numPages, 40);
      for (let i = 1; i <= maxPages; i++){
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(it => it.str).join(' ') + '\n';
      }
      return text.trim();
    }
    if (name.endsWith('.docx')){
      await ensureMammoth();
      const buf = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
      return (result.value || '').trim();
    }
    if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv') || name.endsWith('.json')){
      return (await file.text()).trim();
    }
    throw new Error('UNSUPPORTED');
  }

  function showAttachChip(name, statusText){
    attachChipName.textContent = name;
    attachChipStatus.textContent = statusText || '';
    attachChip.style.display = 'flex';
  }
  function hideAttachChip(){
    attachChip.style.display = 'none';
    pendingAttachment = null;
  }

  attachBtn.addEventListener('click', () => attachInput.click());
  attachChipRemove.addEventListener('click', hideAttachChip);

  attachInput.addEventListener('change', async () => {
    const file = attachInput.files?.[0];
    attachInput.value = '';
    if (!file) return;

    // 이미지는 텍스트 추출 대신 비전 모델로 바로 보낼 base64로 읽어둠
    if (isImageFile(file)){
      const visionModel = getAiProvider() === 'cloud' ? getCloudVisionModel() : getOllamaVisionModel();
      if (!visionModel){
        showAttachChip(file.name, '비전 모델을 설정에서 먼저 등록해주세요 (AI 연결 탭)');
        pendingAttachment = null;
        return;
      }
      showAttachChip(file.name, '이미지 읽는 중…');
      try{
        const dataUrl = await readFileAsDataUrl(file);
        pendingAttachment = { name: file.name, isImage: true, dataUrl };
        showAttachChip(file.name, '이미지 준비됨');
        textInput.placeholder = '이 사진에 대해 무엇이든 물어보세요';
        textInput.focus();
      }catch(err){
        console.error(err);
        showAttachChip(file.name, '이미지를 읽지 못했어요');
        pendingAttachment = null;
      }
      return;
    }

    const isZip = file.name.toLowerCase().endsWith('.zip');

    // zip 첨부(실험적)는 딥시크 계열 모델을 쓸 때만 지원함
    if (isZip && !isDeepseekModelSelected()){
      showAttachChip(file.name, 'zip 첨부는 딥시크 모델 전용이에요');
      pendingAttachment = null;
      return;
    }

    showAttachChip(file.name, isZip ? '압축 푸는 중…' : '읽는 중…');
    try{
      const text = await extractFileText(file);
      if (!text){
        showAttachChip(file.name, '텍스트를 찾지 못했어요');
        pendingAttachment = null;
        return;
      }
      const charCap = isZip ? ZIP_MAX_TOTAL_CHARS : MAX_ATTACH_CHARS;
      pendingAttachment = { name: file.name, text: text.slice(0, charCap), isZip };
      showAttachChip(file.name, `${Math.min(text.length, charCap).toLocaleString()}자 준비됨`);
      textInput.placeholder = isZip ? '이 zip으로 무엇을 할지 알려주세요 (분석·수정 등)' : '이 파일에 대해 무엇이든 물어보세요';
      textInput.focus();
    }catch(err){
      console.error(err);
      const msg = err?.message === 'UNSUPPORTED'
        ? '지원하지 않는 형식이에요 (PDF·DOCX·TXT·MD·CSV·JSON·ZIP·이미지만 가능)'
        : '파일을 읽지 못했어요';
      showAttachChip(file.name, msg);
      pendingAttachment = null;
    }
  });

  /* =========================================================
     AI 답변 → PDF / PPT 내보내기 (전부 브라우저에서 무료로 생성)
  ========================================================= */
  function splitTextIntoChunks(text, maxLen){
    const paras = text.split(/\n+/).filter(Boolean);
    const chunks = [];
    let cur = '';
    for (const p of paras){
      if (cur && (cur + '\n' + p).length > maxLen){
        chunks.push(cur);
        cur = p;
      } else {
        cur = cur ? cur + '\n' + p : p;
      }
    }
    if (cur) chunks.push(cur);
    return chunks.length ? chunks : [text];
  }

  async function exportAnswerToPDF(text, btnEl){
    if (btnEl) btnEl.classList.add('busy');
    try{
      await ensureJsPDF();
      await ensureHtml2Canvas();
      const { jsPDF } = window.jspdf;

      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed; left:-9999px; top:0; width:700px; padding:40px; ' +
        'background:#ffffff; color:#141414; font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif; ' +
        'font-size:16px; line-height:1.75; white-space:pre-wrap; word-break:break-word;';
      wrap.textContent = text;
      document.body.appendChild(wrap);
      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await window.html2canvas(wrap, { scale: 2, backgroundColor: '#ffffff' });
      document.body.removeChild(wrap);

      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0){
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`${getAiName()}_답변_${Date.now()}.pdf`);
    }catch(err){
      console.error(err);
      alert('PDF 생성에 실패했어요. 네트워크 상태를 확인해주세요.');
    }finally{
      if (btnEl) btnEl.classList.remove('busy');
    }
  }

  async function exportAnswerToPPT(text, btnEl){
    if (btnEl) btnEl.classList.add('busy');
    try{
      await ensurePptxGen();
      const pptx = new window.PptxGenJS();
      pptx.defineLayout({ name: 'SODAM', width: 10, height: 5.63 });
      pptx.layout = 'SODAM';

      const chunks = splitTextIntoChunks(text, 480);
      chunks.forEach((chunk, i) => {
        const slide = pptx.addSlide();
        slide.background = { color: '0B0C0F' };
        if (i === 0){
          slide.addText(getAiName(), { x: 0.5, y: 0.3, fontSize: 22, bold: true, color: '45D6C4' });
        }
        slide.addText(chunk, {
          x: 0.5, y: i === 0 ? 1.0 : 0.5, w: 9, h: i === 0 ? 4.3 : 4.8,
          fontSize: 16, color: 'F2F3F5', valign: 'top',
          fontFace: 'Malgun Gothic', breakLine: true
        });
        slide.addText(`${i + 1} / ${chunks.length}`, {
          x: 8.7, y: 5.25, w: 1, h: 0.3, fontSize: 9, color: '4a4d55', align: 'right'
        });
      });
      await pptx.writeFile({ fileName: `${getAiName()}_답변_${Date.now()}.pptx` });
    }catch(err){
      console.error(err);
      alert('PPT 생성에 실패했어요. 네트워크 상태를 확인해주세요.');
    }finally{
      if (btnEl) btnEl.classList.remove('busy');
    }
  }

  /* =========================================================
     사용자 입력 처리
  ========================================================= */
  let currentRequestId = 0;

  async function handleUserInput(rawText){
    const attachment = pendingAttachment;
    let userText = (rawText || '').trim();
    if (!userText && !attachment) return;
    if (!userText && attachment) userText = attachment.isImage ? '이 사진에 무엇이 보이는지 설명해줘.' : '이 파일의 내용을 설명하고 핵심을 요약해줘.';
    const myId = ++currentRequestId;

    // 이미지 첨부는 일반 텍스트 파이프라인을 타지 않고 비전 모델로 바로 처리함
    if (attachment?.isImage){
      ensureConversation(userText);
      appendMessage('나', userText, 'user', null, null, attachment.dataUrl);
      setCaption(userText, true);
      hideAttachChip();

      history.push({ role:'user', content: `[사진 첨부: ${attachment.name}] ${userText}` });

      setOrbState('thinking');
      resetExecLog();
      resetPipeline();
      try{
        const { text: answer, tier, label } = await callVision(userText, attachment.dataUrl);
        if (myId !== currentRequestId) return; // 중단됨
        history.push({ role:'assistant', content: answer });
        appendMessage('AI', answer, 'ai', { tier, label }, currentExecLog.slice());
        hidePipelineSoon();
        setOrbState('speaking');
        setCaption(answer, true);
        aiSpeechText = answer;
        speakText(answer, () => {
          if (myId !== currentRequestId) return;
          aiSpeechText = '';
          setOrbState(handsFreeOn ? 'listening' : 'idle');
          setCaption('', false);
        });
      }catch(err){
        if (myId !== currentRequestId) return;
        console.error(err);
        hidePipelineSoon();
        appendMessage('AI', '죄송해요, 사진을 설명하지 못했어요. 설정에서 비전 모델을 확인해주세요.', 'ai-error', null, currentExecLog.slice());
        setCaption('사진 설명에 실패했어요', false);
        setOrbState(handsFreeOn ? 'listening' : 'idle');
      }
      return;
    }

    const displayText = attachment ? `📎 ${attachment.name}\n${userText}` : userText;
    ensureConversation(userText);
    appendMessage('나', displayText, 'user');
    setCaption(userText, true);
    hideAttachChip();

    const promptForAI = attachment
      ? (attachment.isZip
          ? `[첨부 zip 파일: ${attachment.name}]\n` +
            `아래는 압축을 풀어서 읽은 내용이야.\n---\n${attachment.text}\n---\n\n` +
            `사용자 요청: ${userText}\n\n` +
            `파일을 새로 만들거나 수정해서 결과물로 내놓아야 하는 요청이면, 답변 안에 파일마다 ` +
            '코드 블록을 하나씩 써주고, 여는 줄에 언어 다음 칸에 원래 경로를 그대로 적어줘. ' +
            '예: ```js src/app.js  그러면 그 코드로 채워. 설명은 코드 블록 밖에 짧게만 적어줘.'
          : `[첨부 파일: ${attachment.name}]\n---\n${attachment.text}\n---\n\n사용자 요청: ${userText}`)
      : userText;

    const histSnapshot = history.slice(-6);
    history.push({ role:'user', content: promptForAI });

    setOrbState('thinking');
    resetExecLog();
    try{
      const { text: answer, tier, label, image } = await getAIResponse(promptForAI, histSnapshot);
      if (myId !== currentRequestId) return; // 중단됨
      history.push({ role:'assistant', content: answer });
      appendMessage('AI', answer, 'ai', { tier, label }, currentExecLog.slice(), image);
      setOrbState('speaking');
      setCaption(answer, true);
      aiSpeechText = answer; // 바지인(끼어들기) 시 내 목소리 에코와 구분하기 위해 기록
      speakText(answer, () => {
        if (myId !== currentRequestId) return;
        aiSpeechText = '';
        setOrbState(handsFreeOn ? 'listening' : 'idle');
        setCaption('', false);
      });
    }catch(err){
      if (myId !== currentRequestId) return;
      console.error(err);
      appendMessage('AI', '죄송해요, 지금은 답변을 가져올 수 없어요.', 'ai-error', null, currentExecLog.slice());
      setCaption('답변을 가져오지 못했어요', false);
      setOrbState(handsFreeOn ? 'listening' : 'idle');
    }
  }

  /* =========================================================
     실시간 볼륨 미터 (Web Audio API) — 오브가 목소리 크기에 반응
  ========================================================= */
  let audioCtx = null, analyser = null, volData = null, volRafId = null;
  let currentVolume = 0;
  let micStreamRef = null;

  function setupVolumeMeter(stream){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.55;
    const src = audioCtx.createMediaStreamSource(stream);
    src.connect(analyser);
    volData = new Uint8Array(analyser.frequencyBinCount);
    startVolumeLoop();
  }

  function startVolumeLoop(){
    function loop(){
      analyser.getByteTimeDomainData(volData);
      let sumSquares = 0;
      let peak = 0;
      for (let i = 0; i < volData.length; i++){
        const v = (volData[i] - 128) / 128;
        sumSquares += v * v;
        const av = Math.abs(v);
        if (av > peak) peak = av;
      }
      const rms = Math.sqrt(sumSquares / volData.length);
      // RMS와 순간 피크를 함께 반영해 작은 목소리도 잘 잡히게 함
      let raw = rms * 5.5 + peak * 2.2;
      // 노이즈 게이트: 배경 잡음(아주 작은 값)은 0으로 눌러 침묵 시 안 흔들리게
      raw = raw < 0.05 ? 0 : raw;
      // 감마 보정으로 작게 말해도 시각적으로 확 드러나게
      const target = Math.min(1, Math.pow(raw, 0.65));
      // 어택은 빠르게, 릴리즈는 느리게 (말할 때 훅 반응, 멈추면 서서히 가라앉음)
      const attack = target > currentVolume ? 0.55 : 0.12;
      currentVolume += (target - currentVolume) * attack;
      volRafId = requestAnimationFrame(loop);
    }
    volRafId = requestAnimationFrame(loop);
  }

  function stopVolumeLoop(){
    if (volRafId) cancelAnimationFrame(volRafId);
    volRafId = null;
    currentVolume = 0;
  }

  /* =========================================================
     파티클 오브 — 캔버스 기반 구체
     · idle/listening: 은은한 청록빛 입자, 마이크 볼륨에 반응해 퍼짐
     · thinking: 주황색으로 전환, 리드미컬하게 맥동
     · speaking: 파란빛, TTS 음절 경계에 맞춰 순간적으로 퍼짐(피치/볼륨 느낌)
  ========================================================= */
  const orbCanvas = document.getElementById('orb-canvas');
  const octx = orbCanvas.getContext('2d');
  let orbDpr = Math.min(window.devicePixelRatio || 1, 2);
  let orbCssSize = 0;
  let orbParticles = [];

  const ORB_COLORS = {
    idle:      [69, 214, 196],
    listening: [69, 214, 196],
    thinking:  [232, 163, 61],
    speaking:  [124, 201, 255]
  };

  function resizeOrbCanvas(){
    const rect = orbCanvas.getBoundingClientRect();
    orbCssSize = rect.width;
    orbDpr = Math.min(window.devicePixelRatio || 1, 2);
    orbCanvas.width = Math.round(rect.width * orbDpr);
    orbCanvas.height = Math.round(rect.height * orbDpr);
  }

  function buildOrbParticles(){
    const particles = [];
    const CORE_N = 150;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < CORE_N; i++){
      const y = 1 - (i / (CORE_N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      particles.push({
        x: Math.cos(theta) * r, y, z: Math.sin(theta) * r,
        radiusMul: 0.82 + Math.random() * 0.34,
        size: 0.9 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.1,
        corona: false
      });
    }
    const CORONA_N = 40;
    for (let i = 0; i < CORONA_N; i++){
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const rxy = Math.sqrt(Math.max(0, 1 - u * u));
      particles.push({
        x: Math.cos(t) * rxy, y: u, z: Math.sin(t) * rxy,
        radiusMul: 1.35 + Math.random() * 1.5,
        size: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.4,
        corona: true
      });
    }
    orbParticles = particles;
  }

  let orbEnergy = 0.1;       // 실제 렌더에 쓰이는(스무딩된) 확산 정도
  let orbEnergyTarget = 0.1; // 목표 확산 정도
  let speakPulse = 0.1;      // 말하기 상태에서 순간적으로 튀는 값(경계 이벤트로 스파이크)
  let orbRotY = 0;

  function spikeSpeakPulse(v){ speakPulse = Math.max(speakPulse, v); }

  function renderOrb(t){
    requestAnimationFrame(renderOrb);
    if (!orbCssSize) resizeOrbCanvas();
    const state = document.body.dataset.orb;
    const time = t / 1000;

    // 상태별 목표 에너지 계산
    if (state === 'thinking'){
      orbEnergyTarget = 0.26 + Math.sin(time * 3.2) * 0.12 + Math.max(0, Math.sin(time * 7)) * 0.08;
    } else if (state === 'speaking'){
      speakPulse *= 0.92; // 스파이크 감쇠
      orbEnergyTarget = 0.14 + speakPulse;
    } else if (state === 'listening'){
      orbEnergyTarget = 0.14 + currentVolume * 0.95;
    } else {
      orbEnergyTarget = 0.08 + Math.sin(time * 0.6) * 0.035;
    }
    orbEnergy += (orbEnergyTarget - orbEnergy) * 0.12;

    // 회전 속도: 생각 중엔 더 빠르게 돌아 "처리 중" 느낌
    const rotSpeed = state === 'thinking' ? 0.55 : (state === 'speaking' ? 0.28 : 0.14);
    orbRotY += rotSpeed * (1 / 60);
    const tiltX = Math.sin(time * 0.18) * 0.18;

    const color = ORB_COLORS[state] || ORB_COLORS.idle;
    const [cr, cg, cb] = color;

    const w = orbCanvas.width, h = orbCanvas.height;
    octx.setTransform(orbDpr, 0, 0, orbDpr, 0, 0);
    octx.clearRect(0, 0, orbCssSize, orbCssSize);

    const cx = orbCssSize / 2, cy = orbCssSize / 2;
    const coreR = orbCssSize * 0.185;
    const spread = 1 + orbEnergy * 1.7;

    // 은은한 배경 글로우
    const glowR = coreR * (1.9 + orbEnergy * 1.1);
    const glow = octx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    glow.addColorStop(0, `rgba(${cr},${cg},${cb},${0.16 + orbEnergy * 0.18})`);
    glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    octx.fillStyle = glow;
    octx.beginPath();
    octx.arc(cx, cy, glowR, 0, Math.PI * 2);
    octx.fill();

    // 교차하는 두 개의 얇은 축선 (스캔라인 느낌)
    octx.save();
    octx.translate(cx, cy);
    octx.rotate(orbRotY * 0.5);
    octx.strokeStyle = `rgba(${cr},${cg},${cb},${0.12 + orbEnergy * 0.1})`;
    octx.lineWidth = 1;
    const axisR = coreR * (1.5 + orbEnergy * 0.6);
    octx.beginPath(); octx.moveTo(-axisR, 0); octx.lineTo(axisR, 0); octx.stroke();
    octx.rotate(Math.PI / 2.15);
    octx.beginPath(); octx.moveTo(-axisR, 0); octx.lineTo(axisR, 0); octx.stroke();
    octx.restore();

    const cosY = Math.cos(orbRotY), sinY = Math.sin(orbRotY);
    const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);

    for (let i = 0; i < orbParticles.length; i++){
      const p = orbParticles[i];
      // Y축 회전
      let x = p.x * cosY - p.z * sinY;
      let z = p.x * sinY + p.z * cosY;
      let y = p.y;
      // 살짝 X축 틸트
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;

      const jitter = 1 + Math.sin(time * p.speed + p.phase) * 0.06 * (1 + orbEnergy);
      const rMul = p.radiusMul * spread * jitter;
      const px = cx + x * coreR * rMul;
      const py = cy + y2 * coreR * rMul;
      const depth = (z2 + 1) / 2; // 0(뒤) ~ 1(앞)

      const twinkle = 0.55 + 0.45 * Math.sin(time * p.speed * 1.3 + p.phase);
      let alpha = (0.18 + depth * 0.7) * twinkle;
      if (p.corona) alpha *= 0.5;
      alpha = Math.min(1, alpha);
      const rad = p.size * (0.55 + depth * 0.85) * (orbDpr >= 1.5 ? 1 : 1);

      octx.beginPath();
      octx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
      octx.arc(px, py, Math.max(0.4, rad), 0, Math.PI * 2);
      octx.fill();
    }
  }

  buildOrbParticles();
  window.addEventListener('resize', resizeOrbCanvas);
  requestAnimationFrame((t) => { resizeOrbCanvas(); renderOrb(t); });


  /* =========================================================
     STT — 상시 인식(핸즈프리) + 끼어들기(바지인)
  ========================================================= */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  let sessionStarted = false; // 첫 탭으로 마이크 권한을 받았는지
  let handsFreeOn = false;    // 지금 상시 인식이 켜져 있는지 (일시정지 여부)
  let manualStop = false;     // 우리가 의도적으로 recognition.stop()을 부른 것인지
  let aiSpeechText = '';      // 현재 AI가 말하고 있는 문장(에코 구분용)
  let restartTimer = null;    // 침묵 등으로 끊겼다가 자동 재시작을 예약해둔 타이머 id

  // 예약해둔 자동 재시작 타이머를 취소 — 마이크를 껐는데 예전에 예약된
  // 재시작이 뒤늦게 실행돼서 몰래 다시 켜지는 걸 막기 위함
  function cancelPendingRestart(){
    if (restartTimer){ clearTimeout(restartTimer); restartTimer = null; }
  }

  // 버튼 표시(라벨/툴팁)를 지금 상태에 맞게 갱신 — "일시정지" 같은 애매한 표현 대신
  // 단순히 켜짐/꺼짐으로만 보여줌. 켜져 있을 땐 누르면 꺼진다는 뜻으로 라벨을 보여주고,
  // 꺼져 있을 땐 누르면 켜진다는 뜻으로 보여줌.
  function updateMicButtonLabel(){
    const label = handsFreeOn ? '마이크 끄기' : '마이크 켜기';
    micBtn.setAttribute('aria-label', label);
    micBtn.setAttribute('aria-pressed', handsFreeOn ? 'true' : 'false');
    micBtn.title = label;
  }

  function isLikelyEcho(said){
    // 스피커로 나온 AI 목소리가 마이크에 다시 잡혀 인식되는 걸 걸러내기 위한 간단한 휴리스틱
    if (!aiSpeechText) return false;
    const norm = s => s.replace(/\s+/g, '').toLowerCase();
    const saidN = norm(said);
    if (saidN.length < 2) return true;
    return norm(aiSpeechText).includes(saidN);
  }

  function interruptAI(){
    currentRequestId++; // 진행 중이던 응답을 무시
    window.speechSynthesis?.cancel();
    aiSpeechText = '';
    speakPulse = 0.1;
    setOrbState('listening');
    setCaption('', false);
  }

  async function startSession(){
    try{
      const selectedMicId = getSelectedMicId();
      const stream = await navigator.mediaDevices.getUserMedia({
        // autoGainControl을 켜두면 브라우저가 조용할 때/말할 때 소리 크기를 비슷하게
        // 맞춰버려서 오브가 목소리 크기에 반응하는 게 잘 안 보임 → 꺼서 원음 그대로 분석
        audio: {
          echoCancellation:true, noiseSuppression:false, autoGainControl:false,
          ...(selectedMicId ? { deviceId: { exact: selectedMicId } } : {})
        }
      });
      micStreamRef = stream;
      setupVolumeMeter(stream);
    }catch(e){
      setCaption('마이크 권한을 허용해주세요', false);
      return;
    }
    sessionStarted = true;
    handsFreeOn = true;
    manualStop = false;
    cancelPendingRestart();
    micBtn.classList.add('listening');
    updateMicButtonLabel();
    setOrbState('listening');
    setCaption('듣고 있어요, 편하게 말씀해보세요…', true);
    try{ recognition.start(); }catch(e){ /* 이미 시작됨 */ }
  }

  // 마이크 끄기 — 장치(스트림)는 계속 잡고 있고, 음성 인식만 멈춤.
  // 그래서 다시 켤 때 마이크 권한을 다시 물어보지 않고 바로 켜져요.
  // 오브 애니메이션은 AI가 생각 중/말하는 중(thinking·speaking)일 땐 그대로 두고,
  // 마이크가 관여하는 상태(listening)일 때만 idle로 내려줌 — "마이크만" 영향받도록.
  function pauseListening(){
    handsFreeOn = false;
    manualStop = true;
    cancelPendingRestart(); // 예약돼 있던 자동 재시작이 뒤늦게 켜지는 걸 방지
    micBtn.classList.remove('listening');
    updateMicButtonLabel();
    try{ recognition.stop(); }catch(e){}
    stopVolumeLoop();
    if (document.body.dataset.orb === 'listening') setOrbState('idle');
  }

  // 마이크 켜기 — 이미 잡고 있던 스트림으로 음성 인식만 다시 시작.
  // 마찬가지로 AI가 생각 중/말하는 중이면 그 상태를 건드리지 않음.
  function resumeListening(){
    handsFreeOn = true;
    manualStop = false;
    cancelPendingRestart();
    micBtn.classList.add('listening');
    updateMicButtonLabel();
    if (document.body.dataset.orb === 'idle') setOrbState('listening');
    if (micStreamRef) startVolumeLoop();
    try{ recognition.start(); }catch(e){}
  }

  async function toggleSession(){
    if (!sessionStarted){ await startSession(); }
    else if (handsFreeOn){ pauseListening(); }
    else { resumeListening(); }
  }

  if (recognition){
    let consecutiveNetworkErrors = 0;
    const MAX_CONSECUTIVE_NETWORK_ERRORS = 3; // 이 이상 연속 실패하면 재시도를 멈추고 사용자에게 알려줌

    recognition.lang = 'ko-KR';
    recognition.continuous = true;     // 버튼 없이 계속 듣기
    recognition.interimResults = true; // 말하는 중간에도 실시간으로 인지
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (document.body.dataset.orb === 'idle') setOrbState('listening');
    };

    recognition.onresult = (event) => {
      consecutiveNetworkErrors = 0; // 실제로 인식 결과가 왔다는 건 정상 동작 중이라는 뜻
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++){
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      const state = document.body.dataset.orb;
      const liveText = (finalText || interim).trim();

      // 끼어들기: AI가 생각 중이거나 말하는 중에 사용자가 말을 시작하면 즉시 중단
      if ((state === 'thinking' || state === 'speaking') && liveText && !isLikelyEcho(liveText)){
        interruptAI();
      }

      if (interim.trim() && document.body.dataset.orb !== 'speaking'){
        setCaption(interim.trim(), true);
      }
      if (finalText.trim() && !isLikelyEcho(finalText.trim())){
        handleUserInput(finalText.trim());
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed'){
        handsFreeOn = false;
        sessionStarted = false;
        cancelPendingRestart();
        micBtn.classList.remove('listening');
        updateMicButtonLabel();
        setCaption('마이크 권한을 허용해주세요', false);
      } else if (e.error === 'network'){
        // 데스크톱 앱(Electron) 안에서는 브라우저 내장 음성인식이 쓰는 구글 서버 접근이
        // 막혀 있어서 이 에러가 반복될 수 있어요 — onend에서 재시도 횟수를 세어 멈춰요.
        consecutiveNetworkErrors++;
      }
      // 'no-speech', 'aborted' 등은 onend에서 자동 재시작으로 처리
    };

    recognition.onend = () => {
      if (handsFreeOn && !manualStop){
        if (consecutiveNetworkErrors >= MAX_CONSECUTIVE_NETWORK_ERRORS){
          handsFreeOn = false;
          sessionStarted = false;
          cancelPendingRestart();
          micBtn.classList.remove('listening');
          updateMicButtonLabel();
          stopVolumeLoop();
          setOrbState('idle');
          setCaption('이 데스크톱 앱에서는 음성 인식을 쓸 수 없어요. 아래 입력창에 글자로 말씀해주세요.', false);
          manualStop = false;
          return;
        }
        // 브라우저가 침묵 등으로 자체 종료한 경우 자동 재시작 (상시 인식 유지) —
        // 200ms 사이에 사용자가 일시정지를 눌렀을 수 있으니, 실행 시점에
        // handsFreeOn/manualStop을 다시 한번 확인한 뒤에만 재시작함
        cancelPendingRestart();
        restartTimer = setTimeout(() => {
          restartTimer = null;
          if (handsFreeOn && !manualStop){
            try{ recognition.start(); }catch(e){}
          }
        }, 200);
      }
      manualStop = false;
    };

    micBtn.addEventListener('click', toggleSession);
    orbWrap.addEventListener('click', toggleSession);
  } else {
    micBtn.disabled = true;
    document.getElementById('no-speech-note').style.display = 'block';
  }

  /* =========================================================
     TTS
  ========================================================= */
  let koVoice = null;
  function loadVoices(){
    const voices = window.speechSynthesis.getVoices();
    koVoice = voices.find(v => v.lang === 'ko-KR') || voices.find(v => v.lang?.startsWith('ko')) || null;
  }
  if ('speechSynthesis' in window){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  function speakText(text, onEnd){
    if (!('speechSynthesis' in window)){ if (onEnd) onEnd(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    if (koVoice) utter.voice = koVoice;
    speakPulse = 0.35; // 말 시작하며 살짝 퍼짐
    // 단어/음절 경계마다 오브가 순간적으로 퍼지도록(음성 볼륨/피치가 실린 느낌)
    utter.onboundary = () => { spikeSpeakPulse(0.45 + Math.random() * 0.5); };
    utter.onend = () => { speakPulse = 0.1; if (onEnd) onEnd(); };
    utter.onerror = () => { speakPulse = 0.1; if (onEnd) onEnd(); };
    window.speechSynthesis.speak(utter);
  }

  /* =========================================================
     중단(X) 버튼: 진행 중인 응답/음성을 취소
  ========================================================= */
  stopBtn.addEventListener('click', () => {
    currentRequestId++; // 진행 중이던 응답 무시
    window.speechSynthesis?.cancel();
    aiSpeechText = '';
    speakPulse = 0.1;
    // 상시 인식은 그대로 유지 — 여기서는 응답/음성만 중단
    setOrbState(handsFreeOn ? 'listening' : 'idle');
    setCaption('', false);
  });

  /* =========================================================
     텍스트 입력
  ========================================================= */
  function sendTextInput(){
    const val = textInput.value;
    textInput.value = '';
    handleUserInput(val);
  }
  textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendTextInput(); });

  /* =========================================================
     대화 기록 드로어
  ========================================================= */
  function openDrawer(){
    transcriptDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    transcriptToggle.classList.add('open');
  }
  function closeDrawer(){
    transcriptDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    transcriptToggle.classList.remove('open');
  }
  transcriptToggle.addEventListener('click', () => {
    transcriptDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawerOverlay.addEventListener('click', closeDrawer);
  drawerClose.addEventListener('click', closeDrawer);

  /* =========================================================
     자료 서랍 (오른쪽 슬라이드) — 검색 결과에서 찾은 링크/영상을 보여줌
  ========================================================= */
  const resourceBtn = document.getElementById('resource-btn');
  const resourceBadge = document.getElementById('resource-badge');
  const resourceDrawer = document.getElementById('resource-drawer');
  const resourceOverlay = document.getElementById('resource-overlay');
  const resourceClose = document.getElementById('resource-close');
  const resourceClearAll = document.getElementById('resource-clear-all');
  const resourceList = document.getElementById('resource-list');
  // 자료는 "검색 한 번(batch)" 단위로 묶어서 보관 — 최근 batch가 배열 맨 앞
  // batch: { id, query, addedAt, items:[{ id, type:'youtube'|'link', title, url, videoId?, domain }] }
  let resourceBatches = [];

  function openResourceDrawer(){
    resourceDrawer.classList.add('open');
    resourceOverlay.classList.add('open');
  }
  function closeResourceDrawer(){
    resourceDrawer.classList.remove('open');
    resourceOverlay.classList.remove('open');
  }
  resourceBtn.addEventListener('click', () => {
    resourceDrawer.classList.contains('open') ? closeResourceDrawer() : openResourceDrawer();
  });
  resourceOverlay.addEventListener('click', closeResourceDrawer);
  resourceClose.addEventListener('click', closeResourceDrawer);
  resourceClearAll.addEventListener('click', clearAllResources);

  function extractYoutubeId(url){
    const m = String(url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function urlDomain(url){
    try{ return new URL(url).hostname.replace(/^www\./, ''); }
    catch{ return ''; }
  }
  function formatResourceTime(ts){
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone:'Asia/Seoul', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:true
    }).format(new Date(ts));
  }

  // DuckDuckGo 검색 결과를 자료 패널에 새 묶음(batch)으로 추가.
  // 어떤 질문으로 찾아온 자료인지 헤더에 남겨서, 이전에 찾아둔 자료와
  // 한눈에 구분되게 함 (유튜브 링크는 임베드, 나머지는 링크 카드).
  function addResourcesFromSearchResults(results, query){
    if (!results || !results.length) return;
    const existingUrls = new Set(resourceBatches.flatMap(b => b.items.map(i => i.url)));
    const items = [];
    results.forEach((r, i) => {
      if (!r.link || existingUrls.has(r.link)) return; // 다른 batch와도 중복 방지
      const videoId = extractYoutubeId(r.link);
      items.push({
        id: 'res_' + Date.now() + '_' + i,
        type: videoId ? 'youtube' : 'link',
        title: r.title || r.link,
        url: r.link,
        videoId,
        domain: urlDomain(r.link)
      });
    });
    if (!items.length) return;
    resourceBatches.unshift({
      id: 'batch_' + Date.now(),
      query: query || '',
      addedAt: Date.now(),
      items
    });
    resourceBatches = resourceBatches.slice(0, 10); // 너무 쌓이지 않게 최근 검색 10회만 유지
    renderResources();
    openResourceDrawer();
  }

  function deleteResourceItem(batchId, itemId){
    const batch = resourceBatches.find(b => b.id === batchId);
    if (!batch) return;
    batch.items = batch.items.filter(i => i.id !== itemId);
    if (!batch.items.length) resourceBatches = resourceBatches.filter(b => b.id !== batchId);
    renderResources();
  }
  function deleteResourceBatch(batchId){
    resourceBatches = resourceBatches.filter(b => b.id !== batchId);
    renderResources();
  }
  function clearAllResources(){
    if (!resourceBatches.length) return;
    resourceBatches = [];
    renderResources();
  }

  function renderResources(){
    const total = resourceBatches.reduce((n, b) => n + b.items.length, 0);
    resourceBadge.textContent = total;
    resourceBadge.classList.toggle('show', total > 0);
    resourceClearAll.style.display = total > 0 ? '' : 'none';
    if (!total){
      resourceList.innerHTML = '<div class="resource-empty">아직 찾은 자료가 없어요.</div>';
      return;
    }
    resourceList.innerHTML = '';
    resourceBatches.forEach(batch => {
      const batchEl = document.createElement('div');
      batchEl.className = 'resource-batch';

      const head = document.createElement('div');
      head.className = 'resource-batch-head';
      const info = document.createElement('div');
      info.className = 'rb-info';
      info.innerHTML = `
        <div class="rb-query">${escapeHtml(batch.query || '검색 결과')}</div>
        <div class="rb-time">${formatResourceTime(batch.addedAt)} · ${batch.items.length}건</div>`;
      const rbDelBtn = document.createElement('button');
      rbDelBtn.className = 'rb-delete';
      rbDelBtn.type = 'button';
      rbDelBtn.setAttribute('aria-label', '이 검색 자료 전체 삭제');
      rbDelBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
      rbDelBtn.addEventListener('click', () => deleteResourceBatch(batch.id));
      head.appendChild(info);
      head.appendChild(rbDelBtn);
      batchEl.appendChild(head);

      const listEl = document.createElement('div');
      listEl.className = 'resource-batch-list';
      batch.items.forEach((item, idx) => {
        const isBest = idx === 0; // DuckDuckGo가 관련도 순으로 주므로 첫 번째가 가장 우수한 결과
        const card = document.createElement('div');
        card.className = 'resource-card' + (item.type === 'youtube' ? ' r-has-embed' : '') + (isBest ? ' r-best' : '');
        const bestBadge = isBest
          ? `<span class="r-best-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L21.5 9l-4.9 4.4L18 21l-6-3.6L6 21l1.4-7.6L2.5 9l6.6-0.74L12 2z"></path></svg>베스트</span>`
          : '';
        if (item.type === 'youtube'){
          card.innerHTML = `
            <div class="r-embed">
              <iframe src="https://www.youtube.com/embed/${item.videoId}" title="${escapeHtml(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
            </div>
            <div class="r-body">
              ${bestBadge}
              <a class="r-title" href="${item.url}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>
              <div class="r-domain">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2"></rect></svg>
                유튜브
              </div>
            </div>`;
        } else {
          card.innerHTML = `
            <div class="r-body">
              <div class="r-body-main">
                ${bestBadge}
                <a class="r-title" href="${item.url}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>
                <div class="r-domain">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  ${escapeHtml(item.domain)}
                </div>
              </div>
            </div>`;
        }
        const itemDelBtn = document.createElement('button');
        itemDelBtn.className = 'r-delete';
        itemDelBtn.type = 'button';
        itemDelBtn.setAttribute('aria-label', '이 자료 삭제');
        itemDelBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';
        itemDelBtn.addEventListener('click', () => deleteResourceItem(batch.id, item.id));
        card.querySelector('.r-body').appendChild(itemDelBtn);
        listEl.appendChild(card);
      });
      batchEl.appendChild(listEl);
      resourceList.appendChild(batchEl);
    });
  }

  /* =========================================================
     설정 모달 — 탭 전환
  ========================================================= */
  function switchSettingsPane(pane){
    settingsSidebar.querySelectorAll('.settings-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pane === pane);
    });
    document.querySelectorAll('.settings-pane').forEach(sec => {
      sec.classList.toggle('active', sec.dataset.pane === pane);
    });
    // 오디오 탭을 벗어나면 진행 중인 마이크 테스트를 꺼서 마이크가 계속 켜져 있지 않게 함
    if (pane !== 'audio') stopMicTest();
  }
  settingsSidebar.querySelectorAll('.settings-nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchSettingsPane(btn.dataset.pane));
  });

  /* =========================================================
     오디오 탭 — 마이크 선택 & 테스트
  ========================================================= */
  const MIC_STORAGE_KEY = 'voiceai_mic_device';
  function getSelectedMicId(){ return localStorage.getItem(MIC_STORAGE_KEY) || ''; }

  async function populateMicList(){
    if (!navigator.mediaDevices?.enumerateDevices){
      micSelectSub.textContent = '이 브라우저는 마이크 선택을 지원하지 않아요';
      micSelect.disabled = true;
      return;
    }
    try{
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter(d => d.kind === 'audioinput');
      const saved = getSelectedMicId();
      micSelect.innerHTML = '<option value="">기본 마이크</option>';
      inputs.forEach((d, i) => {
        const opt = document.createElement('option');
        opt.value = d.deviceId;
        opt.textContent = d.label || `마이크 ${i + 1}`;
        micSelect.appendChild(opt);
      });
      // 저장된 장치가 목록에 있으면 선택, 없으면 기본값으로
      micSelect.value = inputs.some(d => d.deviceId === saved) ? saved : '';
      const hasLabels = inputs.some(d => d.label);
      micSelectSub.textContent = inputs.length
        ? (hasLabels ? `${inputs.length}개의 입력 장치` : '마이크 접근을 허용하면 이름이 표시돼요')
        : '입력 장치를 찾을 수 없어요';
    }catch(e){
      micSelectSub.textContent = '마이크 목록을 불러오지 못했어요';
    }
  }

  micRefreshBtn.addEventListener('click', async () => {
    micRefreshBtn.classList.add('spinning');
    // 라벨(장치 이름)은 마이크 권한을 한 번 허용해야 보임 — 짧게 권한만 요청하고 바로 정지
    try{
      const tmp = await navigator.mediaDevices.getUserMedia({ audio: true });
      tmp.getTracks().forEach(t => t.stop());
    }catch(e){ /* 거부해도 목록 자체는 계속 보여줌 */ }
    await populateMicList();
    micRefreshBtn.classList.remove('spinning');
  });

  micSelect.addEventListener('change', () => {
    if (micSelect.value) localStorage.setItem(MIC_STORAGE_KEY, micSelect.value);
    else localStorage.removeItem(MIC_STORAGE_KEY);
    // 테스트 중이었다면 새로 고른 마이크로 다시 시작
    if (micTestActive){ stopMicTest(); startMicTest(); }
  });

  let micTestActive = false;
  let micTestStream = null, micTestCtx = null, micTestAnalyser = null, micTestData = null, micTestRaf = null;

  async function startMicTest(){
    try{
      const constraints = { audio: micSelect.value ? { deviceId: { exact: micSelect.value } } : true };
      micTestStream = await navigator.mediaDevices.getUserMedia(constraints);
    }catch(e){
      micTestHint.textContent = '마이크에 접근할 수 없어요. 브라우저 권한을 확인해주세요.';
      return;
    }
    micTestActive = true;
    micTestToggle.textContent = '중지';
    micTestHint.textContent = '말을 해보면 아래 막대가 움직여요.';
    micTestCtx = new (window.AudioContext || window.webkitAudioContext)();
    micTestAnalyser = micTestCtx.createAnalyser();
    micTestAnalyser.fftSize = 512;
    micTestCtx.createMediaStreamSource(micTestStream).connect(micTestAnalyser);
    micTestData = new Uint8Array(micTestAnalyser.frequencyBinCount);
    const loop = () => {
      micTestAnalyser.getByteTimeDomainData(micTestData);
      let sumSquares = 0;
      for (let i = 0; i < micTestData.length; i++){
        const v = (micTestData[i] - 128) / 128;
        sumSquares += v * v;
      }
      const rms = Math.sqrt(sumSquares / micTestData.length);
      const pct = Math.min(100, Math.round(Math.pow(rms * 4, 0.6) * 100));
      micMeterFill.style.width = pct + '%';
      micTestRaf = requestAnimationFrame(loop);
    };
    loop();
    // 이름 라벨이 비어 있었다면 권한 허용 후 다시 채워줌
    populateMicList();
  }

  function stopMicTest(){
    if (!micTestActive) return;
    micTestActive = false;
    micTestToggle.textContent = '시작';
    micMeterFill.style.width = '0%';
    if (micTestRaf) cancelAnimationFrame(micTestRaf);
    micTestRaf = null;
    if (micTestStream) micTestStream.getTracks().forEach(t => t.stop());
    micTestStream = null;
    if (micTestCtx) micTestCtx.close();
    micTestCtx = null;
    micTestHint.textContent = '테스트를 시작하면 선택한 마이크로 들어오는 소리 크기가 여기에 표시돼요.';
  }

  micTestToggle.addEventListener('click', () => { micTestActive ? stopMicTest() : startMicTest(); });

  if (navigator.mediaDevices?.addEventListener){
    navigator.mediaDevices.addEventListener('devicechange', populateMicList);
  }

  /* =========================================================
     설정 모달 — Ollama CORS 실행 도우미
     브라우저는 보안상 로컬 터미널 명령을 직접 실행할 수 없어서,
     (1) OS에 맞는 명령어를 보여주고 복사하거나
     (2) 더블클릭으로 실행되는 스크립트를 다운로드하는 두 가지로 대신함
  ========================================================= */
  const CORS_CMDS = {
    mac: 'OLLAMA_ORIGINS=* ollama serve',
    win: '$env:OLLAMA_ORIGINS="*"; ollama serve'
  };
  function detectOs(){
    const ua = navigator.userAgent || '';
    if (/Windows/i.test(ua)) return 'win';
    return 'mac'; // macOS, Linux, ChromeOS 등은 동일한 bash 문법 사용
  }
  let corsCurrentOs = detectOs();
  function renderCorsOs(osKey){
    corsCurrentOs = osKey;
    corsCmdText.textContent = CORS_CMDS[osKey];
    corsOsTabs.querySelectorAll('.cors-os-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.os === osKey);
    });
    corsDownloadLabel.textContent = osKey === 'win' ? 'Windows' : 'macOS/Linux';
    corsCopyHint.textContent = osKey === 'win'
      ? 'PowerShell에 붙여넣고 엔터를 누르면 CORS가 허용된 채로 Ollama가 실행돼요.'
      : '터미널(bash·zsh)에 붙여넣고 엔터를 누르면 CORS가 허용된 채로 Ollama가 실행돼요.';
  }
  renderCorsOs(corsCurrentOs);
  corsOsTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.cors-os-tab');
    if (!tab) return;
    renderCorsOs(tab.dataset.os);
  });

  corsCopyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(CORS_CMDS[corsCurrentOs]);
      corsCopyHint.textContent = '복사했어요! 터미널에 붙여넣기만 하면 돼요.';
      setTimeout(() => renderCorsOs(corsCurrentOs), 2500);
    }catch(e){
      corsCopyHint.textContent = '복사에 실패했어요. 명령어를 직접 선택해서 복사해주세요.';
    }
  });

  function downloadTextFile(filename, text){
    const blob = new Blob([text], { type:'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  corsDownloadBtn.addEventListener('click', () => {
    if (corsCurrentOs === 'win'){
      const script = `@echo off\r\nrem 소담 — Ollama를 CORS 허용 상태로 실행\r\nset OLLAMA_ORIGINS=*\r\nollama serve\r\npause\r\n`;
      downloadTextFile('ollama-cors-start.bat', script);
      corsCopyHint.textContent = '다운로드했어요. 저장한 .bat 파일을 더블클릭하면 실행돼요.';
    }else{
      const script = `#!/bin/bash\n# 소담 — Ollama를 CORS 허용 상태로 실행\nexport OLLAMA_ORIGINS=*\nexec ollama serve\n`;
      downloadTextFile('ollama-cors-start.command', script);
      corsCopyHint.textContent = '다운로드했어요. 터미널에서 chmod +x ollama-cors-start.command 한 번 실행한 뒤, 이후로는 더블클릭하면 돼요.';
    }
  });

  /* =========================================================
     설정 모달 — Ollama 연결 테스트 & 모델 새로고침
  ========================================================= */
  async function testOllamaConnection(){
    const url = (ollamaUrlInput.value.trim() || 'http://localhost:11434').replace(/\/$/, '');
    ollamaStatusHint.textContent = '연결 확인 중…';
    try{
      const res = await fetch(`${url}/api/tags`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const models = (data.models || []).map(m => m.name).filter(Boolean);
      ollamaModelsList.innerHTML = '';
      models.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        ollamaModelsList.appendChild(opt);
      });
      ollamaStatusHint.textContent = models.length
        ? `연결됨 · 설치된 모델 ${models.length}개 (${models.slice(0, 3).join(', ')}${models.length > 3 ? ' 외' : ''})`
        : '연결됨 · 설치된 모델이 없어요. 터미널에서 ollama pull deepseek-r1:7b 로 받아주세요.';
    }catch(e){
      const isCors = (e instanceof TypeError) || /Failed to fetch/i.test(String(e?.message || e));
      ollamaStatusHint.textContent = isCors
        ? '연결 실패: 네트워크/CORS 차단 — OLLAMA_ORIGINS=* ollama serve 로 다시 실행해보세요.'
        : `연결 실패: ${e.message || e}`;
    }
  }
  ollamaTestBtn.addEventListener('click', testOllamaConnection);
  ollamaRefreshBtn.addEventListener('click', testOllamaConnection);

  /* =========================================================
     설정 모달 — 클라우드 API 연결 테스트 & 모델 새로고침
     (OpenAI 호환 GET /models 로 키 유효성과 사용 가능한 모델을 확인)
  ========================================================= */
  async function testCloudConnection(){
    const base = (cloudBaseUrlInput.value.trim() || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
    const key = cloudApiKeyInput.value.trim();
    if (!key){
      cloudStatusHint.textContent = 'API 키를 먼저 입력해주세요.';
      return;
    }
    cloudStatusHint.textContent = '연결 확인 중…';
    try{
      const res = await fetch(`${base}/models`, {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const models = (data.data || []).map(m => m.id).filter(Boolean).sort();
      cloudModelsList.innerHTML = '';
      models.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        cloudModelsList.appendChild(opt);
      });
      cloudStatusHint.textContent = models.length
        ? `연결됨 · 사용 가능한 모델 ${models.length}개 (${models.slice(0, 3).join(', ')}${models.length > 3 ? ' 외' : ''}) — 입력창 자동완성에 채웠어요.`
        : '연결됨 · 모델 목록을 가져오진 못했지만 키는 정상일 수 있어요.';
    }catch(e){
      const isCors = (e instanceof TypeError) || /Failed to fetch/i.test(String(e?.message || e));
      const httpMatch = String(e?.message || e).match(/HTTP (\d+)/);
      if (httpMatch?.[1] === '401'){
        cloudStatusHint.textContent = '연결 실패: API 키가 올바르지 않아요 (401).';
      }else if (isCors){
        cloudStatusHint.textContent = '연결 실패: 네트워크 오류 — Base URL이 올바른지 확인해주세요.';
      }else{
        cloudStatusHint.textContent = `연결 실패: ${e.message || e}`;
      }
    }
  }
  cloudTestBtn.addEventListener('click', testCloudConnection);
  cloudRefreshBtn.addEventListener('click', testCloudConnection);

  /* =========================================================
     설정 모달 — 열기/닫기/저장
  ========================================================= */
  function openSettings(){
    ollamaUrlInput.value = getOllamaUrl();
    ollamaModelConvoInput.value = getOllamaConvoModel();
    ollamaModelResearchInput.value = getOllamaResearchModel();
    ollamaModelVisionInput.value = getOllamaVisionModel();
    syncConvoChipActive?.();
    syncResearchChipActive?.();
    syncVisionChipActive?.();
    ollamaStatusHint.textContent = '아직 테스트하지 않았어요. 서버 주소를 확인하고 테스트를 눌러보세요.';

    cloudBaseUrlInput.value = getCloudBaseUrl();
    cloudApiKeyInput.value = getCloudApiKey();
    cloudModelConvoInput.value = getCloudConvoModel();
    cloudModelResearchInput.value = getCloudResearchModel();
    cloudModelVisionInput.value = getCloudVisionModel();
    syncCloudConvoChipActive?.();
    syncCloudResearchChipActive?.();
    syncCloudVisionChipActive?.();
    cloudStatusHint.textContent = '아직 테스트하지 않았어요. API 키를 입력하고 테스트를 눌러보세요.';
    switchAiProviderTab(getAiProvider());

    const prefs = loadPrefs();
    prefAiNameInput.value = prefs.aiName || '';
    prefUserNameInput.value = prefs.userName || '';
    prefPersonalityInput.value = prefs.personality || 'friendly';
    prefNotesInput.value = prefs.notes || '';
    switchSettingsPane('general');
    populateMicList();
    settingsOverlay.classList.add('open');
  }
  function closeSettings(){
    stopMicTest();
    settingsOverlay.classList.remove('open');
  }

  plusBtn.addEventListener('click', openSettings);
  document.getElementById('close-settings').addEventListener('click', closeSettings);
  closeSettingsFooterBtn.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', (e) => { if (e.target === settingsOverlay) closeSettings(); });

  document.getElementById('save-settings').addEventListener('click', () => {
    const selectedProvider = providerTabCloud.classList.contains('active') ? 'cloud' : 'ollama';
    localStorage.setItem('voiceai_ai_provider', selectedProvider);

    const ou = ollamaUrlInput.value.trim();
    if (ou) localStorage.setItem('voiceai_ollama_url', ou);
    else localStorage.removeItem('voiceai_ollama_url');
    const omc = ollamaModelConvoInput.value.trim();
    if (omc) localStorage.setItem('voiceai_ollama_model_convo', omc);
    else localStorage.removeItem('voiceai_ollama_model_convo');
    const omr = ollamaModelResearchInput.value.trim();
    if (omr) localStorage.setItem('voiceai_ollama_model_research', omr);
    else localStorage.removeItem('voiceai_ollama_model_research');
    const omv = ollamaModelVisionInput.value.trim();
    if (omv) localStorage.setItem('voiceai_ollama_model_vision', omv);
    else localStorage.removeItem('voiceai_ollama_model_vision');

    const cbu = cloudBaseUrlInput.value.trim();
    if (cbu) localStorage.setItem('voiceai_cloud_base_url', cbu);
    else localStorage.removeItem('voiceai_cloud_base_url');
    const cak = cloudApiKeyInput.value.trim();
    if (cak) localStorage.setItem('voiceai_cloud_api_key', cak);
    else localStorage.removeItem('voiceai_cloud_api_key');
    const cmc = cloudModelConvoInput.value.trim();
    if (cmc) localStorage.setItem('voiceai_cloud_model_convo', cmc);
    else localStorage.removeItem('voiceai_cloud_model_convo');
    const cmr = cloudModelResearchInput.value.trim();
    if (cmr) localStorage.setItem('voiceai_cloud_model_research', cmr);
    else localStorage.removeItem('voiceai_cloud_model_research');
    const cmv = cloudModelVisionInput.value.trim();
    if (cmv) localStorage.setItem('voiceai_cloud_model_vision', cmv);
    else localStorage.removeItem('voiceai_cloud_model_vision');

    savePrefs({
      aiName: prefAiNameInput.value.trim(),
      userName: prefUserNameInput.value.trim(),
      personality: prefPersonalityInput.value,
      notes: prefNotesInput.value.trim()
    });
    applyPersonalizationToUI();
    closeSettings();
  });
  resetSettingsBtn.addEventListener('click', () => {
    localStorage.removeItem('voiceai_ai_provider');
    localStorage.removeItem('voiceai_ollama_url');
    localStorage.removeItem('voiceai_ollama_model_convo');
    localStorage.removeItem('voiceai_ollama_model_research');
    localStorage.removeItem('voiceai_ollama_model_vision');
    localStorage.removeItem('voiceai_cloud_base_url');
    localStorage.removeItem('voiceai_cloud_api_key');
    localStorage.removeItem('voiceai_cloud_model_convo');
    localStorage.removeItem('voiceai_cloud_model_research');
    localStorage.removeItem('voiceai_cloud_model_vision');
    ollamaUrlInput.value = getOllamaUrl();
    ollamaModelConvoInput.value = '';
    ollamaModelResearchInput.value = '';
    ollamaModelVisionInput.value = '';
    syncConvoChipActive?.();
    syncResearchChipActive?.();
    syncVisionChipActive?.();
    ollamaStatusHint.textContent = '아직 테스트하지 않았어요. 서버 주소를 확인하고 테스트를 눌러보세요.';
    cloudBaseUrlInput.value = getCloudBaseUrl();
    cloudApiKeyInput.value = '';
    cloudModelConvoInput.value = '';
    cloudModelResearchInput.value = '';
    cloudModelVisionInput.value = '';
    syncCloudConvoChipActive?.();
    syncCloudResearchChipActive?.();
    syncCloudVisionChipActive?.();
    cloudStatusHint.textContent = '아직 테스트하지 않았어요. API 키를 입력하고 테스트를 눌러보세요.';
    switchAiProviderTab('ollama');
  });
  clearHistoryBtn.addEventListener('click', () => {
    if (!confirm('저장된 모든 대화 기록을 삭제할까요? 이 작업은 되돌릴 수 없어요.')) return;
    conversations = [];
    saveConversations();
    currentConversationId = null;
    history = [];
    transcriptList.innerHTML = '<div class="empty-hint">아직 대화가 없어요.</div>';
    renderHistoryList();
  });

  applyPersonalizationToUI();

  /* =========================================================
     사이드바 (로고 · 새 대화 · 시계 · 대화 기록)
  ========================================================= */
  function openSidebar(){ sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
  function closeSidebar(){ sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }
  menuBtn.addEventListener('click', openSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  newChatBtn.addEventListener('click', startNewChat);
  sidebarSettingsBtn.addEventListener('click', () => { closeSidebar(); openSettings(); });
  renderHistoryList();

  function updateClock(){
    const now = new Date();
    const dateFmt = new Intl.DateTimeFormat('ko-KR', {
      timeZone:'Asia/Seoul', year:'numeric', month:'long', day:'numeric', weekday:'short'
    });
    const timeFmt = new Intl.DateTimeFormat('ko-KR', {
      timeZone:'Asia/Seoul', hour:'2-digit', minute:'2-digit', hour12:true
    });
    clockDateEl.textContent = dateFmt.format(now);
    clockTimeEl.textContent = timeFmt.format(now);
  }
  updateClock();
  setInterval(updateClock, 15000);
