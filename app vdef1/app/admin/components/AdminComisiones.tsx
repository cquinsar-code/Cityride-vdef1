"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import dayjs from "dayjs";

interface TaxistaComision {
  usuario: string;
  nombre: string;
  viajes_aceptados: number;
  viajes_completados: number;
  comision_aceptados: number;
  comision_completados: number;
}

export default function AdminComisiones() {
  const [fecha, setFecha] = useState(dayjs().format("YYYY-MM-DD"));
  const [valorComision, setValorComision] = useState<number>(1); // valor por viaje
  const [comisiones, setComisiones] = useState<TaxistaComision[]>([]);
  const [mostrar, setMostrar] = useState<"aceptados" | "completados">("completados");

  useEffect(() => {
    fetchComisiones();
  }, [fecha, valorComision, mostrar]);

  const fetchComisiones = async () => {
    // Traer todos los taxistas
    const { data: taxistas } = await supabase.from("taxistas").select("*");
    if (!taxistas) return;

    const comisionesData: TaxistaComision[] = [];

    for (const t of taxistas) {
      // Traer reservas completadas/aceptadas de ese taxista en la fecha seleccionada
      const { data: reservas } = await supabase
        .from("reservas")
        .select("*")
        .eq("id_taxista", t.id)
        .gte("fecha_recogida", fecha)
        .lte("fecha_recogida", fecha)
        .eq(mostrar === "completados" ? "completada" : "aceptada", true);

      const totalViajes = reservas ? reservas.length : 0;

      comisionesData.push({
        usuario: t.usuario,
        nombre: t.nombre,
        viajes_aceptados: mostrar === "aceptados" ? totalViajes : 0,
        viajes_completados: mostrar === "completados" ? totalViajes : 0,
        comision_aceptados: mostrar === "aceptados" ? totalViajes * valorComision : 0,
        comision_completados: mostrar === "completados" ? totalViajes * valorComision : 0,
      });
    }

    setComisiones(comisionesData);
  };

  const generarPDF = (taxista: TaxistaComision) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Comisión de ${taxista.nombre} (${taxista.usuario})`, 10, 10);
    doc.text(`Fecha: ${fecha}`, 10, 20);
    doc.text(`Viajes ${mostrar}: ${mostrar === "aceptados" ? taxista.viajes_aceptados : taxista.viajes_completados}`, 10, 30);
    doc.text(`Valor por viaje: €${valorComision}`, 10, 40);
    doc.text(`Comisión total: €${mostrar === "aceptados" ? taxista.comision_aceptados : taxista.comision_completados}`, 10, 50);

    // Descargar PDF
    doc.save(`comision_${taxista.usuario}_${fecha}.pdf`);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div>
          <label className="mr-2">Fecha:</label>
          <input
            type="date"
            className="border p-1 rounded"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div>
          <label className="mr-2">Valor comisión (€):</label>
          <input
            type="number"
            min={0}
            step={0.1}
            className="border p-1 rounded w-20"
            value={valorComision}
            onChange={(e) => setValorComision(Number(e.target.value))}
          />
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${mostrar === "aceptados" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setMostrar("aceptados")}
          >
            Mostrar viajes aceptados
          </button>
          <button
            className={`px-3 py-1 rounded ${mostrar === "completados" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setMostrar("completados")}
          >
            Mostrar viajes completados
          </button>
        </div>
      </div>

      {/* Lista de comisiones */}
      <div className="flex flex-col space-y-2">
        {comisiones.map((t) => (
          <div key={t.usuario} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div className="text-sm">
              <strong>{t.nombre} ({t.usuario})</strong> <br />
              Viajes {mostrar}: {mostrar === "aceptados" ? t.viajes_aceptados : t.viajes_completados} <br />
              Comisión: €{mostrar === "aceptados" ? t.comision_aceptados : t.comision_completados}
            </div>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              onClick={() => generarPDF(t)}
            >
              Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
