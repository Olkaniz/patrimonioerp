import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Helper para checar permissões
function podeModificar(item, user) {
  if (user.nivel_permissao === 4) return true;
  if (user.nivel_permissao === 3 && item.localizacao === user.setor) return true;
  if (user.nivel_permissao === 2 && item.responsavel === user.name) return true;
  return false;
}

// GET - Listar patrimônios
export async function GET() {
  const snapshot = await getDocs(collection(db, 'patrimonios'));
  const patrimonios = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(patrimonios);
}

// POST - Criar novo patrimônio
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  const data = await req.json();

  const docRef = await addDoc(collection(db, 'patrimonios'), data);
  return NextResponse.json({ id: docRef.id, ...data });
}

// PUT - Atualizar patrimônio
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  const data = await req.json();
  const docRef = doc(db, 'patrimonios', data.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
  }

  const itemAtual = docSnap.data();

  if (!podeModificar(itemAtual, session.user)) {
    return NextResponse.json({ error: 'Sem permissão para editar' }, { status: 403 });
  }

  await updateDoc(docRef, data);
  return NextResponse.json({ success: true });
}

// DELETE - Excluir patrimônio
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  const { id } = await req.json();
  const docRef = doc(db, 'patrimonios', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
  }

  const itemAtual = docSnap.data();

  if (!podeModificar(itemAtual, session.user)) {
    return NextResponse.json({ error: 'Sem permissão para excluir' }, { status: 403 });
  }

  await deleteDoc(docRef);
  return NextResponse.json({ success: true });
}
