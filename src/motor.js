// Pure simulado logic: shuffling alternatives, scoring and per-topic review.
// Kept free of DOM so it can be tested directly.

/** Deterministic PRNG so one attempt always shows the same order. */
export function aleatorio(semente) {
  let s = semente >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e9) / 1e9; };
}

export function embaralhar(lista, rnd) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Builds the attempt: every question gets its 5 alternatives in a seeded order. */
export function montarTentativa(simulado, semente) {
  const rnd = aleatorio(semente);
  return {
    simuladoId: simulado.id,
    semente,
    inicio: Date.now(),
    questoes: simulado.questoes.map((q) => ({ ...q, alternativas: embaralhar([q.certa, ...q.erradas], rnd) })),
    respostas: {},
  };
}

/** Scores an attempt against the exam rules. */
export function corrigir(prova, tentativa) {
  const porDisciplina = prova.disciplinas.map((d) => {
    const qs = tentativa.questoes.map((q, i) => ({ q, i })).filter(({ q }) => q.disciplina === d.id);
    const acertos = qs.filter(({ q, i }) => tentativa.respostas[i] === q.certa).length;
    return { id: d.id, nome: d.nome, acertos, total: qs.length };
  });
  const total = porDisciplina.reduce((s, d) => s + d.acertos, 0) * prova.formato.pontosPorQuestao;
  const topicos = new Map();
  tentativa.questoes.forEach((q, i) => {
    const t = topicos.get(q.topico) || { topico: q.topico, disciplina: q.disciplina, certas: 0, total: 0 };
    t.total++; if (tentativa.respostas[i] === q.certa) t.certas++;
    topicos.set(q.topico, t);
  });
  const r = { total, maximo: tentativa.questoes.length * prova.formato.pontosPorQuestao, porDisciplina, revisar: [...topicos.values()].filter((t) => t.certas < t.total) };
  r.eliminado = prova.eliminado(r);
  return r;
}

export const formatarTempo = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
