// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

(async () => {
  try {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("MONGO db connection failed !!! ", err);
    process.exit(1);
  }
})();
