// ========================== USER REPOSITORY ==========================
// Módulo encargado de todas las operaciones relacionadas con la base de datos para la colección de usuarios.

import UserModel from "../models/user.model.js";

class UserRepository {
  /* ----- CREAR USUARIO ----- */
  static async createUser(firstName, lastName, phoneNumber, email, password) {
    const user = await UserModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    });
    return user;
  }

  /* ----- OBTENER USUARIO POR EMAIL ----- */
  static async getUserByEmail(email) {
    return await UserModel.findOne({ email });
  }

  /* ----- OBTENER USUARIO POR ID ----- */
  static async getUserById(user_id) {
    return await UserModel.findById(user_id);
  }

  /* ----- OBTENER TODOS LOS USUARIOS ----- */
  static async getAllUsers() {
    return await UserModel.find();
  }

  /* ----- ACTUALIZAR DATOS DE USUARIO ----- */
  static async updateUserById(user_id, updatedFields) {
    return await UserModel.findByIdAndUpdate(user_id, updatedFields, {
      new: true,
      runValidators: true,
    });
  }

  /* ----- ELIMINAR USUARIO POR ID ----- */
  static async deleteUserById(user_id) {
    await UserModel.findByIdAndDelete(user_id);
    return true;
  }

}

export default UserRepository;
