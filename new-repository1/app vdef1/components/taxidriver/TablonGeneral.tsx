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
  fechaHoraProgramada: string; // ISO
}

export default function TablonGeneral() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // Fetch inicial y cada 10 seg
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch("/api/taxidriver/reservas/pendientes");
        const data = await res.json();
        setReservas(data);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };
    fetchReservas();
    const interval = setInterval(fetchReservas, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (reserva: Reserva) => {
    const fechaReserva = new Date(reserva.fechaHoraProgramada);
    const ahora = new Date();
    const diffDias = (fechaReserva.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24);

    // Verificar ventana de 5 días
    if (diffDias > 5) {
      alert("No se permiten aceptar reservas posteriores a 5 días desde la fecha actual");
      return;
    }

    // Verificar límite 5 reservas activas
    const activas = reservas.filter((r) => r.aceptada).length;
    if (!reserva.aceptada && activas >= 5) {
      alert("No se permiten aceptar más de 5 reservas simultáneamente. Completa algún traslado para aceptar uno nuevo.");
      return;
    }

    // Llamada a backend para aceptar/desaceptar con bloqueo transacción
    try {
      const res = await fetch("/api/taxidriver/reservas/aceptar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reserva.id, aceptar: !reserva.aceptada }),
      });
      if (!res.ok) throw new Error("Error al actualizar reserva");

      // Actualizar estado local
      setReservas((prev) =>
        prev.map((r) => (r.id === reserva.id ? { ...r, aceptada: !r.aceptada } : r))
      );
    } catch (error) {
      console.error(error);
      alert("Error al procesar la solicitud. Intenta nuevamente.");
    }
  };

  // Filtrado por buscador
  const reservasFiltradas = reservas.filter((r) => {
    const term = busqueda.toLowerCase();
    return (
      r.telefono.includes(term) ||
      r.origen.toLowerCase().includes(term) ||
      r.destino.toLowerCase().includes(term) ||
      r.fecha.includes(term) ||
      r.hora.includes(term) ||
      r.adultos.toString().includes(term) ||
      r.ninos.toString().includes(term) ||
      r.pmr.toString().includes(term) ||
      r.notas.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar reservas..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Lista de reservas */}
      <div className="space-y-4">
        {reservasFiltradas.map((r) => (
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

            {/* Toggle switch */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={r.aceptada}
                  onChange={() => handleToggle(r)}
                  className="toggle-checkbox"
                />
                <span>Aceptar traslado</span>
              </label>
            </div>
          </div>
        ))}

        {reservasFiltradas.length === 0 && (
          <p className="text-center text-gray-500">No hay reservas que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
}
