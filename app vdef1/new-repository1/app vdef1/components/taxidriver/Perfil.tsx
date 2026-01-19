"use client";

import { useEffect, useState } from "react";

interface Taxista {
  nombre: string;
  telefono: string;
  email: string;
  numeroLicencia: string;
  limitacionMunicipal: string;
  matriculaVehiculo: string;
  marcaModelo: string;
  numeroPlazas: number;
  taxiAdaptado: boolean;
  usuario: string;
}

export default function Perfil() {
  const [taxista, setTaxista] = useState<Taxista | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch("/api/taxidriver/perfil");
        const data = await res.json();
        setTaxista(data);
      } catch (error) {
        console.error("Error fetching perfil:", error);
      }
    };
    fetchPerfil();
  }, []);

  if (!taxista) {
    return <p className="text-center text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow p-4 space-y-3">
      <h2 className="text-xl font-semibold mb-2 text-center">Perfil del Taxista</h2>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <p>
          <strong>Nombre:</strong> {taxista.nombre}
        </p>
        <p>
          <strong>Teléfono:</strong> {taxista.telefono}
        </p>
        <p>
          <strong>Email:</strong> {taxista.email}
        </p>
        <p>
          <strong>Usuario:</strong> {taxista.usuario}
        </p>
        <p>
          <strong>N.º licencia municipal:</strong> {taxista.numeroLicencia}
        </p>
        <p>
          <strong>Limitación municipal:</strong> {taxista.limitacionMunicipal}
        </p>
        <p>
          <strong>Matrícula del vehículo:</strong> {taxista.matriculaVehiculo}
        </p>
        <p>
          <strong>Marca y modelo:</strong> {taxista.marcaModelo}
        </p>
        <p>
          <strong>N.º de plazas disponibles:</strong> {taxista.numeroPlazas}
        </p>
        <p>
          <strong>Taxi adaptado a personas con movilidad reducida:</strong>{" "}
          {taxista.taxiAdaptado ? "Sí" : "No"}
        </p>
      </div>
    </div>
  );
}
