-- Criar o banco de dados
CREATE DATABASE whatsapp_chatbot;
USE whatsapp_chatbot;

-- Criar a tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Inserir o usuário admin com a senha "admin123"
INSERT INTO users (username, password, email) VALUES 
('admin', 'admin123', 'admin@example.com');