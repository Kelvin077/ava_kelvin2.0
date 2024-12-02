const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para JSON
app.use('/users', userRoutes); // Rotas relacionadas a usuários

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
