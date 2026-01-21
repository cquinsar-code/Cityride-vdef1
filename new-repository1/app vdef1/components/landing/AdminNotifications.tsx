"use client";

import { useEffect, useState } from "react";

interface Props {
  language: "en" | "es" | "de" | "it" | "fr";
}

interface Notification {
  id: string;
  text: {
    en: string;
    es: string;
    de: string;
    it: string;
    fr: string;
  };
}

export default function AdminNotifications({ language }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Función para obtener notificaciones activas del backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications"); // API que devuelve notificaciones activas
      if (res.ok) {
        const data: Notification[] = await res.json();
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Polling cada 10 segundos para actualizar en tiempo real
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-accent text-white px-4 py-2 rounded shadow-sm"
        >
          {n.text[language]}
        </div>
      ))}
    </div>
  );
}
