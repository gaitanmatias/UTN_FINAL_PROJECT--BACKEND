// Dependencias externas
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Configuraciones
import transporter from "../config/mailer.config.js";
import ENVIRONMENT from "../config/environment.config.js";

// Repositorios / Modelos
import UserRepository from "../repositories/user.repository.js";

// Utilidades
import { ServerError } from "../utils/customError.utils.js";

// ========================== AUTH SERVICE ==========================
// Servicio con la lógica principal de autenticación.
// Se comunica con el repositorio de usuarios y maneja JWT, bcrypt y envío de correos.

class AuthService {
  /* =============== REGISTRO E INICIO DE SESIÓN =============== */
  /* ---------- REGISTER ---------- */
  static async register(username, email, password) {
    // Verifica si el email ya está registrado en la DB
    const user = await UserRepository.getUserByEmail(email);
    if (user) {
      throw new ServerError(400, "El email ya está registrado");
    }

    // Encripta la password
    const password_hashed = await bcrypt.hash(password, 12);

    // Guarda el usuario en la DB
    const user_created = await UserRepository.createUser(
      username,
      email,
      password_hashed
    );

    return user_created;
  }

  /* ---------- LOGIN ---------- */
  static async login(email, password) {
    // Verifica si existe un usuario con ese email en la DB
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new ServerError(404, "El email no se encuentra registrado");
    }

    // Verifica si la password es correcta
    const is_same_password = await bcrypt.compare(password, user.password);
    if (!is_same_password) {
      throw new ServerError(401, "La contraseña es incorrecta");
    }

    // Genera token de autorizacion para datos de sesión
    const authorization_token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ENVIRONMENT.JWT_SECRET_KEY
    );

    return { authorization_token };
  }

  /* =============== VERIFICACIÓN DE CORREO =============== */
  /* ---------- SEND EMAIL VERIFICATION ---------- */
  static async sendEmailVerification(email) {
    // Verifica si existe un usuario con ese email y que no este verificado en la DB
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new ServerError(404, "El email no se encuentra registrado");
    } else if (user.isVerified) {
      throw new ServerError(400, "El email ya se encuentra verificado");
    }

    // Genera token de verificación temporal (expira en 1 día)
    const verification_token = jwt.sign(
      {
        email: email,
        user_id: user._id,
      },
      ENVIRONMENT.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Envia correo de verificación
    transporter
      .sendMail({
        from: ENVIRONMENT.GMAIL_USER,
        to: email,
        subject: "Verificacion de cuenta",
        html: `
      <h1>Bienvenido ${user.username}</h1>
      <h2>Por favor haz click en el siguiente enlace para verificar tu cuenta y así finalizar el proceso de registro</h2>
      <a href="${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}">Verificar cuenta</a>`,
      })
      .catch((error) => {
        console.error("Error enviando el correo: ", error);
      });
  }

  /* ---------- VERIFY EMAIL ---------- */
  static async verifyEmail(verification_token) {
    try {
      // Verifica el token del correo
      const payload = jwt.verify(
        verification_token,
        ENVIRONMENT.JWT_SECRET_KEY
      );

      // Actualiza dato de usuario en la DB (isVerified)
      await UserRepository.updateById(payload.user_id, { isVerified: true });

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ServerError(400, "El token ha expirado");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError(400, "El token es inválido");
      }
      throw error;
    }
  }

  /* =============== REESTABLECIMIENTO DE CONTRASEÑA =============== */
  /* ---------- FORGOT PASSWORD ---------- */
  static async forgotPassword(email) {
    // Verifica si existe un usuario con ese email en la DB
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new ServerError(
        404,
        "Usuario no encontrado. Por favor, verifica el email e intenta nuevamente"
      );
    }

    // Genera token temporal (expira en 30 minutos)
    const reset_token = jwt.sign(
      { user_id: user._id },
      ENVIRONMENT.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Envia email con link para continuar con el proceso de reset
    transporter
      .sendMail({
        from: ENVIRONMENT.GMAIL_USER,
        to: email,
        subject: "Restablecer contraseña",
        html: `
        <h1>Hola ${user.username}</h1>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña</p>
        <a href="${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-password-reset/${reset_token}">Restablecer contraseña</a>
      `,
      })
      .catch((error) => console.log("Error enviando el correo: ", error));
  }

  /* ---------- VERIFY RESET PASSWORD TOKEN ---------- */
  static async verifyResetPasswordToken(reset_token) {
    try {
      // Verifica que el token JWT sea válido
      const payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY);
      
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ServerError(400, "El token ha expirado");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError(400, "El token es inválido");
      }
      throw error;
    }
  }

  /* ---------- RESET PASSWORD ---------- */
  static async resetPassword(newPassword, reset_token) {
    try {
      // Verifica que el token JWT sea válido
      const payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY);

      // Busca al usuario por el id en la DB
      const user = await UserRepository.getUserById(payload.user_id);
      if (!user) throw new ServerError(404, "Usuario no encontrado");

      // Verifica que la password no sea la misma
      const is_same_password = await bcrypt.compare(newPassword, user.password);
      if (is_same_password) {
        throw new ServerError(
          401,
          "La nueva contraseña no puede ser igual a la anterior"
        );
      }

      // Encripta la nueva password
      const password_hashed = await bcrypt.hash(newPassword, 12);

      // Actualiza dato del usuario en la DB (password)
      await UserRepository.updateById(user._id, { password: password_hashed });

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ServerError(400, "El token ha expirado");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError(400, "El token es inválido");
      }
      throw error;
    }
  }
}

export default AuthService;
