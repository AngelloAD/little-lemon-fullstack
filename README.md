# Little Lemon - Restaurant Management System

Little Lemon es una solución Fullstack moderna diseñada para la gestión integral de un restaurante de comida mediterránea. La plataforma unifica la experiencia digital del comensal (reserva de mesas, exploración del menú y pedidos en línea) con un robusto panel administrativo capaz de controlar las comandas de cocina en tiempo real, gestionar perfiles de usuarios mediante control de acceso basado en roles (RBAC) y auditar métricas operativas.

Este ecosistema ha sido desarrollado bajo una arquitectura desacoplada, utilizando TypeScript de manera estricta en ambos extremos del software para garantizar la mantenibilidad, escalabilidad e integridad de los datos.

---

## 🚀 Características Principales

### 🍽️ Módulo del Cliente (Público y Privado)
* **Exploración de Menú Dinámico:** Visualización e interacción con el catálogo oficial de platillos mediterráneos clasificados por categorías (Entradas, Platos principales, Postres, Bebidas).
* **Gestión de Carrito Descentralizada:** Persistencia local del carrito de compras capaz de procesar múltiples cantidades y admitir solicitudes de notas de personalización (ej. "sin cebolla") por cada platillo individual.
* **Autenticación Segura:** Registro e inicio de sesión integrados mediante JSON Web Tokens (JWT) con políticas de contraseñas robustas validadas en tiempo real.
* **Libro de Órdenes Personal:** Historial privado para el seguimiento y confirmación de los pedidos enviados directamente a la cocina del restaurante.
* **Agenda de Reservaciones:** Sistema interactivo para agendar mesas especificando fecha, hora, número de comensales y requerimientos especiales.

### ⚙️ Panel de Administración (Exclusivo RBAC)
* **Monitor de Cocina en Tiempo Real:** Interfaz analítica para el equipo de cocina orientada al control de flujos y despacho de comandas (*Pendiente -> En Cocina -> Entregado -> Cancelado*).
* **Control de Inventario (CRUD Menú):** Panel administrativo completo para dar de alta, editar, listar y purgar platillos del menú oficial, integrando la carga de imágenes vía URL.
* **Libro de Asignación General de Reservas:** Agenda unificada para la supervisión y cancelación forzada de mesas por parte de la gerencia.
* **Gestión de Personal y Privilegios:** Administración de la tabla de usuarios con facultades para ascender o degradar roles (`ADMIN` / `CLIENTE`), bloqueando de forma segura la autodegradación o eliminación del Superadministrador del sistema.
* **Dashboard Analítico:** Panel centralizado para la visualización de métricas de rendimiento operacional y rendimiento financiero.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 18, TypeScript, Tailwind CSS, React Hook Form, React Router DOM v6.
* **Backend:** NestJS, TypeScript, JWT (Passport Strategy), Bcrypt.
* **Base de Datos & ORM:** PostgreSQL, Prisma ORM, Docker (Containerización).
* **Entorno de Ejecución:** Node.js (V8 Engine).

---

## 📐 Arquitectura del Proyecto

El proyecto implementa un monorepositorio conceptual dividido en dos arquitecturas independientes:

```text
restaurant-project/
├── backend/                  # Arquitectura Modular con NestJS
│   ├── src/
│   │   ├── auth/             # Guardia de autenticación, JWT Strategy y Roles Decorator
│   │   ├── menu/             # Controlador y Servicios para el CRUD del catálogo
│   │   ├── ordenes/          # Lógica de pedidos y agregaciones para estadísticas
│   │   ├── prisma/           # Instancia global del PrismaService (Inyección de Dependencias)
│   │   ├── reservas/         # Gestión de reservas y control de comensales
│   │   ├── usuarios/         # Control de perfiles, enums de roles y semilla admin
│   │   ├── main.ts           # Punto de entrada de la API REST
│   ├── prisma/
│   │   └── schema.prisma     # Definición de Modelos de Base de Datos y Enums nativos
│   ├── tsconfig.json         # Configuración del compilador TypeScript Backend
│   └── .env.template         # Plantilla de variables de entorno del servidor
│
├── frontend/                 # SPA React con TypeScript
│   ├── src/
│   │   ├── components/       # Componentes estructurales (Navbar, Footer, ProtectedRoute)
│   │   ├── context/          # Estados globales compartidos (AuthContext, CartContext)
│   │   ├── pages/            # Vistas públicas y de autenticación del cliente
│   │   │   ├── Home.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── Reservations.tsx
│   │   ├── pages/admin/      # Vistas protegidas por privilegios de administración
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminMenu.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── AdminReservations.tsx
│   │   │   └── AdminUsers.tsx
│   │   ├── services/         # Configuración central de Axios e interceptores HTTP
│   │   ├── App.tsx           # Enrutador centralizado de la SPA
│   │   └── main.tsx          # Punto de hidratación del DOM de React
│   └── tsconfig.json         # Configuración del compilador TypeScript Frontend
```

---

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu estación de trabajo antes de iniciar el despliegue:

* **Node.js:** Versión v18 o superior.
* **NPM:** Administrador de paquetes de Node (incluido por defecto).
* **Docker Desktop:** Activo para inicializar la base de datos PostgreSQL de manera aislada.

---

## ⚙️ Configuración e Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/AngelloAD/little-lemon-fullstack
cd little-lemon-fullstack
```

### 2. Configurar el Backend (NestJS & PostgreSQL)
Abra una terminal dentro del directorio `backend/`:
```bash
cd backend
npm install
```

Crea un archivo `.env` basado en las variables requeridas en tu entorno de desarrollo local. Define la cadena de conexión de PostgreSQL apuntando a tu instancia de Docker o base de datos local:

```env
# Ejemplo de configuración local para Prisma y NestJS
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/little_lemon_db?schema=public"
JWT_SECRET="SuperSecretKey_LittleLemon_2026_SeniorAsset"
PORT=8000
```

### 3. Levantar la Base de Datos en Docker
Si deseas levantar PostgreSQL en un contenedor de manera inmediata, ejecuta:
```bash
docker run --name little-lemon-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=little_lemon_db -p 5432:5432 -d postgres
```

### 4. Ejecutar Migraciones y Generar Cliente de Prisma
Aplica el esquema relacional en la base de datos PostgreSQL activa y genera los tipos estáticos para tu servicio:
```bash
npx prisma migrate dev --name init
```
*(Nota: Al iniciar el backend por primera vez, el servicio ejecutará automáticamente una rutina interna (`ensureInitialAdmin`) que verificará e inyectará la cuenta del administrador principal si la tabla se encuentra vacía).*

### 5. Configurar el Frontend (React)
Abra una segunda terminal en el directorio raíz `restaurant-project` e ingrese al frontend:
```bash
cd frontend
npm install
```

---

## 🏃‍♂️ Ejecución del Proyecto

Para ejecutar la aplicación completa en modo de desarrollo, levanta ambos servidores en terminales separadas:

### Ejecutar el Backend (Puerto asignado en .env o 8000 por defecto)
```bash
cd backend
npm run start:dev
```

### Ejecutar el Frontend (Vite levantará la app en http://localhost:5173)
```bash
cd frontend
npm run dev
```

---

## 🔑 Credenciales de Demostración

La base de datos se inicializa automáticamente con una cuenta de Superadministrador para pruebas inmediatas de los módulos protegidos y el control de accesos.

| Campo | Credencial | Descripción |
| :--- | :--- | :--- |
| **Rol** | `ADMIN` | Privilegios globales de lectura/escritura |
| **Usuario** | `admin` | Identificador único de acceso |
| **Contraseña** | `admin123` | Clave hash preestablecida en servidor |

---
Desarrollado con enfoque en la excelencia de ingeniería de software. 🍋
