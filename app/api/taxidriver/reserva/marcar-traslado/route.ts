import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const { reservaId, realizada } = await req.json(); // realizada: true/false

    const { data: reserva } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", reservaId)
      .single();

    if (!reserva) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });

    const fechaReserva = new Date(reserva.fecha + "T" + reserva.hora);
    const now = new Date();
    if (fechaReserva > now) return NextResponse.json({ error: "La reserva aún no ha pasado", status: 400 });

    const { error } = await supabase
      .from("reservas")
      .update({ completada: realizada, expirada: !realizada })
      .eq("id", reservaId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
