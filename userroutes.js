const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const router = express.Router();

// Criação de um novo usuário
router.post('/', async (req, res) => {
    const { name, email, password, access_level } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

    const query = `INSERT INTO users (name, email, password, access_level) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, hashedPassword, access_level], function (err) {
        if (err) {
            return res.status(400).json({ error: 'Erro ao criar usuário', details: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Usuário criado com sucesso!' });
    });
});

// Listagem de todos os usuários
router.get('/', (req, res) => {
    db.all('SELECT id, name, email, access_level FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao listar usuários', details: err.message });
        }
        res.status(200).json(rows);
    });
});

// Edição de um usuário existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, access_level } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

    const query = `UPDATE users SET name = ?, email = ?, password = ?, access_level = ? WHERE id = ?`;
    db.run(query, [name, email, hashedPassword, access_level, id], function (err) {
        if (err) {
            return res.status(400).json({ error: 'Erro ao editar usuário', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    });
});

// Exclusão de um usuário
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM users WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: 'Erro ao excluir usuário', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    });
});

module.exports = router;
