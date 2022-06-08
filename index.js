require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const expressWs = require("express-ws");
const database = require("./database/index.js");
const userController = require("./controllers/user-controller.js");

const app = express();

expressWs(app);

const PORT = process.env.PORT;

app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? "http://metafor.uz"
        : "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.json({ extended: true }));

app.use("/user", require("./routes/user.routes"));

app.ws("/connect", userController.connect);

const start = async () => {
  try {
    // await database.sequelize.sync();

    await database.sequelize.authenticate();

    if (process.env.NODE_ENV === "production") {
      app.use("/", express.static(path.join(__dirname, "client", "build")));
      app.use("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
      });
    }

    app.listen(PORT, () => console.log(`app has been ported on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
