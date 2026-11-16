// Curso Informática Essencial. UC2, Aula 2 (Xanxerê 2026.25.103).
// Mídia de instalação, disco e partições, telas do instalador e diagnóstico de boot.
// Dados gerados a partir dos mesmos dados dos materiais impressos.

export const TELAS: { tela: string; escolha: string; porque: string }[] = [
 {
  "tela": "Idioma e teclado",
  "escolha": "Português (Brasil) e teclado ABNT2",
  "porque": "O usuário digita em teclado brasileiro. Teclado errado muda os caracteres da senha."
 },
 {
  "tela": "Instalar agora",
  "escolha": "Clicar em Instalar agora",
  "porque": "A opção Reparar o computador serve para consertar, não para instalar."
 },
 {
  "tela": "Chave do produto",
  "escolha": "Não tenho a chave do produto, se o computador já teve Windows ativado",
  "porque": "A licença digital fica ligada ao computador e ativa sozinha quando houver internet."
 },
 {
  "tela": "Edição do Windows",
  "escolha": "A mesma edição da licença, por exemplo Windows 11 Pro",
  "porque": "Edição diferente da licença não ativa."
 },
 {
  "tela": "Termos de licença",
  "escolha": "Ler e aceitar",
  "porque": "É o contrato de uso do software. Sem aceitar, a instalação não continua."
 },
 {
  "tela": "Tipo de instalação",
  "escolha": "Personalizada: instalar apenas o Windows (avançado)",
  "porque": "É a instalação limpa. A opção Atualização mantém arquivos e programas antigos."
 },
 {
  "tela": "Onde instalar",
  "escolha": "Excluir as partições antigas do disco, escolher o espaço não alocado e avançar",
  "porque": "Começa o disco do zero. Apaga tudo, por isso o backup vem antes."
 },
 {
  "tela": "Instalando",
  "escolha": "Esperar. Se pedir uma tecla para iniciar pelo pendrive, não apertar",
  "porque": "O computador reinicia várias vezes. Sem apertar a tecla, ele continua pelo disco."
 },
 {
  "tela": "Primeira configuração",
  "escolha": "Região, teclado, rede e conta do usuário",
  "porque": "Deixa o computador pronto para o cliente usar."
 }
];

export const J1: { tela: string; situacao: string; opcoes: string[]; certa: number; porque: string }[] = [
 {
  "tela": "Tipo de instalação",
  "situacao": "O cliente quer começar do zero.",
  "opcoes": [
   "Atualização: manter arquivos e programas",
   "Personalizada: instalar apenas o Windows",
   "Reparar o computador"
  ],
  "certa": 1,
  "porque": "Personalizada é a instalação limpa."
 },
 {
  "tela": "Chave do produto",
  "situacao": "O computador já rodava o Windows 11 ativado.",
  "opcoes": [
   "Digitar a chave de outro computador",
   "Procurar uma chave na internet",
   "Não tenho a chave do produto"
  ],
  "certa": 2,
  "porque": "A licença digital ativa sozinha, com internet."
 },
 {
  "tela": "Onde instalar",
  "situacao": "O Disco 0 tem 4 partições antigas e o backup está feito.",
  "opcoes": [
   "Excluir as partições do Disco 0 e instalar no espaço não alocado",
   "Instalar dentro da menor partição",
   "Formatar o pendrive"
  ],
  "certa": 0,
  "porque": "Instalação limpa começa com o disco vazio."
 },
 {
  "tela": "Onde instalar",
  "situacao": "O cliente não fez backup e as partições têm os arquivos dele.",
  "opcoes": [
   "Excluir mesmo assim",
   "Parar e fazer o backup antes",
   "Pedir o backup depois"
  ],
  "certa": 1,
  "porque": "Excluir apaga tudo. O backup vem antes."
 },
 {
  "tela": "Idioma e teclado",
  "situacao": "A equipe é de Xanxerê e o teclado é brasileiro.",
  "opcoes": [
   "Inglês e teclado US",
   "Espanhol e teclado latino",
   "Português (Brasil) e teclado ABNT2"
  ],
  "certa": 2,
  "porque": "O teclado do instalador deve combinar com o teclado do usuário."
 },
 {
  "tela": "Instalando",
  "situacao": "Aparece: Pressione qualquer tecla para iniciar pelo CD ou DVD.",
  "opcoes": [
   "Não apertar nada",
   "Apertar uma tecla",
   "Desligar da tomada"
  ],
  "certa": 0,
  "porque": "Sem apertar, o computador continua pelo disco."
 },
 {
  "tela": "Edição do Windows",
  "situacao": "A licença do cliente é do Windows 11 Pro.",
  "opcoes": [
   "Windows 11 Home",
   "Windows 11 Pro",
   "Windows 11 Education"
  ],
  "certa": 1,
  "porque": "A edição deve ser a da licença."
 },
 {
  "tela": "Requisitos",
  "situacao": "Aparece: Este computador não pode executar o Windows 11.",
  "opcoes": [
   "Ignorar a mensagem",
   "Trocar de pendrive",
   "Conferir TPM 2.0, Inicialização Segura, RAM, disco e processador"
  ],
  "certa": 2,
  "porque": "A mensagem aponta um requisito que não foi atendido."
 },
 {
  "tela": "Onde instalar",
  "situacao": "A lista não mostra nenhum disco.",
  "opcoes": [
   "Carregar o driver do controlador de disco",
   "Excluir uma partição",
   "Reiniciar sem o pendrive"
  ],
  "certa": 0,
  "porque": "Sem o driver, o instalador não enxerga o disco."
 },
 {
  "tela": "Primeira configuração",
  "situacao": "A instalação terminou. Falta entregar a máquina.",
  "opcoes": [
   "Entregar sem usuário",
   "Criar o usuário, conferir a rede e atualizar",
   "Apagar o disco"
  ],
  "certa": 1,
  "porque": "Máquina entregue precisa de usuário, rede e atualizações."
 }
];

export const J2: { sintoma: string; opcoes: string[]; certa: number; explicacao: string }[] = [
 {
  "sintoma": "O pendrive está plugado, mas o computador abre o Windows antigo.",
  "opcoes": [
   "O pendrive não está em primeiro na ordem de boot",
   "Porta USB com problema ou pendrive mal gravado",
   "O disco está sem sistema, não foi reconhecido ou a ordem de boot está errada",
   "TPM ou Inicialização Segura desligados na UEFI"
  ],
  "certa": 0,
  "explicacao": "O pendrive não está em primeiro lugar na ordem de boot. Entrar na UEFI ou abrir o menu de boot e escolher o pendrive."
 },
 {
  "sintoma": "O pendrive não aparece na lista de boot.",
  "opcoes": [
   "O disco está sem sistema, não foi reconhecido ou a ordem de boot está errada",
   "TPM ou Inicialização Segura desligados na UEFI",
   "Não apertar nada e deixar o computador iniciar pelo disco",
   "Porta USB com problema ou pendrive mal gravado"
  ],
  "certa": 3,
  "explicacao": "Testar outra porta USB, conferir se a UEFI está ligada e, se preciso, recriar o pendrive."
 },
 {
  "sintoma": "Aparece: Operating System not found, ou: No bootable device.",
  "opcoes": [
   "Não apertar nada e deixar o computador iniciar pelo disco",
   "A tecla é de outro fabricante: ver o manual ou entrar pelo Windows",
   "O disco está sem sistema, não foi reconhecido ou a ordem de boot está errada",
   "TPM ou Inicialização Segura desligados na UEFI"
  ],
  "certa": 2,
  "explicacao": "O disco não tem sistema, o disco não foi reconhecido ou a ordem de boot está errada. Conferir a UEFI."
 },
 {
  "sintoma": "O instalador diz que o computador não pode executar o Windows 11, mas a ficha técnica passou.",
  "opcoes": [
   "O pendrive não está em primeiro na ordem de boot",
   "TPM ou Inicialização Segura desligados na UEFI",
   "Não apertar nada e deixar o computador iniciar pelo disco",
   "A tecla é de outro fabricante: ver o manual ou entrar pelo Windows"
  ],
  "certa": 1,
  "explicacao": "O TPM ou a Inicialização Segura estão desligados na UEFI. Ligar os dois e tentar de novo."
 },
 {
  "sintoma": "O computador reiniciou no meio da instalação e pede para apertar uma tecla.",
  "opcoes": [
   "Não apertar nada e deixar o computador iniciar pelo disco",
   "A tecla é de outro fabricante: ver o manual ou entrar pelo Windows",
   "O pendrive não está em primeiro na ordem de boot",
   "Porta USB com problema ou pendrive mal gravado"
  ],
  "certa": 0,
  "explicacao": "Não apertar. Deixar iniciar pelo disco para continuar a instalação."
 },
 {
  "sintoma": "A tecla para entrar na BIOS não funciona.",
  "opcoes": [
   "O pendrive não está em primeiro na ordem de boot",
   "Porta USB com problema ou pendrive mal gravado",
   "O disco está sem sistema, não foi reconhecido ou a ordem de boot está errada",
   "A tecla é de outro fabricante: ver o manual ou entrar pelo Windows"
  ],
  "certa": 3,
  "explicacao": "Ver o manual do fabricante e testar Del, F2, F10, F12 ou Esc. No Windows, também dá para entrar por Configurações, Recuperação, Inicialização avançada."
 }
];

export const FS_SITS: { texto: string; certa: string; porque: string }[] = [
 {
  "texto": "Pendrive de 64 GB para levar vídeos de 6 GB entre um Mac e um Windows.",
  "certa": "exFAT",
  "porque": "Aceita arquivos acima de 4 GB e funciona nos dois sistemas."
 },
 {
  "texto": "Disco C: do Windows 11 no computador da recepção.",
  "certa": "NTFS",
  "porque": "É o sistema de arquivos do Windows."
 },
 {
  "texto": "Instalação do Linux Mint em um computador antigo.",
  "certa": "ext4",
  "porque": "É o padrão do Linux."
 },
 {
  "texto": "Partição EFI do disco, que guarda os arquivos de inicialização.",
  "certa": "FAT32",
  "porque": "A UEFI lê a partição EFI em FAT32."
 },
 {
  "texto": "Cartão de memória de 128 GB de uma câmera, que também será lido no computador.",
  "certa": "exFAT",
  "porque": "Aceita arquivos grandes e é lido em vários aparelhos."
 },
 {
  "texto": "Servidor Linux da empresa, instalação padrão.",
  "certa": "ext4",
  "porque": "É o sistema de arquivos padrão do Linux."
 }
];

export const FS_TABELA: { sistema: string; onde: string; carac: string }[] = [
 {
  "sistema": "NTFS",
  "onde": "Disco C: do Windows",
  "carac": "Aceita permissões, arquivos grandes e recuperação."
 },
 {
  "sistema": "FAT32",
  "onde": "Partição EFI e pendrives pequenos",
  "carac": "Compatível com quase tudo. Cada arquivo pode ter no máximo 4 GB."
 },
 {
  "sistema": "exFAT",
  "onde": "Pendrives e cartões grandes",
  "carac": "Aceita arquivos grandes e funciona no Windows e no Mac."
 },
 {
  "sistema": "ext4",
  "onde": "Linux",
  "carac": "Sistema padrão da maioria das instalações de Linux."
 }
];

export const ETAPAS_PEN: { id: string; texto: string }[] = [
 {
  "id": "A",
  "texto": "Escolher a opção Unidade flash USB como mídia"
 },
 {
  "id": "B",
  "texto": "Aguardar o fim da gravação e fechar a ferramenta"
 },
 {
  "id": "C",
  "texto": "Baixar a ferramenta de criação de mídia do site oficial da Microsoft"
 },
 {
  "id": "D",
  "texto": "Conectar um pendrive de 8 GB ou mais, depois de copiar o que houver nele"
 },
 {
  "id": "E",
  "texto": "Abrir a ferramenta e escolher idioma e edição"
 },
 {
  "id": "F",
  "texto": "Testar iniciando um computador pelo pendrive"
 }
];

export const ORDEM_PEN_CERTA: string[] = ["C","D","E","A","B","F"];

export const PEN_PERG: { pergunta: string; resposta: string }[] = [
 {
  "pergunta": "Por que o pendrive precisa ter 8 GB ou mais?",
  "resposta": "A imagem do Windows 11 ocupa vários gigabytes, e a ferramenta apaga tudo que está no pendrive."
 },
 {
  "pergunta": "Por que baixar o Windows só do site oficial da Microsoft?",
  "resposta": "Cópias de outros sites podem trazer vírus, e a licença do Windows é da Microsoft. Usar versão pirata fere a propriedade intelectual."
 },
 {
  "pergunta": "O que acontece com os arquivos que já estavam no pendrive?",
  "resposta": "São apagados. É preciso copiar o que importa antes de criar a mídia."
 },
 {
  "pergunta": "Como saber se o pendrive foi criado certo?",
  "resposta": "Iniciar um computador por ele e ver a tela de instalação do Windows."
 }
];

export const PARTS_AUTO: { nome: string; tamanho: string; fs: string; paraque: string }[] = [
 {
  "nome": "EFI",
  "tamanho": "100 MB",
  "fs": "FAT32",
  "paraque": "Guarda os arquivos que iniciam o sistema"
 },
 {
  "nome": "MSR",
  "tamanho": "16 MB",
  "fs": "Sem sistema de arquivos",
  "paraque": "Reservada pelo Windows"
 },
 {
  "nome": "C: Windows",
  "tamanho": "O espaço que sobra",
  "fs": "NTFS",
  "paraque": "O sistema e os programas"
 },
 {
  "nome": "Recuperação",
  "tamanho": "Cerca de 1 GB",
  "fs": "NTFS",
  "paraque": "Ferramentas para consertar o Windows"
 }
];

export const MITOS_A3: { texto: string; verdade: boolean; explicacao: string }[] = [
  { texto: "Excluir uma partição apaga os arquivos que estavam nela.", verdade: true, explicacao: "Por isso o backup vem antes de qualquer exclusão." },
  { texto: "Um pendrive com a ISO apenas copiada já inicia o computador.", verdade: false, explicacao: "É preciso criar a mídia de instalação com a ferramenta, que torna o pendrive inicializável." },
  { texto: "A ferramenta de criação de mídia regrava o pendrive e apaga o que havia nele.", verdade: true, explicacao: "Copie os arquivos importantes antes." },
  { texto: "Com internet, a licença digital costuma ativar sozinha depois de reinstalar o mesmo Windows.", verdade: true, explicacao: "A licença fica ligada ao equipamento e à conta, e a ativação acontece sozinha." },
  { texto: "Dá para baixar o Windows de qualquer site, desde que o link funcione.", verdade: false, explicacao: "Só do site oficial da Microsoft. Cópias de outros sites podem ter vírus e ferem a licença." },
  { texto: "O Windows 11 usa disco GPT com UEFI.", verdade: true, explicacao: "O Windows 11 exige UEFI, que trabalha com GPT." },
  { texto: "Depois da primeira reinicialização é preciso apertar uma tecla para continuar a instalação.", verdade: false, explicacao: "Não aperte nada. Apertar reinicia o instalador pelo pendrive." },
  { texto: "O backup do cliente vem antes de excluir partições.", verdade: true, explicacao: "Sem backup, o que for excluído não volta." },
];

export const PASSOS_INSTALADOR = ["Boot", "Idioma", "Instalar", "Chave", "Edição", "Termos", "Tipo", "Disco", "Cópia", "Primeiro uso"];

export type VideoA3 = { arquivo: string; titulo: string; resumo: string; duracao: string; pergunta: string };
export const VIDEOS_A3: VideoA3[] = [
 {
  "arquivo": "01-pendrive-bootavel.html",
  "titulo": "Criando o pendrive de instalação",
  "resumo": "Baixar a ferramenta oficial, gravar a imagem e testar. O que acontece com os arquivos do pendrive.",
  "duracao": "46 s",
  "pergunta": "Por que o pendrive só copiado com a ISO não inicia o computador?"
 },
 {
  "arquivo": "02-ordem-de-boot.html",
  "titulo": "A ordem de boot",
  "resumo": "O firmware testa os dispositivos de cima para baixo. Como o pendrive passa para o primeiro lugar.",
  "duracao": "46 s",
  "pergunta": "Por que o computador ignora o pendrive quando o SSD está em primeiro?"
 },
 {
  "arquivo": "03-particoes.html",
  "titulo": "Disco e partições",
  "resumo": "Excluir partições, espaço não alocado e o que o instalador cria sozinho.",
  "duracao": "48 s",
  "pergunta": "Por que o backup vem antes de excluir uma partição?"
 },
 {
  "arquivo": "04-sistemas-de-arquivos.html",
  "titulo": "Sistemas de arquivos",
  "resumo": "NTFS, FAT32, exFAT e ext4, e o limite de 4 GB do FAT32.",
  "duracao": "46 s",
  "pergunta": "Qual formato você usaria em um pendrive para levar vídeos grandes entre Windows e Mac?"
 },
 {
  "arquivo": "05-depois-da-copia.html",
  "titulo": "Depois da cópia dos arquivos",
  "resumo": "As reinicializações da instalação e o aviso de apertar qualquer tecla.",
  "duracao": "48 s",
  "pergunta": "O que acontece se você apertar uma tecla na primeira reinicialização?"
 }
];
export const CHECK_FISCAL: string[] = [
 "O backup foi feito antes de começar.",
 "A imagem veio do site oficial da Microsoft.",
 "A pessoa entrou na UEFI e colocou o pendrive em primeiro lugar.",
 "O idioma e o teclado estão certos.",
 "A pessoa escolheu a instalação Personalizada.",
 "A pessoa conferiu qual era o disco certo antes de excluir partições.",
 "A pessoa não apertou tecla depois da primeira reinicialização.",
 "A pessoa tirou o pendrive ao final ou devolveu a ordem de boot.",
 "O usuário foi criado e a rede foi conferida.",
 "A bancada ficou organizada e o pendrive foi guardado."
];
export const GPT_MBR: string[][] = [
 [
  "Usa com",
  "UEFI",
  "BIOS legada"
 ],
 [
  "Tamanho de disco",
  "Discos muito grandes",
  "Até 2 TB"
 ],
 [
  "Partições",
  "Até 128 no Windows",
  "Até 4 primárias"
 ],
 [
  "Windows 11",
  "Exige",
  "Não atende"
 ]
];
export const MISSOES_BIOS: { missao: string; texto: string }[] = [
 {
  "missao": "Missão 1",
  "texto": "Abra geekprank.com/bios. Anote o nome dos menus que aparecem na parte de cima da tela."
 },
 {
  "missao": "Missão 2",
  "texto": "Ache onde ficam a data e a hora do computador. Anote em qual menu estão e qual tecla muda o valor."
 },
 {
  "missao": "Missão 3",
  "texto": "Ache o menu de boot. Coloque o pendrive (USB) como primeiro dispositivo da lista."
 },
 {
  "missao": "Missão 4",
  "texto": "Saia da BIOS salvando as mudanças. Anote qual opção do menu você escolheu."
 },
 {
  "missao": "Missão 5",
  "texto": "Pesquise no site do fabricante, ou no manual, qual tecla abre a BIOS de um notebook Dell, um HP e um Lenovo. Anote a fonte."
 }
];
