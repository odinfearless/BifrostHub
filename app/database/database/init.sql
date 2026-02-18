-- ==========================================
-- 0. LIMPEZA (Para evitar erros ao rodar de novo)
-- ==========================================
DROP TABLE IF EXISTS itens_venda CASCADE;
DROP TABLE IF EXISTS vendas_conveniencia CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS ordens_servico_lavagem CASCADE;
DROP TABLE IF EXISTS servicos_lavagem CASCADE;
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS servicos_salao CASCADE;
DROP TABLE IF EXISTS veiculos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

DROP TYPE IF EXISTS status_agendamento;
DROP TYPE IF EXISTS status_lavagem;

-- ==========================================
-- 1. CONFIGURAÇÕES GERAIS E ENUMS
-- ==========================================
CREATE TYPE status_agendamento AS ENUM ('AGENDADO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE status_lavagem AS ENUM ('FILA', 'LAVANDO', 'PRONTO', 'ENTREGUE');

-- ==========================================
-- 2. TABELAS COMPARTILHADAS (Base)
-- ==========================================

-- Tabela de Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Veículos (Vinculada ao Cliente)
CREATE TABLE veiculos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    placa VARCHAR(10) UNIQUE, 
    modelo VARCHAR(50),
    marca VARCHAR(50),
    cor VARCHAR(30)
);

-- ==========================================
-- 3. MÓDULO: SALÃO DE CABELEIREIRO
-- ==========================================

-- Serviços (Cortes, Barba, etc)
CREATE TABLE servicos_salao (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL, -- Ex: CT1
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL CHECK (valor >= 0),
    duracao_slots INTEGER NOT NULL DEFAULT 1, -- 1 slot = 30min
    ativo BOOLEAN DEFAULT TRUE
);

-- Agenda
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) NOT NULL,
    servico_id INTEGER REFERENCES servicos_salao(id) NOT NULL,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL, -- Calculado pelo Backend
    observacao TEXT,
    pago BOOLEAN DEFAULT FALSE,
    status status_agendamento DEFAULT 'AGENDADO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. MÓDULO: CONVENIÊNCIA (PDV)
-- ==========================================

-- Produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL, -- Leitor de barras
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_venda DECIMAL(10, 2) NOT NULL CHECK (preco_venda >= 0),
    qtd_estoque INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE
);

-- Vendas (Cabeçalho)
CREATE TABLE vendas_conveniencia (
    id SERIAL PRIMARY KEY,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    metodo_pagamento VARCHAR(50) -- Dinheiro, Pix, Cartão
);

-- Itens da Venda
CREATE TABLE itens_venda (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER REFERENCES vendas_conveniencia(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL -- Preço histórico
);

-- ==========================================
-- 5. MÓDULO: LAVA RÁPIDO
-- ==========================================

-- Serviços de Lavagem
CREATE TABLE servicos_lavagem (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10, 2) NOT NULL CHECK (valor >= 0),
    ativo BOOLEAN DEFAULT TRUE
);

-- Ordens de Serviço (OS)
CREATE TABLE ordens_servico_lavagem (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    veiculo_id INTEGER REFERENCES veiculos(id),
    servico_id INTEGER REFERENCES servicos_lavagem(id),
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    status status_lavagem DEFAULT 'FILA',
    pago BOOLEAN DEFAULT FALSE,
    valor_final DECIMAL(10, 2) NOT NULL
);

-- ==========================================
-- 6. DADOS INICIAIS (SEED)
-- ==========================================

-- Clientes e Veículos
INSERT INTO clientes (nome, telefone, endereco) VALUES 
('João da Silva', '11999999999', 'Rua A, 123'),
('Maria Oliveira', '11988888888', 'Av B, 456');

INSERT INTO veiculos (cliente_id, placa, modelo, marca, cor) VALUES 
(1, 'ABC-1234', 'Civic', 'Honda', 'Preto'),
(2, 'XYZ-9876', 'Gol', 'VW', 'Branco');

-- Serviços Salão
INSERT INTO servicos_salao (codigo, nome, valor, duracao_slots) VALUES 
('CT1', 'Corte Masculino', 40.00, 1), -- 30 min
('CT2', 'Corte + Barba', 70.00, 2);   -- 60 min

-- Serviços Lava Rápido
INSERT INTO servicos_lavagem (nome, valor) VALUES 
('Lavagem Simples', 50.00),
('Lavagem Completa + Cera', 90.00);

-- Produtos Conveniência
INSERT INTO produtos (codigo_barras, nome, preco_venda, qtd_estoque) VALUES 
('7890001', 'Coca-Cola Lata', 6.00, 100),
('7890002', 'Água Mineral', 4.00, 50),
('7890003', 'Chocolate Barra', 8.50, 30);
