"use client";

import { useState } from "react";
import TablonGeneral from "../../components/taxidriver/TablonGeneral";
import MisReservas from "../../components/taxidriver/MisReservas";
import Perfil from "../../components/taxidriver/Perfil";
import Notificaciones from "../../components/taxidriver/Notificaciones";

export default function TaxiDriverDashboard() {
  const [activeTab, setActiveTab] = useState<"tablón" | "misreservas" | "perfil">("tablón");

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      {/* Notificaciones del administrador */}
      <Notificaciones />

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "tablón" ? "bg-accent text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("tablón")}
        >
          Tablón de solicitudes
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "misreservas" ? "bg-accent text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("misreservas")}
        >
          Mis reservas
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "perfil" ? "bg-accent text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("perfil")}
        >
          Perfil
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="mt-4">
        {activeTab === "tablón" && <TablonGeneral />}
        {activeTab === "misreservas" && <MisReservas />}
        {activeTab === "perfil" && <Perfil />}
      </div>
    </main>
  );
}
