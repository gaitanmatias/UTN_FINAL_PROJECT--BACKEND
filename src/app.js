import express from "express";
import cors from "cors";
import auth_router from "./routes/auth.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth_router);

export default app;
