import express from "express";
import { env } from "./utils/config.ts";
import { connectToDatabase } from "./utils/db.ts";

import mockRouter from "./routes/mock.ts";
import collectionsRouter from "./routes/collections.ts";
import usersRouter from "./routes/users.ts";

const app = express();

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.use(express.json());
app.use("/api/mock", mockRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/users", usersRouter);

//const PORT = 3003;
const start = async (): Promise<void> => {
  console.log(env.DATABASE_URL);
  await connectToDatabase();

  app.listen(env.PORT, () => {
    console.log(`server listening on port ${env.PORT}`);
  });
};

await start();
