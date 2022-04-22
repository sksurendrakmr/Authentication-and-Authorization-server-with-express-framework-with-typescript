import mongoose from "mongoose";

export const db = () => {
  mongoose
    .connect("mongodb://localhost:27017/travels")
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("Error occured while connecting to mongodb"));
};
