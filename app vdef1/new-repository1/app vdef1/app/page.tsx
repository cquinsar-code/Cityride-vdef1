"use client";

import { useState, useEffect } from "react";
import ReservationForm from "../components/landing/ReservationForm";
import CancelReservation from "../components/landing/CancelReservation";
import ConsultReservation from "../components/landing/ConsultReservation";
import SuggestionsBox from "../components/landing/SuggestionsBox";
import LanguageSwitcher from "../components/landing/LanguageSwitcher";

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "es" | "de" | "it" | "fr">("en");
  const [showTaxiPanel, setShowTaxiPanel] = useState(false);

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Panel izquierdo: formulario y cancel/consulta/sugerencias */}
      <div className="flex-1 p-6 max-w-md mx-auto md:mx-0">
        <LanguageSwitcher language={language} setLanguage={setLanguage} />

        <h1 className="text-2xl font-semibold mt-4 mb-6">
          CityRide
        </h1>

        <ReservationForm language={language} />

        <div className="mt-6 space-y-4">
          <CancelReservation language={language} />
          <ConsultReservation language={language} />
          <SuggestionsBox language={language} />
        </div>

        <p className="text-sm text-muted mt-6">
          {language === "en" && "For any inquiries or issues contact +34 622 54 77 99"}
          {language === "es" && "Para cualquier consulta o incidencia contacte al +34 622 54 77 99"}
          {language === "de" && "Für Anfragen oder Probleme kontaktieren Sie +34 622 54 77 99"}
          {language === "it" && "Per qualsiasi domanda o problema contattare +34 622 54 77 99"}
          {language === "fr" && "Pour toute question ou problème contactez le +34 622 54 77 99"}
        </p>
      </div>

      {/* Panel derecho: botón soy taxista */}
      <div className="flex-1 bg-primary text-white flex flex-col justify-center items-center p-6">
        <button
          onClick={() => setShowTaxiPanel(true)}
          className="bg-accent text-primary font-semibold px-6 py-3 rounded-md hover:bg-green-500 transition"
        >
          Soy taxista
        </button>
      </div>
    </main>
  );
}
