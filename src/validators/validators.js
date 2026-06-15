function validarProduto(dados) {
    const erros = [];
    const { nome, unidade_medida, valor_unitario, quantidade, id_categoria } = dados;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        erros.push('Campo "nome" é obrigatório e deve ser uma string não vazia.');
    }

    if (!unidade_medida || typeof unidade_medida !== 'string' || unidade_medida.trim() === '') {
        erros.push('Campo "unidade_medida" é obrigatório e deve ser uma string não vazia.');
    }

    if (valor_unitario === undefined || valor_unitario === null || isNaN(valor_unitario) || Number(valor_unitario) <= 0) {
        erros.push('Campo "valor_unitario" é obrigatório e deve ser um número maior que zero.');
    }

    if (quantidade === undefined || quantidade === null || isNaN(quantidade) || Number(quantidade) < 0 || !Number.isInteger(Number(quantidade))) {
        erros.push('Campo "quantidade" é obrigatório e deve ser um número inteiro maior ou igual a zero.');
    }

    if (id_categoria === undefined || id_categoria === null || isNaN(id_categoria) || Number(id_categoria) <= 0) {
        erros.push('Campo "id_categoria" é obrigatório e deve ser um número inteiro válido.');
    }

    return erros;
}

function validarMovimentacao(dados) {
    const erros = [];
    const { id_produto, tipo, quantidade, valor_unitario } = dados;

    if (!id_produto || isNaN(id_produto) || Number(id_produto) <= 0) {
        erros.push('Campo "id_produto" é obrigatório e deve ser um número inteiro válido.');
    }

    if (!tipo || !['ENTRADA', 'SAIDA'].includes(String(tipo).toUpperCase())) {
        erros.push('Campo "tipo" é obrigatório e deve ser "ENTRADA" ou "SAIDA".');
    }

    if (quantidade === undefined || quantidade === null || isNaN(quantidade) || Number(quantidade) <= 0 || !Number.isInteger(Number(quantidade))) {
        erros.push('Campo "quantidade" é obrigatório e deve ser um número inteiro maior que zero.');
    }

    if (valor_unitario === undefined || valor_unitario === null || isNaN(valor_unitario) || Number(valor_unitario) <= 0) {
        erros.push('Campo "valor_unitario" é obrigatório e deve ser um número maior que zero.');
    }

    return erros;
}

module.exports = { validarProduto, validarMovimentacao };
