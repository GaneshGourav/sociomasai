const express = require("express");
require("dotenv").config();
const app = express();
const { connection } = require("./db");
const {userRouter} = require("./router/userRouter");
const {postRouter} = require("./router/postRouter")
app.use(express.json())

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: "Welcome to SOCIO-MASAI" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});
app.use("/users",userRouter)
app.use("/posts",postRouter)

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("port is running at 7070");
    console.log("connected to DBS")
  } catch (error) {
    console.log("getting error while connected to DBS");
  }
});
