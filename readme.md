CREATE DATABASE db_transporte_adaptado; 
USE db_transporte_adaptado;

-- TABLE USUÁRIOS
select * from usuarios;
drop tables usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    roteiro VARCHAR(100) NOT NULL,
    destino VARCHAR(50) NOT NULL,
    celular VARCHAR(100) NOT NULL,
    cpf VARCHAR(50) UNIQUE NOT NULL
);

DELETE FROM usuarios WHERE id = 1;


-- Admin
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Raul Guilherme', 'senha123', 'Chefe de Departamento', 'Admin', 'Admin','11958730179', '123456');

-- Monitora/Motorista APAE
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Giovana', 'giovana123', 'Monitora','roteiro3noa', 'RoteirosNOA', '11574175247', '2020');

-- Monitora/Motorista NOA
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Antonino', 'antonino123', 'Motorista','roteiro6noa', 'RoteirosNOA', '11987412474', '2005');

-- Monitora/Motorista NAE
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Alex Patrão', 'alex123', 'Motorista','roteiro1nae', 'RoteirosNAE', '11987412474', '123');

-- Monitora/Motorista Prefeitura
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Priscilla Bressiane', 'pri123', 'Monitora','roteiro1pref', 'RoteirosPrefeitura', '1191234568', '202020');


-- TABLE Comunicados
select * from comunicados;
drop tables comunicados;
CREATE TABLE comunicados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data_hora DATETIME NOT NULL
);
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS excluir_comunicados_antigos
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM comunicados WHERE data_hora < NOW() - INTERVAL 7 DAY;



-- Tabela Ocorrências
drop table ocorrencias;
Select * from ocorrencias;

CREATE TABLE ocorrencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    monitora VARCHAR(100),
    motorista VARCHAR(100),
    aluno VARCHAR(100),
    escola VARCHAR(100),
    descricao TEXT NOT NULL
);

-- Exemplo
INSERT INTO ocorrencias (data, monitora, motorista, aluno, escola, descricao)
VALUES ('2025-05-27', 'Maria Silva', 'João Souza', 'Lucas Oliveira', 'Escola Municipal ABC', 'Aluno apresentou comportamento agitado durante o trajeto.');


-- Tabela Atestados
drop table atestados;
Select * from atestados;

CREATE TABLE atestados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno VARCHAR(255) NOT NULL,
    monitora VARCHAR(255) NOT NULL,
    arquivo VARCHAR(255) NOT NULL
);



-- Tabela Mensagens Diretas
select * from mensagens_diretas;

CREATE TABLE mensagens_diretas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data_hora DATETIME NOT NULL,
    id_usuario_destino INT NOT NULL,
    FOREIGN KEY (id_usuario_destino) REFERENCES usuarios(id)
);



-- Roteiros 

-- Roteiro 1 Apae - Ana e Rafael 
select * from alunos_roteiro1apae;
CREATE TABLE alunos_roteiro1apae (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escola VARCHAR(100),
    serie VARCHAR(20),
    nome_completo VARCHAR(150),
    horario VARCHAR(50),
    endereco VARCHAR(200),
    responsavel VARCHAR(150),
    cid VARCHAR(100)
);
select * from observacoes_alunos_roteiro1apae;
CREATE TABLE observacoes_alunos_roteiro1apae (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    observacao TEXT NOT NULL
);
select * from frequencia_roteiro1apae;
CREATE TABLE frequencia_roteiro1apae (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    data DATE NOT NULL,
    status VARCHAR(5) NOT NULL, -- PF, PP, FF, FP, A, SA
    FOREIGN KEY (id_aluno) REFERENCES alunos_roteiro1apae(id) ON DELETE CASCADE,
    UNIQUE KEY unique_frequencia (id_aluno, data)
);




-- Roteiro 2 Apae - Camili e Márcio 
select * from alunos_roteiro2apae;
CREATE TABLE alunos_roteiro2apae (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escola VARCHAR(100),
    serie VARCHAR(20),
    nome_completo VARCHAR(150),
    horario VARCHAR(50),
    endereco VARCHAR(200),
    responsavel VARCHAR(150),
    cid VARCHAR(100)
);
CREATE TABLE observacoes_alunos_roteiro2apae (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    observacao TEXT NOT NULL
);




-- Roteiro 3 NOA - Giovana e Jussimar
select * from alunos_roteiro3noa;
CREATE TABLE alunos_roteiro3noa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escola VARCHAR(100),
    serie VARCHAR(20),
    nome_completo VARCHAR(150),
    horario VARCHAR(50),
    endereco VARCHAR(200),
    responsavel VARCHAR(150),
    cid VARCHAR(100)
);

CREATE TABLE observacoes_alunos_roteiro3noa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    observacao TEXT NOT NULL
);

INSERT INTO alunos_roteiro3noa (escola, serie, nome_completo, horario, endereco, responsavel, cid)
VALUES (
    'Escola Municipal Aurora', 
    '3º Ano', 
    'Lucas Henrique da Silva', 
    '07:30 - 12:00', 
    'Rua das Rosas, 456 - Bairro Jardim', 
    'Maria da Silva', 
    'F84.0'
);