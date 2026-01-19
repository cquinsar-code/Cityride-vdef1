"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import jsPDF from "jspdf";

interface Taxista {
  id: number;
  usuario: string;
  nombre: string;
  telefono: string;
}

interface ResumenComision {
  taxista: Taxista;
  viajesAceptados: number;
  viajesCompletados: number;
  comisionAceptados: number;
  comisionCompletados: number;
}

export default function ComisionesAdmin() {
  const [fecha, setFecha] = useState(dayjs().format("YYYY-MM-DD"));
  const [taxistas, setTaxistas] = useState<Taxista[]>([]);
  const [valorComision, setValorComision] = useState<number>(1);
  const [resumen, setResumen] = useState<ResumenComision[]>([]);

  useEffect(() => {
    fetchTaxistas();
  }, []);

  const fetchTaxistas = async () => {
    const { data } = await supabase.from("taxistas").select("*");
    if (data) setTaxistas(data as Taxista[]);
  };

  const calcularComisiones = async () => {
    const newResumen: ResumenComision[] = [];

    for (const t of taxistas) {
      const { data: aceptadas } = await supabase
        .from("reservas")
        .select("*")
        .eq("id_taxista", t.id)
        .eq("estado", "aceptada")
        .gte("fecha_recogida", dayjs(fecha).startOf("day").toISOString())
        .lte("fecha_recogida", dayjs(fecha).endOf("day").toISOString());

      const { data: completadas } = await supabase
        .from("reservas")
        .select("*")
        .eq("id_taxista", t.id)
        .eq("estado", "completada")
        .gte("fecha_recogida", dayjs(fecha).startOf("day").toISOString())
        .lte("fecha_recogida", dayjs(fecha).endOf("day").toISOString());

      newResumen.push({
        taxista: t,
        viajesAceptados: aceptadas?.length || 0,
        viajesCompletados: completadas?.length || 0,
        comisionAceptados: (aceptadas?.length || 0) * valorComision,
        comisionCompletados: (completadas?.length || 0) * valorComision,
      });
    }

    setResumen(newResumen);
  };

  const generarPDF = (res: ResumenComision) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Comisión para ${res.taxista.usuario}`, 10, 10);
    doc.text(`Fecha: ${fecha}`, 10, 20);
    doc.text(`Viajes aceptados: ${res.viajesAceptados}`, 10, 30);
    doc.text(`Comisión por aceptados: €${res.comisionAceptados}`, 10, 40);
    doc.text(`Viajes completados: ${res.viajesCompletados}`, 10, 50);
    doc.text(`Comisión por completados: €${res.comisionCompletados}`, 10, 60);

    doc.save(`${res.taxista.usuario}_comision_${fecha}.pdf`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={valorComision}
          min={0}
          step={0.01}
          onChange={(e) => setValorComision(parseFloat(e.target.value))}
          className="border px-2 py-1 rounded"
          placeholder="Valor comisión"
        />
        <button
          onClick={calcularComisiones}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Calcular
        </button>
      </div>

      <div className="flex flex-col space-y-2 mt-4">
        {resumen.map((res) => (
          <div
            key={res.taxista.id}
            className="bg-white p-3 rounded shadow flex flex-col space-y-1 text-sm break-words"
          >
            <div>
              <strong>Taxista:</strong> {res.taxista.usuario} - {res.taxista.nombre}
            </div>
            <div>
              <strong>Viajes aceptados:</strong> {res.viajesAceptados} - €
              {res.comisionAceptados}
            </div>
            <div>
              <strong>Viajes completados:</strong> {res.viajesCompletados} - €
              {res.comisionCompletados}
            </div>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded w-fit mt-1"
              onClick={() => generarPDF(res)}
            >
              Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
