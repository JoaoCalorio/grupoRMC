const express = require('express');
const path = require('path');  
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());           
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public'))); 

const adminRoutes = require('../routes/adminRoutes');
app.use('/api', adminRoutes);


app.listen(PORT, () => {
    console.log(`Porta  ${PORT}`);
});