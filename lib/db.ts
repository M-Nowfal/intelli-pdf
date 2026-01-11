import { DB_NAME, DB_URI } from "@/utils/constants";
import { connect } from "mongoose";

let isConnected = false;

export async function connectDB() {
  try {
    if (isConnected) return;

    await connect(DB_URI, { dbName: DB_NAME });
    isConnected = true;

    console.log("DataBase connected successfully!");
  } catch (err: unknown) {
    console.log(err);
    throw err;
  }
}