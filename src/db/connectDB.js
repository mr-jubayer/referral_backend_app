import mongoose from "mongoose";

const uri = `mongodb://localhost:27017/test`;
// `${process.env.MONGODB_URI}/${DB_NAME}`
// const uri = process.env.MONGODB_URI;

const connection = {};
const connectDB = async () => {
  if (connection.isConnected) {
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(uri);
    connection.isConnected = connectionInstance.connections[0].readyState;
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
