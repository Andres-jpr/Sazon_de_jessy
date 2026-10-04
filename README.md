# 🍔 La Sazón de Jessy — Plataforma Web Gastronómica & Comandas en Tiempo Real

Plataforma web gastronómica moderna para **La Sazón de Jessy** (Muey, Península de Santa Elena, Ecuador) construida con **Next.js 15 (App Router)**, **Tailwind CSS**, **Lucide Icons** y **Supabase** como backend en tiempo real.

---

## 🚀 Características Principales

### 🍽️ Portal de Clientes (`/`)
* **Menú Digital Interactivo:** Exploración fluida de hamburguesas, salchipapas, papi pollo, hot dogs y sánduches.
* **Buscador Reactivo y Filtro por Categorías:** Búsqueda en tiempo real por ingredientes y categorías.
* **Detección de Horarios en Vivo:** Indica automáticamente si el restaurante está *Abierto* o *Cerrado* según la hora local.
* **Carrito de Compras & WhatsApp:** Generación de pedidos estructurados enviados directamente al WhatsApp del local.
* **Celebración con Confeti:** Animaciones interactivas al confirmar pedidos.
* **Información & Mapa:** Horarios de atención, métodos de pago (Efectivo, Transferencia, DeUna!) y enlace directo a Google Maps.

### ⚙️ Centro de Control Administrativo (`/admin`)
* **Acceso Seguro por PIN:** Pantalla de autenticación protegida (PIN por defecto: `1234`).
* **📦 Comandas en Tiempo Real:** Recepción de pedidos en vivo con alerta acústica (chime Web Audio API) y gestión de estados (*⏳ Pendiente*, *👨‍🍳 En Preparación*, *✅ Listo para Retiro*, *🛵 Entregado*, *❌ Cancelar*).
* **🍔 Gestión de Menú:** Edición rápida de precios y cambio instantáneo de disponibilidad (*● Disponible* / *○ Agotado*).
* **📊 Dashboard:** Métricas en vivo de productos, ítems activos, agotados y precio promedio.
* **📝 CMS del Sitio:** Edición de slogan, banner promocional y datos de contacto.

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** Next.js (React 19 / App Router)
* **Estilos:** Tailwind CSS v4 con modo oscuro gastronómico
* **Iconos:** Lucide React
* **Backend & Base de Datos:** Supabase (PostgreSQL + Realtime + RLS)
* **Efectos:** Canvas Confetti & Web Audio API

---

## 📦 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Andres-jpr/Sazon_de_jessy.git
   cd Sazon_de_jessy
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu_proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Configuración de Base de Datos (Supabase)

El script SQL completo para inicializar las tablas (`productos`, `categorias`, `configuracion_sitio`, `horarios`, `metodos_pago`, `pedidos`, `pedido_items`) y las políticas de seguridad (RLS) se encuentra en:
```
docs/supabase_setup.sql
```

---

## 📄 Licencia

Desarrollado para **La Sazón de Jessy** · Muey, Península de Santa Elena, Ecuador.
