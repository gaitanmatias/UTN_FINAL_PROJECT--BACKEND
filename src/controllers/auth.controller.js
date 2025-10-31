import { validationResult } from "express-validator";
import AuthService from "../services/auth.service.js";

// ========================== AUTH CONTROLLER ==========================
// Controlador encargado de manejar la autenticación de usuarios.
// Contiene endpoints para registro, login, verificación de correo y recuperación de contraseña.


class AuthController {
  /* =============== REGISTRO E INICIO DE SESIÓN =============== */
  /* ---------- REGISTER ---------- */
  static async register(req, res) {
    try {
      // Validaciones de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: "Errores de validación",
          errors: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        });
      }

      const { username, email, password } = req.body;
      const response = await AuthService.register(username, email, password);
      AuthService.sendEmailVerification(email).catch(err =>
        console.error("Error enviando mail de verificación:", err)
      );      

      return res.status(201).json({
        ok: true,
        status: 201,
        message: "El usuario se ha registrado correctamente",
        data: response,
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: "Errores de validación",
          errors: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        });
      }

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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: "Errores de validación",
          errors: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        });
      }

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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: "Errores de validación",
          errors: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        });
      }

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

  /* ---------- VERIFY RESET PASSWORD TOKEN ---------- */
  static async verifyResetPasswordToken(req, res) {
    try {
      const { reset_token } = req.params;
      const is_valid = await AuthService.verifyResetPasswordToken(reset_token);

      if (!is_valid) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: "Token inválido o expirado",
        });
      }

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Token válido",
      })
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }

  /* ---------- RESET PASSWORD ---------- */
  static async resetPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const { reset_token } = req.params;
      await AuthService.resetPassword(newPassword, reset_token);

      return res.status(200).json({
        ok: true,
        status: 200,
        message:"Contraseña restablecida correctamente",
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Error interno del servidor";
      return res.status(status).json({ ok: false, status, message });
    }
  }
}

export default AuthController;
