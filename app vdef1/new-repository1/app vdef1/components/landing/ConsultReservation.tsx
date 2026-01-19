"use client";

import { useState } from "react";

interface Props {
  language: "en" | "es" | "de" | "it" | "fr";
}

export default function ConsultReservation({ language }: Props) {
  const [phone, setPhone] = useState("");
  const [reservation, setReservation] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  const handleConsult = async () => {
    setMessage("");
    const now = new Date();
    // Aquí llamarías API para obtener reserva dentro de la ventana < 1h
    const mock = {
      taxiAssigned: true,
      driver: "Juan Pérez",
      phone: "+34 600000000",
      license: "GC-12345",
      vehicle: "Toyota Prius",
      seats: 4,
      pmr: true
    };

    // Ejemplo de lógicas de mensaje según hora y aceptación
    if (!mock.taxiAssigned) {
      setMessage(
        language === "es"
          ? "Por el momento, ningún conductor ha aceptado su reserva. Si ningún conductor acepta su solicitud. Le invitamos a tomar el primer taxi disponible en su zona. Disculpe las molestias y gracias por su comprensión."
          : "No driver has accepted your booking yet."
      );
      setReservation(null);
    } else {
      setReservation(mock);
    }
  };

  const t: any = {
    en: { title: "Check reservation", placeholder: "Enter phone number", button: "Check" },
    es: { title: "Consultar reserva", placeholder: "Introduce número de teléfono", button: "Consultar" },
    de: { title: "Reservierung prüfen", placeholder: "Telefonnummer eingeben", button: "Prüfen" },
    it: { title: "Controlla prenotazione", placeholder: "Inserisci numero di telefono", button: "Controlla" },
    fr: { title: "Consulter réservation", placeholder: "Entrez le numéro de téléphone", button: "Vérifier" }
  };

  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold mb-2">{t[language].title}</h2>
      <div className="flex space-x-2 mb-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ""))}
          placeholder={t[language].placeholder}
          className="border rounded p-2 flex-1"
        />
        <button onClick={handleConsult} className="bg-accent text-white px-4 rounded">
          {t[language].button}
        </button>
      </div>

      {message && <p className="text-sm text-muted">{message}</p>}

      {reservation && (
        <div className="mt-2 border p-2 rounded space-y-1">
          <p><strong>Driver:</strong> {reservation.driver}</p>
          <p><strong>Phone:</strong> {reservation.phone}</p>
          <p><strong>License:</strong> {reservation.license}</p>
          <p><strong>Vehicle:</strong> {reservation.vehicle}</p>
          <p><strong>Seats:</strong> {reservation.seats}</p>
          <p><strong>PMR:</strong> {reservation.pmr ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
