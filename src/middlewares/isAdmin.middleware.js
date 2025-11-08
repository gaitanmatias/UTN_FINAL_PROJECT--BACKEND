// ========================== isAdmin MIDDLEWARE ==========================
// Verifica que el usuario autenticado tenga privilegios de administrador.

import { ServerError } from "../utils/customError.utils.js";

const isAdminMiddleware = (req, res, next) => {
  try {
    // Verifica que la info del usuario exista (autenticación previa)
    if (!req.user) {
      throw new ServerError(401, "No se pudo verificar el usuario autenticado");
    }

    // Verifica el rol de administrador
    if (!req.user.isAdmin) {
      throw new ServerError(403, "Acceso denegado: requiere permisos de administrador");
    }

    // Si pasa todas las validaciones, continúa
    next();
  } catch (error) {
    console.error("Error en isAdminMiddleware:", error);
    return res.status(error.status || 500).json({
      ok: false,
      status: error.status || 500,
      message: error.message || "Error interno del servidor",
    });
  }
};

export default isAdminMiddleware;
