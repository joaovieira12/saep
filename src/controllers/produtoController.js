const pool = require('../db/pool');
const { validarProduto } = require('../validators/validators');

async function cadastrarProduto(req, res) {
    const erros = validarProduto(req.body);
    if (erros.length > 0) {
        console.log('[CADASTRAR PRODUTO] Erros de validação:', erros);
        return res.status(400).json({ erros });
    }

    const { nome, unidade_medida, valor_unitario, quantidade, id_categoria } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO produto (nome, unidade_medida, valor_unitario, quantidade, id_categoria)
             VALUES (?, ?, ?, ?, ?)`,
            [nome, unidade_medida, valor_unitario, quantidade, id_categoria]
        );

        console.log('[CADASTRAR PRODUTO] Produto criado com id:', result.insertId);
        return res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso.',
            id_produto: result.insertId
        });
    } catch (err) {
        console.error('[CADASTRAR PRODUTO] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao cadastrar produto.', detalhe: err.message });
    }
}

async function listarProdutos(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT p.id_produto, p.nome, p.unidade_medida, p.valor_unitario,
                    p.quantidade, p.id_categoria, c.nome AS categoria
             FROM produto p
             JOIN categoria c ON c.id_categoria = p.id_categoria`
        );

        console.log('[LISTAR PRODUTOS] Total encontrado:', rows.length);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('[LISTAR PRODUTOS] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao listar produtos.', detalhe: err.message });
    }
}

async function listarValorTotalPorCategoria(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT c.id_categoria, c.nome AS categoria,
                    SUM(p.quantidade * p.valor_unitario) AS valor_total
             FROM categoria c
             LEFT JOIN produto p ON p.id_categoria = c.id_categoria
             GROUP BY c.id_categoria, c.nome
             ORDER BY c.nome`
        );

        console.log('[VALOR TOTAL POR CATEGORIA] Total encontrado:', rows.length);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('[VALOR TOTAL POR CATEGORIA] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao listar valor total por categoria.', detalhe: err.message });
    }
}

async function listarProdutosLimites(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT p.id_produto, p.nome AS produto, p.quantidade,
                    c.id_categoria, c.nome AS categoria,
                    c.nivel_minimo, c.nivel_maximo,
                    ROUND((p.quantidade / c.nivel_maximo) * 100, 2) AS percentual_nivel,
                    CASE
                        WHEN p.quantidade <= c.nivel_minimo THEN 'MINIMO'
                        WHEN p.quantidade >= c.nivel_maximo THEN 'MAXIMO'
                    END AS limite_atingido
             FROM produto p
             JOIN categoria c ON c.id_categoria = p.id_categoria
             WHERE p.quantidade <= c.nivel_minimo OR p.quantidade >= c.nivel_maximo`
        );

        console.log('[PRODUTOS LIMITES] Total encontrado:', rows.length);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('[PRODUTOS LIMITES] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao identificar produtos com limites atingidos.', detalhe: err.message });
    }
}

module.exports = {
    cadastrarProduto,
    listarProdutos,
    listarValorTotalPorCategoria,
    listarProdutosLimites
};
