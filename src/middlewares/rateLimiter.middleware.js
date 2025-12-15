// ========================== RATE LIMITER MIDDLEWARE ==========================
// Middleware centralizado para limitar la cantidad de peticiones por IP.
// Protege la API de abusos, fuerza bruta y ataques básicos de denegación de servicio.

// Dependencia externa
import rateLimit from "express-rate-limit";


// =============== Limiter general para toda la API ===============
// - 100 requests cada 24 horas por IP

export const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    status: 429,
    message: "Demasiadas peticiones. Intente nuevamente más tarde.",
  },
});

// =============== Limiter para autenticación (login / register) =============== 
// - 5 intentos cada 15 minutos por IP

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    status: 429,
    message: "Demasiados intentos de autenticación. Intente más tarde.",
  },
});


// =============== Limiter para envío de correos ===============
// - 3 requests cada 1 hora por IP

export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    status: 429,
    message:
      "Ha superado el límite de solicitudes para envío de correos. Intente más tarde.",
  },
});
