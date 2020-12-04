const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

router.get('/', customerController.inicio);
router.get('/chofer', customerController.chofer);
router.get('/admin', customerController.admin);
router.get('/queEsSaft', customerController.queEsSaft);


router.post('/regAdmin', customerController.validacionRegAdm); // registrar administrador.
router.post('/loginAdmin', customerController.validacionAdm); // login administrador
router.post('/regChofer', customerController.cargachofer); // registrar chofer
router.post('/loginChofer', customerController.validacionChofer); // login chofer
router.post('/confirmacionTicket', customerController.confirmaTicket);
router.post('/cargaTicket', customerController.cargaticket); // carga el ticket y redirecciona a la pagina donde muestra los porcentajes resultantes del ticket cargado.
router.post('/redirCargaTicket', customerController.redirLoginChofer);
router.post('/consultarChoferes', customerController.consultaDeChoferes);
router.post('/redirCargasyConsultas', customerController.redirCargasyConsul);
router.post('/vistaMantenimiento', customerController.mantenimiento);
router.post('/cargaMantenimiento', customerController.cargaMantenimiento);
router.post('/recaudaciones', customerController.renderRecaudaciones);
router.post('/comisiones', customerController.renderComisiones);
router.post('/entregas', customerController.renderEntregas);
router.post('/combustible', customerController.renderCombustible);
router.post('/mantenimiento', customerController.renderMantenimiento);
router.post('/ingrNeto', customerController.renderIngrNeto);
router.post('/ultimaSemana', customerController.ultimaSemana);
router.post('/verTicketsMes', customerController.verTicketsMes);
 

module.exports = router;