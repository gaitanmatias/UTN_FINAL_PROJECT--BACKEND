// ========================== AUTH ROUTER ==========================
// Define las rutas relacionadas con la autenticación de usuarios:
// - Registro
// - Inicio de sesión
// - Verificación de email
// - Recuperación y restablecimiento de contraseña
// Aplica validaciones de datos y límites de peticiones para evitar abusos.

// Dependencias externas
import { Router } from "express";
import { body, param } from "express-validator";
import rateLimit from "express-rate-limit";

// Controladores
import AuthController from "../controllers/auth.controller.js";

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

const auth_router = Router();
/* =============== REGISTRO E INICIO DE SESIÓN =============== */
/* ---------- RUTA: REGISTER ---------- */
auth_router.post(
  "/register",
  createRateLimiter(10, 5),
  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ min: 3 })
      .withMessage("El nombre debe tener al menos 3 caracteres"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("El apellido es obligatorio")
      .isLength({ min: 3 })
      .withMessage("El apellido debe tener al menos 3 caracteres"),

    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("El número de teléfono es obligatorio")
      .matches(/^\+\d{12}$/)
      .withMessage("El número debe incluir el prefijo internacional (+) y 12 dígitos más")
      .isLength({ min: 13, max: 13 })
      .withMessage("El número de teléfono debe tener exactamente 13 caracteres"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Debe ingresar un email válido"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
  ],
  AuthController.register
);

/* ---------- RUTA: LOGIN ---------- */
auth_router.post(
  "/login",
  createRateLimiter(10, 5),
  [
    body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ingresar un email válido"),

    body("password")
    .notEmpty()
    .withMessage("Debe ingresar una contraseña"),
  ],
  AuthController.login
);


/* =============== VERIFICACIÓN DE CORREO =============== */
/* ---------- RUTA: SEND_EMAIL_VERIFICATION ---------- */
auth_router.post(
  "/send-email-verification",
  createRateLimiter(3, 5),
  [
    body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ingresar un email válido")
  ],
  AuthController.sendEmailVerification
);
/* ---------- RUTA: VERIFY_EMAIL ---------- */
auth_router.get(
  "/verify-email/:verification_token",
  [
    param("verification_token")
      .notEmpty()
      .withMessage("El token de verificación es obligatorio"),
  ],
  AuthController.verifyEmail
);


/* =============== REESTABLECIMIENTO DE CONTRASEÑA =============== */
/* ---------- RUTA: FORGOT_PASSWORD ---------- */
auth_router.post(
  "/forgot-password",
  createRateLimiter(3, 5),
  [
    body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ingresar un email válido")
  ],
  AuthController.forgotPassword
);
/* ---------- RUTA: RESET_PASSWORD ---------- */
auth_router.post(
  "/reset-password/:reset_token",
  [
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),

    param("reset_token")
      .notEmpty()
      .withMessage("El token de restablecimiento es obligatorio"),
  ],
  AuthController.resetPassword
);

export default auth_router;
