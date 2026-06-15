const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// POST /produtos -> cadastrar novo produto
router.post('/', produtoController.cadastrarProduto);

// GET /produtos -> listar todos os produtos cadastrados
router.get('/', produtoController.listarProdutos);

// GET /produtos/valor-total-categoria -> valor total por categoria
router.get('/valor-total-categoria', produtoController.listarValorTotalPorCategoria);

// GET /produtos/limites -> produtos que atingiram limites mínimo/máximo
router.get('/limites', produtoController.listarProdutosLimites);

module.exports = router;
