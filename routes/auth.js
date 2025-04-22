const express = require('express');
const router = express.Router();
const UserModel = require('../db/users');

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

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;