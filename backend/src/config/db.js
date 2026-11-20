// import mongoose from "mongoose";
// import env from "./env.js";

// mongoose.set("strictQuery", true);

// export async function connectDB() {
//   const conn = await mongoose.connect(env.mongoUri, {
//     serverSelectionTimeoutMS: 10_000,
//   });
//   console.log(
//     `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
//   );

//   mongoose.connection.on("error", (err) => {
//     console.error("MongoDB error:", err.message);
//   });
//   mongoose.connection.on("disconnected", () => {
//     console.warn("MongoDB disconnected");
//   });
// }

import mongoose from "mongoose";
import env from "./env.js";

mongoose.set("strictQuery", true);

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, listenersAttached: false };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 10_000,
      })
      .then((conn) => {
        console.log(
          `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
        );

        if (!cached.listenersAttached) {
          mongoose.connection.on("error", (err) => {
            console.error("MongoDB error:", err.message);
          });
          mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
            cached.conn = null;
            cached.promise = null;
          });
          cached.listenersAttached = true;
        }

        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
