
import db from './lib/db';

export async function GET() {
  const stmt = db.prepare('SELECT * FROM patrimonio');
  const patrimonios = stmt.all();

  return Response.json(patrimonios);
}
