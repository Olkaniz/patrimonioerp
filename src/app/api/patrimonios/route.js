// src/app/api/patrimonios/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const stmt = db.prepare('SELECT * FROM patrimonio');
  const patrimonios = stmt.all();
  return NextResponse.json(patrimonios);
}

export async function POST(req) {
  const data = await req.json();
  const stmt = db.prepare(`
    INSERT INTO patrimonio 
    (codigo, nome, categoria, descricao, data_aquisicao, localizacao, responsavel, situacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    data.codigo,
    data.nome,
    data.categoria,
    data.descricao,
    data.data_aquisicao,
    data.localizacao,
    data.responsavel,
    data.situacao
  );
  return NextResponse.json({ id: info.lastInsertRowid, ...data });
}

export async function PUT(req) {
  const data = await req.json();
  const stmt = db.prepare(`
    UPDATE patrimonio SET 
      codigo = ?, nome = ?, categoria = ?, descricao = ?, 
      data_aquisicao = ?, localizacao = ?, responsavel = ?, situacao = ?
    WHERE id = ?
  `);
  stmt.run(
    data.codigo,
    data.nome,
    data.categoria,
    data.descricao,
    data.data_aquisicao,
    data.localizacao,
    data.responsavel,
    data.situacao,
    data.id
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  const stmt = db.prepare('DELETE FROM patrimonio WHERE id = ?');
  stmt.run(id);
  return NextResponse.json({ success: true });
}
