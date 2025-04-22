// db/users.js
const { pool } = require('./config');

// Operações com usuários
class UserModel {
    // Buscar usuário por nome de usuário
    async findByUsername(username) {
        try {
            const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar usuário por nome de usuário:', error);
            throw error;
        }
    }

    // Verificar credenciais de login
    async authenticate(username, password) {
        try {
            const user = await this.findByUsername(username);
            if (!user) {
                console.log('Usuário não encontrado.');
                return null; // Usuário não encontrado
            }

            // Comparar a senha diretamente
            if (user.password !== password) {
                console.log('Senha inválida.');
                return null; // Senha inválida
            }

            return user; // Retorna o usuário autenticado
        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            throw error;
        }
    }

    // Registrar um novo usuário
    async create(username, password, email) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]
            );
            return result.insertId; // Retorna o ID do novo usuário
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }
}

module.exports = new UserModel();