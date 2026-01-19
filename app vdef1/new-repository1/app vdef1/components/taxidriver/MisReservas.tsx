"use client";

import { useEffect, useState } from "react";

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

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch("/api/taxidriver/reservas/mias");
        const data = await res.json();
        setReservas(data);
      } catch (error) {
        console.error("Error fetching mis reservas:", error);
      }
    };
    fetchReservas();
    const interval = setInterval(fetchReservas, 10000); // refresco cada 10 seg
    return () => clearInterval(interval);
  }, []);

  const handleMarcarTraslado = async (reserva: Reserva, completada: boolean) => {
    try {
      const res = await fetch("/api/taxidriver/reservas/marcar-traslado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reserva.id, completada }),
      });
      if (!res.ok) throw new Error("Error al actualizar traslado");

      setReservas((prev) =>
        prev.map((r) => (r.id === reserva.id ? { ...r, completada } : r))
      );
    } catch (error) {
      console.error(error);
      alert("Error al marcar el traslado. Intenta nuevamente.");
    }
  };

  const isTrasladoEditable = (reserva: Reserva) => {
    const fechaHora = new Date(reserva.fechaHoraProgramada);
    const ahora = new Date();
    return ahora >= fechaHora && reserva.completada === undefined;
  };

  return (
    <div className="space-y-4">
      {reservas.map((r) => (
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
            <strong>Adultos:</strong> {r.adultos} <strong>Niños:</strong> {r.ninos}{" "}
            <strong>PMR:</strong> {r.pmr}
          </p>
          <p>
            <strong>Notas:</strong> {r.notas || "-"}
          </p>
          <p>
            <strong>Teléfono cliente:</strong>{" "}
            <a href={`tel:${r.telefono}`} className="text-green-600 font-medium">
              {r.telefono}
            </a>
          </p>

          {/* Botones Sí/No para marcar traslado si la fecha/hora ha pasado */}
          {isTrasladoEditable(r) && (
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleMarcarTraslado(r, true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Sí
              </button>
              <button
                onClick={() => handleMarcarTraslado(r, false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          )}

          {/* Estado actual */}
          {r.completada !== undefined && (
            <p className="text-sm text-gray-600 mt-2">
              Estado del traslado: {r.completada ? "Completado" : "Expirado"}
            </p>
          )}
        </div>
      ))}

      {reservas.length === 0 && (
        <p className="text-center text-gray-500">No tienes reservas activas.</p>
      )}
    </div>
  );
}
