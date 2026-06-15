const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');

// POST /movimentacoes -> registrar entrada/saída de produtos
router.post('/', movimentacaoController.registrarMovimentacao);

// GET /movimentacoes/saidas -> listar todas as saídas (ordem decrescente por data)
router.get('/saidas', movimentacaoController.listarSaidas);

// GET /movimentacoes/periodo?data_inicial=YYYY-MM-DD&data_final=YYYY-MM-DD
router.get('/periodo', movimentacaoController.listarMovimentacoesPorPeriodo);

// GET /movimentacoes/maior-volume-saida?data_inicial=YYYY-MM-DD&data_final=YYYY-MM-DD
router.get('/maior-volume-saida', movimentacaoController.listarMaiorVolumeSaida);

module.exports = router;
