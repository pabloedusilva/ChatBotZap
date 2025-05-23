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
  <img src="https://github.com/user-attachments/assets/d7701a4c-8396-4a0b-a1fe-b4bef23da2a4" alt="ChatBot" width="200"/>
</div>

---

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
10. [Logs e Monitoramento](#logs-e-monitoramento)
11. [Deploy, Ambiente e Troubleshooting](#deploy-ambiente-e-troubleshooting)
12. [Diferenciais e Observações](#diferenciais-e-observações)
13. [Contato e Suporte](#contato-e-suporte)

---

## Visão Geral

O **WhatsApp Chatbot** é uma plataforma web robusta para gestão de múltiplos bots de atendimento via WhatsApp, com autenticação segura, painel administrativo, integração em tempo real, contadores dinâmicos, logs detalhados, suporte a bots premium e interface moderna, responsiva e animada. Ideal para empresas que desejam automatizar e monitorar atendimentos, agendamentos e reagendamentos de clientes.

---

## Árvore de Arquivos do Projeto

```
ChatBotZap_Pro/
├── chatbot.js                # Servidor principal Node.js/Express
├── connection_logs.txt       # Logs de conexões dos bots
├── package.json              # Dependências e scripts do projeto
├── README.md                 # Documentação principal
├── README1.md                # (Este arquivo) Documentação detalhada extra
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
│   ├── icons/                # Ícones SVG/PNG usados na interface
│   └── imagens/              # Imagens do sistema (logos, instruções)
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
- Login seguro para usuários e administradores
- Hash de senha com bcrypt
- Sessão persistente em MySQL
- Middleware para proteção de rotas
- Logout seguro e destruição de sessão
- Mensagens de erro dinâmicas e modais de suporte

### 2. Gerenciamento de Bots
- Três bots distintos: principal, agendamento, reagendamento
- Cada bot com QR Code próprio para conexão
- Status de conexão em tempo real (Socket.IO)
- Contadores de atendimentos únicos por bot
- Cards com indicadores visuais (conectado/desconectado)
- Logs de conexão em arquivo e terminal

### 3. Painel Administrativo (dashboard.html)
- Listagem de usuários e bots
- Ações administrativas: adicionar, editar, remover usuários
- Busca, filtros e relatórios
- Cards de status, gráficos e contadores
- Modais de confirmação e feedback visual

### 4. Interface do Usuário (index.html, login.html)
- Design responsivo (mobile, tablet, desktop)
- Animações: fade, slide, pulse, shimmer, scan, ripple
- Modais para QR Code, informações, contato, confirmação
- Temas claro/escuro com persistência (localStorage)
- Navegação por teclado e acessibilidade
- Rodapé fixo com créditos

### 5. Logs e Monitoramento
- connection_logs.txt: registro de conexões dos bots com data/hora
- Logs de erro e eventos no terminal
- Contadores de atendimentos persistentes

---

## Fluxo de Operação Completo

1. **Login**: Usuário acessa /login ou /dashboard-login, insere credenciais, validação dinâmica, sessão criada.
2. **Dashboard**: Visualização dos bots, status, contadores, ações rápidas.
3. **Conexão de Bots**: Modal QR Code, escaneamento via WhatsApp, status atualizado em tempo real.
4. **Atendimentos**: Cada novo contato incrementa contador do bot correspondente, atualização instantânea.
5. **Administração**: Gerenciamento de usuários, relatórios, logs.
6. **Logout**: Botão "Sair", modal de confirmação, destruição de sessão.

---

## Backend: Estrutura e Rotas

### Principais arquivos
- **chatbot.js**: Servidor principal, rotas, integração WhatsApp, Socket.IO, logs
- **db/config.js**: Configuração de conexão MySQL
- **middleware/auth.js**: Middlewares de autenticação
- **routes/auth.js**: Rotas de login/logout

### Rotas HTTP
- `POST /auth/login`: Login do usuário
- `GET /auth/logout`: Logout
- `GET /`: Dashboard principal (protegido)
- `GET /login`: Tela de login
- `GET /dashboard-login`: Login do painel admin
- `GET /dashboard`: Painel admin (protegido)
- `GET /qrcode/:bot`: QR Code do bot
- `GET /check-status/:bot`: Status de conexão do bot
- `GET /atendimentos`: Contadores de atendimentos

### Middlewares
- `isAuthenticated`: Protege rotas do usuário
- `isDashboardAuthenticated`: Protege rotas do admin

### Integração WhatsApp
- Três instâncias de Client (main, appointment, reschedule)
- Eventos: ready, qr, message, authenticated, disconnected
- Geração de QR Code (qrcode)
- Resposta automática a mensagens
- Simulação de digitação

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
- Listagem de usuários e bots
- Busca, filtros, relatórios
- Modais de confirmação, edição, adição
- Cards de status, gráficos, tabelas

---

## Banco de Dados: Estrutura e Scripts

### Tabela `users`
| Campo       | Tipo         | Descrição                          |
|-------------|--------------|-------------------------------------|
| id          | INT          | Identificador único do usuário      |
| username    | VARCHAR(50)  | Nome de usuário (único)            |
| password    | VARCHAR(255) | Senha (hash bcrypt)                |
| email       | VARCHAR(100) | Email do usuário                   |
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

## Logs e Monitoramento

- **connection_logs.txt**: Cada conexão de bot é registrada com data/hora
- Logs de erro e eventos no terminal
- Possibilidade de integração com ferramentas externas (ex: PM2, Loggly)

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

## Diferenciais e Observações

- Suporte a múltiplos bots simultâneos
- Contadores de atendimentos únicos por bot
- Logs detalhados de conexão
- Interface moderna, responsiva e animada
- Temas claro/escuro com persistência
- Painel administrativo completo
- Código modular e comentado
- Fácil manutenção e expansão
- Pronto para integração com IA (ex: GPT, Gemini)

---

## Contribuição, Modificações e Licença

Este projeto é de código aberto para consulta e uso, porém **modificações, adaptações ou redistribuição** só são permitidas mediante autorização prévia do desenvolvedor responsável.

- **Como contribuir ou sugerir melhorias:**
  - Abra uma _issue_ detalhando sua sugestão, dúvida ou problema encontrado.
  - Para propor alterações diretas, entre em contato com o desenvolvedor pelo WhatsApp ou utilize o sistema de issues do repositório.
  - Todas as modificações devem ser previamente autorizadas para garantir a integridade, segurança e evolução controlada do sistema.

- **Contato para autorização:**
  - WhatsApp: [(31) 98507-9718](https://wa.me/5531985079718)
  - E-mail: pablo.silva.edu@gmail.com
  - Desenvolvedor: Pablo

**Atenção:**
- Alterações não autorizadas podem ser removidas ou desconsideradas.
- O uso comercial, redistribuição ou integração com outros sistemas requerem consentimento formal.

---

## Contato e Suporte

- WhatsApp: [(31) 98507-9718](https://wa.me/5531985079718)
- E-mail: pablo.silva.edu@gmail.com
- Desenvolvedor: Pablo
- Ano: 2025

---

**Este documento foi gerado para garantir máxima compreensão, manutenção e evolução do projeto. Para dúvidas, sugestões ou melhorias, entre em contato!**
