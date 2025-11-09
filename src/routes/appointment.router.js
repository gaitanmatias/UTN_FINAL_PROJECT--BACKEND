// ========================== APPOINTMENT ROUTER ==========================
// Define las rutas relacionadas con la colección de turnos.
// Aplica validaciones de datos y límites de peticiones para evitar abusos.

// Dependencias externas
import { Router } from "express";
import { body, param, query } from "express-validator";
import rateLimit from "express-rate-limit";

// Middlewares
import authMiddleware from "../middlewares/auth.middleware.js";

// Controladores
import AppointmentController from "../controllers/appointment.controller.js";

// Función para definir el límite de solicitudes en un intervalo de tiempo
const createRateLimiter = (maxRequests, timeInterval) =>
  rateLimit({
    windowMs: timeInterval * 60 * 1000, // Tiempo de espera
    max: maxRequests, // Limite de solicitudes
    message: {
      ok: false,
      message: "Demasiadas solicitudes. Intenta más tarde.",
    },
  });

const appointment_router = Router();
// =============== RUTA: GET/api/appointments/date ===============
// -OBTENER TURNOS POR FECHA
appointment_router.get(
  "/date", 
  authMiddleware,
  createRateLimiter(10, 5),
  [
    query("date")
      .exists()
      .withMessage("Debe especificar la fecha del turno")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Formato de fecha inválido (YYYY-MM-DD)"),
  ],
  AppointmentController.getAppointmentsByDate
);

// =============== RUTA: GET/api/appointments ===============
// -OBTENER TURNOS DE USUARIO AUTENTICADO 
appointment_router.get(
  "/", 
  authMiddleware,
  createRateLimiter(10, 5),
  AppointmentController.getUserAppointments
);

// =============== RUTA: POST/api/appointments ===============
// -CREAR NUEVO TURNO
appointment_router.post(
  "/", 
  authMiddleware,
  createRateLimiter(5, 5),
  [
    body("date")
      .trim()
      .notEmpty()
      .withMessage("La fecha es obligatoria")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Formato de fecha inválido (YYYY-MM-DD)"),
      
    body("time")
      .trim()
      .notEmpty()
      .withMessage("La hora es obligatoria")
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage("Formato de hora inválido (HH:MM)"),
  ],
  AppointmentController.createAppointment
);

// =============== RUTA: GET/api/appointments/:id ===============
// -ACTUALIZAR UN TURNO POR ID
appointment_router.put(
  "/:appointmentId", 
  authMiddleware,
  createRateLimiter(5, 5),
  [
    param("appointmentId")
      .isMongoId()
      .withMessage("ID de turno inválido"),
    
    body("status")
      .optional()
      .isIn(["scheduled", "completed", "canceled"])
      .withMessage("Estado de turno inválido"),
  ],
  AppointmentController.updateAppointment
);



export default appointment_router;
