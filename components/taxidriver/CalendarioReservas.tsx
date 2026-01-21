"use client";

import { useEffect, useState } from "react";
import TablonGeneral from "./TablonGeneral";
import MisReservas from "./MisReservas";

interface Reserva {
  id: string;
  telefono: string;
  origen: string;
  destino: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  adultos: number;
  ninos: number;
  pmr: number;
  notas: string;
  aceptada: boolean;
  completada?: boolean;
  fechaHoraProgramada: string; // ISO
}

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [mesActual, setMesActual] = useState(new Date());

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch("/api/taxidriver/reservas/all");
        const data = await res.json();
        setReservas(data);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };

    fetchReservas();
  }, [mesActual]);

  const diasEnMes = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dias = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dia = new Date(year, month, d);
      dias.push(dia);
    }
    return dias;
  };

  const reservasPorDia = (dia: Date) => {
    const diaStr = dia.toISOString().slice(0, 10);
    return reservas
      .filter(
        (r) =>
          r.fecha === diaStr &&
          r.aceptada &&
          !r.completada // solo activas/aceptadas, no completadas/expiradas
      )
      .sort(
        (a, b) =>
          new Date(a.fechaHoraProgramada).getTime() -
          new Date(b.fechaHoraProgramada).getTime()
      );
  };

  const dias = diasEnMes(mesActual);

  const cambiarMes = (incremento: number) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(nuevoMes.getMonth() + incremento);
    setMesActual(nuevoMes);
    setFechaSeleccionada(null);
  };

  return (
    <div className="space-y-4">
      {/* Navegación de mes */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => cambiarMes(-1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {mesActual.toLocaleString("es-ES", { month: "long", year: "numeric" })}
        </h2>
        <button
          onClick={() => cambiarMes(1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          &gt;
        </button>
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia) => {
          const reservasDia = reservasPorDia(dia);
          const isSombreado = reservasDia.length > 0;
          return (
            <button
              key={dia.toISOString()}
              onClick={() => setFechaSeleccionada(dia.toISOString().slice(0, 10))}
              className={`p-2 rounded text-center ${
                isSombreado ? "bg-green-300 font-bold" : "bg-gray-100"
              }`}
            >
              {dia.getDate()}
            </button>
          );
        })}
      </div>

      {/* Reservas del día seleccionado */}
      {fechaSeleccionada && (
        <div className="mt-4 space-y-3">
          <h3 className="font-semibold text-center">
            Reservas para el {fechaSeleccionada}
          </h3>
          {reservas
            .filter((r) => r.fecha === fechaSeleccionada)
            .sort(
              (a, b) =>
                new Date(a.fechaHoraProgramada).getTime() -
                new Date(b.fechaHoraProgramada).getTime()
            )
            .map((r) => (
              <div
                key={r.id}
                className="border rounded-lg p-4 shadow bg-white flex flex-col space-y-2"
              >
                <p>
                  <strong>Origen:</strong> {r.origen}
                </p>
                <p>
                  <strong>Destino:</strong> {r.destino}
                </p>
                <p>
                  <strong>Fecha:</strong> {r.fecha} <strong>Hora:</strong> {r.hora}
                </p>
                <p>
                  <strong>Adultos:</strong> {r.adultos} <strong>Niños:</strong>{" "}
                  {r.ninos} <strong>PMR:</strong> {r.pmr}
                </p>
                <p>
                  <strong>Notas:</strong> {r.notas || "-"}
                </p>
                {r.aceptada && (
                  <p>
                    <strong>Teléfono cliente:</strong>{" "}
                    <a
                      href={`tel:${r.telefono}`}
                      className="text-green-600 font-medium"
                    >
                      {r.telefono}
                    </a>
                  </p>
                )}
                {/* Toggle para aceptar/desaceptar */}
                {!r.aceptada && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Aceptar traslado
                  </button>
                )}
                {/* Botones Sí/No para marcar traslado */}
                {r.aceptada && new Date() >= new Date(r.fechaHoraProgramada) && (
                  <div className="flex space-x-4 mt-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                      Sí
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded">
                      No
                    </button>
                  </div>
                )}
              </div>
            ))}
          {reservas.filter((r) => r.fecha === fechaSeleccionada).length === 0 && (
            <p className="text-center text-gray-500">No hay reservas para este día.</p>
          )}
        </div>
      )}
    </div>
  );
}
