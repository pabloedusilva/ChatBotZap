const qrcode = require('qrcode');
const express = require('express');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Configuração dos clientes WhatsApp
const mainClient = new Client({ puppeteer: { headless: true }, name: 'main-bot' });
const appointmentClient = new Client({ puppeteer: { headless: true }, name: 'appointment-bot' });
const rescheduleClient = new Client({ puppeteer: { headless: true }, name: 'reschedule-bot' });

// Objetos para armazenar estados dos bots
const bots = {
    main: {
        client: mainClient,
        qrCodeData: '',
        name: 'Principal'
    },
    appointment: {
        client: appointmentClient,
        qrCodeData: '',
        name: 'Agendamento'
    },
    reschedule: {
        client: rescheduleClient,
        qrCodeData: '',
        name: 'Reagendamento'
    }
};

// Função de delay comum para todos os bots
const delay = ms => new Promise(res => setTimeout(res, ms));

// Configurar eventos para cada bot
Object.keys(bots).forEach(botKey => {
    const bot = bots[botKey];

    bot.client.on('ready', () => {
        console.log(`Um cliente se conectou ao ${botKey === 'main' ? 'Bot 1' : botKey === 'appointment' ? 'Bot 2' : 'Bot 3'}`); // Exibe qual bot foi conectado
        io.emit('connection-status', { bot: botKey, connected: true }); // Emitir status de conexão
    });

    bot.client.on('disconnected', () => {
        console.log(`Um cliente se desconectou do ${botKey === 'main' ? 'Bot 1' : botKey === 'appointment' ? 'Bot 2' : 'Bot 3'}`); // Exibe qual bot foi desconectado
        io.emit('connection-status', { bot: botKey, connected: false }); // Emitir status de desconexão
    });

    bot.client.on('qr', async (qr) => {
        try {
            bot.qrCodeData = await qrcode.toDataURL(qr);
            console.log(`QR Code do ${botKey === 'main' ? 'Bot 1' : botKey === 'appointment' ? 'Bot 2' : 'Bot 3'} gerado com sucesso`);
            io.emit('qrcode', { bot: botKey, qrcode: bot.qrCodeData });
        } catch (err) {
            console.error(`Erro ao gerar QR code para ${botKey === 'main' ? 'Bot 1' : botKey === 'appointment' ? 'Bot 2' : 'Bot 3'}:`, err);
        }
    });

    bot.client.initialize();
});

// Configuração das rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para obter o QR code de um bot específico
app.get('/qrcode/:bot', (req, res) => {
    const botKey = req.params.bot;
    if (bots[botKey] && bots[botKey].qrCodeData) {
        res.json({ qrcode: bots[botKey].qrCodeData });
    } else {
        res.status(404).json({ error: 'QR Code ainda não disponível ou bot inválido' });
    }
});

// Rota para obter o status de conexão de todos os bots
app.get('/all-connection-status', (req, res) => {
    const status = {};
    Object.keys(bots).forEach(botKey => {
        status[botKey] = bots[botKey].client.info ? true : false; // Verifica se o cliente está conectado
    });
    res.json(status);
});

// BOT PRINCIPAL - Mantendo a lógica existente
mainClient.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|bom dia|Bom dia|boa tarde|Boa tarde|boa noite|Boa noite|alô|Alô|alo|Alo|ei|Ei|como vai|Como vai|tudo bem|Tudo bem|saudações|Saudações|eae|Eae|e aí|E aí|preciso de ajuda|Preciso de ajuda|atendimento|Atendimento|suporte|Suporte|começar|Começar|iniciar|Iniciar|start|Start|info|Info|ajuda|Ajuda|help|Help)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const contact = await msg.getContact(); //Pegando o contato
        const name = contact.pushname; //Pegando o nome do contato
        await mainClient.sendMessage(msg.from, 'Olá! ' + name.split(" ")[0] + ' Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas'); //Primeira mensagem de texto
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(5000); //Delay de 5 segundos
    }

    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas\n\nAlém disso, temos uma ampla gama de benefícios, incluindo acesso a cursos gratuitos');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nFaça seu cadastro e escolha o plano que desejar.\n\n2º Passo\nApós efetuar o pagamento do plano escolhido você já terá acesso a nossa área exclusiva para começar seu atendimento na mesma hora.\n\n3º Passo\nSempre que precisar');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Sorteio de em prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await mainClient.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site: https://site.com ');
    }
});

// BOT DE AGENDAMENTO
appointmentClient.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|bom dia|Bom dia|boa tarde|Boa tarde|boa noite|Boa noite|alô|Alô|alo|Alo|ei|Ei|como vai|Como vai|tudo bem|Tudo bem|saudações|Saudações|eae|Eae|e aí|E aí|preciso de ajuda|Preciso de ajuda|atendimento|Atendimento|suporte|Suporte|começar|Começar|iniciar|Iniciar|start|Start|info|Info|ajuda|Ajuda|help|Help)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname;

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual de agendamentos. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Agendar consulta\n2 - Horários disponíveis\n3 - Especialidades\n4 - Como funciona o agendamento\n5 - Falar com atendente`);
        await delay(3000);
        await chat.sendStateTyping();
        await delay(5000);
    }

    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, 'Para agendar uma consulta, preciso das seguintes informações:\n\n1. Qual especialidade deseja?\n2. Qual a data preferida? (dia/mês)\n3. Qual período do dia é melhor para você? (manhã/tarde/noite)\n\nPor favor, digite *especialidade* para começar o agendamento.');
    }

    if (msg.body !== null && msg.body.toLowerCase() === 'especialidade' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, 'Por favor, escolha uma das especialidades abaixo:\n\n*1* - Clínico Geral\n*2* - Cardiologia\n*3* - Pediatria\n*4* - Ginecologia\n*5* - Ortopedia\n*6* - Dermatologia');
    }

    // Simulação de seleção de especialidade
    if (msg.body !== null && ['1', '2', '3', '4', '5', '6'].includes(msg.body) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        const especialidades = {
            '1': 'Clínico Geral',
            '2': 'Cardiologia',
            '3': 'Pediatria',
            '4': 'Ginecologia',
            '5': 'Ortopedia',
            '6': 'Dermatologia'
        };

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, `Você selecionou: ${especialidades[msg.body]}. Agora, por favor, digite a data desejada no formato DD/MM. Exemplo: 25/04`);
    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, 'Os horários disponíveis para agendamento são:\n\n*Manhã:* 08:00, 09:00, 10:00, 11:00\n*Tarde:* 13:00, 14:00, 15:00, 16:00, 17:00\n*Noite:* 18:00, 19:00, 20:00');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, 'Oferecemos as seguintes especialidades:\n\n• Clínico Geral\n• Cardiologia\n• Pediatria\n• Ginecologia\n• Ortopedia\n• Dermatologia\n• Psicologia\n• Nutrição\n• Fisioterapia');
    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, 'O agendamento é feito em 3 passos simples:\n\n1. Escolha a especialidade médica\n2. Selecione a data e horário disponíveis\n3. Confirme seus dados\n\nPronto! Sua consulta será agendada e você receberá uma confirmação.');
    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await appointmentClient.sendMessage(msg.from, 'Entendo que você precisa de atendimento personalizado. Em breve, um de nossos atendentes entrará em contato com você. Obrigado pela paciência!');
    }
});

// BOT DE CANCELAMENTO/REAGENDAMENTO
rescheduleClient.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|bom dia|Bom dia|boa tarde|Boa tarde|boa noite|Boa noite|alô|Alô|alo|Alo|ei|Ei|como vai|Como vai|tudo bem|Tudo bem|saudações|Saudações|eae|Eae|e aí|E aí|preciso de ajuda|Preciso de ajuda|atendimento|Atendimento|suporte|Suporte|começar|Começar|iniciar|Iniciar|start|Start|info|Info|ajuda|Ajuda|help|Help)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname;

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual de cancelamento e reagendamento. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Cancelar consulta\n2 - Reagendar consulta\n3 - Verificar consultas agendadas\n4 - Política de cancelamento\n5 - Falar com atendente`);
        await delay(3000);
        await chat.sendStateTyping();
        await delay(5000);
    }

    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Para cancelar uma consulta, por favor, informe o número do seu CPF ou o código de agendamento que você recebeu por e-mail ou SMS.');
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Após a verificação, confirmaremos o cancelamento da sua consulta. Lembre-se que cancelamentos com menos de 4 horas de antecedência podem estar sujeitos à nossa política de cancelamento.');
    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Para reagendar uma consulta, preciso primeiro localizar seu agendamento atual. Por favor, informe o número do seu CPF ou o código de agendamento.');
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Após a verificação, poderei mostrar os horários disponíveis para reagendamento. O processo é simples e rápido!');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Para verificar suas consultas agendadas, por favor, informe o número do seu CPF para que eu possa buscar no sistema.');
    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Nossa política de cancelamento:\n\n• Cancelamentos com mais de 24h de antecedência: sem custos\n• Cancelamentos entre 4h e 24h de antecedência: taxa de 30%\n• Cancelamentos com menos de 4h de antecedência: taxa de 50%\n• Não comparecimento sem aviso: cobrança integral\n\nPara mais informações, visite nosso site: https://site.com/politica-cancelamento');
    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await rescheduleClient.sendMessage(msg.from, 'Entendo que você precisa de atendimento personalizado. Em breve, um de nossos atendentes entrará em contato com você. Obrigado pela paciência!');
    }
});

// Socket.io para atualizações em tempo real
io.on('connection', (socket) => {
    // Enviar QR codes existentes para o cliente
    Object.keys(bots).forEach(botKey => {
        if (bots[botKey].qrCodeData) {
            socket.emit('qrcode', { bot: botKey, qrcode: bots[botKey].qrCodeData });
        }
    });

    // Não exibir "Um cliente se conectou/desconectou" ao abrir o site
    socket.on('disconnect', () => {
        // Nenhuma ação necessária aqui
    });
});

// Iniciar o servidor
server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

