// Curso Informática Essencial. UC3, Aula 2 de Redes (Lajeado 2026.25.60).
// Segurança de redes: ameaças, golpes, firewall, antivírus, senhas, criptografia, VPN e logs.

export type Video = { arquivo: string; titulo: string; resumo: string; duracao: string; pergunta: string };

export const VIDEOS: Video[] = [
  { arquivo: "01-malwares-e-antivirus.html", titulo: "Malwares e antivírus", resumo: "Vírus, worm, cavalo de troia, ransomware, spyware e adware. Depois, como o antivírus age.", duracao: "1 min 12 s", pergunta: "Qual a diferença entre um vírus e um worm?" },
  { arquivo: "02-phishing.html", titulo: "Phishing: como reconhecer um golpe", resumo: "Um e-mail falso passo a passo, os quatro sinais de alerta e o que fazer.", duracao: "1 min 10 s", pergunta: "Quais sinais mostram que um e-mail é golpe?" },
  { arquivo: "03-firewall-e-dmz.html", titulo: "Firewall e DMZ", resumo: "Quem entra, quem sai e quem é barrado. Onde fica o site e onde ficam os prontuários.", duracao: "1 min 4 s", pergunta: "Por que o site da clínica fica na DMZ e os prontuários não?" },
  { arquivo: "04-senhas.html", titulo: "Senhas fortes e verificação em duas etapas", resumo: "Quantas combinações uma senha tem, como funciona o ataque de dicionário e o segundo fator.", duracao: "1 min 24 s", pergunta: "Por que clinica123 foi descoberta em segundos?" },
  { arquivo: "05-criptografia-e-vpn.html", titulo: "Criptografia, HTTPS e VPN", resumo: "A cifra de César, o que o espião vê com e sem criptografia e o túnel da VPN.", duracao: "1 min 28 s", pergunta: "O que o cadeado do navegador garante?" },
  { arquivo: "06-logs.html", titulo: "Logs: o diário da rede", resumo: "Como achar um ataque de força bruta no registro e o ciclo detectar, entender, corrigir e verificar.", duracao: "1 min 5 s", pergunta: "Que padrão no log indica força bruta?" },
];

/* Atividade 1: golpe ou legítima? */
export const GOLPES: { texto: string; golpe: boolean; explicacao: string }[] = [
  { texto: "E-mail de banco-valeseguro.example: \"Sua conta será bloqueada em 2 horas. Clique aqui e confirme sua senha.\"", golpe: true, explicacao: "Urgência, ameaça e pedido de senha. Banco de verdade não pede senha por e-mail." },
  { texto: "Mensagem de WhatsApp de número desconhecido: \"Oi, mãe, troquei de celular. Faz um Pix de 800 reais para esta conta?\"", golpe: true, explicacao: "Golpe do falso parente. Ligue para o número antigo antes de qualquer Pix." },
  { texto: "Aviso do seu navegador, aberto por você ao digitar o endereço do banco, pedindo para atualizar o navegador pela loja oficial.", golpe: false, explicacao: "Você iniciou o acesso e a atualização vem do canal oficial. Sem pressa nem ameaça." },
  { texto: "E-mail: \"Você ganhou um iPhone! Baixe o arquivo premio.exe para receber.\"", golpe: true, explicacao: "Prêmio que você não pediu, mais um arquivo executável. Isso é isca para instalar malware." },
  { texto: "A TI da clínica avisa no mural e pessoalmente que a rede ficará fora do ar sábado, das 8h às 10h, para manutenção.", golpe: false, explicacao: "Vem de canal conhecido, avisa com antecedência e não pede dados nem cliques." },
  { texto: "SMS: \"Correios: sua encomenda está retida. Pague a taxa de 12 reais em correios-entrega.example.\"", golpe: true, explicacao: "Endereço estranho, taxa inesperada e pressa. Confira sempre no site oficial digitado por você." },
  { texto: "E-mail do \"suporte\" pedindo que você instale um programa de acesso remoto e informe o código que aparece na tela.", golpe: true, explicacao: "Quem tem o código controla o seu computador. Suporte verdadeiro não liga nem escreve sem você ter aberto chamado." },
  { texto: "Notificação do aplicativo do banco, que você já usa, avisando que um novo aparelho entrou na sua conta, com botão \"não fui eu\" dentro do próprio app.", golpe: false, explicacao: "Veio de dentro do aplicativo oficial. O cuidado é abrir o app sozinho, sem clicar em links de e-mail." },
];

/* Atividade 2: qual ameaça é essa? */
export const AMEACAS_OPCOES = [
  { id: "virus", rotulo: "Vírus" },
  { id: "worm", rotulo: "Worm" },
  { id: "troia", rotulo: "Cavalo de troia" },
  { id: "ransom", rotulo: "Ransomware" },
  { id: "spy", rotulo: "Spyware" },
  { id: "adware", rotulo: "Adware" },
];
export const AMEACAS: { texto: string; certa: string; explicacao: string }[] = [
  { texto: "Os arquivos da recepção foram criptografados e aparece uma mensagem pedindo pagamento para devolvê-los.", certa: "ransom", explicacao: "Ransomware sequestra os dados e cobra resgate. A melhor defesa é o backup." },
  { texto: "Um programa baixado como \"planilha grátis\" instalou, escondido, um acesso para o atacante.", certa: "troia", explicacao: "Cavalo de troia parece útil, mas esconde algo malicioso dentro." },
  { texto: "Sem ninguém clicar em nada, o malware pulou de computador em computador pela rede da clínica.", certa: "worm", explicacao: "Worm se espalha sozinho pela rede, sem precisar de um arquivo hospedeiro nem de ação do usuário." },
  { texto: "Um programa registra tudo o que a pessoa digita e envia para o atacante, inclusive senhas.", certa: "spy", explicacao: "Spyware espiona e rouba informações sem o usuário perceber." },
  { texto: "Propagandas aparecem sozinhas em qualquer site, e a página inicial do navegador mudou.", certa: "adware", explicacao: "Adware exibe anúncios indesejados, muitas vezes junto de programas gratuitos." },
  { texto: "Um arquivo infectado foi aberto em um pen drive e o malware se anexou a outros arquivos do computador.", certa: "virus", explicacao: "Vírus precisa de um arquivo hospedeiro e de uma ação, como abrir o arquivo." },
  { texto: "Um tipo de malware que só funciona porque o usuário aceitou instalar um \"limpador de computador\" falso.", certa: "troia", explicacao: "Engano na instalação é a marca do cavalo de troia." },
  { texto: "A tela trava e aparece: \"seus arquivos foram bloqueados, pague em criptomoeda em 48 horas\".", certa: "ransom", explicacao: "Prazo, bloqueio e pagamento em criptomoeda: ransomware clássico." },
];

/* Atividade 3: monte a defesa */
export const DEFESA_OPCOES = [
  { id: "firewall", rotulo: "Firewall" },
  { id: "antivirus", rotulo: "Antivírus" },
  { id: "senha", rotulo: "Senha forte e 2 etapas" },
  { id: "cripto", rotulo: "Criptografia" },
  { id: "vpn", rotulo: "VPN" },
  { id: "logs", rotulo: "Análise de logs" },
];
export const DEFESAS: { texto: string; certa: string; explicacao: string }[] = [
  { texto: "A clínica quer impedir que qualquer pessoa da internet acesse a rede onde ficam os prontuários.", certa: "firewall", explicacao: "O firewall filtra o que entra e sai, seguindo regras. O que não foi permitido é bloqueado." },
  { texto: "Um pen drive foi plugado e pode ter trazido um arquivo infectado. O que faz a varredura e coloca em quarentena?", certa: "antivirus", explicacao: "O antivírus compara arquivos com a base de ameaças e isola os suspeitos." },
  { texto: "Uma médica precisa acessar o servidor da clínica de dentro de um café, com Wi-Fi aberto.", certa: "vpn", explicacao: "A VPN cria um túnel criptografado até a rede da clínica." },
  { texto: "Mesmo que roubem a senha de um funcionário, o atacante não deve conseguir entrar sem o celular dele.", certa: "senha", explicacao: "A verificação em duas etapas exige um segundo fator além da senha." },
  { texto: "Os dados do prontuário passam pela internet e ninguém no caminho pode conseguir ler.", certa: "cripto", explicacao: "Criptografia embaralha a mensagem. Só quem tem a chave consegue ler." },
  { texto: "A gestora quer descobrir de onde vieram as 40 tentativas de login falhas da madrugada.", certa: "logs", explicacao: "O log registra quem, quando e de onde. Ele é a fonte do diagnóstico." },
  { texto: "O site da clínica precisa ficar visível na internet sem expor os computadores internos.", certa: "firewall", explicacao: "Firewall com DMZ: o site fica em uma área isolada, e a rede interna fica atrás da segunda barreira." },
  { texto: "O navegador mostra o cadeado e o endereço começa com https. O que está protegendo a conversa com o site?", certa: "cripto", explicacao: "HTTPS usa criptografia entre o seu navegador e o servidor." },
];

/* Atividade 6: leia o log */
export const LOGS: { enunciado: string; linhas: string[]; opcoes: { id: string; rotulo: string }[]; certa: string; explicacao: string }[] = [
  {
    enunciado: "Leia o registro do servidor da clínica. O que está acontecendo?",
    linhas: [
      "03:10:01  login  admin   203.0.113.50   falha",
      "03:10:03  login  admin   203.0.113.50   falha",
      "03:10:05  login  admin   203.0.113.50   falha",
      "03:10:07  login  admin   203.0.113.50   falha",
      "03:10:09  login  admin   203.0.113.50   falha",
    ],
    opcoes: [
      { id: "forca", rotulo: "Ataque de força bruta" },
      { id: "normal", rotulo: "Funcionário esqueceu a senha" },
      { id: "backup", rotulo: "Backup automático" },
    ],
    certa: "forca",
    explicacao: "Muitas falhas seguidas, em poucos segundos, no mesmo usuário, vindas de um endereço de fora. Isso é força bruta. Ação: bloquear a origem no firewall e conferir a senha do admin.",
  },
  {
    enunciado: "Mesmo registro, outro horário. Agora o que aconteceu?",
    linhas: [
      "08:02:11  login  maria   192.168.10.100  sucesso",
      "08:15:40  login  joao    192.168.10.101  falha",
      "08:15:58  login  joao    192.168.10.101  sucesso",
      "09:30:12  pasta  maria   192.168.10.100  abriu Pacientes",
    ],
    opcoes: [
      { id: "forca", rotulo: "Ataque de força bruta" },
      { id: "normal", rotulo: "Uso normal, com um erro de digitação" },
      { id: "malware", rotulo: "Malware na rede" },
    ],
    certa: "normal",
    explicacao: "Uma falha seguida de um sucesso, de dentro da rede e pela mesma pessoa, é digitação errada. Saber o que é normal evita alarme falso.",
  },
  {
    enunciado: "Este log é do firewall. Qual a melhor ação?",
    linhas: [
      "14:00:01  entrada  198.51.100.7  porta 3389  bloqueado",
      "14:00:02  entrada  198.51.100.7  porta 22    bloqueado",
      "14:00:02  entrada  198.51.100.7  porta 445   bloqueado",
      "14:00:03  entrada  198.51.100.7  porta 3306  bloqueado",
    ],
    opcoes: [
      { id: "ignorar", rotulo: "Ignorar, tudo foi bloqueado" },
      { id: "bloquear", rotulo: "Bloquear o endereço de origem e seguir monitorando" },
      { id: "desligar", rotulo: "Desligar o firewall para testar" },
    ],
    certa: "bloquear",
    explicacao: "Alguém varre várias portas em sequência, procurando uma aberta. O firewall barrou, mas vale bloquear a origem e continuar olhando o log.",
  },
  {
    enunciado: "Depois de bloquear a origem do ataque, qual é o último passo do ciclo?",
    linhas: ["Detectar, Entender, Corrigir e depois: ?"],
    opcoes: [
      { id: "verificar", rotulo: "Verificar no log se o ataque parou" },
      { id: "apagar", rotulo: "Apagar o log para não confundir" },
      { id: "esquecer", rotulo: "Encerrar o chamado e esquecer" },
    ],
    certa: "verificar",
    explicacao: "Depois de corrigir, volte ao log e confirme. Nunca apague o log: ele é a prova do que aconteceu.",
  },
];

/* Atividade 7: verdade ou mito */
export const VERDADE_OU_MITO: { texto: string; verdade: boolean; explicacao: string }[] = [
  { texto: "Quem tem antivírus instalado não precisa mais se preocupar com golpes.", verdade: false, explicacao: "Antivírus não impede você de entregar sua senha em um site falso. Atenção continua sendo a primeira defesa." },
  { texto: "O firewall bloqueia o que não foi permitido por uma regra.", verdade: true, explicacao: "A regra padrão é bloquear. Só passa o que uma regra autoriza." },
  { texto: "Se o e-mail veio de um nome conhecido, é seguro clicar no link.", verdade: false, explicacao: "O nome pode ser falsificado. Confira o endereço real e desconfie de pressa e ameaças." },
  { texto: "Uma senha longa e fácil de lembrar, como uma frase, pode ser mais forte que uma curta cheia de símbolos.", verdade: true, explicacao: "O tamanho multiplica as combinações. Frases de várias palavras são fortes e fáceis de lembrar." },
  { texto: "Usar a mesma senha em vários sites é seguro se ela for forte.", verdade: false, explicacao: "Se um site vazar, os atacantes testam a mesma senha nos outros. Cada serviço precisa da sua." },
  { texto: "O cadeado do navegador garante que o site é confiável e honesto.", verdade: false, explicacao: "O cadeado só garante que a conversa está criptografada. Sites falsos também podem ter cadeado." },
  { texto: "O ransomware é combatido principalmente com backup atualizado e guardado fora do computador.", verdade: true, explicacao: "Com backup, não é preciso pagar o resgate. O backup precisa estar isolado para não ser criptografado junto." },
  { texto: "A DMZ é onde ficam os servidores que precisam ser acessados de fora, separados da rede interna.", verdade: true, explicacao: "Se o servidor da DMZ for invadido, a rede interna ainda tem outra barreira." },
  { texto: "Os logs servem apenas para gastar espaço em disco.", verdade: false, explicacao: "Logs registram o que aconteceu na rede e são a base para detectar e corrigir falhas." },
  { texto: "Uma VPN deixa o acesso remoto mais seguro porque cria um túnel criptografado.", verdade: true, explicacao: "Quem está no meio do caminho vê só dados embaralhados." },
];

/* Atividade 4: laboratório de senhas */
export const SENHAS_COMUNS = ["123456", "12345678", "senha", "password", "qwerty", "admin", "abc123", "clinica123", "bemviver", "123456789", "111111", "brasil", "futebol", "iloveyou"];

/* Atividade 5: cifra de César */
export const DESAFIOS_CESAR: { cifrada: string; deslocamento: number; original: string; dica: string }[] = [
  { cifrada: "VLJLOR", deslocamento: 3, original: "SIGILO", dica: "Cada letra foi 3 posições para a frente. Volte 3." },
  { cifrada: "FOLQLFD", deslocamento: 3, original: "CLINICA", dica: "Mesma regra: volte 3. É o nome do cenário da aula." },
  { cifrada: "GRZQORDG", deslocamento: 3, original: "DOWNLOAD", dica: "Volte 3 em cada letra." },
  { cifrada: "SDVVZRUG", deslocamento: 3, original: "PASSWORD", dica: "Uma palavra em inglês muito usada em senhas." },
];
