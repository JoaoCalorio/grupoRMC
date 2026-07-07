   const express = require('express');
   const app = express();
   const PORT = process.env.PORT || 3000;

   // Middleware para lidar com JSON (opcional, se você for usar JSON)
   app.use(express.json());

   // Rota simples para testar
   app.get('/api/test', (req, res) => {
       res.json({ message: 'Servidor funcionando!' });
   });

   // Iniciar o servidor
   app.listen(PORT, () => {
       console.log(`Servidor rodando na porta ${PORT}`);
   });