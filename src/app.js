import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://refero-admin-panel.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes import
import adminRoutes from "./routes/admin.route.js";
import depositRoute from "./routes/deposit.route.js";
import gameRoutes from "./routes/game.route.js";
import healthCheckRouter from "./routes/healthcheck.route.js";
import referralRoute from "./routes/refer.route.js";
import statesRoute from "./routes/state.route.js";
import userRouter from "./routes/user.route.js";
import withdrawRoute from "./routes/withdraw.route.js";

//routes declaration
app.use("/api/v1/health", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/deposit", depositRoute);
app.use("/api/v1/withdraw", withdrawRoute);
app.use("/api/v1/game", gameRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/refer-tree", referralRoute);
app.use("/api/v1/states", statesRoute);

export { app };
