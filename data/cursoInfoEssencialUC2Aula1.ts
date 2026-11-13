// Curso Informática Essencial. UC2, Aula 1 (Xanxerê 2026.25.103).
// Hardware, sistema operacional, requisitos do Windows 11 e cronograma de instalação.
// Gerado a partir dos mesmos dados dos materiais impressos.

export type Video = { arquivo: string; titulo: string; resumo: string; duracao: string; pergunta: string };
export const VIDEOS: Video[] = [
 {
  "arquivo": "01-camadas.html",
  "titulo": "As camadas do computador",
  "resumo": "Do usuário ao hardware: o que acontece quando você clica em Salvar. Onde entram o driver e o firmware.",
  "duracao": "45 s",
  "pergunta": "Por que o Word não grava direto no SSD?"
 },
 {
  "arquivo": "02-quatro-trabalhos.html",
  "titulo": "Os quatro trabalhos do sistema operacional",
  "resumo": "Processos, memória, dispositivos e arquivos, com um exemplo de cada.",
  "duracao": "51 s",
  "pergunta": "Qual dos quatro trabalhos aparece quando você pluga um pen drive?"
 },
 {
  "arquivo": "03-boot.html",
  "titulo": "Como o computador liga",
  "resumo": "Do botão ao Windows: firmware, POST, ordem de boot e carregador.",
  "duracao": "47 s",
  "pergunta": "Onde se muda a ordem de boot para instalar pelo pendrive?"
 },
 {
  "arquivo": "04-requisitos.html",
  "titulo": "Pode ou não pode: requisitos do Windows 11",
  "resumo": "Duas fichas técnicas conferidas requisito por requisito.",
  "duracao": "50 s",
  "pergunta": "Qual das duas máquinas vale a pena consertar com upgrade? Por quê?"
 },
 {
  "arquivo": "05-cronograma.html",
  "titulo": "Cronograma da instalação",
  "resumo": "Três computadores, dois pendrives e uma manhã de sábado.",
  "duracao": "47 s",
  "pergunta": "Por que o PC 4 pode começar às 08h45 e não às 09h45?"
 },
 {
  "arquivo": "06-32-e-64-bits.html",
  "titulo": "32 bits ou 64 bits",
  "resumo": "Quanta memória cada tipo de sistema consegue usar.",
  "duracao": "31 s",
  "pergunta": "Como descobrir se o seu Windows é de 32 ou de 64 bits?"
 }
];
export const CATEGORIAS = [{"id":"hw","rotulo":"Hardware"},{"id":"so","rotulo":"Sistema operacional"},{"id":"app","rotulo":"Aplicativo"},{"id":"fw","rotulo":"Firmware"},{"id":"drv","rotulo":"Driver"}];
export const QUEM_E_QUEM: { texto: string; certa: string; explicacao: string }[] = [
 {
  "texto": "Processador",
  "certa": "hw",
  "explicacao": "Peça física que executa as instruções."
 },
 {
  "texto": "Windows 11",
  "certa": "so",
  "explicacao": "Gerencia o computador e liga o hardware aos programas."
 },
 {
  "texto": "Word",
  "certa": "app",
  "explicacao": "Programa que o usuário abre para fazer uma tarefa, no caso escrever."
 },
 {
  "texto": "BIOS ou UEFI",
  "certa": "fw",
  "explicacao": "Programa gravado em um chip da placa-mãe, que roda antes do sistema."
 },
 {
  "texto": "Driver da impressora",
  "certa": "drv",
  "explicacao": "Ensina o sistema operacional a conversar com a impressora."
 },
 {
  "texto": "Memória RAM",
  "certa": "hw",
  "explicacao": "Peça física que guarda os dados em uso."
 },
 {
  "texto": "Google Chrome",
  "certa": "app",
  "explicacao": "Navegador, instalado e executado sobre o sistema."
 },
 {
  "texto": "Linux",
  "certa": "so",
  "explicacao": "Outro sistema operacional, ao lado do Windows e do macOS."
 },
 {
  "texto": "Teclado",
  "certa": "hw",
  "explicacao": "Periférico de entrada, uma peça física."
 },
 {
  "texto": "Antivírus",
  "certa": "app",
  "explicacao": "Utilitário de segurança que roda sobre o sistema."
 },
 {
  "texto": "SSD",
  "certa": "hw",
  "explicacao": "Peça física onde os arquivos e o sistema ficam gravados."
 },
 {
  "texto": "Android",
  "certa": "so",
  "explicacao": "Sistema que gerencia o celular e liga o hardware aos aplicativos."
 },
 {
  "texto": "Excel",
  "certa": "app",
  "explicacao": "Programa que o usuário abre para fazer planilhas."
 },
 {
  "texto": "Firmware do roteador",
  "certa": "fw",
  "explicacao": "Programa gravado dentro do próprio roteador."
 },
 {
  "texto": "Driver da placa de vídeo",
  "certa": "drv",
  "explicacao": "Permite que o sistema use a placa de vídeo corretamente."
 },
 {
  "texto": "Mouse",
  "certa": "hw",
  "explicacao": "Periférico de entrada, uma peça física."
 },
 {
  "texto": "macOS",
  "certa": "so",
  "explicacao": "Sistema operacional dos computadores da Apple."
 },
 {
  "texto": "WinRAR",
  "certa": "app",
  "explicacao": "Utilitário de compressão, instalado sobre o sistema."
 },
 {
  "texto": "UEFI do notebook",
  "certa": "fw",
  "explicacao": "Firmware da placa-mãe, que prepara o computador antes do sistema."
 },
 {
  "texto": "Driver do Wi-Fi",
  "certa": "drv",
  "explicacao": "Faz o sistema reconhecer e usar a placa de rede sem fio."
 },
 {
  "texto": "PowerPoint",
  "certa": "app",
  "explicacao": "Gaveta certa: Aplicativo."
 },
 {
  "texto": "UEFI",
  "certa": "fw",
  "explicacao": "Gaveta certa: Firmware."
 },
 {
  "texto": "Ubuntu",
  "certa": "so",
  "explicacao": "Gaveta certa: Sistema operacional."
 },
 {
  "texto": "Placa de vídeo",
  "certa": "hw",
  "explicacao": "Gaveta certa: Hardware."
 },
 {
  "texto": "Driver da webcam",
  "certa": "drv",
  "explicacao": "Gaveta certa: Driver."
 }
];
export const FUNCOES = [{"id":"Processos","rotulo":"Processos"},{"id":"Memória","rotulo":"Memória"},{"id":"Dispositivos","rotulo":"Dispositivos"},{"id":"Arquivos","rotulo":"Arquivos"}];
export const SO_FUNCOES: { texto: string; certa: string }[] = [
 {
  "texto": "Você abre o Word e o Chrome ao mesmo tempo e os dois continuam funcionando.",
  "certa": "Processos"
 },
 {
  "texto": "O Windows avisa que um programa está usando quase toda a RAM.",
  "certa": "Memória"
 },
 {
  "texto": "Ao plugar o pen drive, a letra E: aparece e você abre os arquivos dele.",
  "certa": "Dispositivos"
 },
 {
  "texto": "Você salva a planilha na pasta Documentos e a encontra no dia seguinte.",
  "certa": "Arquivos"
 },
 {
  "texto": "O Gerenciador de Tarefas mostra quanto do processador cada programa usa.",
  "certa": "Processos"
 },
 {
  "texto": "A impressora só funciona depois que o driver certo é instalado.",
  "certa": "Dispositivos"
 },
 {
  "texto": "O sistema decide em que parte da RAM cada programa vai ficar.",
  "certa": "Memória"
 },
 {
  "texto": "Você cria, renomeia, copia e apaga pastas dentro do Explorador de Arquivos.",
  "certa": "Arquivos"
 }
];
export const SISTEMAS = [{"id":"Windows","rotulo":"Windows"},{"id":"Linux","rotulo":"Linux"},{"id":"macOS","rotulo":"macOS"},{"id":"Android","rotulo":"Android"},{"id":"iOS","rotulo":"iOS"}];
export const EQUIPAMENTOS: { texto: string; certa: string }[] = [
 {
  "texto": "Celular Samsung da Dona Marlene",
  "certa": "Android"
 },
 {
  "texto": "iPhone do sócio",
  "certa": "iOS"
 },
 {
  "texto": "MacBook do designer do escritório vizinho",
  "certa": "macOS"
 },
 {
  "texto": "Computador da recepção, que roda o programa contábil",
  "certa": "Windows"
 },
 {
  "texto": "Servidor do provedor de internet da cidade",
  "certa": "Linux"
 }
];
export const VEREDITOS = [{ id: "pode", rotulo: "Pode" },{ id: "upgrade", rotulo: "Pode com upgrade" },{ id: "config", rotulo: "Pode, ajustando a BIOS" },{ id: "nao", rotulo: "Não pode" }];
export const FICHAS: { nome: string; proc: string; ram: string; disco: string; fw: string; tpm: string; certa: string; explicacao: string }[] = [
 {
  "nome": "PC 1, Recepção",
  "proc": "Intel Core i3-8100 (8ª geração), 4 núcleos, 3,6 GHz, 64 bits",
  "ram": "8 GB",
  "disco": "SSD de 240 GB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0",
  "certa": "pode",
  "explicacao": "Atende a todos os requisitos."
 },
 {
  "nome": "PC 2, Sala da contadora",
  "proc": "Intel Core i5-4570 (4ª geração), 4 núcleos, 3,2 GHz, 64 bits",
  "ram": "8 GB",
  "disco": "HD de 500 GB",
  "fw": "BIOS antiga, sem UEFI",
  "tpm": "Sem TPM",
  "certa": "nao",
  "explicacao": "Processador de 4ª geração fora da lista, sem UEFI e sem TPM. Trocar peças custaria quase um computador novo."
 },
 {
  "nome": "PC 3, Arquivo",
  "proc": "Intel Pentium Dual-Core E5300, 2 núcleos, 2,6 GHz",
  "ram": "2 GB",
  "disco": "HD de 160 GB",
  "fw": "BIOS antiga, sem UEFI",
  "tpm": "Sem TPM",
  "certa": "nao",
  "explicacao": "Processador antigo, pouca RAM, sem UEFI e sem TPM. Mesmo com mais RAM, o processador e o firmware barram."
 },
 {
  "nome": "PC 4, Financeiro",
  "proc": "AMD Ryzen 5 3500, 6 núcleos, 3,6 GHz, 64 bits",
  "ram": "2 GB",
  "disco": "HD de 1 TB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0 (no processador)",
  "certa": "upgrade",
  "explicacao": "Só a RAM não atende. Com pelo menos 4 GB (o ideal é 8 GB) passa a atender."
 },
 {
  "nome": "PC 5, Notebook da sócia",
  "proc": "Intel Core i5-1135G7 (11ª geração), 4 núcleos, 64 bits",
  "ram": "16 GB",
  "disco": "SSD de 512 GB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0",
  "certa": "pode",
  "explicacao": "Atende a todos os requisitos."
 },
 {
  "nome": "Padaria Pão Quente",
  "proc": "Intel Core i7-9700 (9ª geração)",
  "ram": "16 GB",
  "disco": "SSD de 512 GB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0",
  "certa": "pode",
  "explicacao": "Todos os requisitos atendidos."
 },
 {
  "nome": "Oficina Mecânica Irmãos Dal Pozzo",
  "proc": "Intel Core i3-3220 (3ª geração)",
  "ram": "4 GB",
  "disco": "HD de 500 GB",
  "fw": "BIOS antiga, sem UEFI",
  "tpm": "Sem TPM",
  "certa": "nao",
  "explicacao": "Processador de 3ª geração, sem UEFI e sem TPM."
 },
 {
  "nome": "Escola de Idiomas Fala Mundo",
  "proc": "AMD Ryzen 5 5600G",
  "ram": "8 GB",
  "disco": "HD de 1 TB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0",
  "certa": "pode",
  "explicacao": "Atende a tudo. O HD funciona, mas um SSD deixaria o computador bem mais rápido."
 },
 {
  "nome": "Consultório Dr. Bellani",
  "proc": "Intel Core i5-10210U (10ª geração)",
  "ram": "8 GB",
  "disco": "SSD de 256 GB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0 desativado na BIOS",
  "certa": "config",
  "explicacao": "O recurso existe, está só desligado. Basta entrar na BIOS e ativar o TPM."
 },
 {
  "nome": "Loja Moda Sul",
  "proc": "Intel Core i5-7400 (7ª geração)",
  "ram": "8 GB",
  "disco": "SSD de 256 GB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0",
  "certa": "nao",
  "explicacao": "Processador de 7ª geração fora da lista da Microsoft, apesar do resto estar certo."
 },
 {
  "nome": "Mercadinho Estrela",
  "proc": "Intel Core i5-9400 (9ª geração)",
  "ram": "8 GB",
  "disco": "SSD de 32 GB",
  "fw": "UEFI com Inicialização Segura",
  "tpm": "TPM 2.0",
  "certa": "upgrade",
  "explicacao": "Só o armazenamento não atende, pois o mínimo é 64 GB. Trocar por um SSD maior resolve."
 }
];
export const REQUISITOS: [string, string][] = [["Processador","64 bits, 2 ou mais núcleos, 1 GHz ou mais, e estar na lista da Microsoft (em geral Intel de 8ª geração em diante e AMD Ryzen 2000 em diante)"],["Memória RAM","4 GB ou mais"],["Armazenamento","64 GB ou mais"],["Firmware","UEFI com Inicialização Segura (Secure Boot)"],["TPM","Versão 2.0"]];
export const ETAPAS: { id: string; texto: string }[] = [
 {
  "id": "A",
  "texto": "Instalar os drivers"
 },
 {
  "id": "B",
  "texto": "Fazer backup dos arquivos do cliente"
 },
 {
  "id": "C",
  "texto": "Testar com o usuário e entregar a máquina"
 },
 {
  "id": "D",
  "texto": "Criar o pendrive bootável com o instalador"
 },
 {
  "id": "E",
  "texto": "Atualizar o Windows"
 },
 {
  "id": "F",
  "texto": "Conferir os requisitos de hardware e a licença"
 },
 {
  "id": "G",
  "texto": "Na BIOS ou UEFI, escolher o pendrive como primeiro dispositivo de boot"
 },
 {
  "id": "H",
  "texto": "Instalar e configurar os programas do cliente"
 },
 {
  "id": "I",
  "texto": "Instalar o sistema operacional (particionar e formatar)"
 }
];
export const ORDEM_CERTA: string[] = ["F","B","D","G","I","A","E","H","C"];
export const MITOS: { texto: string; verdade: boolean; explicacao: string }[] = [
 {
  "texto": "Quanto mais RAM, sempre mais rápido o computador.",
  "verdade": false,
  "explicacao": "A RAM extra só ajuda quando a memória está faltando. Se já sobra, o ganho é pequeno. Um SSD costuma fazer mais diferença."
 },
 {
  "texto": "Oficialmente, o Windows 11 exige UEFI com Inicialização Segura e TPM 2.0.",
  "verdade": true,
  "explicacao": "Esses dois estão na lista de requisitos, junto com o processador compatível, 4 GB de RAM e 64 GB de armazenamento."
 },
 {
  "texto": "Firmware e driver são a mesma coisa.",
  "verdade": false,
  "explicacao": "O firmware fica gravado em um chip da peça. O driver é um programa instalado no sistema operacional que ensina o sistema a usar a peça."
 },
 {
  "texto": "Um Windows de 32 bits aproveita 16 GB de RAM sem problema.",
  "verdade": false,
  "explicacao": "O sistema de 32 bits enxerga só cerca de 4 GB. O restante fica sem uso."
 },
 {
  "texto": "Antes de instalar um sistema novo, o backup precisa estar pronto.",
  "verdade": true,
  "explicacao": "Uma instalação limpa formata o disco e apaga tudo. Sem backup, o cliente perde os arquivos."
 },
 {
  "texto": "Instalar um sistema operacional novo preserva os arquivos automaticamente.",
  "verdade": false,
  "explicacao": "Só a atualização preserva arquivos, e mesmo assim pode falhar. A instalação limpa apaga o disco."
 },
 {
  "texto": "Um Linux leve pode dar vida nova a um computador antigo que não passa no Windows 11.",
  "verdade": true,
  "explicacao": "Existem distribuições leves para máquinas antigas. É uma alternativa para o PC 2 e o PC 3 do escritório."
 },
 {
  "texto": "O nome ou o ano do computador decide se ele aceita o Windows 11.",
  "verdade": false,
  "explicacao": "O que decide é a ficha técnica: processador, RAM, armazenamento, firmware e TPM."
 }
];
