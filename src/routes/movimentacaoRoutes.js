const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');

router.post('/', movimentacaoController.registrarMovimentacao);

router.get('/saidas', movimentacaoController.listarSaidas);

router.get('/periodo', movimentacaoController.listarMovimentacoesPorPeriodo);

router.get('/maior-volume-saida', movimentacaoController.listarMaiorVolumeSaida);

module.exports = router;
