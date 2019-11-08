const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connect", socket => {
  socket.on("connectRoon", box => {
    socket.join(box);
  });
});

mongoose.connect(
  "mongodb+srv://root:root@cluster0-rkw72.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(require("./route"));

server.listen(process.env.PORT || 3333, () => {
  console.log("SERVER START >>");
});
