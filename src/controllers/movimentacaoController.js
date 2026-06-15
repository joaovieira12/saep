const pool = require('../db/pool');
const { validarMovimentacao } = require('../validators/validators');

async function registrarMovimentacao(req, res) {
    const erros = validarMovimentacao(req.body);
    if (erros.length > 0) {
        console.log('[REGISTRAR MOVIMENTACAO] Erros de validação:', erros);
        return res.status(400).json({ erros });
    }

    const { id_produto, tipo, quantidade, valor_unitario, data_inicial, data_final } = req.body;
    const tipoNormalizado = String(tipo).toUpperCase();

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [produtoRows] = await conn.query(
            'SELECT id_produto, quantidade FROM produto WHERE id_produto = ? FOR UPDATE',
            [id_produto]
        );

        if (produtoRows.length === 0) {
            await conn.rollback();
            console.log('[REGISTRAR MOVIMENTACAO] Produto não encontrado:', id_produto);
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        const produto = produtoRows[0];

        if (tipoNormalizado === 'SAIDA' && produto.quantidade < quantidade) {
            await conn.rollback();
            console.log('[REGISTRAR MOVIMENTACAO] Saldo insuficiente para saída.');
            return res.status(400).json({ erro: 'Quantidade em estoque insuficiente para realizar a saída.' });
        }

        const novoSaldo = tipoNormalizado === 'ENTRADA'
            ? produto.quantidade + Number(quantidade)
            : produto.quantidade - Number(quantidade);

        await conn.query(
            'UPDATE produto SET quantidade = ? WHERE id_produto = ?',
            [novoSaldo, id_produto]
        );

        const [result] = await conn.query(
            `INSERT INTO movimentacao (id_produto, tipo, quantidade, valor_unitario, data_inicial, data_final)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_produto, tipoNormalizado, quantidade, valor_unitario, data_inicial || null, data_final || null]
        );

        await conn.commit();

        console.log('[REGISTRAR MOVIMENTACAO] Movimentação registrada com id:', result.insertId, '| Novo saldo:', novoSaldo);
        return res.status(201).json({
            mensagem: 'Movimentação registrada com sucesso.',
            id_movimentacao: result.insertId,
            saldo_atual: novoSaldo
        });
    } catch (err) {
        await conn.rollback();
        console.error('[REGISTRAR MOVIMENTACAO] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao registrar movimentação.', detalhe: err.message });
    } finally {
        conn.release();
    }
}

async function listarSaidas(req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT m.id_movimentacao, p.nome AS produto, m.quantidade,
                    m.valor_unitario, (m.quantidade * m.valor_unitario) AS valor_total,
                    m.data_movimentacao
             FROM movimentacao m
             JOIN produto p ON p.id_produto = m.id_produto
             WHERE m.tipo = 'SAIDA'
             ORDER BY m.data_movimentacao DESC`
        );

        console.log('[LISTAR SAIDAS] Total encontrado:', rows.length);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('[LISTAR SAIDAS] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao listar saídas.', detalhe: err.message });
    }
}

async function listarMovimentacoesPorPeriodo(req, res) {
    const { data_inicial, data_final } = req.query;

    if (!data_inicial || !data_final) {
        console.log('[MOVIMENTACOES PERIODO] Datas não informadas.');
        return res.status(400).json({ erro: 'Os parâmetros "data_inicial" e "data_final" são obrigatórios.' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT
                p.nome AS nome_produto,
                p.unidade_medida,
                COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.quantidade ELSE 0 END), 0) AS total_entradas,
                COALESCE(SUM(CASE WHEN m.tipo = 'SAIDA' THEN m.quantidade ELSE 0 END), 0) AS total_saidas,
                p.quantidade AS saldo_no_periodo,
                COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.quantidade * m.valor_unitario ELSE 0 END), 0) AS valor_total_entradas,
                COALESCE(SUM(CASE WHEN m.tipo = 'SAIDA' THEN m.quantidade * m.valor_unitario ELSE 0 END), 0) AS valor_total_saidas
             FROM produto p
             LEFT JOIN movimentacao m
                ON m.id_produto = p.id_produto
                AND DATE(m.data_movimentacao) BETWEEN ? AND ?
             GROUP BY p.id_produto, p.nome, p.unidade_medida, p.quantidade
             ORDER BY p.nome`,
            [data_inicial, data_final]
        );

        console.log('[MOVIMENTACOES PERIODO] Total encontrado:', rows.length);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('[MOVIMENTACOES PERIODO] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao listar movimentações do período.', detalhe: err.message });
    }
}

async function listarMaiorVolumeSaida(req, res) {
    const { data_inicial, data_final } = req.query;

    if (!data_inicial || !data_final) {
        console.log('[MAIOR VOLUME SAIDA] Datas não informadas.');
        return res.status(400).json({ erro: 'Os parâmetros "data_inicial" e "data_final" são obrigatórios.' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT
                p.nome AS nome_produto,
                SUM(m.quantidade) AS quantidade_total_saida,
                SUM(m.quantidade * m.valor_unitario) AS valor_total_financeiro
             FROM movimentacao m
             JOIN produto p ON p.id_produto = m.id_produto
             WHERE m.tipo = 'SAIDA'
               AND DATE(m.data_movimentacao) BETWEEN ? AND ?
             GROUP BY p.id_produto, p.nome
             ORDER BY quantidade_total_saida DESC`,
            [data_inicial, data_final]
        );

        console.log('[MAIOR VOLUME SAIDA] Total encontrado:', rows.length);
        return res.status(200).json(rows);
    } catch (err) {
        console.error('[MAIOR VOLUME SAIDA] Erro:', err.message);
        return res.status(500).json({ erro: 'Erro ao listar produtos com maior volume de saída.', detalhe: err.message });
    }
}

module.exports = {
    registrarMovimentacao,
    listarSaidas,
    listarMovimentacoesPorPeriodo,
    listarMaiorVolumeSaida
};
