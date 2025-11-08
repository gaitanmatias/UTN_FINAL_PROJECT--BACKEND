// ========================== APPOINTMENT REPOSITORY ==========================
// Módulo encargado de todas las operaciones relacionadas con la base de datos para la colección de turnos.

import AppointmentModel from "../models/appointment.model.js";

class AppointmentRepository {
  /* ----- CREAR TURNO ----- */
  static async createAppointment( userId, date, time ) {
    const appointment = await AppointmentModel.create({ userId, date, time });
    return appointment;
  }

  /* ----- OBTENER TURNO POR ID ----- */
  static async getAppointmentById(id) {
    return await AppointmentModel.findById(id);
  }

  /* ----- BUSCAR TURNO POR USUARIO, FECHA Y HORA ----- */
  static async findByUserDateTime(userId, date, time) {
    return await AppointmentModel.findOne({ userId, date, time });
  }

  /* ----- NUEVO: OBTENER TURNOS POR FECHA ----- */
  static async getAppointmentsByDate(date, filters = {}) {
    const query = { date, ...filters };
    return await AppointmentModel.find(query).populate("userId", "firstName lastName email phoneNumber");
  }

  /* ----- OBTENER TODOS LOS TURNOS POR ID DE USUARIO ----- */
  static async getAppointmentByUserId(userId) {
    return await AppointmentModel.find({ userId });
  }

  /* ----- OBTENER TURNOS ACTIVOS DE UN USUARIO ----- */
  static async getActiveAppointmentsByUserId(userId) {
    return await AppointmentModel.find({ userId, status: "scheduled" });
  }

  /* ----- OBTENER HISTORIAL DE TURNOS DE UN USUARIO ----- */
  static async getPastAppointmentsByUserId(userId) {
    return await AppointmentModel.find({
      userId,
      status: { $in: ["completed", "canceled"] },
    });
  }

  /* ----- OBTENER TODOS LOS TURNOS ----- */
  static async getAllAppointments() {
    return await AppointmentModel.find();
  }

  /* ----- ACTUALIZAR ESTADO DE TURNO ----- */
  static async updateAppointmentById(id, updatedFields) {
    return await AppointmentModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });
  }

  /* ----- ELIMINAR TURNO POR ID ----- */
  static async deleteAppointmentById(id) {
    await AppointmentModel.findByIdAndDelete(id);
    return true;
  }

}

export default AppointmentRepository;
