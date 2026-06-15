

DROP DATABASE IF EXISTS db_almoxarifado;
CREATE DATABASE db_almoxarifado;
USE db_almoxarifado;


CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nivel_minimo INT NOT NULL DEFAULT 0,
    nivel_maximo INT NOT NULL DEFAULT 100
);


CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);


CREATE TABLE movimentacao (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    tipo ENUM('ENTRADA','SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    data_inicial DATE NULL,
    data_final DATE NULL,
    data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimentacao_produto
        FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);


CREATE VIEW vw_estoque AS
SELECT
    p.id_produto,
    p.nome,
    p.quantidade,
    p.valor_unitario,
    (p.quantidade * p.valor_unitario) AS valor_total
FROM produto p;

INSERT INTO categoria (nome, nivel_minimo, nivel_maximo) VALUES
('Limpeza Geral', 10, 100),
('Higiene Pessoal', 5, 80),
('Descartáveis', 20, 150);

INSERT INTO produto (nome, unidade_medida, valor_unitario, quantidade, id_categoria) VALUES
('Detergente Neutro', 'UN', 3.50, 50, 1),
('Sabão em Pó', 'KG', 8.90, 30, 1),
('Papel Higiênico', 'PCT', 15.00, 100, 3);

INSERT INTO movimentacao (id_produto, tipo, quantidade, valor_unitario, data_inicial, data_movimentacao) VALUES
(1, 'ENTRADA', 50, 3.50, '2026-01-05', '2026-01-05 08:00:00'),
(2, 'ENTRADA', 30, 8.90, '2026-01-06', '2026-01-06 09:00:00'),
(3, 'ENTRADA', 100, 15.00, '2026-01-07', '2026-01-07 10:00:00');
