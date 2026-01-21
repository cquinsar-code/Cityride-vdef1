import "./globals.css";

export const metadata = {
  title: "CityRide",
  description: "Taxi reservations"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <footer className="text-center text-xs text-muted py-4">
          CityRide
        </footer>
      </body>
    </html>
  );
}
