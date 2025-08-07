<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&width=500&height=70&duration=4000&lines=Projeto;+ChatBot!;&color=47c200" />
</h1>

<div align="center">
  <a href="https://instagram.com/p4blozz__" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
  <a href="mailto:pablo.silva.edu@gmail.com" target="_blank">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/a2c130db-3caf-4340-a930-1444ac211ab6" alt="ChatBot" width="200"/>
</div>

---

# WhatsApp Chatbot Pro

## Índice
1. [Visão Geral](#visão-geral)
2. [Árvore de Arquivos do Projeto](#árvore-de-arquivos-do-projeto)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
5. [Fluxo de Operação Completo](#fluxo-de-operação-completo)
6. [Backend: Estrutura e Rotas](#backend-estrutura-e-rotas)
7. [Frontend: Interface, Responsividade e Animações](#frontend-interface-responsividade-e-animações)
8. [Banco de Dados: Estrutura e Scripts](#banco-de-dados-estrutura-e-scripts)
9. [Segurança e Boas Práticas](#segurança-e-boas-práticas)
10. [Deploy, Ambiente e Troubleshooting](#deploy-ambiente-e-troubleshooting)
11. [Contato e Suporte](#Contato)

---

## Visão Geral

O **WhatsApp Chatbot Pro** é uma plataforma web robusta para gestão de múltiplos bots de atendimento via WhatsApp, com autenticação segura, painel administrativo, integração em tempo real, contadores dinâmicos, logs detalhados, suporte a bots premium e interface moderna, responsiva e animada. Ideal para empresas que desejam automatizar e monitorar atendimentos, agendamentos e reagendamentos de clientes.

**Principais diferenciais:**
- Gerenciamento simultâneo de múltiplos bots (principal, agendamento, reagendamento)
- Dashboard administrativo com controle total de usuários e bots
- Comunicação em tempo real (Socket.IO) para status, contadores e eventos
- Modais animados para QR Code, confirmação, edição, adição e feedback visual
- Logs persistentes de conexão e eventos
- Interface responsiva, com temas claro/escuro e navegação acessível

---

## Árvore de Arquivos do Projeto

```
ChatBotZap_Pro/
├── chatbot.js                # Servidor principal Node.js/Express
├── connection_logs.txt       # Logs de conexões dos bots
├── package.json              # Dependências e scripts do projeto
├── README.md                 # Documentação principal
├── scriptDb.sql              # Script SQL para criação do banco de dados
├── dashboard/
│   ├── dashboard-login.html  # Tela de login do painel administrativo
│   └── dashboard.html        # Painel administrativo completo
├── db/
│   ├── config.js             # Configuração de conexão com MySQL
│   └── users.js              # Operações de usuário no banco
├── middleware/
│   └── auth.js               # Middlewares de autenticação
├── public/
│   ├── index.html            # Dashboard principal do usuário
│   ├── login.html            # Tela de login do usuário
│   ├── css/
│   │   └── index.css         # Estilos principais
│   ├── icons/                # Ícones SVG/PNG usados na interface
│   ├── imagens/              # Imagens do sistema (logos, instruções)
│   └── js/
│       └── index.js          # Lógica do frontend (status, tema, modais)
├── routes/
│   └── auth.js               # Rotas de autenticação
```

---

## Tecnologias Utilizadas

- **Node.js** + **Express**: Backend, rotas, middlewares, integração com WhatsApp Web.js
- **whatsapp-web.js**: Integração com WhatsApp via WebSocket
- **Socket.IO**: Comunicação em tempo real entre backend e frontend
- **MySQL**: Banco de dados relacional para usuários e sessões
- **express-session** + **express-mysql-session**: Gerenciamento seguro de sessões
- **bcrypt**: Hash de senhas
- **HTML5, CSS3, JavaScript**: Frontend puro, responsivo e animado
- **FontAwesome**: Ícones visuais
- **qrcode**: Geração de QR Codes para conexão dos bots

---

## Funcionalidades Detalhadas

### 1. Autenticação e Sessão
- Login seguro para usuários comuns e administradores (dashboard)
- Hash de senha com bcrypt
- Sessão persistente em MySQL (express-session + express-mysql-session)
- Middleware para proteção de rotas e diferenciação de perfis
- Logout seguro, com modal de confirmação e destruição de sessão
- Mensagens de erro dinâmicas, feedback visual e modais de suporte

### 2. Gerenciamento de Bots
- Três bots distintos: principal, agendamento, reagendamento
- Cada bot possui QR Code próprio para conexão via WhatsApp
- Status de conexão em tempo real (Socket.IO), com indicadores visuais (conectado/desconectado)
- Contadores de atendimentos únicos por bot, atualizados instantaneamente
- Cards de bots com métricas: tempo de atividade, mensagens enviadas/recebidas, histórico de conexão
- Logs de conexão em arquivo (`connection_logs.txt`) e terminal
- Relatórios de eventos e histórico de cada bot

### 3. Painel Administrativo (dashboard.html)
- Listagem de usuários (com separação visual de administradores e usuários comuns)
- Ações administrativas: adicionar, editar, remover usuários (com modais de confirmação)
- Busca dinâmica por nome ou telefone, filtros e relatórios
- Cards de status: total de usuários, status do servidor, métricas dos bots
- Modais de confirmação, edição, adição e feedback visual (ex: usuário atualizado, excluído)
- Gráficos e tabelas para visualização de dados
- Troca de tema (claro/escuro) com persistência
- Logout com modal animado

### 4. Interface do Usuário (index.html, login.html)
- Cards de bots com status, contador, botões de ação (conectar, reiniciar, configurar)
- Modais animados para QR Code, informações, contato e confirmação
- Temas claro/escuro, animações CSS (fade, slide, pulse, shimmer, scan)
- Responsividade total (media queries para <992px, <768px, <480px)
- Navegação por teclado, foco visível, contraste e acessibilidade
- Rodapé fixo com créditos

### 5. Logs e Monitoramento
- `connection_logs.txt`: registro de conexões dos bots com data/hora
- Logs de erro e eventos no terminal
- Contadores de atendimentos persistentes, atualizados em tempo real
- Relatórios de conexão e eventos disponíveis no dashboard

---

## Fluxo de Operação Completo

1. **Login**: Usuário acessa `/login` ou `/dashboard-login`, insere credenciais, validação dinâmica, sessão criada.
2. **Dashboard**: Visualização dos bots, status, contadores, ações rápidas, métricas e histórico.
3. **Conexão de Bots**: Modal QR Code, escaneamento via WhatsApp, status atualizado em tempo real.
4. **Atendimentos**: Cada novo contato incrementa contador do bot correspondente, atualização instantânea.
5. **Administração**: Gerenciamento de usuários, relatórios, logs, adição/edição/exclusão de usuários.
6. **Logout**: Botão "Sair", modal de confirmação, destruição de sessão e feedback visual.

---

## Backend: Estrutura e Rotas

### Principais arquivos
- **chatbot.js**: Servidor principal, rotas, integração WhatsApp, Socket.IO, logs
- **db/config.js**: Configuração de conexão MySQL
- **middleware/auth.js**: Middlewares de autenticação
- **routes/auth.js**: Rotas de login/logout

### Rotas HTTP
- `POST /auth/login`: Login do usuário
- `POST /auth/owner-login`: Login do administrador (dashboard)
- `GET /auth/logout`: Logout do usuário
- `GET /auth/dashboard-logout`: Logout do admin
- `GET /`: Dashboard principal (protegido)
- `GET /login`: Tela de login
- `GET /dashboard-login`: Login do painel admin
- `GET /dashboard`: Painel admin (protegido)
- `GET /users`: Listagem de usuários (dashboard)
- `POST /users`: Adicionar usuário
- `PUT /users/:id`: Editar usuário
- `DELETE /users/:id`: Remover usuário
- `GET /users/search`: Busca dinâmica de usuários
- `GET /users/count` e `/total-users`: Total de usuários
- `GET /server-status`: Status do servidor
- `GET /all-connection-status`: Status de todos os bots
- `GET /check-status/:bot`: Status de um bot específico
- `GET /atendimentos`: Contadores de atendimentos por bot

### Middlewares
- `isAuthenticated`: Protege rotas do usuário
- `isDashboardAuthenticated`: Protege rotas do admin

### Integração WhatsApp
- Instância principal de Client (main-bot)
- Eventos: ready, qr, message, authenticated, disconnected
- Geração de QR Code (qrcode)
- Resposta automática a mensagens
- Simulação de digitação
- Atualização de status e métricas em tempo real

### Sessão e Segurança
- express-session + express-mysql-session
- Cookie seguro, httpOnly, expiração configurável
- Hash de senha com bcrypt

---

## Frontend: Interface, Responsividade e Animações

### index.html
- Cards de bots com status, contador, botões de ação
- Modais animados para QR Code, informações, contato
- Temas claro/escuro, animações CSS (fade, slide, pulse, shimmer, scan)
- Responsividade total (media queries para <992px, <768px, <480px)
- Navegação por teclado, foco visível, contraste

### login.html e dashboard-login.html
- Formulários com validação dinâmica
- Feedback visual de erro/sucesso
- Modal de contato com WhatsApp do admin
- Animações de entrada/saída

### dashboard.html
- Listagem de usuários e bots, com separação visual de administradores e usuários comuns
- Busca dinâmica, filtros, relatórios e exportação
- Modais de confirmação, edição, adição, alteração de senha e feedback visual
- Cards de status: total de usuários, status do servidor, métricas dos bots
- Gráficos, tabelas e timeline de eventos
- Troca de tema (claro/escuro) com persistência
- Logout com modal animado e feedback

---

## Banco de Dados: Estrutura e Scripts

### Tabela `users`
| Campo       | Tipo         | Descrição                          |
|-------------|--------------|-------------------------------------|
| id          | INT          | Identificador único do usuário      |
| username    | VARCHAR(50)  | Nome de usuário (único)            |
| password    | VARCHAR(255) | Senha (hash bcrypt)                |
| email       | VARCHAR(100) | Email do usuário                   |
| role        | VARCHAR(20)  | 'admin' ou 'user'                  |
| created_at  | TIMESTAMP    | Data de criação                    |
| last_login  | TIMESTAMP    | Último login                       |

### Tabela de Sessões (gerenciada pelo express-mysql-session)
- Armazena sessões ativas, expiração, dados serializados

### Script de Criação
- scriptDb.sql: contém comandos para criar tabelas e índices

---

## Segurança e Boas Práticas

- Hash de senha com bcrypt
- Sessão httpOnly, expiração automática
- Proteção de rotas com middleware
- Validação de entrada no frontend e backend
- Não expor dados sensíveis no frontend
- Logs de acesso e eventos
- Uso de variáveis de ambiente para segredos
- Possibilidade de uso de HTTPS (ajustar cookie.secure)

---

## Deploy, Ambiente e Troubleshooting

### Requisitos
- Node.js 18+
- MySQL Server
- WhatsApp com câmera para escanear QR Code

### Instalação
1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure o banco de dados em `db/config.js` e rode o scriptDb.sql
4. Inicie o servidor: `npm start`
5. Acesse: http://localhost:3000/login

### Troubleshooting
- **Bot não conecta**: Verifique QR Code, conexão internet, sessão WhatsApp
- **Erro de banco**: Cheque config.js, permissões, se o MySQL está rodando
- **Sessão expira rápido**: Ajuste maxAge do cookie
- **Problemas de responsividade**: Teste em diferentes dispositivos

---

## Exemplos de Uso e Fluxos Visuais

### Exemplo de fluxo de login e dashboard
1. Usuário acessa `/login` ou `/dashboard-login`.
2. Insere credenciais, recebe feedback visual imediato (sucesso/erro).
3. Após login, é redirecionado para o dashboard correspondente ao perfil.
4. Visualiza cards de bots, status, contadores e pode realizar ações rápidas.
5. Administrador pode acessar a aba de usuários, adicionar/editar/remover usuários, visualizar relatórios e logs.
6. Todas as ações críticas possuem modais de confirmação e feedback visual.

### Exemplo de conexão de bot
1. Clica em "Conectar Bot".
2. Modal com QR Code é exibido.
3. Escaneia com WhatsApp, status do bot é atualizado em tempo real.
4. Contadores de atendimento são incrementados automaticamente a cada novo contato.

### Exemplo de gerenciamento de usuários
1. Admin acessa a aba "Usuários" no dashboard.
2. Visualiza lista separada de administradores e usuários comuns.
3. Pode buscar, adicionar, editar ou remover usuários.
4. Modais de confirmação e feedback são exibidos para cada ação.

### Galeria

- **Index**
![image](https://github.com/user-attachments/assets/7619fefa-2913-4926-a6cb-6b82630e05ba)
![image](https://github.com/user-attachments/assets/517c287c-54df-4747-a31f-29893fd2303c)
![image](https://github.com/user-attachments/assets/8fbd8bb8-6257-41f9-b096-11dea61e6ce1)
![image](https://github.com/user-attachments/assets/c58087c6-58c5-46fc-8e0a-cc2b54f6efbd)
![image](https://github.com/user-attachments/assets/970d3235-a27a-46fe-bda5-63b4d18ab3e2) 
![image](https://github.com/user-attachments/assets/956f20f3-a7ed-48c9-8ed2-b5272093ace7)
![image](https://github.com/user-attachments/assets/0a6e029b-0e5e-4998-9e26-2632a357f4a8)

---

- **Dashboard**
![image](https://github.com/user-attachments/assets/303bdc48-0bc4-49b5-88cd-393b3ddddd24)
![image](https://github.com/user-attachments/assets/cfa4b877-18ed-4c78-ba2a-91209f860131)
![image](https://github.com/user-attachments/assets/ccb30211-d735-4a51-af56-f46b90f7e7ec)
![image](https://github.com/user-attachments/assets/2f7e1a74-6822-4f16-ae45-a9d927a22f0c)
![image](https://github.com/user-attachments/assets/ad22088a-d52e-4335-a33a-ba2ed099f1e9)
![image](https://github.com/user-attachments/assets/c80f615b-6213-4d3f-b1df-cbc30f360be6)
![image](https://github.com/user-attachments/assets/d3d4656e-9514-4465-b3db-dbfa286a7038)
![image](https://github.com/user-attachments/assets/d042627d-2a66-4c9f-a767-28f3d079f5c7)
![image](https://github.com/user-attachments/assets/933f1a48-38bd-4ad0-9498-538eaeca210e)
![image](https://github.com/user-attachments/assets/7b25e430-def2-4a54-9c2d-afdacea421fd)

---

## Contato

**Pablo Eduardo Silva**  
*Desenvolvedor Full Stack*

- **GitHub**: [https://github.com/pabloedusilva](https://github.com/pabloedusilva)
- **Email**: [pablo.silva.edu@gmail.com](mailto:pablo.silva.edu@gmail.com)
- **LinkedIn**: [https://www.linkedin.com/in/pabloedusilva](https://www.linkedin.com/in/pabloedusilva)

---

### Suporte ao Projeto

Se este projeto foi útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🐛 Reportar bugs e sugerir melhorias
- 🔀 Contribuir com código
- 📢 Compartilhar com outros desenvolvedores

---

**Última atualização**: 2025

**ChatBotZap** - Desenvolvido com dedicação por Pablo Eduardo Silva
