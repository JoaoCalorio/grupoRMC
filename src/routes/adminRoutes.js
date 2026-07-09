const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
 
router.post('/usuarios', adminController.createUsuario);
router.get('/usuarios', adminController.getUsuarios);
router.get('/usuarios/:id', adminController.getUsuarioById);
router.put('/usuarios/:id', adminController.updateUsuario);
router.delete('/usuarios/:id', adminController.deleteUsuario);
 
module.exports = router;