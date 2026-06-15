# Sistema de Controle de Almoxarifado

## 1. Banco de Dados
Execute o script em `db/script.sql` no MySQL para criar o banco `db_almoxarifado`,
as tabelas (categoria, produto, movimentacao), a view `vw_estoque` e os registros iniciais.

## 2. Configuração
Ajuste o arquivo `.env` com as credenciais do seu MySQL.

## 3. Instalação e execução
```bash
npm install
npm start
```
API disponível em `http://localhost:3000`.

## 4. Endpoints

### Produtos
- `POST /produtos` — cadastra produto (valida nome, unidade_medida, valor_unitario, quantidade, id_categoria)
- `GET /produtos` — lista todos os produtos cadastrados
- `GET /produtos/valor-total-categoria` — valor total por categoria (quantidade x valor unitário)
- `GET /produtos/limites` — produtos que atingiram limite mínimo (0) ou máximo (100), com percentual de nível atingido

### Movimentações
- `POST /movimentacoes` — registra entrada ou saída (valida id_produto, tipo, quantidade, valor_unitario; atualiza saldo automaticamente)
  ```json
  {
    "id_produto": 1,
    "tipo": "ENTRADA",
    "quantidade": 10,
    "valor_unitario": 3.50,
    "data_inicial": "2026-06-01"
  }
  ```
- `GET /movimentacoes/saidas` — lista todas as saídas, ordem decrescente por data
- `GET /movimentacoes/periodo?data_inicial=YYYY-MM-DD&data_final=YYYY-MM-DD` — movimentações de entrada/saída no período (nome do produto, unidade de medida, total de entradas, total de saídas, saldo, valor total financeiro das entradas e saídas)
- `GET /movimentacoes/maior-volume-saida?data_inicial=YYYY-MM-DD&data_final=YYYY-MM-DD` — produtos com maior volume de saída no período (nome, quantidade total de saída, valor total financeiro)

## 5. Boas práticas aplicadas
- Validação de campos obrigatórios em todas as entradas
- Logs no terminal/console para cada requisição e operação no banco
- Transações com lock (`FOR UPDATE`) para garantir consistência do saldo de estoque
- Uso de connection pool, variáveis de ambiente e separação em camadas (routes/controllers/db/validators)
