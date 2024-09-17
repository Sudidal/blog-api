import express from "express";
import { config } from "dotenv";
import { configPassport } from "./configPassport.js";
import process from "process";
import { baseRouter } from "./routers/baseRouter.js";

config();
configPassport();

const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/", baseRouter);

app.listen(PORT, () => {
  console.log(
    "App listening on port: " +
      PORT +
      "\n\x1b[32m" +
      "http://localhost:" +
      PORT +
      "\x1b[0m"
  );
});
