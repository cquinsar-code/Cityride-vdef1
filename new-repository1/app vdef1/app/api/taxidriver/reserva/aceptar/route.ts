import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reservaId, taxistaId } = body;

    // Obtener hora actual y fecha para límite 5 días
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 5);

    // Iniciamos transacción
    const { data: reserva } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", reservaId)
      .single();

    if (!reserva) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });

    const fechaReserva = new Date(reserva.fecha + "T" + reserva.hora);

    if (fechaReserva > maxDate) {
      return NextResponse.json({
        error: "No se permiten aceptar reservas posteriores a 5 días desde la fecha actual",
      }, { status: 400 });
    }

    // Verificar máximo 5 reservas activas simultáneas
    const { data: activas } = await supabase
      .from("reservas")
      .select("id")
      .eq("taxista_id", taxistaId)
      .eq("aceptada", true)
      .eq("completada", false);

    if (activas && activas.length >= 5) {
      return NextResponse.json({
        error: "No se permiten aceptar más de 5 reservas simultáneamente. Completa algún traslado para aceptar uno nuevo.",
      }, { status: 400 });
    }

    // Bloqueo por row-level lock
    const { data: updated, error } = await supabase
      .from("reservas")
      .update({ aceptada: true, taxista_id: taxistaId })
      .eq("id", reservaId)
      .eq("aceptada", false);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!updated || updated.length === 0) return NextResponse.json({ error: "Reserva ya fue aceptada por otro taxista" }, { status: 409 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
