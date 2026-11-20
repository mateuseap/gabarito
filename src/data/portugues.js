// Portuguese questions for the ETE-PE 2027 syllabus (edital item 12.1).
// The reading passages are original, written for this site. Each simulado has
// one or two short texts, as the real test does, plus grammar items.

const q = (topico, enunciado, certa, erradas, explicacao, texto = null) => ({ topico, enunciado, certa, erradas, explicacao, texto });

const FEIRA = {
  titulo: 'A feira de sábado',
  corpo: `Toda manhã de sábado, a feira de Limoeiro acorda antes do sol. Os primeiros feirantes chegam com caixotes de macaxeira, jerimum e coentro, e montam as bancas no escuro, guiados mais pelo costume do que pela luz.

Para quem passa às pressas, a feira é só um lugar de compras. Para quem fica, é outra coisa: é onde se sabe quem casou, quem viajou, quem está doente. Ali, o preço do feijão divide espaço com as notícias da cidade.

Nos últimos anos, muita gente passou a comprar no supermercado ou pelo celular. Mesmo assim, a feira resiste. Talvez porque nenhum aplicativo saiba perguntar, como faz Seu Antônio da banca de queijo, se a sua mãe já melhorou da gripe.`,
};

const CARTA = {
  titulo: 'Aviso aos estudantes',
  corpo: `Prezados estudantes,

Informamos que, a partir da próxima segunda-feira, a biblioteca funcionará das 7h às 17h. Para evitar filas, recomendamos que os livros sejam devolvidos até sexta-feira. Lembre-se: o empréstimo é pessoal e não pode ser transferido para outra pessoa.

Caso o livro seja danificado, o estudante deverá procurar a coordenação.

Atenciosamente,
Coordenação Pedagógica`,
};

const CELULAR = {
  titulo: 'O celular na mesa',
  corpo: `No almoço de domingo, a família inteira estava reunida, mas ninguém conversava. Cada um olhava para a própria tela, como se a mesa fosse uma sala de espera.

Foi a avó quem quebrou o silêncio: "No meu tempo, a gente brigava na mesa, mas pelo menos brigava olhando no olho". Todos riram, e alguém guardou o celular no bolso.

A cena é comum e não precisa de culpados. A tecnologia aproxima quem está longe, mas pode afastar quem está perto. O desafio talvez não seja abandonar o celular, e sim lembrar de levantar os olhos.`,
};

export const PORTUGUES = [
  // ---------- simulado 1 ----------
  [
    q('Ideia principal', 'Qual é a ideia principal do texto?', 'A feira é também um lugar de convivência, e isso ajuda a explicar por que ela resiste.', ['A feira de Limoeiro vende os alimentos mais baratos da região.', 'Os aplicativos de compra vão acabar com as feiras em pouco tempo.', 'Os feirantes trabalham sem luz porque não têm energia elétrica.', 'O supermercado oferece mais variedade do que a feira.'], 'O texto contrapõe a feira "só de compras" à feira como lugar de notícias e afeto, e termina explicando a resistência por esse vínculo humano.', FEIRA),
    q('Sentido contextual', 'No trecho "guiados mais pelo costume do que pela luz", o autor sugere que os feirantes:', 'já conhecem o lugar tão bem que montam as bancas quase sem enxergar.', ['preferem trabalhar no escuro para economizar.', 'não gostam da luz do sol.', 'estão perdidos e confusos.', 'seguem ordens de um guia.'], 'Como ainda está escuro, o que orienta os feirantes é o hábito de repetir aquilo toda semana.', FEIRA),
    q('Coesão', 'No último parágrafo, a palavra "Mesmo assim" estabelece uma relação de:', 'oposição (concessão).', ['causa.', 'conclusão.', 'tempo.', 'adição.'], '"Mesmo assim" introduz um fato que acontece apesar do anterior: muita gente deixou a feira, mas ela resiste.', FEIRA),
    q('Gêneros e sequências', 'Predomina no texto a sequência:', 'descritiva e reflexiva, com tom de crônica.', ['injuntiva, com instruções ao leitor.', 'argumentativa de um artigo científico.', 'narrativa de um conto de suspense.', 'expositiva de um verbete de dicionário.'], 'O texto descreve a feira e reflete sobre ela a partir do cotidiano, o que caracteriza a crônica.', FEIRA),
    q('Figuras de linguagem', 'Em "a feira de Limoeiro acorda antes do sol", há uma figura de linguagem chamada:', 'personificação (prosopopeia).', ['hipérbole.', 'metonímia.', 'ironia.', 'onomatopeia.'], 'A feira recebe uma ação humana, "acordar". Atribuir ações humanas a seres não humanos é personificação.', FEIRA),
    q('Classes de palavras', 'Na frase "Os primeiros feirantes chegam com caixotes", a palavra "com" é:', 'preposição.', ['conjunção.', 'advérbio.', 'artigo.', 'pronome.'], '"Com" liga "chegam" a "caixotes", estabelecendo uma relação de companhia; é uma preposição.'),
    q('Concordância', 'Assinale a frase em que a concordância verbal está de acordo com a norma padrão.', 'Fazia dois anos que ela não ia à feira.', ['Faziam dois anos que ela não ia à feira.', 'Houveram muitas reclamações dos feirantes.', 'Os feirantes e o fiscal chegou cedo.', 'Existe muitas bancas na feira.'], 'O verbo "fazer" indicando tempo é impessoal e fica no singular. "Haver" no sentido de existir também. "Existir" concorda com o sujeito ("existem").'),
    q('Pontuação', 'Assinale a frase com a pontuação correta.', 'Seu Antônio, o dono da banca de queijo, conhece todo mundo.', ['Seu Antônio o dono da banca de queijo, conhece todo mundo.', 'Seu Antônio, o dono da banca de queijo conhece, todo mundo.', 'Seu Antônio o dono, da banca de queijo conhece todo mundo.', 'Seu Antônio, o dono da banca de queijo conhece todo mundo.'], 'O aposto explicativo "o dono da banca de queijo" vem isolado por vírgulas, uma antes e uma depois.'),
    q('Regência', 'Assinale a frase em que a regência verbal está correta.', 'Prefiro a feira ao supermercado.', ['Prefiro mais a feira do que o supermercado.', 'Prefiro a feira do que o supermercado.', 'Prefiro mais a feira que o supermercado.', 'Prefiro a feira de que o supermercado.'], 'Pela norma padrão, "preferir" pede "algo a algo", sem "mais" e sem "do que".'),
    q('Formação de palavras', 'A palavra "feirante" é formada por:', 'derivação sufixal.', ['derivação prefixal.', 'composição por justaposição.', 'composição por aglutinação.', 'derivação parassintética.'], 'Vem de "feira" + o sufixo "-ante", que indica quem exerce uma atividade.'),
  ],
  // ---------- simulado 2 ----------
  [
    q('Gêneros e sequências', 'O texto pertence ao gênero:', 'aviso (comunicado), com predomínio da sequência injuntiva.', ['crônica, com predomínio da narração.', 'notícia, com predomínio da exposição.', 'poema, com linguagem conotativa.', 'artigo de opinião, com predomínio da argumentação.'], 'É um comunicado oficial que informa e orienta o leitor sobre o que fazer.', CARTA),
    q('Ideia principal', 'O principal objetivo do texto é:', 'informar o novo horário da biblioteca e orientar sobre a devolução e o empréstimo de livros.', ['convidar os estudantes para uma festa na biblioteca.', 'proibir o uso da biblioteca às segundas-feiras.', 'anunciar a compra de novos livros.', 'reclamar dos estudantes que não devolvem livros.'], 'O texto informa o horário e dá orientações práticas: devolver até sexta, empréstimo pessoal.', CARTA),
    q('Coesão', 'Em "Para evitar filas, recomendamos que os livros sejam devolvidos até sexta-feira", a expressão "Para evitar filas" indica:', 'finalidade.', ['causa.', 'condição.', 'consequência.', 'oposição.'], '"Para" + infinitivo expressa o objetivo da recomendação.', CARTA),
    q('Coordenação e subordinação', 'Em "Caso o livro seja danificado, o estudante deverá procurar a coordenação", a conjunção "caso" exprime:', 'condição.', ['tempo.', 'concessão.', 'comparação.', 'conformidade.'], '"Caso" introduz a situação que precisa acontecer para a orientação valer: uma condição.', CARTA),
    q('Variedades da língua', 'A linguagem do texto é:', 'formal, adequada a um comunicado institucional.', ['regional, com gírias locais.', 'informal, como numa conversa entre amigos.', 'técnica, com termos científicos.', 'poética, cheia de metáforas.'], 'Vocativo "Prezados", fecho "Atenciosamente" e norma padrão indicam registro formal.', CARTA),
    q('Classes de palavras', 'Em "o empréstimo é pessoal e não pode ser transferido", a palavra "não" é:', 'advérbio de negação.', ['conjunção.', 'preposição.', 'pronome.', 'interjeição.'], '"Não" modifica o verbo, negando a ação; é advérbio.', CARTA),
    q('Sentido contextual', 'Assinale a alternativa em que a palavra destacada tem sentido figurado (conotativo).', 'Aquele professor é uma enciclopédia ambulante.', ['A enciclopédia está na estante da biblioteca.', 'Comprei uma enciclopédia de capa azul.', 'A enciclopédia tem doze volumes.', 'Consultei a enciclopédia para o trabalho.'], 'Chamar o professor de "enciclopédia" é uma metáfora: quer dizer que ele sabe muito.'),
    q('Concordância', 'Assinale a frase em que a concordância nominal está correta.', 'Seguem anexas as fichas de inscrição.', ['Segue anexo as fichas de inscrição.', 'Seguem anexo as fichas de inscrição.', 'Seguem anexos as fichas de inscrição.', 'Segue anexa as fichas de inscrição.'], '"Anexo" é adjetivo e concorda com o substantivo: fichas (feminino plural), "anexas".'),
    q('Homonímia e paronímia', 'Assinale a frase em que a palavra foi usada corretamente.', 'O diretor vai ratificar a decisão já tomada.', ['O juiz vai retificar a sentença, confirmando-a.', 'O aluno foi descriminado pelos colegas.', 'Ele cumprimentou a tarefa no prazo.', 'O avião vai emergir no aeroporto.'], '"Ratificar" é confirmar; "retificar" é corrigir. "Discriminar" é tratar com preconceito; "descriminar" é tirar a culpa.'),
    q('Pontuação', 'Em "Lembre-se: o empréstimo é pessoal", os dois-pontos foram usados para:', 'introduzir um esclarecimento.', ['indicar a fala de um personagem.', 'separar o sujeito do predicado.', 'marcar uma pergunta.', 'encerrar o texto.'], 'Os dois-pontos anunciam a informação que explica o "lembre-se".', CARTA),
  ],
  // ---------- simulado 3 ----------
  [
    q('Ideia principal', 'Qual é a reflexão central do texto?', 'O celular aproxima quem está longe, mas pode afastar quem está perto; o desafio é equilibrar.', ['A tecnologia deve ser proibida nas refeições.', 'As avós são contra qualquer tecnologia.', 'As famílias de hoje brigam mais do que as antigas.', 'O celular é o culpado por todos os problemas da família.'], 'O texto não culpa ninguém e propõe "levantar os olhos", não abandonar o celular.', CELULAR),
    q('Figuras de linguagem', 'Em "como se a mesa fosse uma sala de espera", há uma:', 'comparação.', ['personificação.', 'hipérbole.', 'onomatopeia.', 'antítese.'], 'O conectivo "como se" aproxima dois termos, a mesa e a sala de espera: é uma comparação.', CELULAR),
    q('Coesão', 'No último parágrafo, "mas" estabelece relação de:', 'oposição.', ['adição.', 'explicação.', 'conclusão.', 'alternância.'], '"Aproxima quem está longe, mas pode afastar quem está perto": ideias que se opõem.', CELULAR),
    q('Antítese', 'O trecho "aproxima quem está longe, mas pode afastar quem está perto" usa a figura chamada:', 'antítese.', ['metáfora.', 'eufemismo.', 'pleonasmo.', 'catacrese.'], 'Aproximar e afastar, longe e perto: palavras de sentidos opostos lado a lado formam uma antítese.', CELULAR),
    q('Intertextualidade e discurso', 'As aspas em "No meu tempo, a gente brigava na mesa..." indicam:', 'a fala da avó, reproduzida em discurso direto.', ['uma palavra estrangeira.', 'um título de livro.', 'uma ironia do narrador.', 'uma citação de um poeta famoso.'], 'As aspas marcam as palavras exatas ditas pela personagem: discurso direto.', CELULAR),
    q('Variedades da língua', 'A expressão "a gente", na fala da avó, é marca de:', 'linguagem informal, própria da fala do dia a dia.', ['erro gramatical que deve ser evitado em qualquer situação.', 'linguagem técnica.', 'linguagem arcaica.', 'regionalismo exclusivo de Pernambuco.'], '"A gente" no lugar de "nós" é comum e aceito na fala informal; num texto formal, preferiríamos "nós".', CELULAR),
    q('Termos da oração', 'Na oração "Todos riram", o sujeito é:', 'simples: "Todos".', ['oculto.', 'composto.', 'indeterminado.', 'inexistente.'], 'O pronome "Todos" é o termo sobre o qual se declara algo; um só núcleo, sujeito simples.', CELULAR),
    q('Concordância', 'Assinale a frase correta quanto à concordância.', 'Mais de um aluno faltou à aula.', ['Os alunos e o professor chegou atrasado.', 'Fazem três dias que não chove.', 'É proibido a entrada de celulares.', 'Haviam poucas pessoas na reunião.'], 'Com "mais de um", o verbo fica no singular. "Fazer" (tempo) e "haver" (existir) são impessoais. "É proibida a entrada", com artigo, concorda.'),
    q('Regência', 'Assinale a frase em que a regência está correta.', 'Assistimos ao jogo pela televisão.', ['Assistimos o jogo pela televisão.', 'Obedeça o regulamento da escola.', 'Ele namora com a minha prima.', 'Cheguei em casa cedo.'], '"Assistir" no sentido de ver pede a preposição "a". "Obedecer a", "namorar alguém" e "chegar a" são as formas da norma padrão.'),
    q('Sinonímia', 'Em "foi a avó quem quebrou o silêncio", a expressão destacada pode ser substituída, sem mudar o sentido, por:', 'interrompeu o silêncio.', ['destruiu o silêncio.', 'aumentou o silêncio.', 'consertou o silêncio.', 'escondeu o silêncio.'], '"Quebrar o silêncio" é expressão figurada que significa começar a falar, interromper o silêncio.', CELULAR),
  ],
];
