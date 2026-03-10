# Guchini — Un Manso Sanguche 🥪

Sistema de pedidos online take-away para Guchini, sandwichería artesanal en Mendoza, Argentina.

## Stack

- **Next.js 14** (App Router) — Framework React
- **Supabase** — Base de datos PostgreSQL, Auth (Google OAuth), Storage, Realtime
- **Tailwind CSS + shadcn/ui** — Estilos y componentes
- **MercadoPago** — Checkout Pro (pagos)
- **TypeScript** — Tipado estático

## Características

### Cliente
- Catálogo de sándwiches y bebidas con fotos
- Carrito slide-over con persistencia en localStorage
- Login con Google (Supabase Auth)
- Checkout con integración MercadoPago
- Página de confirmación con número de orden gigante + confetti
- Tiempo estimado de espera dinámico

### Admin (`/admin`)
- Login con credenciales propias (JWT)
- Dashboard con métricas del día
- Gestión de pedidos en tiempo real (Supabase Realtime)
- CRUD de sándwiches y bebidas con upload de imágenes
- Base de clientes con exportación CSV
- Configuración del local (tiempos, apertura, mensajes)

## Setup Local

### 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear un nuevo proyecto
2. En **SQL Editor**, ejecutar en orden:
   - `supabase/schema.sql` — Tablas, índices, RLS, Realtime
   - `supabase/seed.sql` — Datos de ejemplo (3 sándwiches, 5 bebidas, admin user)
   - `supabase/functions.sql` — Función para verificar contraseña admin
   - `supabase/storage.sql` — Bucket de imágenes
3. En **Auth > Providers > Google**: Configurar OAuth con tus credenciales de Google Cloud

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Completar con los valores de tu proyecto Supabase y MercadoPago.

### 3. Instalar y ejecutar

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 4. Acceder al admin

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Usuario: `guchini-admin`
- Contraseña: `12345678`

## MercadoPago

1. Crear cuenta en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Crear una aplicación
3. Copiar el **Access Token** (modo sandbox/test) a `MP_ACCESS_TOKEN`
4. Para testing: usar las tarjetas de prueba de MercadoPago
5. Para producción: configurar webhook URL como `https://tu-dominio.com/api/mercadopago/webhook`

## Deploy en Vercel

1. Conectar el repo a Vercel
2. Agregar todas las variables de entorno del `.env.local`
3. Actualizar `NEXT_PUBLIC_BASE_URL` con la URL de producción
4. Configurar webhook de MercadoPago con la URL pública

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/          # Tienda pública
│   │   ├── page.tsx       # Home (menú)
│   │   ├── auth/          # Login Google
│   │   ├── checkout/      # Checkout + pago
│   │   ├── orden/         # Confirmación de orden
│   │   └── pago/          # Retorno de MercadoPago
│   ├── admin/             # Panel de administración
│   │   ├── pedidos/       # Gestión pedidos (realtime)
│   │   ├── sandwiches/    # CRUD sándwiches
│   │   ├── bebidas/       # CRUD bebidas
│   │   ├── clientes/      # Base de clientes
│   │   └── configuracion/ # Ajustes del local
│   └── api/               # API Routes
├── components/            # Componentes React
├── contexts/              # Cart context
├── lib/                   # Supabase, MercadoPago, utils
└── types/                 # TypeScript types
```

## Credenciales por defecto

- **Admin**: `guchini-admin` / `12345678`
- Cambiar en la tabla `admin_users` de Supabase o via env vars `ADMIN_USERNAME` / `ADMIN_PASSWORD`
