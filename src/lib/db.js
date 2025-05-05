// lib/db.js
import Database from 'better-sqlite3';
const db = new Database('patrimonios.db');

// Criação da tabela com todos os campos
db.exec(`
  CREATE TABLE IF NOT EXISTS patrimonio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    data_aquisicao TEXT,
    localizacao TEXT,
    responsavel TEXT,
    situacao TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    nome TEXT,
    setor TEXT,
    nivel_permissao INTEGER DEFAULT 1
  );
`);

export default db;
