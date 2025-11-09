// ========================== APPOINTMENT SERVICE ==========================
// Lógica de negocio relacionada con la gestión de turnos.
// Interactúa con el AppointmentRepository para realizar operaciones de base de datos
// Aplica las validaciones necesarias antes de ejecutar las acciones.

import AppointmentRepository from "../repositories/appointment.repository.js";

class AppointmentService {
  /* =============== CREAR TURNOS =============== */
  /* ----- CREAR NUEVO TURNO ----- */
  static async createAppointment(userId, date, time) {
    const [hours, minutes] = time.split(":").map(Number);
    // Valida que el horario esté dentro del rango permitido (09:00 a 17:00) y en intervalos de 30 minutos
    if (hours < 9 || hours > 16) {
      throw new Error("El horario seleccionado no entra dentro del rango de 09:00 a 16:30 horas.");
    } else if (minutes !== 0 && minutes !== 30) {
      throw new Error("El horario seleccionado no es válido. Solo se permiten intervalos de 30 minutos.");
    }

    // Valida que el usuario no tenga un turno en la misma fecha y hora
    const existingUserAppointment = await AppointmentRepository.findByUserDateTime(userId, date, time);
    if (existingUserAppointment) {
      throw new Error("Ya tenés un turno reservado en esa fecha y hora.");
    }

    // Valida que ningún otro usuario tenga un turno en esa misma fecha y hora
    const conflictingAppointment = await AppointmentRepository.getAppointmentsByDate(date, { time });
    if (conflictingAppointment.length > 0) {
      throw new Error("Ese turno ya está reservado por otro usuario.");
    }

    // Valida que la fecha y hora no sean pasadas
    const now = new Date();
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    if (appointmentDateTime <= now) {
      throw new Error("No se pueden reservar turnos en fechas pasadas.");
    }

    // Valida que la fecha no supere los 6 meses en el futuro
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (appointmentDateTime > sixMonthsFromNow) {
      throw new Error("El turno solicitado corresponde a una fecha muy lejana. Intenta sacar un turno dentro de los próximos 6 meses.");
    }

    // Crea el turno
    const appointment = await AppointmentRepository.createAppointment(userId,date,time);
    return appointment;
  }

  /* =============== OBTENER TURNOS =============== */
  /* ----- OBTENER TURNOS DE UN USUARIO ----- */
  static async getUserAppointments(userId) {
    // Valida que el usuario tenga turnos
    const appointments = await AppointmentRepository.getAppointmentByUserId(userId);
    if (!appointments.length) {
      throw new Error("No se encontraron turnos para este usuario.");
    }
    return appointments;
  }

  /* ----- OBTENER TURNOS POR FECHA ----- */
  static async getAppointmentsByDate(date, isAdmin) {
    const appointments = await AppointmentRepository.getAppointmentsByDate(date);

    // Valida que haya turnos para la fecha en caso contrario lanza error
    if (!appointments.length) {
      throw new Error("No se encontraron turnos para la fecha especificada.");
    }

    // Si NO es admin, devuelve solo la hora (no datos del usuario)
    if (!isAdmin) {
      let scheduledAppointments = appointments.filter((a) => a.status === "scheduled");
      return scheduledAppointments.map((a) => ({
        time: a.time,
      }));
    }

    // Si es admin, devuelve todos los detalles
    return appointments;
  }

  /* =============== ACTUALIZAR TURNOS =============== */
  /* ----- ACTUALIZAR TURNO ----- */
  static async updateAppointment(appointmentId, userId, isAdmin, status) {
    // Valida que el turno exista
    const appointment = await AppointmentRepository.getAppointmentById(appointmentId);
    if (!appointment) {
      throw new Error("El turno no existe.");
    }

    // Si no es admin, solo puede modificar su propio turno y solo si el estado es "scheduled"
    if (!isAdmin) {
      if (appointment.userId.toString() !== userId.toString()) {
        throw new Error("No tenés permiso para modificar este turno.");
      }
      if (appointment.status !== "scheduled") {
        throw new Error("Solo podés modificar turnos pendientes.");
      }
      // Validar nuevo estado
      if (status !== "canceled") {
        throw new Error("No tiene permisos para modificar a este estado.");
      }
    }

    // Validar nuevo estado
    if (!["scheduled", "completed", "canceled"].includes(status)) {
      throw new Error("Estado inválido.");
    }

    const updatedAppointment = await AppointmentRepository.updateAppointmentById(appointmentId, { status });
    return updatedAppointment;
  }

}

export default AppointmentService;
