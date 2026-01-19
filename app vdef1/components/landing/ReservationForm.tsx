"use client";

import { useState } from "react";

interface Props {
  language: "en" | "es" | "de" | "it" | "fr";
}

export default function ReservationForm({ language }: Props) {
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pmr, setPmr] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se llamaría API /api/reservations/create
    console.log({
      phone, pickup, destination, date, time, adults, children, pmr, notes
    });
  };

  const t: any = {
    en: { phone: "Phone", pickup: "Pickup", destination: "Destination", submit: "Send request", adults: "Adults", children: "Children", pmr: "PMR", notes: "Notes", destHint: "If you don't know exact address, indicate reference place" },
    es: { phone: "Teléfono", pickup: "Recogida", destination: "Destino", submit: "Enviar solicitud", adults: "Adultos", children: "Niños", pmr: "PMR", notes: "Notas", destHint: "Si no conoces la dirección exacta indica un lugar aproximado de referencia. Puedes aclararlo mejor con el conductor en persona." },
    de: { phone: "Telefon", pickup: "Abholung", destination: "Ziel", submit: "Senden", adults: "Erwachsene", children: "Kinder", pmr: "PMR", notes: "Notizen", destHint: "Wenn Sie die genaue Adresse nicht kennen, geben Sie einen Referenzort an" },
    it: { phone: "Telefono", pickup: "Ritiro", destination: "Destinazione", submit: "Invia", adults: "Adulti", children: "Bambini", pmr: "PMR", notes: "Note", destHint: "Se non conosci l'indirizzo esatto indica un luogo di riferimento" },
    fr: { phone: "Téléphone", pickup: "Prise en charge", destination: "Destination", submit: "Envoyer", adults: "Adultes", children: "Enfants", pmr: "PMR", notes: "Notes", destHint: "Si vous ne connaissez pas l'adresse exacte, indiquez un lieu de référence" }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <input
        type="tel"
        placeholder={t[language].phone}
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ""))}
        required
        pattern="^\+\d{9,15}$"
        className="border rounded p-2"
      />

      <input
        type="text"
        placeholder={t[language].pickup}
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        required
        className="border rounded p-2"
      />

      <div className="text-xs text-muted">{t[language].destHint}</div>
      <input
        type="text"
        placeholder={t[language].destination}
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
        className="border rounded p-2"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border rounded p-2"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="border rounded p-2"
      />

      <div className="flex space-x-2">
        <input type="number" min={0} value={adults} onChange={(e) => setAdults(Number(e.target.value))} placeholder={t[language].adults} className="border rounded p-2 flex-1" />
        <input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} placeholder={t[language].children} className="border rounded p-2 flex-1" />
        <input type="number" min={0} value={pmr} onChange={(e) => setPmr(Number(e.target.value))} placeholder={t[language].pmr} className="border rounded p-2 flex-1" />
      </div>

      <textarea
        placeholder={t[language].notes}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border rounded p-2"
        maxLength={1000}
      />

      <button type="submit" className="bg-accent text-white py-2 rounded hover:bg-green-500 transition">
        {t[language].submit}
      </button>
    </form>
  );
}
