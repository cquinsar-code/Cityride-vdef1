import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filtro = searchParams.get("filtro") || "";

    // Obtener todas las reservas activas o aceptadas
    const { data: reservas, error } = await supabase
      .from("reservas")
      .select("*")
      .or("aceptada.eq.true, completada.eq.false")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true });

    if (error) return NextResponse.json({ error }, { status: 500 });

    // Filtrado por texto (teléfono, origen, destino, fecha/hora, pasajeros, notas)
    const filtradas = reservas.filter((r: any) => {
      const texto = `${r.telefono || ""} ${r.origen} ${r.destino} ${r.fecha} ${r.hora} ${r.adultos} ${r.ninos} ${r.pmr} ${r.notas}`.toLowerCase();
      return texto.includes(filtro.toLowerCase());
    });

    return NextResponse.json(filtradas);
  } catch (err) {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
