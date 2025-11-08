// ========================== APPOINTMENT MODEL ==========================
// Define el esquema y modelo de turno utilizando Mongoose.
// Contiene la estructura base de datos, validaciones y campos principales relacionados con el turno.

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID de usuario es obligatorio"],
    },
    date: {
      type: String,
      required: [true, "La fecha es obligatoria"],
      trim: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"]
    },
    time: {
      type: String,
      required: [true, "La hora es obligatoria"],
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)"]
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
      trim: true,
    }
  },
  { timestamps: true }
);

// ÍNDICE ÚNICO PARA EVITAR DUPLICADOS DE TURNOS POR USUARIO, FECHA Y HORA
appointmentSchema.index({ userId: 1, date: 1, time: 1 }, { unique: true });

const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

export default AppointmentModel;
