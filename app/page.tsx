export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">CM Smart Help</h1>
        <p className="text-gray-600 mt-1">
          Encuentra especialistas en reparaciones del hogar, o publica tu necesidad para que te contacten.
        </p>
      </div>
      <div className="grid gap-3">
        <a href="/registro" className="border rounded-lg px-4 py-3 hover:bg-gray-50">
          Crear cuenta (especialista o usuario)
        </a>
        <a href="/login" className="border rounded-lg px-4 py-3 hover:bg-gray-50">
          Iniciar sesión
        </a>
        <a href="/publicar-necesidad" className="border rounded-lg px-4 py-3 hover:bg-gray-50">
          Publicar una necesidad
        </a>
        <a href="/especialistas" className="border rounded-lg px-4 py-3 hover:bg-gray-50">
          Ver especialistas disponibles
        </a>
      </div>
    </div>
  );
}
