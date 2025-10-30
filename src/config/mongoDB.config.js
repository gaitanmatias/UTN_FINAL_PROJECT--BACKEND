import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

async function connectMongoDB() {
  try {
    await mongoose.connect(ENVIRONMENT.MONGO_DB_URI, {
      timeoutMS: 60000, //60s
      socketTimeoutMS: 60000, //60s
    });
    console.log("Conexion con MongoDB fue exitosa");
  } catch (error) {
    console.error("La conexion con MongoDB fallo");
    console.log(error);
  }
}

export default connectMongoDB;
