import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

// Helper para checar permissões
function podeModificar(item, user) {
  if (user.nivel_permissao === 4) return true;
  if (user.nivel_permissao === 3 && item.localizacao === user.setor) return true;
  if (user.nivel_permissao === 2 && item.responsavel === user.name) return true;
  return false;
}

export async function GET() {
  const stmt = db.prepare('SELECT * FROM patrimonio');
  const patrimonios = stmt.all();
  return NextResponse.json(patrimonios);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

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
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  const data = await req.json();
  const itemAtual = db.prepare('SELECT * FROM patrimonio WHERE id = ?').get(data.id);

  if (!itemAtual) {
    return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
  }

  if (!podeModificar(itemAtual, session.user)) {
    return NextResponse.json({ error: 'Sem permissão para editar' }, { status: 403 });
  }

  db.prepare(`
    UPDATE patrimonio SET 
      codigo = ?, nome = ?, categoria = ?, descricao = ?, 
      data_aquisicao = ?, localizacao = ?, responsavel = ?, situacao = ?
    WHERE id = ?
  `).run(
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
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  const { id } = await req.json();
  const itemAtual = db.prepare('SELECT * FROM patrimonio WHERE id = ?').get(id);

  if (!itemAtual) {
    return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
  }

  if (!podeModificar(itemAtual, session.user)) {
    return NextResponse.json({ error: 'Sem permissão para excluir' }, { status: 403 });
  }

  db.prepare('DELETE FROM patrimonio WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}
