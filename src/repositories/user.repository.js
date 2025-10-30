import UserModel from "../models/user.model.js";

class UserRepository {
  static async createUser(username, email, password) {
    const user = await UserModel.create({
      username: username,
      email: email,
      password: password,
    });
    return user;
  }

  static async getUserByEmail(email) {
    const user = await UserModel.findOne({ email: email });
    return user;
  }

  static async getUserById(user_id) {
    const user = await UserModel.findById(user_id);
    return user;
  }

  static async deleteUserById(user_id) {
    const user = await UserModel.findByIdAndDelete(user_id);
    return true;
  }

  static async getAll() {
    const users = await UserModel.find();
    return users;
  }

  static async updateById(user_id, new_values) {
    const user_updated = await UserModel.findByIdAndUpdate(
      user_id,
      new_values,
      {
        new: true, //Cuando hace la actualizacion trae el objeto actualizado
      }
    );

    return user_updated;
  }
}

export default UserRepository;
