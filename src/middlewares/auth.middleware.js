// ========================== AUTH MIDDLEWARE ==========================
// Verifica la validez del token JWT incluido en el encabezado de
// autorización y agrega la información del usuario al objeto `request`.

import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../utils/customError.utils.js";

const authMiddleware = (req, res, next) => {
  try {
    const authorization_header = req.headers.authorization;
    if (!authorization_header) {
      throw new ServerError(400,"No se encontró el encabezado de autorización");
    }

    const token = authorization_header.split(" ").pop();
    if (!token) {
      throw new ServerError(400, "No se proporcionó el token de sesión");
    }

    // Verificación del token JWT
    const decoded_user = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);

    // Se almacena la información del usuario en el request
    req.user = decoded_user;

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        ok: false,
        status: 401,
        message: "El token de sesión ha expirado",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        ok: false,
        status: 401,
        message: "Token de sesión inválido",
      });
    }

    if (error.status) {
      return res.status(error.status).json({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
    });
  }
};

export default authMiddleware;
