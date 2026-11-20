import './styles/app.css';
import { CATEGORIAS, EM_BREVE, PROVAS, provaDoSimulado, simulados, totalQuestoes } from './data/catalogo.js';
import { corrigir, formatarTempo, montarTentativa } from './motor.js';

// Progress lives in the student's browser only: no account, no server.
const CHAVE = 'gabarito:v1';
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || { tentativas: [], emAndamento: null }; } catch { return { tentativas: [], emAndamento: null }; } };
const gravar = (d) => { try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch { /* private mode: the attempt still works, it just is not saved */ } };

const app = document.getElementById('app');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LETRAS = 'ABCDE';
let limpar = [];
const aoSair = (fn) => limpar.push(fn);

const I = {
  marca: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#a8e05f"/><path d="M19 33.5l8.5 8.5L45 23.5" fill="none" stroke="#101508" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  esq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  baixo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  mais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
  alvo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></svg>',
  raio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  luz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
  grade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
  cadeado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/></svg>',
  livro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5"/></svg>',
  pessoa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
};

// mascot: the brand check-mark as a living blob (float, blink, shine), timings from the reference
const MASCOTE = `<svg class="mascote" viewBox="0 0 120 120" aria-hidden="true">
  <defs><radialGradient id="mg" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#d6f5a8"/><stop offset=".55" stop-color="#a8e05f"/><stop offset="1" stop-color="#5fa22a"/></radialGradient>
  <clipPath id="mc"><rect x="18" y="14" width="84" height="84" rx="26"/></clipPath></defs>
  <ellipse class="sombra" cx="60" cy="110" rx="30" ry="5" fill="#a8e05f" opacity=".25"/>
  <g class="corpo"><rect x="18" y="14" width="84" height="84" rx="26" fill="url(#mg)"/>
    <g clip-path="url(#mc)"><rect class="brilho" x="10" y="0" width="22" height="120" fill="#fff" opacity=".35"/></g>
    <ellipse class="olho" cx="47" cy="50" rx="6" ry="8" fill="#101508"/><ellipse class="olho" cx="73" cy="50" rx="6" ry="8" fill="#101508"/>
    <path d="M44 70c5 6 27 6 32 0" fill="none" stroke="#101508" stroke-width="5" stroke-linecap="round"/></g></svg>`;

// ---------------- shared bits ----------------
function cabecalho(acao = `<a class="btn btn-acc btn-sm" href="#catalogo">Ver simulados</a>`, links = true) {
  return `<header class="topo" id="topo"><div class="barra">
    <a class="marca" href="#/">${I.marca}Gabarito</a>
    ${links ? `<nav aria-label="Principal"><a href="#painel">Painel</a><a href="#catalogo">Simulados</a><a href="#recursos">Recursos</a><a href="#perguntas">Perguntas</a></nav>` : ''}
    ${acao}</div></header>`;
}
function ligarTopo() {
  const topo = document.getElementById('topo'); if (!topo) return;
  const f = () => topo.classList.toggle('rolou', scrollY > 24);
  addEventListener('scroll', f, { passive: true }); f();
  aoSair(() => removeEventListener('scroll', f));
}
function ligarReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));
  aoSair(() => io.disconnect());
}
function estatisticas() {
  const { tentativas } = ler();
  if (!tentativas.length) return null;
  const pct = tentativas.map((t) => t.resultado.acertos / t.resultado.total);
  return { feitos: tentativas.length, pct, melhor: Math.max(...pct), media: pct.reduce((a, b) => a + b, 0) / pct.length, dias: new Set(tentativas.map((t) => new Date(t.fim).toDateString())), tempo: tentativas.reduce((s, t) => s + t.duracao, 0) };
}
const pctTxt = (x) => `${Math.round(x * 100)}%`;

// ---------------- landing: the panel is a working mini dashboard over the local history ----------------
const ABAS = [['progresso', 'Progresso', 'stats'], ['historico', 'Histórico', 'hist'], ['conteudo', 'Conteúdo', 'livro'], ['revisar', 'Revisar', 'alvo']];
const dataCurta = (ms) => new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
const EXEMPLO_HIST = [
  { prova: 'aws-clf-c02', sim: 'Simulado 1', nota: '775/1000', pct: .75, dias: 1 },
  { prova: 'ete-pe-2027', sim: 'Simulado 3', nota: '16/20', pct: .8, dias: 2 },
  { prova: 'ete-pe-2027', sim: 'Simulado 2', nota: '13/20', pct: .65, dias: 4 },
  { prova: 'ete-pe-2027', sim: 'Simulado 1', nota: '11/20', pct: .55, dias: 6 },
];
const EXEMPLO_REV = [['Regra de três composta', 'Matemática', 1, 3], ['Concordância', 'Português', 2, 4], ['Billing, Pricing, and Support', 'AWS', 1, 2], ['Triângulos', 'Matemática', 2, 3]];

function revisarGeral() {
  // topics across every attempt, worst first, each pointing at the latest correction where it was missed
  const m = new Map();
  for (const t of ler().tentativas) {
    const prova = provaDoSimulado(t.simuladoId); if (!prova) continue;
    for (const r of t.resultado.revisar) {
      const k = prova.id + '|' + r.topico;
      const x = m.get(k) || { topico: r.topico, prova, disciplina: prova.disciplinas.find((d) => d.id === r.disciplina)?.curto, certas: 0, total: 0, ultima: t };
      x.certas += r.certas; x.total += r.total; if (t.fim >= x.ultima.fim) x.ultima = t;
      m.set(k, x);
    }
  }
  return [...m.values()].sort((a, b) => a.certas / a.total - b.certas / b.total || b.total - a.total);
}

function abaPainel(aba) {
  const st = estatisticas(), { tentativas } = ler();
  const card = (k, v, extra = '') => `<div class="card"><div class="k">${k}</div><div class="v">${v}${extra}</div></div>`;
  const exemplo = st ? '' : '<span class="pill acc">Exemplo</span>';
  if (aba === 'progresso') {
    const serie = st ? st.pct.slice(-14) : [.42, .48, .45, .55, .52, .6, .58, .66, .63, .7, .68, .76, .74, .82];
    const w = 640, h = 130;
    const pts = serie.map((v, i) => [serie.length === 1 ? w / 2 : (i * w) / (serie.length - 1), h - 8 - v * (h - 20)]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const calor = Array.from({ length: 26 * 5 }, (_, i) => {
      const dia = new Date(Date.now() - (129 - i) * 864e5).toDateString();
      const n = st ? (st.dias.has(dia) ? 4 : 0) : [0, 1, 0, 2, 3, 0, 1, 4, 2, 0, 3, 1, 0, 2, 4][(i * 7 + (i >> 3)) % 15] * (i > 40 ? 1 : i % 3 === 0 ? 1 : 0);
      return `<b data-n="${n}"></b>`;
    }).join('');
    return `<div class="filtro"><span class="pill">${st ? 'Todos os simulados' : 'Últimos 30 dias'}</span>${st ? `<span class="pill acc">${st.feitos} feitos</span>` : exemplo}</div>
      <div class="card full"><div class="k">Acertos nos simulados</div>
        <div class="v big">${st ? pctTxt(st.melhor) : '82%'}<span class="delta">↑ ${st ? 'melhor nota' : '40 pontos'}</span></div>
        <svg class="grafico" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#a8e05f" stop-opacity=".3"/><stop offset="1" stop-color="#a8e05f" stop-opacity="0"/></linearGradient></defs>
          <path d="${d} L${w} ${h} L0 ${h} Z" fill="url(#ga)"/><path class="linha" d="${d}" fill="none" stroke="#a8e05f" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>
        <div class="grafico-eixo"><span>${st ? 'primeiro simulado' : '14 simulados atrás'}</span><span>${st ? 'último' : 'hoje'}</span></div></div>
      ${card('Simulados feitos', st ? st.feitos : 14, st ? '' : '<span class="delta">↑ 18%</span>')}
      ${card('Média de acertos', st ? pctTxt(st.media) : '63%')}
      ${card('Tempo treinando', st ? formatarTempo(st.tempo) : '7 h 40 min')}
      <div class="card full"><div class="k">Dias de estudo</div><div class="calor">${calor}</div></div>`;
  }
  if (aba === 'historico') {
    const linhas = st
      ? [...tentativas].reverse().slice(0, 8).map((t) => { const p = provaDoSimulado(t.simuladoId), s = p && simulados(p).find((x) => x.id === t.simuladoId); return p && { p, titulo: s?.titulo || '', nota: `${t.resultado.nota.valor}${t.resultado.nota.max}`, pct: t.resultado.acertos / t.resultado.total, quando: dataCurta(t.fim), href: `#/resultado/${t.id}` }; }).filter(Boolean)
      : EXEMPLO_HIST.map((x) => { const p = PROVAS.find((y) => y.id === x.prova); return { p, titulo: x.sim, nota: x.nota, pct: x.pct, quando: dataCurta(Date.now() - x.dias * 864e5), href: '' }; });
    return `<div class="filtro"><span class="pill">${st ? `Últimos ${linhas.length} simulados` : 'Seus simulados aparecem aqui'}</span>${exemplo}</div>
      <div class="card full lista-painel">${linhas.map((l) => `<${l.href ? `a href="${l.href}"` : 'div'} class="linha-painel">
        <span class="selo-prova mini" style="--cor:${l.p.cor}">${esc(l.p.sigla)}</span>
        <span class="nome"><b>${esc(l.p.nome)}</b><span>${esc(l.titulo)} · ${l.quando}</span></span>
        <span class="barra-mini"><i style="width:${Math.round(l.pct * 100)}%"></i></span>
        <span class="nota-mini">${esc(l.nota)}</span>${l.href ? `<span class="ir">${I.seta}</span>` : ''}</${l.href ? 'a' : 'div'}>`).join('')}</div>
      ${st ? '' : `<div class="card full vazio"><span>Faça um simulado e ele entra no histórico, com a correção a um clique.</span><a class="btn btn-acc btn-sm" href="#catalogo">Escolher uma prova</a></div>`}`;
  }
  if (aba === 'conteudo') {
    return `<div class="filtro"><span class="pill">${PROVAS.length} provas · ${totalQuestoes()} questões</span></div>
      ${PROVAS.map((p) => {
        const tops = new Map();
        p.disciplinas.forEach((d) => d.blocos.flat().forEach((q) => tops.set(q.topico, (tops.get(q.topico) || 0) + 1)));
        const ord = [...tops.entries()].sort((a, b) => b[1] - a[1]);
        return `<div class="card full"><div class="cab-conteudo"><span class="selo-prova mini" style="--cor:${p.cor}">${esc(p.sigla)}</span><b>${esc(p.nome)}</b><span class="small">${simulados(p).length} simulados · ${tops.size} assuntos</span><a class="btn btn-glass btn-sm" href="#/simulado/${simulados(p)[0].id}">Começar</a></div>
          <div class="chips">${ord.slice(0, 18).map(([t, n]) => `<span>${esc(t)} <b>${n}</b></span>`).join('')}${ord.length > 18 ? `<span>+${ord.length - 18}</span>` : ''}</div></div>`;
      }).join('')}`;
  }
  const rev = st ? revisarGeral().slice(0, 6) : null;
  const linhas = rev
    ? rev.map((r) => ({ topico: r.topico, onde: `${r.prova.sigla} · ${r.disciplina}`, certas: r.certas, total: r.total, href: `#/revisao/${r.ultima.id}` }))
    : EXEMPLO_REV.map(([topico, onde, certas, total]) => ({ topico, onde, certas, total, href: '' }));
  return `<div class="filtro"><span class="pill">${st ? 'Assuntos com erro, do pior para o melhor' : 'Os assuntos em que você erra aparecem aqui'}</span>${exemplo}</div>
    ${linhas.length ? `<div class="card full lista-painel">${linhas.map((l) => `<${l.href ? `a href="${l.href}"` : 'div'} class="linha-painel">
      <span class="nome"><b>${esc(l.topico)}</b><span>${esc(l.onde)}</span></span>
      <span class="barra-mini ${l.certas / l.total < .5 ? 'ruim' : ''}"><i style="width:${Math.max(4, Math.round((l.certas / l.total) * 100))}%"></i></span>
      <span class="nota-mini">${l.certas}/${l.total}</span>${l.href ? `<span class="ir">${I.seta}</span>` : ''}</${l.href ? 'a' : 'div'}>`).join('')}</div>`
    : '<div class="card full vazio"><span>Nenhum erro até agora. Continue assim.</span></div>'}`;
}

function painel() {
  const st = estatisticas();
  return `<section class="janela-sec page rv" id="painel" aria-label="${st ? 'Seu painel' : 'Painel de exemplo'}">
    <div class="janela"><div class="luzes"><i></i><i></i><i></i></div>
      <div class="app">
        <aside><div class="marca">${I.marca}Gabarito</div>
          <div class="abas-painel" role="tablist" aria-label="Painel" aria-orientation="vertical">
            ${ABAS.map(([id, nome, ico], i) => `<button class="it ${i ? '' : 'on'}" role="tab" id="aba-${id}" aria-selected="${!i}" aria-controls="painelMain" tabindex="${i ? -1 : 0}" data-aba="${id}">${I[ico]}${nome}</button>`).join('')}
          </div>
          <div class="it plano">${I.pessoa}${st ? 'Salvo neste aparelho' : 'Grátis, sem conta'}</div></aside>
        <main id="painelMain" role="tabpanel" aria-labelledby="aba-progresso">${abaPainel('progresso')}</main>
      </div>
      <div class="abas-mobile" role="tablist" aria-label="Painel">${ABAS.map(([id, nome], i) => `<button role="tab" aria-selected="${!i}" data-aba="${id}">${nome}</button>`).join('')}</div>
    </div></section>`;
}
function ligarPainel() {
  const main = document.getElementById('painelMain'); if (!main) return;
  const botoes = [...document.querySelectorAll('#painel [data-aba]')];
  const abrir = (aba, foco) => {
    botoes.forEach((b) => { const on = b.dataset.aba === aba; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); if (b.closest('.abas-painel')) b.tabIndex = on ? 0 : -1; });
    main.setAttribute('aria-labelledby', `aba-${aba}`);
    main.innerHTML = abaPainel(aba);
    main.classList.remove('troca'); void main.offsetWidth; main.classList.add('troca');
    if (foco) document.getElementById(`aba-${aba}`)?.focus();
  };
  botoes.forEach((b) => b.onclick = () => abrir(b.dataset.aba));
  // vertical tablist: arrow keys move between tabs
  document.querySelector('.abas-painel').addEventListener('keydown', (e) => {
    const ids = ABAS.map((a) => a[0]), i = ids.indexOf(document.activeElement?.dataset?.aba);
    if (i < 0) return;
    const j = e.key === 'ArrowDown' ? (i + 1) % ids.length : e.key === 'ArrowUp' ? (i + ids.length - 1) % ids.length : e.key === 'Home' ? 0 : e.key === 'End' ? ids.length - 1 : -1;
    if (j >= 0) { e.preventDefault(); abrir(ids[j], true); }
  });
}

function landing() {
  const { tentativas, emAndamento } = ler();
  const melhor = (id) => { const ts = tentativas.filter((t) => t.simuladoId === id); return ts.length ? ts.reduce((a, t) => (t.resultado.acertos > a.resultado.acertos ? t : a)) : null; };
  const prim = simulados(PROVAS[0])[0];
  const continuar = emAndamento && provaDoSimulado(emAndamento.simuladoId);
  const marcas = [...PROVAS.map((p) => [p.sigla, p.nome, p.cor]), ...EM_BREVE.map((p) => [p.sigla, p.nome, p.cor])];
  const lista = marcas.map(([s, n, c]) => `<li><span class="logo" style="background:${c}">${esc(s)}</span>${esc(n)}</li>`).join('');

  app.innerHTML = `<div class="page-light"></div>
  ${cabecalho()}
  <main>
  <section class="hero page" id="inicio">
    ${MASCOTE}
    <span class="tag">Simulados para provas de seleção e certificações</span>
    <h1 class="display">Você treina.<br><span class="dim">A prova fica fácil.</span></h1>
    <p class="lede">Simulados no formato exato de cada prova, com cronômetro, correção na hora e a explicação de cada questão. De seleções escolares a certificações de TI.</p>
    <div class="acoes">
      <a class="btn btn-acc" href="${continuar ? `#/simulado/${emAndamento.simuladoId}` : '#catalogo'}">${continuar ? 'Continuar simulado' : 'Escolher uma prova'}</a>
      <a class="btn btn-glass" href="#/simulado/${prim.id}">Fazer um simulado agora</a>
    </div>
    <p class="small">Grátis, sem cadastro, ${totalQuestoes()} questões inéditas.</p>
    <a class="rolar" href="#catalogo">Role para ver as provas${I.baixo}</a>
    <div class="halo" aria-hidden="true"></div>
  </section>

  ${painel()}

  <section class="sec" aria-labelledby="t-marcas">
    <div class="page sec-head center rv"><h2 class="h2-sm" id="t-marcas">Do ensino técnico à nuvem</h2><p class="lede">Cada prova tem o formato real: número de questões, alternativas, tempo e regra de aprovação.</p></div>
    <div class="page"><div class="marquee rv" data-d="1"><div class="trilho"><ul>${lista}</ul><ul aria-hidden="true">${lista}</ul></div></div></div>
  </section>

  <section class="sec" id="catalogo" aria-labelledby="t-cat">
    <div class="page">
      <div class="sec-head rv"><span class="eyebrow">Simulados</span><h2 class="h2" id="t-cat">Escolha a sua prova.</h2>
        <p class="lede">Cada simulado é uma prova completa. As alternativas mudam de ordem a cada tentativa, então refazer é treinar, não decorar.</p></div>
      <div class="abas rv" data-d="1" role="tablist" aria-label="Categoria">
        <button role="tab" aria-selected="true" data-cat="todas">Todas</button>
        ${CATEGORIAS.map((c) => `<button role="tab" aria-selected="false" data-cat="${c.id}">${esc(c.nome)}</button>`).join('')}
      </div>
      <div class="provas">${PROVAS.map((p, i) => cartaoProva(p, melhor, i)).join('')}</div>
      <div class="breve rv">${EM_BREVE.map((b) => `<div data-cat="${b.categoria}"><span class="selo-prova" style="--cor:${b.cor}">${esc(b.sigla)}</span><span>${esc(b.nome)}<br><span class="small">em breve</span></span></div>`).join('')}</div>
    </div>
  </section>

  <section class="sec" id="recursos" aria-labelledby="t-rec">
    <div class="page sec-head rv"><span class="eyebrow">Recursos</span><h2 class="h2" id="t-rec">Feito para treinar<br><span class="dim">do jeito que cai.</span></h2></div>
    <div class="feats-wrap rv" data-d="1" role="region" aria-roledescription="carrossel" aria-label="Recursos">
      <button class="seta seta-esq" id="featsPrev" aria-label="Recurso anterior">${I.esq}</button>
      <button class="seta seta-dir" id="featsNext" aria-label="Próximo recurso">${I.seta}</button>
      <ul class="feats" id="feats">
        ${feat(I.relogio, 'O tempo da prova real', 'O cronômetro não pausa e a prova fecha sozinha no fim, como no dia. Você aprende o seu ritmo antes de valer.', `
          <svg class="gauge" viewBox="0 0 260 170" aria-hidden="true"><path d="M30 150a100 100 0 0 1 200 0" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="14" stroke-linecap="round"/>
          <path class="arco" pathLength="1" d="M30 150a100 100 0 0 1 200 0" fill="none" stroke="#a8e05f" stroke-width="14" stroke-linecap="round"/>
          <text x="130" y="128" text-anchor="middle" font-size="44" font-weight="500" fill="#fff" letter-spacing="-2" id="gaugeT">60:00</text>
          <text x="130" y="156" text-anchor="middle" font-size="13" fill="#9d9daa">minutos restantes</text></svg>`)}
        ${feat(I.check, 'Correção explicada', 'Ao entregar, cada questão mostra a resposta certa e o porquê. Errar vira aula, não frustração.', `
          <div class="riscado"><s>B) 2/8</s><s>D) 5/8</s><span class="ok">${I.check} C) 3/8: comeram 5 de 8 pedaços</span><s>A) 1/8</s></div>`)}
        ${feat(I.alvo, 'O que revisar', 'O resultado separa os assuntos em que você errou, do jeito que o edital ou o guia oficial organiza.', `
          <div class="barras"><div><div class="l"><span>Porcentagem</span><span>3/3</span></div><div class="t"><i style="--w:100%"></i></div></div>
          <div><div class="l"><span>Concordância</span><span>1/2</span></div><div class="t"><i style="--w:50%"></i></div></div>
          <div><div class="l"><span>Security and Compliance</span><span>4/6</span></div><div class="t"><i style="--w:66%"></i></div></div>
          <div><div class="l"><span>Triângulos</span><span>0/1</span></div><div class="t"><i style="--w:4%"></i></div></div></div>`)}
        ${feat(I.grade, 'Mapa de questões', 'Pule entre as questões e veja o que já respondeu, como nos sistemas de prova no computador.', `
          <div class="mini-mapa">${Array.from({ length: 15 }, (_, i) => `<b class="${[0, 1, 2, 4, 5, 7, 8, 11].includes(i) ? 'f' : ''} ${i === 9 ? 'a' : ''}">${i + 1}</b>`).join('')}</div>`)}
        ${feat(I.luz, 'Questões inéditas', 'Escritas a partir do conteúdo oficial de cada prova, com texto-base próprio. Nada copiado de provas anteriores.', `
          <div class="bolhas"><div class="bolha">Edital ETE 2027, item 12.2<div class="r">${I.check} Regra de três composta</div></div><div class="bolha">AWS CLF-C02, domínio 2<div class="r">${I.check} Shared responsibility</div></div><div class="bolha">Edital ETE 2027, item 12.1<div class="r">${I.check} Figuras de linguagem</div></div></div>`)}
        ${feat(I.cadeado, 'Seu progresso é seu', 'Sem conta e sem servidor: notas e histórico ficam só no seu navegador. Ninguém mais vê.', `
          <div class="cadeado"><div class="disp">${I.cadeado}</div><span>salvo só neste aparelho</span></div>`)}
      </ul>
    </div>
  </section>

  <section class="sec" id="como" aria-labelledby="t-como">
    <div class="page">
      <div class="sec-head rv"><span class="eyebrow">Como funciona</span><h2 class="h2" id="t-como">Três passos.<br><span class="dim">Nenhum cadastro.</span></h2></div>
      <div class="passos">
        ${[['1', 'Escolha a prova', 'Seleção escolar ou certificação. Cada uma com o formato oficial e a fonte citada.'], ['2', 'Faça no tempo real', 'O cronômetro começa ao abrir e não pausa. Responda, pule, volte, entregue.'], ['3', 'Aprenda com o erro', 'Nota, assuntos para revisar e a explicação de cada questão. Depois, refaça.']]
          .map(([n, t, p], i) => `<div class="passo rv" data-d="${i}"><span class="num">Passo ${n}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}
      </div>
      ${PROVAS.map((p) => `
      <div class="detalhe rv">
        <div class="sec-head"><span class="eyebrow">${esc(p.curto)}</span><h3 class="h2" style="font-size:28px">${esc(p.nome)}</h3><p class="lede">${esc(p.descricao)}</p>
          <p class="small">Fonte: <a href="${p.fonte.url}" target="_blank" rel="noopener">${esc(p.fonte.nome)}</a></p></div>
        <div><ul class="regras">${p.regras.map((r) => `<li>${I.check}<span>${esc(r)}</span></li>`).join('')}</ul>
          <div class="chips">${[...new Set(p.disciplinas.flatMap((d) => d.blocos.flat().map((x) => x.topico)))].slice(0, 22).map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>
      </div>`).join('')}
    </div>
  </section>

  <section class="sec" id="perguntas" aria-labelledby="t-faq">
    <div class="page faq">
      <div class="lado rv"><h2 class="h2" id="t-faq">Perguntas.</h2><p class="lede">Não achou a sua? O código é aberto: abra uma issue no GitHub.</p>
        <div><a class="btn btn-glass btn-sm" href="https://github.com/mateuseap/gabarito/issues" target="_blank" rel="noopener">Falar com a gente ${I.seta}</a></div></div>
      <div class="rv" data-d="1">${[
        ['As questões são das provas reais?', 'Não. São inéditas, escritas a partir do conteúdo oficial (edital ou guia da certificação), no mesmo formato. Provas reais normalmente não são divulgadas.'],
        ['Preciso criar conta?', 'Não. É só abrir e fazer. O progresso fica salvo no navegador deste aparelho. Se você limpar os dados do navegador, o histórico some.'],
        ['O simulado da AWS é igual à prova?', 'Na proporção de domínios e no ritmo, sim: 20 questões em 28 minutos, o mesmo tempo por questão da prova de 65 em 90 minutos. A nota de 100 a 1000 é uma estimativa; a AWS usa um modelo de pontuação próprio.'],
        ['A ETE de Limoeiro está aqui?', 'Sim. A seleção das ETEs de Pernambuco é uma prova única para as 71 escolas, inclusive a ETE José Humberto de Moura Cavalcanti, em Limoeiro.'],
        ['Funciona no celular?', 'Sim. Mas a maioria dessas provas é feita no computador, então vale treinar pelo menos uma vez num computador.'],
        ['Vai ter mais provas?', 'Sim. IFPE, ENEM, AWS Solutions Architect e Azure Fundamentals estão na fila. Cada prova nova entra no mesmo formato.'],
      ].map(([p, r]) => `<details><summary>${p}${I.mais}</summary><p>${r}</p></details>`).join('')}</div>
    </div>
  </section>

  <section class="fim-cta" aria-labelledby="t-fim">
    <div class="page rv"><h2 class="h2" id="t-fim">Pare de ler.<br><span class="dim">Comece a treinar.</span></h2>
      <a class="btn btn-acc" href="#catalogo">Escolher uma prova</a><p class="small">Grátis, sem cadastro.</p></div>
    <svg class="contorno" viewBox="0 0 1000 560" aria-hidden="true"><rect x="250" y="40" width="500" height="560" rx="150"/><ellipse cx="400" cy="300" rx="62" ry="84"/><ellipse cx="600" cy="300" rx="62" ry="84"/><path d="M380 470c60 60 180 60 240 0"/></svg>
  </section>
  </main>

  <footer><div class="page cols">
    <div><a class="marca" href="#/">${I.marca}Gabarito</a><p style="margin-top:12px">Simulados inéditos. Sem vínculo com a SEE-PE, a AWS ou outras bancas.</p></div>
    <div><h4>Provas</h4>${PROVAS.map((p) => `<a href="#catalogo">${esc(p.nome)}</a>`).join('')}</div>
    <div><h4>Produto</h4><a href="#recursos">Recursos</a><a href="#como">Como funciona</a><a href="#perguntas">Perguntas</a></div>
    <div><h4>Projeto</h4><a href="https://github.com/mateuseap/gabarito" target="_blank" rel="noopener">GitHub</a><a href="https://github.com/mateuseap/gabarito/issues" target="_blank" rel="noopener">Sugerir uma prova</a><a href="https://github.com/mateuseap/gabarito/blob/main/LICENSE" target="_blank" rel="noopener">Licença MIT</a></div>
  </div></footer>`;

  ligarTopo(); ligarReveal(); ligarPainel(); ligarFeats(); ligarAbas();
  // the feature clock counts down while visible, as a preview of the real one
  let s = 3600; const t = setInterval(() => { const el = document.getElementById('gaugeT'); if (el) { s = s > 0 ? s - 1 : 3600; el.textContent = formatarTempo(s * 1000); } }, 1000);
  aoSair(() => clearInterval(t));
}

function cartaoProva(p, melhor, i) {
  const sims = simulados(p);
  return `<article class="prova-card rv" data-d="${i % 2}" data-cat="${p.categoria}" style="--cor:${p.cor}">
    <div class="cab"><span class="selo-prova">${esc(p.sigla)}</span><div><h3>${esc(p.nome)}</h3><span class="sub">${esc(p.curto)} · ${p.idioma === 'en' ? 'questões em inglês' : 'em português'}</span></div></div>
    <p>${esc(p.resumo)}</p>
    <div class="fatos"><span>${p.formato.questoes} questões</span><span>${p.formato.minutos} min</span><span>${p.formato.alternativas} alternativas</span><span>${sims.length} simulados</span></div>
    <div class="sims">${sims.map((s) => { const m = melhor(s.id); return `<a class="sim-linha" href="#/simulado/${s.id}"><span class="n">${esc(s.titulo)}</span>${m ? `<span class="m">${esc(m.resultado.nota.valor)}${esc(m.resultado.nota.max)}</span>` : ''}<span class="ir">${I.seta}</span></a>`; }).join('')}</div>
  </article>`;
}
const feat = (ico, t, p, demo) => `<li class="feat"><div class="demo">${demo}</div><div class="txt"><div class="t"><span class="ico">${ico}</span><h3>${t}</h3></div><p>${p}</p></div></li>`;

// carousel: the row glides on its own in a seamless loop (cards are cloned once),
// pauses on hover, focus or touch, and the edge arrows jump one card either way.
// With reduced motion it does not glide; the arrows still work.
function ligarFeats() {
  const row = document.getElementById('feats'); if (!row) return;
  const originais = [...row.children];
  originais.forEach((c) => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id')); row.append(k); });
  row.querySelectorAll('.feat').forEach((c) => c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--x', `${e.clientX - r.left}px`); c.style.setProperty('--y', `${e.clientY - r.top}px`); }));
  const passo = () => originais[0].getBoundingClientRect().width + 20;
  const volta = () => originais.length * passo();
  // keep the scroll inside the first copy so the loop never shows an edge
  const normalizar = () => { const v = volta(); if (row.scrollLeft >= v) row.scrollLeft -= v; else if (row.scrollLeft < 0) row.scrollLeft += v; };
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VEL = 38; // px per second, slow enough to read the card text
  let pausado = false, visivel = false, animando = false, ultimo = 0, resto = 0, raf = 0;
  const quadro = (t) => {
    raf = requestAnimationFrame(quadro);
    const dt = Math.min(64, t - (ultimo || t)); ultimo = t;
    if (pausado || !visivel || animando || reduzido) return;
    resto += (VEL * dt) / 1000;
    const px = Math.floor(resto); if (!px) return;
    resto -= px; row.scrollLeft += px; normalizar();
  };
  raf = requestAnimationFrame(quadro);
  const saltar = (dir) => {
    normalizar();
    const alvo = (Math.round(row.scrollLeft / passo()) + dir) * passo();
    if (alvo < 0) row.scrollLeft += volta();
    animando = true;
    row.scrollTo({ left: Math.max(0, alvo < 0 ? alvo + volta() : alvo), behavior: reduzido ? 'auto' : 'smooth' });
    clearTimeout(saltar.t); saltar.t = setTimeout(() => { animando = false; normalizar(); }, 650);
  };
  document.getElementById('featsPrev').onclick = () => saltar(-1);
  document.getElementById('featsNext').onclick = () => saltar(1);
  const wrap = row.parentElement;
  const pausa = (v) => () => { pausado = v; ultimo = 0; };
  wrap.addEventListener('pointerenter', pausa(true)); wrap.addEventListener('pointerleave', pausa(false));
  row.addEventListener('focusin', pausa(true)); row.addEventListener('focusout', pausa(false));
  row.addEventListener('touchstart', pausa(true), { passive: true });
  row.addEventListener('touchend', () => setTimeout(pausa(false), 2500), { passive: true });
  row.addEventListener('scroll', () => { if (!animando) normalizar(); }, { passive: true });
  row.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') saltar(1); if (e.key === 'ArrowLeft') saltar(-1); });
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }, { threshold: .2 });
  io.observe(row);
  // drag with the mouse
  let x0 = 0, s0 = 0, arrastando = false;
  row.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; arrastando = true; x0 = e.clientX; s0 = row.scrollLeft; });
  const mover = (e) => { if (!arrastando) return; if (Math.abs(e.clientX - x0) > 4) row.classList.add('arrastando'); row.scrollLeft = s0 - (e.clientX - x0); normalizar(); };
  const soltar = () => { if (!arrastando) return; arrastando = false; row.classList.remove('arrastando'); };
  addEventListener('pointermove', mover); addEventListener('pointerup', soltar);
  aoSair(() => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('pointermove', mover); removeEventListener('pointerup', soltar); });
}
function ligarAbas() {
  document.querySelectorAll('.abas button').forEach((b) => b.onclick = () => {
    document.querySelectorAll('.abas button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    document.querySelectorAll('.provas [data-cat], .breve [data-cat]').forEach((el) => { el.hidden = b.dataset.cat !== 'todas' && el.dataset.cat !== b.dataset.cat; });
  });
}

// ---------------- exam ----------------
function telaSimulado(simuladoId) {
  const prova = provaDoSimulado(simuladoId), sim = prova && simulados(prova).find((s) => s.id === simuladoId);
  if (!sim) { location.hash = '#/'; return; }
  let t = ler().emAndamento;
  if (!t || t.simuladoId !== sim.id) {
    const outro = t && provaDoSimulado(t.simuladoId);
    app.innerHTML = `<div class="page-light"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><div>
      <span class="eyebrow">${esc(prova.nome)}</span><h3 id="mt">${esc(sim.titulo)}</h3>
      <p>${prova.formato.questoes} questões, ${prova.formato.minutos} minutos. O cronômetro começa quando você clicar em começar e não pausa. No fim do tempo, a prova é entregue sozinha.${prova.idioma === 'en' ? ' As questões são em inglês, como na prova real.' : ''}</p>
      ${outro ? `<p class="small">Você tem outro simulado em andamento (${esc(outro.nome)}). Começar este descarta aquele.</p>` : ''}
      <div class="acoes"><a class="btn btn-glass btn-sm" href="#/">Voltar</a><button class="btn btn-acc btn-sm" id="comecar">Começar agora</button></div></div></div>`;
    document.getElementById('comecar').onclick = () => { const d = ler(); d.emAndamento = montarTentativa(sim, (Math.random() * 2 ** 31) | 0); gravar(d); telaSimulado(simuladoId); };
    document.getElementById('comecar').focus();
    return;
  }
  let atual = t.atual || 0;
  const fimEm = t.inicio + prova.formato.minutos * 60000;
  const salvar = () => { const d = ler(); d.emAndamento = { ...t, atual }; gravar(d); };
  const blocos = prova.disciplinas.map((d) => { const idx = t.questoes.map((q, i) => (q.disciplina === d.id ? i + 1 : 0)).filter(Boolean); return `${idx[0]}–${idx[idx.length - 1]}: ${d.curto}`; }).join(' · ');

  function render() {
    const q = t.questoes[atual], disc = prova.disciplinas.find((d) => d.id === q.disciplina);
    const resp = Object.keys(t.respostas).length;
    app.innerHTML = `<div class="page-light"></div><div class="prova">
      <div><div class="prova-top">
        <a class="marca" href="#/" aria-label="Sair para o início">${I.marca}</a>
        <div class="t"><b>${esc(prova.curto)} · ${esc(sim.titulo)}</b><span>${resp} de ${t.questoes.length} respondidas</span></div>
        <span class="timer" id="timer" role="timer" aria-label="Tempo restante">${I.relogio}<span>--:--</span></span>
        <button class="btn btn-acc btn-sm" id="entregar">Entregar</button></div>
        <div class="progresso"><i style="width:${(resp / t.questoes.length) * 100}%"></i></div></div>
      <div class="prova-corpo">
        <div class="questao">
          <span class="disc">${esc(disc.nome)} <span>· questão ${atual + 1} de ${t.questoes.length}</span></span>
          ${q.texto ? `<div class="texto-base"><h4>${esc(q.texto.titulo)}</h4><p>${esc(q.texto.corpo)}</p></div>` : ''}
          <p class="enunciado">${esc(q.enunciado)}</p>
          <div class="alts" role="radiogroup" aria-label="Alternativas">
            ${q.alternativas.map((a, i) => `<button class="alt" role="radio" aria-checked="${t.respostas[atual] === a}" data-a="${esc(a)}"><span class="l">${LETRAS[i]}</span><span>${esc(a)}</span></button>`).join('')}
          </div>
        </div>
        <nav class="mapa" aria-label="Questões"><h5>Questões</h5>
          <div class="grade">${t.questoes.map((x, i) => `<button class="${t.respostas[i] !== undefined ? 'feita' : ''} ${i === atual ? 'atual' : ''}" data-i="${i}" aria-label="Questão ${i + 1}${t.respostas[i] !== undefined ? ', respondida' : ''}">${i + 1}</button>`).join('')}</div>
          <span class="legenda">${esc(blocos)}</span></nav>
      </div>
      <div class="prova-pe"><button class="btn btn-glass btn-sm" id="ant" ${atual === 0 ? 'disabled' : ''}>← Anterior</button><span class="small">Teclas: setas para navegar, ${LETRAS.slice(0, prova.formato.alternativas).split('').join(', ')} para marcar</span><button class="btn btn-glass btn-sm" id="prox" ${atual === t.questoes.length - 1 ? 'disabled' : ''}>Próxima →</button></div>
    </div>`;
    app.querySelectorAll('.alt').forEach((b) => b.onclick = () => marcar(b.dataset.a));
    app.querySelectorAll('.grade button').forEach((b) => b.onclick = () => ir(+b.dataset.i));
    document.getElementById('ant').onclick = () => ir(atual - 1);
    document.getElementById('prox').onclick = () => ir(atual + 1);
    document.getElementById('entregar').onclick = confirmar;
    tick();
  }
  // selecting only touches what changed: re-rendering would replay the entry animation and reset the text scroll
  const marcar = (a) => {
    t.respostas[atual] = a; salvar();
    app.querySelectorAll('.alt').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.a === a)));
    app.querySelector(`.grade button[data-i="${atual}"]`)?.classList.add('feita');
    const n = Object.keys(t.respostas).length;
    app.querySelector('.prova-top .t span').textContent = `${n} de ${t.questoes.length} respondidas`;
    app.querySelector('.progresso i').style.width = `${(n / t.questoes.length) * 100}%`;
  };
  const ir = (i) => { atual = Math.max(0, Math.min(t.questoes.length - 1, i)); salvar(); render(); scrollTo({ top: 0 }); };
  const teclas = (e) => {
    if (document.querySelector('.modal') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') ir(atual + 1);
    else if (e.key === 'ArrowLeft') ir(atual - 1);
    else { const k = LETRAS.indexOf(e.key.toUpperCase()); const q = t.questoes[atual]; if (k >= 0 && k < q.alternativas.length) marcar(q.alternativas[k]); }
  };
  addEventListener('keydown', teclas); aoSair(() => removeEventListener('keydown', teclas));
  function tick() {
    const resta = fimEm - Date.now(), el = document.getElementById('timer');
    if (resta <= 0) return entregar(true);
    if (el) { el.lastElementChild.textContent = formatarTempo(resta); el.classList.toggle('alerta', resta < 5 * 60000); }
  }
  function confirmar() {
    const falta = t.questoes.length - Object.keys(t.respostas).length;
    const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div><h3>Entregar a prova?</h3><p>${falta ? `Você tem ${falta} ${falta === 1 ? 'questão' : 'questões'} sem resposta. Em branco vale zero.` : 'Todas as questões estão respondidas.'}</p><div class="acoes"><button class="btn btn-glass btn-sm" id="nao">Continuar</button><button class="btn btn-acc btn-sm" id="sim">Entregar</button></div></div>`;
    document.body.append(m);
    m.querySelector('#nao').onclick = () => m.remove();
    m.querySelector('#sim').onclick = () => { m.remove(); entregar(false); };
    m.querySelector('#sim').focus();
  }
  function entregar(acabouTempo) {
    const d = ler(), resultado = corrigir(prova, t);
    const feito = { id: Date.now().toString(36), simuladoId: sim.id, fim: Date.now(), duracao: Math.min(Date.now(), fimEm) - t.inicio, acabouTempo, semente: t.semente, respostas: t.respostas, resultado };
    d.tentativas.push(feito); d.emAndamento = null; gravar(d);
    location.hash = `#/resultado/${feito.id}`;
  }
  const iv = setInterval(tick, 1000); aoSair(() => clearInterval(iv));
  render();
}

// ---------------- result and review ----------------
function telaResultado(id, revisao) {
  const { tentativas } = ler(), feito = tentativas.find((x) => x.id === id);
  const prova = feito && provaDoSimulado(feito.simuladoId), sim = prova && simulados(prova).find((s) => s.id === feito.simuladoId);
  if (!sim) { location.hash = '#/'; return; }
  const t = { ...montarTentativa(sim, feito.semente), respostas: feito.respostas };
  const r = corrigir(prova, t);
  if (revisao) return telaRevisao(prova, sim, t, feito, r);
  const anteriores = tentativas.filter((x) => x.simuladoId === feito.simuladoId && x.fim < feito.fim);
  const antes = anteriores.length ? anteriores[anteriores.length - 1] : null;
  const prox = simulados(prova)[sim.numero];
  app.innerHTML = `<div class="page-light"></div>
  ${cabecalho('<a class="btn btn-glass btn-sm" href="#/">Início</a>', false)}
  <main class="resultado">
    <div class="nota rv"><span class="eyebrow">${esc(prova.nome)} · ${esc(sim.titulo)}${feito.acabouTempo ? ' · o tempo acabou' : ''}</span>
      <div class="v">${esc(r.nota.valor)}<small>${esc(r.nota.max)}</small></div>
      <span class="selo ${r.avaliacao.status}">${esc(r.avaliacao.texto)}</span>
      ${antes ? `<p class="small" style="margin-top:12px">Na tentativa anterior: ${esc(antes.resultado.nota.valor)}${esc(antes.resultado.nota.max)}</p>` : ''}</div>
    <div class="res-grid">
      ${r.porDisciplina.map((d, i) => `<div class="card rv" data-d="${i % 3}"><div class="k">${esc(d.nome)}</div><div class="v big">${d.acertos}<small style="font-size:18px;color:var(--muted)"> /${d.total}</small></div><div class="barras"><div class="t"><i style="--w:${(d.acertos / d.total) * 100}%"></i></div></div></div>`).join('')}
      <div class="card rv"><div class="k">Tempo usado</div><div class="v big">${formatarTempo(feito.duracao)}</div><div class="small">${formatarTempo(feito.duracao / t.questoes.length)} por questão, em média</div></div>
      <div class="card rv"><div class="k">Acertos</div><div class="v big">${r.acertos}<small style="font-size:18px;color:var(--muted)"> /${r.total}</small></div><div class="small">${esc(prova.dicaResultado)}</div></div>
    </div>
    <div class="card revisar rv"><div class="k">${r.revisar.length ? 'O que revisar' : 'Nenhum assunto para revisar neste simulado'}</div>
      <ul>${r.revisar.map((x) => `<li>${esc(x.topico)} <span>${x.certas}/${x.total} · ${esc(prova.disciplinas.find((d) => d.id === x.disciplina).curto)}</span></li>`).join('')}</ul></div>
    <div class="res-acoes"><a class="btn btn-acc" href="#/revisao/${feito.id}">Ver a correção</a><a class="btn btn-glass" href="#/simulado/${sim.id}">Refazer</a>${prox ? `<a class="btn btn-glass" href="#/simulado/${prox.id}">Próximo simulado</a>` : ''}</div>
  </main>`;
  ligarTopo(); ligarReveal();
}

function telaRevisao(prova, sim, t, feito, r) {
  let atual = 0;
  function render() {
    const q = t.questoes[atual], disc = prova.disciplinas.find((d) => d.id === q.disciplina), resp = t.respostas[atual];
    app.innerHTML = `<div class="page-light"></div><div class="prova">
      <div class="prova-top"><a class="marca" href="#/" aria-label="Início">${I.marca}</a>
        <div class="t"><b>Correção · ${esc(sim.titulo)}</b><span>${esc(r.nota.valor)}${esc(r.nota.max)} · ${r.acertos} de ${r.total} certas</span></div>
        <a class="btn btn-glass btn-sm" href="#/resultado/${feito.id}">Resumo</a></div>
      <div class="prova-corpo">
        <div class="questao">
          <span class="disc">${esc(disc.nome)} <span>· questão ${atual + 1} · ${esc(q.topico)}</span></span>
          ${q.texto ? `<div class="texto-base"><h4>${esc(q.texto.titulo)}</h4><p>${esc(q.texto.corpo)}</p></div>` : ''}
          <p class="enunciado">${esc(q.enunciado)}</p>
          <div class="alts">${q.alternativas.map((a, i) => `<div class="alt ${a === q.certa ? 'certa' : a === resp ? 'errada' : ''}"><span class="l">${LETRAS[i]}</span><span>${esc(a)}${a === resp && a !== q.certa ? ' <span class="small">(sua resposta)</span>' : ''}</span></div>`).join('')}</div>
          ${resp === undefined ? '<p class="small">Você deixou esta questão em branco.</p>' : ''}
          <p class="explica">${I.luz}<span>${esc(q.explicacao)}</span></p>
        </div>
        <nav class="mapa" aria-label="Questões"><h5>Questões</h5>
          <div class="grade">${t.questoes.map((x, i) => `<button class="${t.respostas[i] === x.certa ? 'certa' : 'errada'} ${i === atual ? 'atual' : ''}" data-i="${i}" aria-label="Questão ${i + 1}, ${t.respostas[i] === x.certa ? 'certa' : 'errada'}">${i + 1}</button>`).join('')}</div></nav>
      </div>
      <div class="prova-pe"><button class="btn btn-glass btn-sm" id="ant" ${atual === 0 ? 'disabled' : ''}>← Anterior</button><span></span><button class="btn btn-glass btn-sm" id="prox" ${atual === t.questoes.length - 1 ? 'disabled' : ''}>Próxima →</button></div>
    </div>`;
    app.querySelectorAll('.grade button').forEach((b) => b.onclick = () => { atual = +b.dataset.i; render(); });
    document.getElementById('ant').onclick = () => { atual--; render(); };
    document.getElementById('prox').onclick = () => { atual++; render(); };
  }
  render();
}

// ---------------- router ----------------
function rota() {
  limpar.forEach((f) => f()); limpar = [];
  document.querySelectorAll('.modal').forEach((m) => m.remove());
  const h = location.hash;
  let m;
  if ((m = h.match(/^#\/simulado\/([\w-]+)$/))) telaSimulado(m[1]);
  else if ((m = h.match(/^#\/resultado\/(\w+)$/))) telaResultado(m[1], false);
  else if ((m = h.match(/^#\/revisao\/(\w+)$/))) telaResultado(m[1], true);
  else {
    if (!document.getElementById('inicio')) landing();
    const ancora = h.startsWith('#') && !h.startsWith('#/') ? document.getElementById(h.slice(1)) : null;
    if (ancora) ancora.scrollIntoView(); else if (h.startsWith('#/')) scrollTo(0, 0);
    return;
  }
  scrollTo(0, 0);
}
addEventListener('hashchange', rota);
rota();
