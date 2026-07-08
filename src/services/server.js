const express = require('express');
const path = require('path');  
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());           
app.use(express.json());


app.use(express.static(path.join(__dirname, '../../public'))); 

// Importar rotas
const adminRoutes = require('../routes/adminRoutes');
app.use('/api', adminRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});