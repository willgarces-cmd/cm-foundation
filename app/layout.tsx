import "./globals.css";

export const metadata = {
  title: "CM Smart Help",
  description: "Catálogo Maestro — especialistas en reparaciones del hogar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 min-h-screen">
        <header className="border-b px-6 py-4">
          <a href="/" className="font-medium">CM Smart Help</a>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
