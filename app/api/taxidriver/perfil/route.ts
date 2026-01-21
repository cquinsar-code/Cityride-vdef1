import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(req: Request) {
  try {
    const taxistaId = req.headers.get("x-taxista-id"); // se pasa desde frontend

    if (!taxistaId) return NextResponse.json({ error: "Taxista no autenticado" }, { status: 401 });

    const { data: taxista, error } = await supabase
      .from("taxistas")
      .select("id, nombre, telefono, email, licencia, limitacion_municipal, matricula, marca_modelo, plazas, adaptado, usuario, created_at")
      .eq("id", taxistaId)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(taxista);
  } catch (err) {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
