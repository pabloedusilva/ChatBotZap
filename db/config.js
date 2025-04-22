// db/config.js
const mysql = require('mysql2/promise');

// Configuração da conexão
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Altere para seu usuário MySQL
    password: '1234', // Altere para sua senha MySQL
    database: 'whatsapp_chatbot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com MySQL estabelecida com sucesso!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
        return false;
    }
}

// Exportar o pool e função de teste
module.exports = {
    pool,
    testConnection
};