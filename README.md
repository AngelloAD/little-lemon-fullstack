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

* **Frontend:** React 18, TypeScript, Tailwind CSS, React Hook Form, React Router DOM (configurado con `HashRouter` para compatibilidad en Vercel).
* **Backend:** NestJS, TypeScript, JWT (Passport Strategy), Bcrypt.
* **Base de Datos & ORM:** PostgreSQL Serverless (Neon), Prisma ORM.
* **Entorno de Ejecución:** Node.js (V8 Engine).
* **Infraestructura:** Despliegue Fullstack en Vercel (`vercel.json` unificado).

---

## 📐 Arquitectura del Proyecto

El proyecto implementa un monorepositorio conceptual dividido en dos arquitecturas independientes:

```text
restaurant-project/
├── vercel.json               # Configuración unificada de enrutamiento y despliegue Fullstack
├── backend/                  # Arquitectura Modular con NestJS
│   ├── src/
│   │   ├── auth/             # Guardia de autenticación, JWT Strategy y Roles Decorator
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── menu/             # Controlador y Servicios para el CRUD del catálogo
│   │   │   ├── dto/
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu.module.ts
│   │   │   └── menu.service.ts
│   │   ├── ordenes/          # Lógica de pedidos y agregaciones para estadísticas
│   │   │   ├── ordenes.controller.ts
│   │   │   ├── ordenes.module.ts
│   │   │   └── ordenes.service.ts
│   │   ├── prisma/           # Instancia global del PrismaService (Inyección de Dependencias)
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── reservas/         # Gestión de reservas y control de comensales
│   │   │   ├── reservas.controller.ts
│   │   │   ├── reservas.module.ts
│   │   │   └── reservas.service.ts
│   │   ├── usuarios/         # Control de perfiles, enums de roles y semilla admin
│   │   │   ├── usuarios.controller.ts
│   │   │   ├── usuarios.module.ts
│   │   │   └── usuarios.service.ts
│   │   └── main.ts           # Punto de entrada de la API REST
│   ├── prisma/
│   │   └── schema.prisma     # Definición de Modelos de Base de Datos (Neon compatible)
│   ├── tsconfig.json         # Configuración del compilador TypeScript Backend
│   └── .env.template         # Plantilla de variables de entorno del servidor
└── frontend/                 # SPA React con TypeScript
    ├── src/
    │   ├── components/       # Componentes estructurales (Navbar, Footer, ProtectedRoute)
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── context/          # Estados globales compartidos (AuthContext, CartContext)
    │   │   ├── AuthContext.tsx
    │   │   └── CartContext.tsx
    │   ├── pages/            # Vistas públicas y de autenticación del cliente
    │   │   ├── Home.tsx
    │   │   ├── Menu.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Orders.tsx
    │   │   └── Reservations.tsx
    │   ├── pages/admin/      # Vistas protegidas por privilegios de administración
    │   │   ├── AdminDashboard.tsx
    │   │   ├── AdminMenu.tsx
    │   │   ├── AdminOrders.tsx
    │   │   ├── AdminReservations.tsx
    │   │   └── AdminUsers.tsx
    │   ├── services/         # Configuración de Axios e interceptores HTTP
    │   │   └── api.ts
    │   ├── App.tsx           # Enrutador centralizado de la SPA utilizando HashRouter
    │   └── main.tsx          # Punto de hidratación del DOM de React
    └── tsconfig.json         # Configuración del compilador TypeScript Frontend

```

---

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu estación de trabajo antes de iniciar el despliegue:

* **Node.js:** Versión v18 o superior.
* **NPM:** Administrador de paquetes de Node (incluido por defecto).

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

Crea un archivo `.env` basado en `.env.template` e introduce las credenciales de tu base de datos en la nube (Neon):
```env
DATABASE_URL="postgresql://usuario:password@ep-ligh-name.us-east-2.aws.neon.tech/little_lemon_db?sslmode=require"
JWT_SECRET="SuperSecretKey_LittleLemon_2026_SeniorAsset"
PORT=8000
```
### 3. Ejecutar Migraciones de Prisma
Aplica el esquema relacional a tu base de datos de Neon y genera el cliente local:
```bash
npx prisma migrate dev --name init
```
*(Nota: Al iniciar el backend por primera vez, el servicio ejecutará automáticamente una rutina interna (`ensureInitialAdmin`) que creará la cuenta del administrador si la tabla se encuentra vacía).*

### 4. Configurar el Frontend (React)
Abre otra terminal en la raíz del proyecto e ingresa al frontend:
```bash
cd frontend
npm install
```

---

## 🏃‍♂️ Ejecución en Desarrollo

Para probar el proyecto de forma local, levanta ambos servidores en terminales independientes:

### Backend
```bash
cd backend
npm run start:dev
```
### Frontend
```bash
cd frontend
npm run dev
```

---

## 🚀 Despliegue en Vercel

El proyecto está configurado para desplegarse de manera conjunta usando el archivo `vercel.json` en la raíz. 

1. Asegúrate de configurar las **Variables de Entorno** (`DATABASE_URL`, `JWT_SECRET`) directamente en el panel de control del proyecto en Vercel.
2. La aplicación utiliza `HashRouter` en el Frontend para asegurar que las rutas internas de React funcionen correctamente sin generar errores 404 al recargar el navegador en producción.

---

## 🔑 Credenciales de Demostración

La base de datos se inicializa automáticamente con una cuenta de Superadministrador para pruebas inmediatas de los módulos protegidos.

| Campo | Credencial | Descripción |
| :--- | :--- | :--- |
| **Rol** | `ADMIN` | Privilegios globales de lectura/escritura |
| **Usuario** | `admin` | Identificador único de acceso |
| **Contraseña** | `admin123` | Clave preestablecida en el servidor |

---
Desarrollado con enfoque en la excelencia de ingeniería de software. 🍋