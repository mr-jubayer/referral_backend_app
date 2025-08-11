import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import connectDB from "./db/connectDB.js";
import { startGameLoop } from "./game/game.engine.js";

dotenv.config({
  path: "./.env",
});

(async () => {
  try {
    await connectDB();

    // Create HTTP server from Express app
    const server = http.createServer(app);

    // Attach Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*", // You can restrict this to your frontend URL
      },
    });

    // Start the game loop
    startGameLoop(io);

    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("MONGO DB connection failed !!! ", err);
    process.exit(1);
  }
})();
