import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const uri = `mongodb://localhost:27017/${DB_NAME}`;
// `${process.env.MONGODB_URI}/${DB_NAME}`
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(uri);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
