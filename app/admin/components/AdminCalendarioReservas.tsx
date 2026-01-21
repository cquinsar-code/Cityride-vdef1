"use client";
import React, { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import ListaReservasDia from "./ListaReservasDia";

interface Reserva {
  id: number;
  sku: string;
  telefono: string;
  fecha: string;
  hora: string;
  origen: string;
  destino: string;
  adultos: number;
  ninos: number;
  pmr: number;
  notas: string;
  horaRegistro: string;
  estado: string;
}

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null);

  useEffect(()=>{
    fetch("/api/admin/reservas")
      .then(res=>res.json())
      .then(data=>setReservas(data));
  },[]);

  // Generar días del mes actual
  const hoy = new Date();
  const diasDelMes = Array.from({length: new Date(hoy.getFullYear(), hoy.getMonth()+1, 0).getDate()}, (_, i) => new Date(hoy.getFullYear(), hoy.getMonth(), i+1));

  const diasConReservas = reservas.map(r=>new Date(r.fecha));

  const sombrear = (dia:Date)=>{
    return diasConReservas.some(d => isSameDay(d, dia));
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-4">
        {diasDelMes.map((dia, idx)=>(
          <div key={idx} className={`p-2 text-center rounded ${sombrear(dia)?"bg-green-300":"bg-gray-100"}`}>
            <button onClick={()=>setDiaSeleccionado(dia)}>
              {dia.getDate()}
            </button>
          </div>
        ))}
      </div>

      {diaSeleccionado && <ListaReservasDia reservas={reservas.filter(r => isSameDay(new Date(r.fecha), diaSeleccionado))} onVolver={()=>setDiaSeleccionado(null)} />}
    </div>
  )
}
