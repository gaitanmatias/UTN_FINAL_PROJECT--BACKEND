import dotenv from "dotenv";
dotenv.config();

const ENVIRONMENT = {
   // --- BASE DE DATOS ---
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  MONGO_DB_URI_PRODUCTION: process.env.MONGO_DB_URI_PRODUCTION,

  // --- AUTENTICACIÓN / EMAIL ---
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

  // --- CONFIGURACIÓN FRONTEND ---
  URL_API_BACKEND: process.env.URL_API_BACKEND,
  URL_FRONTEND: process.env.URL_FRONTEND,

  // --- OTROS ---
  PORT: process.env.PORT,
};

export default ENVIRONMENT;
