import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import router from "./routes/MainRouter.js";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import { commitRepo } from "./controllers/commit.js";
import { pullRepo } from "./controllers/pull.js";
import { pushRepo } from "./controllers/push.js";
import { revertRepo } from "./controllers/revert.js";

// hideBin is a shorthand for process.argv.slice(2).
// argv reads the arguments from the command terminal

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "To start a new server", {}, startServer)
  .command(
    "init",
    "To initialise a new repository",
    {}, // Parameters here are empty because we need to do nothing and just initialize the repo
    initRepo
  )
  .command(
    "add <file>",
    "To add a new file into the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "String",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "To commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Committ message",
        type: "String",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "To push the commits into S3", {}, pushRepo)
  .command("pull", "To pull the file from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "To revert back to the specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "The commitID to revert to",
        type: "String",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need to write atleast 1 command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 8000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGO_URI;

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Mongo DB is connected");
    })
    .catch((err) => {
      console.log("Some error occured", err);
    });

  app.use(cors({ origin: "*" }));

  app.use("/", router);

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  io.on("connection", (socket) => {
    socket.on("Join", (userID) => {
      user = userID;
      console.log("========");
      console.log(user);
      console.log("========");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
