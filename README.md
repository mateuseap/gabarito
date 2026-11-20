<div align="center">

# ✅ Gabarito

**Simulados no formato exato da prova, com correção explicada.**  
Grátis · Sem cadastro · Começando pela seleção das ETEs de Pernambuco.

[![CI](https://github.com/mateuseap/gabarito/actions/workflows/ci.yml/badge.svg)](https://github.com/mateuseap/gabarito/actions)
[![Publish Images](https://github.com/mateuseap/gabarito/actions/workflows/publish-images.yml/badge.svg)](https://github.com/mateuseap/gabarito/actions)
[![license](https://badgen.net/github/license/mateuseap/gabarito?color=5ba3b0)](LICENSE)

**https://gabarito.lab.mateuseap.com**

<img src="docs/assets/preview.jpg" width="720" alt="Gabarito: página inicial com o título Você treina. A ETE fica fácil." />

</div>

---

## Por que o Gabarito?

A seleção das Escolas Técnicas Estaduais de Pernambuco (ETE) é uma prova curta e muito disputada: 20 questões em 60 minutos, no computador, com o cronômetro correndo desde a abertura. Quem chega sem ter treinado nesse ritmo perde pontos por tempo, não por conteúdo.

O Gabarito reproduz a prova: mesmo número de questões, mesma divisão entre Português e Matemática, mesmo tempo, mesmas regras de eliminação. No fim, mostra a nota, o que revisar e a explicação de cada questão.

- **Formato real.** 20 questões, 5 alternativas, 60 minutos, a prova fecha sozinha no fim do tempo.
- **Correção explicada.** Cada questão traz o porquê da resposta certa.
- **Sem cadastro.** O progresso fica salvo no navegador do aluno. Não há servidor nem conta.

## Funcionalidades

|  |  |
|--|--|
| ⏱ **Cronômetro de prova** | 60 minutos que não pausam, com aviso nos últimos 5 minutos e entrega automática |
| 🔀 **Alternativas embaralhadas** | A ordem muda a cada tentativa, então refazer não é decorar a letra |
| 🧭 **Mapa de questões** | Pular entre questões e ver o que já foi respondido, como no sistema da SEE |
| 📊 **Resultado por disciplina** | Nota de 0 a 20, acertos em Português e Matemática, aviso de eliminação pela regra do edital |
| 🎯 **O que revisar** | Os assuntos do edital em que o aluno errou, para saber exatamente o que estudar |
| 📈 **Progresso** | Melhor nota por simulado, histórico e dias de estudo, tudo local |

## A prova da ETE 2027

Do [edital ETE Médio Integrado 2027.1](https://www.educacaoprofissional.org/selecao/downloads/3/EDITAL-ETE-INTEGRADO-2027_.pdf) da SEE-PE:

- 20 questões objetivas, 5 alternativas, uma certa: 10 de Língua Portuguesa e 10 de Matemática, 1 ponto cada.
- 60 minutos a partir da abertura eletrônica da prova. No fim do tempo, a prova é encerrada e as respostas não salvas são perdidas.
- Eliminação: menos de 4 pontos no total ou zero em um dos componentes.
- Desempate: maior nota em Português e, depois, o candidato mais novo.
- Conteúdo: item 12 do edital. Todos os simulados seguem essa lista.

As questões do Gabarito são inéditas, escritas para o site. O Gabarito não tem vínculo com a SEE-PE.

## Adicionar simulados e provas

O catálogo é o ponto de extensão. Nada na interface é específico da ETE.

- **Mais um simulado da ETE:** acrescente um bloco de 10 questões em `src/data/portugues.js` e outro em `src/data/matematica.js`. O simulado aparece sozinho.
- **Outra prova:** acrescente uma entrada em `PROVAS`, em `src/data/catalogo.js`, com formato, regras, disciplinas e a regra de eliminação.

Cada questão tem `topico`, `enunciado`, `certa`, `erradas` (quatro), `explicacao` e, opcionalmente, `texto` (o texto-base). O teste em `test/conteudo.test.js` garante que todo simulado tem o formato do edital e que nenhuma questão tem alternativa repetida.

## Desenvolvimento

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm test
pnpm build
```

Site estático (Vite, sem framework). A imagem Docker compila e serve com nginx. Cada push na `main` publica `ghcr.io/mateuseap/gabarito`, e o [homelab](https://github.com/mateuseap/homelab) roda em `gabarito.lab.mateuseap.com`.

## Licença

MIT. Veja [LICENSE](LICENSE).
