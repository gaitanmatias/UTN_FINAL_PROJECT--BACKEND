import mongoose from "mongoose";

async function connectMongoDB() {
  try {
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_DB_URI_PRODUCTION
        : process.env.MONGO_DB_URI_LOCAL;

    if (!mongoURI) {
      throw new Error("No hay URI de MongoDB configurada");
    }

    await mongoose.connect(mongoURI, {
      timeoutMS: 60000,
      socketTimeoutMS: 60000,
    });

    console.log(
      `MongoDB conectado (${process.env.NODE_ENV})`
    );
  } catch (error) {
    console.error("Error conectando a MongoDB");
    console.error(error.message);
    process.exit(1);
  }
}

export default connectMongoDB;
