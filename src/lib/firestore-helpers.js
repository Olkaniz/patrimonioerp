// lib/firestore-helpers.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Verifica se o usuário pode modificar o item
export function podeModificar(item, user) {
  if (user.nivel_permissao === 4) return true;
  if (user.nivel_permissao === 3 && item.localizacao === user.setor) return true;
  if (user.nivel_permissao === 2 && item.responsavel === user.name) return true;
  return false;
}

// Puxa item por ID
export async function getItemById(id) {
  const ref = doc(db, "patrimonios", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
