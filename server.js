import app from "./src/app.js";
import connectMongoDB from "./src/config/mongoDB.config.js";
import ENVIRONMENT from "./src/config/environment.config.js";

const startServer = async () => {
  await connectMongoDB();

  app.listen(ENVIRONMENT.PORT, () => {
    console.log(`🚀 El servidor está funcionando correctamente`);
  });
};

startServer();
