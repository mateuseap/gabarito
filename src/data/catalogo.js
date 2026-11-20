// The catalog is the product's extension point: a new exam is one entry here
// plus its question files. Nothing in the interface is specific to one exam.
import { COBRANCA, CONCEITOS, SEGURANCA, TECNOLOGIA } from './aws-clf.js';
import { MATEMATICA } from './matematica.js';
import { PORTUGUES } from './portugues.js';

export const CATEGORIAS = [
  { id: 'selecao', nome: 'Seleções escolares' },
  { id: 'cert', nome: 'Certificações de TI' },
];

export const PROVAS = [
  {
    id: 'ete-pe-2027',
    nome: 'ETE Pernambuco 2027',
    curto: 'ETE-PE',
    categoria: 'selecao',
    idioma: 'pt-BR',
    cor: '#a8e05f',
    sigla: 'ETE',
    resumo: 'Seleção das Escolas Técnicas Estaduais de Pernambuco, Ensino Médio Integrado.',
    descricao: 'Seleção das 71 Escolas Técnicas Estaduais de Pernambuco para o Ensino Médio Integrado, incluindo a ETE José Humberto de Moura Cavalcanti, em Limoeiro (Desenvolvimento de Sistemas e Nutrição e Dietética).',
    formato: { questoes: 20, alternativas: 5, minutos: 60 },
    simuladoIgualReal: true,
    regras: [
      '20 questões de múltipla escolha, 5 alternativas, só uma certa.',
      '10 de Língua Portuguesa e 10 de Matemática, 1 ponto cada, nota de 0 a 20.',
      '60 minutos contados da abertura da prova no computador. No fim do tempo, a prova fecha sozinha.',
      'Eliminado quem fizer menos de 4 pontos ou zerar Português ou Matemática.',
      'Desempate: maior nota em Português e, depois, o candidato mais novo.',
    ],
    fonte: { nome: 'Edital ETE Médio Integrado 2027.1 (SEE-PE), itens 4 e 12', url: 'https://www.educacaoprofissional.org/selecao/downloads/3/EDITAL-ETE-INTEGRADO-2027_.pdf' },
    disciplinas: [
      { id: 'pt', nome: 'Língua Portuguesa', curto: 'Português', blocos: PORTUGUES },
      { id: 'mat', nome: 'Matemática', curto: 'Matemática', blocos: MATEMATICA },
    ],
    avaliar: (r) => {
      if (r.acertos < 4 || r.porDisciplina.some((d) => d.acertos === 0)) return { status: 'eliminado', texto: 'Na prova real, essa nota eliminaria' };
      if (r.acertos >= 15) return { status: 'otimo', texto: 'Ótimo resultado' };
      return { status: 'ok', texto: 'Passou da linha de eliminação do edital' };
    },
    nota: (r) => ({ valor: String(r.acertos), max: '/20' }),
    dicaResultado: 'No empate, ganha a maior nota de Português.',
  },
  {
    id: 'aws-clf-c02',
    nome: 'AWS Cloud Practitioner',
    curto: 'CLF-C02',
    categoria: 'cert',
    idioma: 'en',
    cor: '#ff9900',
    sigla: 'AWS',
    resumo: 'Certificação de entrada da AWS: conceitos de nuvem, segurança, serviços e cobrança.',
    descricao: 'AWS Certified Cloud Practitioner (CLF-C02), a certificação de entrada da AWS. As questões são em inglês, como na prova, e seguem os pesos oficiais dos quatro domínios.',
    formato: { questoes: 20, alternativas: 4, minutos: 28 },
    simuladoIgualReal: false,
    regras: [
      'Prova real: 65 questões (50 valem nota, 15 não), 90 minutos, múltipla escolha e múltipla resposta.',
      'Nota de 100 a 1000. Para passar, 700.',
      'Pesos dos domínios: Cloud Concepts 24%, Security and Compliance 30%, Cloud Technology and Services 34%, Billing, Pricing, and Support 12%.',
      'Cada simulado aqui tem 20 questões, na mesma proporção de domínios, com 28 minutos (o ritmo da prova real).',
      'A nota do simulado é uma estimativa na escala de 100 a 1000. A AWS usa um modelo de pontuação próprio.',
    ],
    fonte: { nome: 'AWS Certified Cloud Practitioner (CLF-C02) Exam Guide', url: 'https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf' },
    disciplinas: [
      { id: 'd1', nome: 'Cloud Concepts', curto: 'Concepts', blocos: CONCEITOS },
      { id: 'd2', nome: 'Security and Compliance', curto: 'Security', blocos: SEGURANCA },
      { id: 'd3', nome: 'Cloud Technology and Services', curto: 'Technology', blocos: TECNOLOGIA },
      { id: 'd4', nome: 'Billing, Pricing, and Support', curto: 'Billing', blocos: COBRANCA },
    ],
    // ponytail: linear 100-1000 estimate; AWS scaling is unpublished, so this is a practice signal only
    escala: (r) => Math.round(100 + (900 * r.acertos) / r.total),
    avaliar(r) {
      const s = this.escala(r);
      return s >= 700 ? { status: s >= 850 ? 'otimo' : 'ok', texto: `Estimativa ${s}: acima dos 700 para passar` } : { status: 'eliminado', texto: `Estimativa ${s}: abaixo dos 700 para passar` };
    },
    nota(r) { return { valor: String(this.escala(r)), max: '/1000' }; },
    dicaResultado: 'Na prova real não há penalidade por erro: nunca deixe questão em branco.',
  },
];

export const EM_BREVE = [
  { sigla: 'IFPE', nome: 'IFPE Integrado', categoria: 'selecao', cor: '#56b6c2' },
  { sigla: 'SAA', nome: 'AWS Solutions Architect Associate', categoria: 'cert', cor: '#ff9900' },
  { sigla: 'AZ', nome: 'Microsoft Azure Fundamentals', categoria: 'cert', cor: '#4a9ff5' },
  { sigla: 'ENEM', nome: 'ENEM', categoria: 'selecao', cor: '#c678dd' },
];

/** Simulados of an exam: simulado i takes block i of every subject, in subject order. */
export function simulados(prova) {
  const n = Math.min(...prova.disciplinas.map((d) => d.blocos.length));
  return Array.from({ length: n }, (_, i) => ({
    id: `${prova.id}-s${i + 1}`,
    provaId: prova.id,
    numero: i + 1,
    titulo: `Simulado ${i + 1}`,
    questoes: prova.disciplinas.flatMap((d) => d.blocos[i].map((x) => ({ ...x, disciplina: d.id }))),
  }));
}

export const buscarProva = (id) => PROVAS.find((p) => p.id === id);
export const provaDoSimulado = (simuladoId) => PROVAS.find((p) => simuladoId.startsWith(p.id + '-'));
export const totalQuestoes = () => PROVAS.reduce((s, p) => s + simulados(p).length * p.formato.questoes, 0);
