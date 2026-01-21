"use client";

interface Props {
  language: "en" | "es" | "de" | "it" | "fr";
  setLanguage: (lang: "en" | "es" | "de" | "it" | "fr") => void;
}

export default function LanguageSwitcher({ language, setLanguage }: Props) {
  const langs = ["en", "es", "de", "it", "fr"] as const;

  return (
    <div className="flex space-x-2 mb-4">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLanguage(l)}
          className={`px-3 py-1 rounded-md border ${
            language === l ? "border-accent bg-accent text-white" : "border-muted text-muted"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
