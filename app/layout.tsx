import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "CM Smart Help",
  description: "Catálogo Maestro — especialistas en reparaciones del hogar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-sans min-h-screen">
        <header className="bg-ink border-b-2 border-accent px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2">
          <a href="/" className="font-semibold text-lg text-white">CM Smart Help</a>
          <HeaderNav />
        </header>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28">{children}</main>
        <footer className="border-t border-line px-4 sm:px-6 py-6 text-center text-xs text-gray-400">
          CM Smart Help — plataforma en fase piloto. ¿Problemas o dudas?{" "}
          <a href="mailto:soporte@cmsmarthelp.com" className="text-accent hover:underline">
            soporte@cmsmarthelp.com
          </a>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
