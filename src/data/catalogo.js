// The catalog is the product's extension point: a new exam is one entry here
// plus its question files. Nothing else in the app is specific to the ETE.
import { MATEMATICA } from './matematica.js';
import { PORTUGUES } from './portugues.js';

export const PROVAS = [
  {
    id: 'ete-pe-2027',
    nome: 'ETE Pernambuco 2027',
    curto: 'ETE-PE',
    descricao: 'Seleção das Escolas Técnicas Estaduais de Pernambuco, Ensino Médio Integrado. Vale para a ETE José Humberto de Moura Cavalcanti, em Limoeiro, e as outras 70 ETEs.',
    formato: { questoes: 20, alternativas: 5, minutos: 60, pontosPorQuestao: 1 },
    regras: [
      '20 questões de múltipla escolha, 5 alternativas cada, só uma certa.',
      '10 de Língua Portuguesa e 10 de Matemática, 1 ponto cada (nota de 0 a 20).',
      '60 minutos, contados a partir da abertura da prova no computador. Ao fim do tempo a prova fecha sozinha.',
      'É eliminado quem fizer menos de 4 pontos (20%) ou zerar Português ou Matemática.',
      'Desempate: maior nota em Português e, depois, o candidato mais novo.',
    ],
    fonte: { nome: 'Edital ETE Médio Integrado 2027.1 (SEE-PE)', url: 'https://www.educacaoprofissional.org/selecao/downloads/3/EDITAL-ETE-INTEGRADO-2027_.pdf' },
    disciplinas: [
      { id: 'pt', nome: 'Língua Portuguesa', questoes: PORTUGUES },
      { id: 'mat', nome: 'Matemática', questoes: MATEMATICA },
    ],
    // edital: eliminated below 20% of the total or with zero in any subject
    eliminado: (r) => r.total < 4 || r.porDisciplina.some((d) => d.acertos === 0),
  },
];

/** Simulados of an exam: simulado i takes block i of every subject, in subject order. */
export function simulados(prova) {
  const n = Math.min(...prova.disciplinas.map((d) => d.questoes.length));
  return Array.from({ length: n }, (_, i) => ({
    id: `${prova.id}-s${i + 1}`,
    numero: i + 1,
    titulo: `Simulado ${i + 1}`,
    questoes: prova.disciplinas.flatMap((d) => d.questoes[i].map((x) => ({ ...x, disciplina: d.id }))),
  }));
}

export const buscarProva = (id) => PROVAS.find((p) => p.id === id);
