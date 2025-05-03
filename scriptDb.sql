-- Dropar o banco de dados existente
DROP DATABASE IF EXISTS whatsapp_chatbot;

-- Criar o banco de dados
CREATE DATABASE whatsapp_chatbot;
USE whatsapp_chatbot;

-- Criar a tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    whatsapp VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Adicionar a coluna role na tabela de usuários
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';

-- Inserir o usuário admin com as credenciais fornecidas
INSERT INTO users (username, password, email, whatsapp) VALUES 
('admin', 'admin123', 'admin@example.com', '+5511999999999');

-- Usuário exclusivo para dashboard
INSERT INTO users (username, password, email, whatsapp) VALUES 
('pabloAdmin', 'administrador', 'dashboard@example.com', '+5511999999998');