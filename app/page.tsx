export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Encuentra a quien resuelva tu problema en casa</h1>
        <p className="text-gray-600 mt-2">
          O si eres especialista en reparaciones del hogar, encuentra a quien necesita tu trabajo.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-ink border-l-4 border-ink pl-2">Tengo una necesidad</h2>
          <a href="/publicar-necesidad" className="nav-link">Publicar una necesidad</a>
          <a href="/especialistas" className="nav-link">Ver especialistas disponibles</a>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-accentDark border-l-4 border-accent pl-2">Ofrezco un servicio</h2>
          <a href="/publicar-servicio" className="nav-link">Publicar mi servicio</a>
          <a href="/solicitudes" className="nav-link">Ver necesidades abiertas</a>
        </section>
      </div>

      <a href="/mis-matches" className="nav-link block text-center">
        Mis matches y calificaciones
      </a>
    </div>
  );
}
