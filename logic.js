// 월루 오피스 게임 규칙 — 서버와 브라우저(혼자 모드)가 함께 사용
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Logic = factory();
})(this, function () {
  const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#ca8a04', '#db2777'];
  const GAME_KEYS = ['hunt', 'potato', 'mines', 'typing', 'numbers', 'apple', 'quiz'];
  const RANKS = [[0, '인턴'], [100, '사원'], [250, '주임'], [500, '대리'], [900, '과장'], [1500, '차장'], [2400, '부장'],
    [3600, '이사'], [5000, '상무'], [7000, '전무'], [10000, '사장']];
  const STAMPS = {
    first: '첫 결재', hunt_win: '숫자 찾기 승리', potato_win: '폭탄 회피 달인', mines_safe: '무사고 점검',
    mines_hard: '고급 셀 점검', typing_boss: '팀장님 호출 처리', typing_combo: '20연속 교정', numbers_hard: '고급 순번 검수',
    apple_big: '대량 결재', quiz_perfect: '교육 만점', all: '전 업무 경험'
  };
  const WORDS = ['보고서', '결재', '회의록', '야근', '연차', '출장', '엑셀', '피벗', '매크로', '주간회의', '품의서', '기안',
    '결산', '예산', '실적', 'KPI', 'OKR', '팀장님', '퇴근', '점심', '법인카드', '워크샵', '인사평가', '이메일',
    '회신', '참조', '첨부파일', '미팅', '클라이언트', '마감', '일정', '검토', '승인', '수정', '최종', '최최종', '진짜최종',
    '슬라이드', '템플릿', '서식', '각주', '목차', '셀병합', '조건부서식', '브이룩업', '단축키', '복붙', '저장', '백업',
    '반차', '재택', '화상회의', '메신저', '부재중', '외근', '협조전', '공문', '결재선', '전결', '시말서', '견적서', '세금계산서'];
  const HEAL = ['칼퇴', '월급날', '성과급', '불금'];
  const BOSS = ['내일까지 가능하죠', '잠깐 얘기 좀 할까', '이거 급한 건데요', '회의 하나만 더 잡죠', '주말에 시간 돼요'];
  const QUIZ = [
    ['엑셀에서 오늘 날짜를 바로 입력하는 단축키는?', ['Ctrl + ;', 'Ctrl + Shift + ;', 'Ctrl + D', 'Alt + =']],
    ['엑셀 자동 합계(SUM) 단축키는?', ['Alt + =', 'Ctrl + S', 'Ctrl + Shift + L', 'F4']],
    ['엑셀에서 필터를 켜고 끄는 단축키는?', ['Ctrl + Shift + L', 'Ctrl + F', 'Ctrl + T', 'Alt + F4']],
    ['엑셀 수식에서 셀 참조를 절대참조($A$1)로 바꾸는 키는?', ['F4', 'F2', 'F5', 'F9']],
    ['엑셀에서 선택한 셀을 편집 모드로 여는 키는?', ['F2', 'F1', 'F7', 'F12']],
    ['실행 취소 단축키는?', ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + X', 'Ctrl + U']],
    ['파워포인트 슬라이드 쇼를 "처음부터" 시작하는 키는?', ['F5', 'Shift + F5', 'F7', 'F12']],
    ['윈도우에서 바탕화면을 바로 보여주는 단축키는?', ['Win + D', 'Win + L', 'Win + E', 'Alt + Tab']],
    ['윈도우에서 PC를 바로 잠그는 단축키는?', ['Win + L', 'Win + D', 'Ctrl + L', 'Alt + L']],
    ['윈도우 작업 관리자를 바로 여는 단축키는?', ['Ctrl + Shift + Esc', 'Ctrl + Alt + T', 'Win + T', 'Alt + F4']],
    ['근로기준법상 1주 기본 법정 근로시간은?', ['40시간', '44시간', '48시간', '52시간']],
    ['업무 메일의 "ASAP" 뜻은?', ['가능한 한 빨리', '회신 불필요', '참고만 하세요', '내일까지']],
    ['이메일의 "CC"는 원래 무엇의 약자?', ['Carbon Copy', 'Common Contact', 'Copy Check', 'Central Copy']],
    ['이메일에서 다른 수신자에게 보이지 않게 넣는 칸은?', ['BCC', 'CC', 'TO', 'FW']],
    ['"FYI"의 뜻은?', ['참고로 알려드립니다', '빠른 확인 바랍니다', '회의 요청', '최종 확인']],
    ['"KPI"의 K는?', ['Key', 'Knowledge', 'Keep', 'Kind']],
    ['"OKR"의 O는?', ['Objectives', 'Operations', 'Outcome', 'Order']],
    ['"TF팀"의 TF는?', ['Task Force', 'Total Function', 'Team Force', 'Time Frame']],
    ['결재에서 "전결"의 뜻은?', ['위임받은 사람이 대신 최종 결재', '모든 결재자가 동시에 결재', '결재 직전 단계', '결재 반려']],
    ['최신 엑셀 한 시트의 최대 행 수는?', ['1,048,576행', '65,536행', '1,000,000행', '16,384행']],
    ['최신 엑셀의 마지막 열 이름은?', ['XFD', 'ZZZ', 'IV', 'XFZ']],
    ['엑셀 =ROUND(3.456, 1) 의 결과는?', ['3.5', '3.4', '3.46', '3']],
    ['엑셀 =LEN("월급날") 의 결과는?', ['3', '6', '9', '2']],
    ['엑셀 =MOD(10, 3) 의 결과는?', ['1', '3', '0', '3.33']],
    ['아메리카노는 에스프레소에 무엇을 더한 음료?', ['물', '우유', '크림', '시럽']],
    ['"카페라테"의 라테(latte)는 이탈리아어로 무슨 뜻?', ['우유', '커피', '거품', '설탕']],
    ['1바이트는 몇 비트?', ['8비트', '4비트', '16비트', '10비트']],
    ['요즘 파워포인트 기본 파일 확장자는?', ['.pptx', '.ppx', '.pps', '.ptx']],
    ['"TMI"의 뜻은?', ['너무 과한 정보', '오늘의 중요 이슈', '팀 회의 일정', '시간 관리 지표']],
    ['직장인 줄임말 "칼퇴"의 뜻은?', ['정시에 칼같이 퇴근', '갑자기 퇴사', '야근 후 퇴근', '외근 후 바로 퇴근']]
  ];

  const rnd = n => Math.floor(Math.random() * n);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const secs = (a, b) => Math.round((b - a) / 100) / 10;
  const norm = s => String(s || '').replace(/\s+/g, '');

  function rankOf(xp) { let i = 0; RANKS.forEach((r, k) => { if (xp >= r[0]) i = k; }); return { i, name: RANKS[i][1], at: RANKS[i][0], next: RANKS[i + 1] ? RANKS[i + 1][0] : null, nextName: RANKS[i + 1] ? RANKS[i + 1][1] : null }; }

  function createRoom() { return { players: {}, game: 'lobby', g: null, gid: 0, chat: [], best: {}, xp: 0, stamps: {}, played: {}, fx: [], fxid: 0 }; }
  function sys(room, text) { room.chat.push({ sys: 1, text, t: Date.now() }); if (room.chat.length > 80) room.chat.shift(); }
  function fx(room, kind, text, extra) { room.fx.push(Object.assign({ id: ++room.fxid, kind, text }, extra || {})); if (room.fx.length > 16) room.fx.shift(); }
  function award(room, pts, reason) {
    pts = Math.round(pts); if (pts <= 0) return;
    const before = rankOf(room.xp); room.xp += pts;
    fx(room, 'xp', `팀 성과 +${pts}`, { sub: reason });
    const after = rankOf(room.xp);
    if (after.i > before.i) { fx(room, 'promo', after.name, { sub: '승진을 축하합니다' }); sys(room, `🎉 팀이 ${after.name}(으)로 승진했습니다!`); }
  }
  function stamp(room, key) {
    if (room.stamps[key]) return;
    room.stamps[key] = Date.now();
    fx(room, 'stamp', STAMPS[key]);
    sys(room, `🔖 결재 도장 획득 — ${STAMPS[key]}`);
  }
  function clear(room, key, pts, reason) { award(room, pts, reason); stamp(room, 'first'); }
  const recMin = (room, k, v) => { if (room.best[k] == null || v < room.best[k]) room.best[k] = v; };
  const recMax = (room, k, v) => { if (room.best[k] == null || v > room.best[k]) room.best[k] = v; };
  const ids = room => Object.keys(room.players);
  const pcount = room => Math.max(1, ids(room).length);

  function addPlayer(room, id, name) {
    name = String(name || '').trim().slice(0, 12) || '익명';
    const p = room.players[id];
    if (p) { p.conn++; return; }
    const used = Object.values(room.players).map(p => p.color);
    const color = COLORS.find(c => !used.includes(c)) || COLORS[rnd(COLORS.length)];
    room.players[id] = { name, color, score: 0, conn: 1 };
    sys(room, name + ' 님이 문서에 들어왔습니다');
  }
  function removePlayer(room, id) {
    const p = room.players[id]; if (!p) return;
    if (--p.conn > 0) return;
    delete room.players[id];
    sys(room, p.name + ' 님이 나갔습니다');
  }

  // ───────── 게임 준비 ─────────
  function startGame(room, game, lv, now) {
    Object.values(room.players).forEach(p => p.score = 0);
    room.gid++;
    lv = Math.max(0, Math.min(2, lv | 0));
    if (!GAME_KEYS.includes(game)) { room.game = 'lobby'; room.g = null; return; }
    room.game = game;
    room.played[game] = 1;
    if (GAME_KEYS.every(k => room.played[k])) stamp(room, 'all');
    const order = shuffle(ids(room));
    const G = { lv, status: 'play', startAt: now, endAt: null };
    switch (game) {
      case 'hunt': {
        const n = [50, 75, 100][lv], cols = 10;
        const nums = shuffle(range(1, n));
        const cells = nums.map((v, k) => ({ n: v, r: Math.floor(k / cols), c: k % cols,
          jx: rnd(30) - 15, jy: rnd(12) - 6, size: 15 + rnd(lv === 2 ? 16 : 10), rot: lv ? rnd(50) - 25 : rnd(14) - 7, done: 0, by: null }));
        room.g = Object.assign(G, { cells, cols, rows: Math.ceil(n / cols), order, goal: 60, boxes: {}, found: {},
          seeker: order[0], phase: 'seek', caller: null, callDeadline: 0, target: nums[rnd(nums.length)], winner: null });
        order.forEach(id => { room.g.boxes[id] = 0; room.g.found[id] = 0; });
        break;
      }
      case 'potato': {
        const pl = order.slice();
        const size = pl.length <= 2 ? 9 : pl.length === 3 ? 12 : 16;
        room.g = Object.assign(G, { order: pl, size, chips: Array.from({ length: size }, () => ({ eaten: 0, by: null, boom: 0 })),
          bombs: {}, ready: {}, hits: {}, phase: 'setup', turn: null, botAt: 0, last: null, winner: null, draw: false });
        pl.forEach(id => { room.g.bombs[id] = []; room.g.hits[id] = 0; });
        break;
      }
      case 'mines': {
        const [rows, cols, mines] = [[9, 14, 18], [12, 20, 38], [14, 26, 70]][lv];
        room.g = Object.assign(G, { rows, cols, mines, lives: 3, lost: 0, startAt: null, placed: false, by: null,
          cells: Array.from({ length: rows * cols }, () => ({ m: 0, n: 0, o: null, f: null, p: null })) });
        break;
      }
      case 'typing':
        room.g = Object.assign(G, { words: [], hp: 5, maxHp: 5, score: 0, stage: 1, combo: 0, maxCombo: 0, nid: 1,
          next: now + 800, last: now, slowUntil: 0, nextBoss: 25, log: [], speedMul: [0.8, 1, 1.3][lv] });
        break;
      case 'numbers': {
        const layers = lv + 1, owners = {};
        const cols = [];
        for (let L = 0; L < layers; L++) cols.push(shuffle(range(L * 25 + 1, L * 25 + 25)));
        range(1, layers * 25).forEach(v => owners[v] = order[rnd(order.length)]);
        room.g = Object.assign(G, { startAt: null, next: 1, max: layers * 25, penalty: 0, owners,
          cells: range(0, 24).map(k => ({ vals: cols.map(a => a[k]), li: 0, by: null })) });
        break;
      }
      case 'apple': {
        const rows = 10, cols = 17, dur = [150, 120, 90][lv];
        room.g = Object.assign(G, { rows, cols, score: 0, combo: 0, lastClear: 0, endsAt: now + dur * 1000, cursors: {},
          cells: Array.from({ length: rows * cols }, () => ({ v: 1 + rnd(9), star: Math.random() < 0.05 ? 1 : 0, by: null })) });
        break;
      }
      case 'quiz': {
        const qs = shuffle(QUIZ.slice()).slice(0, 10).map(([q, opts]) => {
          const o = shuffle(opts.map((t, i) => ({ t, ok: i === 0 })));
          return { q, a: o.map(x => x.t), c: o.findIndex(x => x.ok) };
        });
        const tl = [20, 15, 10][lv];
        room.g = Object.assign(G, { qs, qi: 0, tl, phase: 'ask', deadline: now + tl * 1000, votes: {}, score: 0, streak: 0, last: null, revealUntil: 0 });
        break;
      }
    }
  }

  // ───────── 숫자 찾기 대결 ─────────
  function huntNext(room, g, fromId) {
    const live = g.order.filter(id => room.players[id]);
    if (!live.length) return null;
    const k = live.indexOf(fromId);
    return live[(k + 1) % live.length];
  }
  function huntRandomTarget(g) { const left = g.cells.filter(c => !c.done); return left.length ? left[rnd(left.length)].n : null; }
  function huntEnd(room, g, now, winner) {
    g.status = 'done'; g.endAt = now; g.winner = winner;
    if (winner && room.players[winner]) {
      sys(room, `🏆 ${room.players[winner].name} 님이 숫자 찾기 대결에서 이겼습니다`);
      stamp(room, 'hunt_win');
    }
    clear(room, 'hunt', 40 + g.order.length * 10, '숫자 찾기 대결');
  }

  // ───────── 포테이토붐 ─────────
  function potatoAlive(g) { return g.order.filter(id => g.hits[id] < 3); }
  function potatoAdvance(room, g, now) {
    const alive = potatoAlive(g).filter(id => room.players[id]);
    if (alive.length <= 1 || g.chips.every(c => c.eaten)) return potatoEnd(room, g, now);
    const k = g.order.indexOf(g.turn);
    for (let s = 1; s <= g.order.length; s++) {
      const cand = g.order[(k + s) % g.order.length];
      if (alive.includes(cand)) { g.turn = cand; break; }
    }
  }
  function potatoEnd(room, g, now) {
    g.status = 'done'; g.endAt = now; g.phase = 'done';
    const alive = potatoAlive(g);
    const min = Math.min(...alive.map(id => g.hits[id]));
    const best = alive.filter(id => g.hits[id] === min);
    if (best.length === 1) {
      g.winner = best[0];
      const nm = (room.players[best[0]] || {}).name || '누군가';
      sys(room, `🏆 포테이토붐 승자: ${nm}`);
      stamp(room, 'potato_win');
    } else { g.draw = true; sys(room, '🤝 포테이토붐 무승부'); }
    clear(room, 'potato', 30 + g.order.length * 10, '포테이토붐');
  }
  function potatoEat(room, g, who, i, now) {
    const c = g.chips[i];
    if (!c || c.eaten) return false;
    c.eaten = 1; c.by = who;
    const owners = g.order.filter(o => o !== who && g.bombs[o].includes(i));
    c.boom = owners.length;
    g.hits[who] += owners.length;
    g.last = { who, i, boom: owners.length };
    if (owners.length) fx(room, 'boom', `${room.players[who] ? room.players[who].name : '누군가'} 폭탄 ${owners.length}개!`);
    potatoAdvance(room, g, now);
    return true;
  }

  // ───────── 지뢰찾기 ─────────
  function nbrs(g, i) {
    const r = Math.floor(i / g.cols), c = i % g.cols, out = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < g.rows && cc >= 0 && cc < g.cols) out.push(rr * g.cols + cc);
    }
    return out;
  }
  function place(g, safe, now) {
    const ban = new Set([safe, ...nbrs(g, safe)]);
    shuffle(range(0, g.cells.length - 1).filter(i => !ban.has(i))).slice(0, g.mines).forEach(i => g.cells[i].m = 1);
    g.cells.forEach((c, i) => c.n = nbrs(g, i).filter(j => g.cells[j].m).length);
    g.placed = true; g.startAt = now;
  }
  function openCell(room, g, i, id, now) {
    const c = g.cells[i];
    if (!c || c.o || c.f || g.status !== 'play') return;
    if (!g.placed) place(g, i, now);
    c.p = null;
    if (c.m) {
      c.o = id; g.lives--; g.lost++;
      fx(room, 'boom', `${room.players[id].name} 님이 오류 셀을 열었습니다 (남은 기회 ${g.lives})`);
      if (g.lives <= 0) { g.status = 'lose'; g.endAt = now; g.by = id; sys(room, '💥 셀 점검 실패 — 기회를 모두 썼습니다'); award(room, g.cells.filter(x => x.o && !x.m).length / 8, '셀 점검'); }
      return;
    }
    const st = [i];
    while (st.length) {
      const k = st.pop(), cc = g.cells[k];
      if (cc.o || cc.f) continue;
      cc.o = id; cc.p = null; room.players[id].score++;
      if (cc.n === 0) nbrs(g, k).forEach(j => { if (!g.cells[j].o && !g.cells[j].f) st.push(j); });
    }
    if (g.cells.filter(c => c.o && !c.m).length === g.cells.length - g.mines) {
      g.status = 'win'; g.endAt = now;
      const t = secs(g.startAt, now); recMin(room, 'mines' + g.lv, t);
      sys(room, `✅ 셀 점검 완료! ${t}초`);
      if (!g.lost) stamp(room, 'mines_safe');
      if (g.lv === 2) stamp(room, 'mines_hard');
      clear(room, 'mines', [40, 80, 150][g.lv], '셀 점검 완료');
    }
  }

  // ───────── 오타 교정 ─────────
  function spawnWord(room, g, now) {
    const onScreen = new Set(g.words.map(w => w.text));
    const r = Math.random();
    let kind = 'n', pool = WORDS;
    if (r < 0.06) { kind = 'heal'; pool = HEAL; } else if (r < 0.11) { kind = 'coffee'; pool = ['커피타임']; } else if (r < 0.15) { kind = 'clean'; pool = ['정리정돈']; }
    pool = pool.filter(w => !onScreen.has(w));
    if (!pool.length) return;
    const speed = (6 + g.stage * 1.1) * (0.8 + Math.random() * 0.4) * g.speedMul;
    g.words.push({ id: g.nid++, text: pool[rnd(pool.length)], x: 8 + rnd(78), y: 0, s: speed, kind });
  }
  function spawnBoss(room, g) {
    const need = Math.min(3, pcount(room));
    g.words.push({ id: g.nid++, text: BOSS[rnd(BOSS.length)], x: 50, y: 0, s: 3.2 * g.speedMul, kind: 'boss', need, hitters: [] });
    g.nextBoss += 35;
    fx(room, 'boss', '팀장님 호출!', { sub: need > 1 ? `서로 다른 ${need}명이 입력해야 처리됩니다` : '문장을 그대로 입력하세요' });
  }
  function typingEnd(room, g, now) {
    g.status = 'over'; g.endAt = now; recMax(room, 'typing', g.score);
    sys(room, `📄 오타 교정 종료 — 팀 점수 ${g.score} · 최대 콤보 ${g.maxCombo}`);
    award(room, g.score, '오타 교정'); if (g.score >= 30) stamp(room, 'first');
  }

  // ───────── 퀴즈 ─────────
  function quizReveal(room, g, now) {
    const counts = [0, 0, 0, 0];
    Object.values(g.votes).forEach(v => counts[v]++);
    const q = g.qs[g.qi], max = Math.max(...counts);
    const correct = max > 0 && counts[q.c] === max;
    if (correct) { g.streak++; g.score++; } else g.streak = 0;
    g.last = { counts, correct, streak: g.streak };
    g.phase = 'reveal'; g.revealUntil = now + 3500;
  }

  // ───────── 행동 처리 ─────────
  function act(room, id, type, data, now) {
    const p = room.players[id];
    data = data || {};
    const no = { changed: false };
    if (!p) return no;
    const g = room.g;
    if (type === 'chat') {
      const text = String(data.text || '').trim().slice(0, 200);
      if (!text) return no;
      room.chat.push({ name: p.name, color: p.color, text, t: now });
      if (room.chat.length > 80) room.chat.shift();
      return { changed: true };
    }
    if (type === 'start') {
      if (['hunt', 'potato'].includes(data.game) && ids(room).length < 2) return { changed: false, res: 'need2' };
      startGame(room, String(data.game), data.level, now); return { changed: true };
    }
    if (!g || g.status !== 'play') return no;
    const i = data.i | 0;

    switch (room.game + ':' + type) {
      // 숫자 찾기 대결
      case 'hunt:find': {
        if (g.phase !== 'seek' || g.seeker !== id) return { changed: false, res: 'notyou' };
        const c = g.cells[i];
        if (!c || c.done) return no;
        if (c.n !== g.target) { g.boxes[id] = Math.max(0, g.boxes[id] - 2); return { changed: true, res: 'miss' }; }
        c.done = 1; c.by = id; g.found[id]++; p.score++;
        if (g.cells.every(x => x.done)) {
          const best = g.order.slice().sort((a, b) => g.boxes[b] - g.boxes[a])[0];
          huntEnd(room, g, now, best); return { changed: true, res: 'hit' };
        }
        g.phase = 'call'; g.caller = id; g.callDeadline = now + 5000; g.target = null;
        return { changed: true, res: 'hit' };
      }
      case 'hunt:call': {
        if (g.phase !== 'call' || g.caller !== id) return no;
        const c = data.rand ? null : g.cells[i];
        if (c && c.done) return no;
        g.target = c ? c.n : huntRandomTarget(g);
        g.seeker = huntNext(room, g, id); g.phase = 'seek';
        return { changed: true };
      }
      case 'hunt:box': {
        if (g.phase !== 'seek' || g.seeker === id || g.boxes[id] == null) return no;
        if ((data.k | 0) !== g.boxes[id]) return no;
        g.boxes[id]++;
        if (g.boxes[id] >= g.goal) huntEnd(room, g, now, id);
        return { changed: true };
      }

      // 포테이토붐
      case 'potato:bomb': {
        if (g.phase !== 'setup' || g.ready[id] || !g.bombs[id]) return no;
        const b = g.bombs[id];
        if (i < 0 || i >= g.size) return no;
        if (b.includes(i)) b.splice(b.indexOf(i), 1); else if (b.length < 3) b.push(i);
        return { changed: true };
      }
      case 'potato:ready': {
        if (g.phase !== 'setup' || !g.bombs[id] || g.bombs[id].length !== 3) return no;
        g.ready[id] = true;
        if (g.order.filter(o => room.players[o]).every(o => g.ready[o])) {
          g.phase = 'play';
          const live = g.order.filter(o => room.players[o]);
          g.turn = live[rnd(live.length)];
          sys(room, '🥔 모두 폭탄을 숨겼습니다. 칩을 먹기 시작하세요!');
        }
        return { changed: true };
      }
      case 'potato:eat':
        if (g.phase !== 'play' || g.turn !== id) return { changed: false, res: 'notyou' };
        return { changed: potatoEat(room, g, id, i, now) };

      // 셀 점검
      case 'mines:reveal': openCell(room, g, i, id, now); return { changed: true };
      case 'mines:chord': {
        const c = g.cells[i];
        if (!c || !c.o || c.m || !c.n) return no;
        const nb = nbrs(g, i);
        if (nb.filter(j => g.cells[j].f || (g.cells[j].o && g.cells[j].m)).length !== c.n) return no;
        nb.forEach(j => openCell(room, g, j, id, now));
        return { changed: true };
      }
      case 'mines:flag': { const c = g.cells[i]; if (!c || c.o) return no; c.f = c.f ? null : id; c.p = null; return { changed: true }; }
      case 'mines:ping': { const c = g.cells[i]; if (!c || c.o || c.f) return no; c.p = c.p ? null : id; return { changed: true }; }

      // 오타 교정
      case 'typing:type': {
        const t = norm(data.text);
        if (!t) return no;
        const boss = g.words.find(w => w.kind === 'boss' && norm(w.text) === t);
        if (boss) {
          if (boss.hitters.includes(id)) return { changed: false, res: 'already' };
          boss.hitters.push(id);
          if (boss.hitters.length >= boss.need) {
            g.words = g.words.filter(w => w !== boss);
            g.score += 10; g.combo++; p.score += 3;
            fx(room, 'combo', '팀장님 호출 처리 완료 +10');
            stamp(room, 'typing_boss');
          }
          return { changed: true, res: 'hit' };
        }
        const hits = g.words.filter(w => w.kind !== 'boss' && norm(w.text) === t).sort((a, b) => b.y - a.y);
        if (!hits.length) { g.combo = 0; return { changed: true, res: 'miss' }; }
        const w = hits[0];
        g.words = g.words.filter(x => x !== w);
        g.combo++; g.maxCombo = Math.max(g.maxCombo, g.combo);
        let pts = 1 + Math.floor(g.combo / 5);
        if (w.kind === 'heal') g.hp = Math.min(g.maxHp, g.hp + 1);
        if (w.kind === 'coffee') { g.slowUntil = now + 6000; fx(room, 'combo', '☕ 커피타임 — 6초간 느려집니다'); }
        if (w.kind === 'clean') {
          const rest = g.words.filter(x => x.kind !== 'boss');
          pts += rest.length; g.words = g.words.filter(x => x.kind === 'boss');
          fx(room, 'combo', `🧹 정리정돈 — ${rest.length}개 한 번에 처리`);
        }
        g.score += pts; p.score += pts;
        if (g.combo > 0 && g.combo % 10 === 0) fx(room, 'combo', `${g.combo} 콤보!`);
        if (g.combo >= 20) stamp(room, 'typing_combo');
        const st = 1 + Math.floor(g.score / 15);
        if (st > g.stage) { g.stage = st; fx(room, 'stage', `${st}단계`, { sub: '속도가 빨라집니다' }); }
        g.log.push({ id, text: w.text, kind: w.kind, pts });
        if (g.log.length > 6) g.log.shift();
        return { changed: true, res: 'hit' };
      }

      // 순번 검수
      case 'numbers:pick': {
        const c = g.cells[i];
        if (!c || c.li >= c.vals.length) return no;
        const v = c.vals[c.li];
        if (g.owners[v] !== id && room.players[g.owners[v]]) return { changed: false, res: 'notmine' };
        if (v !== g.next) { if (g.startAt) g.penalty += 1; return { changed: true, res: 'miss' }; }
        if (!g.startAt) g.startAt = now;
        c.by = id; c.li++; p.score++; g.next++;
        if (g.next > g.max) {
          g.status = 'done'; g.endAt = now;
          const t = Math.round(((now - g.startAt) / 1000 + g.penalty) * 10) / 10;
          recMin(room, 'numbers' + g.lv, t);
          sys(room, `✅ 순번 검수 완료! ${t}초`);
          if (g.lv === 2) stamp(room, 'numbers_hard');
          clear(room, 'numbers', [30, 60, 100][g.lv] + Math.max(0, 60 - t) / 2, '순번 검수 완료');
        }
        return { changed: true, res: 'hit' };
      }

      // 합계 맞추기
      case 'apple:cursor': {
        if (data.r1 == null) delete g.cursors[id];
        else g.cursors[id] = { r1: data.r1 | 0, c1: data.c1 | 0, r2: data.r2 | 0, c2: data.c2 | 0 };
        return { changed: true, quiet: true };
      }
      case 'apple:box': {
        delete g.cursors[id];
        const r1 = Math.max(0, Math.min(data.r1, data.r2) | 0), r2 = Math.min(g.rows - 1, Math.max(data.r1, data.r2) | 0);
        const c1 = Math.max(0, Math.min(data.c1, data.c2) | 0), c2 = Math.min(g.cols - 1, Math.max(data.c1, data.c2) | 0);
        let sum = 0; const hit = [];
        for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) { const x = g.cells[r * g.cols + c]; if (x.v) { sum += x.v; hit.push(x); } }
        if (sum !== 10) return { changed: true, res: 'miss' };
        g.combo = now - g.lastClear < 4000 ? g.combo + 1 : 1; g.lastClear = now;
        const base = hit.reduce((s, x) => s + (x.star ? 3 : 1), 0);
        const pts = Math.round(base * (1 + (g.combo - 1) * 0.25));
        hit.forEach(x => { x.v = 0; x.by = id; });
        g.score += pts; p.score += pts;
        if (hit.length >= 5) { fx(room, 'combo', `대량 결재! ${hit.length}칸`); stamp(room, 'apple_big'); }
        else if (g.combo >= 3) fx(room, 'combo', `${g.combo} 연속 결재`);
        return { changed: true, res: 'hit' };
      }

      // 퀴즈
      case 'quiz:vote': {
        if (g.phase !== 'ask') return no;
        const o = data.o | 0;
        if (o < 0 || o > 3) return no;
        g.votes[id] = o;
        if (ids(room).every(pid => g.votes[pid] != null)) quizReveal(room, g, now);
        return { changed: true };
      }
    }
    return no;
  }

  // ───────── 시간 흐름 ─────────
  function tick(room, now) {
    const g = room.g;
    if (!g || g.status !== 'play') return false;
    switch (room.game) {
      case 'hunt':
        if (g.phase === 'call' && now >= g.callDeadline) { g.target = huntRandomTarget(g); g.seeker = huntNext(room, g, g.caller); g.phase = 'seek'; return true; }
        if (g.phase === 'seek' && !room.players[g.seeker]) { g.seeker = huntNext(room, g, g.seeker) || g.seeker; return true; }
        return false;
      case 'potato':
        if (g.phase === 'play' && !room.players[g.turn]) { potatoAdvance(room, g, now); return true; }
        return false;
      case 'typing': {
        const dt = Math.min(0.5, (now - g.last) / 1000); g.last = now;
        const slow = now < g.slowUntil ? 0.4 : 1;
        g.words.forEach(w => w.y += w.s * dt * slow);
        const fallen = g.words.filter(w => w.y >= 100);
        if (fallen.length) {
          fallen.forEach(w => g.hp -= w.kind === 'boss' ? 3 : 1);
          g.combo = 0;
          g.words = g.words.filter(w => w.y < 100);
          if (g.hp <= 0) { g.hp = 0; typingEnd(room, g, now); return true; }
        }
        if (g.score >= g.nextBoss && !g.words.some(w => w.kind === 'boss')) spawnBoss(room, g);
        if (now >= g.next) {
          spawnWord(room, g, now);
          g.next = now + Math.max(450, (2200 - g.stage * 130) / (1 + 0.35 * (pcount(room) - 1)));
        }
        return true;
      }
      case 'apple':
        if (now < g.endsAt) return false;
        g.status = 'done'; g.endAt = g.endsAt; g.cursors = {}; recMax(room, 'apple' + g.lv, g.score);
        sys(room, `⏱ 합계 맞추기 종료 — 팀 점수 ${g.score}`);
        clear(room, 'apple', g.score / 2, '합계 맞추기');
        return true;
      case 'quiz':
        if (g.phase === 'ask' && now >= g.deadline) { quizReveal(room, g, now); return true; }
        if (g.phase === 'reveal' && now >= g.revealUntil) {
          g.qi++;
          if (g.qi >= g.qs.length) {
            g.status = 'done'; g.endAt = now; recMax(room, 'quiz', g.score);
            sys(room, `🎓 사내 교육 종료 — ${g.score}/10 정답`);
            if (g.score === 10) stamp(room, 'quiz_perfect');
            clear(room, 'quiz', g.score * 10, '사내 교육');
          } else { g.phase = 'ask'; g.votes = {}; g.last = null; g.deadline = now + g.tl * 1000; }
          return true;
        }
        return false;
    }
    return false;
  }

  // ───────── 화면용 정보 (사람마다 다름: 숨긴 폭탄 등) ─────────
  function view(room, now, me) {
    const col = id => (room.players[id] && room.players[id].color) || '#9ca3af';
    const nm = id => (room.players[id] && room.players[id].name) || '나간 사람';
    const g = room.g;
    let gv = null;
    if (g) {
      const base = { lv: g.lv, status: g.status, startAt: g.startAt, endAt: g.endAt };
      switch (room.game) {
        case 'hunt':
          gv = Object.assign(base, { cols: g.cols, rows: g.rows, goal: g.goal, phase: g.phase, target: g.target,
            seeker: g.seeker, caller: g.caller, callDeadline: g.callDeadline, winner: g.winner,
            people: g.order.map(id => ({ id, name: nm(id), color: col(id), boxes: g.boxes[id], found: g.found[id] })),
            cells: g.cells.map(c => ({ n: c.n, r: c.r, c: c.c, jx: c.jx, jy: c.jy, size: c.size, rot: c.rot, done: c.done, by: c.by ? col(c.by) : null })) });
          break;
        case 'potato': {
          const reveal = g.status !== 'play';
          gv = Object.assign(base, { size: g.size, phase: g.phase, turn: g.turn, winner: g.winner, draw: g.draw, last: g.last,
            myBombs: g.bombs[me] || [], amIn: g.order.includes(me),
            people: g.order.map(id => ({ id, name: nm(id), color: col(id), hits: g.hits[id], ready: !!g.ready[id], set: g.bombs[id].length, bombs: reveal ? g.bombs[id] : null })),
            chips: g.chips.map(c => ({ eaten: c.eaten, by: c.by ? col(c.by) : null, boom: c.boom })) });
          break;
        }
        case 'mines': {
          const show = g.status !== 'play';
          gv = Object.assign(base, { rows: g.rows, cols: g.cols, mines: g.mines, lives: g.lives, by: g.by && nm(g.by), flags: g.cells.filter(c => c.f).length,
            cells: g.cells.map(c => c.o ? { o: col(c.o), n: c.n, m: c.m } : { f: c.f ? col(c.f) : 0, p: c.p ? col(c.p) : 0, m: show ? c.m : 0 }) });
          break;
        }
        case 'typing':
          gv = Object.assign(base, { hp: g.hp, maxHp: g.maxHp, score: g.score, stage: g.stage, combo: g.combo, maxCombo: g.maxCombo, slow: now < g.slowUntil,
            words: g.words.map(w => ({ id: w.id, text: w.text, x: w.x, y: w.y, kind: w.kind, need: w.need, hitters: w.hitters ? w.hitters.map(col) : null })),
            log: g.log.map(l => ({ name: nm(l.id), color: col(l.id), text: l.text, kind: l.kind, pts: l.pts })) });
          break;
        case 'numbers':
          gv = Object.assign(base, { next: g.next, max: g.max, penalty: g.penalty, nextOwner: g.next <= g.max ? nm(g.owners[g.next]) : null, nextColor: g.next <= g.max ? col(g.owners[g.next]) : null,
            cells: g.cells.map(c => { const v = c.li < c.vals.length ? c.vals[c.li] : null; return { v, mine: v != null && g.owners[v] === me, owner: v != null ? col(g.owners[v]) : null, by: c.by ? col(c.by) : null, layer: c.li }; }) });
          break;
        case 'apple':
          gv = Object.assign(base, { rows: g.rows, cols: g.cols, score: g.score, combo: g.combo, endsAt: g.endsAt,
            cursors: Object.entries(g.cursors).filter(([id]) => id !== me).map(([id, r]) => Object.assign({ color: col(id), name: nm(id) }, r)),
            cells: g.cells.map(c => ({ v: c.v, star: c.star, by: c.by ? col(c.by) : null })) });
          break;
        case 'quiz': {
          const q = g.qs[Math.min(g.qi, g.qs.length - 1)];
          const voters = [[], [], [], []];
          Object.entries(g.votes).forEach(([pid, o]) => voters[o].push({ name: nm(pid), color: col(pid) }));
          gv = Object.assign(base, { qi: g.qi, total: g.qs.length, q: q.q, a: q.a, phase: g.phase, deadline: g.deadline, tl: g.tl,
            score: g.score, streak: g.streak, voters, myVote: g.votes[me], c: g.phase === 'reveal' || g.status !== 'play' ? q.c : null, last: g.last });
          break;
        }
      }
    }
    const players = {};
    for (const [id, p] of Object.entries(room.players)) players[id] = { name: p.name, color: p.color, score: p.score };
    return { players, game: room.game, gid: room.gid, g: gv, chat: room.chat, best: room.best, now,
      xp: room.xp, rank: rankOf(room.xp), stamps: room.stamps, fx: room.fx };
  }

  return { createRoom, addPlayer, removePlayer, act, tick, view, STAMPS, RANKS };
});
