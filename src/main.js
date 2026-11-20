import './styles/app.css';
import { PROVAS, simulados } from './data/catalogo.js';
import { corrigir, formatarTempo, montarTentativa } from './motor.js';

// Progress lives in the student's browser only: no account, no server.
const CHAVE = 'gabarito:v1';
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || { tentativas: [], emAndamento: null }; } catch { return { tentativas: [], emAndamento: null }; } };
const gravar = (d) => { try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch { /* private mode: the attempt still works, it just is not saved */ } };

const app = document.getElementById('app');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LETRAS = 'ABCDE';
let tique = null;

const ICONE = {
  marca: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#a8e05f"/><path d="M18 33l9 9 19-20" fill="none" stroke="#101508" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  alvo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".5" fill="currentColor"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/></svg>',
  livro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5"/></svg>',
};

// ---------------- landing ----------------
function estatisticas() {
  const { tentativas } = ler();
  if (!tentativas.length) return null;
  const notas = tentativas.map((t) => t.resultado.total);
  const dias = new Set(tentativas.map((t) => new Date(t.fim).toDateString()));
  return { feitos: tentativas.length, melhor: Math.max(...notas), media: notas.reduce((a, b) => a + b, 0) / notas.length, notas, dias };
}

function painelDemo() {
  const st = estatisticas();
  const notas = st ? st.notas.slice(-12) : [8, 10, 9, 12, 11, 13, 12, 15, 14, 16, 15, 17];
  const max = 20, w = 600, h = 150;
  const pts = notas.map((n, i) => [notas.length === 1 ? w / 2 : (i * w) / (notas.length - 1), h - 12 - (n / max) * (h - 30)]);
  const linha = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${linha} L${w} ${h} L0 ${h} Z`;
  const dias = st ? st.dias : null;
  const calor = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(Date.now() - (89 - i) * 864e5).toDateString();
    const n = dias ? (dias.has(d) ? 4 : 0) : [0, 0, 1, 0, 2, 0, 1, 3, 0, 2, 4, 1, 0, 3, 2][(i * 7) % 15];
    return `<b data-n="${n}"></b>`;
  }).join('');
  const k = (rotulo, valor, extra = '') => `<div class="card"><div class="k">${rotulo}</div><div class="v">${valor}${extra}</div></div>`;
  return `
  <div class="janela" aria-label="${st ? 'Seu progresso' : 'Exemplo do painel de progresso'}">
    <div class="barra"><i></i><i></i><i></i></div>
    <div class="painel">
      <aside>
        <div class="item on">${ICONE.stats} Progresso</div>
        <div class="item">${ICONE.hist} Histórico</div>
        <div class="item">${ICONE.livro} Conteúdo</div>
      </aside>
      <main>
        <div class="card full"><div class="k">${st ? 'Suas notas nos simulados' : 'Nota nos simulados (exemplo)'}</div>
          <div class="v">${st ? st.melhor : 17}<small style="font-size:18px;color:var(--muted)"> /20</small>${st ? '' : '<span class="delta">↑ 9 pontos</span>'}</div>
          <svg class="grafico" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#a8e05f" stop-opacity=".35"/><stop offset="1" stop-color="#a8e05f" stop-opacity="0"/></linearGradient></defs><path d="${area}" fill="url(#g)"/><path d="${linha}" fill="none" stroke="#a8e05f" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>
        </div>
        ${k('Simulados feitos', st ? st.feitos : 12)}
        ${k('Média', st ? st.media.toFixed(1).replace('.', ',') : '13,1')}
        ${k('Tempo por questão', st ? '' : '2:40', st ? '<span style="font-size:15px;color:var(--muted)">veja no resultado</span>' : '')}
        <div class="card full"><div class="k">Dias de estudo</div><div class="calor">${calor}</div></div>
      </main>
    </div>
  </div>`;
}

function landing() {
  const prova = PROVAS[0], lista = simulados(prova), { tentativas, emAndamento } = ler();
  const melhor = (id) => { const ts = tentativas.filter((t) => t.simuladoId === id); return ts.length ? Math.max(...ts.map((t) => t.resultado.total)) : null; };
  const topicos = Object.fromEntries(prova.disciplinas.map((d) => [d.id, [...new Set(d.questoes.flat().map((q) => q.topico))]]));
  const pt = topicos.pt, mat = topicos.mat;
  app.innerHTML = `
  <nav class="nav" aria-label="Principal">
    <a class="marca" href="#/">${ICONE.marca} Gabarito</a>
    <div class="links"><a href="#simulados">Simulados</a><a href="#prova">A prova</a><a href="#recursos">Recursos</a><a href="#perguntas">Perguntas</a></div>
    <a class="btn btn-acc" href="#/simulado/${lista[0].id}">Começar</a>
  </nav>

  <header class="wrap hero">
    <span class="tag">Simulados para a seleção das Escolas Técnicas de Pernambuco</span>
    <h1 class="h-display">Você treina.<br><span class="dim">A ETE fica fácil.</span></h1>
    <p class="lead">Simulados no formato exato da prova da ETE: 20 questões, 60 minutos, Português e Matemática. Correção na hora, com a explicação de cada questão.</p>
    <div class="acoes">
      <a class="btn btn-acc btn-lg" href="#/simulado/${(emAndamento && lista.find((s) => s.id === emAndamento.simuladoId)?.id) || lista[0].id}">${emAndamento ? 'Continuar simulado' : 'Fazer o Simulado 1'}</a>
      <a class="btn btn-ghost btn-lg" href="#prova">Como é a prova</a>
    </div>
    <p class="micro">Grátis, sem cadastro. Seu progresso fica salvo só neste aparelho.</p>
    ${contagem()}
  </header>

  <div class="wrap">${painelDemo()}</div>

  <section class="sec" aria-label="Conteúdos">
    <div class="wrap" style="text-align:center;margin-bottom:22px"><span class="micro">Todo o conteúdo do edital 2027, nos dois componentes</span></div>
    <div class="marquee"><div class="trilho">${[...pt, ...mat, ...pt, ...mat].map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>
  </section>

  <section class="sec" id="simulados">
    <div class="wrap">
      <div class="sec-head"><span class="eyebrow">Simulados</span><h2 class="h-sec">Uma prova inteira, <span class="dim">quantas vezes quiser.</span></h2>
        <p class="lead">Cada simulado tem 20 questões inéditas, na mesma divisão e no mesmo tempo da prova real. As alternativas mudam de ordem a cada tentativa.</p></div>
      <div class="lista">
        ${lista.map((s) => { const m = melhor(s.id); return `
        <article class="sim">
          <span class="n">${esc(prova.curto)} · ${s.questoes.length} questões</span>
          <h3>${esc(s.titulo)}</h3>
          <div class="meta"><span>${prova.formato.minutos} min</span><span>10 Português</span><span>10 Matemática</span></div>
          <span class="melhor">${m === null ? '' : `Sua melhor nota: ${m}/20`}</span>
          <a class="btn ${m === null ? 'btn-acc' : 'btn-ghost'}" href="#/simulado/${s.id}">${m === null ? 'Começar' : 'Refazer'}</a>
        </article>`; }).join('')}
        <article class="sim breve"><span class="n">Em breve</span><h3>Mais provas</h3><p>IFPE, colégios de aplicação e outras seleções entram aqui, no mesmo formato.</p></article>
      </div>
    </div>
  </section>

  <section class="sec" id="recursos">
    <div class="wrap">
      <div class="sec-head"><span class="eyebrow">Recursos</span><h2 class="h-sec">Feito para treinar <span class="dim">do jeito que cai.</span></h2></div>
      <div class="feats">
        <article class="feat"><div class="demo"><div class="relogio-demo" id="relogioDemo">60:00<small>tempo de prova</small></div></div>
          <div class="txt"><span class="ico">${ICONE.relogio}</span><h3>Cronômetro real</h3><p>60 minutos, como no dia. Quando o tempo acaba, a prova fecha sozinha, igual ao sistema da SEE.</p></div></article>
        <article class="feat"><div class="demo"><div class="alts-demo"><div class="no"><b>A</b> 2/8</div><div class="ok"><b>B</b> 3/8 ✓</div><div><b>C</b> 5/8</div></div></div>
          <div class="txt"><span class="ico">${ICONE.check}</span><h3>Correção explicada</h3><p>No fim, cada questão mostra a resposta certa e o porquê, em uma ou duas linhas. Errar vira aula.</p></div></article>
        <article class="feat"><div class="demo"><div class="barras-demo">
            <div><div class="l"><span>Porcentagem</span><span>3/3</span></div><div class="t"><i style="width:100%"></i></div></div>
            <div><div class="l"><span>Concordância</span><span>1/2</span></div><div class="t"><i style="width:50%"></i></div></div>
            <div><div class="l"><span>Triângulos</span><span>0/1</span></div><div class="t"><i style="width:6%"></i></div></div></div></div>
          <div class="txt"><span class="ico">${ICONE.alvo}</span><h3>O que revisar</h3><p>O resultado separa os assuntos do edital em que você errou, para você saber exatamente o que estudar.</p></div></article>
      </div>
    </div>
  </section>

  <section class="sec" id="prova">
    <div class="wrap">
      <div class="sec-head"><span class="eyebrow">A prova</span><h2 class="h-sec">Como é a seleção <span class="dim">da ETE 2027.</span></h2>
        <p class="lead">${esc(prova.descricao)}</p></div>
      <div class="regras">
        <ol>${prova.regras.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
        <div class="conteudo">
          <div class="card"><h3>Língua Portuguesa</h3><div class="chips">${['Interpretação de textos', 'Ideias principais e secundárias', 'Coesão e coerência', 'Intertextualidade', 'Gêneros e sequências textuais', 'Sinonímia, antonímia, polissemia', 'Conotação e denotação', 'Figuras de linguagem', 'Norma padrão e variedades', 'Formação de palavras', 'Classes gramaticais', 'Coordenação e subordinação', 'Pontuação', 'Concordância e regência'].map((c) => `<span>${c}</span>`).join('')}</div></div>
          <div class="card"><h3>Matemática</h3><div class="chips">${['Quatro operações', 'Frações e decimais', 'Potenciação e radiciação', 'Expressões numéricas', 'Sistemas de medidas', 'Razão e proporção', 'Divisão proporcional', 'Regra de três', 'Porcentagem', 'Médias', 'Polinômios', 'Produtos notáveis e fatoração', 'Equações do 1º grau', 'Sistemas lineares', 'Ângulos e polígonos', 'Triângulos e semelhança'].map((c) => `<span>${c}</span>`).join('')}</div></div>
          <p class="micro">Fonte: <a href="${prova.fonte.url}" target="_blank" rel="noopener">${esc(prova.fonte.nome)}</a>, itens 4 e 12.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="perguntas">
    <div class="wrap faq">
      <div><span class="eyebrow">Perguntas</span><h2 class="h-sec">Dúvidas.</h2></div>
      <div>
        ${[
          ['As questões são da prova real?', 'Não. São questões inéditas, escritas no mesmo formato e sobre os mesmos assuntos do edital 2027. A prova real não é divulgada.'],
          ['Preciso criar conta?', 'Não. É só abrir e fazer. Suas notas ficam salvas no navegador deste aparelho; se limpar os dados do navegador, o histórico some.'],
          ['Funciona no celular?', 'Sim. Mas a prova da ETE é feita no computador, então vale treinar pelo menos uma vez num computador, para pegar o ritmo.'],
          ['Quanto preciso tirar?', 'Para não ser eliminado, pelo menos 4 pontos no total e pelo menos 1 acerto em cada disciplina. Para passar, depende da concorrência do curso e da escola.'],
          ['A ETE de Limoeiro tem quais cursos?', 'A ETE José Humberto de Moura Cavalcanti, em Limoeiro, oferece Desenvolvimento de Sistemas e Nutrição e Dietética, com 90 vagas cada no edital 2027.'],
          ['Vai ter mais simulados?', 'Sim. O Gabarito foi feito para crescer: novos simulados e outras provas de seleção entram aqui no mesmo formato.'],
        ].map(([p, r]) => `<details><summary>${p}</summary><p>${r}</p></details>`).join('')}
      </div>
    </div>
  </section>

  <section class="wrap cta-final">
    <h2 class="h-display">Pare de ler.<br><span class="dim">Comece a treinar.</span></h2>
    <a class="btn btn-acc btn-lg" href="#/simulado/${lista[0].id}">Fazer o Simulado 1</a>
  </section>

  <footer><div class="wrap"><span>Gabarito. Questões inéditas, sem vínculo com a SEE-PE.</span><span><a href="https://github.com/mateuseap/gabarito" target="_blank" rel="noopener">Código no GitHub</a></span></div></footer>`;

  // the feature card clock ticks down, as a preview of the real one
  let s = 3600;
  tique = setInterval(() => { const el = document.getElementById('relogioDemo'); if (!el) return; s = s > 0 ? s - 1 : 3600; el.firstChild.nodeValue = formatarTempo(s * 1000); }, 1000);
}

function contagem() {
  // the edital window: 17 to 27 Nov 2026, Recife time
  const fim = new Date('2026-11-27T23:59:00-03:00').getTime(), ini = new Date('2026-11-17T00:00:00-03:00').getTime(), agora = Date.now();
  if (agora > fim) return '';
  const txt = agora >= ini ? `Provas acontecendo agora: até 27 de novembro` : `Provas de 17 a 27 de novembro`;
  return `<div><span class="contagem"><i></i>${txt}</span></div>`;
}

// ---------------- exam ----------------
function telaSimulado(simuladoId) {
  const prova = PROVAS.find((p) => simuladoId.startsWith(p.id)), sim = prova && simulados(prova).find((s) => s.id === simuladoId);
  if (!sim) { location.hash = '#/'; return; }
  const dados = ler();
  let t = dados.emAndamento && dados.emAndamento.simuladoId === sim.id ? dados.emAndamento : null;
  if (!t) {
    app.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><div>
      <h3 id="mt">${esc(sim.titulo)}</h3>
      <p>${prova.formato.questoes} questões, ${prova.formato.minutos} minutos. O cronômetro começa quando você clicar em começar e não pausa. No fim do tempo, a prova fecha sozinha.</p>
      <div class="acoes"><a class="btn btn-ghost" href="#/">Voltar</a><button class="btn btn-acc" id="comecar">Começar agora</button></div>
    </div></div>`;
    document.getElementById('comecar').onclick = () => { const d = ler(); d.emAndamento = montarTentativa(sim, (Math.random() * 2 ** 31) | 0); gravar(d); telaSimulado(simuladoId); };
    document.getElementById('comecar').focus();
    return;
  }
  let atual = t.atual || 0;
  const fimEm = t.inicio + prova.formato.minutos * 60000;
  const salvar = () => { const d = ler(); d.emAndamento = { ...t, atual }; gravar(d); };

  function render() {
    const q = t.questoes[atual], disc = prova.disciplinas.find((d) => d.id === q.disciplina), noDisc = t.questoes.slice(0, atual + 1).filter((x) => x.disciplina === q.disciplina).length;
    const respondidas = Object.keys(t.respostas).length;
    app.innerHTML = `
    <div class="prova">
      <div class="prova-top">
        <a class="marca" href="#/" aria-label="Sair para o início">${ICONE.marca}</a>
        <div class="t"><b>${esc(sim.titulo)}</b><span>${respondidas} de ${t.questoes.length} respondidas</span></div>
        <span class="timer" id="timer" role="timer" aria-label="Tempo restante">--:--</span>
        <button class="btn btn-acc" id="entregar">Entregar</button>
      </div>
      <div class="prova-corpo">
        <div class="questao">
          <span class="disc">${esc(disc.nome)} <span>· questão ${atual + 1} de ${t.questoes.length} · ${noDisc}ª de ${disc.nome.split(' ').pop()}</span></span>
          ${q.texto ? `<div class="texto-base"><h4>${esc(q.texto.titulo)}</h4><p>${esc(q.texto.corpo)}</p></div>` : ''}
          <p class="enunciado">${esc(q.enunciado)}</p>
          <div class="alts" role="radiogroup" aria-label="Alternativas">
            ${q.alternativas.map((a, i) => `<button class="alt" role="radio" aria-checked="${t.respostas[atual] === a}" data-a="${esc(a)}"><span class="l">${LETRAS[i]}</span><span>${esc(a)}</span></button>`).join('')}
          </div>
        </div>
        <nav class="mapa" aria-label="Questões">
          <h5>Questões</h5>
          <div class="grade">${t.questoes.map((x, i) => `<button class="${t.respostas[i] !== undefined ? 'feita' : ''} ${i === atual ? 'atual' : ''}" data-i="${i}" aria-label="Questão ${i + 1}${t.respostas[i] !== undefined ? ', respondida' : ''}">${i + 1}</button>`).join('')}</div>
          <span class="micro">1 a 10: Português · 11 a 20: Matemática</span>
        </nav>
      </div>
      <div class="prova-pe">
        <button class="btn btn-ghost" id="ant" ${atual === 0 ? 'disabled' : ''}>← Anterior</button>
        <button class="btn btn-ghost" id="prox" ${atual === t.questoes.length - 1 ? 'disabled' : ''}>Próxima →</button>
      </div>
    </div>`;
    app.querySelectorAll('.alt').forEach((b) => b.onclick = () => { t.respostas[atual] = b.dataset.a; salvar(); render(); });
    app.querySelectorAll('.grade button').forEach((b) => b.onclick = () => { atual = +b.dataset.i; salvar(); render(); });
    document.getElementById('ant').onclick = () => { atual--; salvar(); render(); };
    document.getElementById('prox').onclick = () => { atual++; salvar(); render(); };
    document.getElementById('entregar').onclick = confirmar;
    atualizarTimer();
  }
  function atualizarTimer() {
    const resta = fimEm - Date.now(), el = document.getElementById('timer');
    if (resta <= 0) return entregar(true);
    if (el) { el.textContent = formatarTempo(resta); el.classList.toggle('alerta', resta < 5 * 60000); }
  }
  function confirmar() {
    const falta = t.questoes.length - Object.keys(t.respostas).length;
    const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div><h3>Entregar a prova?</h3><p>${falta ? `Você ainda tem ${falta} ${falta === 1 ? 'questão' : 'questões'} sem resposta. Na prova real, questão em branco vale zero.` : 'Todas as questões estão respondidas.'}</p><div class="acoes"><button class="btn btn-ghost" id="nao">Continuar</button><button class="btn btn-acc" id="sim">Entregar</button></div></div>`;
    document.body.append(m);
    m.querySelector('#nao').onclick = () => m.remove();
    m.querySelector('#sim').onclick = () => { m.remove(); entregar(false); };
    m.querySelector('#sim').focus();
  }
  function entregar(acabouTempo) {
    clearInterval(tique);
    const d = ler(), resultado = corrigir(prova, t);
    const feito = { id: `${Date.now().toString(36)}`, simuladoId: sim.id, fim: Date.now(), duracao: Math.min(Date.now(), fimEm) - t.inicio, acabouTempo, semente: t.semente, respostas: t.respostas, resultado };
    d.tentativas.push(feito); d.emAndamento = null; gravar(d);
    location.hash = `#/resultado/${feito.id}`;
  }
  tique = setInterval(atualizarTimer, 1000);
  render();
}

// ---------------- result and review ----------------
function telaResultado(id, revisao) {
  const { tentativas } = ler(), feito = tentativas.find((x) => x.id === id);
  if (!feito) { location.hash = '#/'; return; }
  const prova = PROVAS.find((p) => feito.simuladoId.startsWith(p.id)), sim = simulados(prova).find((s) => s.id === feito.simuladoId);
  const t = { ...montarTentativa(sim, feito.semente), respostas: feito.respostas }, r = feito.resultado;
  if (revisao) return telaRevisao(prova, sim, t, feito);
  const anteriores = tentativas.filter((x) => x.simuladoId === feito.simuladoId && x.id !== feito.id);
  const antes = anteriores.length ? anteriores[anteriores.length - 1].resultado.total : null;
  const porMin = feito.duracao / t.questoes.length;
  app.innerHTML = `
  <nav class="nav" aria-label="Principal"><a class="marca" href="#/">${ICONE.marca} Gabarito</a><div class="links"></div><a class="btn btn-ghost" href="#/">Início</a></nav>
  <main class="resultado">
    <div class="nota">
      <span class="eyebrow">${esc(sim.titulo)}${feito.acabouTempo ? ' · o tempo acabou' : ''}</span>
      <div class="v">${r.total}<small>/${r.maximo}</small></div>
      <span class="selo ${r.eliminado ? 'mal' : ''}">${r.eliminado ? 'Na prova real, essa nota eliminaria' : r.total >= 15 ? 'Ótimo resultado' : r.total >= 10 ? 'Passou da linha de corte do edital' : 'Não eliminado, mas dá para subir'}</span>
      ${antes !== null ? `<p class="micro" style="margin-top:10px">Na tentativa anterior deste simulado: ${antes}/20 (${r.total - antes >= 0 ? '+' : ''}${r.total - antes})</p>` : ''}
    </div>
    <div class="res-grid">
      ${r.porDisciplina.map((d) => `<div class="card"><div class="k">${esc(d.nome)}</div><div class="v">${d.acertos}<small style="font-size:18px;color:var(--muted)"> /${d.total}</small></div><div class="barras-demo" style="margin-top:10px"><div class="t"><i style="width:${(d.acertos / d.total) * 100}%"></i></div></div></div>`).join('')}
      <div class="card"><div class="k">Tempo usado</div><div class="v">${formatarTempo(feito.duracao)}</div><div class="micro">${formatarTempo(porMin)} por questão, em média</div></div>
      <div class="card"><div class="k">Desempate</div><div class="v" style="font-size:22px;margin-top:6px">Português conta mais</div><div class="micro">No empate, ganha a maior nota de Português.</div></div>
    </div>
    <div class="card revisar">
      <div class="k" style="margin-bottom:6px">${r.revisar.length ? 'O que revisar' : 'Nenhum assunto para revisar neste simulado'}</div>
      <ul>${r.revisar.map((x) => `<li>${esc(x.topico)} <span>${x.certas}/${x.total} · ${x.disciplina === 'pt' ? 'Português' : 'Matemática'}</span></li>`).join('')}</ul>
    </div>
    <div class="res-acoes">
      <a class="btn btn-acc" href="#/revisao/${feito.id}">Ver correção questão por questão</a>
      <a class="btn btn-ghost" href="#/simulado/${sim.id}">Refazer</a>
      ${simulados(prova).find((s) => s.numero === sim.numero + 1) ? `<a class="btn btn-ghost" href="#/simulado/${simulados(prova)[sim.numero].id}">Próximo simulado</a>` : ''}
    </div>
  </main>`;
}

function telaRevisao(prova, sim, t, feito) {
  let atual = 0;
  function render() {
    const q = t.questoes[atual], disc = prova.disciplinas.find((d) => d.id === q.disciplina), resp = t.respostas[atual];
    app.innerHTML = `
    <div class="prova">
      <div class="prova-top">
        <a class="marca" href="#/" aria-label="Início">${ICONE.marca}</a>
        <div class="t"><b>Correção · ${esc(sim.titulo)}</b><span>${feito.resultado.total}/20</span></div>
        <a class="btn btn-ghost" href="#/resultado/${feito.id}">Resumo</a>
      </div>
      <div class="prova-corpo">
        <div class="questao">
          <span class="disc">${esc(disc.nome)} <span>· questão ${atual + 1} · ${esc(q.topico)}</span></span>
          ${q.texto ? `<div class="texto-base"><h4>${esc(q.texto.titulo)}</h4><p>${esc(q.texto.corpo)}</p></div>` : ''}
          <p class="enunciado">${esc(q.enunciado)}</p>
          <div class="alts">${q.alternativas.map((a, i) => `<div class="alt ${a === q.certa ? 'certa' : a === resp ? 'errada' : ''}"><span class="l">${LETRAS[i]}</span><span>${esc(a)}${a === q.certa ? ' ✓' : a === resp ? ' (sua resposta)' : ''}</span></div>`).join('')}</div>
          ${resp === undefined ? '<p class="micro">Você deixou esta questão em branco.</p>' : ''}
          <p class="explica">${esc(q.explicacao)}</p>
        </div>
        <nav class="mapa" aria-label="Questões">
          <h5>Questões</h5>
          <div class="grade">${t.questoes.map((x, i) => `<button class="${t.respostas[i] === x.certa ? 'certa' : 'errada'} ${i === atual ? 'atual' : ''}" data-i="${i}" aria-label="Questão ${i + 1}, ${t.respostas[i] === x.certa ? 'certa' : 'errada'}">${i + 1}</button>`).join('')}</div>
        </nav>
      </div>
      <div class="prova-pe">
        <button class="btn btn-ghost" id="ant" ${atual === 0 ? 'disabled' : ''}>← Anterior</button>
        <button class="btn btn-ghost" id="prox" ${atual === t.questoes.length - 1 ? 'disabled' : ''}>Próxima →</button>
      </div>
    </div>`;
    app.querySelectorAll('.grade button').forEach((b) => b.onclick = () => { atual = +b.dataset.i; render(); });
    document.getElementById('ant').onclick = () => { atual--; render(); };
    document.getElementById('prox').onclick = () => { atual++; render(); };
  }
  render();
}

// ---------------- router ----------------
function rota() {
  clearInterval(tique);
  document.querySelector('.modal')?.remove();
  const h = location.hash;
  let m;
  if ((m = h.match(/^#\/simulado\/([\w-]+)$/))) telaSimulado(m[1]);
  else if ((m = h.match(/^#\/resultado\/(\w+)$/))) telaResultado(m[1], false);
  else if ((m = h.match(/^#\/revisao\/(\w+)$/))) telaResultado(m[1], true);
  else {
    landing();
    const ancora = h.startsWith('#') && !h.startsWith('#/') ? document.getElementById(h.slice(1)) : null;
    if (ancora) ancora.scrollIntoView(); else scrollTo(0, 0);
    return;
  }
  scrollTo(0, 0);
}
addEventListener('hashchange', rota);
rota();

