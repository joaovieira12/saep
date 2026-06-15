require('dotenv').config();
const express = require('express');
const produtoRoutes = require('./routes/produtoRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUISICAO] ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/produtos', produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'API Almoxarifado em execução.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
