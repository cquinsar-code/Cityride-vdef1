"use client";

import { useState } from "react";

interface Props {
  language: "en" | "es" | "de" | "it" | "fr";
}

export default function SuggestionsBox({ language }: Props) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    // Llamada API para guardar sugerencia
    setMessage(
      language === "es"
        ? "Sugerencia enviada, gracias."
        : language === "en"
        ? "Suggestion sent, thank you."
        : language === "de"
        ? "Vorschlag gesendet, danke."
        : language === "it"
        ? "Suggerimento inviato, grazie."
        : "Suggestion envoyée, merci."
    );
    setText("");
  };

  return (
    <div className="border rounded p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        placeholder={
          language === "es"
            ? "Tus sugerencias son muy importantes para nosotros. Si has detectado algún fallo o tienes ideas para mejorar la experiencia, por favor escríbenos aquí."
            : language === "en"
            ? "Your suggestions are very important to us. Please write any issues or ideas here."
            : language === "de"
            ? "Ihre Vorschläge sind uns sehr wichtig. Bitte schreiben Sie hier Ihre Ideen oder Probleme."
            : language === "it"
            ? "I tuoi suggerimenti sono molto importanti per noi. Scrivi qui eventuali problemi o idee."
            : "Vos suggestions sont très importantes pour nous. Écrivez ici vos idées ou problèmes."
        }
        className="border rounded p-2 w-full h-24 mb-2"
      />
      <button onClick={handleSubmit} className="bg-accent text-white px-4 py-2 rounded">
        {language === "es" ? "Enviar" : "Send"}
      </button>
      {message && <p className="text-green-600 mt-2 text-sm">{message}</p>}
    </div>
  );
}
