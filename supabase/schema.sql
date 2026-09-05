-- ============================================================
-- FOUNDATION — Catálogo Maestro (CM)
-- Núcleo genérico reutilizable por todos los desafíos del ecosistema.
-- No modificar estas tablas para activar un nuevo vertical:
-- los verticales se configuran vía `categories` + `custom_fields` (jsonb).
-- ============================================================

-- Perfil de usuario (extiende auth.users de Supabase)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  roles text[] not null default '{}',   -- 'provider' y/o 'seeker'
  phone text,
  created_at timestamptz not null default now()
);

-- Taxonomía configurable por vertical (ej: 'cm_smart_help', 'cm_smart_savings')
create table categories (
  id uuid primary key default gen_random_uuid(),
  vertical text not null,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (vertical, slug)
);

-- Publicación de un oferente (perfil de especialista, servicio, etc.)
create table listings (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references profiles(id) on delete cascade,
  category_id uuid not null references categories(id),
  title text not null,
  description text,
  custom_fields jsonb not null default '{}',  -- zona de cobertura, certificaciones, portafolio, etc.
  status text not null default 'active',      -- active | paused | removed
  created_at timestamptz not null default now()
);

-- Necesidad publicada por un demandante
create table requests (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references profiles(id) on delete cascade,
  category_id uuid not null references categories(id),
  title text not null,
  description text,
  custom_fields jsonb not null default '{}',  -- urgencia, presupuesto, ubicación, fotos, etc.
  status text not null default 'open',        -- open | matched | closed
  created_at timestamptz not null default now()
);

-- Vínculo generado entre listing y request (lead)
create table matches (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  request_id uuid not null references requests(id) on delete cascade,
  status text not null default 'pending',     -- pending | active | closed | cancelled
  created_at timestamptz not null default now()
);

-- Mensajería dentro de un match
create table messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  created_at timestamptz not null default now()
);

-- Registro de pago (lead fee fase 1, comisión fase 2)
create table transactions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id),
  payer_id uuid not null references profiles(id),
  type text not null,                          -- lead_fee | commission
  amount numeric(10,2) not null,
  currency text not null default 'PEN',
  stripe_payment_id text,
  status text not null default 'pending',       -- pending | paid | failed | refunded
  created_at timestamptz not null default now()
);

-- Reseña bidireccional: usuario -> especialista y especialista -> usuario
create table reviews (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  author_id uuid not null references profiles(id),
  recipient_id uuid not null references profiles(id),
  score int not null check (score between 1 and 5),
  message text,
  visible boolean not null default false,       -- se publica cuando ambas partes calificaron o al plazo límite
  created_at timestamptz not null default now(),
  unique (match_id, author_id)
);

-- Estado de verificación de identidad/credenciales del provider
create table verifications (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending',        -- pending | pre_approved_by_agent | approved | rejected
  documents jsonb not null default '{}',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — base mínima, refinar antes de producción
-- ============================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table listings enable row level security;
alter table requests enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table transactions enable row level security;
alter table reviews enable row level security;
alter table verifications enable row level security;

create policy "profiles: lectura pública" on profiles for select using (true);
create policy "profiles: el dueño edita su perfil" on profiles for update using (auth.uid() = id);

create policy "categories: lectura pública" on categories for select using (true);
-- sin políticas de escritura: las categorías las administra el backend (service role)

create policy "listings: lectura pública" on listings for select using (true);
create policy "listings: el dueño crea/edita" on listings for insert with check (auth.uid() = provider_id);
create policy "listings: el dueño actualiza" on listings for update using (auth.uid() = provider_id);

create policy "requests: lectura pública" on requests for select using (true);
create policy "requests: el dueño crea/edita" on requests for insert with check (auth.uid() = seeker_id);
create policy "requests: el dueño actualiza" on requests for update using (auth.uid() = seeker_id);

create policy "matches: partes involucradas" on matches for select using (
  exists (select 1 from listings l where l.id = listing_id and l.provider_id = auth.uid())
  or exists (select 1 from requests r where r.id = request_id and r.seeker_id = auth.uid())
);

create policy "messages: partes del match" on messages for select using (
  exists (
    select 1 from matches m
    join listings l on l.id = m.listing_id
    join requests r on r.id = m.request_id
    where m.id = match_id and (l.provider_id = auth.uid() or r.seeker_id = auth.uid())
  )
);
create policy "messages: enviar si eres parte" on messages for insert with check (sender_id = auth.uid());

create policy "transactions: solo el pagador ve las suyas" on transactions for select using (payer_id = auth.uid());
-- sin políticas de insert/update: las transacciones las escribe el backend (webhook de Stripe con service role)

create policy "reviews: lectura de visibles" on reviews for select using (visible = true or author_id = auth.uid());
create policy "reviews: el autor crea" on reviews for insert with check (author_id = auth.uid());

create policy "verifications: el proveedor ve las suyas" on verifications for select using (provider_id = auth.uid());
create policy "verifications: el proveedor sube documentos" on verifications for insert with check (provider_id = auth.uid());

-- ============================================================
-- Seed — configuración del vertical CM Smart Help
-- ============================================================
insert into categories (vertical, name, slug) values
  ('cm_smart_help', 'Plomería', 'plomeria'),
  ('cm_smart_help', 'Electricidad', 'electricidad'),
  ('cm_smart_help', 'Pintura', 'pintura'),
  ('cm_smart_help', 'Carpintería', 'carpinteria'),
  ('cm_smart_help', 'Cerrajería', 'cerrajeria'),
  ('cm_smart_help', 'Gasfitería', 'gasfiteria'),
  ('cm_smart_help', 'Jardinería', 'jardineria');
