// lib/seed.js
import db from './db.js';

const insert = db.prepare(`
  INSERT INTO patrimonio 
  (nome, codigo, categoria, descricao, data_aquisicao, localizacao, responsavel, situacao)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insert.run(
  "Notebook Dell",
  "001",
  "Informática",
  "Notebook de uso para desenvolvimento",
  "2023-01-15",
  "Sala TI",
  "João Silva",
  "Ativo"
);

insert.run(
  "Cadeira Gamer",
  "002",
  "Mobiliário",
  "Cadeira ergonômica para escritório",
  "2022-08-10",
  "Sala RH",
  "Maria Souza",
  "Inativo"
);

console.log("Dados inseridos!");
