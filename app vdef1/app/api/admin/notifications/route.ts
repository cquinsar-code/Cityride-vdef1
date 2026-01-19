import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configura tu URL y key de Supabase desde variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Usar key segura de servicio
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Supongamos que tienes una tabla "admin_notifications"
    // con columnas: id (uuid), text_en, text_es, text_de, text_it, text_fr, active (boolean)
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("id,text_en,text_es,text_de,text_it,text_fr")
      .eq("active", true)
      .order("id", { ascending: false }); // Mostrar las más recientes primero

    if (error) {
      console.error("Error fetching notifications:", error);
      return NextResponse.json([], { status: 500 });
    }

    // Convertir a formato esperado por el componente
    const notifications = data.map((n: any) => ({
      id: n.id,
      text: {
        en: n.text_en,
        es: n.text_es,
        de: n.text_de,
        it: n.text_it,
        fr: n.text_fr,
      },
    }));

    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Unexpected error fetching notifications:", err);
    return NextResponse.json([], { status: 500 });
  }
}
