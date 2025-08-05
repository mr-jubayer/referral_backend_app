import mongoose from "mongoose";

const uri = `mongodb://localhost:27017/test`;
// `${process.env.MONGODB_URI}/${DB_NAME}`

const connection = {};
const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(uri);
    connection.isConnected = connectionInstance.connections[0].readyState;
    console.log(
      `MongoDB Connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection FAILED !!! ", error);
    process.exit(1);
  }
};

export default connectDB;
