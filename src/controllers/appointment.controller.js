// ========================== APPOINTMENT CONTROLLER ==========================
// Define las funciones que manejan las solicitudes relacionadas con la colección de turnos.

import { validateRequest } from "../utils/validateRequest.utils.js";
import AppointmentService from "../services/appointment.service.js";

class AppointmentController {
  /* =============== CREAR TURNOS =============== */
  /* ---------- CREAR NUEVO TURNO ---------- */
  static async createAppointment(req, res) {
    // Validaciones de express-validator
    if (!validateRequest(req, res)) return;

    const { date, time } = req.body;
    const userId = req.user.id;
    
    await AppointmentService.createAppointment(userId, date, time);
    
    return res.status(201).json({
      ok: true,
      status: 201,
      message: "El turno se ha creado correctamente",
    });
  }

  /* =============== OBTENER TURNOS =============== */
  /* ---------- OBTENER TURNOS DEL USUARIO AUTENTICADO ---------- */
  static async getUserAppointments(req, res) {
    const userId = req.user.id;
    const appointments = await AppointmentService.getUserAppointments(userId);
    
    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Turnos del usuario obtenidos correctamente",
      data: appointments,
    });
  }

  /* ---------- OBTENER TURNOS CONFIRMADOS POR FECHA ---------- */
  static async getAppointmentsByDate(req, res) {
    // Validaciones de express-validator
    if (!validateRequest(req, res)) return;

    const { date } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    const appointments = await AppointmentService.getAppointmentsByDate(
      date,
      userId,
      isAdmin
    );
    
    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Turnos obtenidos correctamente",
      data: appointments,
    });
  }
  
  /* =============== ACTUALIZAR TURNOS =============== */
  /* ---------- ACTUALIZAR ESTADO O DETALLE DE UN TURNO ---------- */
  static async updateAppointment(req, res) {
    // Validaciones de express-validator
    if (!validateRequest(req, res)) return;

    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const { appointmentId } = req.params;
    const { status } = req.body;

    await AppointmentService.updateAppointment(
      appointmentId,
      userId,
      isAdmin,
      status
    );

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "El turno se ha actualizado correctamente",
    });
  }

}

export default AppointmentController;
