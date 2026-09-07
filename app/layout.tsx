import "./globals.css";

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
        <header className="border-b-2 border-accent bg-white px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold text-lg">CM Smart Help</a>
          <nav className="flex gap-4 text-sm">
            <a href="/login" className="text-ink hover:text-accent">Iniciar sesión</a>
            <a href="/registro" className="text-accent font-medium hover:text-accentDark">Crear cuenta</a>
          </nav>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
