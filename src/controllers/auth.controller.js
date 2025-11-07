// ========================== AUTH CONTROLLER ==========================
// Controlador encargado de manejar la autenticación de usuarios.
// Contiene endpoints para registro, login, verificación de correo y recuperación de contraseña.

import { validationResult } from "express-validator";
import { validateRequest } from "../utils/validateRequest.utils.js";
import AuthService from "../services/auth.service.js";

class AuthController {
  /* =============== REGISTRO E INICIO DE SESIÓN =============== */
  /* ---------- REGISTER ---------- */
  static async register(req, res) {
    try {
      // Validaciones de express-validator
      if (!validateRequest(req, res)) return;

      const { firstName, lastName, phoneNumber, email, password } = req.body;
      await AuthService.register(
        firstName,
        lastName,
        phoneNumber,
        email,
        password
      );
      AuthService.sendEmailVerification(email).catch((err) =>
        console.error("Error enviando mail de verificación:", err)
      );

      return res.status(201).json({
        ok: true,
        status: 201,
        message: "El usuario se ha registrado correctamente",
      });

    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }

  /* ---------- LOGIN ---------- */
  static async login(req, res) {
    try {
      // Validaciones de express-validator
      if (!validateRequest(req, res)) return;

      const { email, password } = req.body;
      const authorization_token = await AuthService.login(email, password);

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Sesión iniciada correctamente",
        data: { authorization_token },
      });

    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";

      return res.status(status).json({ ok: false, status, message });
    }
  }

  /* =============== VERIFICACIÓN DE CORREO =============== */
  /* ---------- SEND EMAIL VERIFICATION ---------- */
  static async sendEmailVerification(req, res) {
    try {
      // Validaciones de express-validator
      if (!validateRequest(req, res)) return;

      const { email } = req.body;
      await AuthService.sendEmailVerification(email);

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Se ha enviado un correo de verificación",
      });

    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }

  /* ---------- VERIFY EMAIL ---------- */
  static async verifyEmail(req, res) {
    try {
      const { verification_token } = req.params;
      await AuthService.verifyEmail(verification_token);

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Verificación de correo exitosa",
      });

    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }

  /* =============== REESTABLECIMIENTO DE CONTRASEÑA =============== */
  /* ---------- FORGOT PASSWORD ---------- */
  static async forgotPassword(req, res) {
    try {
      // Validaciones de express-validator
      if (!validateRequest(req, res)) return;

      const { email } = req.body;
      const response = await AuthService.forgotPassword(email);

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Se ha enviado un enlace para restablecer la contraseña",
        data: response,
      });

    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }

  /* ---------- RESET PASSWORD ---------- */
  static async resetPassword(req, res) {
    try {
      // Validaciones de express-validator
      if (!validateRequest(req, res)) return;

      const { newPassword } = req.body;
      const { reset_token } = req.params;
      await AuthService.resetPassword(newPassword, reset_token);

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Contraseña restablecida correctamente",
      });

    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }
}

export default AuthController;
