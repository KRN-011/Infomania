import mongoose from "mongoose";

const connectDB = () => { mongoose.connect(`${process.env.DATABASE_URL}`)
  .then(() => console.log("Connected to Database"))
  .catch((error) =>
    console.error("Error while connecting to Database: " + error)
  );
}

export default connectDB;