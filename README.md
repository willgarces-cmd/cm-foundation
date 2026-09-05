# CM Foundation — primera versión funcional (CM Smart Help)

Base tecnológica del ecosistema Catálogo Maestro (CM), con CM Smart Help
(reparaciones del hogar) como primer vertical activado.

## Qué incluye esta versión

- Esquema de base de datos genérico (`supabase/schema.sql`): profiles, categories,
  listings, requests, matches, messages, transactions, reviews, verifications.
- Configuración del vertical CM Smart Help (`config/verticals/cm-smart-help.ts`).
- Registro con selección de rol (especialista y/o usuario).
- Login.
- Publicar una necesidad (Request).
- Ver especialistas publicados (Listings).

## Qué NO incluye todavía (siguientes pasos del roadmap)

- Publicar un perfil de especialista (Listing) — falta el formulario espejo de "publicar necesidad".
- Cobro por lead con Stripe.
- Capa de agentes IA (matching, verificación, soporte, moderación).
- Mensajería entre partes.

## Cómo ponerlo en marcha

1. **Crear proyecto en Supabase** (gratis): [supabase.com](https://supabase.com) → New Project.
2. En el proyecto, ir a **SQL Editor** → pegar y ejecutar el contenido de `supabase/schema.sql`.
3. En **Project Settings → API**, copiar la `Project URL` y la `anon public key`.
4. Copiar `.env.local.example` a `.env.local` y pegar esos dos valores.
5. Instalar dependencias y correr en local:
   ```
   npm install
   npm run dev
   ```
6. Para publicarlo en internet: subir este proyecto a un repositorio de GitHub y
   conectarlo en [vercel.com](https://vercel.com) (import project), agregando las
   mismas dos variables de entorno en la configuración de Vercel.

## Estructura

```
app/                    páginas (Next.js App Router)
config/verticals/       configuración por desafío del ecosistema CM
lib/supabaseClient.ts   cliente de Supabase compartido
supabase/schema.sql     esquema de base de datos + seed de categorías
```

