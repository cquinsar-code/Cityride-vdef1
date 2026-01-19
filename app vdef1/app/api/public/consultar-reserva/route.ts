import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DateTime } from 'luxon'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Zona horaria Canarias
const TZ = 'Atlantic/Canary'

export async function POST(req: NextRequest) {
  try {
    const { telefono } = await req.json()

    if (!telefono || typeof telefono !== 'string') {
      return NextResponse.json(null, { status: 400 })
    }

    const now = DateTime.now().setZone(TZ)

    // Buscar reservas aceptadas asociadas a ese teléfono
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select(`
        id,
        telefono,
        fecha_recogida,
        hora_recogida,
        origen,
        destino,
        adultos,
        ninos,
        pmr,
        notas,
        taxista_id,
        taxistas (
          nombre,
          telefono,
          matricula,
          licencia_municipal,
          marca_modelo,
          pmr
        )
      `)
      .eq('telefono', telefono)
      .eq('estado', 'aceptada')
      .is('cancelada', false)

    if (error || !reservas || reservas.length === 0) {
      return NextResponse.json(null, { status: 404 })
    }

    // Filtrar por intervalo <= 1 hora antes de la recogida
    const candidatas = reservas
      .map((r) => {
        const fechaHora = DateTime.fromISO(
          `${r.fecha_recogida}T${r.hora_recogida}`,
          { zone: TZ }
        )

        const diffMinutes = fechaHora.diff(now, 'minutes').minutes

        return {
          ...r,
          fechaHora,
          diffMinutes,
        }
      })
      .filter(
        (r) =>
          r.diffMinutes >= 0 && r.diffMinutes <= 60 && r.taxistas !== null
      )

    if (candidatas.length === 0) {
      return NextResponse.json(null, { status: 403 })
    }

    // Ordenar por la más próxima a la hora actual
    candidatas.sort((a, b) => a.diffMinutes - b.diffMinutes)

    const reserva = candidatas[0]

    return NextResponse.json({
      reserva: {
        fecha: reserva.fecha_recogida,
        hora: reserva.hora_recogida,
        origen: reserva.origen,
        destino: reserva.destino,
        pasajeros: {
          adultos: reserva.adultos,
          ninos: reserva.ninos,
          pmr: reserva.pmr,
        },
        notas: reserva.notas,
      },
      taxista: {
        nombre: reserva.taxistas.nombre,
        telefono: reserva.taxistas.telefono,
        matricula: reserva.taxistas.matricula,
        licencia: reserva.taxistas.licencia_municipal,
        vehiculo: reserva.taxistas.marca_modelo,
        pmr: reserva.taxistas.pmr,
      },
    })
  } catch (e) {
    return NextResponse.json(null, { status: 500 })
  }
}
