import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { initializeGameLoop } from "./controllers/game/admin_game_control.js";
import connectDB from "./db/connectDB.js";
import { startGame } from "./game/game.state.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  },
});

const connectedUsers = new Set();

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
  if (userId) connectedUsers.add(userId);
  socket.on("disconnect", () => {
    if (userId) connectedUsers.delete(userId);
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

(async () => {
  await connectDB();
  server.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server running on port ${process.env.PORT}`);
    startGame();
    initializeGameLoop(io, connectedUsers);
  });
})();
