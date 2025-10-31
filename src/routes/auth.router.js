// Dependencias externas
import { Router } from "express";
import { body, param } from "express-validator";
import rateLimit from "express-rate-limit";

// Controladores
import AuthController from "../controllers/auth.controller.js";


// ========================== AUTH ROUTER ==========================
// Define las rutas relacionadas con la autenticación de usuarios.
// Incluye registro, login, verificación de correo y recuperación de contraseña.

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
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("El nombre de usuario es obligatorio")
      .isLength({ min: 3 })
      .withMessage("El nombre de usuario debe tener al menos 3 caracteres"),

    body("email").trim().isEmail().withMessage("Debe ingresar un email válido"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
  ],
  AuthController.register
);

/* ---------- RUTA: LOGIN ---------- */
auth_router.post(
  "/login",
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
/* ---------- RUTA: SEND EMAIL VERIFICATION ---------- */
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
/* ---------- RUTA: VERIFY EMAIL ---------- */
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
/* ---------- RUTA: FORGOT PASSWORD ---------- */
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
/* ---------- RUTA: VERIFY RESET TOKEN ---------- */
auth_router.get(
  "/verify-password-reset/:reset_token",
  [
    param("reset_token")
      .notEmpty()
      .withMessage("El token de restablecimiento es obligatorio"),
  ],
  AuthController.verifyResetPasswordToken
);
/* ---------- RUTA: RESET PASSWORD ---------- */
auth_router.post(
  "/password-reset/:reset_token",
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
