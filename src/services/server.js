
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Importar rotas
const adminRoutes = require('../routes/adminRoutes'); // Ajustado para o caminho correto
app.use('/api', adminRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});