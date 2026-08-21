const { app, BrowserWindow, desktopCapturer } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

// index.html이 <script type="module">을 쓰기 때문에 file:// 로 직접 열면
// 브라우저(Chromium) 정책상 모듈 스크립트가 막힐 수 있어요.
// 그래서 앱 안에 아주 작은 로컬 서버를 하나 띄워서 http://127.0.0.1:고정포트 로 불러옵니다.
// (외부 인터넷과는 무관하고, 이 컴퓨터 안에서만 도는 서버예요)
const PORT = 47654;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/* =========================================================
   DuckDuckGo 웹 검색 — 메인 프로세스(Node)에서 직접 요청
   - 렌더러(브라우저)에서 duckduckgo.com으로 fetch하면 CORS로 막히지만,
     여기 메인 프로세스는 브라우저가 아니라서 CORS 제약이 없어요.
   - html.duckduckgo.com의 결과 페이지를 받아 정규식으로 제목/요약/링크만 뽑아내요.
========================================================= */
function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}
function decodeDdgLink(rawHref) {
  try {
    const full = rawHref.startsWith('//') ? 'https:' + rawHref : rawHref;
    const parsed = new URL(full, 'https://duckduckgo.com');
    const uddg = parsed.searchParams.get('uddg');
    return uddg ? decodeURIComponent(uddg) : full;
  } catch {
    return rawHref;
  }
}
async function searchDuckDuckGo(query, max = 5) {
  const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    },
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error(`DuckDuckGo HTTP ${res.status}`);
  const html = await res.text();
  const results = [];
  const re = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html)) && results.length < max) {
    results.push({
      title: stripHtml(m[2]),
      snippet: stripHtml(m[3]),
      link: decodeDdgLink(m[1])
    });
  }
  return results;
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const rawPath = req.url.split('?')[0];

      // /api/search?q=... — 렌더러 대신 여기서 DuckDuckGo를 검색해서 JSON으로 돌려줌
      if (rawPath === '/api/search') {
        const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
        const q = reqUrl.searchParams.get('q') || '';
        if (!q.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: '검색어가 없어요' }));
          return;
        }
        // 렌더러가 상황(질문의 범위)에 맞춰 5~20 사이로 요청 개수를 지정할 수 있음.
        // 값이 없거나 이상하면 기본 5개, 범위를 벗어나면 5~20 사이로 잘라냄.
        const rawN = parseInt(reqUrl.searchParams.get('n'), 10);
        const n = Number.isFinite(rawN) ? Math.min(20, Math.max(5, rawN)) : 5;
        searchDuckDuckGo(q, n)
          .then((results) => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ results }));
          })
          .catch((err) => {
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
          });
        return;
      }

      const urlPath = req.url === '/' ? '/index.html' : req.url;
      const filePath = path.join(__dirname, decodeURIComponent(urlPath.split('?')[0]));

      // 앱 폴더 밖 파일 접근 방지
      if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.on('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

let mainWindow = null;
let chromeProcess = null;

/* =========================================================
   진짜 Chrome을 "앱 모드"로 띄우기
   - Electron 내장 크로미움엔 음성인식(webkitSpeechRecognition)이 쓰는
     구글 키가 없어서 음성인식이 항상 실패해요.
   - 이 컴퓨터에 진짜 Chrome이 설치돼 있으면, 그 Chrome을
     --app=주소 로 띄워요. 주소창/탭 없는 창이라 보기엔 똑같은
     '앱'인데, 내부는 진짜 Chrome이라 음성인식이 정상 동작해요.
   - Chrome이 없으면 기존처럼 Electron 창으로 대체 실행돼요
     (이 경우엔 음성인식 대신 텍스트 입력을 쓰게 돼요).
========================================================= */
function findChromePath() {
  const candidates = [
    path.join(process.env['ProgramFiles'] || 'C:\\Program Files', 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(process.env['LocalAppData'] || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  return candidates.find((p) => p && fs.existsSync(p)) || null;
}

function launchChromeApp(chromePath) {
  // 앱 전용 프로필 폴더 — 사용자의 평소 크롬 프로필과는 완전히 분리돼요
  // (한 번 마이크를 허용하면 다음부터는 다시 안 물어봐요)
  const profileDir = path.join(app.getPath('userData'), 'chrome-app-profile');
  chromeProcess = spawn(
    chromePath,
    [
      `--app=http://127.0.0.1:${PORT}/`,
      `--user-data-dir=${profileDir}`,
      '--window-size=480,900',
      '--no-first-run',
      '--no-default-browser-check'
    ],
    { stdio: 'ignore' }
  );
  chromeProcess.on('exit', () => {
    chromeProcess = null;
    app.quit(); // 크롬 앱 창을 닫으면 백그라운드 프로세스(로컬 서버)도 같이 종료
  });
  chromeProcess.on('error', (err) => {
    console.warn('[Chrome] 앱 모드 실행 실패, Electron 창으로 대신 열게요:', err.message);
    chromeProcess = null;
    createElectronWindow();
  });
}

function createElectronWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 900,
    minWidth: 380,
    minHeight: 640,
    backgroundColor: '#000000',
    autoHideMenuBar: true, // 상단 메뉴바 숨김 (Alt 누르면 잠깐 나옴)
    title: '소담',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // 마이크 권한 프롬프트를 위해 비활성화
    }
  });

  // 마이크 권한 요청을 자동으로 허용 (앱이 직접 만든 창이므로 신뢰)
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') callback(true);
    else callback(false);
  });

  // 실시간 화면 인식(화면 공유) 지원: 렌더러가 getDisplayMedia()를 부르면
  // Electron이 여기로 요청을 넘겨줌. Windows 10 24H2 이상/최신 macOS면
  // useSystemPicker로 OS 기본 화면 선택창이 뜨고, 안 되는 환경이면
  // 그냥 주 모니터를 자동으로 골라줌 (음성인식과 달리 이 기능은 Chrome
  // 앱 모드 없이도 Electron 창에서 바로 동작해요).
  try{
    mainWindow.webContents.session.setDisplayMediaRequestHandler(
      (request, callback) => {
        desktopCapturer.getSources({ types: ['screen', 'window'] })
          .then((sources) => callback({ video: sources[0] || undefined }))
          .catch(() => callback({}));
      },
      { useSystemPicker: true }
    );
  }catch(err){
    console.warn('[화면 공유] setDisplayMediaRequestHandler 등록 실패(구버전 Electron일 수 있음):', err.message);
  }

  mainWindow.loadURL(`http://127.0.0.1:${PORT}/`);
  mainWindow.on('closed', () => { mainWindow = null; });
}

async function createWindow() {
  await startLocalServer();

  const chromePath = findChromePath();
  if (chromePath) {
    console.log('[Chrome] 발견됨 — 앱 모드로 띄워서 음성인식이 되게 할게요:', chromePath);
    launchChromeApp(chromePath);
  } else {
    console.log('[Chrome] 못 찾았어요 — Electron 창으로 대신 띄워요 (이 경우 음성인식은 안 돼요).');
    createElectronWindow();
  }
}

// 여러 개 켜지는 것 방지 (같은 포트를 두 번 열려고 하면 충돌나요)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on('before-quit', () => {
    if (chromeProcess) {
      try { chromeProcess.kill(); } catch { /* 이미 꺼져 있으면 무시 */ }
      chromeProcess = null;
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
