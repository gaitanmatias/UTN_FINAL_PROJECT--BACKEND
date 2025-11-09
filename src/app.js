import express from "express";
import cors from "cors";
import auth_router from "./routes/auth.router.js";
import appointment_router from "./routes/appointment.router.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth_router);
app.use("/api/appointments", appointment_router);


app.use(errorHandlerMiddleware);
export default app;
