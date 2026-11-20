import { describe, expect, it } from 'vitest';
import { PROVAS, simulados } from '../src/data/catalogo.js';
import { corrigir, montarTentativa } from '../src/motor.js';

const ete = PROVAS[0];

describe('banco de questões', () => {
  const todos = simulados(ete);

  it('cada simulado segue o formato do edital: 20 questões, 10 de cada disciplina', () => {
    expect(todos.length).toBeGreaterThanOrEqual(3);
    for (const s of todos) {
      expect(s.questoes).toHaveLength(ete.formato.questoes);
      for (const d of ete.disciplinas) expect(s.questoes.filter((q) => q.disciplina === d.id)).toHaveLength(10);
    }
  });

  it('toda questão tem 5 alternativas distintas, uma certa, tópico e explicação', () => {
    for (const s of todos) for (const q of s.questoes) {
      const alts = [q.certa, ...q.erradas];
      expect(alts, q.enunciado).toHaveLength(ete.formato.alternativas);
      expect(new Set(alts).size, q.enunciado).toBe(alts.length);
      expect(q.topico && q.explicacao, q.enunciado).toBeTruthy();
    }
  });
});

describe('correção', () => {
  const s = simulados(ete)[0];
  const t = montarTentativa(s, 42);

  it('mantém a resposta certa entre as alternativas embaralhadas', () => {
    for (const q of t.questoes) expect(q.alternativas).toContain(q.certa);
  });

  it('gabarito perfeito tira 20 e não é eliminado', () => {
    t.questoes.forEach((q, i) => { t.respostas[i] = q.certa; });
    const r = corrigir(ete, t);
    expect(r.total).toBe(20);
    expect(r.eliminado).toBe(false);
    expect(r.revisar).toHaveLength(0);
  });

  it('zerar uma disciplina elimina, mesmo com nota total alta', () => {
    t.questoes.forEach((q, i) => { t.respostas[i] = q.disciplina === 'mat' ? q.certa : q.erradas[0]; });
    const r = corrigir(ete, t);
    expect(r.total).toBe(10);
    expect(r.eliminado).toBe(true);
  });
});
