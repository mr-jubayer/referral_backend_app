import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { initializeGameLoop } from "./controllers/game/admin_game_control.js";
import connectDB from "./db/connectDB.js";

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use((req, res, next) => {
  req.io = io;
  next();
});

(async () => {
  await connectDB();
  server.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server running on port ${process.env.PORT}`);
    initializeGameLoop(io);
  });
})();
