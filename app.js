import express from "express";
import { config } from "dotenv";
import process from "process";

config();

const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res, next) => {
  res.send("Alhamdullilah, the server works smoothly");
});

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
