import express from "express";
import cors from "cors";
import helmet from "helmet";

import auth_router from "./routes/auth.router.js";
import appointment_router from "./routes/appointment.router.js";

import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware de rutas - Limitador de peticiones
app.use(apiLimiter);

// Rutas
app.use("/api/auth", auth_router);
app.use("/api/appointments", appointment_router);

// Middleware de manejo de errores
app.use(errorHandlerMiddleware);

export default app;
