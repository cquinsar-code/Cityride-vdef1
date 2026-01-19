"use client";

import { useEffect, useState } from "react";

interface Notificacion {
  id: string;
  text: string;
}

export default function MisNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  // Polling cada 10 segundos para mantener en tiempo real
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();

        // Solo texto en español
        const filtered = data.map((n: any) => ({
          id: n.id,
          text: n.text.es,
        }));

        setNotificaciones(filtered);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // cada 10 seg
    return () => clearInterval(interval);
  }, []);

  // No mostrar nada si no hay notificaciones
  if (!notificaciones.length) return null;

  return (
    <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-400 rounded-md space-y-2">
      {notificaciones.map((n) => (
        <p key={n.id} className="text-sm text-blue-900">
          {n.text}
        </p>
      ))}
    </div>
  );
}
