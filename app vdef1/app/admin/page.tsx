"use client";
import React, { useState } from "react";
import CalendarioReservas from "./components/CalendarioReservas";
import LogsAdmin from "./components/LogsAdmin";
import Comisiones from "./components/Comisiones";
import NotificacionesAdmin from "./components/NotificacionesAdmin";
import TaxistasAdmin from "./components/TaxistasAdmin";

export default function AdminDashboard() {
  const [pestana, setPestana] = useState<"reservas"|"taxistas"|"logs"|"comisiones"|"notificaciones">("reservas");

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard Administrador</h1>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cerrar sesión</button>
      </div>

      {/* Navegación de pestañas */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button className={`px-3 py-1 rounded ${pestana==="reservas"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPestana("reservas")}>Historial de reservas</button>
        <button className={`px-3 py-1 rounded ${pestana==="taxistas"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPestana("taxistas")}>Taxistas</button>
        <button className={`px-3 py-1 rounded ${pestana==="logs"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPestana("logs")}>Historial de logs</button>
        <button className={`px-3 py-1 rounded ${pestana==="comisiones"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPestana("comisiones")}>Comisiones</button>
        <button className={`px-3 py-1 rounded ${pestana==="notificaciones"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setPestana("notificaciones")}>Notificaciones</button>
      </div>

      {/* Pestañas */}
      <div className="w-full">
        {pestana === "reservas" && <CalendarioReservas />}
        {pestana === "taxistas" && <TaxistasAdmin />}
        {pestana === "logs" && <LogsAdmin />}
        {pestana === "comisiones" && <Comisiones />}
        {pestana === "notificaciones" && <NotificacionesAdmin />}
      </div>
    </div>
  )
}
