// chatbot.js (modificado)
const qrcode = require('qrcode');
const express = require('express');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Importar configuração do banco de dados
const { pool, testConnection } = require('./db/config');
const authRoutes = require('./routes/auth');
const { isAuthenticated, isDashboardAuthenticated } = require('./middleware/auth');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Configuração do armazenamento de sessão MySQL
const sessionStore = new MySQLStore({}, pool);

app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret_key', // Substitua por uma chave secreta forte
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Use `true` se estiver usando HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

// Configuração do body-parser para lidar com formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Testar conexão com o banco de dados
testConnection();

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rota protegida para o chatbot (index.html)
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para o formulário de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// Página de login da dashboard
app.get('/dashboard-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'dashboard-login.html'));
});

// Rota protegida para a Dashboard
app.get('/dashboard', isDashboardAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'dashboard.html'));
});

// Bloquear acesso direto a arquivos estáticos protegidos
app.use('/public', isAuthenticated, express.static(path.join(__dirname, 'public')));

// Middleware para proteger rotas
app.use((req, res, next) => {
    // Lista de rotas que não precisam de autenticação
    const publicPaths = ['/login', '/auth/login', '/auth/logout'];

    // Verificar se a rota é pública
    if (publicPaths.includes(req.path) || req.path.startsWith('/css/') || req.path.startsWith('/js/')) {
        return next();
    }

    // Verificar autenticação para outras rotas
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
});

// Configuração dos clientes WhatsApp (manter código original)
const mainClient = new Client({ puppeteer: { headless: true }, name: 'main-bot' });
const appointmentClient = new Client({ puppeteer: { headless: true }, name: 'appointment-bot' });
const rescheduleClient = new Client({ puppeteer: { headless: true }, name: 'reschedule-bot' });

// Objetos para armazenar estados dos bots (manter código original)
const bots = {
    main: {
        client: mainClient,
        qrCodeData: '',
        name: 'Bot 1'
    },
    appointment: {
        client: appointmentClient,
        qrCodeData: '',
        name: 'Bot 2'
    },
    reschedule: {
        client: rescheduleClient,
        qrCodeData: '',
        name: 'Bot 3'
    }
};

// Função de delay comum para todos os bots (manter código original)
const delay = ms => new Promise(res => setTimeout(res, ms));

// Função para registrar conexões no terminal e em um arquivo (manter código original)
const logConnection = (botName) => {
    const now = new Date();
    const timestamp = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const logMessage = `Bot Conectado: ${botName} | Horário: ${timestamp}`;
    const formattedLog = `---\n${logMessage}\n---\n`;

    // Imprimir no terminal
    console.log(logMessage);

    // Salvar no arquivo de registro
    fs.appendFileSync('connection_logs.txt', formattedLog, (err) => {
        if (err) {
            console.error('Erro ao salvar no arquivo de registro:', err);
        }
    });
};

// Contadores de atendimentos por bot (manter código original)
const atendimentoCount = {
    main: 0,
    appointment: 0,
    reschedule: 0
};

// Set para armazenar contatos já atendidos por bot (manter código original)
const atendidos = {
    main: new Set(),
    appointment: new Set(),
    reschedule: new Set()
};

// Função para incrementar atendimento e emitir evento (manter código original)
function registrarAtendimento(botKey, contato) {
    if (!atendidos[botKey].has(contato)) {
        atendimentoCount[botKey]++;
        atendidos[botKey].add(contato);
        io.emit('atendimento-update', { bot: botKey, count: atendimentoCount[botKey] });
    }
}

// Configurar eventos para cada bot (manter código original)
Object.keys(bots).forEach(botKey => {
    const bot = bots[botKey];

    bot.client.on('ready', () => {
        const botName = bot.name;
        logConnection(botName); // Registrar a conexão
        io.emit('connection-status', { bot: botKey, connected: true }); // Emitir status de conexão
    });

    bot.client.on('disconnected', () => {
        console.log(`Um cliente se desconectou do ${bot.name}`); // Exibe qual bot foi desconectado
        io.emit('connection-status', { bot: botKey, connected: false }); // Emitir status de desconexão
    });

    bot.client.on('qr', async(qr) => {
        try {
            // Gera o QR Code e armazena no cache
            bot.qrCodeData = await qrcode.toDataURL(qr);
            console.log(`QR Code do ${bot.name} gerado com sucesso`);

            // Emite o QR Code para o frontend via Socket.IO
            io.emit('qrcode', { bot: botKey, qrcode: bot.qrCodeData });

            // Configura a geração contínua de QR Codes a cada 15 segundos
            setInterval(async() => {
                bot.qrCodeData = await qrcode.toDataURL(qr);
                console.log(`Novo QR Code do ${bot.name} gerado`);
                io.emit('qrcode', { bot: botKey, qrcode: bot.qrCodeData });
            }, 13000); // 13 segundos
        } catch (err) {
            console.error(`Erro ao gerar QR Code para ${bot.name}:`, err);
        }
    });

    bot.client.initialize();
});

Object.keys(bots).forEach(botKey => {
    const bot = bots[botKey];

    bot.client.on('ready', () => {
        logConnection(bot.name);
        io.emit('connection-status', { bot: botKey, connected: true });
    });

    bot.client.on('disconnected', () => {
        // Limpar info para garantir que o status fique correto
        if (bot.client.info) bot.client.info = null;
        io.emit('connection-status', { bot: botKey, connected: false });
    });
});

// Rota para obter o QR code de um bot específico (protegida)
app.get('/qrcode/:bot', isDashboardAuthenticated, (req, res) => {
    const botKey = req.params.bot;
    if (bots[botKey] && bots[botKey].qrCodeData) {
        res.json({ qrcode: bots[botKey].qrCodeData });
    } else {
        res.status(404).json({ error: 'QR Code ainda não disponível ou bot inválido' });
    }
});

// Rota para obter o status de conexão de todos os bots (protegida)
app.get('/all-connection-status', isDashboardAuthenticated, (req, res) => {
    const status = {};
    Object.keys(bots).forEach(botKey => {
        const client = bots[botKey].client;
        status[botKey] = client.info && client.info.wid ? true : false; // Verifica se o cliente está conectado
    });
    res.json(status);
});

// Rota para verificar o status de um bot específico (protegida)
app.get('/check-status/:bot', isDashboardAuthenticated, (req, res) => {
    const botKey = req.params.bot;
    if (bots[botKey]) {
        const client = bots[botKey].client;
        const isConnected = client.info && client.info.wid ? true : false; // Verifica se o cliente está conectado
        res.json({ connected: isConnected });
    } else {
        res.status(404).json({ error: 'Bot não encontrado' });
    }
});

// Nova rota para pegar os contadores atuais (protegida)
app.get('/atendimentos', isDashboardAuthenticated, (req, res) => {
    res.json(atendimentoCount);
});

app.post('/dashboard-update-password', isDashboardAuthenticated, async(req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ error: 'Senha não informada.' });
    }
    try {
        // Atualiza a senha do usuário da dashboard
        await pool.execute('UPDATE users SET password = ? WHERE username = ?', [newPassword, 'pabloAdmin']);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar senha.' });
    }
});

// Rotas da dashboard (exemplo)
app.get('/users', isDashboardAuthenticated, async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, email, whatsapp FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.get('/server-status', isDashboardAuthenticated, (req, res) => {
    res.json({ status: 'online' });
});

app.get('/total-users', isDashboardAuthenticated, async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM users');
        const totalUsers = rows[0].total;
        res.json({ total: totalUsers });
    } catch (error) {
        console.error('Erro ao buscar o total de usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar o total de usuários' });
    }
});

// Rota para buscar usuários do banco de dados com base em uma consulta
app.get('/users/search', isDashboardAuthenticated, async(req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Parâmetro de busca não fornecido.' });
    }

    try {
        // Remova o filtro do username
        const [rows] = await pool.execute(
            `SELECT id, username, email, whatsapp 
             FROM users 
             WHERE LOWER(username) LIKE ? OR whatsapp LIKE ?`, [`%${query.toLowerCase()}%`, `%${query}%`]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

// Rota para adicionar um novo usuário
app.post('/users', isDashboardAuthenticated, async(req, res) => {
    const { username, email, whatsapp, password } = req.body;

    if (!username || !email || !whatsapp || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, whatsapp, password) VALUES (?, ?, ?, ?)', [username, email, whatsapp, password]
        );

        // Emitir evento para atualizar o total de usuários
        const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE username != ?', ['pabloAdmin']);
        io.emit('user-added', { totalUsers: rows[0].total });

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.insertId });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

// Rota para excluir um usuário
app.delete('/users/:id', isDashboardAuthenticated, async(req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows > 0) {
            // Emitir evento para atualizar o total de usuários
            const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM users');
            io.emit('user-removed', { totalUsers: rows[0].total });

            res.status(200).json({ message: 'Usuário excluído com sucesso!' });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
});

// Rota para verificar o status do servidor
app.get('/server-status', isDashboardAuthenticated, (req, res) => {
    res.json({ status: 'online' });
});

// Rota para obter o total de usuários (protegida)
app.get('/users/count', isDashboardAuthenticated, async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM users');
        res.status(200).json({ totalUsers: rows[0].total });
    } catch (error) {
        console.error('Erro ao obter o total de usuários:', error);
        res.status(500).json({ error: 'Erro ao obter o total de usuários.' });
    }
});

// Rota para buscar um usuário específico (incluindo a senha)
app.get('/users/:id', isDashboardAuthenticated, async(req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.execute('SELECT id, username, email, whatsapp, password FROM users WHERE id = ?', [userId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// Rota para atualizar um usuário
app.put('/users/:id', isDashboardAuthenticated, async(req, res) => {
    const userId = req.params.id;
    const { username, email, whatsapp, password } = req.body;

    if (!username || !email || !whatsapp) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        let query, params;
        if (password && password.trim() !== '') {
            query = 'UPDATE users SET username = ?, email = ?, whatsapp = ?, password = ? WHERE id = ?';
            params = [username, email, whatsapp, password, userId];
        } else {
            query = 'UPDATE users SET username = ?, email = ?, whatsapp = ? WHERE id = ?';
            params = [username, email, whatsapp, userId];
        }

        const [result] = await pool.execute(query, params);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// BOT PRINCIPAL - Mantendo a lógica existente
mainClient.on('message', async msg => {
    if (msg.from.endsWith('@c.us')) {
        registrarAtendimento('main', msg.from);
    }
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
    if (msg.from.endsWith('@c.us')) {
        registrarAtendimento('appointment', msg.from);
    }
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
    if (msg.from.endsWith('@c.us')) {
        registrarAtendimento('reschedule', msg.from);
    }
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
    // Verificar sessão do socket
    const session = socket.request.session;
    if (session && session.userId) {
        // Enviar QR codes existentes para o cliente
        Object.keys(bots).forEach(botKey => {
            if (bots[botKey].qrCodeData) {
                socket.emit('qrcode', { bot: botKey, qrcode: bots[botKey].qrCodeData });
            }
        });

        // Enviar status atual de conexão
        Object.keys(bots).forEach(botKey => {
            const client = bots[botKey].client;
            const isConnected = client.info && client.info.wid ? true : false;
            socket.emit('connection-status', { bot: botKey, connected: isConnected });
        });

        // Enviar contadores atuais
        Object.keys(atendimentoCount).forEach(botKey => {
            socket.emit('atendimento-update', { bot: botKey, count: atendimentoCount[botKey] });
        });
    }
});

// Iniciar o servidor
server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});