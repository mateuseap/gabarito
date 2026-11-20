import { describe, expect, it } from 'vitest';
import { PROVAS, buscarProva, simulados } from '../src/data/catalogo.js';
import { corrigir, montarTentativa } from '../src/motor.js';

describe.each(PROVAS.map((p) => [p.id, p]))('banco de questões: %s', (_id, prova) => {
  const todos = simulados(prova);

  it('cada simulado tem o número de questões do formato', () => {
    expect(todos.length).toBeGreaterThanOrEqual(2);
    for (const s of todos) expect(s.questoes).toHaveLength(prova.formato.questoes);
  });

  it('toda questão tem as alternativas do formato, distintas, com tópico e explicação', () => {
    for (const s of todos) for (const q of s.questoes) {
      const alts = [q.certa, ...q.erradas];
      expect(alts, q.enunciado).toHaveLength(prova.formato.alternativas);
      expect(new Set(alts).size, q.enunciado).toBe(alts.length);
      expect(q.topico && q.explicacao, q.enunciado).toBeTruthy();
    }
  });

  it('enunciados não se repetem dentro da prova', () => {
    const vistos = todos.flatMap((s) => s.questoes.map((q) => q.enunciado));
    expect(new Set(vistos).size).toBe(vistos.length);
  });
});

describe('ETE: edital', () => {
  const ete = buscarProva('ete-pe-2027');
  const s = simulados(ete)[0];
  const t = montarTentativa(s, 42);

  it('10 questões de cada disciplina', () => {
    for (const d of ete.disciplinas) expect(s.questoes.filter((q) => q.disciplina === d.id)).toHaveLength(10);
  });

  it('mantém a resposta certa entre as alternativas embaralhadas', () => {
    for (const q of t.questoes) expect(q.alternativas).toContain(q.certa);
  });

  it('gabarito perfeito tira 20 e não é eliminado', () => {
    t.questoes.forEach((q, i) => { t.respostas[i] = q.certa; });
    const r = corrigir(ete, t);
    expect(r.nota.valor).toBe('20');
    expect(r.avaliacao.status).toBe('otimo');
    expect(r.revisar).toHaveLength(0);
  });

  it('zerar uma disciplina elimina, mesmo com nota total alta', () => {
    t.questoes.forEach((q, i) => { t.respostas[i] = q.disciplina === 'mat' ? q.certa : q.erradas[0]; });
    expect(corrigir(ete, t).avaliacao.status).toBe('eliminado');
  });
});

describe('AWS CLF-C02: pesos dos domínios', () => {
  const aws = buscarProva('aws-clf-c02');

  it('cada simulado segue 24/30/34/12%, ou 5/6/7/2 em 20 questões', () => {
    for (const s of simulados(aws)) {
      expect(['d1', 'd2', 'd3', 'd4'].map((d) => s.questoes.filter((q) => q.disciplina === d).length)).toEqual([5, 6, 7, 2]);
    }
  });

  it('estimativa: 14 de 20 acertos fica em 730, acima dos 700', () => {
    const t = montarTentativa(simulados(aws)[0], 7);
    t.questoes.forEach((q, i) => { t.respostas[i] = i < 14 ? q.certa : q.erradas[0]; });
    const r = corrigir(aws, t);
    expect(r.nota.valor).toBe('730');
    expect(r.avaliacao.status).toBe('ok');
  });
});
