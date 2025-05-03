const express = require('express');
const router = express.Router();
const UserModel = require('../db/users');
const { pool } = require('../db/config');

// Rota de login
router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/login?error=missing');
    }

    try {
        const user = await UserModel.authenticate(username, password);
        if (!user) {
            return res.redirect('/login?error=invalid');
        }

        // Salvar o ID do usuário na sessão
        req.session.userId = user.id;
        return res.redirect('/');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.redirect('/login?error=server');
    }
});

// Login exclusivo para a dashboard
router.post('/owner-login', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/dashboard-login?error=missing');
    }
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.redirect('/dashboard-login?error=invalid');
        }
        const user = rows[0];
        // Permitir qualquer usuário com role 'admin'
        if (user.role !== 'admin' || user.password !== password) {
            return res.redirect('/dashboard-login?error=invalid');
        }
        req.session.dashboardUserId = user.id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.redirect('/dashboard-login?error=server');
    }
});

// Logout exclusivo da dashboard
router.get('/dashboard-logout', (req, res) => {
    delete req.session.dashboardUserId;
    res.redirect('/dashboard-login');
});

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;