const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.post('/', produtoController.cadastrarProduto);

router.get('/', produtoController.listarProdutos);

router.get('/valor-total-categoria', produtoController.listarValorTotalPorCategoria);

router.get('/limites', produtoController.listarProdutosLimites);

module.exports = router;
