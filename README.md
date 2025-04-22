# Documentação Técnica: WhatsApp Chatbot

---

## **Visão Geral**

O **WhatsApp Chatbot** é uma aplicação desenvolvida para gerenciar múltiplos bots de atendimento no WhatsApp. Ele oferece funcionalidades como autenticação de usuários, gerenciamento de bots, geração de QR Codes para conexão, monitoramento de status em tempo real e contadores de atendimentos. O sistema é projetado para administradores que gerenciam bots de atendimento ao cliente, agendamento de consultas e reagendamentos/cancelamentos.

A aplicação é composta por um backend desenvolvido em **Node.js** e **Express**, com integração ao **WhatsApp Web.js** para comunicação com o WhatsApp, e um frontend baseado em **HTML**, **CSS** e **JavaScript** para a interface do usuário. O banco de dados utilizado é o **MySQL**, que armazena informações de usuários e sessões.

---

## **Funcionalidades Principais**

### **1. Autenticação de Usuários**
- **Login Seguro**:
  - O sistema exige que os usuários se autentiquem para acessar o painel de controle.
  - As credenciais são verificadas no banco de dados.
  - Caso as credenciais sejam inválidas, mensagens de erro são exibidas no frontend.
- **Sessões de Usuário**:
  - Após o login, o ID do usuário é armazenado na sessão.
  - As sessões são gerenciadas utilizando o **express-session** com armazenamento no banco de dados MySQL.
- **Logout**:
  - O usuário pode encerrar a sessão clicando no botão "Sair".
  - A sessão é destruída no backend, e o usuário é redirecionado para a página de login.

---

### **2. Interface do Usuário**
- **Página de Login**:
  - Design responsivo com animações suaves.
  - Validação de campos de entrada (nome de usuário e senha).
  - Mensagens de erro exibidas dinamicamente (ex.: "Preencha todos os campos", "Usuário ou senha inválidos").
  - Modal de contato para suporte ao administrador.
- **Dashboard Principal**:
  - Exibe informações sobre os bots conectados.
  - Contém cards para cada bot com indicadores de status (conectado/desconectado).
  - Botões para conectar bots, atualizar status e acessar QR Codes.
  - Contadores de atendimentos em tempo real para cada bot.
  - Botões de ação para abrir modais de informações e gerenciar bots.

---

### **3. Gerenciamento de Bots**
O sistema gerencia três bots distintos, cada um com uma função específica:

#### **Bot Principal**
- Atendimento geral ao cliente.
- Responde a mensagens comuns e fornece informações sobre serviços e planos.

#### **Bot de Agendamento**
- Gerencia agendamentos de consultas.
- Permite ao usuário selecionar especialidades, datas e horários.

#### **Bot de Reagendamento/Cancelamento**
- Gerencia cancelamentos e reagendamentos de consultas.
- Fornece informações sobre políticas de cancelamento.

#### **Funcionalidades dos Bots**
- **Conexão via QR Code**:
  - Cada bot gera um QR Code para conexão com o WhatsApp.
  - O QR Code é exibido em um modal na interface do usuário.
  - Após a leitura do QR Code, o bot é conectado e pronto para uso.
- **Monitoramento de Status**:
  - O status de conexão dos bots é monitorado em tempo real.
  - Indicadores visuais nos cards e modais mostram se o bot está conectado ou desconectado.
- **Mensagens Automatizadas**:
  - Os bots respondem automaticamente a mensagens recebidas no WhatsApp.
  - Mensagens são personalizadas com base no conteúdo enviado pelo usuário.
  - Simulação de digitação para melhorar a experiência do usuário.
- **Contadores de Atendimentos**:
  - Cada bot mantém um contador de atendimentos realizados.
  - O contador é atualizado em tempo real e exibido na interface do usuário.
  - Contatos já atendidos são armazenados para evitar duplicação.

---

### **4. Backend**
- **Estrutura do Backend**:
  - Desenvolvido em **Node.js** com **Express**.
  - Integração com o **WhatsApp Web.js** para comunicação com o WhatsApp.
  - Utiliza **Socket.IO** para atualizações em tempo real no frontend.
  - Banco de dados MySQL para armazenamento de usuários e sessões.
- **Rotas do Backend**:
  - `/auth/login`: Verifica as credenciais do usuário e inicia a sessão.
  - `/auth/logout`: Encerra a sessão do usuário.
  - `/`: Página inicial protegida (dashboard).
  - `/qrcode/:bot`: Retorna o QR Code de um bot específico.
  - `/all-connection-status`: Retorna o status de conexão de todos os bots.
  - `/check-status/:bot`: Verifica o status de conexão de um bot específico.
  - `/atendimentos`: Retorna os contadores de atendimentos de cada bot.

---

### **5. Frontend**
- **Design Responsivo**:
  - Interface adaptável para diferentes tamanhos de tela.
  - Animações suaves para melhorar a experiência do usuário.
- **Interatividade**:
  - Botões para conectar bots, atualizar status e abrir modais.
  - Modais para exibir QR Codes, informações e confirmação de ações.
- **Atualizações em Tempo Real**:
  - Utiliza **Socket.IO** para receber atualizações do backend.
  - Atualiza automaticamente o status dos bots e os contadores de atendimentos.

---

### **6. Logs de Conexão**
- **Registro de Conexões**:
  - Cada vez que um bot é conectado, um log é gerado.
  - Os logs incluem o nome do bot e o horário da conexão.
  - Os logs são armazenados em um arquivo de texto (`connection_logs.txt`).

---

### **7. Segurança**
- **Proteção de Rotas**:
  - Apenas usuários autenticados podem acessar as páginas protegidas.
  - Middleware verifica a sessão do usuário antes de permitir o acesso.
- **Armazenamento Seguro de Senhas**:
  - As senhas dos usuários são armazenadas no banco de dados de forma segura.
  - O sistema utiliza **bcrypt** para hashing de senhas.
- **Configuração de Sessões**:
  - As sessões são armazenadas no banco de dados MySQL.
  - Cookies de sessão são configurados com opções de segurança (ex.: `httpOnly`).

---

## **Fluxo de Operação**

1. **Login**:
   - O administrador acessa a página de login e insere suas credenciais.
   - Após a autenticação, é redirecionado para o dashboard principal.

2. **Conexão dos Bots**:
   - No dashboard, o administrador clica no botão "Conectar Bot".
   - Um modal é exibido com o QR Code do bot.
   - O administrador escaneia o QR Code com o WhatsApp para conectar o bot.

3. **Monitoramento**:
   - O status dos bots é exibido em tempo real no dashboard.
   - Indicadores visuais mostram se os bots estão conectados ou desconectados.

4. **Atendimentos**:
   - Os bots respondem automaticamente às mensagens recebidas no WhatsApp.
   - Contadores de atendimentos são atualizados em tempo real.

5. **Logout**:
   - O administrador pode encerrar a sessão clicando no botão "Sair".
   - A sessão é destruída, e o administrador é redirecionado para a página de login.

---

## **Estrutura do Banco de Dados**

### **Tabela `users`**
| Campo       | Tipo         | Descrição                          |
|-------------|--------------|-------------------------------------|
| `id`        | INT          | Identificador único do usuário.    |
| `username`  | VARCHAR(50)  | Nome de usuário (único).           |
| `password`  | VARCHAR(255) | Senha do usuário (hash).           |
| `email`     | VARCHAR(100) | Email do usuário (único).          |
| `created_at`| TIMESTAMP    | Data de criação do usuário.        |
| `last_login`| TIMESTAMP    | Último login do usuário.           |

---

## **Conclusão**

O **WhatsApp Chatbot** é uma solução robusta e eficiente para gerenciar múltiplos bots de atendimento no WhatsApp. Ele combina funcionalidades avançadas, como autenticação segura, monitoramento em tempo real e integração com o WhatsApp, com uma interface amigável e responsiva. O sistema é ideal para empresas que desejam automatizar e otimizar seus processos de atendimento ao cliente.