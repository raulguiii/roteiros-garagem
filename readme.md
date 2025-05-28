CREATE DATABASE db_transporte_adaptado; 
USE db_transporte_adaptado;

-- TABLE USUÁRIOS
select * from usuarios;

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

-- Admin
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Raul Guilherme', 'senha123', 'Admin', 'Admin', 'Admin','11915551648', '48816520876');

-- Monitora/Motorista APAE
INSERT INTO usuarios (
nome_completo, 
senha, 
cargo, 
roteiro, 
destino, 
celular, 
cpf) 
VALUES ('Ana Julia', 'ana123', 'Monitora','roteiro1apae', 'RoteirosApae', '1484848118', '1010');

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



