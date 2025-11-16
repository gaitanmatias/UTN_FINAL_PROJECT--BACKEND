# README -- Backend (Node.js + Express + MongoDB)

## 📌 Descripción del proyecto

Este backend forma parte del Trabajo Integrador Final de la Diplomatura en Programación Web Full Stack (UTN).
La aplicación implementa un sistema de gestión de turnos con autenticación segura, verificación por email, administración de horarios y control de estados de los turnos.
Este backend funciona como base para cualquier sistema de reservas o atención al público

Cuenta con: - API RESTful desarrollada en **Node.js + Express** - Base de datos **MongoDB** - Arquitectura en capas (**Routes → Controllers → Services → Repositories**) - Autenticación mediante **JWT (Bearer Token)** - Hash de contraseñas con **bcrypt** - Verificación por correo electrónico mediante **Nodemailer** - Middleware de autenticación, validación de datos y manejo centralizado de errores

------------------------------------------------------------------------

# 📁 Estructura del proyecto

```
BACKEND/
├── .env                        # Archivo de variables de entorno
├── .env.example                # Ejemplo de variables de entorno necesarias
├── .gitignore                  # Archivos y carpetas ignorados por git
├── package.json                # Configuración del proyecto y dependencias
├── README.md                   # Documentación principal del proyecto
├── server.js                   # Punto de entrada principal del servidor
├── vercel.json                 # Configuración para despliegue en Vercel
├── postman_collection.json     # Colección de Postman para pruebas de API
│
└── src/                        # Código fuente principal
    ├── app.js                  # Configuración principal de la aplicación Express
    │
    ├── config/                         # Configuraciones del sistema
    │   ├── environment.config.js       # Configuración de variables de entorno
    │   ├── mailer.config.js            # Configuración del servicio de correo
    │   └── mongoDB.config.js           # Configuración de la conexión a MongoDB
    │
    ├── controllers/                    # Controladores de la aplicación
    │   ├── auth.controller.js          # Controlador para autenticación
    │   └── appointment.controller.js   # Controlador para turnos
    │
    ├── middlewares/                    # Middlewares personalizados
    │   ├── auth.middleware.js          # Middleware para autenticación
    │   ├── errorHandler.middleware.js  # Middleware para manejo de errores
    │   └── isAdmin.middleware.js       # Middleware para verificación de administrador
    │
    ├── models/                         # Modelos de datos
    │   ├── user.model.js               # Modelo de usuario
    │   └── appointment.model.js        # Modelo de turno
    │
    ├── repositories/                   # Repositorios de datos
    │   ├── user.repository.js          # Repositorio para operaciones de usuario
    │   └── appointment.repository.js   # Repositorio para operaciones de turno
    │
    ├── routes/                         # Rutas de la API
    │   ├── auth.router.js              # Rutas de autenticación
    │   └── appointment.router.js       # Rutas de turnos
    │
    ├── services/                       # Servicios de la aplicación
    │   ├── auth.service.js             # Servicio de autenticación
    │   └── appointment.service.js      # Servicio de turnos
    │
    └── utils/                          # Utilidades y helpers
        ├── customError.utils.js        # Utilidad para manejo de errores personalizados
        └── validateRequest.utils.js    # Utilidad para validación de solicitudes
```

## Función de cada directorio

-   **config/**: conexión a la base de datos.
-   **models/**: esquemas de MongoDB.
-   **repositories/**: consultas directas a la base de datos.
-   **services/**: lógica de negocio.
-   **controllers/**: manejo de Request/Response.
-   **routes/**: definición de endpoints.
-   **middlewares/**: JWT, validaciones y manejo de errores.
-   **utils/**: envío de email, tokens y helpers.

------------------------------------------------------------------------

# 🚀 Instalación y ejecución

## 1️⃣ Clonar el repositorio

    git clone https://github.com/gaitanmatias/UTN_FINAL_PROJECT--BACKEND.git
    cd backend

## 2️⃣ Instalar dependencias

    npm install

## 3️⃣ Crear archivo `.env`

```
# --- BASE DE DATOS ---
# URL de conexión a tu base de datos MongoDB (Atlas o local)
MONGO_DB_URI=TU_MONGO_URI_AQUI

# --- AUTENTICACIÓN / EMAIL ---
# Usuario y contraseña para el envío de correos (puede ser App Password)
GMAIL_USER=TU_EMAIL_AQUI
GMAIL_PASSWORD=TU_GOOGLE_PASSWORD_AQUI

# Clave secreta para firmar JWT
JWT_SECRET_KEY=TU_JWT_SECRET_KEY_AQUI

# --- CONFIGURACIÓN FRONTEND ---
# URL del frontend para permitir redirecciones y CORS
URL_FRONTEND=URL_DE_TU_FRONTEND_AQUI

# --- OTROS ---
# Puerto en el que correrá el servidor
PORT=8080
```

## 4️⃣ Iniciar servidor

Modo desarrollo:

    npm run dev

Modo producción:

    npm start

------------------------------------------------------------------------

# 🌐 Deploy

**API URL:**

    https://utn-final-project-backend-appointme.vercel.app

------------------------------------------------------------------------

# 📮 Colección de Postman

Incluye el archivo:

    Gestor-de-turnos--UTN.postman_collection.json

------------------------------------------------------------------------

# 🔐 Autenticación

-   Hash con bcrypt
-   JWT con expiración
-   Verificación de email mediante link enviado por Nodemailer

Flujo: 
1. Registro
2. Verificación por email
3. Login
4. Acceso a rutas protegidas con Bearer token

------------------------------------------------------------------------

# 📘 Documentación de Endpoints

## 1. Autenticación
### /api/auth

    POST /api/auth/register

Crea un usuario y envía email de verificación.

    POST /api/auth/login

Retorna JWT.

    POST /api/auth/send-email-verification

Envía email de verificación.

    GET /api/auth/verify-email/:verification_token

Verifica cuenta.

    POST /api/auth/forgot-password

Envía email de recuperación de contraseña.

    POST /api/auth/reset-password/:reset_token

Reestablece contraseña.



------------------------------------------------------------------------

## 2. Turnos (Appointments)
### /api/appointments

    GET /api/appointments/date?date=YYYY-MM-DD

**Usuario:** devuelve turnos programados y cancelados propios.
**Admin:** devuelve todos los turnos del día.

    POST /api/appointments/

Crea un nuevo turno.

    GET /api/appointments/

Obtiene todos los turnos de un usuario autenticado.

    PUT /api/appointments/:appointmentId

Actualiza estado de un turno.
**Usuario:** solo cancela sus propios turnos pendientes.
**Admin:** cancela o completa cualquier turno.

------------------------------------------------------------------------

# Estados permitidos

-   scheduled
-   completed
-   canceled

------------------------------------------------------------------------

# 🧪 Middleware implementados

-   CORS
-   Validación
-   Manejo de errores
-   Autenticación JWT
-   Verificación de administrador (isAdmin)

------------------------------------------------------------------------

# 🛠 Tecnologías utilizadas

Node.js, Express, MongoDB, bcrypt, JWT, Nodemailer, dotenv, Vercel.

------------------------------------------------------------------------

# 💻 Autor

Desarrollado por: **Matías Gaitán**
