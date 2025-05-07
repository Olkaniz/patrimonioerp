import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { podeModificar, getItemById } from "@/lib/firestore-helpers";

// GET - Listar todos os patrimônios
export async function GET() {
  const snapshot = await getDocs(collection(db, "patrimonios"));
  const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(dados);
}

// POST - Criar novo patrimônio
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const data = await req.json();
  const docRef = await addDoc(collection(db, "patrimonios"), data);
  return NextResponse.json({ id: docRef.id, ...data });
}

// PUT - Atualizar um patrimônio
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const data = await req.json();
  const item = await getItemById(data.id);

  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  if (!podeModificar(item, session.user)) {
    return NextResponse.json({ error: "Sem permissão para editar" }, { status: 403 });
  }

  const ref = doc(db, "patrimonios", data.id);
  await updateDoc(ref, data);
  return NextResponse.json({ success: true });
}

// DELETE - Remover um patrimônio
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.nivel_permissao < 2) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await req.json();
  const item = await getItemById(id);

  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  if (!podeModificar(item, session.user)) {
    return NextResponse.json({ error: "Sem permissão para excluir" }, { status: 403 });
  }

  const ref = doc(db, "patrimonios", id);
  await deleteDoc(ref);
  return NextResponse.json({ success: true });
}
