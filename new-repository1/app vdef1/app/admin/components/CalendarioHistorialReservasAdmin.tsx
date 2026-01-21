"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";

interface Reserva {
  id: number;
  sku: string;
  telefono: string;
  fecha_recogida: string; // ISO
  hora_recogida: string; // HH:mm
  origen: string;
  destino: string;
  adultos: number;
  ninos: number;
  pmr: number;
  notas: string;
  estado: string; // pendiente, aceptada, completada, cancelada, expirada
  creado_el: string; // ISO
}

export default function CalendarioHistorialReservasAdmin() {
  const [mesActual, setMesActual] = useState(dayjs());
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservasDia, setReservasDia] = useState<Reserva[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [diasConReservas, setDiasConReservas] = useState<string[]>([]); // ISO YYYY-MM-DD

  useEffect(() => {
    fetchReservasMes();
  }, [mesActual]);

  const fetchReservasMes = async () => {
    const start = mesActual.startOf("month").format("YYYY-MM-DD");
    const end = mesActual.endOf("month").format("YYYY-MM-DD");

    const { data } = await supabase
      .from("reservas")
      .select("*")
      .gte("fecha_recogida", start)
      .lte("fecha_recogida", end)
      .order("fecha_recogida", { ascending: true })
      .order("hora_recogida", { ascending: true });

    if (data) {
      setReservas(data as Reserva[]);
      const dias = Array.from(new Set(data.map((r: Reserva) => r.fecha_recogida)));
      setDiasConReservas(dias);
    }
  };

  const handleDiaClick = (dia: string) => {
    const reservasDelDia = reservas.filter((r) => r.fecha_recogida === dia);
    setReservasDia(reservasDelDia);
    setDiaSeleccionado(dia);
  };

  const cambiarMes = (delta: number) => {
    setMesActual(mesActual.add(delta, "month"));
    setDiaSeleccionado(null);
    setReservasDia([]);
  };

  // Generar matriz de días del mes
  const generarDiasMes = () => {
    const start = mesActual.startOf("month");
    const end = mesActual.endOf("month");
    const dias = [];
    for (let d = start.date(); d <= end.date(); d++) {
      dias.push(start.date(d).format("YYYY-MM-DD"));
    }
    return dias;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Selector mes */}
      <div className="flex justify-between items-center">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => cambiarMes(-1)}
        >
          {"<"}
        </button>
        <span className="font-semibold">
          {mesActual.format("MMMM YYYY")}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => cambiarMes(1)}
        >
          {">"}
        </button>
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
          <div key={d} className="font-semibold">
            {d}
          </div>
        ))}
        {generarDiasMes().map((dia) => (
          <button
            key={dia}
            onClick={() => handleDiaClick(dia)}
            className={`p-2 rounded ${
              diasConReservas.includes(dia) ? "bg-green-400 text-white" : "bg-gray-100"
            } ${dia === diaSeleccionado ? "ring-2 ring-blue-500" : ""}`}
          >
            {dayjs(dia).date()}
          </button>
        ))}
      </div>

      {/* Lista de reservas del día */}
      {diaSeleccionado && (
        <div className="flex flex-col space-y-2 mt-4">
          {reservasDia.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay reservas este día.</p>
          ) : (
            reservasDia.map((r) => (
              <div
                key={r.id}
                className="bg-white p-3 rounded shadow flex flex-col space-y-1 text-sm break-words"
              >
                <div><strong>SKU:</strong> {r.sku}</div>
                <div><strong>Teléfono:</strong> {r.telefono}</div>
                <div>
                  <strong>Fecha/Hora recogida:</strong>{" "}
                  {r.fecha_recogida} {r.hora_recogida}
                </div>
                <div><strong>Origen:</strong> {r.origen}</div>
                <div><strong>Destino:</strong> {r.destino}</div>
                <div><strong>Adultos:</strong> {r.adultos}</div>
                <div><strong>Niños:</strong> {r.ninos}</div>
                <div><strong>PMR:</strong> {r.pmr}</div>
                <div><strong>Notas:</strong> {r.notas}</div>
                <div className="text-xs text-gray-400">
                  Registrada el día {dayjs(r.creado_el).format("DD/MM/YYYY HH:mm:ss")}
                </div>
                <div><strong>Estado:</strong> {r.estado}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
