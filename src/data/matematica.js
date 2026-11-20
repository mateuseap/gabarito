// Math questions for the ETE-PE 2027 syllabus (edital item 12.2).
// Each one is written with its own numbers so the answer key is computed, not typed.
// `topico` matches an edital topic so the results screen can say what to review.

const q = (topico, enunciado, certa, erradas, explicacao) => ({ topico, enunciado, certa: String(certa), erradas: erradas.map(String), explicacao });

export const MATEMATICA = [
  // ---------- simulado 1 ----------
  [
    q('Quatro operações', 'Uma excursão da escola custa R$ 1.260,00 e será dividida igualmente entre 28 alunos. Quanto cada aluno vai pagar?', 'R$ 45,00', ['R$ 40,00', 'R$ 42,00', 'R$ 48,00', 'R$ 54,00'], '1260 ÷ 28 = 45.'),
    q('Frações', 'Ana leu 2/5 de um livro no sábado e 1/3 no domingo. Que fração do livro ela já leu?', '11/15', ['3/8', '3/15', '2/15', '13/15'], '2/5 + 1/3 = 6/15 + 5/15 = 11/15.'),
    q('Porcentagem', 'Um tênis de R$ 240,00 está com 15% de desconto. Qual é o preço com desconto?', 'R$ 204,00', ['R$ 36,00', 'R$ 210,00', 'R$ 225,00', 'R$ 196,00'], '15% de 240 = 36. 240 − 36 = 204.'),
    q('Regra de três simples', 'Para fazer 3 bolos, Dona Cida usa 750 g de farinha. Quantos gramas ela usa para fazer 5 bolos iguais?', '1.250 g', ['1.050 g', '1.150 g', '1.500 g', '2.250 g'], '750 ÷ 3 = 250 g por bolo. 250 × 5 = 1.250 g.'),
    q('Equações do 1º grau', 'Qual é o valor de x na equação 3x − 7 = 2x + 5?', '12', ['−2', '2', '−12', '6'], '3x − 2x = 5 + 7, então x = 12.'),
    q('Potenciação', 'Qual é o valor da expressão 2⁵ − 3² + 10⁰?', '24', ['22', '23', '25', '32'], '2⁵ = 32, 3² = 9, 10⁰ = 1. 32 − 9 + 1 = 24.'),
    q('Médias', 'Nas três provas do bimestre, João tirou 6,0, 7,5 e 9,0. Qual é a média aritmética das notas dele?', '7,5', ['7,0', '7,2', '8,0', '22,5'], '(6 + 7,5 + 9) ÷ 3 = 22,5 ÷ 3 = 7,5.'),
    q('Ângulos', 'Dois ângulos são complementares e um deles mede 35°. Quanto mede o outro?', '55°', ['45°', '65°', '145°', '325°'], 'Complementares somam 90°. 90° − 35° = 55°.'),
    q('Triângulos', 'Em um triângulo, dois ângulos internos medem 48° e 67°. Quanto mede o terceiro?', '65°', ['55°', '75°', '115°', '245°'], 'A soma dos ângulos internos é 180°. 180° − 48° − 67° = 65°.'),
    q('Sistemas de medidas', 'Um terreno retangular tem 12 m de frente e 25 m de fundo. Qual é a sua área?', '300 m²', ['37 m²', '74 m²', '150 m²', '3.000 m²'], 'Área do retângulo = 12 × 25 = 300 m².'),
  ],
  // ---------- simulado 2 ----------
  [
    q('Números decimais', 'Pedro comprou 2,5 kg de carne a R$ 38,40 o quilo. Quanto ele pagou?', 'R$ 96,00', ['R$ 76,80', 'R$ 86,40', 'R$ 92,00', 'R$ 98,40'], '2,5 × 38,40 = 96,00.'),
    q('Razão e proporção', 'Numa turma, a razão entre meninos e meninas é 3 para 4. Se há 16 meninas, quantos meninos há?', '12', ['9', '11', '13', '21'], '3/4 = x/16, então x = 3 × 16 ÷ 4 = 12.'),
    q('Divisão proporcional', 'Dois sócios dividem um lucro de R$ 9.000,00 em partes diretamente proporcionais a 2 e 3. Quanto recebe quem tem a parte maior?', 'R$ 5.400,00', ['R$ 3.600,00', 'R$ 4.500,00', 'R$ 6.000,00', 'R$ 6.750,00'], '2 + 3 = 5 partes. 9000 ÷ 5 = 1800. 3 × 1800 = 5400.'),
    q('Porcentagem', 'O preço de um caderno subiu de R$ 20,00 para R$ 23,00. De quantos por cento foi o aumento?', '15%', ['3%', '13%', '23%', '30%'], 'Aumento de 3 sobre 20: 3 ÷ 20 = 0,15 = 15%.'),
    q('Raiz quadrada', 'Qual é o valor de √144 + √81 − √49?', '14', ['12', '16', '19', '28'], '√144 = 12, √81 = 9, √49 = 7. 12 + 9 − 7 = 14.'),
    q('Produtos notáveis', 'Desenvolvendo (x + 5)², obtemos:', 'x² + 10x + 25', ['x² + 25', 'x² + 5x + 25', 'x² + 10x + 10', '2x + 10'], '(a + b)² = a² + 2ab + b². Aqui: x² + 2·5·x + 25.'),
    q('Sistemas lineares', 'A soma de dois números é 30 e a diferença entre eles é 8. Qual é o maior número?', '19', ['11', '15', '18', '22'], 'x + y = 30 e x − y = 8. Somando: 2x = 38, x = 19.'),
    q('Polígonos', 'Qual é a soma dos ângulos internos de um hexágono?', '720°', ['360°', '540°', '900°', '1.080°'], 'Soma = (n − 2) × 180°. Para n = 6: 4 × 180° = 720°.'),
    q('Regra de três composta', '4 pedreiros constroem um muro em 6 dias. Em quantos dias 8 pedreiros, no mesmo ritmo, constroem 2 muros iguais?', '6 dias', ['3 dias', '4 dias', '9 dias', '12 dias'], 'Dobrar o trabalho dobra o tempo (12 dias); dobrar os pedreiros corta pela metade: 12 ÷ 2 = 6.'),
    q('Sistemas de medidas', 'Uma caixa d’água tem formato de cubo com 2 m de aresta. Quantos litros ela comporta? (1 m³ = 1.000 L)', '8.000 L', ['800 L', '4.000 L', '6.000 L', '12.000 L'], 'Volume = 2 × 2 × 2 = 8 m³ = 8.000 L.'),
  ],
  // ---------- simulado 3 ----------
  [
    q('Expressões numéricas', 'Qual é o resultado de 48 ÷ (6 − 2) × 3 + 5?', '41', ['9', '17', '35', '53'], 'Parênteses: 6 − 2 = 4. Depois 48 ÷ 4 = 12, 12 × 3 = 36, 36 + 5 = 41.'),
    q('Frações', 'Uma pizza foi cortada em 8 pedaços. Lucas comeu 3 e Bia comeu 2. Que fração da pizza sobrou?', '3/8', ['1/8', '2/8', '5/8', '3/5'], 'Comeram 5 de 8 pedaços. Sobraram 8 − 5 = 3 pedaços: 3/8.'),
    q('Médias', 'Numa prova, a parte teórica tem peso 2 e a prática tem peso 3. Uma aluna tirou 6 na teórica e 8 na prática. Qual é a média ponderada?', '7,2', ['7,0', '7,4', '7,5', '14,0'], '(6 × 2 + 8 × 3) ÷ (2 + 3) = (12 + 24) ÷ 5 = 36 ÷ 5 = 7,2.'),
    q('Polinômios', 'Qual é o valor numérico de 2x² − 3x + 1 para x = 3?', '10', ['4', '7', '13', '28'], '2 · 9 − 3 · 3 + 1 = 18 − 9 + 1 = 10.'),
    q('Fatoração', 'A forma fatorada de x² − 49 é:', '(x + 7)(x − 7)', ['(x − 7)²', '(x + 7)²', 'x(x − 49)', '(x − 49)(x + 1)'], 'Diferença de quadrados: a² − b² = (a + b)(a − b), com b = 7.'),
    q('Equações do 1º grau', 'O triplo de um número, diminuído de 4, é igual a 26. Qual é esse número?', '10', ['7', '8', '9', '11'], '3x − 4 = 26, então 3x = 30 e x = 10.'),
    q('Porcentagem', 'Numa escola de 800 alunos, 35% fazem o curso técnico de Nutrição. Quantos alunos fazem esse curso?', '280', ['35', '235', '300', '320'], '35% de 800 = 0,35 × 800 = 280.'),
    q('Ângulos', 'Dois ângulos são suplementares. Um mede o dobro do outro. Quanto mede o maior?', '120°', ['60°', '90°', '100°', '135°'], 'x + 2x = 180°, então x = 60° e o maior é 2x = 120°.'),
    q('Semelhança de triângulos', 'Um poste projeta uma sombra de 6 m no mesmo instante em que uma pessoa de 1,5 m projeta uma sombra de 2 m. Qual é a altura do poste?', '4,5 m', ['3 m', '4 m', '6 m', '8 m'], 'Triângulos semelhantes: 1,5/2 = h/6, então h = 6 × 1,5 ÷ 2 = 4,5 m.'),
    q('Divisão proporcional', 'R$ 600,00 serão divididos entre duas pessoas em partes inversamente proporcionais a 2 e 3. Quanto recebe quem tem o número 2?', 'R$ 360,00', ['R$ 200,00', 'R$ 240,00', 'R$ 300,00', 'R$ 400,00'], 'Inversamente a 2 e 3 = diretamente a 1/2 e 1/3, ou 3 e 2. 600 ÷ 5 = 120. 3 × 120 = 360.'),
  ],
];
